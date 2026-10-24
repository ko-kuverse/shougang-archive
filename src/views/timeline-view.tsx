import { FieldImage } from "@/components/ui/field-image";
import { PlateLabel, SectionHeader } from "@/components/ui/panel";
import { timeline, type TimelinePhase } from "@/data/timeline";
import { padNumber } from "@/lib/utils";

const phases: TimelinePhase[] = [
  "钢铁时代",
  "搬迁与转型",
  "冬奥与更新",
  "后冬奥",
];

const turns = [
  {
    index: "A",
    title: "从山到海",
    period: "2005—2010",
    description: "搬迁曹妃甸，产能退出北京，流程在沿海重构。",
  },
  {
    index: "B",
    title: "从火到冰",
    period: "2016—2022",
    description: "冬奥组委入驻，筒仓、厂房、冷却塔变成赛事与训练空间。",
  },
  {
    index: "C",
    title: "从厂到园",
    period: "2010—2026",
    description: "工业遗存分层保护，公共水岸、商业与科创内容持续导入。",
  },
];

export function TimelineView() {
  return (
    <main id="main" className="page-shell timeline-page">
      <header className="page-header blueprint-grid">
        <PlateLabel>[ TIMELINE / 1919—2025 ]</PlateLabel>
        <h1>时间线</h1>
        <p>
          一座钢城的百年时间轴：从石景山炼厂到冬奥赛场，再到后冬奥的城市功能区。
        </p>
      </header>

      <section className="turns-grid">
        {turns.map((turn) => (
          <article className="turn-card" key={turn.index}>
            <PlateLabel>TURN / {turn.index}</PlateLabel>
            <h2>{turn.title}</h2>
            <span className="turn-period">{turn.period}</span>
            <p>{turn.description}</p>
          </article>
        ))}
      </section>

      <div className="timeline-page-list">
        {phases.map((phase, phaseIndex) => {
          const events = timeline.filter((event) => event.phase === phase);
          if (events.length === 0) return null;

          return (
            <section className="timeline-phase" key={phase}>
              <div className="timeline-phase-head">
                <span className="timeline-phase-index">
                  {padNumber(phaseIndex + 1)}
                </span>
                <h2>{phase}</h2>
                <span className="timeline-phase-count">
                  {events.length} 个节点
                </span>
              </div>

              <div className="timeline-entries">
                {events.map((event) => (
                  <article
                    className="timeline-entry"
                    key={`${event.year}-${event.title}`}
                  >
                    <span className="timeline-entry-year">
                      {event.year}
                    </span>
                    <div className="timeline-entry-body">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      {event.image ? (
                        <figure className="timeline-entry-image">
                          <FieldImage
                            src={event.image}
                            alt={event.imageAlt ?? event.title}
                            className="timeline-entry-image-file"
                          />
                          {event.imageCaption ? (
                            <figcaption>
                              {event.imageCaption}
                            </figcaption>
                          ) : null}
                        </figure>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <SectionHeader
        eyebrow="[ NOTE ]"
        title="关于时间线"
        description="时间线依据小组调研报告整理；数据与引述来自公开来源，完整清单见“参考资料”。"
      />
    </main>
  );
}
