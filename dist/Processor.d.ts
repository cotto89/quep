/// <reference types="node" />
import events = require('events');
export declare const EVENT: {
    START: string;
    DONE: string;
    ERROR: string;
};
export declare class Processor<Queue extends any[]> extends events.EventEmitter {
    queue: Queue;
    processingIdx: number;
    constructor(queue?: Queue);
    exec(value?: any): Promise<any>;
    next(value?: any): {
        value: any;
        done: boolean;
    };
}
