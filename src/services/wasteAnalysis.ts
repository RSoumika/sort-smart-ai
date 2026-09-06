/**
 * Local, AI-ready waste analysis service.
 *
 * Pipeline: normalize -> identify object/material -> infer disposal properties
 * -> combine with curated guidance -> return a structured recommendation.
 * The knowledge base is evidence, not a whitelist: unfamiliar descriptions can
 * still be classified through material and characteristic rules.
 */
import {
  CATEGORIES,
  WASTE_ITEMS,
  type Confidence,
  type WasteCategory,
  type WasteItem,
} from "@/data/wasteKnowledgeBase";

export interface AnalysisResult {
  itemName: string;
  material: string;
  category: WasteCategory;
  categoryLabel: string;
  recommendedAction: string;
  specialHandling: string | null;
  explanation: string;
  confidence: Confidence;
  requiresVerification: boolean;
  clarificationQuestion: string | null;
  matchedItemId: string | null;
  source: "local-knowledge-base" | "local-material-inference";
  inputType: "text" | "image";
}

interface InferenceRule {
  name: string;
  patterns: RegExp[];
  material: string;
  category: WasteCategory;
  action: string;
  handling: string | null;
  explanation: string;
  confidence: Confidence;
  verify?: boolean;
}

export function normalizeInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(a|an|the|my|some|this|that|of|that does not work|that doesn t work)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RULES: InferenceRule[] = [
  {
    name: "Battery",
    patterns: [/\b(batter(?:y|ies)|power cell|aa|aaa)\b/],
    material: "Battery containing metals and chemical electrolyte",
    category: "hazardous",
    action: "Take it to an authorized battery collection point or e-waste facility.",
    handling: "Do not place batteries in household bins. Tape exposed terminals where local guidance recommends it, and isolate damaged or swollen batteries.",
    explanation: "Batteries can leak hazardous substances and lithium cells can start fires during collection or processing.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Medicine",
    patterns: [/\b(medicine|medication|tablet|pill|pharmaceutical|expired drug|syringe|medical waste)\b/],
    material: "Pharmaceutical or medical product",
    category: "hazardous",
    action: "Use an authorized medicine take-back, pharmacy collection, or household hazardous-waste program where available.",
    handling: "Do not flush medicines or place sharps loose in household waste. Follow official local guidance.",
    explanation: "Medicines can affect people, wildlife, and water systems when discarded through ordinary waste or drains.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Paint or chemical",
    patterns: [/\b(paint|varnish|solvent|thinner|pesticide|herbicide|bleach|chemical|motor oil)\b/],
    material: "Chemical product or contaminated container",
    category: "hazardous",
    action: "Take it to an authorized household hazardous-waste collection point.",
    handling: "Keep it sealed in its original container when possible. Do not pour it into drains or mix it with other chemicals.",
    explanation: "Chemical residues and contaminated packaging require controlled handling even when the container appears empty.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Fluorescent lamp",
    patterns: [/\b(fluorescent|cfl|tube light|fluorescent tube)\b/],
    material: "Glass lamp with electronic components and possible mercury",
    category: "hazardous",
    action: "Take it to an authorized lamp, bulb, or hazardous-waste collection point.",
    handling: "Handle without breaking it; fluorescent lamps may contain a small amount of mercury. Check official local guidance if broken.",
    explanation: "Fluorescent lighting needs controlled recovery to keep mercury and electronic components out of ordinary waste.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Light bulb",
    patterns: [/\b(light bulb|bulb|lamp)\b/],
    material: "Glass and metal; the internal technology is not specified",
    category: "hazardous",
    action: "Keep it separate and check a local lamp or bulb collection route; the correct method depends on whether it is LED, incandescent, halogen, or fluorescent.",
    handling: "Handle carefully and do not place a broken bulb loose in a bin. Fluorescent/CFL bulbs require authorized collection because they may contain mercury.",
    explanation: "Different bulb technologies contain different components, so identifying the bulb type is important; a dedicated collection route is the safest general recommendation.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Cooking oil",
    patterns: [/\b(cooking|vegetable|frying) oil\b/, /\bused oil\b/],
    material: "Liquid cooking oil",
    category: "hazardous",
    action: "Cool it, collect it in a sealed container, and use a local cooking-oil collection method where available.",
    handling: "Do not pour oil down sinks, toilets, or storm drains.",
    explanation: "Cooking oil can block pipes and pollute waterways; some collection programs recover it for reuse or fuel.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Ink cartridge",
    patterns: [/\b(ink|toner) cartridge\b/],
    material: "Plastic cartridge with residual ink or toner",
    category: "hazardous",
    action: "Use a manufacturer take-back, office-supply drop-off, or authorized special-waste collection route.",
    handling: "Keep the cartridge intact and avoid releasing residual ink or toner.",
    explanation: "Cartridges combine recoverable plastic and electronics with residues that ordinary recycling is not designed to process.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Electronic device",
    patterns: [/\b(laptop|computer|keyboard|mouse|phone|mobile|tablet|charger|charging cable|usb cable|cable|earphones?|earbuds?|headphones?|electronic|appliance|circuit board|power brick|adapter)\b/],
    material: "Electronic components, metals, and plastic",
    category: "ewaste",
    action: "Use an authorized e-waste collection point, retailer take-back, or certified electronics recycler.",
    handling: "Do not place it in ordinary household waste. Remove personal data from data-bearing devices and flag any damaged battery at drop-off.",
    explanation: "Electronics contain recoverable materials and components that need dedicated processing; many also contain batteries or sensitive data.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Broken glass",
    patterns: [/\b(broken|shattered|sharp) glass\b/],
    material: "Broken glass",
    category: "glass",
    action: "Keep it out of ordinary container-glass recycling unless your local program explicitly accepts broken glass; follow local disposal guidance.",
    handling: "Wrap or place sharp pieces in a rigid, clearly marked container so they cannot injure handlers.",
    explanation: "Broken glass is an injury risk and may not be accepted with bottles and jars, even though both are made of glass.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Ceramic",
    patterns: [/\b(ceramic|porcelain|crockery|mug|plate|dish)\b/],
    material: "Ceramic or porcelain",
    category: "general",
    action: "Reuse or donate it if intact; otherwise follow local general-waste or specialized construction-material guidance.",
    handling: "Wrap broken edges securely to protect waste handlers.",
    explanation: "Ceramic melts at a different temperature from container glass and is generally not accepted in ordinary glass recycling.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Sanitary waste",
    patterns: [/\b(diaper|nappy|sanitary pad|used tissue|facial tissue|paper towel|wet wipe)\b/],
    material: "Soiled paper, fibre, or mixed absorbent material",
    category: "general",
    action: "Bag it securely and place it in general waste according to local guidance.",
    handling: "Do not put used sanitary items or tissues in recycling or flush them down the toilet.",
    explanation: "Soiling and mixed absorbent materials make these items unsuitable for standard paper recycling.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Toothbrush",
    patterns: [/\b(toothbrush|tooth brush|razor)\b/],
    material: "Mixed plastics and nylon",
    category: "general",
    action: "Dispose of it according to local general-waste guidance, or use a specialist take-back program if one is available.",
    handling: null,
    explanation: "Most conventional toothbrushes combine several materials that standard household recycling systems cannot separate.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Textile",
    patterns: [/\b(shoe|shoes|clothes|clothing|shirt|trousers|jeans|dress|textile|fabric|cotton|wool|polyester|garment)\b/],
    material: "Textile or mixed footwear materials",
    category: "textile",
    action: "Reuse, repair, or donate if suitable; otherwise use a textile collection point where available.",
    handling: "Keep reusable textiles clean and dry. Do not place them in household recycling unless specifically accepted.",
    explanation: "Textiles and footwear are usually handled through reuse or dedicated collection rather than standard household recycling.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Foam packaging",
    patterns: [/\b(styrofoam|polystyrene|thermocol|foam cup|foam packaging|packing peanut)\b/],
    material: "Expanded polystyrene foam",
    category: "general",
    action: "Check for a specialist foam drop-off; if none is available, follow local general-waste guidance.",
    handling: "Keep loose foam contained so it does not become litter.",
    explanation: "Expanded foam is rarely accepted in household recycling because it is bulky, lightweight, and difficult to process economically.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Carton",
    patterns: [/\b(milk|juice|beverage) carton\b/, /\btetra ?pak\b/],
    material: "Layered paperboard, plastic, and sometimes aluminium",
    category: "recyclable",
    action: "Empty, rinse where appropriate, and recycle only if cartons are accepted by your local program.",
    handling: "Flatten only if requested locally; caps may be handled differently.",
    explanation: "Drink cartons are recyclable in facilities designed to separate their bonded material layers, but acceptance varies.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Tea bag",
    patterns: [/\btea ?bag\b/],
    material: "Tea leaves in a paper, plant-fibre, or plastic-mesh bag",
    category: "unknown",
    action: "Compost it only when the packaging confirms the bag is plastic-free; otherwise follow local general-waste guidance.",
    handling: "Remove staples, string, tags, and non-compostable packaging where applicable.",
    explanation: "The tea leaves are organic, but some bags use plastic sealing fibres or mesh that do not break down in compost.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Food container",
    patterns: [/\b(food|takeaway|takeout|lunch) (container|box)\b/],
    material: "Unspecified food-contact packaging",
    category: "unknown",
    action: "Identify the material, empty and clean the container, then recycle it only if that material and format are accepted locally; otherwise use general waste.",
    handling: "Food residue can contaminate recycling, and foam or coated fibre may require a different route.",
    explanation: "Food containers can be plastic, aluminium, coated paper, foam, or mixed material, so the object name alone does not determine recyclability.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Plastic wrapper",
    patterns: [/\b(plastic|snack|chip|chips) (wrapper|packet|film)\b/, /\bsoft plastic\b/],
    material: "Flexible plastic or multi-layer film",
    category: "unknown",
    action: "Use a soft-plastic drop-off if accepted locally; otherwise follow local general-waste guidance.",
    handling: "Keep it out of ordinary household recycling unless your program explicitly accepts flexible film.",
    explanation: "Many wrappers combine plastic and metallised layers that standard recycling facilities cannot separate.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Metal foil",
    patterns: [/\b(aluminium|aluminum|tin) foil\b/],
    material: "Aluminium foil",
    category: "metal",
    action: "Clean off food residue, combine small pieces into a larger ball, and recycle where aluminium foil is accepted.",
    handling: "Heavily soiled or laminated foil may need to go in general waste.",
    explanation: "Clean aluminium is recyclable, but tiny or contaminated pieces may not be captured by sorting equipment.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Food and plant matter",
    patterns: [/\b(coffee grounds?|egg ?shells?|fruit|vegetable|food scraps?|peel|core|garden waste|leaves|flowers)\b/],
    material: "Food or plant matter",
    category: "biodegradable",
    action: "Use an organics or compost collection where available.",
    handling: "Keep non-compostable packaging and stickers out of the organics stream.",
    explanation: "Food and plant matter can break down biologically and may be recovered as compost rather than sent to landfill.",
    confidence: "high",
    verify: true,
  },
  {
    name: "Paper product",
    patterns: [/\b(notebook|exercise book|newspaper|magazine|office paper|cardboard|paper bag|paper)\b/],
    material: "Paper or cardboard",
    category: "recyclable",
    action: "Place clean, dry paper in paper recycling where accepted locally.",
    handling: "Remove non-paper covers, plastic sleeves, or large metal bindings when practical. Soiled or coated paper may not be accepted.",
    explanation: "Clean paper fibre is widely recyclable, while contamination and bonded coatings can prevent recovery.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Plastic container",
    patterns: [/\b(shampoo|conditioner|detergent|soap) bottle\b/, /\bplastic (bottle|jar|tub|container)\b/],
    material: "Rigid plastic container",
    category: "recyclable",
    action: "Empty and rinse it where appropriate, then recycle if that plastic type is accepted locally.",
    handling: "Check the resin label and local rules; pumps and mixed-material closures may need to be removed.",
    explanation: "Many rigid plastic containers can be recycled, but acceptance depends on the plastic type and local sorting facilities.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Wooden item",
    patterns: [/\b(wood|wooden|timber)\b/],
    material: "Wood, possibly treated or coated",
    category: "general",
    action: "Reuse, repair, donate, or use a bulky-waste or timber recovery service where available.",
    handling: "Do not compost painted, pressure-treated, or chemically coated wood. Large furniture may require a booked collection.",
    explanation: "Wood can sometimes be recovered, but coatings, treatments, size, and local facilities determine the correct route.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Container glass",
    patterns: [/\bglass (bottle|jar|container)\b/],
    material: "Container glass",
    category: "glass",
    action: "Empty and rinse it, then use a glass recycling or bottle-return route where available.",
    handling: "Remove closures if local guidance requests it. Do not include ceramics, mirrors, or heat-resistant glass.",
    explanation: "Bottles and jars can often be recycled repeatedly, but other glass products have different compositions.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Metal item",
    patterns: [/\b(aluminium|aluminum|steel|tin|metal)\b/],
    material: "Metal",
    category: "metal",
    action: "Use metal recycling where this item and size are accepted locally.",
    handling: "Empty and clean packaging; wrap sharp edges and use a suitable drop-off for large objects.",
    explanation: "Metals are valuable recyclable materials, but collection rules vary by object type, size, and contamination.",
    confidence: "medium",
    verify: true,
  },
  {
    name: "Generic plastic",
    patterns: [/\bplastic|acrylic|rubber|silicone\b/],
    material: "Plastic, rubber, or mixed polymer",
    category: "general",
    action: "Check the material label and local recycling rules; if it is not an accepted rigid package, use general waste.",
    handling: null,
    explanation: "Being made of plastic does not automatically make an object recyclable; shape, resin type, and mixed components matter.",
    confidence: "medium",
    verify: true,
  },
];

