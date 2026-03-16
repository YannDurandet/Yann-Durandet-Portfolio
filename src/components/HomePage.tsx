import { AnimatePresence } from "motion/react";
import { useState } from "react";
import "../lib/i18n";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { About } from "./About";
import { Projects } from "./Projects";
import { Services } from "./Services";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { LoadingScreen } from "./LoadingScreen";
import { Altimeter } from "./ui/Altimeter";
import { CustomCursor } from "./ui/CustomCursor";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Skip to content */}
      <a href="#hero" className="skip-to-content">
        Skip to main content
      </a>

      {/* Custom cursor */}
      <CustomCursor />

      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loader"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={
          isLoading
            ? "opacity-0 h-0 overflow-hidden"
            : "opacity-100 transition-opacity duration-700"
        }
      >
        <div className="min-h-screen relative">
          <Navigation />
          <Altimeter />
          {/* Global Trail Line */}
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-text-primary/10 z-0 hidden md:block" />
          <Hero />
          <About />
          <Projects />
          <Services />
          <Contact />
          <Footer />
        </div>
      </div>
    </>
  );
}
