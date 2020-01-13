const csv = require('csv-parser')
const fs = require('fs')

/**
 * Process large CSV files in batches without backpressure
 * @param {string} file - path to the csv file on your file system
 * @param {function} fn - async function to apply on each batch
 * @param {Object} options - optional options object including 'batchSize' and options from 'csv-parser'
 */
module.exports = async function csvBatchMap (file, fn, options = {}) {
  const batchSize = options.batchSize || 5000
  const { size } = await fs.promises.stat(file)
  let read = 0

  return new Promise((resolve, reject) => {
    const rows = []
    const rs = fs.createReadStream(file)
    rs
      .pipe(csv(options))
      .on('headers', function processHeaders () {
        read += this.state.rowLength
      })
      .on('data', async function processRow (data) {
        read += this.state.rowLength
        rows.push(data)
        if (rows.length >= batchSize) await flush()
      })
      .on('end', async () => {
        if (rows.length) await flush()
        resolve()
      })

    async function flush () {
      try {
        rs.pause()
        const todo = rows.splice(0, batchSize)
        await fn(todo, Number((read / size).toFixed(4)))
        rs.resume()
      } catch (err) {
        rs.destroy()
        reject(err)
      }
    }
  })
}
