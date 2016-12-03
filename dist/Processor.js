"use strict";
const events = require('events');
exports.EVENT = {
    START: 'START',
    DONE: 'DONE',
    ERROR: 'ERROR'
};
class Processor extends events.EventEmitter {
    constructor(queue = []) {
        super();
        this.processingIdx = 0;
        this.queue = queue;
    }
    exec(value) {
        if (this.processingIdx === 0) {
            this.emit(exports.EVENT.START);
        }
        const result = this.next(value);
        if (result.done) {
            this.processingIdx = 0;
            this.emit(exports.EVENT.DONE, result.value);
            return Promise.resolve(result.value);
        }
        return Promise.resolve(result.value)
            .then(v => this.exec(v))
            .catch(err => this.emit(exports.EVENT.ERROR, err));
    }
    next(value) {
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
exports.Processor = Processor;
//# sourceMappingURL=Processor.js.map