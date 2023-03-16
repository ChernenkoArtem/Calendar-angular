import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { momentType } from "../../../utils/moment";
import { FormBuilder, FormGroup } from "@angular/forms";
import { EventsType } from "../_data/enums/events-type";
import { EventsStoreService } from "../_data/events-store.service";
import { of, Subject, takeUntil } from "rxjs";
import { CalendarService } from "../_data/calendar.service";
import { uid } from "../../../utils/utils";

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddEventModalComponent implements OnInit, OnDestroy {
  eventForm!: FormGroup;
  isSubmitted = false;
  private unsubscribeAll: Subject<any> = new Subject();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {fullDate: momentType},
    private eventsStoreService: EventsStoreService,
    private calendarService: CalendarService,
    private fb: FormBuilder,
    private matDialog: MatDialog
   ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      event: {
        id: uid(),
        name: null,
        text: null,
        type: EventsType.common,
        date: this.data.fullDate,
        startDate: null,
        endDate: null,
        isFullDay: true
      }

    });
  }

  saveEvent(): void {
    this.isSubmitted = true;

    if (this.eventForm.valid) {
      const formData = this.eventForm.getRawValue();
      of(this.eventsStoreService.addEventToStorage(formData.event))
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((events) => {
          this.calendarService.eventsCollection = events;
          this.matDialog.closeAll();
        })
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
    this.unsubscribeAll.unsubscribe();
  }
}
