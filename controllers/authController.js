const passport = require("passport");

async function homepage(req, res) {}

function getUserSignUp(req, res) {
  res.render("sign-up-form");
}

function userLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
    authRouter.get("/sign-up", getUserSignUp);
  });
}

function userLogin() {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  });
}

async function userSignUp(req, res) {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      console.log("error hashing");
      return res.redirect("/");
    }
    try {
      await pool.query("INSERT INTO users (username,password) VALUES ($1,$2)", [
        req.body.username,
        hashedPassword,
      ]);
      res.redirect("/");
    } catch (dbErr) {
      console.log("error inserting into db:", dbErr);
      return res.redirect("/");
    }
  });
}

module.exports = { homepage, getUserSignUp, userLogout, userLogin, userSignUp };
