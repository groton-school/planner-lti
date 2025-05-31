import { EventClickArg, EventInput } from '@fullcalendar/core';
import bootstrap from 'bootstrap';
import * as FullCalendar from '../../FullCalendar';
import { isAllDay } from '../../Utilities';
import { render } from '../../Utilities/Views';
import { AssignmentGroup } from '../AssignmentGroup';
import * as Canvas from '@groton/canvas-cli.api';
import * as Client from '../Client';
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
      const assignment = await Client.Get<Canvas.Assignments.Assignment>({
        endpoint: '/canvas/api/v1/courses/:course_id/assignments/:id',
        params: {
          path: { course_id, id },
          query: { include: ['submission'] }
        }
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
    const assignment = await Client.Post<
      Canvas.Assignments.Assignment,
      Canvas.v1.Courses.Assignments.createPathParameters,
      never,
      Canvas.v1.Courses.Assignments.createFormParameters
    >({
      endpoint: '/canvas/api/v1/courses/:course_id/assignments',
      params: {
        path: { course_id },
        form
      }
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
        assignment_groups: await AssignmentGroup.list({
          course_id: course.id.toString()
        })
      }
    })) as HTMLFormElement;
    form.addEventListener('submit', (e: SubmitEvent) => {
      if (e.submitter?.id === 'save') {
        e.stopImmediatePropagation();
        e.preventDefault();
        Assignment.post({
          course_id: course.id.toString(),
          ...Client.asParams<Canvas.v1.Courses.Assignments.createFormParameters>(
            { form, container: 'assignment' }
          ),
          'assignment[grading_type]': 'not_graded',
          'assignment[submission_types]': ['none']
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
