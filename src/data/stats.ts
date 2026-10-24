export type Stat = {
  value: string;
  unit?: string;
  label: string;
  note: string;
  source: string;
  featured?: boolean;
};

export const stats: Stat[] = [
  {
    value: "8.63",
    unit: "km²",
    label: "老厂区整体转型",
    note: "新首钢高端产业综合服务区",
    source: "调研报告 / 公开资料",
    featured: true,
  },
  {
    value: "1300",
    unit: "万",
    label: "2024 年入园客流",
    note: "活动 230 余场、入园企业 870 余家",
    source: "新华社 / 石景山区政府网",
    featured: true,
  },
  {
    value: "23",
    unit: "ha",
    label: "群明湖水域及周边",
    note: "0.3 ha 湿地；水质不低于地表Ⅳ类",
    source: "北京日报 / 北京规划自然资源",
    featured: true,
  },
  {
    value: "100",
    unit: "%",
    label: "钢渣、水渣资源化利用",
    note: "京唐公司固废零出厂",
    source: "首钢股份 2024 可持续发展报告",
    featured: true,
  },
  {
    value: "1142",
    unit: "ha",
    label: "北京冬季奥林匹克公园",
    note: "水面 326 ha、绿地 506 ha",
    source: "人民网",
  },
  {
    value: "26.5",
    unit: "μg/m³",
    label: "石景山 2025 年 PM2.5",
    note: "首次低于 30；优良天数 319 天",
    source: "石景山区政府网",
  },
  {
    value: "2:8",
    label: "石景山二、三产业占比",
    note: "由 2010 年的 7:3 反转",
    source: "调研报告 / 公开资料",
  },
  {
    value: "1919",
    label: "石景山炼厂始建",
    note: "首钢前身；百年钢铁史的起点",
    source: "新华每日电讯",
  },
];

export const featuredStats = stats.filter((stat) => stat.featured);
