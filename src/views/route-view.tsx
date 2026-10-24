import { FieldImage } from "@/components/ui/field-image";
import { PlateLabel } from "@/components/ui/panel";
import { lowCarbonRules, routePoints } from "@/data/route";

export function RouteView() {
  return (
    <main id="main" className="page-shell route-page">
      <header className="page-header blueprint-grid">
        <PlateLabel>[ FIELD ROUTE / 05 POINTS ]</PlateLabel>
        <h1>调研路线</h1>
        <p>
          半日步行路线：从三高炉的生产空间，到群明湖的生态水岸，
          再到大跳台的赛事景观与高点回看。
        </p>
      </header>

      <section className="route-map" aria-label="五点位路线示意">
        <div className="route-map-line" aria-hidden="true" />
        {routePoints.map((point) => (
          <div className="route-map-node" key={point.id}>
            <span className="route-map-number">{point.number}</span>
            <span className="route-map-name">{point.name}</span>
            <span className="route-map-theme">{point.theme}</span>
          </div>
        ))}
      </section>

      <div className="route-points">
        {routePoints.map((point) => (
          <article className="route-point" key={point.id}>
            <div className="route-point-media">
              <FieldImage
                src={point.image}
                alt={point.imageAlt}
                className="route-point-image"
              />
              <span className="route-point-number">{point.number}</span>
            </div>
            <div className="route-point-body">
              <div className="route-point-head">
                <h2>{point.name}</h2>
                <span>{point.duration}</span>
              </div>
              <PlateLabel>{point.theme}</PlateLabel>
              <p>{point.description}</p>
              <ul className="route-observations">
                {point.observations.map((observation) => (
                  <li key={observation}>{observation}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <section className="route-rules">
        <div className="route-rules-head">
          <PlateLabel>[ LOW CARBON / 06 ]</PlateLabel>
          <h2>低碳公约</h2>
          <p>面向参观团队的行动约定，也适用于我们自己的每一次回访。</p>
        </div>
        <ul>
          {lowCarbonRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <p className="route-note">
        路线依据小组调研报告与附录 E 整理；开放状态、预约与动线以园区当日公告为准，
        不进入未开放区域。
      </p>
    </main>
  );
}
