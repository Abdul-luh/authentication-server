// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken"
import dbConnect from "../../src/dbConnect.js";

const saltRounds = 10;

export function handleRegister(req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const sqlPost = "INSERT INTO users (username, password) VALUES (?,?)";

	bcrypt.hash(password, saltRounds, (err, hash) => {
		err
			? console.log(err)
			: dbConnect.query(sqlPost, [username, hash], (err, result) => {
					err ? console.log(err) : res.send(result);
			  });
	});
}

// module.exports = { handleRegister };
