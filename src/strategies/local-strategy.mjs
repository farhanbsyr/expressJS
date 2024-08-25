import passport from "passport";
import { Strategy } from "passport-local";
import { mockData } from "../utils/constans.mjs";

passport.serializeUser((user, done) => {
  console.log("inside serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Inside Deserializer");
  console.log(`Deserializing User ID: ${id}`);
  try {
    const findUser = mockData.find((user) => user.id === id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`username : ${username}`);
    console.log(`password : ${password}`);
    try {
      const findUser = mockData.find((user) => user.userName === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Invalid Password");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
