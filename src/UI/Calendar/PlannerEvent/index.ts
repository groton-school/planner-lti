import { render } from 'ejs';
import { PlannerItem } from '../../PlannerItem';
import { Bootstrap, Canvas } from '../../Services';
import { BaseEvent } from '../BaseEvent';
import detail from './detail.ejs';
import './styles.scss';
import toggleable from './toggleable.ejs';

export class PlannerEvent extends BaseEvent<{
  item: Canvas.Planner.PlannerItem;
}> {
  private toggleElt: HTMLInputElement | null | undefined = undefined;

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

  protected async classNames(): Promise<string[]> {
    const classNames = ['PlannerEvent'];
    if (this.data.item.course_id) {
      const course = await Canvas.Courses.get(this.data.item.course_id);
      // TODO differentiate planner items by relevant section
      classNames.push(course.context_code);
      if (course.sections.length === 1) {
        classNames.push(course.sections[0].context_code);
      }
    }
    if (this.data.item.done) {
      classNames.push('done');
    }
    return classNames;
  }

  public async detail() {
    if (!this.data.item.course_id) {
      throw new Error('Missing Course ID');
    }
    const { elt } = await Bootstrap.Modal.create({
      title: render(toggleable, {
        ...Bootstrap.Modal.stackTitle(
          `<span class="title">${this.title}</span>`,
          (await Canvas.Courses.get(this.data.item.course_id)).name
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

    this.toggleElt = elt?.querySelector<HTMLInputElement>(`#toggle-${this.id}`);
    if (this.toggleElt && this.toggleElt !== null) {
      this.toggleElt.checked = this.data.item.done;
      this.toggleElt.addEventListener('click', this.toggle.bind(this));
    }
    return elt;
  }

  public async toggle() {
    const header = this.toggleElt?.closest('.modal-header');
    if (this.toggleElt) {
      this.toggleElt.disabled = true;
      this.toggleElt.checked = await this.data.item.toggle();
      if (this.toggleElt.checked) {
        header?.classList.add(PlannerItem.Done);
        this.fcEvent?.setProp('classNames', [
          ...this.fcEvent.classNames,
          PlannerItem.Done
        ]);
      } else {
        header?.classList.remove(PlannerItem.Done);
        this.fcEvent?.setProp(
          'classNames',
          this.fcEvent.classNames.filter(
            (className) => className !== PlannerItem.Done
          )
        );
      }
      this.toggleElt.disabled = false;
    }
  }
}
