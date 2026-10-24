import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { FieldImage } from "@/components/ui/field-image";
import { PlateLabel } from "@/components/ui/panel";
import { gallery } from "@/data/gallery";

export function GalleryView() {
  return (
    <main id="main" className="page-shell gallery-page">
      <header className="page-header blueprint-grid">
        <PlateLabel>[ FIELD PHOTOS / {gallery.length} ]</PlateLabel>
        <h1>实地图集</h1>
        <p>
          工业构筑、生态细节与在场的人。点击照片查看大图，
          也可以在“调研路线”里按五个点位重新阅读。
        </p>
      </header>

      <section className="gallery-map-section">
        <div className="gallery-map-head">
          <PlateLabel>[ SITE MAP / 首钢园区 ]</PlateLabel>
          <span>园区沙盘 · 五点位见“调研路线”</span>
        </div>
        <figure className="gallery-map-figure">
          <FieldImage
            src="/images/map/shougang-model.jpg"
            alt="首钢园区沙盘"
            className="gallery-map-image"
            eager
          />
          <figcaption>
            园区沙盘：高炉、群明湖、冷却塔与冬奥公园在同一张图上。
          </figcaption>
        </figure>
      </section>

      <GalleryGrid />
    </main>
  );
}
