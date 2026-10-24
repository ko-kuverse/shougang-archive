import { PlateLabel, SectionHeader } from "@/components/ui/panel";
import { evidenceRules } from "@/data/evidence";
import { references } from "@/data/references";
import { padNumber } from "@/lib/utils";

export function SourcesView() {
  return (
    <main id="main" className="page-shell sources-page">
      <header className="page-header blueprint-grid">
        <PlateLabel>[ SOURCES / {references.length} ]</PlateLabel>
        <h1>参考资料</h1>
        <p>
          公开数据与文献。网站内容以小组调研报告为底稿，
          所有关键判断尽量回到可核对的来源。
        </p>
      </header>

      <section className="sources-evidence">
        <SectionHeader
          eyebrow="[ EVIDENCE / A-B-C ]"
          title="证据分级"
          description="沿用调研报告的 A/B/C 规则：不把观感当成结论，也不把单一来源写成定论。"
        />
        <div className="evidence-grid">
          {evidenceRules.map((rule) => (
            <article className="evidence-card" key={rule.grade}>
              <span className="evidence-grade">{rule.grade}</span>
              <h3>{rule.title}</h3>
              <p>{rule.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sources-references">
        <SectionHeader
          eyebrow="[ REFERENCES ]"
          title="参考文献"
          description="引用信息来自小组调研报告；链接以原始来源为准，如失效请以文献题名为准检索。"
        />
        <ol className="source-list">
          {references.map((reference) => (
            <li id={`ref-${reference.id}`} key={reference.id}>
              <span className="source-id">
                [{padNumber(reference.id)}]
              </span>
              <span className="source-text">
                {reference.text}
                {reference.url ? (
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    原文链接 ↗
                  </a>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </section>

    </main>
  );
}
