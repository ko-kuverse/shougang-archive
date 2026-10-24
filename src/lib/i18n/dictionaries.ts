import type { Locale } from "./config";

export type Dictionary = {
  site: {
    tagline: string;
    description: string;
  };
  nav: {
    home: string;
    archive: string;
    timeline: string;
    gallery: string;
    route: string;
    team: string;
    sources: string;
    tags: string;
    primary: string;
    menu: string;
    close: string;
  };
  search: {
    trigger: string;
    title: string;
    placeholder: string;
    empty: string;
    hint: string;
    loading: string;
    unavailable: string;
    unavailableHint: string;
    minChars: (count: number) => string;
    results: (count: number) => string;
    open: string;
    close: string;
    navigate: string;
    select: string;
    error: string;
  };
  theme: {
    label: string;
    auto: string;
    light: string;
    dark: string;
    toggle: string;
  };
  language: {
    label: string;
    switchTo: string;
  };
  docs: {
    overview: string;
    onThisPage: string;
    prev: string;
    next: string;
    updated: string;
    readingTime: (minutes: number) => string;
    tags: string;
    breadcrumb: string;
    sidebar: string;
    openSidebar: string;
    close: string;
    home: string;
    section: string;
    noTags: string;
  };
  home: {
    eyebrow: string;
    titleLines: string[];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    sections: string;
    sectionsDescription: string;
    latest: string;
    latestDescription: string;
    panelTitle: string;
    panelRows: Array<{ label: string; value: string }>;
    terminalTitle: string;
    terminalNote: string;
    docsCount: (count: number) => string;
  };
  tags: {
    title: string;
    description: string;
    count: (count: number) => string;
    empty: string;
  };
  archive: {
    title: string;
    description: string;
    byYear: string;
    bySection: string;
    noDate: string;
  };
  footer: {
    builtWith: string;
    rights: string;
    source: string;
    backToTop: string;
    status: string;
  };
  notFound: {
    title: string;
    code: string;
    description: string;
    backHome: string;
    browseDocs: string;
  };
};

const zh: Dictionary = {
  site: {
    tagline:
      "从十里钢城到生态秀场，一次关于工业遗产、生态修复与城市转型的实地调研。",
    description:
      "首钢园“两山”理念社会实践调研档案：三次转身、四个转化、三个专业维度。",
  },
  nav: {
    home: "首页",
    archive: "调研档案",
    timeline: "时间线",
    gallery: "实地图集",
    route: "调研路线",
    team: "团队",
    sources: "参考资料",
    tags: "主题",
    primary: "主导航",
    menu: "菜单",
    close: "关闭菜单",
  },
  search: {
    trigger: "搜索档案",
    title: "检索档案 / SEARCH",
    placeholder: "输入关键词，检索章节与内容…",
    empty: "没有匹配的档案内容。试试更短的关键词。",
    hint: "检索章节标题、正文与数据。",
    loading: "正在检索…",
    unavailable: "搜索索引尚未生成",
    unavailableHint:
      "开发模式不生成 Pagefind 索引。运行 npm run build 后，用 npm run preview 验证搜索。",
    minChars: (count) => `至少输入 ${count} 个字符。`,
    results: (count) => `${count} 条结果`,
    open: "打开搜索",
    close: "关闭搜索",
    navigate: "↑↓ 选择",
    select: "Enter 打开",
    error: "检索失败，请重试。",
  },
  theme: {
    label: "显示主题",
    auto: "自动",
    light: "浅色",
    dark: "深色",
    toggle: "切换主题",
  },
  language: {
    label: "语言",
    switchTo: "切换语言",
  },
  docs: {
    overview: "档案总览",
    onThisPage: "本页目录",
    prev: "上一章",
    next: "下一章",
    updated: "更新于",
    readingTime: (minutes) => `${minutes} 分钟阅读`,
    tags: "主题",
    breadcrumb: "位置",
    sidebar: "档案目录",
    openSidebar: "打开档案目录",
    close: "关闭",
    home: "首页",
    section: "篇目",
    noTags: "暂无主题",
  },
  home: {
    eyebrow: "[ 社会实践 / FIELD ARCHIVE ]",
    titleLines: ["从十里钢城", "到生态秀场"],
    description:
      "一座百年钢城，如何在搬迁、冬奥与城市更新中，把“绿水青山就是金山银山”写成一本可核对的账。",
    primaryCta: "开始阅读",
    secondaryCta: "查看实地图集",
    sections: "调研档案",
    sectionsDescription:
      "八章叙事，四个转化，一条从钢铁到生态的线索。",
    latest: "全部章节",
    latestDescription: "按顺序阅读，或从感兴趣的主题进入。",
    panelTitle: "调研坐标",
    panelRows: [
      { label: "地点", value: "北京·石景山·首钢园" },
      { label: "时间", value: "2026.10" },
      { label: "方法", value: "实地观测 / 访谈 / 对比" },
      { label: "证据", value: "A / B / C 分级" },
    ],
    terminalTitle: "FIELD LOG",
    terminalNote: "数据来自公开资料与小组实地记录；待核销项已标注。",
    docsCount: (count) => `${count} 篇`,
  },
  tags: {
    title: "主题索引",
    description: "按主题进入调研档案。",
    count: (count) => `${count} 篇`,
    empty: "暂无主题。",
  },
  archive: {
    title: "调研档案",
    description: "八章叙事，从十里钢城到生态秀场。",
    bySection: "按篇目",
    byYear: "按时间",
    noDate: "暂无章节",
  },
  footer: {
    builtWith: "课程社会实践 / 2026",
    rights: "两山实践调研队",
    source: "参考文献",
    backToTop: "回到顶部",
    status: "档案已归档",
  },
  notFound: {
    title: "档案缺页",
    code: "404",
    description: "这个地址没有对应的档案。检查链接，或返回档案总览。",
    backHome: "返回首页",
    browseDocs: "浏览调研档案",
  },
};

const en: Dictionary = zh;

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
