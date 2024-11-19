//overarching layer
const { Router } = require("express");
//authentication layer
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

//controller layer
const {
  homepage,
  getUserSignUp,
  userLogout,
  userLogin,
  userSignUp,
} = require("../controllers/authController");

const authRouter = Router();

//middleware for auth
passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("Authenticating:", username, password);
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

authRouter.get("/", homepage);
authRouter.get("/sign-up", getUserSignUp);
authRouter.get("/log-out", userLogout);
authRouter.post("/log-in", userLogin);
authRouter.post("/sign-up", userSignUp);

module.exports = authRouter;
