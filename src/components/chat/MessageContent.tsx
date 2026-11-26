import { Fragment } from "react";

/**
 * Pinta las respuestas del asistente con un formato mínimo y seguro
 * (sin HTML incrustado): párrafos, listas con "- " / "• " / "1.", **negrita** y
 * enlaces solo a direcciones permitidas (la web, el repositorio, LinkedIn y el email).
 * Funciona también con texto a medias mientras llega en streaming.
 */
export function MessageContent({ text }: { text: string }) {
  const blocks = toBlocks(text);

  return (
    <div className="space-y-2.5">
      {blocks.map((block, index) =>
        block.type === "p" ? (
          <p key={index}>{renderInline(block.text)}</p>
        ) : (
          <ul key={index} className="space-y-1.5">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-2.5">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-peach" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

type Block = { type: "p"; text: string } | { type: "list"; items: string[] };

const LIST_ITEM = /^\s*(?:[-•*]|\d+[.)])\s+/;

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const rawLine of text.split("\n")) {
    // Los títulos ("## …") se muestran como texto normal
    const line = rawLine.replace(/^\s*#{1,6}\s+/, "").trimEnd();
    if (!line.trim()) continue;

    if (LIST_ITEM.test(line)) {
      const item = line.replace(LIST_ITEM, "");
      const last = blocks.at(-1);
      if (last?.type === "list") last.items.push(item);
      else blocks.push({ type: "list", items: [item] });
    } else {
      blocks.push({ type: "p", text: line.trim() });
    }
  }
  return blocks;
}

/** **negrita** → <strong>. Los asteriscos sueltos (streaming a medias) se ocultan. */
function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-white">
        {linkify(part)}
      </strong>
    ) : (
      <Fragment key={index}>{linkify(part.replace(/\*\*/g, ""))}</Fragment>
    ),
  );
}

/** Solo estas direcciones se convierten en enlaces; el resto se queda como texto */
const ALLOWED_LINKS = [
  /^https:\/\/(www\.)?amoyano\.es(\/[^\s]*)?$/,
  /^https:\/\/github\.com\/aamoyano\/portfolio-ia(\/[^\s]*)?$/,
  /^https:\/\/(www\.)?linkedin\.com\/in\/antonio-alvarez-moyano\/?$/,
  /^aamoyano01@gmail\.com$/,
];
const LINK_CANDIDATE = /(https:\/\/[^\s)]+|aamoyano01@gmail\.com)/g;

function linkify(text: string) {
  return text.split(LINK_CANDIDATE).map((piece, index) => {
    const clean = piece.replace(/[.,;:]+$/, "");
    if (index % 2 === 0 || !ALLOWED_LINKS.some((re) => re.test(clean))) return piece;
    const href = clean.includes("@") ? `mailto:${clean}` : clean;
    return (
      <Fragment key={index}>
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="underline decoration-white/40 underline-offset-2 transition-colors hover:decoration-white"
        >
          {clean.replace(/^https:\/\/(www\.)?/, "")}
        </a>
        {piece.slice(clean.length)}
      </Fragment>
    );
  });
}
