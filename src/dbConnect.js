// const mysql = require("mysql");

// const db = mysql.createConnection({
// 	user: "root",
// 	host: "localhost",
// 	password: "root123",
// 	database: "LoginSystem",
// 	connectionLimit: 20,
// });

// db.connect((err) => {
// 	err ? `error connecting to Mysql ${err}` : "Database connected successfully";
// });

// module.exports = db;

import mysql from "mysql";

const dbConnect = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "root123",
	database: "LoginSystem",
	connectionLimit: 20,
});

export default dbConnect;
