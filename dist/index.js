"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const Processor_1 = require('./Processor');
__export(require('./Processor'));
function stream(src, queue) {
    const exec = (value) => {
        const processor = new Processor_1.Processor([src].concat((queue || [])));
        return processor.exec(value);
    };
    const option = {
        manual() {
            return new Processor_1.Processor([src].concat((queue || [])));
        }
    };
    const ret = Object.assign(exec, option);
    return ret;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stream;
//# sourceMappingURL=index.js.map