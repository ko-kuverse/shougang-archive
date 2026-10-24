import galleryJson from "./gallery.json";

export type GalleryCategory = "园区建筑" | "园区风景" | "人物";

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  src: string;
  thumb: string;
  caption: string;
  credit: string;
};

export const gallery = galleryJson as GalleryItem[];

export const galleryCategories = [
  "全部",
  "园区建筑",
  "园区风景",
  "人物",
] as const;
