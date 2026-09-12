import curriculum from '../../../notes/curriculum.json';

export const courses = curriculum;
export const chapterPlacement = Object.fromEntries(
  Object.entries(courses).flatMap(([track, course]) => {
    let lesson = 0;
    return course.stages.flatMap((stage, stageIndex) =>
      stage.chapters.map((id) => [
        id,
        { track, stage, stageNumber: stageIndex + 1, lessonNumber: ++lesson },
      ]),
    );
  }),
);
