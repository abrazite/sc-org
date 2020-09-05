import { RSICitizenSchema } from './rsi-citizen.model';

export enum ServiceRecordKind {
  JoinedOrgRecord,
  OpAttendenceRecord,
  RankChangeRecord,
  CertificationRecord,
  ReserveRecord,
  LeaveRecord,
  ReitredRecord,
  NoteRecord,
  RsiCitizenRecord,
  MiscActiveDutyRecord
}

export interface ServiceRecordSchema {
  uid?: string;
  date?: Date;
  issuer?: string;

  kind?: string;
}

export interface JoinedOrgRecordSchema extends ServiceRecordSchema {
  organizationName?: string;
  recruitedBy?: string[];
}

export interface OpAttendenceRecordSchema extends ServiceRecordSchema {
  operationName?: string;
}

export interface RankChangeRecordSchema extends ServiceRecordSchema {
  rank?: string;
}

export interface CertificationRecordSchema extends ServiceRecordSchema {
  certification?: string;
}

export interface ReserveRecordSchema extends ServiceRecordSchema {
  isReserved?: boolean;
}

export interface LeaveRecordSchema extends ServiceRecordSchema {
  isOnLeave?: boolean;
}

export interface ReitredRecordSchema extends ServiceRecordSchema {
  isRetired?: boolean;
}

export interface NoteRecordSchema extends ServiceRecordSchema {
  note?: string;
}

export interface RSICitizenRecordSchema extends ServiceRecordSchema {
  rsiCitizen?: RSICitizenSchema;
}

export interface MiscActiveDutyRecordSchema extends ServiceRecordSchema {
}


export class ServiceRecord {
  public uid?: string;
  public date?: Date;
  public issuer?: string;

  public kind?: ServiceRecordKind;
  public properties: {
    organizationName?: string;
    recruitedBy?: string[];
    operationName?: string;
    rank?: string;
    certification?: string;
    isReserved?: boolean;
    isOnLeave?: boolean;
    isRetired?: boolean;
    note?: string;
    rsiCitizen?: RSICitizenSchema;
  } = {};

  static fromJson(json: ServiceRecordSchema): ServiceRecord {
    const serviceRecord = new ServiceRecord();
    serviceRecord.uid = json.uid;
    serviceRecord.date = new Date(json.date!);
    serviceRecord.issuer = json.issuer;
    serviceRecord.kind = (ServiceRecordKind as any)[json.kind!];
    serviceRecord.properties = {};

    if (serviceRecord.kind === ServiceRecordKind.JoinedOrgRecord) {
      serviceRecord.properties.organizationName = (json as JoinedOrgRecordSchema).organizationName;
      serviceRecord.properties.recruitedBy = (json as JoinedOrgRecordSchema).recruitedBy;
    }
    if (serviceRecord.kind === ServiceRecordKind.OpAttendenceRecord) {
      serviceRecord.properties.operationName = (json as OpAttendenceRecordSchema).operationName;
    }
    if (serviceRecord.kind === ServiceRecordKind.RankChangeRecord) {
      serviceRecord.properties.rank = (json as RankChangeRecordSchema).rank;
    }
    if (serviceRecord.kind === ServiceRecordKind.CertificationRecord) {
      serviceRecord.properties.certification = (json as CertificationRecordSchema).certification;
    }
    if (serviceRecord.kind === ServiceRecordKind.ReserveRecord) {
      serviceRecord.properties.isReserved = (json as ReserveRecordSchema).isReserved;
    }
    if (serviceRecord.kind === ServiceRecordKind.LeaveRecord) {
      serviceRecord.properties.isOnLeave = (json as LeaveRecordSchema).isOnLeave;
    }
    if (serviceRecord.kind === ServiceRecordKind.ReitredRecord) {
      serviceRecord.properties.isRetired = (json as ReitredRecordSchema).isRetired;
    }
    if (serviceRecord.kind === ServiceRecordKind.NoteRecord) {
      serviceRecord.properties.note = (json as NoteRecordSchema).note;
    }
    if (serviceRecord.kind === ServiceRecordKind.RsiCitizenRecord) {
      serviceRecord.properties.rsiCitizen = (json as RSICitizenRecordSchema).rsiCitizen!;
      if (serviceRecord.properties.rsiCitizen.enlisted) {
        serviceRecord.properties.rsiCitizen.enlisted = new Date(serviceRecord.properties.rsiCitizen!.enlisted);
      }
    }

    return serviceRecord;
  }

  toJson(): Object {
    return {
      uid: this.uid,
      date: this.date,
      issuer: this.issuer,

      kind: this.kind !== undefined ? ServiceRecordKind[this.kind] : undefined,

      organizationName: this.properties.organizationName,
      recruitedBy: this.properties.recruitedBy,
      operationName: this.properties.operationName,
      rank: this.properties.rank,
      certification: this.properties.certification,
      isReserved: this.properties.isReserved,
      isOnLeave: this.properties.isOnLeave,
      isRetired: this.properties.isRetired,
      note: this.properties.note,
      rsiCitizen: this.properties.rsiCitizen,
    };
  }
}
