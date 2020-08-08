// Auto generated
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as core from "express-serve-static-core";
import mysql from 'mysql';

import { DatabaseService } from '../services/database.service';
import * as parsers from './parsers';

export class OrgManagerAPI {
  constructor(private databaseService: DatabaseService) {}

  createRouter(): core.Router {
    const router = express.Router();
    router.use(cors());
    router.use(bodyParser.json());

    

    router.post('/active-duty', (req, res, next) => {
      try {
        const record = parsers.ActiveDutyParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO active_duty (id, date, organization_id, personnel_id, issuer_personnel_id, description) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.ActiveDutyParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST active-duty ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/active-duty', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, description FROM active_duty ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.ActiveDutyParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/active-duty/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, description FROM active_duty WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.ActiveDutyParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/active-duty/:id', (req, res, next) => {
      try {
        const record = parsers.ActiveDutyParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE active_duty SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, description=? WHERE id=? LIMIT 1',
          [...parsers.ActiveDutyParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT active-duty ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/active-duty/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM active_duty WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL active-duty ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/certification', (req, res, next) => {
      try {
        const record = parsers.CertificationParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO certification (id, date, organization_id, personnel_id, issuer_personnel_id, certification_id) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.CertificationParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST certification ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/certification', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, certification_id FROM certification ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.CertificationParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/certification/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, certification_id FROM certification WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.CertificationParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/certification/:id', (req, res, next) => {
      try {
        const record = parsers.CertificationParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE certification SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, certification_id=? WHERE id=? LIMIT 1',
          [...parsers.CertificationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT certification ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/certification/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM certification WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL certification ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/discord', (req, res, next) => {
      try {
        const record = parsers.DiscordParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO discord (id, date, organization_id, personnel_id, issuer_personnel_id, username, discriminator) VALUES (?, ?, ?, ?, ?, ?, ?)',
          parsers.DiscordParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST discord ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/discord', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, username, discriminator FROM discord ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.DiscordParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/discord/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, username, discriminator FROM discord WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.DiscordParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/discord/:id', (req, res, next) => {
      try {
        const record = parsers.DiscordParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE discord SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, username=?, discriminator=? WHERE id=? LIMIT 1',
          [...parsers.DiscordParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT discord ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/discord/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM discord WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL discord ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/joined-organization', (req, res, next) => {
      try {
        const record = parsers.JoinedOrganizationParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO joined_organization (id, date, organization_id, personnel_id, issuer_personnel_id, joined_organization_id, recruited_by_personnel_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          parsers.JoinedOrganizationParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST joined-organization ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/joined-organization', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, joined_organization_id, recruited_by_personnel_id FROM joined_organization ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.JoinedOrganizationParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/joined-organization/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, joined_organization_id, recruited_by_personnel_id FROM joined_organization WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.JoinedOrganizationParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/joined-organization/:id', (req, res, next) => {
      try {
        const record = parsers.JoinedOrganizationParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE joined_organization SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, joined_organization_id=?, recruited_by_personnel_id=? WHERE id=? LIMIT 1',
          [...parsers.JoinedOrganizationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT joined-organization ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/joined-organization/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM joined_organization WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL joined-organization ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/note', (req, res, next) => {
      try {
        const record = parsers.NoteParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO note (id, date, organization_id, personnel_id, issuer_personnel_id, note) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.NoteParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST note ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/note', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, note FROM note ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.NoteParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/note/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, note FROM note WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.NoteParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/note/:id', (req, res, next) => {
      try {
        const record = parsers.NoteParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE note SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, note=? WHERE id=? LIMIT 1',
          [...parsers.NoteParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT note ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/note/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM note WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL note ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/operation-attendence', (req, res, next) => {
      try {
        const record = parsers.OperationAttendenceParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO operation_attendence (id, date, organization_id, personnel_id, issuer_personnel_id, name) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.OperationAttendenceParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST operation-attendence ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/operation-attendence', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, name FROM operation_attendence ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.OperationAttendenceParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/operation-attendence/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, name FROM operation_attendence WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.OperationAttendenceParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/operation-attendence/:id', (req, res, next) => {
      try {
        const record = parsers.OperationAttendenceParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE operation_attendence SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, name=? WHERE id=? LIMIT 1',
          [...parsers.OperationAttendenceParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT operation-attendence ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/operation-attendence/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM operation_attendence WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL operation-attendence ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/rank-change', (req, res, next) => {
      try {
        const record = parsers.RankChangeParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO rank_change (id, date, organization_id, personnel_id, issuer_personnel_id, rank_id) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.RankChangeParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST rank-change ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rank-change', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, rank_id FROM rank_change ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.RankChangeParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rank-change/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, rank_id FROM rank_change WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.RankChangeParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/rank-change/:id', (req, res, next) => {
      try {
        const record = parsers.RankChangeParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE rank_change SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, rank_id=? WHERE id=? LIMIT 1',
          [...parsers.RankChangeParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT rank-change ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/rank-change/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM rank_change WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL rank-change ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/status', (req, res, next) => {
      try {
        const record = parsers.StatusParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO status (id, date, organization_id, personnel_id, issuer_personnel_id, status_id) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.StatusParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST status ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/status', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, status_id FROM status ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.StatusParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/status/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, personnel_id, issuer_personnel_id, status_id FROM status WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.StatusParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/status/:id', (req, res, next) => {
      try {
        const record = parsers.StatusParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE status SET id=?, date=?, organization_id=?, personnel_id=?, issuer_personnel_id=?, status_id=? WHERE id=? LIMIT 1',
          [...parsers.StatusParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT status ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/status/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM status WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL status ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/rsi-citizen', (req, res, next) => {
      try {
        const record = parsers.RsiCitizenParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO rsi_citizen (id, date, personnel_id, citizen_record, citizen_name, handle_name, enlisted_rank, enlisted_date, location, fluency, website, biography) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          parsers.RsiCitizenParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST rsi-citizen ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rsi-citizen', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, personnel_id, citizen_record, citizen_name, handle_name, enlisted_rank, enlisted_date, location, fluency, website, biography FROM rsi_citizen ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.RsiCitizenParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rsi-citizen/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, personnel_id, citizen_record, citizen_name, handle_name, enlisted_rank, enlisted_date, location, fluency, website, biography FROM rsi_citizen WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.RsiCitizenParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/rsi-citizen/:id', (req, res, next) => {
      try {
        const record = parsers.RsiCitizenParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE rsi_citizen SET id=?, date=?, personnel_id=?, citizen_record=?, citizen_name=?, handle_name=?, enlisted_rank=?, enlisted_date=?, location=?, fluency=?, website=?, biography=? WHERE id=? LIMIT 1',
          [...parsers.RsiCitizenParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT rsi-citizen ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/rsi-citizen/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM rsi_citizen WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL rsi-citizen ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/rsi-citizen-organization', (req, res, next) => {
      try {
        const record = parsers.RsiCitizenOrganizationParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO rsi_citizen_organization (id, date, personnel_id, organization_id, main) VALUES (?, ?, ?, ?, ?)',
          parsers.RsiCitizenOrganizationParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST rsi-citizen-organization ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rsi-citizen-organization', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, personnel_id, organization_id, main FROM rsi_citizen_organization ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.RsiCitizenOrganizationParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rsi-citizen-organization/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, personnel_id, organization_id, main FROM rsi_citizen_organization WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.RsiCitizenOrganizationParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/rsi-citizen-organization/:id', (req, res, next) => {
      try {
        const record = parsers.RsiCitizenOrganizationParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE rsi_citizen_organization SET id=?, date=?, personnel_id=?, organization_id=?, main=? WHERE id=? LIMIT 1',
          [...parsers.RsiCitizenOrganizationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT rsi-citizen-organization ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/rsi-citizen-organization/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM rsi_citizen_organization WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL rsi-citizen-organization ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/rsi-organization', (req, res, next) => {
      try {
        const record = parsers.RsiOrganizationParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO rsi_organization (id, date, organization_id, name, sid, member_count, archetype, primary_activity, secondary_activity, commitment, primary_language, recruiting, role_play, exclusive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          parsers.RsiOrganizationParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST rsi-organization ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rsi-organization', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, date, organization_id, name, sid, member_count, archetype, primary_activity, secondary_activity, commitment, primary_language, recruiting, role_play, exclusive FROM rsi_organization ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.RsiOrganizationParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/rsi-organization/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, date, organization_id, name, sid, member_count, archetype, primary_activity, secondary_activity, commitment, primary_language, recruiting, role_play, exclusive FROM rsi_organization WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.RsiOrganizationParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/rsi-organization/:id', (req, res, next) => {
      try {
        const record = parsers.RsiOrganizationParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE rsi_organization SET id=?, date=?, organization_id=?, name=?, sid=?, member_count=?, archetype=?, primary_activity=?, secondary_activity=?, commitment=?, primary_language=?, recruiting=?, role_play=?, exclusive=? WHERE id=? LIMIT 1',
          [...parsers.RsiOrganizationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT rsi-organization ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/rsi-organization/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM rsi_organization WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL rsi-organization ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/branches', (req, res, next) => {
      try {
        const record = parsers.BranchesParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO branches (id, organization_id, abbreviation, branch) VALUES (?, ?, ?, ?)',
          parsers.BranchesParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST branches ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/branches', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, organization_id, abbreviation, branch FROM branches ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.BranchesParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/branches/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, organization_id, abbreviation, branch FROM branches WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.BranchesParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/branches/:id', (req, res, next) => {
      try {
        const record = parsers.BranchesParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE branches SET id=?, organization_id=?, abbreviation=?, branch=? WHERE id=? LIMIT 1',
          [...parsers.BranchesParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT branches ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/branches/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM branches WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL branches ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/grades', (req, res, next) => {
      try {
        const record = parsers.GradesParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO grades (id, organization_id, abbreviation, grade) VALUES (?, ?, ?, ?)',
          parsers.GradesParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST grades ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/grades', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, organization_id, abbreviation, grade FROM grades ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.GradesParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/grades/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, organization_id, abbreviation, grade FROM grades WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.GradesParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/grades/:id', (req, res, next) => {
      try {
        const record = parsers.GradesParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE grades SET id=?, organization_id=?, abbreviation=?, grade=? WHERE id=? LIMIT 1',
          [...parsers.GradesParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT grades ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/grades/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM grades WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL grades ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/ranks', (req, res, next) => {
      try {
        const record = parsers.RanksParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO ranks (id, organization_id, branch_id, grade_id, abbreviation, name) VALUES (?, ?, ?, ?, ?, ?)',
          parsers.RanksParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST ranks ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/ranks', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, organization_id, branch_id, grade_id, abbreviation, name FROM ranks ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.RanksParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/ranks/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, organization_id, branch_id, grade_id, abbreviation, name FROM ranks WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.RanksParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/ranks/:id', (req, res, next) => {
      try {
        const record = parsers.RanksParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE ranks SET id=?, organization_id=?, branch_id=?, grade_id=?, abbreviation=?, name=? WHERE id=? LIMIT 1',
          [...parsers.RanksParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT ranks ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/ranks/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM ranks WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL ranks ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });



    router.post('/certifications', (req, res, next) => {
      try {
        const record = parsers.CertificationsParser.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO certifications (id, organization_id, branch_id, abbreviation, name) VALUES (?, ?, ?, ?, ?)',
          parsers.CertificationsParser.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST certifications ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/certifications', (req, res, next) => {
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

        this.databaseService.connection.query(
          'SELECT id, organization_id, branch_id, abbreviation, name FROM certifications ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.CertificationsParser.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/certifications/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT id, organization_id, branch_id, abbreviation, name FROM certifications WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.CertificationsParser.fromMySql(r)));
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.put('/certifications/:id', (req, res, next) => {
      try {
        const record = parsers.CertificationsParser.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE certifications SET id=?, organization_id=?, branch_id=?, abbreviation=?, name=? WHERE id=? LIMIT 1',
          [...parsers.CertificationsParser.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT certifications ' + record.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.delete('/certifications/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM certifications WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL certifications ' + req.params.id);
              res.status(200).json({ status: 'ok' });
            } else {
              res.status(404).json({ status: 'error' });
            }
          }
        )
      } catch(err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    });


    return router;
  }
}    
    