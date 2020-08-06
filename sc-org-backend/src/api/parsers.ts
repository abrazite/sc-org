import { v4 as uuidv4 } from 'uuid';

export function fromBinaryUUID(buf: Buffer | null): string | null {
  if (buf === null) {
    return null;
  }

  return [
    buf.toString("hex", 4, 8),
    buf.toString("hex", 2, 4),
    buf.toString("hex", 0, 2),
    buf.toString("hex", 8, 10),
    buf.toString("hex", 10, 16),
  ].join("-");
}

export function toBinaryUUID(uuid: string | null): Buffer | null {
  if (uuid === null) {
    return null;
  }

  const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
  return Buffer.concat([
    buf.slice(6, 8),
    buf.slice(4, 6),
    buf.slice(0, 4),
    buf.slice(8, 16),
  ]);
}

export interface ActiveDuty {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  description: string | null;
}

export class ActiveDutyParser {
  static fromCreateRequest(json: any): ActiveDuty {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        description: json.description,
      }
      return record;
    }
    
    static toMySql(record: ActiveDuty): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        record.description,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): ActiveDuty {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        description: mysql.description,
      };
      return record;
    }
  }

export interface Certification {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  certificationId: string | null;
}

export class CertificationParser {
  static fromCreateRequest(json: any): Certification {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.certificationId === null) {
      throw new Error('missing required certificationId');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        certificationId: json.certificationId,
      }
      return record;
    }
    
    static toMySql(record: Certification): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        toBinaryUUID(record.certificationId),
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): Certification {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        certificationId: fromBinaryUUID(mysql.certification_id),
      };
      return record;
    }
  }

export interface Discord {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  discordId: string | null;
  username: string | null;
  discriminator: number | null;
}

export class DiscordParser {
  static fromCreateRequest(json: any): Discord {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.discordId === null) {
      throw new Error('missing required discordId');
    }
    if (json.username === null) {
      throw new Error('missing required username');
    }
    if (json.discriminator === null) {
      throw new Error('missing required discriminator');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        discordId: json.discordId,
        username: json.username,
        discriminator: json.discriminator,
      }
      return record;
    }
    
    static toMySql(record: Discord): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        record.discordId,
        record.username,
        record.discriminator,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): Discord {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        discordId: mysql.discordId,
        username: mysql.username,
        discriminator: mysql.discriminator,
      };
      return record;
    }
  }

export interface JoinedOrganization {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  organizationId: string | null;
  recruitedByPersonnelId: string | null;
}

export class JoinedOrganizationParser {
  static fromCreateRequest(json: any): JoinedOrganization {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        organizationId: json.organizationId,
        recruitedByPersonnelId: json.recruitedByPersonnelId,
      }
      return record;
    }
    
    static toMySql(record: JoinedOrganization): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        toBinaryUUID(record.organizationId),
        toBinaryUUID(record.recruitedByPersonnelId),
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): JoinedOrganization {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        organizationId: fromBinaryUUID(mysql.organization_id),
        recruitedByPersonnelId: fromBinaryUUID(mysql.recruited_by_personnel_id),
      };
      return record;
    }
  }

export interface Note {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  note: string | null;
}

export class NoteParser {
  static fromCreateRequest(json: any): Note {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.note === null) {
      throw new Error('missing required note');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        note: json.note,
      }
      return record;
    }
    
    static toMySql(record: Note): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        record.note,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): Note {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        note: mysql.note,
      };
      return record;
    }
  }

export interface OperationAttendence {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  name: string | null;
}

export class OperationAttendenceParser {
  static fromCreateRequest(json: any): OperationAttendence {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        name: json.name,
      }
      return record;
    }
    
    static toMySql(record: OperationAttendence): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        record.name,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): OperationAttendence {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        name: mysql.name,
      };
      return record;
    }
  }

export interface RankChange {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  rankId: string | null;
}

export class RankChangeParser {
  static fromCreateRequest(json: any): RankChange {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.rankId === null) {
      throw new Error('missing required rankId');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        rankId: json.rankId,
      }
      return record;
    }
    
    static toMySql(record: RankChange): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        toBinaryUUID(record.rankId),
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): RankChange {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        rankId: fromBinaryUUID(mysql.rank_id),
      };
      return record;
    }
  }

export interface RsiCitizen {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  citizenRecord: number | null;
  citizenName: string | null;
  handleName: string | null;
  enlistedRank: string | null;
  enlisted: Date | null;
  location: string | null;
  fluency: string | null;
  website: string | null;
  biography: string | null;
}

