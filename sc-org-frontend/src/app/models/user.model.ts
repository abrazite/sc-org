import { ServiceRecordSchema, ServiceRecord, ServiceRecordKind } from './service-record.model';

export interface UserSchema {
  uid?: string;
  name?: string;
  discord?: string;
  email?: string;

  serviceRecords: ServiceRecordSchema[];
}

export class User {
  public uid?: string;
  public name?: string;
  public discord?: string;
  public email?: string;

  public dateJoinedOrg?: Date;
  public recruitedBy?: string[];

  public serviceRecords: ServiceRecord[] = [];

  static fromJson(json: UserSchema): User {
    const user = new User();
    user.uid = json.uid;
    user.name = json.name;
    user.discord = json.discord;
    user.email = json.email;
    user.serviceRecords = json.serviceRecords.map(json => ServiceRecord.fromJson(json));

    return user;
  }

  toJson(): UserSchema {
    return {
      uid: this.uid,
      name: this.name,
      discord: this.discord,
      email: this.email,
      serviceRecords: this.serviceRecords.map(r => r.toJson())
    };
  }

  get activeOrganizationRecord(): ServiceRecord | undefined {
    if (this.serviceRecords) {
      const recentRecordsFirst = this.serviceRecords.sort((a, b) => b.date!.getTime() - a.date!.getTime());
      return recentRecordsFirst.find(r =>
        r.kind! === ServiceRecordKind.JoinedOrgRecord ||
        (r.kind! === ServiceRecordKind.RSICitizenRecord && r.properties.rsiCitizen!.mainOrganization.spectrumIdentification));
    }
    return;
  }

  get activeRankRecord(): ServiceRecord | undefined {
    if (this.serviceRecords) {
      const recentRecordsFirst = this.serviceRecords.sort((a, b) => b.date!.getTime() - a.date!.getTime());
      return recentRecordsFirst.find(r => r.kind! === ServiceRecordKind.RankChangeRecord);
    }
    return;
  }

  get activeRSICitizenRecord(): ServiceRecord | undefined {
    if (this.serviceRecords) {
      const recentRecordsFirst = this.serviceRecords.sort((a, b) => b.date!.getTime() - a.date!.getTime());
      return recentRecordsFirst.find(r => r.kind! === ServiceRecordKind.RSICitizenRecord);
    }
    return;
  }
}
