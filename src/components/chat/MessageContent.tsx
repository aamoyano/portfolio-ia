import { Fragment } from "react";

/**
 * Pinta las respuestas del asistente con un formato mínimo y seguro
 * (sin HTML incrustado): párrafos, listas con "- " / "• " / "1." y **negrita**.
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
        {part}
      </strong>
    ) : (
      <Fragment key={index}>{part.replace(/\*\*/g, "")}</Fragment>
    ),
  );
}
