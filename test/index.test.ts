import * as assert from 'power-assert';
// import * as sinon from 'sinon';
import stream from './../src/index';

namespace fixture {
    export const src = (count: number = 1) => count;
    export type Queue = [
        (a: number) => number,
        (a: number) => Promise<[number, number]>,
        (a: number[]) => number
    ];

    export const queue: Queue = [
        (num) => num + 1,
        (num) => Promise.all([num + 10, num + 10]),
        ([n1, n2]) => n1 + n2
    ];
}

describe('exec()', () => {
    it('process queue by async', async () => {
        const demo$ = stream(fixture.src, fixture.queue);

        const n = await demo$(1);
        assert.equal(n, 24);
    });
});

describe('next()', () => {
    it('process like a generator function', async () => {
        const demo$ = stream(fixture.src, fixture.queue);

        const processor = demo$.manual();

        const ret1 = await processor.next(1);
        assert.deepEqual(ret1, {
            value: 1,
            done: false
        });

        assert.equal(processor.processingIdx, 1);

        const ret2 = await processor.next(ret1.value);
        assert.deepEqual(ret2, {
            value: 2,
            done: false
        });

        assert.equal(processor.processingIdx, 2);

        const ret3 = await processor.next(ret2.value);
        const v = await Promise.resolve(ret3.value);
        assert.deepEqual(v, [12, 12]);
        assert.equal(ret3.done, false);

        assert.equal(processor.processingIdx, 3);

        const ret4 = await processor.next(v);
        assert.deepEqual(ret4, {
            done: true,
            value: 24,
        });

        assert.equal(processor.processingIdx, 0);
    });
});
