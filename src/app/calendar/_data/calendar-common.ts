import { AddEventModalComponent } from "../add-event-modal/add-event-modal.component";
import { CONSTANTS } from "../../core/data/constants";
import { IEvent } from "./interfaces/event";
import { EditEventModalComponent } from "../edit-event-modal/edit-event-modal.component";
import { MatDialog } from "@angular/material/dialog";

export class CalendarCommon {
  constructor(protected matDialog: MatDialog) {
  }

  openCreateEventModal(clickEvent: Event, value: any): void {
    clickEvent.stopPropagation();

    this.matDialog.open(AddEventModalComponent, {
      ...CONSTANTS.rightSidebarSettingsMedium,
      data: {
        events: value.events,
        fullDate: value.fullDate
      }
    });
  }

  openEditEventModal(clickEvent: Event, event: IEvent): void {
    clickEvent.stopPropagation();

    this.matDialog.open(EditEventModalComponent, {
      ...CONSTANTS.rightSidebarSettingsMedium,
      data: {
        event,
      }
    });
  }
}
