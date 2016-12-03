# Quep

async queue processor.

### Example

```js
const assert = require('assert');
const quep = require('quep').default;

const demo$ = quep(
    // initial action
    (count = 1) => count,

    // queue
    [
        count => count + 1,
        count => Promise.all([count + 10, count + 10]),
        ([c1, c2]) => c1 + c2
    ]);

// exec
demo$(1).then((v) => {
    assert.equal(v, 24);
});
```

#### Executing by manual.

It behave like generator funciton. So It can make it easy to debugging and testing.

```js
const processor = demo$.manual();

const result1 = processor.next(1);
assert.deepEqual(result1, { done: false, value: 1 });

const result2 = processor.next(result1.value);
assert.deepEqual(result2, { done: false, value: 2 });
```