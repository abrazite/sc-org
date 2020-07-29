import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RSICitizenRecordSchema, ServiceRecordKind, ServiceRecord } from '../models/service-record.model';
import { RSICitizenService } from './rsi-citizen.service';
import { User, UserSchema } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rsiCitizenService: RSICitizenService;

  constructor(private httpService: HttpClient) {
    this.rsiCitizenService = new RSICitizenService(httpService);
  }

  public getUser(uid: string): Observable<User> {
    return this.httpService.get<UserSchema[]>('http://localhost:4200/assets/users.json')
      .pipe(map(data => {
        const userJson = data.find(json => json.uid === uid);
        if (!userJson) {
          throw new Error('Could not find user');
        }
        return User.fromJson(userJson);
      }))
      .pipe(observable => {
        const subject = new Subject<User>();
        observable.subscribe(user => {
          const observableUser = this.addRSICitizenRecord(user);
          if (observableUser) {
            observableUser.subscribe(subject);
          } else {
            subject.next(user);
          }
        });
        return subject.asObservable();
      });
  }

  public getUserByDiscord(discordHandle: string | null): Observable<User> {
    return this.httpService.get<UserSchema[]>('http://localhost:4200/assets/users.json')
      .pipe(map(data => {
        const userJson = data.find(json => json.discord === discordHandle);
        if (!userJson) {
          throw new Error('Could not find user');
        }
        return User.fromJson(userJson);
      }))
      .pipe(observable => {
        const subject = new Subject<User>();
        observable.subscribe(user => {
          const observableUser = this.addRSICitizenRecord(user);
          if (observableUser) {
            observableUser.subscribe(subject);
          } else {
            subject.next(user);
          }
        });
        return subject.asObservable();
      });
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpService.get<UserSchema[]>('http://localhost:4200/assets/users.json').pipe(
      map(data => data.map(json => User.fromJson(json)))
    );
  }

  private addRSICitizenRecord(user: User): Observable<User> | undefined {
    const subject = new Subject<User>();
    if (user.serviceRecords && !user.activeRSICitizenRecord && user.name) {
      this.rsiCitizenService.getCitizen(user.name).subscribe(record => {
        if (record) {
          user.serviceRecords.push(ServiceRecord.fromJson({
            uid: `SR${user.serviceRecords.length}-${user.name}`,
            date: new Date(),
            issuer: 'sc-org',
            kind: ServiceRecordKind[ServiceRecordKind.RSICitizenRecord],
            rsiCitizen: record
          } as RSICitizenRecordSchema));
        }
        subject.next(user);
      }, () => subject.next(user));
    }
    return;
  }
}