const AMBIGUOUS: { pattern: RegExp; question: string }[] = [
  { pattern: /^(container|packaging|box|bottle|cup|bag)$/, question: "What kind of material is it — plastic, glass, metal, cardboard, ceramic, or something else?" },
  { pattern: /^(oil)$/, question: "Is this cooking oil, motor oil, or another kind of oil?" },
];

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

function scoreItem(input: string, item: WasteItem): number {
  const tokens = input.split(" ").filter(Boolean);
  const candidates = [item.name, ...item.aliases].map(normalizeInput);
  let score = 0;
  for (const candidate of candidates) {
    if (input === candidate) score = Math.max(score, 1);
    else if (input.includes(candidate) || candidate.includes(input)) score = Math.max(score, 0.88);
    else score = Math.max(score, similarity(input, candidate) * 0.8);
  }
  for (const keyword of item.keywords.map(normalizeInput)) {
    if (input.includes(keyword)) score = Math.max(score, 0.76);
    if (tokens.some((token) => token.length > 3 && similarity(token, keyword) > 0.86)) {
      score = Math.max(score, 0.7);
    }
  }
  return score;
}

function findRule(input: string): InferenceRule | null {
  return RULES.find((rule) => rule.patterns.some((pattern) => pattern.test(input))) ?? null;
}

