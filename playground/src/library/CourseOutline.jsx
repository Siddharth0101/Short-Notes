import { NoteLink } from './Navigation.jsx';
import { Link } from 'react-router-dom';
import { useProgress } from '../lib/progressContext.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog } from '../lib/catalogContext.js';
import Icon from './Icons.jsx';

export default function CourseOutline({ track, visibleNotes, renderNote }) {
  const { progress } = useProgress();
  const { t } = useLang();
  const { courses, noteById } = useCatalog();
  const course = courses[track.id];
  const sequence = course.stages.flatMap((stage) => stage.chapters.map((id) => noteById[id]));
  const visible = new Set(visibleNotes.map((note) => note.id));
  const completed = sequence.filter((note) => progress.completed.includes(note.id)).length;
  const next = sequence.find((note) => !progress.completed.includes(note.id));
  return (
    <section
      className="course-outline"
      aria-label={t('course.syllabusLabel', { name: track.name })}
    >
      <header className="course-heading">
        <div>
          <span className="card-overline">
            {t('course.overline', { stages: course.stages.length, lessons: sequence.length })}
          </span>
          <h2>{track.name}</h2>
          <p>{track.id === 'interview' ? t('course.interviewLead') : t('course.lead')}</p>
        </div>
        <NoteLink className="primary-button" to={`/notes/${(next || sequence[0]).id}`}>
          <Icon name={next ? 'play' : 'reset'} size={16} />
          {next ? (completed ? t('course.continue') : t('course.start')) : t('course.revise')}
        </NoteLink>
      </header>
      <div className="course-readiness">
        <span>{t('course.lessonsComplete', { done: completed, total: sequence.length })}</span>
        <progress
          aria-label={t('course.progressLabel', { name: track.name })}
          value={completed}
          max={sequence.length}
        />
        {course.prerequisites.length ? (
          <div>
            <strong>
              {track.id === 'interview' ? t('course.prereqInterview') : t('course.prereq')}
            </strong>
            {course.prerequisites.map((id, i) => (
              <span key={id}>
                {i > 0 && ' · '}
                <NoteLink to={`/notes/${id}`}>{noteById[id].title}</NoteLink>
              </span>
            ))}
          </div>
        ) : (
          <p>{t('course.noPrereq')}</p>
        )}
      </div>
      <div className="course-stages">
        {course.stages.map((stage, stageIndex) => {
          const chapters = stage.chapters
            .map((id) => noteById[id])
            .filter((note) => visible.has(note.id));
          if (!chapters.length) return null;
          const done = stage.chapters.filter((id) => progress.completed.includes(id)).length;
          return (
            <section className="course-stage" key={stage.id} aria-labelledby={`stage-${stage.id}`}>
              <div className="course-stage-heading">
                <span className="stage-number">{String(stageIndex + 1).padStart(2, '0')}</span>
                <div>
                  <span className="card-overline">
                    {t('course.stageOverline', {
                      stage: stageIndex + 1,
                      from: noteById[stage.chapters[0]].order,
                      to: noteById[stage.chapters.at(-1)].order,
                    })}
                  </span>
                  <h3 id={`stage-${stage.id}`}>{stage.title}</h3>
                  <p>{stage.goal}</p>
                </div>
                <span className="stage-completion">
                  {done}/{stage.chapters.length}
                </span>
              </div>
              <div className="note-list">{chapters.map(renderNote)}</div>
              <div className="stage-checkpoint">
                <Icon name="check" size={18} />
                <p>
                  <strong>{t('course.checkpoint')}</strong> {stage.checkpoint}
                </p>
              </div>
            </section>
          );
        })}
      </div>
      <Link
        className="text-button"
        to={`/interview?track=${track.id === 'interview' ? 'all' : track.id}`}
      >
        <Icon name="messages" size={16} />
        {t('course.afterCourse')}
      </Link>
    </section>
  );
}
