import { Canvas } from '@groton/canvas-api.client.web';
import { Course } from './Course';

export * from './Course';

const cache: Record<Course['id'], Course> = {};

export async function init() {
  await Promise.all(
    (
      await Canvas.v1.Courses.list({
        searchParams: {
          state: ['available'],
          include: ['sections', 'permissions']
        }
      })
    ).map(async (base) => {
      const course = await Course.fromBase(base);
      insert(course);
      return course;
    })
  );
}

export function list() {
  const courses = [];
  for (const id in cache) {
    if (id === cache[id].id) {
      courses.push(cache[id]);
    }
  }
  return courses;
}

function insert(course: Course) {
  cache[course.id] = course;
  if (course.sis_course_id) {
    cache[course.sis_course_id] = course;
  }
}

export async function findSection({
  sis_course_id,
  title
}: {
  sis_course_id?: string;
  title: string;
}) {
  for (const id in cache) {
    for (const section of cache[id]!.sections || []) {
      if (
        (sis_course_id && sis_course_id === section.sis_section_id) ||
        (title && title === section.name)
      ) {
        return section;
      }
    }
  }
  return undefined;
}

export async function get(id: string) {
  if (!(id in cache)) {
    // TODO unsafe for ID numbers > Number.MAX_SAFE_INTEGER (~2^53)
    if (parseInt(id).toString() != id) {
      id = `sis_course_id:${id}`;
    }
    insert(
      await Course.fromBase(await Canvas.v1.Courses.get({ pathParams: { id } }))
    );
  }
  return cache[id];
}
