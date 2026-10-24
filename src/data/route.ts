export type RoutePoint = {
  id: string;
  number: string;
  name: string;
  duration: string;
  theme: string;
  description: string;
  observations: string[];
  image: string;
  imageAlt: string;
  imageCredit: string;
};

export const routePoints: RoutePoint[] = [
  {
    id: "blast-furnace",
    number: "01",
    name: "三高炉",
    duration: "40 min",
    theme: "生产—遗产",
    description:
      "从原料、冶炼到出铁出渣，读懂一座高炉的空间链。",
    observations: [
      "炉体—料仓—廊道—热风炉的连接关系",
      "锈色、尺度、基础与轨道构成的“地形感”",
      "展陈中的年代、停产时间与保护级别",
      "现场公示牌与官方口径是否一致",
    ],
    image: "/images/gallery/building-04.jpg",
    imageAlt: "三高炉与冷却塔",
    imageCredit: "小组实地拍摄",
  },
  {
    id: "lake",
    number: "02",
    name: "秀池—群明湖",
    duration: "60 min",
    theme: "冷却—生态",
    description:
      "从工业循环水池到生态湖，观察“工业水体→生态水体”的转化。",
    observations: [
      "水面透明度、色度、异味与藻华",
      "潜流/表流湿地的基质、植物分层与水流",
      "透水铺装、植草沟、台层入水等雨洪设施",
      "亲水人群、鸟类与生态鸟岛",
    ],
    image: "/images/gallery/building-06.jpg",
    imageAlt: "群明湖与园区建筑",
    imageCredit: "资料图，来源于小组汇报 PPT，仅作课堂展示",
  },
  {
    id: "big-air",
    number: "03",
    name: "大跳台—冷却塔",
    duration: "40 min",
    theme: "景观—赛事",
    description:
      "观察工业天际线如何被尊重，以及赛后利用如何发生。",
    observations: [
      "跳台与四座冷却塔的高度关系",
      "赛道、裁判塔与耐火耐候钢的材料细节",
      "非赛事日的开放方式与活动信息",
      "夜景投影与工业构筑物的关系",
    ],
    image: "/images/gallery/building-13.jpg",
    imageAlt: "群明湖远眺大跳台",
    imageCredit: "资料图，来源于小组汇报 PPT，仅作课堂展示",
  },
  {
    id: "silos",
    number: "04",
    name: "筒仓 / 四块冰 / 六工汇",
    duration: "50 min",
    theme: "厂房—城市",
    description:
      "看办公、训练、商业怎样接续厂房功能，而不是把工业遗存抹平。",
    observations: [
      "筒仓、皮带廊等构件是否保留并参与新空间",
      "六工汇的入口、廊道与公共空间组织",
      "商业业态与工业主题的匹配度",
      "工作日与周末的人气差异",
    ],
    image: "/images/gallery/building-10.jpg",
    imageAlt: "园区厂房与冷却塔",
    imageCredit: "资料图，来源于小组汇报 PPT，仅作课堂展示",
  },
  {
    id: "high-point",
    number: "05",
    name: "石景山高点",
    duration: "40 min",
    theme: "全景—归纳",
    description:
      "把山、水、遗存、场馆放进同一张观察稿，完成一天的证据归纳。",
    observations: [
      "从高点回看园区的山水格局",
      "工业构筑物与城市天际线的同框",
      "功碑阁、金阁寺等古迹的维护状态",
      "当天的开放信息与导览标识",
    ],
    image: "/images/gallery/building-09.jpg",
    imageAlt: "园区高点回看",
    imageCredit: "资料图，来源于小组汇报 PPT，仅作课堂展示",
  },
];

export const lowCarbonRules = [
  "往返优先地铁与公共交通，园区内步行或骑行，不使用燃油观光车。",
  "自带水杯，减少一次性用品；按导览路线行进。",
  "不进入封闭区、不触碰设备、不遗留垃圾。",
  "拍摄遵循“远景关系＋构筑细节＋人的使用＋公示信息”四张原则。",
  "每条观察结论标注 A/B/C 证据等级，不把“好看”当作“生态成效”。",
  "离开前删掉无法解释的照片，给每条结论标等级，留下一句可执行的小行动。",
];
