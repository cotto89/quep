"use strict";
class Processor {
    constructor(notifier, queue = []) {
        this.command = 'EXEC';
        this.notifier = notifier;
        this.queue = queue;
    }
    exec(value) {
        const status = this.next(value);
        if (this.command === 'SUSPEND') {
            const s = Object.assign({}, status);
            this.notifier.emit(this.command, s, this.resume.bind(this, s.value));
            return Promise.resolve(s);
        }
        if (this.command === 'ABORT') {
            const s = Object.assign({}, status, { done: true });
            this.notifier.emit(this.command, s);
            return Promise.resolve(s);
        }
        if (status.done) {
            this.command = 'DONE';
            const s = Object.assign({}, status, { done: true });
            this.notifier.emit(this.command, s);
            return Promise.resolve(s);
        }
        return Promise.resolve(status.value).then(v => this.exec(v));
    }
    next(value) {
        if (this.queue.length <= 0) {
            this.command = 'DONE';
            const s = { value, done: true };
            this.notifier.emit(this.command, s);
            return s;
        }
        const task = this.queue.shift();
        const s = { value: task(value), done: this.queue.length <= 0 };
        this.notifier.emit('NEXT', s);
        return s;
    }
    abort() {
        return this.command = 'ABORT';
    }
    suspend() {
        return this.command = 'SUSPEND';
    }
    resume(value) {
        this.command = 'RESUME';
        return Promise.resolve(value).then(v => this.exec(v));
    }
}
exports.Processor = Processor;
//# sourceMappingURL=Processor.js.map