import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedPropertiesSection } from '@/components/sections/featured-properties-section';
import { AboutSection } from '@/components/sections/about-section';
import { AiChatAssistant } from '@/components/ai-chat-assistant';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedPropertiesSection />
        <AboutSection />
      </main>
      <Footer />
      <AiChatAssistant />
    </div>
  );
}
