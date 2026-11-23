import type { Content } from "@/data/types";
import { Container } from "../ui/Container";

export function Footer({ footer }: { footer: Content["footer"] }) {
  return (
    <footer>
      <Container className="pb-8 text-center">
        <p className="text-sm text-muted">{footer.text}</p>
      </Container>
    </footer>
  );
}
