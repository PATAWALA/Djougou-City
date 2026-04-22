import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import MainLayout from '../layouts/MainLayout';
import { formatFCFA } from '../utils/formatPrice';
import { PRICES } from '../utils/constants';

// Types de publication supportés par CITransports
type PublicationType = 'depart' | 'fret' | 'alerte' | 'promo';

interface PackDetails {
  prix: number;
  duree: number;
  photos: number;
  premium?: boolean;
  boost?: boolean;
  epingle?: number;
}

const PublicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>(); // ✅ Récupération depuis l'URL
  const [searchParams] = useSearchParams();
  const packId = searchParams.get('pack') || 'standard';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  // Définition des packs pour chaque type
  const packDetails: Record<PublicationType, Record<string, PackDetails>> = {
    depart: {
      basic:   { prix: PRICES.ANNONCE_DEPART || 500, duree: 30, photos: 1 },
      standard:{ prix: PRICES.ANNONCE_STANDARD || 2500, duree: 30, photos: 3, boost: true },
      premium: { prix: PRICES.ANNONCE_PREMIUM || 5000, duree: 30, photos: 5, premium: true, epingle: 7 },
    },
    fret: {
      gratuit: { prix: 0, duree: 30, photos: 1 },
      standard:{ prix: PRICES.ANNONCE_STANDARD || 2500, duree: 30, photos: 3, boost: true },
      premium: { prix: PRICES.ANNONCE_PREMIUM || 5000, duree: 30, photos: 5, premium: true, epingle: 7 },
    },
    alerte: {
  gratuit: { prix: 0, duree: 7, photos: 1 },
  assistance: { prix: PRICES.ALERTE_ASSISTANCE || 2000, duree: 7, photos: 3, boost: true },
  urgence: { prix: PRICES.ALERTE_URGENCE || 5000, duree: 7, photos: 5, premium: true, epingle: 2 },
},
    promo: {
      basic:   { prix: PRICES.BOOST_COUP_DE_POUCE || 1000, duree: 1, photos: 1 },
      standard:{ prix: PRICES.BOOST_ARTICLE || 3000, duree: 3, photos: 1 },
      premium: { prix: PRICES.BOOST_VIRAL || 5000, duree: 7, photos: 1, epingle: 7 },
    },
  };

  // Vérification du type
  const isValidType = (t: string | undefined): t is PublicationType => {
    return t === 'depart' || t === 'fret' || t === 'alerte' || t === 'promo';
  };

  if (!isValidType(type) || !packDetails[type]?.[packId]) {
    return <Navigate to="/publier/moi-meme" replace />;
  }

  const currentPack = packDetails[type][packId];

  // État du formulaire
  const [formData, setFormData] = useState<Record<string, any>>({
    titre: '',
    description: '',
    contact: user?.phone || '',
    localisation: '',
    categorie: type === 'depart' ? 'depart' : type === 'fret' ? 'chargement' : '',
    prix: '',
    destination: '',
    dateDepart: '',
    heureDepart: '',
    places: '',
    typeAlerte: 'accident',
    niveau: 'jaune',
    source: '',
    contenu: '',
    auteur: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const maxPhotos = currentPack.photos;

  const categoriesTransport = [
    { value: 'depart', label: 'Départ de bus/car' },
    { value: 'arrivage', label: 'Arrivage' },
    { value: 'chargement', label: 'Fret / Chargement' },
    { value: 'vente', label: 'Vente (véhicule, pièces)' },
    { value: 'location', label: 'Location (camion, garage)' },
    { value: 'emploi', label: 'Emploi transport' },
  ];

  const typesAlerte = [
    { value: 'meteo', label: 'Météo' },
    { value: 'accident', label: 'Accident' },
    { value: 'controle', label: 'Contrôle routier' },
    { value: 'route', label: 'Route dégradée' },
    { value: 'carburant', label: 'Carburant' },
    { value: 'circulation', label: 'Embouteillage' },
    { value: 'manifestation', label: 'Manifestation' },
  ];

  const niveauxAlerte = [
    { value: 'vert', label: 'Information' },
    { value: 'jaune', label: 'Vigilance' },
    { value: 'orange', label: 'Alerte' },
    { value: 'rouge', label: 'Critique' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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

  const generateFileName = (userId: string, file: File): string => {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${userId}/${timestamp}-${random}.${fileExt}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentPack || !type) {
      navigate('/auth');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const imageUrls: string[] = [];
      for (const file of images) {
        const fileName = generateFileName(user.id, file);
        const { error: uploadError } = await supabase.storage
          .from('publications')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('publications').getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + currentPack.duree);

      const baseData = {
        user_id: user.id,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      let insertData: Record<string, unknown> = { ...baseData };
      let table = 'annonces';

      switch (type) {
        case 'depart':
        case 'fret':
          table = 'annonces';
          insertData = {
            ...insertData,
            titre: formData.titre,
            description: formData.description,
            prix: formData.prix ? parseInt(formData.prix) : null,
            categorie: type === 'depart' ? 'depart' : 'chargement',
            contact: formData.contact,
            localisation: formData.localisation,
            destination: formData.destination,
            date_depart: formData.dateDepart,
            heure_depart: formData.heureDepart,
            places: formData.places ? parseInt(formData.places) : null,
            images: imageUrls,
            est_premium: currentPack.premium || false,
            est_boosted: currentPack.boost || false,
          };
          break;

        case 'alerte':
          table = 'alertes';
          insertData = {
            ...insertData,
            titre: formData.titre,
            description: formData.description,
            type: formData.typeAlerte,
            niveau: formData.niveau,
            localisation: formData.localisation,
            source: formData.source || 'Utilisateur',
            estActive: true,
            images: imageUrls,
          };
          break;

        case 'promo':
          table = 'articles';
          insertData = {
            ...insertData,
            titre: formData.titre,
            contenu: formData.contenu || formData.description,
            auteur: formData.auteur || user.email?.split('@')[0] || 'CITransports',
            est_boosted: true,
            montant_boost: currentPack.prix,
            image: imageUrls[0] || null,
          };
          break;
      }

      const { error: insertError } = await supabase.from(table).insert(insertData);
      if (insertError) throw insertError;

      navigate('/mon-espace?success=1');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'depart': return 'Publier un départ de bus/car';
      case 'fret': return 'Publier une annonce de fret';
      case 'alerte': return 'Signaler une alerte trafic';
      case 'promo': return 'Booster une promotion';
      default: return 'Publier';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-bold text-dark mb-6">
          {getTitle()}
          <span className="ml-3 text-sm font-normal text-muted">
            Pack {packId} • {currentPack.prix === 0 ? 'Gratuit' : formatFCFA(currentPack.prix)}
          </span>
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block font-medium text-dark mb-2">Titre *</label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={e => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
              placeholder={type === 'depart' ? 'Ex: Abidjan → Bouaké - Départ ce vendredi' : 'Titre'}
            />
          </div>

          {/* Champs spécifiques DEPART / FRET */}
          {(type === 'depart' || type === 'fret') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark mb-2">Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={e => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  >
                    {categoriesTransport.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-dark mb-2">Prix (FCFA)</label>
                  <input
                    type="number"
                    value={formData.prix || ''}
                    onChange={e => setFormData({ ...formData, prix: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                    placeholder={type === 'depart' ? 'Ex: 3000' : 'Prix du fret'}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-dark mb-2">Destination / Trajet *</label>
                <input
                  type="text"
                  required
                  value={formData.destination || ''}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: Abidjan → Bouaké"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark mb-2">Date de départ</label>
                  <input
                    type="date"
                    value={formData.dateDepart || ''}
                    onChange={e => setFormData({ ...formData, dateDepart: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark mb-2">Heure de départ</label>
                  <input
                    type="time"
                    value={formData.heureDepart || ''}
                    onChange={e => setFormData({ ...formData, heureDepart: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  />
                </div>
              </div>

              {type === 'depart' && (
                <div>
                  <label className="block font-medium text-dark mb-2">Places disponibles</label>
                  <input
                    type="number"
                    value={formData.places || ''}
                    onChange={e => setFormData({ ...formData, places: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                    placeholder="Ex: 30"
                  />
                </div>
              )}
            </>
          )}

          {/* Champs spécifiques ALERTE */}
          {type === 'alerte' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark mb-2">Type d'alerte *</label>
                  <select
                    value={formData.typeAlerte}
                    onChange={e => setFormData({ ...formData, typeAlerte: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                    required
                  >
                    {typesAlerte.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-dark mb-2">Niveau *</label>
                  <select
                    value={formData.niveau}
                    onChange={e => setFormData({ ...formData, niveau: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                    required
                  >
                    {niveauxAlerte.map(n => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-dark mb-2">Source (optionnel)</label>
                <input
                  type="text"
                  value={formData.source || ''}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: OSER, Police, Témoin..."
                />
              </div>
            </>
          )}

          {/* Description / Contenu */}
          {type !== 'promo' ? (
            <div>
              <label className="block font-medium text-dark mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none resize-none"
                placeholder="Détails supplémentaires..."
              />
            </div>
          ) : (
            <div>
              <label className="block font-medium text-dark mb-2">Contenu de la promo *</label>
              <textarea
                required
                rows={6}
                value={formData.contenu || ''}
                onChange={e => setFormData({ ...formData, contenu: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none resize-none"
                placeholder="Décrivez votre offre promotionnelle..."
              />
            </div>
          )}

          {/* Contact et Localisation (sauf promo) */}
          {type !== 'promo' && (
            <>
              <div>
                <label className="block font-medium text-dark mb-2">Contact (téléphone) *</label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="05 74 36 63 52"
                />
              </div>
              <div>
                <label className="block font-medium text-dark mb-2">Localisation *</label>
                <input
                  type="text"
                  required
                  value={formData.localisation || ''}
                  onChange={e => setFormData({ ...formData, localisation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: Gare de Yopougon, Abidjan"
                />
              </div>
            </>
          )}

          {/* Auteur pour promo */}
          {type === 'promo' && (
            <div>
              <label className="block font-medium text-dark mb-2">Auteur (compagnie)</label>
              <input
                type="text"
                value={formData.auteur || ''}
                onChange={e => setFormData({ ...formData, auteur: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                placeholder="CITransports"
              />
            </div>
          )}

          {/* Upload d'images */}
          <div>
            <label className="block font-medium text-dark mb-2">
              Photos ({previews.length}/{maxPhotos})
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
              {previews.length < maxPhotos && (
                <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 text-muted" />
                  <span className="text-xs text-muted mt-1">Ajouter</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={maxPhotos > 1}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-background p-4 rounded-xl">
            <h4 className="font-semibold text-dark mb-2">Récapitulatif</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>Type: {type}</li>
              <li>Pack: {packId} ({currentPack.prix === 0 ? 'Gratuit' : formatFCFA(currentPack.prix)})</li>
              <li>Durée: {currentPack.duree} jours</li>
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
            En publiant, vous acceptez nos conditions d'utilisation.
          </p>
        </form>
      </div>
    </MainLayout>
  );
};

export default PublicationForm;