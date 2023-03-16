import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from "../_data/calendar.service";
import { ActivatedRoute } from "@angular/router";
import { isEmptyObj } from "../../../utils/utils";
import { MatDialog } from "@angular/material/dialog";
import { Subject, takeUntil } from "rxjs";
import { CalendarCommon } from "../_data/calendar-common";

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent extends CalendarCommon implements OnInit, OnDestroy {
  calendarDates: any = [];
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    matDialog: MatDialog
  ) {
    super(matDialog);
    this.matDialog = matDialog;
  }

  ngOnInit(): void {
    this.route.firstChild?.paramMap.pipe(takeUntil(this.unsubscribeAll)).subscribe((params) => {

      if (!isEmptyObj(params)) {
        const dateParams = {
          year: params.get('year'),
          month: params.get('month'),
          day: params.get('day'),
        }
        this.calendarService.currentDate = dateParams;
        this.calendarDates = this.calendarService.buildMonthCalendar(this.calendarService.fromQueryToDate(dateParams));
      }
    })

    this.calendarService.eventsCollectionObservable()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((events) => {  // todo rework extra rendering disappears
      this.calendarDates = this.calendarService.buildMonthCalendar(this.calendarService.fromQueryToDate(this.calendarService.currentDate))
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
    this.unsubscribeAll.unsubscribe();
  }


}
