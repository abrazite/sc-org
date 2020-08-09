import * as parsers from './parsers';

export interface Membership {
  personnelId: string | null;
  organizationId: string | null;
  username: string | null;
  discriminator: string | null;
  citizenRecord: string | null;
  citizenName: string | null;
  handleName: string | null;
  joinedDate: Date;
}

export class MembershipParser {
  static fromMySql(mysql: any): Membership {
    const record = {
      personnelId: parsers.fromBinaryUUID(mysql.personnel_id),
      organizationId: parsers.fromBinaryUUID(mysql.organization_id),
      username: mysql.username,
      discriminator: mysql.discriminator,
      citizenRecord: mysql.citizen_record,
      citizenName: mysql.citizen_name,
      handleName: mysql.handle_name,
      joinedDate: new Date(Date.parse(mysql.joined_date)),
    };
    return record;
  }
}

export interface Personnel {
  personnelId: string;
  organizationId: string;

  personnelSummary?: PersonnelSummary;

  activeDutyRecords?: any[];
  certificationRecords?: any[];
  discordRecords?: any[];
  joinedOrganizationRecords?: any[];
  leftOrganizationRecords?: any[];
  noteRecords?: any[];
  operationAttendenceRecords?: any[];
  rankChangeRecords?: any[];
  rsiCitizenRecords?: any[];
  rsiCitizenOrganizationRecords?: any[];
  statusRecords?: any[];
}

export interface PersonnelRaw {
  personnelId: string;
  organizationId: string;

  personnelSummary?: PersonnelSummary;
  
  activeDutyRecords?: any[];
  certificationRecords?: any[];
  discordRecords?: any[];
  joinedOrganizationRecords?: any[];
  leftOrganizationRecords?: any[];
  noteRecords?: any[];
  operationAttendenceRecords?: any[];
  rankChangeRecords?: any[];
  rsiCitizenRecords?: any[];
  rsiCitizenOrganizationRecords?: any[];
  statusRecords?: any[];
}

export interface OrganizationInfoRaw {
  organizationId: string;

  branches?: any[];
  grades?: any[];
  ranks?: any[];

  certifications?: any[];
};

export interface PersonnelSummary {
  personnelId: string | null;
  organizationId: string | null;
  username: string | null;
  discriminator: string | null;
  citizenRecord: string | null;
  citizenName: string | null;
  handleName: string | null;
  rankDate: Date | null;
  rankId: string | null;
  gradeId: string | null;
  branchId: string | null;
  branchAbbreviation: string | null;
  gradeAbbreviation: string | null;
  rankAbbreviation: string | null;
  lastDate: Date | null;

  certifications: MostRecentCertifications[] | null;
}

export class PersonnelSummaryParser {
  static fromMySql(mysql: any): PersonnelSummary {
    const record = {
      personnelId: parsers.fromBinaryUUID(mysql.personnel_id),
      organizationId: parsers.fromBinaryUUID(mysql.organization_id),
      username: mysql.username,
      discriminator: mysql.discriminator,
      citizenRecord: mysql.citizen_record,
      citizenName: mysql.citizen_name,
      handleName: mysql.handle_name,
      rankDate: new Date(Date.parse(mysql.rank_date)),
      rankId: parsers.fromBinaryUUID(mysql.rank_id),
      gradeId: parsers.fromBinaryUUID(mysql.grade_id),
      branchId: parsers.fromBinaryUUID(mysql.branch_id),
      branchAbbreviation: mysql.branch_abbreviation,
      gradeAbbreviation: mysql.grade_abbreviation,
      rankAbbreviation: mysql.rank_abbreviation,
      lastDate: new Date(Date.parse(mysql.last_date)),

      certifications: null
    };
    return record;
  }
}

export interface PersonnelSummaryWithCertifications {
  personnelId: string | null;
  organizationId: string | null;
  username: string | null;
  discriminator: string | null;
  citizenRecord: string | null;
  citizenName: string | null;
  handleName: string | null;
  rankDate: Date | null;
  rankId: string | null;
  gradeId: string | null;
  branchId: string | null;
  branchAbbreviation: string | null;
  gradeAbbreviation: string | null;
  rankAbbreviation: string | null;
  lastDate: Date | null;
  certificationId: string | null;
  certificationDate: Date | null;
  certificationAbbreviation: string | null;
}

export class PersonnelSummaryWithCertificationsParser {
  static fromMySql(mysql: any): PersonnelSummaryWithCertifications {
    const record = {
      personnelId: parsers.fromBinaryUUID(mysql.personnel_id),
      organizationId: parsers.fromBinaryUUID(mysql.organization_id),
      username: mysql.username,
      discriminator: mysql.discriminator,
      citizenRecord: mysql.citizen_record,
      citizenName: mysql.citizen_name,
      handleName: mysql.handle_name,
      rankDate: new Date(Date.parse(mysql.rank_date)),
      rankId: parsers.fromBinaryUUID(mysql.rank_id),
      gradeId: parsers.fromBinaryUUID(mysql.grade_id),
      branchId: parsers.fromBinaryUUID(mysql.branch_id),
      branchAbbreviation: mysql.branch_abbreviation,
      gradeAbbreviation: mysql.grade_abbreviation,
      rankAbbreviation: mysql.rank_abbreviation,
      lastDate: new Date(Date.parse(mysql.last_date)),
      certificationId: parsers.fromBinaryUUID(mysql.certification_id),
      certificationDate: new Date(Date.parse(mysql.certification_date)),
      certificationAbbreviation: mysql.certification_abbreviation,
    };
    return record;
  }
}


export interface MostRecentCertifications {
  personnelId: string | null;
  organizationId: string | null;
  latestDate: Date | null;
  certificationId: string | null;
  abbreviation: string | null;
}

export class MostRecentCertificationsParser {
  static fromMySql(mysql: any): MostRecentCertifications {
    const record = {
      personnelId: parsers.fromBinaryUUID(mysql.personnel_id),
      organizationId: parsers.fromBinaryUUID(mysql.organization_id),
      latestDate: new Date(Date.parse(mysql.latest_date)),
      certificationId: parsers.fromBinaryUUID(mysql.certification_id),
      abbreviation: mysql.abbreviation,
    };
    return record;
  }
}