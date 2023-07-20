const express = require("express");
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    return res.status(200).send({ users: users });
  } catch (err) {
    return res.status(500).send({ message: "something went wrong....." });
  }
});

router.post(
  "/",
  body("firstName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("firstName is not empty")
    .isLength({ min: 4 })
    .withMessage("firsName is not less than 4 character"),
  body("email")
    .isEmail()
    .custom(async (value, res) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email already exists");
      }
    }),
  body("age")
    .isNumeric()
    .custom((value) => {
      if (value < 1 || value > 120) {
        throw new Error("incorrect age provide");
      } else {
        return true;
      }
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password is not empty")
    .custom((value) => {
      const passW = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (!value.match(passW)) {
        throw new Error("password must be strong");
      }
      console.log("password", value);
      return true;
    }),
  body("cp")
    .not()
    .isEmpty()
    .withMessage("confirm should not empty")
    .custom((value, { req }) => {
      console.log("confirm password", value);
      if (value !== req.body.password) {
        throw new Error("password not matched");
      }
      return true;
    }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await User.create(req.body);
      return res.status(200).send({ user: user });
    } catch (err) {
      return res.status(500).send({ message: "something went wrong....." });
    }
  }
);

module.exports = router;
