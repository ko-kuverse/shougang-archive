export type FieldNote = {
  id: string;
  title: string;
  location: string;
  text: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
};

/**
 * Display-oriented field notes. These are editorial observations based on
 * the team's field photographs and public materials — not verbatim
 * interviews. Keep the UI label "展示化整理" when rendering them.
 */
export const fieldNotes: FieldNote[] = [
  {
    id: "guide-map",
    title: "导览牌前的第一张地图",
    location: "永定河滨水空间 / 导览牌",
    text:
      "站在导览牌前，几位同学先找的不是打卡点，而是“永定河—群明湖—大跳台”的关系。园区的标识系统把山水、遗存与场馆放进同一张地图，这正是我们后来反复使用的“山—水—遗存—场馆”同框视角。",
    image: "/images/gallery/people-06.jpg",
    imageAlt: "调研小组在首钢园现场观察",
    imageCredit: "小组实地拍摄",
  },
  {
    id: "blast-furnace-scale",
    title: "抬头看三高炉",
    location: "三高炉 / 生产—遗产",
    text:
      "第一感受是尺度，而不是年代。炉体、料仓、廊道与热风炉在视线上连成一条生产链；数字博物馆的入口又把它拉回当下。遗产的可读性，往往就藏在这些还看得见的连接里。",
    image: "/images/gallery/building-03.jpg",
    imageAlt: "三高炉工业遗存",
    imageCredit: "小组实地拍摄",
  },
  {
    id: "sixgonghui-seam",
    title: "六工汇的接缝",
    location: "六工汇 / 厂房—城市",
    text:
      "店铺与旧厂房贴得很近：一边是玻璃幕墙和餐饮招牌，一边是锈色钢构与保留构件。工业主题在这里不是布景，而是空间组织的一部分；它是否可读，取决于人愿不愿意抬头看。",
    image: "/images/gallery/building-11.jpg",
    imageAlt: "园区商业与公共空间",
    imageCredit: "资料图，来源于小组汇报 PPT，仅作课堂展示",
  },
  {
    id: "public-use",
    title: "把游客拍进画面",
    location: "园区台阶 / 公共使用",
    text:
      "一位同学帮一群游客拍照。这个动作提醒我们：园区已经进入市民的日常。生态转型的成效不只在监测表里，也在“有人愿意来、愿意停留、愿意再来”的使用场景里。",
    image: "/images/gallery/people-01.jpg",
    imageAlt: "游客在首钢园台阶上合影",
    imageCredit: "小组实地拍摄",
  },
];
