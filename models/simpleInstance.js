var pool = require('../config/db.js');

exports.updates = (cb) => {
  let sql = `SELECT update_text, image_path, created_at FROM updates WHERE deleted_at IS NULL ORDER BY created_at DESC;`

  pool.query(sql, (err, results, fields) => {
    if(err) throw new Error(err)
    cb(results)
  })
}

exports.saveUpdate = (data, cb) => {
  let sql = `INSERT INTO updates(update_text, image_path, created_at, updated_at) VALUES(?, ?, now(), now());`
  let params = [
    data.update,
    data.image_path
  ]

  pool.query(sql, params, (err, results, fields) => {
    if(err) throw new Error(err)
    cb(results.insertId)
  })
}

exports.join = (data, cb) => {
  let sql = `INSERT INTO people(name, catatan, bank_id, nominal, image_path, created_at, updated_at) VALUES(?, ?, ?, ?, ?, now(), now());`
  let params = [
    data.nama,
    data.catatan,
    data.bank_id,
    data.nominal,
    data.image_path
  ]

  pool.query(sql, params, (err, results, fields) => {
    if(err) throw new Error(err)
    cb(results.insertId)
  })

}

exports.goodpeople = (cb) => {
  let sql = `SELECT name, catatan, nominal, image_path, created_at FROM people WHERE deleted_at IS NULL ORDER BY created_at DESC;`

  pool.query(sql, (err, results, fields) => {
    if(err) throw new Error(err)
    cb(results)
  })
}
