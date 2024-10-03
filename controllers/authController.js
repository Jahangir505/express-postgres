const req = require("express/lib/request");
const users = require("../db/models/users");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const bcrypt = require("bcrypt");
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "90d",
  });
};
const signUp = async (req, res, next) => {
  const body = req.body;
    console.log(body);
    
  if (!["admin", "vendor"].includes(body.userType)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid user type",
    });
  }

  const newUser = await users.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  const result = newUser.toJSON();
  delete result.password;
  delete result.deletedAt;
  result.token = generateToken({
    id: result.id,
  });

  if (!newUser) {
    return res.status(400).json({
      status: "fail",
      message: "User not created",
    });
  }
  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    user: result,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }
  const result = await users.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }

  const token = generateToken({
    id: result.id,
  });
  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
};

module.exports = { signUp, login };
