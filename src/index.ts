import events = require('events');
import * as Core from './Processor';
export * from './Processor';

export default function quep<Arg, Queue extends Function[]>(
    src: (value?: Arg) => any,
    queue: Queue = [] as any
) {

    const notifier = new events.EventEmitter();
    let processor: Core.Processor<any>;

    const operation = {
        manual: () => new Core.Processor(notifier, [src, ...queue]),
        exec: (value?: Arg) => {
            processor = new Core.Processor(notifier, [src, ...queue]);
            return processor.exec(value);
        },
        abort: () => processor.abort(),
        suspend: () => processor.suspend(),
        resume: (value?: any) => processor.resume(value),
        on: notifier.on.bind(notifier),
    };

    const operator = Object.assign(operation, { notifier });

    return operator;
}
