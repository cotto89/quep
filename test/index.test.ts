import * as assert from 'power-assert';
import * as sinon from 'sinon';
import quep, { Status } from './../src/index';

namespace fixture {
    export const src = (n: number = 1) => n;
    export type Queue = [
        (a: number) => number,
        (a: number) => Promise<[number, number]>,
        (a: [number, number]) => number
    ];

    export const queue: Queue = [
        (num) => num + 1,
        (num) => Promise.all([num + 10, num + 10]),
        ([n1, n2]) => n1 + n2
    ];
}

describe('exec() and event of NEXT and DONE', () => {
    it('return Promise<lastValue> and notice state', async () => {
        const demo$ = quep(fixture.src, fixture.queue);

        const spyA = sinon.spy();
        const spyB = sinon.spy();

        demo$.on('DONE', spyA);
        demo$.on('NEXT', spyB);

        const result = await demo$.exec(1);

        assert.deepEqual(result, { value: 24, done: true });
        assert(spyA.calledOnce);
        assert(spyA.calledWith({ value: 24, done: true }));

        assert.deepEqual(spyB.args[0], [{ value: 1, done: false }]);
        assert.deepEqual(spyB.args[1], [{ value: 2, done: false }]);
        assert.deepEqual(spyB.args[2], [{ value: Promise.resolve([12, 12]), done: false }]);
        assert.deepEqual(spyB.args[3], [{ value: 24, done: true }]);
    });
});

describe('manual()', () => {
    it('can execute step by step on manual by processor.next()', async () => {
        const demo$ = quep(fixture.src, fixture.queue);
        const ps = await demo$.manual();

        const r1 = await ps.next(1);
        assert.deepEqual(r1, { value: 1, done: false });

        const r2 = await ps.next(r1.value);
        assert.deepEqual(r2, { value: 2, done: false });

        const r3 = await ps.next(r2.value);
        assert.deepEqual(r3, { value: Promise.resolve([12, 12]), done: false });

        const r3v = await Promise.resolve(r3.value);
        const r4 = await ps.next(r3v);
        assert.deepEqual(r4, { value: 24, done: true });
    });
});

describe('abort()', () => {
    it('can abort processing of queue', async () => {
        const taskSpy = sinon.spy((n: number) => n);
        const listenerSpy = sinon.spy();

        const demo$ = quep((n: number = 1) => n, [
            (n: number) => n + 10,
            (n: number) => {
                demo$.abort();
                return n + 10;
            },
            taskSpy,
        ]);

        demo$.on('ABORT', listenerSpy);

        const result = await demo$.exec(1);

        assert.deepEqual(result, { value: 21, done: true });

        assert(listenerSpy.calledOnce);
        assert.deepEqual(listenerSpy.args[0], [{ value: 21, done: true }]);

        assert(!taskSpy.called);
    });
});

describe('suspend() and resume() from payload of listener', () => {
    it('suspend processing of queue and resume', async () => {
        let $resume;

        const listenerSpy = sinon.spy((state, resume) => {
            assert.deepEqual(state, { value: 12, done: false });
            assert.equal(typeof resume, 'function');
            $resume = resume;
        });

        const taskSpy = sinon.spy((n: number) => n + 10);

        const demo$ = quep(fixture.src, [
            (n: number) => n + 10,
            (n: number) => {
                demo$.suspend();
                return n + 1;
            },
            taskSpy
        ]);

        demo$.on('SUSPEND', listenerSpy);
        const ret = await demo$.exec(1);

        assert.deepEqual(ret, { value: 12, done: false });

        assert(listenerSpy.called);
        assert(!taskSpy.called);

        // $resume function from listener
        const ret2 = await $resume();
        assert.deepEqual(ret2, { value: 22, done: true });
        assert(taskSpy.calledWith(12));
    });
});

describe('operator.resume()', () => {
    it('resume processing of queue from oprator.resume()', async () => {
        const taskSpy = sinon.spy((n: number) => n + 10);

        const demo$ = quep((n: number) => n, [
            (n: number) => n + 10,
            (n: number) => {
                demo$.suspend();
                return n + 10;
            },
            taskSpy
        ]);

        demo$.on('SUSPEND', (state) => {
            assert(!taskSpy.called);
            demo$.resume(state.value);
        });

        const listenerSpy = sinon.spy((state) => {
            assert.deepEqual(state, { value: 31, done: true });
            assert(taskSpy.calledWith(21));
        });

        demo$.on('DONE', listenerSpy);

        const ret = await demo$.exec(1);

        assert.deepEqual(ret, { value: 21, done: false });
        assert(listenerSpy.called);

        /* tslint:disable align */
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
    });
});
