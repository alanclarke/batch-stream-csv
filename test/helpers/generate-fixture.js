const path = require('path')
const fs = require('fs').promises
const test = require('ava')
let files = []
let id = 1

module.exports = async function getFixture (size) {
  const file = path.join(__dirname, `../fixtures/${id++}.csv`)
  files.push(file)
  const keys = ['a', 'b', 'c']
  await generateCSV(file, ['a', 'b', 'c'], (key, n) => [key, n].join('-'), size)
  const fixture = String(await fs.readFile(file))
    .split('\n').map(row => row.split(',')).slice(1)
    .map(row => row.reduce((memo, value, i) => ({ ...memo, [keys[i]]: value }), {}))
  return { file, fixture }
}

async function generateCSV (file, keys, value, size) {
  await fs.writeFile (file, '')
  await fs.appendFile(file, keys.join(','))
  for (let i = 0; i < size; i++) {
    const values = keys.map(key => value(i, key))
    await fs.appendFile(file, '\n' + values.join(','))
  }
}

test.after.always(async t => Promise.all(files.map(f => fs.unlink(f))))
