import { EventClickArg } from '@fullcalendar/core';
import bootstrap from 'bootstrap';
import { render } from '../../Utilities/Views';
import * as Canvas from '../Canvas';
import * as Client from '../Client';
import { Course } from '../Course';
import { PlannerItem } from '../PlannerItem';
import detailModal from './detail.modal.ejs';

export class Assignment {
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
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
  }
}
