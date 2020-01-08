const test = require('ava')
const fs = require('fs').promises
const path = require('path')
const genFixture = require('./helpers/generate-fixture')
const sinon = require('sinon')
const batchStreamCSV = require('..')

test('divides into batches', async t => {
  const [size, batches] = [2000, 20]
  const batchSize = size / batches
  const { file, fixture } = await genFixture(size)

  const stub = sinon.stub()
  await batchStreamCSV(file, stub, { batchSize })
  t.is(stub.callCount, batches)
})

test('defaults to batchSize of 5000', async t => {
  const batchSize = 5000
  const batches = 10
  const size = batchSize * batches
  const { file, fixture } = await genFixture(size)
  const stub = sinon.stub()
  await batchStreamCSV(file, stub)
  t.is(stub.callCount, batches)
})

test('gives correct rows to batches', async t => {
  const [size, batches] = [20, 2]
  const batchSize = size / batches
  const { file, fixture } = await genFixture(size)

  const stub = sinon.stub()

  await batchStreamCSV(file, stub, { batchSize })

  for (let i = 0; i < batches; i++) {
    const batch = fixture.slice(i * batchSize, (i + 1) * batchSize)
    t.deepEqual(stub.args[i][0], batch)
  }
})

test('progress', async t => {
  const [size, batches] = [200, 2]
  const batchSize = size / batches
  const { file, fixture } = await genFixture(size)

  const stub = sinon.stub()

  await batchStreamCSV(file, stub, { batchSize })
  const progress = []

  for (let i = 0; i < batches; i++) {
    progress.push(stub.args[i][1].toFixed(1))
  }

  t.deepEqual(progress, ['0.5', '1.0'])
})

test('handles errors', async t => {
  const [size, batches] = [2000, 10]
  const batchSize = size / batches
  const { file, fixture } = await genFixture(size)
  const error = new Error('eek')
  t.plan(1)
  try {
    await batchStreamCSV(file, () => {
      throw error
    })
  } catch (err) {
    t.is(err, error)
  }
})
