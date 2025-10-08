import { EventClickArg } from '@fullcalendar/core';
import { render } from 'ejs';
import { Bootstrap, Canvas } from '../../Services';
import { BaseEvent } from '../BaseEvent';
import detail from './detail.ejs';

export class Assignment extends BaseEvent<{
  assignment: Canvas.Assignments.Assignment;
  section?: Canvas.Sections.Section;
}> {
  public get dueAt() {
    return this.start;
  }

  public static async fromAssignment(
    assignment: Canvas.Assignments.Assignment
  ) {
    if (assignment.overrides?.length && assignment.overrides.length > 0) {
      const assignments: Assignment[] = [];
      for (const override of assignment.overrides) {
        // TODO deal with individual student overrides
        if (override.course_section_id) {
          const start = override.all_day
            ? new Date(override.all_day_date)
            : new Date(override.due_at);
          assignments.push(
            new Assignment(
              `assignment_${assignment.id}-${override.course_section_id}`,
              assignment.name,
              start,
              start,
              !!override.all_day,
              {
                assignment,
                section: await Canvas.Sections.get({
                  course_id: assignment.course_id,
                  id: override.course_section_id
                })
              }
            )
          );
        }
      }
      return assignments;
    } else if (assignment.due_at) {
      return [
        new Assignment(
          `assignment_${assignment.id}`,
          assignment.name,
          new Date(assignment.due_at),
          new Date(assignment.due_at),
          false,
          { assignment }
        )
      ];
    }
    return [];
  }

  public async classNames(): Promise<string[]> {
    const classNames = [
      'Assignment',
      `course_${this.data.assignment.course_id}`
    ];
    if (this.data.section) {
      classNames.push(this.data.section.color);
    }
    return classNames;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async detail(info: EventClickArg) {
    return (
      await Bootstrap.Modal.create({
        ...Bootstrap.Modal.stackTitle(
          this.title,
          this.data.section
            ? this.data.section.name
            : (
                await Canvas.Courses.get(
                  this.data.assignment.course_id.toString()
                )
              ).name
        ),
        body: render(detail, this),
        classNames: await this.classNames()
      })
    ).elt;
  }
}
