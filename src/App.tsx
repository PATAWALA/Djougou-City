import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Actualites from './pages/Actualites';
import Annonces from './pages/PetitesAnnonces';
import Necrologie from './pages/Necrologie';
import Premium from './pages/Premium';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop'
import APropos from './pages/APropos';
import FaireUnDon from './pages/FaireUnDon';
import PublierMoiMeme from './pages/PublierMoiMeme';
import FairePublier from './pages/FairePublier';
import ChoixParcours from './pages/ChoixParcours';
import PackAnnonce from './pages/PackAnnonce';
import Auth from './pages/Auth';
import PublicationForm from './pages/PublicationForm';
import MonEspace from './pages/MonEspace';
import Paiement from './pages/Paiement';
import Dashboard from './pages/Dashboard';

// Nouvelles pages de packs spécifiques
import AnnoncePacks from './pages/AnnoncePacks';
import NecrologiePacks from './pages/NecrologiePacks';
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
        <Route path="/annonces" element={<Annonces />} />
        <Route path="/necrologie" element={<Necrologie />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/faire-un-don" element={<FaireUnDon />} />
        <Route path="/publier/moi-meme" element={<PublierMoiMeme />} />
        <Route path="/publier/faire-publier" element={<FairePublier />} />
        <Route path="/publier" element={<ChoixParcours />} />
        <Route path="/publier/annonce/pack" element={<PackAnnonce />} />
        
        {/* Nouvelles routes pour les packs depuis MonEspace */}
        <Route path="/publier/annonce/packs" element={<AnnoncePacks />} />
        <Route path="/publier/necrologie/packs" element={<NecrologiePacks />} />
        <Route path="/publier/article/packs" element={<ArticlePacks />} />
        
        <Route path="/auth" element={<Auth />} />
        <Route path="/publier/:type/form" element={<PublicationForm />} />
        <Route path="/mon-espace" element={<MonEspace />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;