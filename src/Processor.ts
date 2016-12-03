import events = require('events');

export const EVENT = {
    START: 'START',
    DONE: 'DONE',
    ERROR: 'ERROR'
};

export class Processor<Queue extends any[]> extends events.EventEmitter {
    queue: Queue;
    processingIdx: number = 0;

    constructor(queue: Queue = [] as any) {
        super();
        this.queue = queue;
    }

    exec(value?: any): Promise<any> {
        if (this.processingIdx === 0) {
            this.emit(EVENT.START);
        }

        const result = this.next(value);

        if (result.done) {
            this.processingIdx = 0;
            this.emit(EVENT.DONE, result.value);
            return Promise.resolve(result.value);
        }

        return Promise.resolve(result.value)
            .then(v => this.exec(v))
            .catch(err => this.emit(EVENT.ERROR, err));
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
