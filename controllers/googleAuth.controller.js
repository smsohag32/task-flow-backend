import oauth2Client from "../config/oAuth2Client.js";
import addTaskToGoogleCalendar from "./calendar.controller.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export const googleAuth = (req, res) => {
   const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
   });
   res.redirect(url);
};

export const oauth2Callback = async (req, res) => {
   const code = req.query.code;

   try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Save the tokens in session
      req.session.tokens = tokens;

      res.send("Google authentication successful. You can now sync tasks.");
   } catch (error) {
      console.error("Error getting tokens:", error);
      res.status(500).send("Authentication failed");
   }
};

// export const addTask = async (req, res) => {
//    const { title, description, dueDate } = req.body;

//    if (!req.session.tokens) {
//       return res.status(401).send("Unauthorized, please log in first.");
//    }

//    const task = {
//       title,
//       description,
//       dueDate,
//    };

//    try {
//       oauth2Client.setCredentials(req.session.tokens);
//       const event = await addTaskToGoogleCalendar(oauth2Client, task);
//       res.status(200).send(`Task synced with Google Calendar: ${event.htmlLink}`);
//    } catch (error) {
//       console.error("Error adding task:", error);
//       res.status(500).send("Error syncing task with Google Calendar");
//    }
// };
