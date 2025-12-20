type Init = EventInit & { requestId: string };

export class RequestPageEvent<T> extends Event {
  public static readonly name = 'canvas-req-page-rcvd';

  public readonly requestId: string;

  public constructor(
    public readonly page: T,
    { requestId, ...init }: Init
  ) {
    super(RequestPageEvent.name, init);
    this.requestId = requestId;
  }
}
