import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MatSelectModule } from '@angular/material/select';
import { CalendarComponent } from "./calendar.component";
import { SetupHeaderComponent } from "./setup-header/setup-header.component";
import { EditEventModalComponent } from './edit-event-modal/edit-event-modal.component';
import { MatDialogModule } from "@angular/material/dialog";
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { EventFormComponent } from './event-form/event-form.component';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CalendarService } from "./_data/calendar.service";
import { EventsStoreService } from "./_data/events-store.service";

const routs: Routes = [
  {
    path: '',
    component: CalendarComponent,
    children: [
      {
        path: 'month',
        loadChildren: () => import('./month/month.module').then((m)=> m.MonthModule)
      },
      {
        path: 'week',
        loadChildren: () => import('./week/week.module').then((m)=> m.WeekModule)
      }
    ]
  },

]

@NgModule({
  declarations: [CalendarComponent, SetupHeaderComponent, EditEventModalComponent, AddEventModalComponent, EventFormComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule.forChild(routs),
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers: [CalendarService, EventsStoreService],
  exports: []
})
export class CalendarModule { }
