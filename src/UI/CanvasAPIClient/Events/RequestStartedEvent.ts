type Init = EventInit & { requestId?: string };

export class RequestStartedEvent extends Event {
  public static readonly name = 'canvas-rqst-strt';

  public readonly requestId;

  public constructor({ requestId = crypto.randomUUID(), ...init }: Init = {}) {
    super(RequestStartedEvent.name, init);
    this.requestId = requestId;
  }
}
