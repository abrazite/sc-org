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

export interface MostRecentCertifications {
  personnelId: string | null;
  organizationId: string | null;
  latestDate: Date | null;
  certificationId: string | null;
  abbreviation: string | null;
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

export interface ActiveDuty {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  description: string | null;
}

export interface Certification {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  certificationId: string | null;
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

export interface JoinedOrganization {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  joinedOrganizationId: string | null;
  recruitedByPersonnelId: string | null;
}

export interface LeftOrganization {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  leftOrganizationId: string | null;
}

export interface Note {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  note: string | null;
}

export interface OperationAttendence {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  name: string | null;
}

export interface RankChange {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  rankId: string | null;
}

export interface Status {
  id: string | null;
  date: Date | null;
  organizationId: string | null;
  personnelId: string | null;
  issuerPersonnelId: string | null;
  status: string | null;
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

export interface RsiCitizenOrganization {
  id: string | null;
  date: Date | null;
  personnelId: string | null;
  organizationId: string | null;
  main: boolean | null;
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

export interface Branches {
  id: string | null;
  organizationId: string | null;
  abbreviation: string | null;
  branch: string | null;
}

export interface Grades {
  id: string | null;
  organizationId: string | null;
  abbreviation: string | null;
  grade: string | null;
}

export interface Ranks {
  id: string | null;
  organizationId: string | null;
  branchId: string | null;
  gradeId: string | null;
  abbreviation: string | null;
  name: string | null;
}

export interface Certifications {
  id: string | null;
  organizationId: string | null;
  branchId: string | null;
  abbreviation: string | null;
  name: string | null;
}