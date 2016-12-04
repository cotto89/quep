"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const events = require('events');
const Core = require('./Processor');
__export(require('./Processor'));
function quep(src, queue = []) {
    const notifier = new events.EventEmitter();
    let processor;
    const operation = {
        manual: () => new Core.Processor(notifier, [src, ...queue]),
        exec: (value) => {
            processor = new Core.Processor(notifier, [src, ...queue]);
            return processor.exec(value);
        },
        abort: () => processor.abort(),
        suspend: () => processor.suspend(),
        resume: (value) => processor.resume(value),
        on: notifier.on.bind(notifier),
    };
    const operator = Object.assign(operation, { notifier });
    return operator;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = quep;
//# sourceMappingURL=index.js.map