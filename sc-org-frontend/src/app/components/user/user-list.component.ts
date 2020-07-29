import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() users?: User[];
  @Input() showOrg = false;
  @Output() onSelectUser: EventEmitter<User> = new EventEmitter();

  constructor() {
  }

  selectUser(user: User) {
    this.onSelectUser.emit(user);
  }
}
