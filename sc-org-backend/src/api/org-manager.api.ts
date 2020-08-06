import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as core from "express-serve-static-core";
import mysql from 'mysql';

import { environment } from '../environments/environment';
import * as parsers from './parsers';

export class OrgManagerAPI {
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


    router.post('/active-duty', (req, res) => {
      const record = parsers.ActiveDutyParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO active_duty (id, date, personnel_id, issuer_personnel_id, description) VALUES (?, ?, ?, ?, ?)',
        parsers.ActiveDutyParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/active-duty', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, description FROM active_duty LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.ActiveDutyParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/active-duty/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, description FROM active_duty WHERE id=?',
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
    });

    router.put('/active-duty/:id', (req, res) => {
      const record = parsers.ActiveDutyParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE active_duty SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, description=? WHERE id=? LIMIT 1',
        [...parsers.ActiveDutyParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/active-duty/:id', (req, res) => {
      connection.query(
        'DELETE FROM active_duty WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/certification', (req, res) => {
      const record = parsers.CertificationParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO certification (id, date, personnel_id, issuer_personnel_id, certification_id) VALUES (?, ?, ?, ?, ?)',
        parsers.CertificationParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/certification', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, certification_id FROM certification LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.CertificationParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/certification/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, certification_id FROM certification WHERE id=?',
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
    });

    router.put('/certification/:id', (req, res) => {
      const record = parsers.CertificationParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE certification SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, certification_id=? WHERE id=? LIMIT 1',
        [...parsers.CertificationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/certification/:id', (req, res) => {
      connection.query(
        'DELETE FROM certification WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/discord', (req, res) => {
      const record = parsers.DiscordParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO discord (id, date, personnel_id, issuer_personnel_id, discord_id, username, discriminator) VALUES (?, ?, ?, ?, ?, ?, ?)',
        parsers.DiscordParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/discord', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, discord_id, username, discriminator FROM discord LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.DiscordParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/discord/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, discord_id, username, discriminator FROM discord WHERE id=?',
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
    });

    router.put('/discord/:id', (req, res) => {
      const record = parsers.DiscordParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE discord SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, discord_id=?, username=?, discriminator=? WHERE id=? LIMIT 1',
        [...parsers.DiscordParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/discord/:id', (req, res) => {
      connection.query(
        'DELETE FROM discord WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/joined-organization', (req, res) => {
      const record = parsers.JoinedOrganizationParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO joined_organization (id, date, personnel_id, issuer_personnel_id, organization_id, recruited_by_personnel_id) VALUES (?, ?, ?, ?, ?, ?)',
        parsers.JoinedOrganizationParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/joined-organization', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, organization_id, recruited_by_personnel_id FROM joined_organization LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.JoinedOrganizationParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/joined-organization/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, organization_id, recruited_by_personnel_id FROM joined_organization WHERE id=?',
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
    });

    router.put('/joined-organization/:id', (req, res) => {
      const record = parsers.JoinedOrganizationParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE joined_organization SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, organization_id=?, recruited_by_personnel_id=? WHERE id=? LIMIT 1',
        [...parsers.JoinedOrganizationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/joined-organization/:id', (req, res) => {
      connection.query(
        'DELETE FROM joined_organization WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/note', (req, res) => {
      const record = parsers.NoteParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO note (id, date, personnel_id, issuer_personnel_id, note) VALUES (?, ?, ?, ?, ?)',
        parsers.NoteParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/note', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, note FROM note LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.NoteParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/note/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, note FROM note WHERE id=?',
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
    });

    router.put('/note/:id', (req, res) => {
      const record = parsers.NoteParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE note SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, note=? WHERE id=? LIMIT 1',
        [...parsers.NoteParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/note/:id', (req, res) => {
      connection.query(
        'DELETE FROM note WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/operation-attendence', (req, res) => {
      const record = parsers.OperationAttendenceParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO operation_attendence (id, date, personnel_id, issuer_personnel_id, name) VALUES (?, ?, ?, ?, ?)',
        parsers.OperationAttendenceParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/operation-attendence', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, name FROM operation_attendence LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.OperationAttendenceParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/operation-attendence/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, name FROM operation_attendence WHERE id=?',
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
    });

    router.put('/operation-attendence/:id', (req, res) => {
      const record = parsers.OperationAttendenceParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE operation_attendence SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, name=? WHERE id=? LIMIT 1',
        [...parsers.OperationAttendenceParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/operation-attendence/:id', (req, res) => {
      connection.query(
        'DELETE FROM operation_attendence WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/rank-change', (req, res) => {
      const record = parsers.RankChangeParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO rank_change (id, date, personnel_id, issuer_personnel_id, rank_id) VALUES (?, ?, ?, ?, ?)',
        parsers.RankChangeParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/rank-change', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, rank_id FROM rank_change LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.RankChangeParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/rank-change/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, rank_id FROM rank_change WHERE id=?',
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
    });

    router.put('/rank-change/:id', (req, res) => {
      const record = parsers.RankChangeParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE rank_change SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, rank_id=? WHERE id=? LIMIT 1',
        [...parsers.RankChangeParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/rank-change/:id', (req, res) => {
      connection.query(
        'DELETE FROM rank_change WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/rsi-citizen', (req, res) => {
      const record = parsers.RsiCitizenParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO rsi_citizen (id, date, personnel_id, citizen_record, citizen_name, handle_name, enlisted_rank, enlisted, location, fluency, website, biography) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        parsers.RsiCitizenParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/rsi-citizen', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, citizen_record, citizen_name, handle_name, enlisted_rank, enlisted, location, fluency, website, biography FROM rsi_citizen LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.RsiCitizenParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/rsi-citizen/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, citizen_record, citizen_name, handle_name, enlisted_rank, enlisted, location, fluency, website, biography FROM rsi_citizen WHERE id=?',
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
    });

    router.put('/rsi-citizen/:id', (req, res) => {
      const record = parsers.RsiCitizenParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE rsi_citizen SET id=?, date=?, personnel_id=?, citizen_record=?, citizen_name=?, handle_name=?, enlisted_rank=?, enlisted=?, location=?, fluency=?, website=?, biography=? WHERE id=? LIMIT 1',
        [...parsers.RsiCitizenParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/rsi-citizen/:id', (req, res) => {
      connection.query(
        'DELETE FROM rsi_citizen WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/rsi-citizen-organization', (req, res) => {
      const record = parsers.RsiCitizenOrganizationParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO rsi_citizen_organization (id, date, personnel_id, organization_id, main, rank) VALUES (?, ?, ?, ?, ?, ?)',
        parsers.RsiCitizenOrganizationParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/rsi-citizen-organization', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, organization_id, main, rank FROM rsi_citizen_organization LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.RsiCitizenOrganizationParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/rsi-citizen-organization/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, organization_id, main, rank FROM rsi_citizen_organization WHERE id=?',
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
    });

    router.put('/rsi-citizen-organization/:id', (req, res) => {
      const record = parsers.RsiCitizenOrganizationParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE rsi_citizen_organization SET id=?, date=?, personnel_id=?, organization_id=?, main=?, rank=? WHERE id=? LIMIT 1',
        [...parsers.RsiCitizenOrganizationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/rsi-citizen-organization/:id', (req, res) => {
      connection.query(
        'DELETE FROM rsi_citizen_organization WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/rsi-organization', (req, res) => {
      const record = parsers.RsiOrganizationParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO rsi_organization (id, date, organization_id, name, sid, member_count, archetype, primary_activity, secondary_activity, commitment, primary_language, recruiting, role_play, exclusive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        parsers.RsiOrganizationParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/rsi-organization', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, organization_id, name, sid, member_count, archetype, primary_activity, secondary_activity, commitment, primary_language, recruiting, role_play, exclusive FROM rsi_organization LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.RsiOrganizationParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/rsi-organization/:id', (req, res) => {
      connection.query(
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
    });

    router.put('/rsi-organization/:id', (req, res) => {
      const record = parsers.RsiOrganizationParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE rsi_organization SET id=?, date=?, organization_id=?, name=?, sid=?, member_count=?, archetype=?, primary_activity=?, secondary_activity=?, commitment=?, primary_language=?, recruiting=?, role_play=?, exclusive=? WHERE id=? LIMIT 1',
        [...parsers.RsiOrganizationParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/rsi-organization/:id', (req, res) => {
      connection.query(
        'DELETE FROM rsi_organization WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });



    router.post('/status', (req, res) => {
      const record = parsers.StatusParser.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO status (id, date, personnel_id, issuer_personnel_id, status_id) VALUES (?, ?, ?, ?, ?)',
        parsers.StatusParser.toMySql(record),
        (err: mysql.MysqlError | null) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json({ status: 'ok', id: record.id });
          }
        }
      )
    });

    router.get('/status', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, status_id FROM status LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.StatusParser.fromMySql(r)));
          }
        }
      )
    });

    router.get('/status/:id', (req, res) => {
      connection.query(
        'SELECT id, date, personnel_id, issuer_personnel_id, status_id FROM status WHERE id=?',
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
    });

    router.put('/status/:id', (req, res) => {
      const record = parsers.StatusParser.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE status SET id=?, date=?, personnel_id=?, issuer_personnel_id=?, status_id=? WHERE id=? LIMIT 1',
        [...parsers.StatusParser.toMySql(record), parsers.toBinaryUUID(record.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.delete('/status/:id', (req, res) => {
      connection.query(
        'DELETE FROM status WHERE id=? LIMIT 1',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.affectedRows === 1) {
            res.status(200).json({ status: 'ok' });
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    return router;
  }
}