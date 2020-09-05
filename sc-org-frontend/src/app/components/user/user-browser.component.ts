import { Component } from '@angular/core';

// @ts-ignore
import sleep from 'sleep-promise';

import { Personnel, PersonnelSummary } from '../../models/personnel.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-browser',
  templateUrl: './user-browser.component.html',
  styleUrls: ['./user-browser.component.css'],
})
export class UserBrowserComponent {
  searchTerm = '';
  error?: string;
  personnel?: Personnel;
  allPersonnel?: PersonnelSummary[];
  showOrgInList = false;

  constructor(
    private userService: UserService
  ) {}

  selectPersonnel(p: PersonnelSummary) {
    this.clearAll();
    this.searchTerm = `${p.username}#${p.discriminator}`;
    this.findPersonnel();
  }

  findPersonnel() {
    this.clearAll();
    this.userService.getAllPersonnel().toPromise().then(allPersonnel => {
      this.allPersonnel = this.sortAllPersonnel(allPersonnel);
      return this.allPersonnel.find(p =>
        p.personnelId === this.searchTerm ||
        p.username === this.searchTerm ||
        `${p.username}#${p.discriminator}` === this.searchTerm ||
        p.citizenName === this.searchTerm ||
        p.handleName === this.searchTerm ||
        p.citizenRecord === this.searchTerm);
    }).then((p?: PersonnelSummary) => {
      if (p) {
        return this.userService.getPersonnel(p.personnelId!).toPromise();
      } 
      return;
    }).then((p?: Personnel) => {
      if (p) {
        this.personnel = p;
        console.log(this.personnel);
      } else {
        this.error = 'could not find any matching personnel';
      }
    });
  }

  getAllPersonnel() {
    this.clearAll();
    this.userService.getAllPersonnel().subscribe(
      allPersonnel => {
        this.allPersonnel = this.sortAllPersonnel(allPersonnel);
      },
      e => {
        console.error(e);
        this.error = (e as Error).message;
      }
    );
  }

  clearAll() {
    delete this.error;
    delete this.personnel;
    delete this.allPersonnel;
    this.showOrgInList = false;
  }

  private sortAllPersonnel(allPersonnel: PersonnelSummary[]) {
    let sorted = allPersonnel.sort((a, b) => 
      (a.handleName ? a.handleName : a.username!).localeCompare(
        (b.handleName ? b.handleName : b.username!)));
    sorted = allPersonnel.sort((a, b) => 
      (a.rankAbbreviation ? a.rankAbbreviation : '').localeCompare(
       (b.rankAbbreviation ? b.rankAbbreviation : '')));
    sorted = allPersonnel.sort((a, b) => 
      (b.gradeAbbreviation ? b.gradeAbbreviation : '').localeCompare(
        (a.gradeAbbreviation ? a.gradeAbbreviation : '')));
    sorted = allPersonnel.sort((a, b) => 
      (a.branchAbbreviation ? a.branchAbbreviation : '').localeCompare(
        (b.branchAbbreviation ? b.branchAbbreviation : '')));
    return sorted;
  }
}
