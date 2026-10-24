import { FieldImage } from "@/components/ui/field-image";
import { PlateLabel, SectionHeader } from "@/components/ui/panel";
import { fieldNotes } from "@/data/field-notes";
import { team } from "@/data/team";
import { padNumber } from "@/lib/utils";

export function TeamView() {
  return (
    <main id="main" className="page-shell team-page">
      <header className="page-header blueprint-grid">
        <PlateLabel>[ TEAM / 2026.10.24 ]</PlateLabel>
        <h1>团队</h1>
        <p>
          一支由不同专业同学组成的调研小队。我们把课堂上的“两山”理念带到首钢园，
          用旅游地学与地球化学的视角做了一次跨学科观察。
        </p>
      </header>

      <section className="team-intro">
        <div className="team-photo">
          <FieldImage
            src={team.photo}
            alt={team.photoAlt}
            className="team-photo-image"
            eager
          />
        </div>
        <div className="team-copy">
          <PlateLabel>[ 两山实践调研队 ]</PlateLabel>
          <h2>{team.name}</h2>
          <p>{team.statement}</p>
          <dl className="team-facts">
            <div>
              <dt>课程</dt>
              <dd>{team.course}</dd>
            </div>
            <div>
              <dt>学校</dt>
              <dd>{team.school}</dd>
            </div>
            <div>
              <dt>学院</dt>
              <dd>{team.college}</dd>
            </div>
            {team.instructor && !team.instructor.includes("待补充") ? (
              <div>
                <dt>指导教师</dt>
                <dd>{team.instructor}</dd>
              </div>
            ) : null}
            <div>
              <dt>时间 / 地点</dt>
              <dd>
                {team.date} · {team.location}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="team-roles">
        <SectionHeader
          eyebrow="[ ROLES / 06 ]"
          title="分工"
          description="没有虚构的头衔，只有这次调研里实际发生的工作。"
        />
        <div className="team-role-grid">
          {team.roles.map((role, index) => (
            <article className="team-role" key={role.title}>
              <span className="team-role-index">
                {padNumber(index + 1)}
              </span>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="team-fieldnotes">
        <SectionHeader
          eyebrow="[ FIELD NOTES / 04 ]"
          title="现场手记"
          description="四个现场片段，记录园区里的尺度、接缝与人的使用。"
        />

        <div className="team-fieldnotes-grid">
          {fieldNotes.map((note) => (
            <article className="fieldnote-card" key={note.id}>
              <div className="fieldnote-media">
                <FieldImage
                  src={note.image}
                  alt={note.imageAlt}
                  className="fieldnote-image"
                />
              </div>
              <div className="fieldnote-body">
                <PlateLabel>{note.location}</PlateLabel>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="team-note">
        <PlateLabel>[ NOTE ]</PlateLabel>
        <p>{team.acknowledgements}</p>
        <p className="team-placeholder">
          指导教师与团队成员名单待补充；学校与学院信息已更新。
        </p>
      </section>
    </main>
  );
}
