import { BaseAssignment } from './BaseAssignment';

export class Assignment extends BaseAssignment {
  private constructor(base: BaseAssignment) {
    super();
    Object.assign(this, base);
  }

  public static fromBase(base: Assignment) {
    const assignment = new Assignment(base);
    return assignment;
  }
}
