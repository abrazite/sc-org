import { Component, Input } from '@angular/core';
import { Personnel } from '../../models/personnel.model';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  @Input() personnel?: Personnel;

  constructor() {
  }

  formatDate(d: string): string {
    return (new Date(Date.parse(d))).toLocaleDateString();
  }

  get tag(): string {
    let tag = '';
    if (!this.personnel || !this.personnel.personnelSummary) {
      return tag;
    }

    if (this.personnel.personnelSummary.branchAbbreviation) {
      tag += this.personnel.personnelSummary?.branchAbbreviation + '-';
    }

    if (this.personnel.personnelSummary.gradeAbbreviation) {
      tag += this.personnel.personnelSummary?.gradeAbbreviation + '-';
    }

    if (this.personnel.personnelSummary.rankAbbreviation) {
      tag += this.personnel.personnelSummary?.rankAbbreviation;
    }
    return tag;
  }
}
