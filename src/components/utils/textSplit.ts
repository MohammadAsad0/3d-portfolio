type SplitTarget = string | HTMLElement | Array<string | HTMLElement>;

interface SplitConfig {
  type?: string;
  linesClass?: string;
}

interface OriginalMarkup {
  element: HTMLElement;
  html: string;
}

export class TextSplit {
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  private originals: OriginalMarkup[] = [];

  constructor(target: SplitTarget, config: SplitConfig = {}) {
    const elements = resolveElements(target);
    const typeSet = new Set((config.type ?? "").split(",").map((value) => value.trim()));
    const splitByChars = typeSet.has("chars");
    const splitByWords = !splitByChars && typeSet.has("words");

    elements.forEach((element) => {
      this.originals.push({ element, html: element.innerHTML });

      if (splitByChars) {
        this.chars.push(...splitElementText(element, "chars"));
        return;
      }

      if (splitByWords) {
        this.words.push(...splitElementText(element, "words"));
      }
    });
  }

  revert() {
    this.originals.forEach(({ element, html }) => {
      element.innerHTML = html;
    });

    this.originals = [];
    this.chars = [];
    this.words = [];
  }
}

function resolveElements(target: SplitTarget): HTMLElement[] {
  const values = Array.isArray(target) ? target : [target];

  return values.flatMap((value) => {
    if (typeof value === "string") {
      return Array.from(document.querySelectorAll<HTMLElement>(value));
    }

    return value instanceof HTMLElement ? [value] : [];
  });
}

function splitElementText(element: HTMLElement, mode: "chars" | "words") {
  const textNodes = collectTextNodes(element);
  const segments: HTMLElement[] = [];

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue ?? "";
    if (!text) {
      return;
    }

    const fragment = document.createDocumentFragment();
    const parts = mode === "chars" ? splitChars(text) : splitWords(text);

    parts.forEach((part) => {
      if (part.type === "space") {
        fragment.appendChild(document.createTextNode(part.value));
        return;
      }

      const span = document.createElement("span");
      span.textContent = part.value;
      span.style.display = "inline-block";
      span.style.whiteSpace = "pre";
      fragment.appendChild(span);
      segments.push(span);
    });

    textNode.parentNode?.replaceChild(fragment, textNode);
  });

  return segments;
}

function collectTextNodes(element: HTMLElement) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;
    if (textNode.parentElement && textNode.nodeValue) {
      textNodes.push(textNode);
    }
    currentNode = walker.nextNode();
  }

  return textNodes;
}

function splitChars(text: string) {
  return Array.from(text).map((value) => ({
    type: /\s/.test(value) ? "space" : "segment",
    value,
  }));
}

function splitWords(text: string) {
  return text.split(/(\s+)/).filter(Boolean).map((value) => ({
    type: /^\s+$/.test(value) ? "space" : "segment",
    value,
  }));
}