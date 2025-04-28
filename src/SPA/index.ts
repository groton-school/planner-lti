import { Assignment } from './Assignment';
import * as Calendar from './Calendar';
import * as CustomColors from './Colors';
import { Course } from './Course';
import { PlannerItem } from './PlannerItem';
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
        switch (info.event.extendedProps.planner_item.plannable_type) {
          case 'assignment':
            return (
              await Assignment.get({
                course_id: info.event.extendedProps.planner_item.course_id,
                assignment_id:
                  info.event.extendedProps.planner_item.plannable_id
              })
            ).modal(info);
            break;
          default:
            console.log(info);
        }
      }
    });
    await PlannerItem.list((item) => {
      if (item.isEvent()) {
        calendar.addEvent(item.toEvent());
      }
    });
    (await Course.list()).map((course) => Assignment.list(course.id));
  });
})();
