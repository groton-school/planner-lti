// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Canvas } from '../../../CanvasAPIClient';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ISection extends Canvas.Sections.Section {}

export class BaseSection implements ISection {
  id: string | number;
  name: string;
  sis_section_id: string;
  integration_id: string;
  sis_import_id: string | number;
  course_id: string | number;
  sis_course_id: string;
  start_at: string;
  end_at: string;
  restrict_enrollments_to_section_dates: string | boolean;
  nonxlist_course_id: string | number;
  total_students: string | number;
}
