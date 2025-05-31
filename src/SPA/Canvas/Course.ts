import { stringify } from '@groton/canvas-cli.utilities';
import { Options, paginatedCallback } from '../Utilities/paginatedCallback';
import * as Canvas from '@groton/canvas-cli.api';
import * as Client from './Client';

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

  public static async list({
    callback,
    params = {}
  }: Options<Course, Canvas.v1.Users.Courses.listSearchParameters> = {}) {
    const key = stringify(params);
    if (!(key in Course.lists)) {
      Course.lists[key] = await paginatedCallback<
        Canvas.Courses.Course,
        Course,
        Canvas.v1.Users.Courses.listSearchParameters
      >(
        '/canvas/api/v1/users/self/favorites/courses',
        (course: Canvas.Courses.Course) => new Course(course)
      )({ callback, params });
    } else if (callback) {
      for (const course of Course.lists[key]) {
        callback(course);
      }
    }
    return Course.lists[key];
  }

  public static async get(id: string | number) {
    if (!(id in this.cache)) {
      const course = await Client.Get<
        Canvas.Courses.Course,
        Canvas.v1.Courses.getPathParameters,
        Canvas.v1.Courses.getSearchParameters,
        never
      >({
        endpoint: '/canvas/api/v1/courses/:id',
        params: {
          path: { id: id.toString() }
        }
      });
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
