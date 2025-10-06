// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { JSONObject } from '@battis/typescript-tricks';
import { Canvas } from '@groton/canvas-api.client.web';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ICourse extends Canvas.Courses.Course {}

export class BaseCourse implements ICourse {
  id: string | number;
  sis_course_id: string;
  uuid: string;
  integration_id: string;
  sis_import_id: string | number;
  name: string;
  course_code: string;
  original_name: string;
  workflow_state: string;
  account_id: string | number;
  root_account_id: string | number;
  enrollment_term_id: string | number;
  grading_periods: Canvas.GradingPeriods.GradingPeriod[];
  grading_standard_id: string | number;
  grade_passback_setting: string;
  created_at: string;
  start_at: string;
  end_at: string;
  locale: string;
  enrollments: Canvas.Enrollments.Enrollment[];
  total_students: string | number;
  calendar: Canvas.Courses.CalendarLink;
  default_view: string;
  syllabus_body: string;
  needs_grading_count: string | number;
  term: Canvas.Courses.Term;
  course_progress: Canvas.Courses.CourseProgress;
  apply_assignment_group_weights: string | boolean;
  permissions: JSONObject;
  is_public: string | boolean;
  is_public_to_auth_users: string | boolean;
  public_syllabus: string | boolean;
  public_syllabus_to_auth: string | boolean;
  public_description: string;
  storage_quota_mb: string | number;
  storage_quota_used_mb: string | number;
  hide_final_grades: string | boolean;
  license: string;
  allow_student_assignment_edits: string | boolean;
  allow_wiki_comments: string | boolean;
  allow_student_forum_attachments: string | boolean;
  open_enrollment: string | boolean;
  self_enrollment: string | boolean;
  restrict_enrollments_to_course_dates: string | boolean;
  course_format: string;
  access_restricted_by_date: string | boolean;
  time_zone: string;
  blueprint: string | boolean;
  blueprint_restrictions: JSONObject;
  blueprint_restrictions_by_object_type: JSONObject;
  template: string | boolean;
}
