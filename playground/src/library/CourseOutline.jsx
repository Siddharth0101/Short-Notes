import { Link } from 'react-router-dom';
import { courses } from '../data/curriculum.js';
import { noteById } from '../data/catalog.js';
import { useProgress } from '../lib/progressContext.js';
import Icon from './Icons.jsx';

export default function CourseOutline({ track, visibleNotes, renderNote }) {
  const { progress } = useProgress();
  const course = courses[track.id];
  const sequence = course.stages.flatMap((stage) => stage.chapters.map((id) => noteById[id]));
  const visible = new Set(visibleNotes.map((note) => note.id));
  const completed = sequence.filter((note) => progress.completed.includes(note.id)).length;
  const next = sequence.find((note) => !progress.completed.includes(note.id));
  return (
    <section className="course-outline" aria-label={`${track.name} course syllabus`}>
      <header className="course-heading">
        <div>
          <span className="card-overline">
            {course.stages.length} STAGES · {sequence.length} LESSONS
          </span>
          <h2>{track.name}</h2>
          <p>
            {track.id === 'interview'
              ? 'Choose the playbook for your completed subject, then practice its rounds.'
              : 'Start at lesson 01. Finish each stage checkpoint before moving forward.'}
          </p>
        </div>
        <Link className="primary-button" to={`/notes/${(next || sequence[0]).id}`}>
          <Icon name={next ? 'play' : 'reset'} size={16} />
          {next ? (completed ? 'Continue course' : 'Start course') : 'Review course'}
        </Link>
      </header>
      <div className="course-readiness">
        <span>
          {completed} / {sequence.length} lessons complete
        </span>
        <progress
          aria-label={`${track.name} course progress`}
          value={completed}
          max={sequence.length}
        />
        {course.prerequisites.length ? (
          <div>
            <strong>
              {track.id === 'interview' ? 'Readiness by subject: ' : 'Before this course: '}
            </strong>
            {course.prerequisites.map((id, i) => (
              <span key={id}>
                {i > 0 && ' · '}
                <Link to={`/notes/${id}`}>{noteById[id].title}</Link>
              </span>
            ))}
          </div>
        ) : (
          <p>No prior programming course required. Begin with the first lesson.</p>
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
                    STAGE {stageIndex + 1} · LESSONS {noteById[stage.chapters[0]].order}–
                    {noteById[stage.chapters.at(-1)].order}
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
                  <strong>Before the next stage:</strong> {stage.checkpoint}
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
        Practice interview questions after the course
      </Link>
    </section>
  );
}
