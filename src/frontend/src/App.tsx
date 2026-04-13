import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import { MaskReveal } from "./components/MaskReveal";
import { AboutSection } from "./pages/AboutSection";
import { ContactSection } from "./pages/ContactSection";
import { HeroSection } from "./pages/HeroSection";
import { ProjectsSection } from "./pages/ProjectsSection";
import { SkillsSection } from "./pages/SkillsSection";

export default function App() {
  const [maskVisible, setMaskVisible] = useState(true);

  return (
    <>
      <Toaster position="bottom-right" theme="dark" richColors />
      <AnimatePresence>
        {maskVisible && <MaskReveal onComplete={() => setMaskVisible(false)} />}
      </AnimatePresence>
      <Layout>
        <HeroSection maskDone={!maskVisible} />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </Layout>
    </>
  );
}
