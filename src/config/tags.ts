import type { Locale } from "@/lib/i18n/config";

export const tagRegistry = {
  theory: {
    zh: "两山理念",
    en: "Two Mountains",
    description: {
      zh: "从安吉余村到美丽中国：理解“绿水青山就是金山银山”的时代脉络。",
      en: "The theoretical thread from Yucun to Beautiful China.",
    },
  },
  turns: {
    zh: "三次转身",
    en: "Three Turns",
    description: {
      zh: "从山到海、从火到冰、从厂到园：首钢园的百年转型。",
      en: "From steel to ice: the three turns of Shougang.",
    },
  },
  industry: {
    zh: "工业遗产",
    en: "Industrial Heritage",
    description: {
      zh: "高炉、筒仓、冷却塔与管线如何被重新使用。",
      en: "Blast furnaces, silos, cooling towers, and pipelines reused.",
    },
  },
  ecology: {
    zh: "生态治理",
    en: "Ecological Restoration",
    description: {
      zh: "棕地风险管控、群明湖水生态、大气与永定河。",
      en: "Brownfield risk control, water ecology, air, and the Yongding River.",
    },
  },
  geotourism: {
    zh: "地学旅游",
    en: "Geotourism",
    description: {
      zh: "用旅游地学与地球化学视角识别工业遗存中的地学资源。",
      en: "Reading industrial heritage through geotourism and geochemistry.",
    },
  },
  fieldwork: {
    zh: "实地调研",
    en: "Fieldwork",
    description: {
      zh: "五方法、五点位、三级证据，以及现场的边界。",
      en: "Five methods, five stops, three evidence levels.",
    },
  },
  data: {
    zh: "数据与证据",
    en: "Data & Evidence",
    description: {
      zh: "关键数字、公开来源与 A/B/C 证据分级。",
      en: "Key figures, public sources, and A/B/C evidence.",
    },
  },
  youth: {
    zh: "青年行动",
    en: "Youth Action",
    description: {
      zh: "把一次调研转化为可执行的低碳行动与公共表达。",
      en: "Turning fieldwork into low-carbon action.",
    },
  },
} as const;

export type TagKey = keyof typeof tagRegistry;

export const tagKeys = Object.keys(tagRegistry) as TagKey[];

export function isTagKey(value: string): value is TagKey {
  return value in tagRegistry;
}

export function tagLabel(key: TagKey, locale: Locale): string {
  return tagRegistry[key][locale];
}

export function tagDescription(key: TagKey, locale: Locale): string {
  return tagRegistry[key].description[locale];
}
