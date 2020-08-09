import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as core from "express-serve-static-core";
import mysql from 'mysql';

import { environment } from '../environments/environment';

import { DatabaseService } from '../services/database.service';
import * as parsers from './parsers';
import * as viewParsers from './parsers-views';

const API_SERVER = `${environment.apiHost}${environment.apiPath}`;

export class OrgManagerViewsAPI {
  constructor(private databaseService: DatabaseService) {}

  createRouter(): core.Router {
    const router = express.Router();
    router.use(cors());
    router.use(bodyParser.json());

    router.get('/personnel', (req, res) => {
      try {
        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }
        
        let queryStr = '';
        Object.keys(req.query).forEach(key => {
          queryStr += `${key}=${req.query[key]}&`;
        });
  
        let personnel: viewParsers.PersonnelSummary[];
        const certifications: { [personnelId: string]: viewParsers.MostRecentCertifications[] } = {};

        fetch(`${API_SERVER}/personnel-summary?${queryStr}`)
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((json: Object[]) => {
            personnel = json as viewParsers.PersonnelSummary[];
          })
          // todo: add proper paging
          .then(() => fetch(`${API_SERVER}/most-recent-certifications?organizationId=${organizationId}&limit=10000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((json: Object[]) => {
            json.forEach(r => {
              const certification = r as viewParsers.MostRecentCertifications;
              if (!certifications.hasOwnProperty(certification.personnelId!)) {
                certifications[certification.personnelId!] = [];
              }
              certifications[certification.personnelId!].push(certification);
            });
          })
          .then(() => {
            personnel.forEach(p => {
              if (certifications[p.personnelId!]) {
                p.certifications = certifications[p.personnelId!];
              }
            });
          })
          .then(() => {
            res.status(200).json(personnel);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          });
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/personnel-summary', (req, res) => {
      try {
        const filterStrs: string[] = [];
        const filterParams: any[] = [];
        Object.keys(req.query).forEach(key => {
          if (key === 'limit' || key ==='page') {
            return;
          }

          const keySplit = key.split(/(?=[A-Z])/).map(s => s.toLowerCase());
          const sqlField = keySplit.join('_');
          filterStrs.push(sqlField + '=?');
          if (keySplit.includes('id')) {
            filterParams.push(parsers.toBinaryUUID(req.query[key] as string));
          } else if (keySplit.includes('date')) {
            filterParams.push(new Date(Date.parse(req.query[key] as string)));
          } else {
            filterParams.push(req.query[key]);
          }
        });
        const filterStr = filterStrs.length > 0 ? 'WHERE ' + filterStrs.join(' AND ') : '';

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const page = req.query.page ? parseInt(req.query.page as string) : 0;

        this.databaseService.connection.query(`SELECT
            personnel_id,
            organization_id,
            username,
            discriminator,
            citizen_record,
            citizen_name,
            handle_name,
            rank_date,
            rank_id,
            grade_id,
            branch_id,
            branch_abbreviation,
            grade_abbreviation,
            rank_abbreviation,
            last_date
          FROM personnel_summary ${filterStr} LIMIT ? OFFSET ?;`,
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => viewParsers.PersonnelSummaryParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/most-recent-certifications', (req, res, next) => {
      try {
        const filterStrs: string[] = [];
        const filterParams: any[] = [];
        Object.keys(req.query).forEach(key => {
          if (key === 'limit' || key ==='page') {
            return;
          }

          const keySplit = key.split(/(?=[A-Z])/).map(s => s.toLowerCase());
          const sqlField = keySplit.join('_');
          filterStrs.push(sqlField + '=?');
          if (keySplit.includes('id')) {
            filterParams.push(parsers.toBinaryUUID(req.query[key] as string));
          } else if (keySplit.includes('date')) {
            filterParams.push(new Date(Date.parse(req.query[key] as string)));
          } else {
            filterParams.push(req.query[key]);
          }
        });
        const filterStr = filterStrs.length > 0 ? 'WHERE ' + filterStrs.join(' AND ') : '';

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const page = req.query.page ? parseInt(req.query.page as string) : 0;

        this.databaseService.connection.query(`SELECT
            personnel_id,
            organization_id,
            certification_id,
            abbreviation,
            latest_date
          FROM most_recent_certifications ${filterStr} LIMIT ? OFFSET ?;`,
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => viewParsers.MostRecentCertificationsParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/personnel/raw/:id', (req, res) => {
      try {
        const personnelId = req.params.id;
        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

        let organizationInfo: viewParsers.OrganizationInfoRaw;

        const json: viewParsers.PersonnelRaw = {
          personnelId,
          organizationId
        };

        // todo: add proper paging
        fetch(`${API_SERVER}/active-duty?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`)
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.activeDutyRecords = [];
              records.forEach(r => {
                json.activeDutyRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/certification?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.certificationRecords = [];
              records.forEach(r => {
                json.certificationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/discord?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.discordRecords = [];
              records.forEach(r => {
                json.discordRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/joined-organization?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.joinedOrganizationRecords = [];
              records.forEach(r => {
                json.joinedOrganizationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/note?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.noteRecords = [];
              records.forEach(r => {
                json.noteRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/operation-attendence?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.operationAttendenceRecords = [];
              records.forEach(r => {
                json.operationAttendenceRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/rank-change?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.rankChangeRecords = [];
              records.forEach(r => {
                json.rankChangeRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen?personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.rsiCitizenRecords = [];
              records.forEach(r => {
                json.rsiCitizenRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen-organization?personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.rsiCitizenOrganizationRecords = [];
              records.forEach(r => {
                json.rsiCitizenOrganizationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/status?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.statusRecords = [];
              records.forEach(r => {
                json.statusRecords!.push(r);
              });
            }
          })
          .then(() => {
            res.status(200).json(json);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          });
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/personnel/:id', (req, res) => {
      try {
        const personnelId = req.params.id;
        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

        let organizationInfo: viewParsers.OrganizationInfoRaw;
        let json: viewParsers.Personnel;

        // todo: add proper paging
        fetch(`${API_SERVER}/personnel/raw/${personnelId}?organizationId=${organizationId}`)
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((record: Object) => {
            json = record as viewParsers.Personnel;
          })
          .then(() => fetch(`${API_SERVER}/organization-info/raw/${organizationId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((r: Object) => {
            organizationInfo = r as viewParsers.OrganizationInfoRaw;
          })
          .then(() => {
            Object.keys(json).filter(key => key.endsWith('Records')).forEach(key => {
              const records = (json as any)[key];
              records.forEach((r: any) => {
                delete r.id;
                delete r.personnelId;
                delete r.organizationId;
                delete r.issuerPersonnelId;

                if (r.date) {
                  const date = new Date(Date.parse(r.date));
                  r.date = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}Z`;
                }
              });
            });

            if (json.certificationRecords && organizationInfo.certifications && organizationInfo.branches) {
              json.certificationRecords.forEach(r => {
                const certification = organizationInfo.certifications!.find(e => e.id === r.certificationId);
                const branch = organizationInfo.branches!.find(e => e.id === certification.branchId);
                r.abbreviation = '';
                if (branch) {
                  r.abbreviation += branch.abbreviation + '-';
                }
                r.abbreviation += certification.abbreviation;

                delete r.certificationId;
              });
            }

            if (json.rankChangeRecords && organizationInfo.branches && organizationInfo.ranks && organizationInfo.grades) {
              json.rankChangeRecords.forEach(r => {
                const rank = organizationInfo.ranks!.find(e => e.id === r.rankId);
                const branch = organizationInfo.branches!.find(e => e.id === rank.branchId);
                const grade = organizationInfo.grades!.find(e => e.id === rank.gradeId);
                r.abbreviation = '';
                if (branch) {
                  r.abbreviation += branch.abbreviation + '-';
                }
                if (grade) {
                  r.abbreviation += grade.abbreviation + '-';
                }
                r.abbreviation += rank.abbreviation;

                delete r.rankId;
              });
            }
          })
          .then(() => {
            res.status(200).json(json);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          });
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/organization-info/raw/:id', (req, res) => {
      try {
        const organizationId = req.params.id;

        const json: viewParsers.OrganizationInfoRaw = {
          organizationId
        };
  
        // todo: add proper paging
        fetch(`${API_SERVER}/branches?organizationId=${organizationId}&limit=1000`)
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((branches: Object[]) => {
            if (branches.length > 0) {
              json.branches = [];
              branches.forEach(r => {
                json.branches!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/grades?organizationId=${organizationId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((grades: Object[]) => {
            if (grades.length > 0) {
              json.grades = [];
              grades.forEach(r => {
                json.grades!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/ranks?organizationId=${organizationId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((ranks: Object[]) => {
            if (ranks.length > 0) {
              json.ranks = [];
              ranks.forEach(r => {
                json.ranks!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/certifications?organizationId=${organizationId}&limit=1000`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((certifications: Object[]) => {
            if (certifications.length > 0) {
              json.certifications = [];
              certifications.forEach(r => {
                json.certifications!.push(r);
              });
            }
          })
          .then(() => {
            res.status(200).json(json);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          });
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    return router;
  }
  
  static checkStatusOrThrow(res: any): Promise<Object[]> {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((e: Object) => { 
      throw new Error(JSON.stringify(e));
    });
  }
}