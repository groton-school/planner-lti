import { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js';
import { Assignment, BaseEvent, CalendarEvent, ClassMeeting } from './Calendar';
import { PlannerItem } from './PlannerItem';
import { Canvas, FullCalendar, Google, init as servicesInit } from './Services';

export async function init() {
  await servicesInit({ options: { datesSet, eventClick } });
  for (const course of Canvas.Courses.list()) {
    if (course.isTeacher()) {
      (await Canvas.Assignments.listForTeacherOf(course)).map(
        async (assignment) =>
          (await Assignment.fromAssignment(assignment)).map((assignment) =>
            assignment.addTo(FullCalendar.getInstance())
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
      ).addTo(FullCalendar.getInstance());
    } else {
      CalendarEvent.fromGoogleCalendarEvent(event).addTo(
        FullCalendar.getInstance()
      );
    }
  }
  for (const item of items) {
    new PlannerItem(item).addTo(FullCalendar.getInstance());
  }
}
