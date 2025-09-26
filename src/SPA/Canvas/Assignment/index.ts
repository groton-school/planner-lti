import { EventClickArg, EventInput } from '@fullcalendar/core';
import { Canvas } from '@groton/canvas-api.client.web';
import bootstrap from 'bootstrap';
import * as FullCalendar from '../../FullCalendar';
import { isAllDay } from '../../Utilities';
import { render } from '../../Utilities/Views';
import { AssignmentGroup } from '../AssignmentGroup';
import * as Colors from '../Colors';
import { Course } from '../Course';
import { PlannerItem } from '../PlannerItem';
import createForm from './create.form.ejs';
import detailModal from './detail.modal.ejs';

export class Assignment {
  public static readonly CreatedEvent = 'assignment.created';
  private static readonly classNames = ['canvas', 'assignment'];
  private static cache: Record<string | number, Assignment> = {};

  public constructor(private assignment: Canvas.Assignments.Assignment) {
    Assignment.cache[assignment.id] = this;
  }

  public static async get({
    course_id,
    id
  }: Canvas.v1.Courses.Assignments.getPathParameters) {
    if (!(id in this.cache)) {
      const assignment = await Canvas.v1.Courses.Assignments.get({
        pathParams: { course_id, id },
        searchParams: { include: ['submission'] }
      });
      if (assignment) {
        this.cache[id] = new Assignment(assignment);
      }
    }
    return this.cache[id];
  }

  public static async post({
    course_id,
    ...form
  }: Canvas.v1.Courses.Assignments.createPathParameters &
    Canvas.v1.Courses.Assignments.createFormParameters) {
    const assignment = await Canvas.v1.Courses.Assignments.create({
      pathParams: { course_id },
      params: form
    });
    if (assignment) {
      const result = new Assignment(assignment);
      FullCalendar.addEvent(result.toEvent());
    }
  }

  public async detail(info: EventClickArg) {
    const planner_item = PlannerItem.fromAssignmentId(this.assignment.id);
    const modal = await render({
      template: detailModal,
      parent: document.body,
      data: {
        assignment: this.assignment,
        course: await Course.get(this.assignment.course_id),
        planner_item,
        consumer_instance_url
      }
    });

    if (planner_item) {
      modal
        .querySelector(`#mark-planner-item-complete`)
        ?.addEventListener('click', async () => {
          if (planner_item.done) {
            modal.querySelector('.modal-header')?.classList.remove('done');
            info.el.classList.remove('done');
            await planner_item.markIncomplete();
            if (planner_item.done) {
              info.el.classList.add('done');
              modal.querySelector('.modal-header')?.classList.add('done');
            }
          } else {
            modal.querySelector('.modal-header')?.classList.add('done');
            info.el.classList.add('done');
            await planner_item.markComplete();
            if (!planner_item.done) {
              info.el.classList.remove('done');
              modal.querySelector('.modal_header')?.classList.remove('done');
            }
          }
        });
    }

    new bootstrap.Modal(modal).show();
  }

  public static async createFrom({
    course,
    event,
    ...options
  }: {
    course: Course;
    event: EventClickArg['event'];
  } & Partial<Parameters<typeof render>[0]>) {
    const form = (await render({
      ...options,
      template: createForm,
      data: {
        consumer_instance_url,
        course,
        event,
        assignment_groups: await AssignmentGroup.list(course.id)
      }
    })) as HTMLFormElement;
    form.addEventListener('submit', async (e: SubmitEvent) => {
      if (e.submitter?.id === 'save') {
        e.stopImmediatePropagation();
        e.preventDefault();
        await Canvas.v1.Courses.Assignments.create({
          pathParams: { course_id: course.id },
          params: {
            ...form,
            'assignment[grading_type]': 'not_graded',
            'assignment[submission_types]': ['none']
          }
        });
        form.dispatchEvent(new Event(Assignment.CreatedEvent));
      }
    });
    return form;
  }

  public toEvent(): EventInput {
    return {
      id: `assignment_${this.assignment.id}`,
      title: this.assignment.name,
      start: new Date(this.assignment.due_at),
      allDay: isAllDay(this.assignment.due_at),
      classNames: [
        Colors.classNameFromCourseId(this.assignment.course_id),
        ...Assignment.classNames
      ]
    };
  }

  public static isAssociated(info: EventClickArg) {
    return Assignment.classNames.reduce(
      (assoc, className) => assoc && info.event.classNames.includes(className),
      true
    );
  }

  public static fromEventId(id: string) {
    return Assignment.cache[id.replace(/^assignment_/, '')];
  }
}
