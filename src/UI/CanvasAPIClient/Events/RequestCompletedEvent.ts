type Init<T> = EventInit & { requestId: string; result: T };

export class RequestCompleteEvent<T = unknown> extends Event {
  public static readonly name = 'canvas-rqst-comp';

  public readonly requestId: string;
  public readonly result: T;

  public constructor({ requestId, result, ...init }: Init<T>) {
    super(RequestCompleteEvent.name, init);
    this.requestId = requestId;
    this.result = result;
  }
}
