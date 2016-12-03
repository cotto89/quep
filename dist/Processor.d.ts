export declare class Processor<Queue extends any[]> {
    queue: Queue;
    processingIdx: number;
    constructor(queue?: Queue);
    exec(value?: any): Promise<any>;
    next(value?: any): {
        value: any;
        done: boolean;
    };
}
