import { Canvas } from '@groton/canvas-api.client.web';
import * as Google from '../Google';

const undefinedCourse = {
  id: undefined,
  isTeacher: () => false,
  context_code: 'course_undefined'
};

export class Course {
  private static cache: Record<string | number, Course> = {};

  private static lists: Record<string, Course[]> = {};

  private constructor(private course: Canvas.Courses.Course) {
    Course.cache[course.id] = this;
  }

  public static async list(
    searchParams: Canvas.v1.Courses.listSearchParameters = {},
    callback?: (c: Course) => unknown
  ) {
    const key = JSON.stringify(searchParams);
    if (!(key in Course.lists)) {
      Course.lists[key] = await Promise.all(
        (
          await Canvas.v1.Courses.list({
            searchParams
          })
        ).map(async (c) => {
          // TODO sections is an (optional) property of a course
          // @ts-expect-error 2339
          if (c.sections?.length > 1) {
            // @ts-expect-error 2339
            c.sections = await Canvas.v1.Courses.Sections.list({
              pathParams: { course_id: c.id }
            });
            // @ts-expect-error 2339
          } else if (c.sections?.length == 1) {
            // @ts-expect-error 2339
            c.sections![0].sis_section_id = c.sis_course_id;
          }
          return new Course(c);
        })
      );
    }
    if (callback) {
      for (const course of Course.lists[key]) {
        callback(course);
      }
    }
    return Course.lists[key];
  }

  public static async get(id: string | number) {
    if (!(id in this.cache)) {
      const course = await Canvas.v1.Courses.get({ pathParams: { id } });
      if (course) {
        this.cache[id] = new Course(course);
      }
    }
    return this.cache[id];
  }

  public get id() {
    return this.course.id;
  }

  public get course_code() {
    return this.course.course_code;
  }

  public get name() {
    return this.course.name;
  }

  public get sis_course_id() {
    return this.course.sis_course_id;
  }

  public get context_code() {
    return `course_${this.course.id}`;
  }

  public isTeacher(): boolean {
    return !!this.course.enrollments.find((e) => e.type === 'teacher');
  }

  public static fromGoogleCalendarEvent(event: Google.CalendarEvent) {
    for (const id in this.cache) {
      if (
        this.cache[id].sis_course_id == event.sis_course_id ||
        this.cache[id].course_code == event.title
      ) {
        return this.cache[id];
      }
      let section: Canvas.Sections.Section;
      // @ts-expect-error 2339
      for (section of this.cache[id].course.sections || []) {
        if (
          section.sis_section_id == event.sis_course_id ||
          section.name == event.title
        ) {
          return this.cache[id];
        }
      }
    }
    return undefinedCourse;
  }

  public static fromContextCode(context_code: string) {
    for (const id in this.cache) {
      if (context_code === `course_${id}`) {
        return this.cache[id];
      }
    }
    return undefinedCourse;
  }
}
