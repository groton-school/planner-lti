import { EventClickArg } from '@fullcalendar/core';
import { render } from 'ejs';
import { Bootstrap, Canvas } from '../../Services';
import { BaseEvent } from '../BaseEvent';
import detail from './detail.ejs';
import toggleable from './toggleable.ejs';

export class PlannerEvent extends BaseEvent<{
  item: Canvas.Planner.PlannerItem;
}> {
  public static fromAssignmentPlannerItem(item: Canvas.Planner.PlannerItem) {
    return new PlannerEvent(
      `${item.plannable_type}_${item.plannable.id}`,
      item.plannable.title,
      new Date(item.plannable.due_at),
      new Date(item.plannable.due_at),
      false,
      { item }
    );
  }

  public async detail(info: EventClickArg) {
    if (!this.data.item.course_id) {
      throw new Error('Missing Course ID');
    }
    const { elt } = await Bootstrap.Modal.create({
      title: render(toggleable, {
        ...Bootstrap.Modal.stackTitle(
          `<span class="title">${this.title}</span>`,
          (await Canvas.Courses.get(this.data.item.course_id.toString())).name
        ),
        id: this.id
      }),
      titleClassNames: ['d-flex'],
      body: render(detail, {
        assignment: await Canvas.Assignments.get({
          course_id: this.data.item.course_id,
          id: this.data.item.plannable.id.toString()
        })
      }),
      classNames: await this.classNames()
    });

    const toggle = elt?.querySelector(`#toggle-${this.id}`) as HTMLInputElement;
    toggle.checked = this.data.item.done;
    toggle.addEventListener('click', async () => {
      toggle.disabled = true;
      toggle.checked = await this.data.item.toggle();
      if (toggle.checked) {
        info.el.classList.add('done');
        elt?.classList.add('done');
      } else {
        info.el.classList.remove('done');
        elt?.classList.remove('done');
      }
      toggle.disabled = false;
    });

    return elt;
  }

  protected async classNames(): Promise<string[]> {
    const classNames = ['PlannerEvent'];
    if (this.data.item.course_id) {
      // TODO differentiate planner items by relevant section
      classNames.push(`course_${this.data.item.course_id}`);
    }
    if (this.data.item.done) {
      classNames.push('done');
    }
    return classNames;
  }
}
