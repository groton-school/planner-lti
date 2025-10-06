import { Canvas } from '@groton/canvas-api.client.web';
import { Section } from './Section';

export * from './Section';

const cache: Record<string, Section> = {};

export async function get({
  course_id,
  id
}: Canvas.v1.Courses.Sections.getPathParameters) {
  const key = JSON.stringify({ course_id, id });
  if (!(key in cache)) {
    cache[key] = Section.fromBase(
      await Canvas.v1.Courses.Sections.get({ pathParams: { course_id, id } })
    );
  }
  return cache[key];
}

export async function listFor(course_id: string) {
  const sections = (
    await Canvas.v1.Courses.Sections.list({ pathParams: { course_id } })
  ).map((base) => Section.fromBase(base));
  for (const section of sections) {
    cache[JSON.stringify({ course_id: section.course_id, id: section.id })] =
      section;
  }
  return sections;
}
