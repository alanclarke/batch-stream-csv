[![Travis CI](https://travis-ci.org/alanclarke/batch-stream-csv.svg?branch=master)](https://travis-ci.org/alanclarke/batch-stream-csv)
[![devDependency Status](https://david-dm.org/alanclarke/batch-stream-csv/dev-status.svg)](https://david-dm.org/alanclarke/batch-stream-csv#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/alanclarke/batch-stream-csv/badge.svg?branch=master)](https://coveralls.io/github/alanclarke/batch-stream-csv?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


# batch-stream-csv

Process large CSV files in batches without backpressure

The CSV is streamed in batches and the stream is paused while you perform async operations on each batch to prevent backpressure building up

Uses [`csv-parser`](https://github.com/mafintosh/csv-parser) under the hood

## Install

```
$ npm install batch-stream-csv
```

## Usage:

```js
const batch = require('batch-stream-csv');

batch('./file.csv', batchHandler, options).then(() => console.log('All done!'))

async function batchHandler (batch, progress) => {
  console.log(batch) // batch of rows parsed as JSON, e.g. [{ a: 1, b: 2 }, {  a: 2, b: 3 }]

  await db.batchInsert('table', batch) // the stream is paused while you do your inserts

  console.log(`${progress * 100}% complete`) // progress value can be fed into a progress bar
}
````

## API:

## Options:
- `batchSize`: number of rows to process per batch (default = 5000)
- ...see https://github.com/mafintosh/ for other options
