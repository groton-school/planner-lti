// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { JSONObject } from '@battis/typescript-tricks';
import { Canvas } from '../../../CanvasAPIClient';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IAssignment extends Canvas.Assignments.Assignment {}

export class BaseAssignment implements IAssignment {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  due_at: string;
  lock_at: string;
  unlock_at: string;
  has_overrides: string | boolean;
  all_dates: Canvas.Assignments.AssignmentDate[];
  course_id: string | number;
  html_url: string;
  submissions_download_url: string;
  assignment_group_id: string | number;
  due_date_required: string | boolean;
  allowed_extensions: string[];
  max_name_length: string | number;
  turnitin_enabled: string | boolean;
  vericite_enabled: string | boolean;
  turnitin_settings: Canvas.Assignments.TurnitinSettings;
  grade_group_students_individually: string | boolean;
  external_tool_tag_attributes: Canvas.Assignments.ExternalToolTagAttributes;
  peer_reviews: string | boolean;
  automatic_peer_reviews: string | boolean;
  peer_review_count: string | number;
  peer_reviews_assign_at: string;
  intra_group_peer_reviews: string | boolean;
  group_category_id: string | number;
  needs_grading_count: string | number;
  needs_grading_count_by_section: Canvas.Assignments.NeedsGradingCount[];
  position: string | number;
  post_to_sis: string | boolean;
  integration_id: string;
  integration_data: JSONObject;
  points_possible: string | number;
  submission_types: string[];
  has_submitted_submissions: string | boolean;
  grading_type: string;
  grading_standard_id: string | number;
  published: string | boolean;
  unpublishable: string | boolean;
  only_visible_to_overrides: string | boolean;
  locked_for_user: string | boolean;
  lock_info: Canvas.Assignments.LockInfo;
  lock_explanation: string;
  quiz_id: string | number;
  anonymous_submissions: string | boolean;
  discussion_topic: Canvas.DiscussionTopics.DiscussionTopic;
  freeze_on_copy: string | boolean;
  frozen: string | boolean;
  frozen_attributes: string[];
  submission: Canvas.Submissions.Submission;
  use_rubric_for_grading: string | boolean;
  rubric_settings: JSONObject;
  rubric: Canvas.Assignments.RubricCriteria[];
  assignment_visibility: number | string[];
  overrides: Canvas.Assignments.AssignmentOverride[];
  omit_from_final_grade: string | boolean;
  hide_in_gradebook: string | boolean;
  moderated_grading: string | boolean;
  grader_count: string | number;
  final_grader_id: string | number;
  grader_comments_visible_to_graders: string | boolean;
  graders_anonymous_to_graders: string | boolean;
  grader_names_visible_to_final_grader: string | boolean;
  anonymous_grading: string | boolean;
  allowed_attempts: string | number;
  post_manually: string | boolean;
  score_statistics: Canvas.Assignments.ScoreStatistic;
  can_submit: string | boolean;
  ab_guid: string[];
  annotatable_attachment_id: string | number;
  anonymize_students: string | boolean;
  require_lockdown_browser: string | boolean;
  important_dates: string | boolean;
  muted: string | boolean;
  anonymous_peer_reviews: string | boolean;
  anonymous_instructor_annotations: string | boolean;
  graded_submissions_exist: string | boolean;
  is_quiz_assignment: string | boolean;
  in_closed_grading_period: string | boolean;
  can_duplicate: string | boolean;
  original_course_id: string | number;
  original_assignment_id: string | number;
  original_lti_resource_link_id: string | number;
  original_assignment_name: string;
  original_quiz_id: string | number;
  workflow_state: string;
}
