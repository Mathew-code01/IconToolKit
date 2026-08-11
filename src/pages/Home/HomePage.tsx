// src/pages/Home/HomePage.tsx


// src/pages/Home/HomePage.tsx

import HeroSection from "./HeroSection";
import QuickStartSection from "./QuickStartSection";
import ToolsSection from "./ToolsSection";
import PreviewSection from "./PreviewSection";
import FinalCTASection from "./FinalCTASection";

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <QuickStartSection />
      <ToolsSection />
      <PreviewSection />
      <FinalCTASection />
    </div>
  );
}

