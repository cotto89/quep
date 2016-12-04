"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const events = require('events');
const Processor_1 = require('./Processor');
__export(require('./Processor'));
function quep(src, queue = []) {
    const notifier = new events.EventEmitter();
    let processor;
    function on(event, listener) {
        return notifier.on(event, listener);
    }
    const operation = {
        manual: () => new Processor_1.Processor(notifier, [src, ...queue]),
        exec: (value) => {
            processor = new Processor_1.Processor(notifier, [src, ...queue]);
            return processor.exec(value);
        },
        abort: () => processor.abort(),
        suspend: () => processor.suspend(),
        resume: (value) => processor.resume(value),
        on
    };
    const operator = Object.assign(operation, { notifier });
    return operator;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = quep;
//# sourceMappingURL=index.js.map