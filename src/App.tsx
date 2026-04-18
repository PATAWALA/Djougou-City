import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Actualites from './pages/Actualites';
import Annonces from './pages/PetitesAnnonces';
import Necrologie from './pages/Necrologie';
import Premium from './pages/Premium';
import Contact from './pages/Contact';
import APropos from './pages/APropos';
import FaireUnDon from './pages/FaireUnDon';
import Publier from './pages/Publier';
import PublierMoiMeme from './pages/PublierMoiMeme';
import FairePublier from './pages/FairePublier';
import PackAnnonce from './pages/PackAnnonce';
import Auth from './pages/Auth';
import PublicationForm from './pages/PublicationForm';
import MonEspace from './pages/MonEspace';
import Paiement from './pages/Paiement';
import Dashboard from './pages/Dashboard'; // <-- AJOUTEZ CET IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/annonces" element={<Annonces />} />
        <Route path="/necrologie" element={<Necrologie />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/faire-un-don" element={<FaireUnDon />} />
        <Route path="/publier" element={<Publier />} />
        <Route path="/publier/moi-meme" element={<PublierMoiMeme />} />
        <Route path="/publier/faire-publier" element={<FairePublier />} />
        <Route path="/publier/annonce/pack" element={<PackAnnonce />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/publier/:type/form" element={<PublicationForm />} />
        <Route path="/mon-espace" element={<MonEspace />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* <-- AJOUTEZ CETTE ROUTE */}
      </Routes>
    </Router>
  );
}

export default App;