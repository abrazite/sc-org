export interface Personnel {
  activeDutyRecords?: any[];
  certificationRecords?: any[];
  discordRecords?: any[];
  joinedOrganizationRecords?: any[];
  noteRecords?: any[];
  operationAttendenceRecords?: any[];
  rankChangeRecords?: any[];
  rsiCitizenRecords?: any[];
  rsiCitizenOrganizationRecords?: any[];
  statusRecords?: any[];
}

export interface PersonnelRaw {
  activeDutyRecords?: any[];
  certificationRecords?: any[];
  discordRecords?: any[];
  joinedOrganizationRecords?: any[];
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
