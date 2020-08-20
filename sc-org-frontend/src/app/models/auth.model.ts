export interface Auth {
  accessToken: string;
}

export interface AuthDetails {
  citizenRecord?: number;
  citizenName: string;
  handleName: string;
  organizationId: string;
  organizationIds: string[];
  personnelId: string;
  getSecurityLevel: number;
  postSecurityLevel: number;
  putSecurityLevel: number;
  delSecurityLevel: number;
  proxySecurityLevel: number;
}