/// <reference types="node" />
import events = require('events');
import * as Core from './Processor';
export * from './Processor';
export default function quep<Arg, Queue extends Function[]>(src: (value?: Arg) => any, queue?: Queue): {
    manual: () => Core.Processor<Function[]>;
    exec: (value?: Arg | undefined) => Promise<any> | Promise<Core.Status>;
    abort: () => "ABORT";
    suspend: () => "SUSPEND";
    resume: (value?: any) => Promise<any>;
    on: any;
} & {
    notifier: events.EventEmitter;
};
