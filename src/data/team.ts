import { siteConfig } from "@/config/site";

export type TeamRole = {
  title: string;
  description: string;
};

export const team = {
  name: "两山实践调研队",
  course: siteConfig.course,
  school: siteConfig.school,
  college: siteConfig.college,
  instructor: "XXX（待补充）",
  date: "2026 年 10 月 24 日",
  location: siteConfig.location,
  statement:
    "这次调研让我们第一次把课堂上的“两山”理念放进一座具体的工业遗存里理解：资源如何被重新计算，风险如何被治理，空间如何被重新使用。我们尝试用旅游地学与地球化学的视角，把“看得见的变化”整理成“说得清的证据”。",
  photo: "/images/team/group.jpg",
  photoAlt: "两山实践调研队在首钢园",
  roles: [
    {
      title: "调研统筹",
      description: "路线、分工、进度与现场协调。",
    },
    {
      title: "实地观测",
      description: "五点位观察、影像记录与现场核销。",
    },
    {
      title: "地球化学",
      description: "炉渣、土壤与水质指标的物质视角。",
    },
    {
      title: "旅游地学",
      description: "资源识别、产品评价与案例比较。",
    },
    {
      title: "资料与文献",
      description: "公开来源、数据核验与引用整理。",
    },
    {
      title: "设计与呈现",
      description: "网站、图表、视觉与最终汇报。",
    },
  ] as TeamRole[],
  acknowledgements:
    "感谢小组全体成员的实地走访、资料整理与相互校对。本网站为课程社会实践展示。",
};
