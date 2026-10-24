export type Transformation = {
  id: string;
  number: string;
  from: string;
  to: string;
  description: string;
  evidence: string;
};

export const transformations: Transformation[] = [
  {
    id: "resource",
    number: "01",
    from: "资源约束",
    to: "发展转向",
    description:
      "缺水、缺地、首都功能定位，逼出搬迁调整与产业升级。",
    evidence: "2005 搬迁批复 · 2010 主流程停产 · 8.63 km² 城市更新",
  },
  {
    id: "risk",
    number: "02",
    from: "污染风险",
    to: "安全开放",
    description:
      "停产后没有一拆了之，而是调查评估、分级管控、逐宗修复。",
    evidence: "棕地调查公示 · 群明湖Ⅳ类水 · 50 年一遇暴雨零影响",
  },
  {
    id: "waterfront",
    number: "03",
    from: "工业锈带",
    to: "公共水岸",
    description:
      "晾水池、混凝土驳岸、管廊，变成可进入、可停留的生态空间。",
    evidence: "群明湖 23 ha · 湿地 0.3 ha · 冬奥公园 1142 ha",
  },
  {
    id: "asset",
    number: "04",
    from: "生态投入",
    to: "绿色资产",
    description:
      "冬奥、服贸、科幻、商业与公园游憩，让环境改善持续产生价值。",
    evidence: "2024 客流 1300 万 · 活动 230+ · 企业 870+",
  },
];
