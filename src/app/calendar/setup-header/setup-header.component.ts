import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ViewTypes } from "../_data/enums/view-types";
import { CalendarService } from "../_data/calendar.service";
import { isEmptyObj } from "../../../utils/utils";
import { MOMENT } from "../../../utils/moment";
import { DurationInputArg2 } from "moment";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-setup-header',
  templateUrl: './setup-header.component.html',
  styleUrls: ['./setup-header.component.scss']
})
export class SetupHeaderComponent implements OnInit, OnDestroy{
  viewTypes = ViewTypes;
  currentDate = {};
  selected: ViewTypes = this.viewTypes.month;
  currentMonth = '';
  private unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private router: Router, private route: ActivatedRoute,
    private calendarService: CalendarService,
    @Inject(MOMENT) private moment: Function
  ) {
  }

  ngOnInit(): void {
    this.calendarService.currentDateObservable().pipe(takeUntil(this.unsubscribeAll)).subscribe( (params) => {
      if (isEmptyObj(params)) {
        const paramsFormat = this.calendarService.fromDateToQuery(this.moment().clone().startOf('month'));
        this.updateDateParams(paramsFormat);
        this.currentDate = paramsFormat;
      } else {
        this.currentDate = params;
      }
      this.currentMonth = this.calendarService.getCurrentMonth(params);

    })
  }

  set selectType(value: ViewTypes) {
    const oldType = this.selectType;
    this.selected = value;
    const newRout = this.getNewRoutOfView(oldType);
    this.router.navigate([newRout])
  };

  get selectType(): ViewTypes {
    return this.selected;
  };

  getNewRoutOfView(oldTypeSegment: string): string {
    const urlArr = this.router.url.split('/');
    const segmentIndex = urlArr.findIndex((segment) => segment === oldTypeSegment);
    urlArr[segmentIndex] = this.selectType;
    return urlArr.join('/');
  }

  nextHandler(): void {
    const nextDate = this.calendarService.getNextFullDate(this.currentDate, this.selected as DurationInputArg2);
    this.updateDateParams(nextDate)
  }

  prevHandler(): void {
    const nextDate = this.calendarService.getPrevFullDate(this.currentDate, this.selected as DurationInputArg2);
    this.updateDateParams(nextDate)
  }

  updateDateParams(queryParams: Params) {
    const {year, month, day}= queryParams;
    this.router.navigate([this.selected, year, month, day], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
    this.unsubscribeAll.unsubscribe();
  }

}
