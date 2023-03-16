import { Inject, Injectable } from '@angular/core';
import { MOMENT, momentType } from "../../../utils/moment";
import { Params } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { EventStore } from "./interfaces/event";
import { EventsStoreService } from "./events-store.service";
import { CONSTANTS } from "../../core/data/constants";
import { DurationInputArg2 } from "moment/moment";

@Injectable()
export class CalendarService {

  private $currentDate: BehaviorSubject<Params> = new BehaviorSubject({});
  private $eventsCollection: BehaviorSubject<EventStore> = new BehaviorSubject(this.eventsStoreService.getAllEvents());
  constructor( @Inject(MOMENT) private moment: Function, private eventsStoreService: EventsStoreService) { }


  get currentDate(): Params {
    return this.$currentDate.getValue();
  }

  set currentDate(params: Params) {
    this.$currentDate.next(params);
  }

  currentDateObservable(): Observable<Params> {
    return this.$currentDate.asObservable();
  }

  get eventsCollection(): EventStore {
    return this.$eventsCollection.getValue();
  }

  set eventsCollection(params: EventStore) {
    this.$eventsCollection.next(params);
  }

  eventsCollectionObservable(): Observable<EventStore> {
    return this.$eventsCollection.asObservable();
  }
   buildMonthCalendar (date: momentType)  {
    const resultMonthDates = [];

    const startDay = date.clone().startOf("month").startOf("week");
    const endDay = date.clone().endOf("month").endOf("week");

    const _date = startDay.clone().subtract(1, "day");
    const events = this.eventsCollection;

    while (_date.isBefore(endDay, "day")) {
      resultMonthDates.push(
        Array(7)
          .fill(0)
          .map(() => {
            const day = _date.add(1, "day").clone();
            return {
              day: day.date(),
              fullDate: day,
              events: events[day.format(CONSTANTS.commonFormat)]
            }
          })
      );
    }
    return resultMonthDates;
  }

  buildWeekCalendar(date: momentType) {
    const resultDates = [];

    const startDayWeek = date.clone().startOf("week").subtract(1, "day");
    const endDayWeek = date.clone().endOf("week");

    const events = this.eventsCollection;

    while (startDayWeek.isBefore(endDayWeek, "day")) {
      const day = startDayWeek.add(1, "day").clone();

      resultDates.push({
        day: day.date(),
        fullDate: day,
        events: events[day.format(CONSTANTS.commonFormat)]
      });
    }

    return resultDates;
  }

  getNextFullDate(queryParams: Params, type: DurationInputArg2): Params {
    const date = this.fromQueryToDate(queryParams);
    const newDate =  date.clone().add(1, type);
    return this.fromDateToQuery(newDate);
  }

  getPrevFullDate(queryParams: Params, type: DurationInputArg2): Params {
    const date = this.fromQueryToDate(queryParams);
    const newDate =  date.clone().subtract(1, type);
    return this.fromDateToQuery(newDate);
  }

  getCurrentMonth(queryParams: Params): string {
    const date = this.fromQueryToDate(queryParams);
    return date.clone().format(CONSTANTS.fullMonthNameFormat);
  }

  fromQueryToDate(queryParams: Params): momentType {
    const {year , month, day} = queryParams
    return this.moment(new Date(year,month,day));
  }

  getDaysNamesList(): string[] {
    // @ts-ignore
    return this.moment.weekdays(true);
  }

  fromDateToQuery(date: momentType): Params {
    return {
      year: date.year(),
      month: date.month(),
      day: date.date()
    }

  }

}
