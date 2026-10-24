export type EvidenceRule = {
  grade: "A" | "B" | "C";
  title: string;
  note: string;
};

export const evidenceRules: EvidenceRule[] = [
  {
    grade: "A",
    title: "公开来源 + 现场证据一致",
    note: "可直接写入结论。",
  },
  {
    grade: "B",
    title: "单一来源",
    note: "需两人复核后使用。",
  },
  {
    grade: "C",
    title: "观感或待核实",
    note: "只作线索，不单独支撑结论。",
  },
];
