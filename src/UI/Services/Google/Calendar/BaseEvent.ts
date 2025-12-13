import { calendar_v3 } from '@googleapis/calendar';

export class BaseEvent implements calendar_v3.Schema$Event {
  /**
   * Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean | null;
  /**
   * File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There
   * can be at most 25 attachments per event,
   */
  attachments?: calendar_v3.Schema$EventAttachment[];
  /**
   * The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users.
   * Service accounts need to use domain-wide delegation of authority to
   * populate the attendee list.
   */
  attendees?: calendar_v3.Schema$EventAttendee[];
  /**
   * Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a
   * restriction specified by the maxAttendee query parameter. When
   * updating an event, this can be used to only update the participant's
   * response. Optional. The default is False.
   */
  attendeesOmitted?: boolean | null;
  /**
   * Birthday or special event data. Used if eventType is "birthday".
   * Immutable.
   */
  birthdayProperties?: calendar_v3.Schema$EventBirthdayProperties;
  /**
   * The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint).
   * Optional.
   */
  colorId?: string | null;
  /**
   * The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest
   * field. To persist your changes, remember to set the
   * conferenceDataVersion request parameter to 1 for all event
   * modification requests.
   */
  conferenceData?: calendar_v3.Schema$ConferenceData;
  /** Creation time of the event (as a RFC3339 timestamp). Read-only. */
  created?: string | null;
  /** The creator of the event. Read-only. */
  creator?: {
    displayName?: string;
    email?: string;
    id?: string;
    self?: boolean;
  } | null;
  /** Description of the event. Can contain HTML. Optional. */
  description?: string | null;
  /**
   * The (exclusive) end time of the event. For a recurring event, this is
   * the end time of the first instance.
   */
  end?: calendar_v3.Schema$EventDateTime;
  /**
   * Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to
   * True. The default is False.
   */
  endTimeUnspecified?: boolean | null;
  /** ETag of the resource. */
  etag?: string | null;
  /**
   * Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "birthday" - A special all-day event with an annual recurrence.
   * - "default" - A regular event or not further specified.
   * - "focusTime" - A focus-time event.
   * - "fromGmail" - An event from Gmail. This type of event cannot be
   *   created.
   * - "outOfOffice" - An out-of-office event.
   * - "workingLocation" - A working location event.
   */
  eventType?: string | null;
  /** Extended properties of the event. */
  extendedProperties?: {
    private?: {
      [key: string]: string;
    };
    shared?: {
      [key: string]: string;
    };
  } | null;
  /** Focus Time event data. Used if eventType is focusTime. */
  focusTimeProperties?: calendar_v3.Schema$EventFocusTimeProperties;
  /**
   * A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar
   * metadata.
   */
  gadget?: {
    display?: string;
    height?: number;
    iconLink?: string;
    link?: string;
    preferences?: {
      [key: string]: string;
    };
    title?: string;
    type?: string;
    width?: number;
  } | null;
  /**
   * Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean | null;
  /**
   * Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean | null;
  /**
   * Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean | null;
  /**
   * An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string | null;
  /**
   * An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string | null;
  /**
   * Event unique identifier as defined in RFC5545. It is used to uniquely
   * identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the
   * id are not identical and only one of them should be supplied at event
   * creation time. One difference in their semantics is that in recurring
   * events, all occurrences of one event have different ids while they
   * all share the same iCalUIDs. To retrieve an event using its iCalUID,
   * call the events.list method using the iCalUID parameter. To retrieve
   * an event using its id, call the events.get method.
   */
  iCalUID?: string | null;
  /**
   * Opaque identifier of the event. When creating new single or recurring
   * events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - Characters allowed in the ID are those used in base32hex encoding,
   *   i.e. lowercase letters a-v and digits 0-9, see section 3.1.2 in
   *   RFC2938
   * - The length of the ID must be between 5 and 1024 characters
   * - The ID must be unique per calendar Due to the globally distributed
   *   nature of the system, we cannot guarantee that ID collisions will
   *   be detected at event creation time. To minimize the risk of
   *   collisions we recommend using an established UUID algorithm such as
   *   one described in RFC4122. If you do not specify an ID, it will be
   *   automatically generated by the server. Note that the icalUID and
   *   the id are not identical and only one of them should be supplied at
   *   event creation time. One difference in their semantics is that in
   *   recurring events, all occurrences of one event have different ids
   *   while they all share the same icalUIDs.
   */
  id?: string | null;
  /** Type of the resource ("calendar#event"). */
  kind?: string | null;
  /** Geographic location of the event as free-form text. Optional. */
  location?: string | null;
  /**
   * Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start",
   * "end" or "recurrence". The default is False. Read-Only.
   */
  locked?: boolean | null;
  /**
   * The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the
   * organizer field set to True. To change the organizer, use the move
   * operation. Read-only, except when importing an event.
   */
  organizer?: {
    displayName?: string;
    email?: string;
    id?: string;
    self?: boolean;
  } | null;
  /**
   * For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring
   * event identified by recurringEventId. It uniquely identifies the
   * instance within the recurring event series even if the instance was
   * moved to a different time. Immutable.
   */
  originalStartTime?: calendar_v3.Schema$EventDateTime;
  /** Out of office event data. Used if eventType is outOfOffice. */
  outOfOfficeProperties?: calendar_v3.Schema$EventOutOfOfficeProperties;
  /**
   * If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The
   * default is False.
   */
  privateCopy?: boolean | null;
  /**
   * List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not
   * allowed in this field; event start and end times are specified in the
   * start and end fields. This field is omitted for single events or
   * instances of recurring events.
   */
  recurrence?: string[] | null;
  /**
   * For an instance of a recurring event, this is the id of the recurring
   * event to which this instance belongs. Immutable.
   */
  recurringEventId?: string | null;
  /**
   * Information about the event's reminders for the authenticated user.
   * Note that changing reminders does not also change the updated
   * property of the enclosing event.
   */
  reminders?: {
    overrides?: calendar_v3.Schema$EventReminder[];
    useDefault?: boolean;
  } | null;
  /** Sequence number as per iCalendar. */
  sequence?: number | null;
  /**
   * Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or
   * HTTPS scheme. Can only be seen or modified by the creator of the
   * event.
   */
  source?: {
    title?: string;
    url?: string;
  } | null;
  /**
   * The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: calendar_v3.Schema$EventDateTime;
  /**
   * Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method
   *   returns cancelled events only on incremental sync (when syncToken
   *   or updatedMin are specified) or if the showDeleted flag is set to
   *   true. The get method always returns them. A cancelled status
   *   represents two different states depending on the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that
   *   this instance should no longer be presented to the user. Clients
   *   should store these events for the lifetime of the parent recurring
   *   event. Cancelled exceptions are only guaranteed to have values for
   *   the id, recurringEventId and originalStartTime fields populated.
   *   The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should
   *   remove their locally synced copies. Such cancelled events will
   *   eventually disappear, so do not rely on them being available
   *   indefinitely. Deleted events are only guaranteed to have the id
   *   field populated. On the organizer's calendar, cancelled events
   *   continue to expose event details (summary, location, etc.) so that
   *   they can be restored (undeleted). Similarly, the events to which
   *   the user was invited and that they manually removed continue to
   *   provide details. However, incremental sync requests with
   *   showDeleted set to false will not return these details. If an event
   *   changes its organizer (for example via the move operation) and the
   *   original organizer is not on the attendee list, it will leave
   *   behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string | null;
  /** Title of the event. */
  summary?: string | null;
  /**
   * Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar.
   *   This is equivalent to setting Show me as to Busy in the Calendar
   *   UI.
   * - "transparent" - The event does not block time on the calendar. This
   *   is equivalent to setting Show me as to Available in the Calendar
   *   UI.
   */
  transparency?: string | null;
  /**
   * Last modification time of the main event data (as a RFC3339
   * timestamp). Updating event reminders will not cause this to change.
   * Read-only.
   */
  updated?: string | null;
  /**
   * Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar.
   *   This is the default value.
   * - "public" - The event is public and event details are visible to all
   *   readers of the calendar.
   * - "private" - The event is private and only event attendees may view
   *   event details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string | null;
  /** Working location event data. */
  workingLocationProperties?: calendar_v3.Schema$EventWorkingLocationProperties;
}
