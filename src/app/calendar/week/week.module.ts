import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { WeekComponent } from "./week.component";
import { ViewTypes } from "../_data/enums/view-types";

const routs: Routes = [
  {
    path: "",
    component: WeekComponent,
    data: {
      vieType: ViewTypes.week
    },
    children: [
      {
        path: ":year/:month/:day",
        component: WeekComponent,
      }
    ]
  }
]
@NgModule({
  declarations: [WeekComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routs),
    ]
})
export class WeekModule { }
