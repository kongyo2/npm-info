/**
 * Create a concurrency limiter: returns a function that runs async tasks
 * with at most `max` in flight, queueing the rest in FIFO order.
 */
export function createLimiter(max: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  return function runLimited<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = (): void => {
        active++;
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--;
            const next = queue.shift();
            if (next) next();
          });
      };
      if (active < max) run();
      else queue.push(run);
    });
  };
}
