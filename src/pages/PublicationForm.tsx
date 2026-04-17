import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, Plus, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MainLayout from '../layouts/MainLayout';
import { formatFCFA } from '../utils/formatPrice';

const PublicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'annonce' | 'necrologie' | 'article';
  const packId = searchParams.get('pack') || 'standard';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  // Vérifier l'authentification
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  // Définition des packs avec leurs caractéristiques
  const packDetails: Record<string, any> = {
    annonce: {
      basic: { prix: 500, duree: 30, photos: 1, premium: false },
      standard: { prix: 1000, duree: 30, photos: 3, premium: false, remontee: true },
      premium: { prix: 2500, duree: 30, photos: 5, premium: true, miseEnAvant: 15 }
    },
    necrologie: {
      simple: { prix: 1000, photos: 1, messageLong: false },
      hommage: { prix: 2500, photos: 3, messageLong: true },
      ceremonie: { prix: 5000, photos: 5, messageLong: true, epingle: 7 }
    },
    article: {
      coupdepouce: { prix: 1000, boost: 'remontee' },
      visibilite: { prix: 3000, boost: 'epingle3' },
      viral: { prix: 5000, boost: 'epingle7', partageFacebook: true }
    }
  };

  const currentPack = packDetails[type]?.[packId] || {};

  // États du formulaire communs
  const [formData, setFormData] = useState<Record<string, any>>({
    titre: '',
    description: '',
    contact: user?.phone || '',
    localisation: '',
    // Champs spécifiques seront ajoutés selon le type
  });

  // Images (pour annonce et nécrologie)
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxPhotos = currentPack.photos || 1;
    if (images.length + files.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photo(s) autorisée(s) avec ce pack.`);
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setError('');
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Upload des images vers Supabase Storage
      const imageUrls: string[] = [];
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('publications')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('publications').getPublicUrl(fileName);
        imageUrls.push(publicUrl);
      }

      // 2. Calcul de la date d'expiration
      const duree = currentPack.duree || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + duree);

      // 3. Insertion dans la table correspondante
      let table: 'annonces' | 'necrologies' | 'articles' = type + 's';
      const insertData: any = {
        user_id: user.id,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      switch (type) {
        case 'annonce':
          Object.assign(insertData, {
            titre: formData.titre,
            description: formData.description,
            prix: parseInt(formData.prix) || 0,
            categorie: formData.categorie,
            contact: formData.contact,
            localisation: formData.localisation,
            images: imageUrls,
            est_premium: currentPack.premium || false,
          });
          break;
        case 'necrologie':
          Object.assign(insertData, {
            nom_defunt: formData.nom_defunt,
            date_deces: formData.date_deces,
            date_enterrement: formData.date_enterrement,
            lieu_enterrement: formData.lieu_enterrement,
            famille: formData.famille,
            contact: formData.contact,
            message: formData.message,
            photo: imageUrls[0] || null,
          });
          break;
        case 'article':
          Object.assign(insertData, {
            titre: formData.titre,
            contenu: formData.contenu,
            auteur: formData.auteur || 'Anonyme',
            est_boosted: true,
            montant_boost: currentPack.prix,
          });
          break;
      }

      const { error: insertError } = await supabase.from(table).insert(insertData);
      if (insertError) throw insertError;

      // 4. Enregistrer l'achat du pack (optionnel)
      // ...

      // Redirection vers espace utilisateur
      navigate('/mon-espace?success=1');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!type || !packId) {
    return (
      <MainLayout>
        <div className="text-center py-20">Type de publication non spécifié.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-dark mb-6">
          Publier une {type === 'annonce' ? 'petite annonce' : type === 'necrologie' ? 'avis de décès' : 'article boosté'}
          <span className="ml-3 text-sm font-normal text-muted">
            Pack {packId} • {formatFCFA(currentPack.prix)}
          </span>
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champs communs */}
          <div>
            <label className="block font-medium text-dark mb-2">Titre *</label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={e => setFormData({...formData, titre: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
              placeholder={type === 'annonce' ? 'Ex: Vends moto Bajaj Boxer' : 'Titre de l\'annonce'}
            />
          </div>

          {/* Champs spécifiques selon le type */}
          {type === 'annonce' && (
            <>
              <div>
                <label className="block font-medium text-dark mb-2">Prix (FCFA)</label>
                <input
                  type="number"
                  value={formData.prix || ''}
                  onChange={e => setFormData({...formData, prix: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: 450000"
                />
              </div>
              <div>
                <label className="block font-medium text-dark mb-2">Catégorie</label>
                <select
                  value={formData.categorie || 'vente'}
                  onChange={e => setFormData({...formData, categorie: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                >
                  <option value="vente">Vente</option>
                  <option value="location">Location</option>
                  <option value="service">Service</option>
                  <option value="emploi">Emploi</option>
                </select>
              </div>
            </>
          )}

          {type === 'necrologie' && (
            <>
              <div>
                <label className="block font-medium text-dark mb-2">Nom du défunt *</label>
                <input
                  type="text"
                  required
                  value={formData.nom_defunt || ''}
                  onChange={e => setFormData({...formData, nom_defunt: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark mb-2">Date de décès</label>
                  <input
                    type="date"
                    value={formData.date_deces || ''}
                    onChange={e => setFormData({...formData, date_deces: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark mb-2">Date d'enterrement</label>
                  <input
                    type="date"
                    value={formData.date_enterrement || ''}
                    onChange={e => setFormData({...formData, date_enterrement: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-dark mb-2">Lieu d'enterrement</label>
                <input
                  type="text"
                  value={formData.lieu_enterrement || ''}
                  onChange={e => setFormData({...formData, lieu_enterrement: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-dark mb-2">Famille</label>
                <input
                  type="text"
                  value={formData.famille || ''}
                  onChange={e => setFormData({...formData, famille: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                />
              </div>
            </>
          )}

          {type === 'article' && (
            <div>
              <label className="block font-medium text-dark mb-2">Contenu de l'article *</label>
              <textarea
                required
                rows={6}
                value={formData.contenu || ''}
                onChange={e => setFormData({...formData, contenu: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none resize-none"
              />
            </div>
          )}

          {/* Description / Message */}
          {type !== 'article' && (
            <div>
              <label className="block font-medium text-dark mb-2">
                {type === 'annonce' ? 'Description' : 'Message de condoléances / informations'}
              </label>
              <textarea
                required={type === 'annonce'}
                rows={4}
                value={formData.description || formData.message || ''}
                onChange={e => setFormData({...formData, [type === 'annonce' ? 'description' : 'message']: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none resize-none"
              />
            </div>
          )}

          {/* Contact */}
          <div>
            <label className="block font-medium text-dark mb-2">Contact (téléphone)</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
              placeholder="97 12 34 56"
            />
          </div>

          {type !== 'article' && (
            <>
              <div>
                <label className="block font-medium text-dark mb-2">Localisation</label>
                <input
                  type="text"
                  value={formData.localisation || ''}
                  onChange={e => setFormData({...formData, localisation: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: Quartier Zongo, Djougou"
                />
              </div>

              {/* Upload d'images */}
              <div>
                <label className="block font-medium text-dark mb-2">
                  Photos ({previews.length}/{currentPack.photos || 1})
                </label>
                <div className="flex flex-wrap gap-3">
                  {previews.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {previews.length < (currentPack.photos || 1) && (
                    <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-6 h-6 text-muted" />
                      <span className="text-xs text-muted mt-1">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Résumé du pack */}
          <div className="bg-background p-4 rounded-xl">
            <h4 className="font-semibold text-dark mb-2">Récapitulatif de votre publication</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>Type: {type}</li>
              <li>Pack: {packId} ({formatFCFA(currentPack.prix)})</li>
              <li>Durée de publication: {currentPack.duree || 30} jours</li>
              {currentPack.premium && <li>Badge Premium inclus</li>}
              {currentPack.epingle && <li>Épinglé {currentPack.epingle} jours</li>}
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Publication en cours...' : 'Publier maintenant'}
            <Check className="w-5 h-5" />
          </button>

          <p className="text-xs text-muted text-center">
            En publiant, vous acceptez nos conditions d'utilisation. Votre annonce sera visible après validation rapide.
          </p>
        </form>
      </div>
    </MainLayout>
  );
};

export default PublicationForm;