export class CanvasReadyEvent extends Event {
  public static readonly name = 'canvas-api-ready';
  public constructor() {
    super(CanvasReadyEvent.name);
  }
}
