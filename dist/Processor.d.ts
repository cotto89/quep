/// <reference types="node" />
import events = require('events');
export declare type Command = 'EXEC' | 'ABORT' | 'SUSPEND' | 'RESUME' | 'DONE';
export interface Status {
    value: any;
    done: boolean;
}
export declare class Processor<Queue extends any[]> {
    notifier: events.EventEmitter;
    protected queue: Queue;
    protected command: Command;
    constructor(notifier: events.EventEmitter, queue?: Queue);
    exec(value?: any): Promise<any> | Promise<Status>;
    next(value?: any): Status;
    abort(): "ABORT";
    suspend(): "SUSPEND";
    resume(value?: any): Promise<any>;
}
