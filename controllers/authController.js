const passport = require("passport");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { body, validationResult } = require("express-validator");
const { getAllMessages } = require("../db/queries");
require("dotenv").config({ path: "../.env" });

//input validation///
const signupValidation = [
  body("firstname").isLength({ min: 1 }).withMessage("First name is required"),
  body("lastname").isLength({ min: 1 }).withMessage("Last name is required"),
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 chars long")
    .custom(async (username) => {
      //no duplicate usernames
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (rows.length > 0) {
        throw new Error("Username is already taken");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
  //user must confirm password
  body("passwordConfirm").custom((passwordConfirm, { req }) => {
    if (passwordConfirm !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),
];

//controller functions///
async function homepage(req, res) {
  //this should operate regardless if user has an account or not
  try {
    const messages = await getAllMessages();
    console.log("messages after the db await", messages);

    //conditional return to the const
    // what will be sent to the render response
    const messagesToRender = messages.map((message) => {
      if (req.user && req.user.membership) {
        return {
          title: message.title,
          content: message.content,
          timestamp: message.timestamp,
          username: message.username,
        };
      }

      return {
        title: message.title,
        content: message.content,
        timestamp: message.timestamp,
      };
    });

    //check if we're getting anything
    console.log("messagesToRender after the map:", messagesToRender);

    res.render("index", {
      title: "Message Board",
      // this doesnt cause a crash if you dont give a ternary
      user: req.user,
      // this causes a crash if you dont give a ternary
      member: req.user ? req.user.membership : null,
      messages: messagesToRender,
    });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).send("Error fetching messages");
  }
}

function getUserSignUp(req, res) {
  // give the initial render arguments for errors/formData
  // or else formData will go undefined and 404 the page
  res.render("sign-up-form", { errors: [], formData: {} });
}

function userLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

function userLogin(req, res, next) {
  console.log("Enter controller function");
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res, next); // Explicitly invoke the middleware
}

async function userSignUp(req, res) {
  //validation errors

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // send errors to the form for user to adjust inputs with
    // validation feedback
    return res.render("sign-up-form", {
      //send back the errors
      errors: errors.array(),
      //send back the form data so the user doesnt have to restart every field on re-render
      formData: req.body || {},
    });
  }

  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      console.log("error hashing");
      return res.redirect("/");
    }
    try {
      await pool.query(
        "INSERT INTO users (firstname, lastname, username, password) VALUES ($1,$2,$3,$4)",
        [
          req.body.firstname,
          req.body.lastname,
          req.body.username,
          hashedPassword,
        ]
      );
      res.redirect("/");
    } catch (dbErr) {
      console.log("error inserting into db:", dbErr);
      return res.redirect("/");
    }
  });
}

//membership section//
function getMembership(req, res) {
  res.render("membership", { error: "" });
}
//VERIFY THAT THE USERID REQ.SES HOOKS THE DB USERID
async function handleMembership(req, res) {
  const { secretKey } = req.body;
  if (secretKey === process.env.MEMBERSHIP_SECRET) {
    try {
      const userID = req.user.id;
      await pool.query("UPDATE users SET membership=true WHERE id=$1", [
        userID,
      ]);
      return res.redirect("/");
    } catch (err) {
      console.error("Error updating membership:", err);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    res.render("membership", { error: "Invalid secret key." });
  }
}

module.exports = {
  homepage,
  getUserSignUp,
  userLogout,
  userLogin,
  userSignUp,
  signupValidation,
  getMembership,
  handleMembership,
};
