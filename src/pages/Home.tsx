import Hero from '../components/sections/Hero';
import CityGlanceSection from '../components/home/CityGlanceSection';
import HistorySection from '../components/home/HistorySection';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import LeadershipSection from '../components/home/LeadershipSection';
import ContactSection from '../components/home/ContactSection';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="A free, open-source community portal for residents of Dasmariñas City, Cavite. Access government services, officials, and public information."
        keywords="dasmariñas, dasmarinas, cavite, city government, services, public services, CALABARZON, philippines, paru-paro festival"
      />
      <main className="flex-grow">
        <Hero />
        <CityGlanceSection />
        <HistorySection />
        <ServicesSection />
        <GovernmentActivitySection />
        <LeadershipSection />
        <ContactSection />
      </main>
    </>
  );
};

export default Home;
