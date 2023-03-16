import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder, FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators
} from "@angular/forms";
import { IEvent } from "../_data/interfaces/event";
import { EventsType } from "../_data/enums/events-type";
import { distinctUntilChanged, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EventFormComponent),
      multi: true,
    },
  ],
})
export class EventFormComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy{

  eventForm!: FormGroup;
  event!: IEvent;
  eventsType = EventsType;
  @Input() isSubmitted = false;
  private unsubscribeAll: Subject<any> = new Subject();
  constructor(private fb: FormBuilder) {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isSubmitted'] && changes['isSubmitted'].currentValue !== changes['isSubmitted'].previousValue) {
      if (changes['isSubmitted'] && changes['isSubmitted'].currentValue) {
        this.eventForm.markAllAsTouched();
      }
    }
  }

  ngOnInit(): void {
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;

    this.initForm(this.event);
    this.onChange(this.eventForm.value);

    this.eventForm.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribeAll))
      .subscribe((value: IEvent) => {
        this.onChange(value);
      });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (value) {
      this.event = value;
      if (this.eventForm) this.eventForm.updateValueAndValidity();
    }

    if (value === null) {
      this.eventForm.reset();
    }
  }

  validate(control: FormControl) {
    if (control.touched) {
      this.eventForm.markAllAsTouched();
    }
    if (this.isSubmitted) {
      this.eventForm.markAllAsTouched();
    }
    return this.eventForm.valid ? null : { dataSource: { valid: false } };
  }


  private initForm(event: IEvent): void {
    this.eventForm = this.fb.group({
      id: [event?.id],
      name: [event?.name, { validators: [Validators.required] }],
      text: [event?.text],
      type: [event?.type, { validators: [Validators.required] }],
      date: [event?.date , { validators: [Validators.required] }],
      startDate: [event?.startDate],
      endDate: [event?.endDate],
      isFullDay: [event?.isFullDay]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
    this.unsubscribeAll.unsubscribe();
  }



}
