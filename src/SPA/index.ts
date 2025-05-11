import { Assignment } from './Assignment';
import * as Calendar from './Calendar';
import { CalendarEvent } from './CalendarEvent';
import { ClassMeeting } from './ClassMeeting';
import * as CustomColors from './Colors';
import { Course } from './Course';
import { PlannerItem } from './PlannerItem';
import './styles.scss';

(async () => {
  document.addEventListener('DOMContentLoaded', async () => {
    const todoElt = document.querySelector('#todo');
    if (!todoElt) {
      throw new Error(`Missing #todo element`);
    }
    CustomColors.get();
    await Course.list();
    Calendar.replaceContent('#calendar', {
      eventClick: async (info) => {
        if (info.event.classNames.includes('planner_item')) {
          const plannerItem = info.event.extendedProps
            .planner_item as PlannerItem;
          switch (plannerItem.plannable_type) {
            case 'assignment':
              return (
                await Assignment.get({
                  course_id: plannerItem.course_id!,
                  assignment_id: plannerItem.plannable_id
                })
              ).detail(info);
              break;
            default:
              console.log(info);
          }
        } else if (info.event.classNames.includes('class_meeting')) {
          await (info.event.extendedProps.class_meeting as ClassMeeting).detail(
            info
          );
        }
      },
      datesSet: (info) => {
        ClassMeeting.list({
          params: {
            timeMin: info.view.activeStart.toISOString(),
            timeMax: info.view.activeEnd.toISOString()
          }
        }).then((classMeetings) => {
          for (const classMeeting of classMeetings) {
            Calendar.addEvent(classMeeting.toEvent());
          }
        });
        Course.list().then((courses) => {
          for (let i = 0; i < courses.length; i += 10) {
            CalendarEvent.list({
              params: {
                context_codes: courses
                  .slice(i, i + 10)
                  .map((course) => course.context_code),
                type: 'assignment',
                start_date: info.view.activeStart.toISOString(),
                end_date: info.view.activeEnd.toISOString()
              },
              callback: (calendarEvent) => {
                Calendar.addEvent(calendarEvent.toEvent());
              }
            });
          }
        });
      }
    });
    PlannerItem.list({
      callback: async (item) => {
        if (item.isEvent()) {
          Calendar.addEvent(await item.toEvent());
        } else {
          if (item.done) {
            todoElt.querySelector('#done')?.appendChild(await item.toTodo());
          } else {
            todoElt
              .querySelector('#incomplete')
              ?.appendChild(await item.toTodo());
          }
        }
      }
    });
  });
  document.addEventListener('hidden.bs.modal', () =>
    (this as HTMLElement | undefined)?.remove()
  );
})();
