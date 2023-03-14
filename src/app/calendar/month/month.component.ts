import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from "../_data/calendar.service";
import { ActivatedRoute } from "@angular/router";
import { isEmptyObj } from "../../../utils/utils";
import { MatDialog } from "@angular/material/dialog";
import { EditEventModalComponent } from "../edit-event-modal/edit-event-modal.component";
import { CONSTANTS } from "../../core/data/constants";
import { Subject, takeUntil } from "rxjs";
import { AddEventModalComponent } from "../add-event-modal/add-event-modal.component";
import { IEvent } from "../_data/interfaces/event";

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit, OnDestroy {
  calendarDates: any = [];
  private unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private matDialog: MatDialog
  ) {
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
      .subscribe((events) =>{  // todo rework extra rendering disappears
      this.calendarDates = this.calendarService.buildMonthCalendar(this.calendarService.fromQueryToDate(this.calendarService.currentDate))
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
