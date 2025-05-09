import { Assignment } from './Assignment';
import * as Calendar from './Calendar';
import { ClassMeeting } from './ClassMeeting';
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
    CustomColors.get();
    await Course.list();
    const calendar = Calendar.replaceContent(calendarElt, {
      eventClick: async (info) => {
        if (info.event.classNames.includes('planner_item')) {
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
        } else if (info.event.classNames.includes('class_meeting')) {
          await info.event.extendedProps.class_meeting.modal(info);
        }
      },
      viewClassNames: (info) => {
        ClassMeeting.list(info.view).then((classMeetings) => {
          for (const classMeeting of classMeetings) {
            calendar.addEvent(classMeeting.toEvent());
          }
        });
        return [];
      }
    });
    PlannerItem.list(async (item) => {
      if (item.isEvent()) {
        calendar.addEvent(item.toEvent());
      } else {
        if (item.done) {
          todoElt.querySelector('#done')?.appendChild(await item.toTodo());
        } else {
          todoElt
            .querySelector('#incomplete')
            ?.appendChild(await item.toTodo());
        }
      }
    });
  });
  document.addEventListener('hidden.bs.modal', () =>
    (this as HTMLElement | undefined)?.remove()
  );
})();
