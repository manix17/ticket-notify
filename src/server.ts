import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import path from "path";

import { RailApi } from "./utils/rail-api";
import { addDays, formatDateText, toISTYYYYMMDD } from "./utils/date";

const api = new RailApi();

export class Server {
  private httpServer!: HTTPServer;
  private app!: Application;

  private readonly DEFAULT_PORT = 3000;

  constructor() {
    this.initialize();
    this.handleRoutes();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);

    this.configureApp();
  }

  private handleRoutes(): void {
    this.app.get("/today/:from/:to", async (req, res) => {
      let { from, to } = req.params;

      from = from.toUpperCase();
      to = to.toUpperCase();

      const today = new Date();
      const days_to_add = 60;
      const added_days = addDays(today, days_to_add);
      const added_days_text = formatDateText(added_days);

      // const from = "CPR";
      // const to = "NDLS";
      const eventName = "Deepawali";

      const startTime = Date.now(); // Record the start time
      const trainList = await api.listAvailableTrains(from, to, added_days);
      const endTime = Date.now(); // Record the end time
      const timeTaken = endTime - startTime;

      let text = "<pre>";
      let apiCalls = 0;
      if (trainList.length) {
        apiCalls += 2;
        console.log(
          `Data fetch success for ${from} -> ${to} on ${added_days_text}`
        );

        text += `Train Ticket Status on ${added_days_text} (today + ${days_to_add} days) 🤩\n`;

        for (const train of trainList) {
          text += "\n==============================";
          text += `\n🚂 ${train.trainNumber} - ${train.trainName}`;
          text += `\n📍 ${train.fromStnCode} -> ${train.toStnCode}\n`;

          apiCalls += train.avlClasses.length;

          for (const cls of train.availabilityClass) {
            text += `\n${cls.classCode}`;
            if (!cls.availability || !cls.availability.length)
              text += `\n${cls.errorMessage}`;
            for (const date of cls.availability) {
              text += `\n${date.availablityDate} -> ${date.availablityStatus}`;
            }
            text += "\n";
          }
        }
      } else {
        text += `Train Tickets booking will open today for ${added_days_text} (today + ${days_to_add} days) soon, kindly check.`;
        text += "\n========================";
        text += `\n${from} -> ${to}`;
        text += "\nTicket status not available";
      }
      text += "\n\n\n\n---------------------END------------------------";
      text += `\nTotal API Calls Required: ${apiCalls}`;
      text += `\nTotal API call took ${timeTaken / 1000} s`;
      text += "</pre>";
      res.send(text);
    });
  }

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}
