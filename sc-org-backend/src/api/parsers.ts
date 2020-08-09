// Auto generated
import { v4 as uuidv4 } from 'uuid';

export function fromBinaryUUID(buf: Buffer | null): string | null {
  if (buf === null || buf === undefined) {
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
  if (uuid === null || uuid === undefined) {
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
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  description: string | null;
}

export class ActiveDutyParser {
  static fromCreateRequest(json: any): ActiveDuty {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
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
      toBinaryUUID(record.organizationId),
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
      organizationId: fromBinaryUUID(mysql.organization_id),
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
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  certificationId: string | null;
}

export class CertificationParser {
  static fromCreateRequest(json: any): Certification {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.certificationId === null) {
      throw new Error('missing required certificationId');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
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
      toBinaryUUID(record.organizationId),
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
      organizationId: fromBinaryUUID(mysql.organization_id),
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
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  username: string | null;
  discriminator: number | null;
}

export class DiscordParser {
  static fromCreateRequest(json: any): Discord {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.username === null) {
      throw new Error('missing required username');
    }
    if (json.discriminator === null) {
      throw new Error('missing required discriminator');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
      personnelId: json.personnelId,
      issuerPersonnelId: json.issuerPersonnelId,
      username: json.username,
      discriminator: json.discriminator,
    }
    return record;
  }
    
  static toMySql(record: Discord): any {
    const mysql = [
      toBinaryUUID(record.id),
      record.date,
      toBinaryUUID(record.organizationId),
      toBinaryUUID(record.personnelId),
      toBinaryUUID(record.issuerPersonnelId),
      record.username,
      record.discriminator,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): Discord {
    const record = {
      id: fromBinaryUUID(mysql.id),
      date: new Date(Date.parse(mysql.date)),
      organizationId: fromBinaryUUID(mysql.organization_id),
      personnelId: fromBinaryUUID(mysql.personnel_id),
      issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
      username: mysql.username,
      discriminator: mysql.discriminator,
    };
    return record;
  }
}

export interface JoinedOrganization {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  joinedOrganizationId: string | null;
  recruitedByPersonnelId: string | null;
}

export class JoinedOrganizationParser {
  static fromCreateRequest(json: any): JoinedOrganization {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.joinedOrganizationId === null) {
      throw new Error('missing required joinedOrganizationId');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
      personnelId: json.personnelId,
      issuerPersonnelId: json.issuerPersonnelId,
      joinedOrganizationId: json.joinedOrganizationId,
      recruitedByPersonnelId: json.recruitedByPersonnelId,
    }
    return record;
  }
    
  static toMySql(record: JoinedOrganization): any {
    const mysql = [
      toBinaryUUID(record.id),
      record.date,
      toBinaryUUID(record.organizationId),
      toBinaryUUID(record.personnelId),
      toBinaryUUID(record.issuerPersonnelId),
      toBinaryUUID(record.joinedOrganizationId),
      toBinaryUUID(record.recruitedByPersonnelId),
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): JoinedOrganization {
    const record = {
      id: fromBinaryUUID(mysql.id),
      date: new Date(Date.parse(mysql.date)),
      organizationId: fromBinaryUUID(mysql.organization_id),
      personnelId: fromBinaryUUID(mysql.personnel_id),
      issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
      joinedOrganizationId: fromBinaryUUID(mysql.joined_organization_id),
      recruitedByPersonnelId: fromBinaryUUID(mysql.recruited_by_personnel_id),
    };
    return record;
  }
}

export interface LeftOrganization {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  leftOrganizationId: string | null;
}

export class LeftOrganizationParser {
  static fromCreateRequest(json: any): LeftOrganization {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.leftOrganizationId === null) {
      throw new Error('missing required leftOrganizationId');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
      personnelId: json.personnelId,
      issuerPersonnelId: json.issuerPersonnelId,
      leftOrganizationId: json.leftOrganizationId,
    }
    return record;
  }
    
  static toMySql(record: LeftOrganization): any {
    const mysql = [
      toBinaryUUID(record.id),
      record.date,
      toBinaryUUID(record.organizationId),
      toBinaryUUID(record.personnelId),
      toBinaryUUID(record.issuerPersonnelId),
      toBinaryUUID(record.leftOrganizationId),
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): LeftOrganization {
    const record = {
      id: fromBinaryUUID(mysql.id),
      date: new Date(Date.parse(mysql.date)),
      organizationId: fromBinaryUUID(mysql.organization_id),
      personnelId: fromBinaryUUID(mysql.personnel_id),
      issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
      leftOrganizationId: fromBinaryUUID(mysql.left_organization_id),
    };
    return record;
  }
}

export interface Note {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  note: string | null;
}

export class NoteParser {
  static fromCreateRequest(json: any): Note {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.note === null) {
      throw new Error('missing required note');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
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
      toBinaryUUID(record.organizationId),
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
      organizationId: fromBinaryUUID(mysql.organization_id),
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
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  name: string | null;
}

export class OperationAttendenceParser {
  static fromCreateRequest(json: any): OperationAttendence {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
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
      toBinaryUUID(record.organizationId),
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
      organizationId: fromBinaryUUID(mysql.organization_id),
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
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  rankId: string | null;
}

export class RankChangeParser {
  static fromCreateRequest(json: any): RankChange {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.rankId === null) {
      throw new Error('missing required rankId');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
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
      toBinaryUUID(record.organizationId),
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
      organizationId: fromBinaryUUID(mysql.organization_id),
      personnelId: fromBinaryUUID(mysql.personnel_id),
      issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
      rankId: fromBinaryUUID(mysql.rank_id),
    };
    return record;
  }
}

export interface Status {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  status: string | null;
}

export class StatusParser {
  static fromCreateRequest(json: any): Status {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.personnelId === null) {
      throw new Error('missing required personnelId');
    }
    if (json.issuerPersonnelId === null) {
      throw new Error('missing required issuerPersonnelId');
    }
    if (json.status === null) {
      throw new Error('missing required status');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
      personnelId: json.personnelId,
      issuerPersonnelId: json.issuerPersonnelId,
      status: json.status,
    }
    return record;
  }
    
  static toMySql(record: Status): any {
    const mysql = [
      toBinaryUUID(record.id),
      record.date,
      toBinaryUUID(record.organizationId),
      toBinaryUUID(record.personnelId),
      toBinaryUUID(record.issuerPersonnelId),
      record.status,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): Status {
    const record = {
      id: fromBinaryUUID(mysql.id),
      date: new Date(Date.parse(mysql.date)),
      organizationId: fromBinaryUUID(mysql.organization_id),
      personnelId: fromBinaryUUID(mysql.personnel_id),
      issuerPersonnelId: fromBinaryUUID(mysql.issuer_personnel_id),
      status: mysql.status,
    };
    return record;
  }
}

export interface RsiCitizen {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  citizenRecord: undefined | null;
  citizenName: string | null;
  handleName: string | null;
  enlistedRank: string | null;
  enlistedDate: Date | null;
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
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      personnelId: json.personnelId,
      citizenRecord: json.citizenRecord,
      citizenName: json.citizenName,
      handleName: json.handleName,
      enlistedRank: json.enlistedRank,
      enlistedDate: json.enlistedDate ? new Date(Date.parse(json.enlistedDate)) : null,
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
      record.enlistedDate,
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
      enlistedDate: new Date(Date.parse(mysql.enlisted_date)),
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
  main: boolean | null;
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
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      personnelId: json.personnelId,
      organizationId: json.organizationId,
      main: json.main,
    }
    return record;
  }
    
  static toMySql(record: RsiCitizenOrganization): any {
    const mysql = [
      toBinaryUUID(record.id),
      record.date,
      toBinaryUUID(record.personnelId),
      toBinaryUUID(record.organizationId),
      record.main,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): RsiCitizenOrganization {
    const record = {
      id: fromBinaryUUID(mysql.id),
      date: new Date(Date.parse(mysql.date)),
      personnelId: fromBinaryUUID(mysql.personnel_id),
      organizationId: fromBinaryUUID(mysql.organization_id),
      main: mysql.main,
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
  memberCount: undefined | null;
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
    const record = {      id: json.id ? json.id : uuidv4(),      date: json.date ? new Date(Date.parse(json.date)) : new Date(),      organizationId: json.organizationId,
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

export interface Branches {
  id: string | null;
  organizationId: string | null;
  abbreviation: string | null;
  branch: string | null;
}

export class BranchesParser {
  static fromCreateRequest(json: any): Branches {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.abbreviation === null) {
      throw new Error('missing required abbreviation');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      organizationId: json.organizationId,
      abbreviation: json.abbreviation,
      branch: json.branch,
    }
    return record;
  }
    
  static toMySql(record: Branches): any {
    const mysql = [
      toBinaryUUID(record.id),
      toBinaryUUID(record.organizationId),
      record.abbreviation,
      record.branch,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): Branches {
    const record = {
      id: fromBinaryUUID(mysql.id),
      organizationId: fromBinaryUUID(mysql.organization_id),
      abbreviation: mysql.abbreviation,
      branch: mysql.branch,
    };
    return record;
  }
}

export interface Grades {
  id: string | null;
  organizationId: string | null;
  abbreviation: string | null;
  grade: string | null;
}

export class GradesParser {
  static fromCreateRequest(json: any): Grades {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.abbreviation === null) {
      throw new Error('missing required abbreviation');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      organizationId: json.organizationId,
      abbreviation: json.abbreviation,
      grade: json.grade,
    }
    return record;
  }
    
  static toMySql(record: Grades): any {
    const mysql = [
      toBinaryUUID(record.id),
      toBinaryUUID(record.organizationId),
      record.abbreviation,
      record.grade,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): Grades {
    const record = {
      id: fromBinaryUUID(mysql.id),
      organizationId: fromBinaryUUID(mysql.organization_id),
      abbreviation: mysql.abbreviation,
      grade: mysql.grade,
    };
    return record;
  }
}

export interface Ranks {
  id: string | null;
  organizationId: string | null;
  branchId: string | null;
  gradeId: string | null;
  abbreviation: string | null;
  name: string | null;
}

export class RanksParser {
  static fromCreateRequest(json: any): Ranks {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.abbreviation === null) {
      throw new Error('missing required abbreviation');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      organizationId: json.organizationId,
      branchId: json.branchId,
      gradeId: json.gradeId,
      abbreviation: json.abbreviation,
      name: json.name,
    }
    return record;
  }
    
  static toMySql(record: Ranks): any {
    const mysql = [
      toBinaryUUID(record.id),
      toBinaryUUID(record.organizationId),
      toBinaryUUID(record.branchId),
      toBinaryUUID(record.gradeId),
      record.abbreviation,
      record.name,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): Ranks {
    const record = {
      id: fromBinaryUUID(mysql.id),
      organizationId: fromBinaryUUID(mysql.organization_id),
      branchId: fromBinaryUUID(mysql.branch_id),
      gradeId: fromBinaryUUID(mysql.grade_id),
      abbreviation: mysql.abbreviation,
      name: mysql.name,
    };
    return record;
  }
}

export interface Certifications {
  id: string | null;
  organizationId: string | null;
  branchId: string | null;
  abbreviation: string | null;
  name: string | null;
}

export class CertificationsParser {
  static fromCreateRequest(json: any): Certifications {
    if (json.organizationId === null) {
      throw new Error('missing required organizationId');
    }
    if (json.abbreviation === null) {
      throw new Error('missing required abbreviation');
    }
    const record = {      id: json.id ? json.id : uuidv4(),      organizationId: json.organizationId,
      branchId: json.branchId,
      abbreviation: json.abbreviation,
      name: json.name,
    }
    return record;
  }
    
  static toMySql(record: Certifications): any {
    const mysql = [
      toBinaryUUID(record.id),
      toBinaryUUID(record.organizationId),
      toBinaryUUID(record.branchId),
      record.abbreviation,
      record.name,
    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): Certifications {
    const record = {
      id: fromBinaryUUID(mysql.id),
      organizationId: fromBinaryUUID(mysql.organization_id),
      branchId: fromBinaryUUID(mysql.branch_id),
      abbreviation: mysql.abbreviation,
      name: mysql.name,
    };
    return record;
  }
}
