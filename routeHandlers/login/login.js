// const db = require("../../src/dbConnect");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

import dbConnect from "../../src/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getLoginHandler = (req, res) => {
	if (req.session.user) {
		console.log(req.session.user);
		res.send({ loggedIn: true, user: req.session.user });
	} else {
		res.send({ loggedIn: false });
	}
};

export const handleLoginRoute = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const sqlPost = "SELECT * FROM users WHERE username = ?";

	dbConnect.query(sqlPost, [username, password], (err, result) => {
		if (err) res.send({ err: err });

		result.length > 0
			? bcrypt.compare(password, result[0].password, (error, response) => {
					if (response) {
						const id = result[0].id;
						const token = jwt.sign({ id }, "jwtSecrete", {
							expiresIn: 1000 * 60 * 8,
						});
						req.session.user = result;
						console.log(req.session.user);
						res.json({ authr: true, token: token, result: result });
					} else {
						res.json({
							authr: true,
							message: "wrong usename/password combination",
						});
					}
			  })
			: res.json({
					authr: true,
					message: "User Doesn't Exists",
			  });
	});
};

// module.exports = { getLoginHandler, handleLoginRoute };
