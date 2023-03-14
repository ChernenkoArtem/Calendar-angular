import * as moment from "moment";
import { InjectionToken } from "@angular/core";

export type momentType = moment.Moment;
export const MOMENT = new InjectionToken<any>(
  'moment',
  {
    factory: () => moment,
  },
);


moment.updateLocale('en',{
  week: {
    dow: 1,
  },
});
