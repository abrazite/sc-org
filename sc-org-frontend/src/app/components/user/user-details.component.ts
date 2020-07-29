import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { ServiceRecord, ServiceRecordKind } from '../../models/service-record.model';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  ServiceRecordKind = ServiceRecordKind;
  @Input() user?: User;

  constructor() {
  }

  sortedRecordsByDate(): ServiceRecord[] {
    return this.user && this.user.serviceRecords ?
      this.user.serviceRecords.sort((a, b) => a.date!.getTime() - b.date!.getTime()) : [];
  }
}
