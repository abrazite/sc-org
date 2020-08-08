import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as core from "express-serve-static-core";
import mysql from 'mysql';

import { environment } from '../environments/environment';
import * as parsers from './parsers';

const API_SERVER = 'http://localhost:8081/api/1.0.0';

export class OrgManagerViewsAPI {
  static createRouter(): core.Router {
    const router = express.Router();
    const connection = mysql.createConnection({
      host: environment.mysqlHost,
      user: environment.mysqlUser,
      password: environment.mysqlPassword,
      database: environment.mysqlDatabase
    });
    connection.connect();

    router.use(cors());
    router.use(bodyParser.json());    

    router.get('/personnel/:id', (req, res, next) => {
      try {
        const personnelId = req.params.id;
        const organizationId = req.query.organizationId;
        if (!organizationId) {
          throw new Error('organizationId required');
        }

        const json: {
          personnelId: string;
          activeDutyRecords: Object[],
          certificationRecords: Object[],
          discordRecords: Object[],
          joinedOrganizationRecords: Object[],
          noteRecords: Object[],
          operationAttendenceRecords: Object[],
          rankChangeRecords: Object[],
          rsiCitizenRecords: Object[],
          rsiCitizenOrganizationRecords: Object[],
          statusRecords: Object[]
        } = {
          personnelId,
          activeDutyRecords: [],
          certificationRecords: [],
          discordRecords: [],
          joinedOrganizationRecords: [],
          noteRecords: [],
          operationAttendenceRecords: [],
          rankChangeRecords: [],
          rsiCitizenRecords: [],
          rsiCitizenOrganizationRecords: [],
          statusRecords: []
        };
        fetch(`${API_SERVER}/active-duty?organizationId=${organizationId}&personnelId=${personnelId}`)
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.activeDutyRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/certification?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.certificationRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/discord?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.discordRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/joined-organization?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.joinedOrganizationRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/note?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.noteRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/operation-attendence?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.operationAttendenceRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/rank-change?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.rankChangeRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen?personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.rsiCitizenRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/rsi-citizen-organization?personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.rsiCitizenOrganizationRecords.push(r);
            })
          })
          .then(() => fetch(`${API_SERVER}/status?organizationId=${organizationId}&personnelId=${personnelId}`))
          .then(OrgManagerViewsAPI.checkStatusOrThrow)
          .then((records: Object[]) => {
            records.forEach(r => {
              json.statusRecords.push(r);
            })
          })
          .then(() => {
            Object.keys(json).filter(key => key.endsWith('Records')).forEach(key => {
              const records = (json as any)[key] as any[];
              records.forEach(r => {
                delete r.personnelId;
                delete r.organizationId;
              });
            });
          })
          .then(() => {
            res.status(200).json(json);
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