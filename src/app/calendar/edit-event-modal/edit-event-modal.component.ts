import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { IEvent } from "../_data/interfaces/event";
import { EventsStoreService } from "../_data/events-store.service";
import { CalendarService } from "../_data/calendar.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { of, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-edit-event-modal',
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditEventModalComponent implements OnInit, OnDestroy {
  eventForm!: FormGroup;
  isSubmitted = false;
  private unsubscribeAll: Subject<any> = new Subject();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: IEvent},
    private eventsStoreService: EventsStoreService,
    private calendarService: CalendarService,
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.eventForm = this.createForm(this.data.event);
  }


  createForm(event: IEvent): FormGroup {
    return this.fb.group({
      event,
    });
  }

  updateEvent() {
    this.isSubmitted = true;

    if (this.eventForm.valid) {
      const formData = this.eventForm.getRawValue();

      of(this.eventsStoreService.updateEvent(formData.event))
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
