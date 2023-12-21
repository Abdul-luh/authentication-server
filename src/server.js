// const express = require("express");
// const mysql = require("mysql");
// const bodyParser = require("body-parser");
// import bycrypt from "bcrypt"; // const bcrypt = require("bcrypt");
// const cors = require("cors");
// const saltRounds = 10;
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const handleRegister = require("../routeHandlers/register/register");

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import session from "express-session";
import {
	handleLoginRoute,
	getLoginHandler,
} from "../routeHandlers/login/login.js";
import { handleRegister } from "../routeHandlers/register/register.js";

const PORT = process.env.port || 4500;
const app = express();
import dbConnect from "./dbConnect.js";
// const Login = require("../routeHandlers/login/login");

app.use(express.json());

const whitelist = [
	"chrome-untrusted://new-tab-page/",
	"http://localhost:3000",
	"localhost:4500/login",
];
const corsOptions = {
	origin:
		// whitelist,
		(origin, callback) => {
			if (whitelist.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error("NOT ALLOWED BY CORS"));
			}
		},
	method: ["GET", "POST"],
	credentials: true,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		key: "userId",
		secret: "subscribe",
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 1000 * 60 * 8,
		},
	})
);

app.post("/register", handleRegister);

const verifyToken = (req, res, next) => {
	const token = req.headers["x-access-token"];
	if (!token) {
		res.send("Yo we need a token please Provide one next time");
	} else {
		jwt.verify(token, "jwtSecrete", (err, decoded) => {
			if (err) {
				res.json({ auhen: false, message: "U failed to authenticate" });
			} else {
				req.userId = decoded.id;
				console.log(req.userId);
				next();
			}
		});
	}
};

app.get("/isAuthorised", verifyToken, (req, res) => {
	res.send("Yo, you are authenticated");
});

app.get("/login", getLoginHandler);

app.post("/login", handleLoginRoute);

app.get("/get", (req, res) => {
	const sqlGet = "SELECT * FROM users";
	dbConnect.query(sqlGet, (err, result) => {
		err ? console.log(err) : res.send(result);
	});
});

app.listen(PORT, () => {
	console.log(`listen on port ${PORT}`);
});
