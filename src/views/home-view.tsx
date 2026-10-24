import Link from "next/link";

import { ChapterCard } from "@/components/archive/chapter-card";
import { FieldImage } from "@/components/ui/field-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { LinkPlate } from "@/components/ui/link-plate";
import { PlateLabel, SectionHeader } from "@/components/ui/panel";
import { siteConfig } from "@/config/site";
import { featuredStats } from "@/data/stats";
import { gallery, type GalleryItem } from "@/data/gallery";
import { routePoints } from "@/data/route";
import { team } from "@/data/team";
import { timelineHighlights } from "@/data/timeline";
import { transformations } from "@/data/transformations";
import { getChapters } from "@/lib/content/docs";
import { withBasePath } from "@/lib/base-path";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { docsPath, localePath } from "@/lib/i18n/paths";

const galleryPreviewIds = [
  "building-15",
  "scenery-05",
  "scenery-06",
  "scenery-07",
  "scenery-08",
  "people-08",
];

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const chapters = getChapters(locale);
  const heroImage = withBasePath("/images/hero/main.jpg");
  const galleryPreview = galleryPreviewIds
    .map((id) => gallery.find((item) => item.id === id))
    .filter((item): item is GalleryItem => Boolean(item))
    .slice(0, 6);

  return (
    <main id="main" className="home">
      <section
        className="archive-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="archive-hero-shade" aria-hidden="true" />
        <div className="archive-hero-inner">
          <div className="archive-hero-top">
            <PlateLabel>{dict.home.eyebrow}</PlateLabel>
            <span className="archive-hero-coords">
              39.9087°N / 116.1847°E
            </span>
          </div>

          <h1 className="archive-hero-title">
            {dict.home.titleLines.map((line) => (
              <span key={line} className="archive-hero-title-line">
                {line}
              </span>
            ))}
          </h1>

          <p className="archive-hero-lede">{dict.home.description}</p>

          <div className="hero-actions">
            <LinkPlate href={docsPath(locale, ["why-shougang"])}>
              {dict.home.primaryCta}
              <ArrowRightIcon size={16} />
            </LinkPlate>
            <LinkPlate
              href={localePath(locale, "/gallery")}
              variant="ghost"
            >
              {dict.home.secondaryCta}
            </LinkPlate>
          </div>

          <div className="archive-hero-meta">
            <span>
              {siteConfig.school} · {siteConfig.college}
            </span>
            <span className="archive-hero-sep" aria-hidden="true">
              /
            </span>
            <span>{siteConfig.course}</span>
            <span className="archive-hero-sep" aria-hidden="true">
              /
            </span>
            <span>{siteConfig.location}</span>
            <span className="archive-hero-sep" aria-hidden="true">
              /
            </span>
            <span>{siteConfig.version}</span>
          </div>
        </div>

      </section>

      <div className="home-body">
        <section className="home-intro">
          <div className="home-intro-copy">
            <PlateLabel>[ THESIS / 00 ]</PlateLabel>
            <h2>
              “绿水青山就是金山银山”，
              <br />
              在一座百年钢城里怎样被看见？
            </h2>
            <p>
              从安吉余村到北京石景山，我们试图把一句宏大的理念放回具体的空间：
              看资源约束如何逼出搬迁，污染风险如何被治理，工业锈带如何变成公共水岸，
              生态投入又如何沉淀为可持续的绿色资产。
            </p>
            <p>
              这是一次由旅游地学与地球化学共同参与的观察。我们不做“网红打卡”的复述，
              只记录能核对的空间、数据与人的使用。
            </p>
            <blockquote className="home-thesis-quote">
              “绿水青山就是金山银山。”
              <cite>习近平，2005 年浙江安吉余村</cite>
            </blockquote>
          </div>

          <aside className="home-intro-note">
            <PlateLabel>[ FIELD NOTE / 2026.10 ]</PlateLabel>
            <p>
              沿着“生产—冷却—景观—赛事—商业”的动线，我们访问了五类点位，
              采集“远景关系、构筑细节、人的使用、公示信息”四类证据。
            </p>
            <Link href={localePath(locale, "/archive/method")}>
              阅读调研方法 <ArrowRightIcon size={14} />
            </Link>
          </aside>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="[ FRAMEWORK / 04 ]"
            title="四个转化"
            description="从约束到资产，首钢园把生态账本翻到了下一页。"
          />
          <div className="transformation-grid">
            {transformations.map((item) => (
              <article className="transformation-card" key={item.id}>
                <span className="transformation-number">
                  {item.number}
                </span>
                <div className="transformation-flow">
                  <span>{item.from}</span>
                  <span aria-hidden="true">→</span>
                  <span>{item.to}</span>
                </div>
                <p>{item.description}</p>
                <div className="transformation-evidence">
                  {item.evidence}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="[ DOSSIERS / 08 ]"
            title={dict.home.sections}
            description={dict.home.sectionsDescription}
          />
          <div className="chapter-grid">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.slug}
                locale={locale}
                doc={chapter}
              />
            ))}
          </div>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="[ TIMELINE / 03 ]"
            title="三次转身"
            description="从山到海、从火到冰、从厂到园。"
          />
          <div className="timeline-strip">
            {timelineHighlights.map((event) => (
              <Link
                key={event.year}
                href={localePath(locale, "/timeline")}
                className="timeline-strip-item"
              >
                <span className="timeline-year">{event.year}</span>
                <span className="timeline-title">{event.title}</span>
                <span className="timeline-desc">
                  {event.description}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={localePath(locale, "/timeline")}
            className="home-section-link"
          >
            查看完整时间线 <ArrowRightIcon size={14} />
          </Link>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="[ LEDGER / DATA ]"
            title="数据账本"
            description="把变化写成可以核对的数字。"
          />
          <div className="data-ledger">
            <div className="data-ledger-head">
              <PlateLabel>[ SITE DATA / 2026 ]</PlateLabel>
              <span>PUBLIC SOURCES</span>
            </div>
            <div className="data-ledger-grid">
              {featuredStats.map((stat) => (
                <div className="data-stat" key={stat.label}>
                  <span className="data-value">
                    {stat.value}
                    {stat.unit ? <small>{stat.unit}</small> : null}
                  </span>
                  <span className="data-label">{stat.label}</span>
                  <span className="data-note">{stat.note}</span>
                  <span className="data-source">{stat.source}</span>
                </div>
              ))}
            </div>
            <p className="data-ledger-foot">
              数据来自公开资料与小组调研报告；完整来源见
              <Link href={localePath(locale, "/sources")}>
                {" "}
                参考资料
              </Link>
              。
            </p>
          </div>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="[ FIELD PHOTOS ]"
            title="实地图集"
            description="工业构筑、生态细节与在场的人。"
          />
          <div className="gallery-preview">
            {galleryPreview.map((item) => (
              <Link
                key={item.id}
                href={localePath(locale, "/gallery")}
                className="gallery-preview-item"
              >
                <FieldImage
                  src={item.thumb}
                  alt={item.caption}
                  className="gallery-preview-image"
                />
                <span>{item.caption}</span>
              </Link>
            ))}
          </div>
          <Link
            href={localePath(locale, "/gallery")}
            className="home-section-link"
          >
            查看全部 {gallery.length} 张照片 <ArrowRightIcon size={14} />
          </Link>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="[ FIELD ROUTE ]"
            title="五点位调研路线"
            description="半日步行，从高炉到湖面，再回到高点归纳。"
          />
          <div className="route-strip">
            {routePoints.map((point) => (
              <Link
                key={point.id}
                href={localePath(locale, "/route")}
                className="route-strip-item"
              >
                <span className="route-strip-number">
                  {point.number}
                </span>
                <span className="route-strip-name">{point.name}</span>
                <span className="route-strip-theme">
                  {point.theme}
                </span>
                <span className="route-strip-duration">
                  {point.duration}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-closing-quote">
          <blockquote>
            “历史会镌刻下这一笔。”
            <cite>习近平，2022 年考察北京冬奥筹办</cite>
          </blockquote>
        </section>

        <section className="home-team">
          <div className="home-team-photo">
            <FieldImage
              src={team.photo}
              alt={team.photoAlt}
              className="home-team-image"
            />
          </div>
          <div className="home-team-copy">
            <PlateLabel>[ TEAM / 2026 ]</PlateLabel>
            <h2>一群把课堂搬到现场的人</h2>
            <p>{team.statement}</p>
            <div className="home-team-meta">
              {team.course} / {team.date}
            </div>
            <Link
              href={localePath(locale, "/team")}
              className="home-section-link"
            >
              认识调研队 <ArrowRightIcon size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
