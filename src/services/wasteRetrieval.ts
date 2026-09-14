import { WASTE_ITEMS, type WasteItem } from "@/data/wasteKnowledgeBase";

function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface RetrievalResult {
  item: WasteItem;
  score: number;
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let row = 1; row <= a.length; row += 1) {
    const current = new Array<number>(b.length + 1).fill(0);
    current[0] = row;

    for (let column = 1; column <= b.length; column += 1) {
      const cost = a[row - 1] === b[column - 1] ? 0 : 1;

      current[column] = Math.min(
        (current[column - 1] ?? 0) + 1,
        (previous[column] ?? 0) + 1,
        (previous[column - 1] ?? 0) + cost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return 1 - (previous[b.length] ?? 0) / Math.max(a.length, b.length);
}

function scoreItem(query: string, item: WasteItem): number {
  const tokens = query.split(" ").filter(Boolean);

  const candidates = [item.name, ...item.aliases].map(normalizeQuery);

  let score = 0;

  for (const candidate of candidates) {
    if (query === candidate) {
      score = Math.max(score, 1);
    } else if (query.includes(candidate) || candidate.includes(query)) {
      score = Math.max(score, 0.88);
    } else {
      score = Math.max(score, similarity(query, candidate) * 0.8);
    }
  }

  for (const keyword of item.keywords.map(normalizeQuery)) {
    if (query.includes(keyword)) {
      score = Math.max(score, 0.76);
    }

    if (tokens.some((token) => token.length > 3 && similarity(token, keyword) > 0.86)) {
      score = Math.max(score, 0.7);
    }
  }

  return score;
}

export function retrieveWasteItems(query: string, limit = 3): RetrievalResult[] {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return [];
  }

  return WASTE_ITEMS.map((item) => ({
    item,
    score: scoreItem(normalizedQuery, item),
  }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
