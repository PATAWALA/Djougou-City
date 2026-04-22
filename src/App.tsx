import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Actualites from './pages/Actualites';
import Annonces from './pages/PetitesAnnonces';
import AlertesTrafic from './pages/Necrologie';
import AlertePacks from './pages/NecrologiePacks';
import Premium from './pages/Premium';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import APropos from './pages/APropos';
import AnnonceDetail from './pages/AnnonceDetail';
import PublierMoiMeme from './pages/PublierMoiMeme';
import FairePublier from './pages/FairePublier';
import ProtectedRoute from './components/ProtectedRoute';
import ChoixParcours from './pages/ChoixParcours';
import Auth from './pages/Auth';
import PublicationForm from './pages/PublicationForm';
import MonEspace from './pages/MonEspace';
import Paiement from './pages/Paiement';
import Dashboard from './pages/Dashboard';
import AnnoncePacks from './pages/AnnoncePacks';
import ArticlePacks from './pages/ArticlePacks';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ArticleDetail />} />
        <Route path="/annonces/:id" element={<AnnonceDetail />} />
        <Route path="/annonces" element={<Annonces />} />
        <Route path="/alertes" element={<AlertesTrafic />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/publier/moi-meme" element={<PublierMoiMeme />} />
        <Route path="/publier/faire-publier" element={<FairePublier />} />
        <Route path="/publier" element={<ChoixParcours />} />
        
        {/* Packs */}
        <Route path="/publier/annonce/packs" element={<AnnoncePacks />} />
        <Route path="/publier/article/packs" element={<ArticlePacks />} />
        <Route path="/publier/alerte/packs" element={<AlertePacks />} />


        <Route path="/auth" element={<Auth />} />
        <Route path="/publier/:type/form" element={<PublicationForm />} />
        <Route path="/mon-espace" element={<ProtectedRoute><MonEspace /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/paiement" element={<Paiement />} />
      </Routes>
    </Router>
  );
}

export default App;