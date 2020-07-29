import { BranchSchema } from './branch.model';

export interface CertificationSchema {
  uid: string;
  branch: BranchSchema;
  abbreviation: string;
  name: string;

  certificationPrereqs: string[];
  rankPrereqs: string[];
}