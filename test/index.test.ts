import * as assert from 'power-assert';
import * as sinon from 'sinon';
import stream, { EVENT } from './../src/index';

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

        assert.equal(demo$.processor.processingIdx, 0);

        const ret1 = await demo$.processor.next(1);
        assert.deepEqual(ret1, {
            value: 1,
            done: false
        });

        assert.equal(demo$.processor.processingIdx, 1);

        const ret2 = await demo$.processor.next(ret1.value);
        assert.deepEqual(ret2, {
            value: 2,
            done: false
        });

        assert.equal(demo$.processor.processingIdx, 2);

        const ret3 = await demo$.processor.next(ret2.value);
        const v = await Promise.resolve(ret3.value);
        assert.deepEqual(v, [12, 12]);
        assert.equal(ret3.done, false);

        assert.equal(demo$.processor.processingIdx, 3);

        const ret4 = await demo$.processor.next(v);
        assert.deepEqual(ret4, {
            done: true,
            value: 24,
        });

        assert.equal(demo$.processor.processingIdx, 0);
    });
});


describe('on()/ unsubscribe()', () => {
    it('can subscribe / unsubscribe processor events', async () => {
        const demo$ = stream(fixture.src, fixture.queue);
        const spy = sinon.spy();

        const off = demo$.on(EVENT.START, spy);
        demo$.on(EVENT.DONE, spy);

        assert.equal(demo$.processor.listenerCount(EVENT.START), 1);
        assert.equal(demo$.processor.listenerCount(EVENT.DONE), 1);

        await demo$(1);

        assert(spy.firstCall.calledWith());
        assert(spy.secondCall.calledWith(24));

        off();

        assert.equal(demo$.processor.listenerCount(EVENT.START), 0);
        assert.equal(demo$.processor.listenerCount(EVENT.DONE), 1);
    });
});








