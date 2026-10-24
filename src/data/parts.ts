export const parts = [
  "缘起与设计",
  "三次转身",
  "三个维度的发现",
  "证据与建议",
  "结论与行动",
] as const;

export type PartTitle = (typeof parts)[number];
