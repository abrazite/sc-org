import { Component } from '@angular/core';

// @ts-ignore
import sleep from 'sleep-promise';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-browser',
  templateUrl: './user-browser.component.html',
  styleUrls: ['./user-browser.component.css'],
})
export class UserBrowserComponent {
  userId = '';
  error?: string;
  user?: User;
  users?: User[];
  showOrgInUserList = false;

  constructor(
    private userService: UserService
  ) {}

  selectUser(user: User) {
    this.clearAll();
    this.userId = user.uid!;
    this.getUser();
  }

  getUser() {
    this.clearAll();
    this.userService.getUser(this.userId).subscribe(
      user => {
        this.user = user;
        console.log(this.user);
      },
      e => {
        console.error(e);
        this.error = (e as Error).message;
      }
    );
  }

  getAllUsers() {
    this.clearAll();
    this.userService.getAllUsers().subscribe(
      users => this.users = users.sort((a, b) => a.uid!.localeCompare(b.uid!)),
      e => {
        console.error(e);
        this.error = (e as Error).message;
      }
    );
  }

  getNonIMCUsers() {
    this.clearAll();
    this.showOrgInUserList = true;
    this.userService.getAllUsers().subscribe(
      users => this.users = users.sort((a, b) => a.uid!.localeCompare(b.uid!))
        .filter(u => !u.activeOrganizationRecord || !u.activeOrganizationRecord.properties.rsiCitizen ||
          (u.activeOrganizationRecord.properties.rsiCitizen && u.activeOrganizationRecord.properties.rsiCitizen?.mainOrganization.spectrumIdentification !== 'THEIMC')),
      e => {
        console.error(e);
        this.error = (e as Error).message;
      }
    );
  }

  getOrgUsers(org: string) {
    this.clearAll();
    this.userService.getAllUsers().subscribe(
      users => this.users = users.sort((a, b) => a.uid!.localeCompare(b.uid!))
        .filter(u => u.activeOrganizationRecord &&
          u.activeOrganizationRecord.properties.rsiCitizen && u.activeOrganizationRecord.properties.rsiCitizen?.mainOrganization.spectrumIdentification === org),
      e => {
        console.error(e);
        this.error = (e as Error).message;
      }
    );
  }

  clearAll() {
    delete this.error;
    delete this.user;
    delete this.users;
    this.showOrgInUserList = false;
  }

  test() {
    this.userService.getAllUsers().subscribe(
      users => {
        users = users.sort((a, b) => a.uid!.localeCompare(b.uid!));

        // @ts-ignore
        window.updatedUsersDict = {};
        // @ts-ignore
        window.updatedUsers = [];
        users.forEach(async user => {
          this.userService.getUser(user.name!).subscribe(
            user => {
              // @ts-ignore
              window.updatedUsersDict[user.name] = user;
              // @ts-ignore
              window.updatedUsers.push(user);
            },
            // @ts-ignore
            e => {
              // @ts-ignore
              window.updatedUsersDict[user.name] = user;
              // @ts-ignore
              window.updatedUsers.push(user);
            }
          );
          await sleep(2000);
        });
      },
      e => {
        console.error(e);
        this.error = (e as Error).message;
      }
    );
  }
}
