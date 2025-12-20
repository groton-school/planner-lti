import { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js';
import { Assignment, BaseEvent, CalendarEvent, ClassMeeting } from './Calendar';
import { PlannerItem } from './PlannerItem';
import { Canvas, FullCalendar, Google } from './Services';

async function init() {
  FullCalendar.setDatesSetHandler(datesSet);
  (await FullCalendar.instance).setOption('eventClick', eventClick);
  for (const course of await Canvas.Courses.list()) {
    if (course.isTeacher()) {
      (await Canvas.Assignments.listForTeacherOf(course)).map(
        async (assignment) =>
          (await Assignment.fromAssignment(assignment)).map(
            async (assignment) => assignment.addTo(await FullCalendar.instance)
          )
      );
    }
  }
}

async function eventClick(info: EventClickArg) {
  if (info.event.extendedProps?.model) {
    (info.event.extendedProps?.model as BaseEvent).detail(info);
  }
}

// TODO preload subsequent and previous timeframes
// Issue URL: https://github.com/groton-school/planner-lti/issues/66
async function datesSet(info: DatesSetArg) {
  const [events, items] = await Promise.all([
    await Google.Calendar.listEventsBetween(
      info.view.activeStart,
      info.view.activeEnd
    ),
    await Canvas.Planner.listItemsBetween(
      info.view.activeStart,
      info.view.activeEnd
    )
  ]);
  for (const event of events) {
    const section = await Canvas.Courses.findSection(event);
    if (section) {
      ClassMeeting.fromGoogleCalendarEventAndCanvasSection(
        event,
        section
      ).addTo(await FullCalendar.instance);
    } else {
      CalendarEvent.fromGoogleCalendarEvent(event).addTo(
        await FullCalendar.instance
      );
    }
  }
  for (const item of items) {
    new PlannerItem(item).addTo(await FullCalendar.instance);
  }
}

init();
