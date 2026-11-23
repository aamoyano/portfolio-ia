import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";
import { publicFileExists } from "@/lib/assets";

export default function Home() {
  const content = getContent();
  const { cv } = siteConfig.assets;
  const cvHref = publicFileExists(cv) ? cv : null;

  return (
    <>
      <Navbar
        nav={content.nav}
        initials={siteConfig.initials}
        cvHref={cvHref}
        cvFileName={cv.split("/").pop() ?? "cv.pdf"}
      />
      <main>
        <Hero content={content} cvHref={cvHref} />
      </main>
    </>
  );
}
