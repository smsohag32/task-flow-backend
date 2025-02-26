import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_REDIRECT_URI,
         scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
               user = new User({
                  googleId: profile.id,
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  googleAccessToken: accessToken,
                  googleRefreshToken: refreshToken,
               });

               await user.save();
            }

            return done(null, user);
         } catch (error) {
            console.error(error);
            return done(error, null);
         }
      }
   )
);

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id);
      done(null, user);
   } catch (error) {
      done(error, null);
   }
});
