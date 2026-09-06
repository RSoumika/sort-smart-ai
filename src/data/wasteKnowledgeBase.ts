/**
 * Local waste knowledge base (prototype).
 *
 * This is a hand-curated dataset used by the classification service.
 * It is NOT connected to any municipal database — all guidance is general.
 */

export type WasteCategory =
  | "biodegradable"
  | "recyclable"
  | "hazardous"
  | "ewaste"
  | "general"
  | "textile"
  | "glass"
  | "metal"
  | "unknown";

export type Confidence = "high" | "medium" | "low";

export interface WasteItem {
  id: string;
  name: string;
  aliases: string[];
  category: WasteCategory;
  recommendedAction: string;
  specialHandling: string | null;
  explanation: string;
  confidence: Confidence;
  keywords: string[];
}

export interface CategoryMeta {
  id: WasteCategory;
  label: string;
  short: string;
  description: string;
  examples: string[];
  generalRecommendation: string;
  colorVar: string;
}

export const CATEGORIES: Record<WasteCategory, CategoryMeta> = {
  biodegradable: {
    id: "biodegradable",
    label: "Biodegradable",
    short: "Organic",
    description: "Food and plant matter that can usually be composted or processed as organics.",
    examples: ["Fruit & vegetable peels", "Food scraps", "Garden waste"],
    generalRecommendation: "Organic/compost collection where available.",
    colorVar: "bio",
  },
  recyclable: {
    id: "recyclable",
    label: "Recyclable",
    short: "Recycle",
    description: "Materials commonly accepted by recycling programmes, subject to local rules.",
    examples: ["Clean paper", "Cardboard", "Some plastic bottles", "Metal cans"],
    generalRecommendation: "Recycling collection, subject to local rules.",
    colorVar: "recycle",
  },
  hazardous: {
    id: "hazardous",
    label: "Hazardous / Special Waste",
    short: "Hazardous",
    description: "Items that need specialised handling for safety and environmental reasons.",
    examples: ["Batteries", "Certain chemicals", "Paint-related waste"],
    generalRecommendation: "Authorized hazardous/special waste collection.",
    colorVar: "hazard",
  },
  ewaste: {
    id: "ewaste",
    label: "E-waste",
    short: "E-waste",
    description: "Electrical and electronic items that should go through dedicated channels.",
    examples: ["Chargers", "Cables", "Phones", "Small electronic devices"],
    generalRecommendation: "Authorized e-waste collection/recycling.",
    colorVar: "ewaste",
  },
  general: {
    id: "general",
    label: "General / Non-recyclable Waste",
    short: "General",
    description: "Mixed or non-recoverable materials that are not usually accepted in household recycling.",
    examples: ["Mixed-material items", "Used tissues", "Ceramics"],
    generalRecommendation: "General-waste collection, subject to local rules.",
    colorVar: "unknown",
  },
  textile: {
    id: "textile",
    label: "Textile",
    short: "Textile",
    description: "Clothing and fabrics that may be suitable for reuse or a dedicated textile collection.",
    examples: ["Clothes", "Shoes", "Cotton fabric"],
    generalRecommendation: "Reuse, donate, or use a textile collection point where available.",
    colorVar: "bio",
  },
  glass: {
    id: "glass",
    label: "Glass",
    short: "Glass",
    description: "Glass items whose correct route depends on whether they are containers, treated glass, or broken pieces.",
    examples: ["Bottles", "Jars", "Broken glass"],
    generalRecommendation: "Use an accepted glass collection route and follow local rules for broken glass.",
    colorVar: "recycle",
  },
  metal: {
    id: "metal",
    label: "Metal",
    short: "Metal",
    description: "Metal objects and packaging that may be recyclable when clean and accepted locally.",
    examples: ["Aluminium foil", "Steel cans", "Metal objects"],
    generalRecommendation: "Metal recycling collection where accepted locally.",
    colorVar: "recycle",
  },
  unknown: {
    id: "unknown",
    label: "Needs more information",
    short: "Unclear",
    description: "Material, condition or local rules change the answer for this item.",
    examples: ["Mixed-material packaging", "Contaminated containers"],
    generalRecommendation: "Check the material and your local disposal guidelines.",
    colorVar: "unknown",
  },
};

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: "banana-peel",
    name: "Banana Peel",
    aliases: ["banana skin", "banana"],
    category: "biodegradable",
    recommendedAction: "Organic/compost collection where available.",
    specialHandling: null,
    explanation:
      "Food and plant scraps can generally be composted or processed as organic waste rather than sent to landfill.",
    confidence: "high",
    keywords: ["banana", "peel", "fruit", "skin"],
  },
  {
    id: "apple-core",
    name: "Apple Core",
    aliases: ["apple", "fruit core"],
    category: "biodegradable",
    recommendedAction: "Organic/compost collection where available.",
    specialHandling: null,
    explanation: "Fruit remains are organic matter and are usually accepted by compost programmes.",
    confidence: "high",
    keywords: ["apple", "core", "fruit"],
  },
  {
    id: "vegetable-scraps",
    name: "Vegetable Scraps",
    aliases: ["veggie peels", "vegetable peel", "onion skin", "potato peel"],
    category: "biodegradable",
    recommendedAction: "Organic/compost collection where available.",
    specialHandling: null,
    explanation:
      "Vegetable trimmings break down readily and are valuable input for composting systems.",
    confidence: "high",
    keywords: ["vegetable", "veg", "scrap", "peel", "onion", "potato", "carrot"],
  },
  {
    id: "tea-bag",
    name: "Tea Bag",
    aliases: ["used tea bag", "teabag"],
    category: "unknown",
    recommendedAction:
      "Compost only if the bag is paper-based; some tea bags contain plastic mesh that is not compostable.",
    specialHandling: "Check the packaging for a plastic-free label before composting.",
    explanation:
      "The tea leaves are organic, but many tea bags include polypropylene sealing which does not break down.",
    confidence: "low",
    keywords: ["tea", "bag", "teabag"],
  },
  {
    id: "cardboard-box",
    name: "Cardboard Box",
    aliases: ["carton", "shipping box", "corrugated box"],
    category: "recyclable",
    recommendedAction: "Recycling collection, subject to local rules. Flatten before disposal.",
    specialHandling: "Remove tape and avoid recycling if heavily soiled with grease or food.",
    explanation:
      "Clean, dry cardboard is one of the most widely recycled materials; contamination reduces its value.",
    confidence: "high",
    keywords: ["cardboard", "box", "carton", "corrugated", "packaging"],
  },
  {
    id: "newspaper",
    name: "Newspaper",
    aliases: ["paper", "magazine", "newsprint"],
    category: "recyclable",
    recommendedAction: "Paper recycling collection, subject to local rules.",
    specialHandling: null,
    explanation: "Clean, dry paper is widely accepted for recycling into new paper products.",
    confidence: "high",
    keywords: ["newspaper", "paper", "magazine", "news", "print"],
  },
  {
    id: "plastic-bottle",
    name: "Plastic Bottle",
    aliases: ["water bottle", "pet bottle", "soda bottle"],
    category: "recyclable",
    recommendedAction: "Recycling collection, subject to local rules.",
    specialHandling: "Empty and rinse where appropriate; check whether caps are accepted.",
    explanation:
      "Many plastic beverage bottles (often PET) are recyclable, although acceptance varies by local programme.",
    confidence: "high",
    keywords: ["plastic", "bottle", "pet", "water", "soda", "drink"],
  },
  {
    id: "aluminum-can",
    name: "Aluminium Can",
    aliases: ["tin can", "soda can", "metal can", "aluminum can"],
    category: "recyclable",
    recommendedAction: "Metal recycling collection, subject to local rules.",
    specialHandling: "Rinse to avoid contaminating other recyclables.",
    explanation:
      "Metal cans are highly recyclable and recycling them typically uses far less energy than producing new metal.",
    confidence: "high",
    keywords: ["can", "aluminium", "aluminum", "tin", "metal", "soda"],
  },
  {
    id: "glass-bottle",
    name: "Glass Bottle",
    aliases: ["glass jar", "jar"],
    category: "recyclable",
    recommendedAction: "Glass recycling collection or bottle return scheme where available.",
    specialHandling: "Do not include broken glass with regular recycling; handle carefully.",
    explanation:
      "Glass can be recycled repeatedly, but broken or heat-treated glass is often handled separately.",
    confidence: "medium",
    keywords: ["glass", "bottle", "jar"],
  },
  {
    id: "plastic-wrapper",
    name: "Plastic Wrapper",
    aliases: ["chip packet", "snack wrapper", "plastic film", "packet"],
    category: "unknown",
    recommendedAction:
      "Recyclability depends on material and local rules. Many soft/multi-layer wrappers are not accepted in kerbside recycling.",
    specialHandling: "Some retailers run soft-plastic drop-off points — check locally.",
    explanation:
      "Snack wrappers are often multi-layer laminates of plastic and metallised film, which most recycling facilities cannot separate.",
    confidence: "low",
    keywords: ["wrapper", "packet", "film", "snack", "chips", "soft plastic", "foil pouch"],
  },
  {
    id: "food-container",
    name: "Food Container",
    aliases: ["takeaway box", "lunch box", "takeout container"],
    category: "unknown",
    recommendedAction:
      "Recycle only if the material is accepted locally and the container is clean; otherwise general waste.",
    specialHandling: "Food residue can contaminate an entire recycling batch — rinse first.",
    explanation:
      "Containers vary widely (plastic, coated paper, foam) and contamination is the main reason recyclables get rejected.",
    confidence: "low",
    keywords: ["container", "takeaway", "takeout", "tupperware", "lunch", "box food"],
  },
  {
    id: "pizza-box",
    name: "Pizza Box",
    aliases: ["greasy cardboard"],
    category: "unknown",
    recommendedAction:
      "Recycle clean sections; heavily greasy parts usually go to organics or general waste.",
    specialHandling: "Grease-soaked fibre is typically rejected by paper recyclers.",
    explanation:
      "Cardboard is recyclable, but oil contamination interferes with the paper pulping process.",
    confidence: "medium",
    keywords: ["pizza", "greasy", "box"],
  },
  {
    id: "used-battery",
    name: "Used Battery",
    aliases: ["battery", "aa battery", "lithium battery", "cell"],
    category: "hazardous",
    recommendedAction: "Take it to an authorized battery collection point or e-waste facility.",
    specialHandling: "Do not place used batteries in regular household waste.",
    explanation:
      "Batteries can contain materials that require specialised handling and recycling, and damaged cells can be a fire risk.",
    confidence: "high",
    keywords: ["battery", "batteries", "cell", "lithium", "aa", "aaa", "power cell"],
  },
  {
    id: "paint-container",
    name: "Paint Container",
    aliases: ["paint can", "paint tin", "leftover paint"],
    category: "hazardous",
    recommendedAction: "Authorized hazardous/special waste collection point.",
    specialHandling: "Do not pour paint down drains or place liquid paint in household bins.",
    explanation:
      "Paint and its residues can contain solvents and other substances that need controlled disposal.",
    confidence: "high",
    keywords: ["paint", "solvent", "thinner", "varnish"],
  },
  {
    id: "cfl-bulb",
    name: "Fluorescent / CFL Bulb",
    aliases: ["cfl", "tube light", "light bulb"],
    category: "hazardous",
    recommendedAction: "Take to a lamp/bulb collection point or hazardous waste facility.",
    specialHandling: "Handle carefully — some bulbs contain small amounts of mercury.",
    explanation:
      "Fluorescent lighting needs controlled recycling to prevent release of hazardous substances.",
    confidence: "medium",
    keywords: ["bulb", "cfl", "fluorescent", "tube light", "lamp"],
  },
  {
    id: "medicine",
    name: "Expired Medicine",
    aliases: ["tablets", "pills", "expired drugs"],
    category: "hazardous",
    recommendedAction: "Return to a pharmacy take-back scheme or hazardous waste collection.",
    specialHandling: "Do not flush medicines or put them in general waste.",
    explanation:
      "Pharmaceuticals can affect water systems and need dedicated disposal channels.",
    confidence: "medium",
    keywords: ["medicine", "pill", "tablet", "drug", "pharma", "syrup"],
  },
  {
    id: "phone-charger",
    name: "Phone Charger",
    aliases: ["charger", "adapter", "power brick", "old charger"],
    category: "ewaste",
    recommendedAction: "Authorized e-waste collection/recycling.",
    specialHandling: "Do not place in general waste where e-waste collection is available.",
    explanation:
      "Chargers contain electronic components and should be processed through appropriate e-waste channels.",
    confidence: "high",
    keywords: ["charger", "adapter", "plug", "power brick", "wall charger"],
  },
  {
    id: "usb-cable",
    name: "USB Cable",
    aliases: ["cable", "wire", "data cable", "cord"],
    category: "ewaste",
    recommendedAction: "Authorized e-waste collection/recycling.",
    specialHandling: null,
    explanation:
      "Cables contain copper and plastics that can be recovered through e-waste recycling.",
    confidence: "high",
    keywords: ["usb", "cable", "wire", "cord", "hdmi", "charging cable"],
  },
  {
    id: "old-phone",
    name: "Old Mobile Phone",
    aliases: ["mobile", "smartphone", "cell phone"],
    category: "ewaste",
    recommendedAction: "Authorized e-waste collection, take-back programme, or certified recycler.",
    specialHandling: "Erase personal data and remove the battery only if the design allows it.",
    explanation:
      "Phones contain recoverable metals plus a battery, so they need dedicated e-waste processing.",
    confidence: "high",
    keywords: ["phone", "mobile", "smartphone", "handset", "iphone", "android"],
  },
  {
    id: "broken-headphones",
    name: "Broken Headphones",
    aliases: ["earphones", "earbuds", "headset"],
    category: "ewaste",
    recommendedAction: "Authorized e-waste collection/recycling.",
    specialHandling: "Wireless earbuds contain small batteries — mention this at the drop-off point.",
    explanation:
      "Audio devices are electronics; wireless models also include lithium cells that must not go to landfill.",
    confidence: "high",
    keywords: ["headphone", "earphone", "earbud", "headset", "airpods"],
  },
  {
    id: "electronic-toy",
    name: "Electronic Toy",
    aliases: ["battery toy", "toy with batteries"],
    category: "ewaste",
    recommendedAction: "Remove batteries, then take the toy to e-waste collection.",
    specialHandling: "Batteries go to a battery collection point separately.",
    explanation:
      "Powered toys combine electronics and batteries, both of which need separate recovery routes.",
    confidence: "medium",
    keywords: ["toy", "electronic toy", "rc car", "robot toy"],
  },
  {
    id: "broken-electronics",
    name: "Broken Electronics",
    aliases: ["broken device", "damaged appliance", "old laptop"],
    category: "ewaste",
    recommendedAction: "Authorized e-waste collection or certified recycler.",
    specialHandling: "Damaged lithium batteries are a fire risk — flag them at drop-off.",
    explanation:
      "Even non-working electronics contain recoverable materials and substances that need controlled handling.",
    confidence: "medium",
    keywords: ["broken", "electronics", "laptop", "device", "appliance", "gadget", "circuit"],
  },
  {
    id: "styrofoam",
    name: "Styrofoam / Foam Packaging",
    aliases: ["thermocol", "polystyrene", "foam"],
    category: "unknown",
    recommendedAction:
      "Rarely accepted in kerbside recycling — check for a specialised drop-off, otherwise general waste.",
    specialHandling: null,
    explanation:
      "Expanded polystyrene is mostly air, making transport and reprocessing uneconomical for most programmes.",
    confidence: "low",
    keywords: ["styrofoam", "thermocol", "polystyrene", "foam", "packing peanut"],
  },
  {
    id: "clothes",
    name: "Old Clothes / Textiles",
    aliases: ["textile", "fabric", "t-shirt", "garment"],
    category: "unknown",
    recommendedAction:
      "Donate if wearable; otherwise use a textile collection point where available.",
    specialHandling: null,
    explanation:
      "Textiles are not accepted in most household recycling streams but are often collected separately for reuse.",
    confidence: "medium",
    keywords: ["clothes", "cloth", "textile", "fabric", "shirt", "shoes"],
  },
];

export const EXAMPLE_ITEMS = [
  "Banana Peel",
  "Plastic Bottle",
  "Used Battery",
  "Old Charger",
  "Food Container",
  "Plastic Wrapper",
  "Cardboard Box",
  "Broken Electronics",
];
