import { Calendar } from '@fullcalendar/core';
import { PlannerEvent } from '../Calendar';
import { Canvas } from '../Services';
import './styles.scss';

export class PlannerItem {
  public static readonly Done = 'done';

  private event?: PlannerEvent;

  public constructor(private item: Canvas.Planner.PlannerItem) {
    // TODO handle with non-assignment planner items
    // TODO handle assignments without due dates
    if (item.plannable_type === 'assignment' && item.plannable.due_at) {
      this.event = PlannerEvent.fromAssignmentPlannerItem(item);
    }
  }

  public addTo(calendar: Calendar) {
    if (this.event) {
      this.event.addTo(calendar);
    } else {
      console.error('Could not add Planner Item to calendar', this);
    }
  }

  public async toggle() {
    return await this.item.toggle();
  }
}
