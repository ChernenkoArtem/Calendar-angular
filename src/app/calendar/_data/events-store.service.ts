import { Inject, Injectable } from '@angular/core';
import { EventStore, IEvent } from "./interfaces/event";
import { CONSTANTS } from "../../core/data/constants";
import { MOMENT } from "../../../utils/moment";

@Injectable()
export class EventsStoreService {
  private readonly eventsStoreKey: string;
  constructor(@Inject(MOMENT) private moment: Function) {
    this.eventsStoreKey = 'events';
  }

  addEventToStorage(event: IEvent): EventStore {
    const {key, events} = this.getEvenData(event)

    if (events[key]) {
      this.setItem( this.eventsStoreKey, { ...events, [key]: [...events[key], event]});
    } else {
      this.setItem( this.eventsStoreKey,  { ...events, [key]: [event]});
    }
    return this.getItem( this.eventsStoreKey);
  }

  updateEvent(event: IEvent): EventStore {
    event.date = this.moment(event.date);
    const {key, events} = this.getEvenData(event)

    if (events[key]) {
      const updatedEventsArr = events[key].map((eventItem: IEvent ) => {
        if (eventItem.id === event.id) {
          return event;
        } else {
          return eventItem;
        }
      })
      this.setItem( this.eventsStoreKey, { ...events, [key]: updatedEventsArr});
    }

    return this.getItem( this.eventsStoreKey);
  }

  getEvenData(event: IEvent): {key: string, events: EventStore} {
    const events: EventStore = this.getItem( this.eventsStoreKey) || {};

    const key = event.date.format(CONSTANTS.commonFormat)

    return {key, events}
  }


  getAllEvents(): EventStore {
    return this.getItem( this.eventsStoreKey);
  }


  private setItem(key: any, item: any) {
    localStorage.setItem(key, JSON.stringify(item))
  }

  private getItem(key: string) {
    const data = localStorage.getItem(key);
    if (!data) return;
    return JSON.parse(data);
  }


}
