import CinematicPortfolio from './components/cinematic/CinematicPortfolio';
import LightingStudio from './components/LightingStudio';
import ProductPhotography from './components/ProductPhotography';
import EquipmentSection from './components/EquipmentSection';
import Footer from './components/Footer';
import TrustedBy from './components/TrustedBy';
import Navigation from './components/Navigation';
import './App.css';

export default function App() {
  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <Navigation />
      <main className="pt-16">
        <CinematicPortfolio />
        <LightingStudio />
        <ProductPhotography />
        <EquipmentSection />
      </main>
      <TrustedBy />
      <Footer />
    </>
  );
}
