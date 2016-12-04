# Quep

Async queue processor.

Quep is able to abort, suspend and resume async processing of queue.

## Install

```
npm install quep
```

https://www.npmjs.com/package/quep


## Example

```js
const assert = require('assert');
import quep from 'quep';

const demo = quep(
	// Initial aciton
	(num)=> num + 1,

	// Queue
	// Each callbacks function arguments are the return value that prev function
	[
		(num) => num + 10,
		(num) => Promise.all([ num + 10, num + 10 ])
		([n1, n2]) => n1 + n2
	]
)

// Listening
demo.on('DONE', (result) => {
	assert.deepEqual(result, {
		value: 44,
		done: true
	})
})

// Executeing
demo.exec(1).then((v) => {
    assert.equal(v, 44)
});
```

## Usage

### Create a Queue

```js
quep(initialAction: Function, queue: Function[]): Operator
```

**return** : `Operator`

```js
interface Operator {
	exec(value?: any): Promise<any>;
	abort(): "ABORT";
	suspend(): "SUSPEND";
	resume: (value?: any) => Promise<any>;
	on(event: string, listener: Function): EventEmitter;
	notifier: EventEmitter;
}

```

#### `abort`

```js
const demo = quep((n) => n + 1, [
	(n) => {
		if (n > 10) {
			// operator.abort() abort queue processing.
			demo.abort();
			return;
		}
		return n
	},

	// This action will not be reached.
	(n) => n + 1;
])
```

#### `suspend / resume`

```js
const demo = quep((n) => n + 1, [
	(n) => {
		if (n > 10) {
			// operator.suspend() suspend queue processing.
			demo.suspend();
			return;
		}
		return n
	},

	// This action will not be reached.
	(n) => n + 1;
])
```

To resume queue processing, You can use `operator.resume` or listening `'SUSPEND'` event.

```js
demo.on('SUSPEND', (state, resume) => {
	// resume processing
	// this redume() is needn't arguments.
	resume();

	// or
	// operator.resume() need arguments of next action.
	demo.resume(state.value)
})
```

### Manual processing

Manual processing behave like a generator funciton.

It can make it easy to debugging and testing.

```js
const demo = quep((num)=> num + 1,
	[
		(num) => num + 10,
		(num) => Promise.all([ num + 10, num + 10 ])
		([n1, n2]) => n1 + n2
	]
)

const processor = demo.manual();

const result1 = processor.next(1);
assert.deepEqual(result1, {
	value: 2,
	done: false
})

const result2 = processor.next(result1.value);
assert.deepEqual({
	value: 12,
	done: false
})
```

### Event

```js
operator.on(event: 'ABORT' | 'DONE' | 'NEXT', listener: (status: Status) => any): EventEmitter
```

```js
operator.on(event: 'SUSPEND', listener: (status: Status, resume: Function) => any): EventEmitter
```

```js
interface Status {
	value: any;
	done: boolean;
}
```
