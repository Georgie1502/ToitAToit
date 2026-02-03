import FeatureGrid from '../components/organisms/FeatureGrid';
import Hero from '../components/organisms/Hero';
import PageShell from '../components/templates/PageShell';

const Home = () => {
  return (
    <PageShell>
      <Hero />
      <FeatureGrid />
    </PageShell>
  );
};

export default Home;
