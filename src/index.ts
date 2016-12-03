import { Processor } from './Processor';

export * from './Processor';

export default function stream<Arg, Queue extends any[]>(
    src: (value?: Arg) => any,
    queue?: Queue
) {

    const processor = new Processor([src].concat((queue || [])));
    const exec = (value?: Arg) => processor.exec(value);
    const on = (event: string, listener: Function) => {
        processor.on(event, listener);
        return () => processor.removeListener(event, listener);
    };

    const ret = Object.assign(exec, { processor, on });
    return ret;
}
