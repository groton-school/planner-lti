import { Canvas } from '@groton/canvas-api.client.web';

const minimalCourse = {
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
      Course.lists[key] = (
        await Canvas.v1.Courses.list({
          searchParams
        })
      ).map((c) => new Course(c));
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

  public get context_code() {
    return `course_${this.course.id}`;
  }

  public isTeacher(): boolean {
    return !!this.course.enrollments.find((e) => e.type === 'teacher');
  }

  public static fromName(name: string) {
    for (const id in this.cache) {
      if (this.cache[id].course.course_code == name) {
        return this.cache[id];
      }
    }
    return minimalCourse;
  }

  public static fromContextCode(context_code: string) {
    for (const id in this.cache) {
      if (context_code === `course_${id}`) {
        return this.cache[id];
      }
    }
    return minimalCourse;
  }
}
