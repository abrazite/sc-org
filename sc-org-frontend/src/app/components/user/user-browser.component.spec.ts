import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBrowserComponent } from './user-browser.component';
import { UserDetailsComponent } from './user-details.component';
import { UserListComponent } from './user-list.component';

describe('UserComponent', () => {
  let component: UserBrowserComponent;
  let fixture: ComponentFixture<UserBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserBrowserComponent,
        UserDetailsComponent,
        UserListComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
