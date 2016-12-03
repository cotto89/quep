export class Processor<Queue extends any[]>  {
    queue: Queue;
    processingIdx: number = 0;

    constructor(queue: Queue = [] as any) {
        this.queue = queue;
    }

    exec(value?: any): Promise<any> {

        const result = this.next(value);

        if (result.done) {
            this.processingIdx = 0;
            return Promise.resolve(result.value);
        }

        return Promise.resolve(result.value)
            .then(v => this.exec(v));
    }

    next(value?: any) {
        const task = this.queue[this.processingIdx];

        const max = this.queue.length;
        const next = this.processingIdx + 1;
        this.processingIdx = max > next ? next : 0;

        return {
            value: task(value),
            done: this.processingIdx <= 0,
        };
    }
}
