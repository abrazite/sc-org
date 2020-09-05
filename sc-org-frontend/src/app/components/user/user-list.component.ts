import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PersonnelSummary, Personnel } from '../../models/personnel.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() allPersonnel?: PersonnelSummary[];
  @Input() showOrg = false;
  @Output() onSelectPersonnel: EventEmitter<PersonnelSummary> = new EventEmitter();

  constructor() {
  }

  selectPersonnel(personnel: PersonnelSummary) {
    this.onSelectPersonnel.emit(personnel);
  }

  tag(personnel: PersonnelSummary): string {
    let tag = '';
    if (!personnel) {
      return tag;
    }

    if (personnel.branchAbbreviation) {
      tag += personnel?.branchAbbreviation + '-';
    }

    if (personnel.gradeAbbreviation) {
      tag += personnel?.gradeAbbreviation + '-';
    }

    if (personnel.rankAbbreviation) {
      tag += personnel?.rankAbbreviation;
    }
    return tag;
  }
}
