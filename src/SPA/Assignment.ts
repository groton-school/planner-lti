import { EventClickArg } from '@fullcalendar/core';
import * as Canvas from '@groton/canvas-cli.api';
import { stringify } from '@groton/canvas-cli.utilities';
import bootstrap from 'bootstrap';
import detailModal from '../../views/ejs/Assignment/detail.modal.ejs';
import { Course } from './Course';
import { render } from './Views';

type Options = { course_id: string | number; assignment_id: string | number };

export class Assignment {
  private static cache: Record<string | number, Assignment> = {};

  private constructor(private assignment: Canvas.Assignments.Assignment) {
    Assignment.cache[assignment.id] = this;
  }

  public static async get({ course_id, assignment_id }: Options) {
    if (!(assignment_id in this.cache)) {
      return new Assignment(
        await (
          await fetch(
            `/canvas/api/v1/courses/${course_id}/assignments/${assignment_id}?${stringify(
              {
                'include[]': 'submission'
              }
            )}`
          )
        ).json()
      );
    }
    return this.cache[assignment_id];
  }

  public async detail(info: EventClickArg) {
    const markCompleteId = `${info.event.extendedProps.planner_item.plannable_type}_${info.event.extendedProps.planner_item.plannable_id}_complete`;
    const modal = await render({
      template: detailModal,
      parent: document.body,
      data: {
        markCompleteId,
        assignment: this.assignment,
        course: await Course.get(this.assignment.course_id),
        planner_item: info.event.extendedProps.planner_item,
        consumer_instance_url
      }
    });

    modal
      .querySelector(`#${markCompleteId}`)
      ?.addEventListener('click', async () => {
        if (info.event.extendedProps.planner_item.done) {
          modal.querySelector('.modal-header')?.classList.remove('done');
          info.el.classList.remove('done');
          await info.event.extendedProps.planner_item.markIncomplete();
          if (info.event.extendedProps.planner_item.done) {
            info.el.classList.add('done');
            modal.querySelector('.modal-header')?.classList.add('done');
          }
        } else {
          modal.querySelector('.modal-header')?.classList.add('done');
          info.el.classList.add('done');
          await info.event.extendedProps.planner_item.markComplete();
          if (!info.event.extendedProps.planner_item.done) {
            info.el.classList.remove('done');
            modal.querySelector('.modal_header')?.classList.remove('done');
          }
        }
      });
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
  }
}
