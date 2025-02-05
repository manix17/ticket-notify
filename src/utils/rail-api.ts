import axios from "axios";
import {
  TrainBetweenStations,
  Train,
  TrainSimple,
} from "../models/TrainInterfaces";
import {
  TrainDetails,
  TrainDetailsSimple,
  AvailabilitySimple,
} from "../models/TrainDetails";
import { sleep } from "./sleep";
import { addDays, formatAvailabilityDateText, toISTYYYYMMDD } from "./date";

export class RailApi {
  // Returns list of train between stations
  private async checkAvailableTrainBetweenStations(
    srcStn: string,
    destStn: string,
    jrnyClass: string,
    jrnyDate: string,
    quotaCode: string
  ): Promise<Train[]> {
    let data = {
      concessionBooking: false,
      srcStn,
      destStn,
      jrnyClass,
      jrnyDate,
      quotaCode,
      currentBooking: "false",
      flexiFlag: false,
      handicapFlag: false,
      ticketType: "E",
      loyaltyRedemptionBooking: false,
      ftBooking: false,
    };

    let config = {
      method: "post",
      url: "https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC",
      headers: {
        greq: "1730967083219",
        "sec-ch-ua-platform": '"macOS"',
        bmirak: "webbm",
        Referer: "https://www.irctc.co.in/nget/train-search",
        "Accept-Language": "en-US,en;q=0.0",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        DNT: "1",
        "Content-Type": "application/json; charset=UTF-8",
        "Content-Language": "en",
      },
      data: data,
    };

    const result = await axios.request(config);

    // console.log(
    //   "checkAvailableTrainBetweenStations(): ",
    //   result.headers,
    //   result.status,
    //   result.statusText,
    //   result.data
    // );

    const response: TrainBetweenStations = result.data;

    if (response.errorMessage) {
      console.log(
        "checkAvailableTrainBetweenStations(): ",
        response.errorMessage
      );
      return [];
    }

    return response.trainBtwnStnsList;
  }

  // Check Train availability status
  private async checkTrainAvailabilityStatus(
    trainNumber: string,
    jrnyDate: string,
    fromStnCode: string,
    toStnCode: string,
    classCode: string,
    quotaCode: string
  ): Promise<TrainDetails | null> {
    let data = {
      paymentFlag: "N",
      concessionBooking: false,
      ftBooking: false,
      loyaltyRedemptionBooking: false,
      ticketType: "E",
      quotaCode,
      moreThanOneDay: true,
      trainNumber,
      fromStnCode,
      toStnCode,
      isLogedinReq: false,
      journeyDate: jrnyDate,
      classCode,
    };

    let config = {
      method: "post",
      url: `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${trainNumber}/${jrnyDate}/${fromStnCode}/${toStnCode}/${classCode}/${quotaCode}/N`,
      headers: {
        greq: "1730967083219",
        "sec-ch-ua-platform": '"macOS"',
        bmirak: "webbm",
        Referer: "https://www.irctc.co.in/nget/booking/train-list",
        "Accept-Language": "en-US,en;q=0.0",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        DNT: "1",
        "Content-Type": "application/json; charset=UTF-8",
        "Content-Language": "en",
      },
      data: data,
    };

    const result = await axios.request(config);

    // console.log(
    //   "checkTrainAvailabilityStatus(): ",
    //   result.headers,
    //   result.status,
    //   result.statusText,
    //   result.data
    // );

    const response: TrainDetails = result.data;

    return response;
  }

  private async listTrainAvailability(
    trainNumber: string,
    jrnyDate: string,
    fromStnCode: string,
    toStnCode: string,
    classCode: string,
    quotaCode: string
  ): Promise<TrainDetailsSimple | null> {
    // const trainNumber = "12561"; // Train Number
    // const jrnyDate = "20250109"; // YYYYMMDD formant

    // const fromStnCode = "SIP"; // Station code
    // const toStnCode = "NDLS"; // Station code

    // const classCode = "SL"; // SL - Sleeper
    // const quotaCode = "GN"; // GN - general

    // console.log("listTrainAvailability(): ", {
    //   trainNumber,
    //   jrnyDate,
    //   fromStnCode,
    //   toStnCode,
    //   classCode,
    //   quotaCode,
    // });

    try {
      const result = await this.checkTrainAvailabilityStatus(
        trainNumber,
        jrnyDate,
        fromStnCode,
        toStnCode,
        classCode,
        quotaCode
      );

      if (!result) return null;

      const r: TrainDetailsSimple = {
        trainName: result.trainName,
        errorMessage: result.errorMessage,
        totalFare: result.totalFare,
        avlDayList: result.avlDayList
          ? result.avlDayList.map((x: AvailabilitySimple) => {
              return {
                availablityDate: x.availablityDate,
                availablityStatus: x.availablityStatus,
                reasonType: x.reasonType,
                availablityType: x.availablityType,
                wlType: x.wlType,
              };
            })
          : [],
        lastUpdateTime: result.lastUpdateTime,
      };

      // console.log("listTrainAvailability(): ", r);

      return r;
    } catch (e) {
      console.log("ERROR: listTrainAvailability(): ", e);
      throw e;
    }
  }

