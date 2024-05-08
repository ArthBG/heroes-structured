const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'villainsbts',
    password: 'ds564',
    port: 5432,
});

module.exports = pool;