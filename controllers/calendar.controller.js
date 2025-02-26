import { google } from "googleapis";

async function addTaskToGoogleCalendar(auth, task) {
   const calendar = google.calendar("v3");

   const event = {
      summary: task.title,
      description: task.description,
      start: {
         dateTime: task.dueDate,
         timeZone: "America/Los_Angeles",
      },
      end: {
         dateTime: task.dueDate,
         timeZone: "America/Los_Angeles",
      },
   };

   try {
      const response = await calendar.events.insert({
         auth: auth,
         calendarId: "primary",
         resource: event,
      });

      return response.data;
   } catch (error) {
      console.error("Error syncing with Google Calendar", error);
      throw new Error("Google Calendar sync failed");
   }
}

export default addTaskToGoogleCalendar;
