"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const Processor_1 = require('./Processor');
__export(require('./Processor'));
function stream(src, queue) {
    const processor = new Processor_1.Processor([src].concat((queue || [])));
    const exec = (value) => processor.exec(value);
    const on = (event, listener) => {
        processor.on(event, listener);
        return () => processor.removeListener(event, listener);
    };
    const ret = Object.assign(exec, { processor, on });
    return ret;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stream;
//# sourceMappingURL=index.js.map