  async listAvailableTrains(
    from: string,
    to: string,
    date: Date
  ): Promise<TrainSimple[]> {
    const srcStn = from; // "SIP"; // Station code
    const destStn = to; // "NDLS"; // Station code

    const added_days_current = toISTYYYYMMDD(addDays(date, 1)); // Add 1 day
    const added_days_prev = toISTYYYYMMDD(addDays(date, 0)); // Add 1 day // "20250107"; // YYYYMMDD format

    const jrnyClass = ""; // Empty string for all class
    const quotaCode = "GN"; // GN - general

    console.log("Date: ", added_days_prev, added_days_current);

    // console.log("listAvailableTrains(): ", {
    //   srcStn,
    //   destStn,
    //   jrnyClass,
    //   jrnyDate,
    //   quotaCode,
    // });

    try {
      const resultPrev = await this.checkAvailableTrainBetweenStations(
        srcStn,
        destStn,
        jrnyClass,
        added_days_prev,
        quotaCode
      );

      // console.log("ResultPrev: ", resultPrev);

      const resultCurrent = await this.checkAvailableTrainBetweenStations(
        srcStn,
        destStn,
        jrnyClass,
        added_days_current,
        quotaCode
      );

      if (!resultCurrent || !resultPrev) {
        console.log(
          "listAvailableTrains(): Error: Train between stations not available from API"
        );
        return [];
      }

      // console.log("ResultCurrent: ", resultCurrent);

      for (const currTrain of resultCurrent) {
        const currentTrainFound = !!resultPrev.find(
          (p) => p.trainNumber === currTrain.trainNumber
        );
        console.log(
          `Current train ${currTrain.trainName} found:  `,
          currentTrainFound
        );
        if (!currentTrainFound)
          resultPrev.push({ ...currTrain, isCurrent: true });
      }

      const r: TrainSimple[] = resultPrev.map((x) => {
        return {
          trainNumber: x.trainNumber,
          trainName: x.trainName,
          fromStnCode: x.fromStnCode,
          toStnCode: x.toStnCode,
          avlClasses: x.avlClasses,
          availabilityClass: [],
          isCurrent: x.isCurrent,
        };
      });

      // console.log("listAvailableTrains(): ", r);
      console.log(
        `There are ${
          r.length
        } train(s) available between ${srcStn} and ${destStn} on ${added_days_prev} and ${added_days_current} for ${
          jrnyClass !== "" ? jrnyClass : "ALL"
        } class\n`
      );

      for (const train of r) {
        console.log(
          `🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂${train.trainNumber}🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂🚂`
        );
        console.log(train);
        for (const cls of train.avlClasses) {
          await sleep(4000);
          console.log(`--------${cls}--------`);
          const jrnyDate = train.isCurrent
            ? added_days_current
            : added_days_prev;

          const trainDetails = await this.listTrainAvailability(
            train.trainNumber,
            jrnyDate,
            train.fromStnCode,
            train.toStnCode,
            cls,
            quotaCode
          );

          if (trainDetails) {
            if (trainDetails.errorMessage) {
              train.availabilityClass.push({
                classCode: cls,
                availability: [],
                errorMessage:
                  formatAvailabilityDateText(jrnyDate) +
                  " -> " +
                  trainDetails.errorMessage,
              });
            } else {
              train.availabilityClass.push({
                classCode: cls,
                availability: trainDetails.avlDayList,
              });
              console.log(trainDetails.avlDayList);
            }
          } else continue;
        }
      }

      return r;
    } catch (e) {
      console.log("ERROR: listAvailableTrains(): ", e);
      // throw e;
    }
    return [];
  }
}
