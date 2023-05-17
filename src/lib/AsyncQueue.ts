import { TimeoutError } from "../utils/error-handler.js";

type AsyncFunction = (...args: any[]) => Promise<any>;

interface QueueItem {
  asyncFunction: AsyncFunction;
  args: any[];
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

export const startTimeout = (timeoutDuration: number, obj: object) => {
  return new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(obj));
    }, timeoutDuration);
  });
};

class AsyncQueue {
  private readonly concurrencyLimit: number;
  private readonly queue: QueueItem[];
  private currentlyRunning: number;
  private timeoutDuration = 5000;

  constructor(concurrencyLimit: number, timeoutDuration?: number) {
    this.concurrencyLimit = concurrencyLimit;
    this.queue = [];
    this.currentlyRunning = 0;
    if (timeoutDuration) this.timeoutDuration = timeoutDuration;
  }

  add(asyncFunction: AsyncFunction, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        args,
        asyncFunction,
        reject,
        resolve,
      };
      this.queue.push(item);
      void this.run();
    });
  }

  private async run(): Promise<void> {
    while (this.currentlyRunning < this.concurrencyLimit && this.queue.length) {
      const item = this.queue.shift() as QueueItem;
      this.currentlyRunning++;

      if (!this.timeoutDuration) {
        const result = await item.asyncFunction(...item.args);
        item.resolve(result);
      } else {
        try {
          const result = await Promise.race([
            item.asyncFunction(...item.args),
            startTimeout(this.timeoutDuration, [...item.args]),
          ]);
          item.resolve(result);
        } catch (err) {
          // need to look if it is a TimeoutError on the caller side
          item.resolve(err);
        }
      }
      this.currentlyRunning--;

      return this.run();
    }
  }
}

export default AsyncQueue;
