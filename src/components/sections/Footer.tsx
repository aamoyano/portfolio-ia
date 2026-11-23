import type { Content } from "@/data/types";
import { Container } from "../ui/Container";
import { SocialLinks } from "../ui/SocialLinks";

export function Footer({ footer }: { footer: Content["footer"] }) {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-muted">{footer.text}</p>
        <SocialLinks />
      </Container>
    </footer>
  );
}
