import { BranchSchema } from './branch.model';
import { GradeSchema } from './grade.model';

export interface RankSchema {
  uid: string;
  branch: BranchSchema;
  grade: GradeSchema;
  abbreviation: string;
  name: string;

  spectrumRank: number;

  certificationPrereqs: string[];
  rankPrereqs: string[];
}