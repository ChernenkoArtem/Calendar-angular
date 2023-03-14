import { momentType } from "../../../../utils/moment";
import { EventsType } from "../enums/events-type";

export interface IEvent {
  id?: number;
  name: string;
  text?: string;
  type: EventsType;
  date: momentType;
  startDate?: momentType;
  endDate?: momentType;
  isFullDay?: boolean;
}

export interface EventStore {
    [key: string]: Array<IEvent>;
}

