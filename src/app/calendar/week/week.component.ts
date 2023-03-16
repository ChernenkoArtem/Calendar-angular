import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { isEmptyObj } from "../../../utils/utils";
import { MOMENT } from "../../../utils/moment";
import { CalendarService } from "../_data/calendar.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CalendarCommon } from "../_data/calendar-common";

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent extends CalendarCommon implements OnInit, OnDestroy{

  calendarDates: any = [];
  weekdays: string[] = [];
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    @Inject(MOMENT) private date: Function,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    matDialog: MatDialog,
  ) {
    super(matDialog);
    this.matDialog = matDialog;
  }
  ngOnInit(): void {
    this.weekdays = this.calendarService.getDaysNamesList();

    this.route.firstChild?.paramMap.pipe(takeUntil(this.unsubscribeAll)).subscribe((params) => {

      if (!isEmptyObj(params)) {
        const dateParams = {
          year: params.get('year'),
          month: params.get('month'),
          day: params.get('day'),
        }
        this.calendarService.currentDate = dateParams;
        this.calendarDates = this.calendarService.buildWeekCalendar(this.calendarService.fromQueryToDate(dateParams));
      }
    })

    this.calendarService.eventsCollectionObservable()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((events) =>{  // todo rework extra rendering disappears
        this.calendarDates = this.calendarService.buildWeekCalendar(this.calendarService.fromQueryToDate(this.calendarService.currentDate))
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
    this.unsubscribeAll.unsubscribe();
  }
}