export class RsiCitizenParser {
  static fromCreateRequest(json: any): RsiCitizen {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.handleName === null) {
      throw new Error('missing required handleName');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        citizenRecord: json.citizenRecord,
        citizenName: json.citizenName,
        handleName: json.handleName,
        enlistedRank: json.enlistedRank,
        enlisted: json.enlisted ? new Date(Date.parse(json.enlisted)) : null,
        location: json.location,
        fluency: json.fluency,
        website: json.website,
        biography: json.biography,
      }
      return record;
    }
    
    static toMySql(record: RsiCitizen): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        record.citizenRecord,
        record.citizenName,
        record.handleName,
        record.enlistedRank,
        record.enlisted,
        record.location,
        record.fluency,
        record.website,
        record.biography,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): RsiCitizen {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        citizenRecord: mysql.citizenRecord,
        citizenName: mysql.citizenName,
        handleName: mysql.handleName,
        enlistedRank: mysql.enlistedRank,
        enlisted: new Date(Date.parse(mysql.enlisted)),
        location: mysql.location,
        fluency: mysql.fluency,
        website: mysql.website,
        biography: mysql.biography,
      };
      return record;
    }
  }

export interface RsiCitizenOrganization {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  organizationId: string | null;
  main: string | null;
  rank: boolean | null;
}

export class RsiCitizenOrganizationParser {
  static fromCreateRequest(json: any): RsiCitizenOrganization {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.main === null) {
      throw new Error('missing required main');
    }
    if (json.rank === null) {
      throw new Error('missing required rank');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        organizationId: json.organizationId,
        main: json.main,
        rank: json.rank,
      }
      return record;
    }
    
    static toMySql(record: RsiCitizenOrganization): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.organizationId),
        toBinaryUUID(record.main),
        record.rank,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): RsiCitizenOrganization {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        organizationId: fromBinaryUUID(mysql.organization_id),
        main: fromBinaryUUID(mysql.main),
        rank: mysql.rank,
      };
      return record;
    }
  }

export interface RsiOrganization {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  name: string | null;
  sid: string | null;
  memberCount: number | null;
  archetype: string | null;
  primaryActivity: string | null;
  secondaryActivity: string | null;
  commitment: string | null;
  primaryLanguage: string | null;
  recruiting: boolean | null;
  rolePlay: boolean | null;
  exclusive: boolean | null;
}

export class RsiOrganizationParser {
  static fromCreateRequest(json: any): RsiOrganization {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.sid === null) {
      throw new Error('missing required sid');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        organizationId: json.organizationId,
        name: json.name,
        sid: json.sid,
        memberCount: json.memberCount,
        archetype: json.archetype,
        primaryActivity: json.primaryActivity,
        secondaryActivity: json.secondaryActivity,
        commitment: json.commitment,
        primaryLanguage: json.primaryLanguage,
        recruiting: json.recruiting,
        rolePlay: json.rolePlay,
        exclusive: json.exclusive,
      }
      return record;
    }
    
    static toMySql(record: RsiOrganization): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.organizationId),
        record.name,
        record.sid,
        record.memberCount,
        record.archetype,
        record.primaryActivity,
        record.secondaryActivity,
        record.commitment,
        record.primaryLanguage,
        record.recruiting,
        record.rolePlay,
        record.exclusive,
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): RsiOrganization {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        organizationId: fromBinaryUUID(mysql.organization_id),
        name: mysql.name,
        sid: mysql.sid,
        memberCount: mysql.memberCount,
        archetype: mysql.archetype,
        primaryActivity: mysql.primaryActivity,
        secondaryActivity: mysql.secondaryActivity,
        commitment: mysql.commitment,
        primaryLanguage: mysql.primaryLanguage,
        recruiting: mysql.recruiting,
        rolePlay: mysql.rolePlay,
        exclusive: mysql.exclusive,
      };
      return record;
    }
  }

export interface Status {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  statusId: string | null;
}

export class StatusParser {
  static fromCreateRequest(json: any): Status {
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
        personnelId: json.personnelId,
        issuerPersonnelId: json.issuerPersonnelId,
        statusId: json.statusId,
      }
      return record;
    }
    
    static toMySql(record: Status): any {
      const mysql = [
        toBinaryUUID(record.id),
        record.date,
        toBinaryUUID(record.personnelId),
        toBinaryUUID(record.issuerPersonnelId),
        toBinaryUUID(record.statusId),
      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): Status {
      const record = {
        id: fromBinaryUUID(mysql.id),
        date: new Date(Date.parse(mysql.date)),
        personnelId: fromBinaryUUID(mysql.personnel_id),
        issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
        statusId: fromBinaryUUID(mysql.status_id),
      };
      return record;
    }
  }
