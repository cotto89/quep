import { Processor } from './Processor';

export * from './Processor';

export default function stream<Arg, Queue extends any[]>(
    src: (value?: Arg) => any,
    queue?: Queue
) {

    const exec = (value?: Arg) => {
        const processor = new Processor([src].concat((queue || [])));
        return processor.exec(value);
    };

    const option = {
        manual() {
            return new Processor([src].concat((queue || [])));
        }
    };

    const ret = Object.assign(exec, option);
    return ret;
}
