import { Canvas } from '../../CanvasAPIClient';
import { Course } from './Courses';

const cache: Record<Course['id'], Canvas.AssignmentGroups.AssignmentGroup[]> =
  {};

// TODO improve efficiency by requesting assignment groups with included assignments
// Issue URL: https://github.com/groton-school/planner-lti/issues/84
export async function listFor(course: Course) {
  if (!(course.id in cache)) {
    cache[course.id] = await Canvas.v1.Courses.AssignmentGroups.list({
      pathParams: { course_id: course.id }
    });
  }
  return cache[course.id] || [];
}
