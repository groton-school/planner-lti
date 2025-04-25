import { Assignment } from './Assignment';
import * as Calendar from './Calendar';
import * as CustomColors from './Colors';
import { PlannerItem } from './PlannerItem';
import { TodoItem } from './TodoItem';
import './styles.scss';

(async () => {
  document.addEventListener('DOMContentLoaded', async () => {
    const calendarElt = document.querySelector('#calendar');
    const todoElt = document.querySelector('#todo');
    if (!calendarElt) {
      throw new Error(`Missing #calendar element`);
    }
    if (!todoElt) {
      throw new Error(`Missing #todo element`);
    }
    await CustomColors.get();
    const calendar = Calendar.replaceContent(calendarElt, {
      eventClick: async (info) => {
        switch (info.event.extendedProps.plannable_type) {
          case 'assignment':
            return (
              await Assignment.get({
                course_id: info.event.extendedProps.course_id,
                assignment_id: info.event.extendedProps.plannable_id
              })
            ).modal();
            break;
          default:
            console.log(info);
        }
      }
    });
    await PlannerItem.list((item) => {
      calendar.addEvent(item.toEvent());
    });
    await TodoItem.list((item) => {
      if (!item.hasDate()) {
        todoElt.appendChild(item.card());
      }
    });
  });
})();
