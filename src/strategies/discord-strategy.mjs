import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schema/discord-users.mjs";

passport.serializeUser((user, done) => {
  console.log("inside serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserializer");
  console.log(`Deserializing User ID: ${id}`);
  try {
    const findUser = await DiscordUser.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: "1277887092634157130",
      clientSecret: "DRRdPL96EImN9-J2tEVNiaj-yaqa0p3p",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({
          discordId: profile.id,
        });
      } catch (error) {
        return done(error, null);
      }

      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
