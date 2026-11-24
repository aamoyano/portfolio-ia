import { Background } from "@/components/Background";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";
import { publicFileExists } from "@/lib/assets";
import { getChatProvider } from "@/lib/chat/providers";

export default function Home() {
  const content = getContent();
  const { cv, photo } = siteConfig.assets;

  // Archivos que añadirás tú en /public: si no existen, no se muestran
  const cvHref = publicFileExists(cv) ? cv : null;
  const photoSrc = publicFileExists(photo) ? photo : null;
  // El chat solo se activa si está encendido en profile.ts y hay una API key (OpenRouter o Anthropic)
  const chatEnabled = siteConfig.chatEnabled && getChatProvider() !== null;
  const projects = content.projects.items.map((project) => ({
    ...project,
    imageSrc: publicFileExists(project.image) ? project.image : null,
  }));

  return (
    <>
      <Background />
      <a
        href="#sobre-mi"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-bg"
      >
        {content.a11y.skipToContent}
      </a>
      <Navbar
        nav={content.nav}
        a11y={content.a11y}
        initials={siteConfig.initials}
        cvHref={cvHref}
        cvFileName={cv.split("/").pop() ?? "cv.pdf"}
      />
      <main className="overflow-x-clip">
        <Hero content={content} chatEnabled={chatEnabled} />
        <About about={content.about} photoSrc={photoSrc} />
        <Projects projects={content.projects} a11y={content.a11y} items={projects} />
        <Stack stack={content.stack} />
        <Timeline timeline={content.timeline} type="work" id="experiencia" />
        <Timeline timeline={content.timeline} type="education" id="formacion" />
        <Contact contact={content.contact} />
      </main>
      <Footer footer={content.footer} />
    </>
  );
}
