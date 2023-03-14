import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MonthComponent } from "./month.component";
import { ViewTypes } from "../_data/enums/view-types";


const routs: Routes = [
  {
    path: "",
    component: MonthComponent,
    data: {
      vieType: ViewTypes.month
    },
    children: [
      {
        path: ":year/:month/:day",
        component: MonthComponent,

      }
    ]
  }
]

@NgModule({
  declarations: [MonthComponent],
  imports: [
    RouterModule.forChild(routs),
    CommonModule
  ]
})
export class MonthModule { }
