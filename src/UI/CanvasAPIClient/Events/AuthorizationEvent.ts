export class AuthorizationEvent extends Event {
  public static readonly name = 'canvas-auth-req';

  public constructor(
    public readonly authorize_url: string,
    init?: EventInit
  ) {
    super(AuthorizationEvent.name, init);
  }
}
