import * as AssignmentGroups from '../AssignmentGroups';
import * as Sections from '../Sections';
import { BaseCourse } from './BaseCourse';

export class Course extends BaseCourse {
  public sections: Sections.Section[] = [];

  public get context_code() {
    return `course_${this.id}`;
  }

  private constructor(base: BaseCourse) {
    super();
    Object.assign(this, base);
  }

  // TODO find reliable way of ascertaining "user has permission to create assigments in this section"
  public isTeacher() {
    return !!this.enrollments.find(
      (enrollment) => enrollment.role === 'TeacherEnrollment'
    );
  }

  public static async fromBase(base: BaseCourse): Promise<Course> {
    const course = new Course(base);
    if (course.sections.length > 1) {
      course.sections = await Sections.listFor(course);
    } else if ('sections' in base && Array.isArray(base.sections)) {
      course.sections = base.sections.map((section) =>
        Sections.Section.fromBase({ ...section, course_id: course.id })
      );
    }
    if (course.isTeacher()) {
      AssignmentGroups.listFor(course);
    }
    return course;
  }
}
