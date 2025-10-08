'use client';

import FeaturesSection from '@/components/FeatureSection';
import { StartSection } from '@/components/StartSection';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
      <Header />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <StartSection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
}