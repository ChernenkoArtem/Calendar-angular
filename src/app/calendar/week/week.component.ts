import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { isEmptyObj } from "../../../utils/utils";
import { MOMENT } from "../../../utils/moment";
import { CalendarService } from "../_data/calendar.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AddEventModalComponent } from "../add-event-modal/add-event-modal.component";
import { CONSTANTS } from "../../core/data/constants";
import { IEvent } from "../_data/interfaces/event";
import { EditEventModalComponent } from "../edit-event-modal/edit-event-modal.component";

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit, OnDestroy{

  calendarDates: any = [];
  weekdays: string[] = [];
  private unsubscribeAll: Subject<any> = new Subject();
  constructor(
    @Inject(MOMENT) private date: Function,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private matDialog: MatDialog
  ) {
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

  openCreateEventModal(clickEvent: Event, value: any){
    clickEvent.stopPropagation();

    this.matDialog.open(AddEventModalComponent, {
      ...CONSTANTS.rightSidebarSettingsMedium,
      data: {
        events: value.events,
        fullDate: value.fullDate
      }
    });
  }

  openEditEventModal(clickEvent: Event, event: IEvent) {
    clickEvent.stopPropagation();

    this.matDialog.open(EditEventModalComponent, {
      ...CONSTANTS.rightSidebarSettingsMedium,
      data: {
        event,
      }
    });
  }



  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
    this.unsubscribeAll.unsubscribe();
  }
}
