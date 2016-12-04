import events = require('events');
import { Processor, Status } from './Processor';
export * from './Processor';

export type Listener = (status: Status) => any;

export default function quep<Arg, Queue extends Function[]>(
    src: (value?: Arg) => any,
    queue: Queue = [] as any
) {

    const notifier = new events.EventEmitter();
    let processor: Processor<any>;

    function on(event: 'ABORT' | 'DONE' | 'NEXT', listener: Listener): events.EventEmitter;
    function on(event: 'SUSPEND', listener: (status: Status, resume: Function) => any): events.EventEmitter;
    function on(event: string, listener: Listener) {
        return notifier.on(event, listener);
    }

    const operation = {
        manual: () => new Processor(notifier, [src, ...queue]),
        exec: (value?: Arg) => {
            processor = new Processor(notifier, [src, ...queue]);
            return processor.exec(value);
        },
        abort: () => processor.abort(),
        suspend: () => processor.suspend(),
        resume: (value?: any) => processor.resume(value),
        on
    };

    const operator = Object.assign(operation, { notifier });

    return operator;
}
