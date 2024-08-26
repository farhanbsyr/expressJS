import passport from "passport";
import { Strategy } from "passport-local";
import { mockData } from "../utils/constans.mjs";
import { User } from "../mongoose/schema/user.mjs";
import { comparePassword } from "../utils/helper.mjs";
passport.serializeUser((user, done) => {
  console.log("inside serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserializer");
  console.log(`Deserializing User ID: ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (!comparePassword(password, findUser.password))
        throw new Error("Bad Credential");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
