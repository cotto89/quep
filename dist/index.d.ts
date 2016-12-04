/// <reference types="node" />
import events = require('events');
import { Processor, Status } from './Processor';
export * from './Processor';
export declare type Listener = (status: Status) => any;
export default function quep<Arg, Queue extends Function[]>(src: (value?: Arg) => any, queue?: Queue): {
    manual: () => Processor<Function[]>;
    exec: (value?: Arg | undefined) => Promise<any>;
    abort: () => "ABORT";
    suspend: () => "SUSPEND";
    resume: (value?: any) => Promise<any>;
    on: {
        (event: "ABORT" | "DONE" | "NEXT", listener: Listener): events.EventEmitter;
        (event: "SUSPEND", listener: (status: Status, resume: Function) => any): events.EventEmitter;
    };
} & {
    notifier: events.EventEmitter;
};
