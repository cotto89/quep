import { Processor } from './Processor';
export * from './Processor';
export default function stream<Arg, Queue extends any[]>(src: (value?: Arg) => any, queue?: Queue): ((value?: Arg | undefined) => Promise<any>) & {
    processor: Processor<((value?: Arg | undefined) => any)[]>;
    on: (event: string, listener: Function) => () => Processor<((value?: Arg | undefined) => any)[]>;
};
