import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Keep image processing single-threaded so a full re-run does not pin
// every CPU core on a laptop.
sharp.concurrency(1);

const ROOT = process.cwd();
const FIGURES = path.join(ROOT, "refer", "figures");
const PPT_MEDIA = path.join(ROOT, "refer", "extracted", "media", "ppt");
const OUT = path.join(ROOT, "public", "images");
const GALLERY_JSON = path.join(ROOT, "src", "data", "gallery.json");

const categories = [
  { key: "building", folder: "园区建筑", label: "园区建筑" },
  { key: "scenery", folder: "园区风景、科普展示", label: "园区风景" },
  { key: "people", folder: "人物", label: "人物" },
];

const pptImages = [
  {
    key: "reference-01",
    source: "image1.png",
    caption: "首钢园鸟瞰：高炉、办公区与冷却塔同框",
  },
  {
    key: "reference-02",
    source: "image2.png",
    caption: "六工汇：工业遗存里的商业与公共空间",
  },
  {
    key: "reference-03",
    source: "image3.png",
    caption: "大跳台与群明湖的秋日景观",
  },
  {
    key: "reference-04",
    source: "image4.png",
    caption: "夜色中的大跳台与冷却塔投影",
  },
];

const chapterSources = {
  "01": path.join(PPT_MEDIA, "image1.png"),
  "02": path.join(FIGURES, "人物", "262868c8a82d91800993731cfb0df9eb.jpg"),
  "03": path.join(FIGURES, "园区建筑", "0c1afcf8d41949ccdf8d7b9a1f05a33f.jpg"),
  "04": path.join(FIGURES, "园区建筑", "0c49ad729c0166db80cc374734f0ae33.jpg"),
  "05": path.join(PPT_MEDIA, "image3.png"),
  "06": path.join(PPT_MEDIA, "image4.png"),
  "07": path.join(PPT_MEDIA, "image2.png"),
  "08": path.join(FIGURES, "人物", "957382d3b37b260565fd20979cd50f4e.jpg"),
};

const heroSource = path.join(
  FIGURES,
  "园区建筑",
  "2dd41f441ef6a60b99d6e56ead782eb8.jpg",
);
const teamSource = path.join(FIGURES, "人物", "49f0b1d6fb7f72a163327cfcded70f8c.jpg");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimize(source, target, width, quality = 82) {
  await ensureDir(path.dirname(target));
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(target);
}

async function listImages(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  return files
    .filter((entry) => entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en"));
}

async function main() {
  const gallery = [];

  for (const category of categories) {
    const sourceDir = path.join(FIGURES, category.folder);
    const files = await listImages(sourceDir);

    for (let index = 0; index < files.length; index += 1) {
      const source = path.join(sourceDir, files[index]);
      const number = String(index + 1).padStart(2, "0");
      const id = `${category.key}-${number}`;
      const full = path.join(OUT, "gallery", `${id}.jpg`);
      const thumb = path.join(OUT, "gallery", `${id}-thumb.jpg`);

      await optimize(source, full, 1400, 80);
      await optimize(source, thumb, 480, 72);

      const caption =
        category.key === "building"
          ? `首钢园工业遗存 · 实地记录 ${number}`
          : category.key === "scenery"
            ? `园区生态与科普展示 · 实地记录 ${number}`
            : `调研小组现场记录 ${number}`;

      gallery.push({
        id,
        category: category.label,
        src: `/images/gallery/${id}.jpg`,
        thumb: `/images/gallery/${id}-thumb.jpg`,
        caption,
        credit: "小组实地拍摄",
      });
    }
  }

  for (const image of pptImages) {
    const source = path.join(PPT_MEDIA, image.source);
    if (!(await fs.stat(source).catch(() => null))) continue;

    const full = path.join(OUT, "gallery", `${image.key}.jpg`);
    const thumb = path.join(OUT, "gallery", `${image.key}-thumb.jpg`);
    await optimize(source, full, 1600, 82);
    await optimize(source, thumb, 520, 74);

    gallery.push({
      id: image.key,
      category:
        image.key === "reference-01" || image.key === "reference-02"
          ? "园区建筑"
          : "园区风景",
      src: `/images/gallery/${image.key}.jpg`,
      thumb: `/images/gallery/${image.key}-thumb.jpg`,
      caption: image.caption,
      credit: "资料图，来源于小组汇报 PPT，仅作课堂展示",
    });
  }

  await optimize(heroSource, path.join(OUT, "hero", "main.jpg"), 2000, 82);
  await optimize(teamSource, path.join(OUT, "team", "group.jpg"), 1200, 82);

  for (const [number, source] of Object.entries(chapterSources)) {
    const output = path.join(OUT, "chapters", `${number}.jpg`);
    await optimize(source, output, 1600, 82);
  }

  await ensureDir(path.dirname(GALLERY_JSON));
  await fs.writeFile(GALLERY_JSON, JSON.stringify(gallery, null, 2));

  console.log(`Optimized ${gallery.length} gallery images, 8 chapter covers, hero, team photo.`);
  console.log(`Gallery data: ${GALLERY_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
