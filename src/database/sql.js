import mysql from "mysql2";

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',
    user: 'root',
    database: 'finalproject',
    password: '0000',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

const promisePool = pool.promise();

export const selectSql = {

}

export const createSql = {

}

export const updateSql = {

}

export const deleteSql = {
    
}