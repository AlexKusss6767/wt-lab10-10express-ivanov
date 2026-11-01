const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgresql://admin:VyQZnWn1eSty3gte3WO9eHCsINiFsGqY@dpg-dbar6umq1p3s73cpi2k0-a.oregon-postgres.render.com/wt_lab10";

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } 
});

module.exports = pool;