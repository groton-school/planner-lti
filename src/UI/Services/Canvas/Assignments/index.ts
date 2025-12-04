import { Canvas } from '../../../CanvasAPIClient';
import { Course } from '../Courses';
import { Assignment } from './Assignment';

export * from './Assignment';

const cache: Record<string, Assignment> = {};

export async function get({
  course_id,
  id
}: Canvas.v1.Courses.Assignments.getPathParameters) {
  const key = JSON.stringify({ course_id, id });
  if (!(key in cache)) {
    cache[key] = Assignment.fromBase(
      await Canvas.v1.Courses.Assignments.get({
        pathParams: { course_id, id },
        searchParams: { include: ['submission'] }
      })
    );
  }
  return cache[key];
}

export async function listForTeacherOf(course: Course) {
  // TODO is it worthwhile to cache assignment lists?
  return (
    await Canvas.v1.Courses.Assignments.list({
      pathParams: { course_id: course.id },
      searchParams: {
        include: ['overrides', 'can_edit', 'score_statistics']
      }
    })
  ).map((assignment) => Assignment.fromBase(assignment));
}

export async function create(course: Course, data: Record<string, unknown>) {
  // TODO cache created assignment for reuse
  return Assignment.fromBase(
    await Canvas.v1.Courses.Assignments.create({
      pathParams: { course_id: course.id },
      params: {
        ...data,
        'assignment[grading_type]': 'not_graded',
        'assignment[submission_types]': ['none']
      }
    })
  );
}
