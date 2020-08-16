import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as core from "express-serve-static-core";
import mysql from 'mysql';

import { environment } from '../environments/environment';

import { APIUtils } from './api-utils';
import * as parsers from './parsers';
import * as viewParsers from './parsers-views';
import { RSICitizenSchema } from '../models/rsi-citizen.model';

const API_SERVER = `${environment.apiHost}${environment.apiPath}`;

export class AuthAPI {
  constructor() {}

  createRouter(): core.Router {
    const router = express.Router();
    router.use(cors());
    router.use(bodyParser.json());

    router.get('/validate', (req, res) => {
      // populated by vouch-proxy and discord claims
      const authorization: string = req.headers['authorization'] as string

      const user: {[key: string]: string} = {};
      if (authorization === undefined) {
        res.status(403).json({ error: 'Invalid credentials sent' });
        return
      }

      fetch(environment.userInfoUrl, {
        headers: {
          'authorization': req.headers['authorization']!
        }
      })
      .then(APIUtils.checkStatusOrThrow)
      .then((res: any) => {
        console.log(JSON.stringify(res));
        user.username = res.username;
        user.discriminator = res.discriminator;
        user.id = res.id;
      })
      .then(() => fetch(`${API_SERVER}/membership?username=${user.username}&discriminator=${user.discriminator}`))
      .then(APIUtils.checkStatusOrThrow)
      .then((records: Object[]) => {
        const memberships = records as viewParsers.Membership[];

        if (memberships.length > 0 && memberships[0].personnelId !== null) {

          const [membership] = memberships;
          const personnelId = membership.personnelId;
          const citizenRecord = membership.citizenRecord;
          const citizenName = membership.citizenName;
          const handleName = membership.handleName;
          const organizations: string[] = [];


          memberships
            .filter(r => r.personnelId === membership.personnelId)
            .filter(r => r.organizationId !== null)
              .forEach(r => {
              organizations.push(r.organizationId!);
            });

          res.setHeader('x-org-manager-personnel-id', personnelId!);
          if (citizenRecord !== null) {
            res.setHeader('x-org-manager-citizen-record', citizenRecord);
          }
          if (citizenName !== null) {
            res.setHeader('x-org-manager-citizen-name', citizenName);
          }
          if (handleName !== null) {
            res.setHeader('x-org-manager-handle-name', handleName);
          }
          res.setHeader('x-org-manager-organizations', organizations);
          res.status(200).json({ status: 200 });

        } else {
          res.status(403).json({ error: 'No membership records found' });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
      });
    })

    router.get('/debug/headers', (req, res) => {
      res.json(JSON.stringify(req.headers));
    });

    router.get('/debug/cookies', (req, res) => {
      res.json(JSON.stringify(req.cookies));
    });

    return router;
  }
}
