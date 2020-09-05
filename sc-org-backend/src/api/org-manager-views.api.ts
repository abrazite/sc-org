import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as core from "express-serve-static-core";
import mysql from 'mysql';

import { environment } from '../environments/environment';

import { AuthAPI, APISecurityLevel } from './auth.api';
import { APIUtils } from './api-utils';
import { DatabaseService } from '../services/database.service';
import * as parsers from './parsers';
import * as viewParsers from './parsers-views';
import { RSICitizenSchema } from '../models/rsi-citizen.model';

const API_SERVER = `${environment.apiHost}${environment.apiPath}`;

export class OrgManagerViewsAPI {
  constructor(private databaseService: DatabaseService) {}

  createRouter(): core.Router {
    const router = express.Router();
    router.use(cors());
    router.use(bodyParser.json());

    
    router.get('/rsi-citizen-record', (req, res) => {
      try {
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

        const handleName = req.query.handleName as string;
        if (!handleName) {
          throw new Error('handleName required');
        }

        const personnelId = req.query.personnelId as string;
        if (!personnelId) {
          throw new Error('personnelId required');
        }

        let rsi_citizen_record: RSICitizenSchema;
        let rsi_record: parsers.RsiCitizen | null = null;
        const rsi_organizations: parsers.RsiOrganization[] = [];
        const rsi_citizen_organizations: parsers.RsiCitizenOrganization[] = [];

        fetch(`${API_SERVER}/rsi/citizen/${handleName}`)
          .then(APIUtils.checkStatusOrThrow)
          .then((json: Object) => {
            rsi_citizen_record = json as RSICitizenSchema;
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen?handleName=${handleName}`))
          .then(APIUtils.checkStatusOrThrow)
          .then((json: Object) => {
            const rsi_records = json as parsers.RsiCitizen[];
            rsi_records.sort((a, b) => b.date && a.date ? b.date.getTime() - a.date.getTime() : (b.date !== null ? 1 :  -1));
            if (rsi_records.length > 0) {
              rsi_record = rsi_records[0];
            }
          })
          .then(() => {
            let promise = Promise.resolve();     
            if (rsi_citizen_record.mainOrganization.spectrumIdentification) {
              promise = promise
                .then(() => fetch(`${API_SERVER}/rsi-organization?sid=${rsi_citizen_record.mainOrganization.spectrumIdentification}`))
                .then(APIUtils.checkStatusOrThrow)
                .then((json: Object) => {
                  const rsi_organization = json as parsers.RsiOrganization[];
                  rsi_organization.sort((a, b) => b.date && a.date ? b.date.getTime() - a.date.getTime() : (b.date !== null ? 1 :  -1));
                  if (rsi_organization.length > 0) {
                    rsi_organizations.push(rsi_organization[0]);
                  }
                });
            }
            return promise;
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen-organization?personnelId=${personnelId}`))
          .then(APIUtils.checkStatusOrThrow)
          .then((json: Object) => {
            const rsi_records = json as parsers.RsiCitizenOrganization[];
            rsi_records.forEach(r => {
              rsi_citizen_organizations.push(r);
            });
          })
          .then(() => {
            const isCitizenRecordDifferent = 
              rsi_record?.citizenRecord !== rsi_citizen_record.citizenName &&
              rsi_record?.citizenName !== rsi_citizen_record.citizenName &&
              rsi_record?.handleName !== rsi_citizen_record.handleName &&
              rsi_record?.enlistedDate !== rsi_citizen_record.enlisted &&
              rsi_record?.enlistedRank !== rsi_citizen_record.enlistedRank &&
              rsi_record?.handleName !== rsi_citizen_record.handleName &&
              rsi_record?.location !== rsi_citizen_record.location &&
              rsi_record?.fluency !== rsi_citizen_record.fluency &&
              rsi_record?.biography !== rsi_citizen_record.bio;

            // const isOrganizationDifferent = 
            // rsi_organizations.rsi_citizen_record.mainOrganization.name;

            // if (rsi_record?.citizenRecord);

            res.json([rsi_record!, rsi_citizen_record, rsi_organizations, rsi_citizen_organizations]);
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

    router.get('/personnel', (req, res) => {
      try {
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }
        
        let queryStr = '';
        Object.keys(req.query).forEach(key => {
          queryStr += `${key}=${req.query[key]}&`;
        });
  
        const headers = OrgManagerViewsAPI.makeHeader(req);

        let personnel: viewParsers.PersonnelSummary[];
        const certifications: { [personnelId: string]: viewParsers.MostRecentCertifications[] } = {};

        fetch(`${API_SERVER}/personnel-summary?${queryStr}`, {
          headers
        })
          .then(APIUtils.checkStatusOrThrow)
          .then((json: Object[]) => {
            personnel = json as viewParsers.PersonnelSummary[];
          })
          // todo: add proper paging
          .then(() => fetch(`${API_SERVER}/most-recent-certifications?organizationId=${organizationId}&limit=10000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
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
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

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

    router.get('/ranks-details', (req, res) => {
      try {
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

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
            organization_id,
            branch_id,
            grade_id,
            rank_id,
            branch_abbreviation,
            grade_abbreviation,
            rank_abbreviation,
            branch_name,
            grade_name,
            rank_name
          FROM ranks_details ${filterStr} LIMIT ? OFFSET ?;`,
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => viewParsers.RankDetailsParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/membership', (req, res) => {
      try {
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const organizationId = req.query.organizationId as string;
        const peronnelId = req.query.peronnelId as string;
        const username = req.query.username as string;
        if (!organizationId && !peronnelId && !username) {
          throw new Error('either an organizationId, a peronnelId, or a username is required');
        }

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
            joined_date,
            branch_id,
            grade_id,
            rank_id,
            branch_abbreviation,
            grade_abbreviation,
            rank_abbreviation,
            \`get\`,
            post,
            put,
            del,
            proxy
          FROM membership ${filterStr} LIMIT ? OFFSET ?;`,
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => viewParsers.MembershipParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/most-recent-certifications', (req, res, next) => {
      try {
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

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
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const personnelId = req.params.id;
        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

        const headers = OrgManagerViewsAPI.makeHeader(req);

        let organizationInfo: viewParsers.OrganizationInfoRaw;

        const json: viewParsers.PersonnelRaw = {
          personnelId,
          organizationId
        };

        // todo: add proper paging
        fetch(`${API_SERVER}/active-duty?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
          headers
        })
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.activeDutyRecords = [];
              records.forEach(r => {
                json.activeDutyRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/personnel?organizationId=${organizationId}&personnelId=${personnelId}&limit=1`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length === 1) {
              json.personnelSummary = records[0] as viewParsers.PersonnelSummary;
            }
          })
          .then(() => fetch(`${API_SERVER}/certification?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.certificationRecords = [];
              records.forEach(r => {
                json.certificationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/discord?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.discordRecords = [];
              records.forEach(r => {
                json.discordRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/joined-organization?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.joinedOrganizationRecords = [];
              records.forEach(r => {
                json.joinedOrganizationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/left-organization?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.leftOrganizationRecords = [];
              records.forEach(r => {
                json.leftOrganizationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/note?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.noteRecords = [];
              records.forEach(r => {
                json.noteRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/operation-attendence?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.operationAttendenceRecords = [];
              records.forEach(r => {
                json.operationAttendenceRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/rank-change?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.rankChangeRecords = [];
              records.forEach(r => {
                json.rankChangeRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen?personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.rsiCitizenRecords = [];
              records.forEach(r => {
                json.rsiCitizenRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen-organization?personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((records: Object[]) => {
            if (records.length > 0) {
              json.rsiCitizenOrganizationRecords = [];
              records.forEach(r => {
                json.rsiCitizenOrganizationRecords!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/status?organizationId=${organizationId}&personnelId=${personnelId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
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
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const personnelId = req.params.id;
        const organizationId = req.query.organizationId as string;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

        const headers = OrgManagerViewsAPI.makeHeader(req);

        let organizationInfo: viewParsers.OrganizationInfoRaw;
        let json: viewParsers.Personnel;

        // todo: add proper paging
        fetch(`${API_SERVER}/personnel/raw/${personnelId}?organizationId=${organizationId}`, {
          headers
        })
          .then(APIUtils.checkStatusOrThrow)
          .then((record: Object) => {
            json = record as viewParsers.Personnel;
          })
          .then(() => fetch(`${API_SERVER}/organization-info/raw/${organizationId}`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
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
        if (!AuthAPI.checkAuthHeaders({ get: APISecurityLevel.OrgRecords })(req, res)) {
          return;
        }

        const headers = OrgManagerViewsAPI.makeHeader(req);

        const organizationId = req.params.id;

        const json: viewParsers.OrganizationInfoRaw = {
          organizationId
        };
  
        // todo: add proper paging
        fetch(`${API_SERVER}/branches?organizationId=${organizationId}&limit=1000`, {
          headers
        })
          .then(APIUtils.checkStatusOrThrow)
          .then((branches: Object[]) => {
            if (branches.length > 0) {
              json.branches = [];
              branches.forEach(r => {
                json.branches!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/grades?organizationId=${organizationId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((grades: Object[]) => {
            if (grades.length > 0) {
              json.grades = [];
              grades.forEach(r => {
                json.grades!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/ranks?organizationId=${organizationId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
          .then((ranks: Object[]) => {
            if (ranks.length > 0) {
              json.ranks = [];
              ranks.forEach(r => {
                json.ranks!.push(r);
              });
            }
          })
          .then(() => fetch(`${API_SERVER}/certifications?organizationId=${organizationId}&limit=1000`, {
            headers
          }))
          .then(APIUtils.checkStatusOrThrow)
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

  static makeHeader(req: core.Request): { [key: string]: string } {
    const headers: { [key: string]: string } = {}

    Object.keys(req.headers).forEach(key => {
      headers[key] = req.headers[key] as string;
    });

    return headers;
  }
}