function displayName(rawInput: string, fallback: string): string {
  const cleaned = rawInput.trim().replace(/\s+/g, " ").slice(0, 60);
  if (!cleaned) return fallback;
  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function resultFromRule(rule: InferenceRule, rawInput: string, inputType: "text" | "image"): AnalysisResult {
  return {
    itemName: displayName(rawInput, rule.name),
    material: rule.material,
    category: rule.category,
    categoryLabel: CATEGORIES[rule.category].label,
    recommendedAction: rule.action,
    specialHandling: rule.handling,
    explanation: rule.explanation,
    confidence: rule.confidence,
    requiresVerification: rule.verify ?? rule.confidence !== "high",
    clarificationQuestion: null,
    matchedItemId: null,
    source: "local-material-inference",
    inputType,
  };
}

function unresolved(rawInput: string, inputType: "text" | "image", question?: string): AnalysisResult {
  return {
    itemName: displayName(rawInput, "Unidentified item"),
    material: "Not yet identified",
    category: "unknown",
    categoryLabel: CATEGORIES.unknown.label,
    recommendedAction: "Keep the item separate until its material or previous use is clear; then check the appropriate local disposal guidance.",
    specialHandling: "If it may contain a battery, chemicals, medicine, electronics, or sharp parts, treat it as special waste until confirmed.",
    explanation: "A safe recommendation depends on what the item is made of, what it contained, and whether it is broken or contaminated.",
    confidence: "low",
    requiresVerification: true,
    clarificationQuestion: question ?? "What material is the item made of, what was it used for, and is it broken, empty, or contaminated?",
    matchedItemId: null,
    source: "local-material-inference",
    inputType,
  };
}

function resultFromKnowledge(
  item: WasteItem,
  score: number,
  rule: InferenceRule | null,
  inputType: "text" | "image",
): AnalysisResult {
  const confidence: Confidence = score >= 0.86
    ? (item.category === "unknown" ? "medium" : item.confidence)
    : score >= 0.7 && item.confidence === "high"
      ? "medium"
      : "low";
  return {
    itemName: item.name,
    material: rule?.material ?? `Material associated with ${item.name.toLowerCase()}`,
    category: item.category,
    categoryLabel: CATEGORIES[item.category].label,
    recommendedAction: item.recommendedAction,
    specialHandling: item.specialHandling,
    explanation: item.explanation,
    confidence,
    requiresVerification: confidence !== "high" || item.category === "unknown" || item.category === "hazardous" || item.category === "ewaste",
    clarificationQuestion: item.category === "unknown" && confidence === "low"
      ? "What material is it made from, and is it clean, empty, or contaminated?"
      : null,
    matchedItemId: item.id,
    source: "local-knowledge-base",
    inputType,
  };
}

export function classify(rawInput: string, inputType: "text" | "image" = "text"): AnalysisResult {
  const input = normalizeInput(rawInput);
  if (!input) return unresolved(rawInput, inputType);

  const ambiguous = AMBIGUOUS.find(({ pattern }) => pattern.test(input));
  if (ambiguous) return unresolved(rawInput, inputType, ambiguous.question);

  const rule = findRule(input);
  let best: { item: WasteItem; score: number } | null = null;
  for (const item of WASTE_ITEMS) {
    const score = scoreItem(input, item);
    if (!best || score > best.score) best = { item, score };
  }

  // Strong curated matches retain their reliable item-specific guidance. Safety
  // rules win if a broad database alias would otherwise hide a hazardous trait.
  if (best && best.score >= 0.82 && (!rule || rule.category === best.item.category)) {
    return resultFromKnowledge(best.item, best.score, rule, inputType);
  }
  if (rule) return resultFromRule(rule, rawInput, inputType);
  if (best && best.score >= 0.68) return resultFromKnowledge(best.item, best.score, null, inputType);
  return unresolved(rawInput, inputType);
}

/** Async facade. A future server-side AI function can replace this implementation without changing callers. */
export async function analyzeWasteItem(
  input: string,
  options: { inputType?: "text" | "image"; delayMs?: number } = {},
): Promise<AnalysisResult> {
  const { inputType = "text", delayMs = 900 } = options;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return classify(input, inputType);
}

export async function analyzeWasteImage(fileName: string, hint?: string): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  if (hint?.trim()) return classify(hint, "image");
  const fromName = classify(fileName.replace(/[-_.]/g, " "), "image");
  if (fromName.category !== "unknown") return fromName;
  return {
    ...fromName,
    itemName: "Uploaded photo",
    recommendedAction: "Add a short description of the photographed item so SortSmart can reason from its object type and material.",
    explanation: "Image recognition is not connected in this prototype, so the local fallback needs a text description rather than guessing from the photo.",
    clarificationQuestion: "What does the photo show, what is it made of, and is it broken, empty, or contaminated?",
  };
}

export const CONFIDENCE_COPY: Record<Confidence, { label: string; note: string; pct: number }> = {
  high: { label: "High confidence", note: "The item and its disposal characteristics are clear.", pct: 90 },
  medium: { label: "Moderate confidence", note: "The likely route depends on material, condition, or local acceptance.", pct: 60 },
  low: { label: "More detail needed", note: "A material or use detail is needed for a safe recommendation.", pct: 30 },
};