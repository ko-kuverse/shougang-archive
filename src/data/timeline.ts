export type TimelinePhase =
  | "钢铁时代"
  | "搬迁与转型"
  | "冬奥与更新"
  | "后冬奥";

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  phase: TimelinePhase;
  highlight?: boolean;
  source?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export const timeline: TimelineEvent[] = [
  {
    year: "1919",
    title: "石景山炼厂开工",
    description:
      "官商合办龙烟铁矿公司在石景山兴建炼厂，首钢前身由此起步。厂址依永定河水源、铁路与将军岭石灰石而选。",
    phase: "钢铁时代",
    highlight: true,
    source: "新华每日电讯",
  },
  {
    year: "1948",
    title: "累计产铁 28.6 万吨",
    description:
      "从 1919 年到 1948 年，石景山炼厂累计产铁仅 28.6 万吨。",
    phase: "钢铁时代",
    source: "新华每日电讯",
  },
  {
    year: "1950",
    title: "参观团来到石景山钢铁厂",
    description:
      "1950 年 4 月 2 日，西北各民族青年、妇女参观团来到石景山钢铁厂。代表们观看刚生产出的铁锭——钢铁是新中国的工业底座，也是这座厂第一次被全国看见的时刻。",
    phase: "钢铁时代",
    source: "新华社",
    image: "/images/timeline/1950-visit.jpg",
    imageAlt: "1950 年，参观团在石景山钢铁厂观看铁锭",
    imageCaption: "1950 年 4 月 2 日，代表们观看生产的铁锭。",
  },
  {
    year: "1951",
    title: "第二炼铁炉开炉",
    description:
      "1951 年 2 月 10 日，第二炼铁炉举行开炉典礼。炉火点燃的不只是产能，也是一代人对工业化的想象。",
    phase: "钢铁时代",
    source: "新华社",
    image: "/images/timeline/1951-furnace.jpg",
    imageAlt: "1951 年，第二炼铁炉开炉典礼",
    imageCaption: "1951 年 2 月 10 日，第二炼铁炉举行开炉典礼。",
  },
  {
    year: "1965",
    title: "转炉吹炼",
    description:
      "顶吹氧气转炉一号转炉在吹炼。转炉让首钢结束“有铁无钢”的历史，走向完整的钢铁生产。",
    phase: "钢铁时代",
    source: "新华社",
    image: "/images/timeline/1965-converter.jpg",
    imageAlt: "1965 年，顶吹氧气转炉一号转炉在吹炼",
    imageCaption: "1965 年，顶吹氧气转炉一号转炉在吹炼。",
  },
  {
    year: "1978",
    title: "钢产量 179 万吨",
    description: "改革开放初期，首钢钢产量达到 179 万吨。",
    phase: "钢铁时代",
    source: "北京日报",
  },
  {
    year: "1984",
    title: "钢锭出炉",
    description:
      "首都钢铁公司钢锭出炉。高温的钢锭被吊起，钢铁生产进入高产阶段，城市与工厂的关系也来到新的临界点。",
    phase: "钢铁时代",
    source: "新华社",
    image: "/images/timeline/1984-ingots.jpg",
    imageAlt: "1984 年，首都钢铁公司钢锭出炉",
    imageCaption: "1984 年，首都钢铁公司钢锭出炉。",
  },
  {
    year: "1994",
    title: "钢产量 824 万吨，居全国第一",
    description:
      "首钢进入千万吨级钢铁企业行列，石景山厂区达到生产高峰。",
    phase: "钢铁时代",
    source: "新华每日电讯",
  },
  {
    year: "2005",
    title: "搬迁调整方案获批",
    description:
      "国家发展改革委报请国务院批准首钢压产、搬迁、结构调整和环境治理方案，产能转向曹妃甸。",
    phase: "搬迁与转型",
    highlight: true,
    source: "新华社",
  },
  {
    year: "2008",
    title: "为奥运压产减排",
    description:
      "为保障北京奥运空气质量，首钢压产，烟尘、粉尘、SO₂ 排放量同比分别下降 41.7%、39.2%、44.5%。",
    phase: "搬迁与转型",
    source: "中国环境报",
  },
  {
    year: "2010",
    title: "石景山主流程全面停产",
    description:
      "约 800 万吨钢铁产能退出北京；三号高炉于 12 月 18 日出最后一炉铁水。",
    phase: "搬迁与转型",
    highlight: true,
    source: "新华网、北京日报",
    image: "/images/timeline/2010-last-tap.jpg",
    imageAlt: "2010 年，媒体和首钢职工见证最后一炉钢冶炼",
    imageCaption:
      "2010 年 12 月 19 日，媒体和首钢职工共同见证最后一炉钢冶炼。",
  },
  {
    year: "2013",
    title: "西十筒仓列入首批试点",
    description:
      "西十筒仓列入全国老工业区搬迁改造首批试点，为后来的冬奥组委办公区埋下伏笔。",
    phase: "搬迁与转型",
    source: "文汇报",
  },
  {
    year: "2016",
    title: "北京冬奥组委入驻",
    description:
      "北京冬奥组委首批工作人员入驻西十筒仓办公区，首钢园进入“从火到冰”的转型阶段。",
    phase: "冬奥与更新",
    highlight: true,
    source: "央广网",
  },
  {
    year: "2019",
    title: "总书记考察首钢园",
    description:
      "2019 年 2 月 1 日，习近平总书记考察首钢园区，强调“充分考虑场馆的可持续利用”。",
    phase: "冬奥与更新",
    source: "新华社",
    image: "/images/timeline/2019-visit.jpg",
    imageAlt: "2019 年，习近平总书记考察首钢园区",
    imageCaption: "2019 年 2 月 1 日，习近平总书记考察首钢园区。",
  },
  {
    year: "2021",
    title: "服贸会与冬奥公园",
    description:
      "服贸会设首钢园专题展区；北京冬季奥林匹克公园开园；香格里拉酒店开业。区域尺度的水岸与园区尺度的更新开始咬合。",
    phase: "冬奥与更新",
    source: "人民网、工人日报",
    image: "/images/timeline/2021-bridge.jpg",
    imageAlt: "新首钢大桥与永定河",
    imageCaption: "新首钢大桥与永定河：区域水岸的连接。",
  },
  {
    year: "2022",
    title: "冬奥、大跳台与群明湖",
    description:
      "北京冬奥会大跳台比赛产生 2 枚中国金牌；群明湖生态修复竣工；六工汇亮相。",
    phase: "冬奥与更新",
    highlight: true,
    source: "新华社、北京规划自然资源",
    image: "/images/timeline/2022-panorama.jpg",
    imageAlt: "大跳台、冷却塔与群明湖同框",
    imageCaption: "大跳台、冷却塔与群明湖同框。",
  },
  {
    year: "2024",
    title: "国家工业遗产与 1300 万客流",
    description:
      "首钢石景山厂区工业遗产入选第六批国家工业遗产；园区客流突破 1300 万人次，举办活动 230 余场，入园企业 870 余家。",
    phase: "后冬奥",
    highlight: true,
    source: "石景山区政府网、新华社",
    image: "/images/timeline/2024-walkway.jpg",
    imageAlt: "首钢园步道与冷却塔",
    imageCaption: "园区步道与冷却塔：工业遗存成为日常空间。",
  },
  {
    year: "2025",
    title: "空气质量与再生水",
    description:
      "石景山区 PM2.5 年均浓度 26.5 μg/m³，首次低于 30；首钢水系再生水引入工程开工。",
    phase: "后冬奥",
    source: "石景山区政府网、千龙网",
  },
  {
    year: "2025",
    title: "服贸会“一会一址”",
    description:
      "2025 年起，服贸会实行“一会一址”，首钢园正式成为永久举办地。工业遗存与现代会展在同一空间叠加。",
    phase: "后冬奥",
    source: "新华社、北京日报",
    image: "/images/timeline/2025-fair.jpg",
    imageAlt: "服贸会期间的首钢园",
    imageCaption: "服贸会期间的首钢园，旗帜与高炉同框。",
  },
];

export const timelineHighlights = timeline.filter((event) => event.highlight);
