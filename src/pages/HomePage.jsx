import { lazy, Suspense } from 'react';
import CinematicPortfolio from '../components/cinematic/CinematicPortfolio';
import ProductPhotography from '../components/ProductPhotography';

const LightingStudio = lazy(() => import('../components/LightingStudio'));
const EquipmentSection = lazy(() => import('../components/EquipmentSection'));

function Pending({ label }) {
  return (
    <section className="lazy-slot" aria-live="polite">
      {label}
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <CinematicPortfolio />
      <Suspense fallback={<Pending label="Loading the lighting studio" />}>
        <LightingStudio />
      </Suspense>
      <ProductPhotography />
      <Suspense fallback={<Pending label="Loading the kit" />}>
        <EquipmentSection />
      </Suspense>
    </>
  );
}
