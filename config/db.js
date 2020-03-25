var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: 'wkopdut1h4v3n0w',
    database: 'sapddb'
    // user: 'laravel',
    // password: 'laravel',
    // database: 'sapddb',
});

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection was closed.');
        }else if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connections.');
        }else if(err.code === 'ECONNREFSED'){
            console.error('Database connection was refused.');
        }
    }

    if(connection) connection.release();

    return;
});

module.exports = pool;
