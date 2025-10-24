import { Canvas } from '@groton/canvas-api.client.web';
import { CanvasReadyEvent } from '../CanvasReady';
import { Course } from './Course';

export * from './Course';

type Cache = Record<Course['id'], Course>;

const cache = new Promise<Cache>((resolve) => {
  document.addEventListener(CanvasReadyEvent.name, async () => {
    resolve(
      (
        await Promise.all(
          (
            await Canvas.v1.Courses.list({
              searchParams: {
                state: ['available'],
                include: ['sections', 'permissions']
              }
            })
          )
            .filter((c) =>
              c.enrollments.reduce(
                (participant, enrollment) =>
                  participant ||
                  enrollment.type === 'student' ||
                  enrollment.type === 'teacher',
                false
              )
            )
            .map(async (base) => Course.fromBase(base))
        )
      ).reduce((cache, course) => {
        cache[course.id] = course;
        return cache;
      }, {} as Cache)
    );
  });
});

export async function list() {
  const courses: Course[] = [];
  for (const id in await cache) {
    if (id === (await cache)[id].id) {
      courses.push((await cache)[id]);
    }
  }
  return courses;
}

export async function findSection({
  sis_course_id,
  title
}: {
  sis_course_id?: string;
  title: string;
}) {
  for (const id in await cache) {
    for (const section of (await cache)[id]!.sections || []) {
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

export async function get(id: string | number) {
  if (!(id in (await cache))) {
    const course = await Course.fromBase(
      await Canvas.v1.Courses.get({ pathParams: { id } })
    );
    (await cache)[course.id] = course;
  }
  return (await cache)[id];
}
