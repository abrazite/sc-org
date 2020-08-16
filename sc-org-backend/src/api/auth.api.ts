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
      const id: string = req.headers['x-vouch-idp-claims-id'] as string;
      const username: string = req.headers['x-vouch-idp-claims-username'] as string;
      const discriminator: string = req.headers['x-vouch-idp-claims-discriminator'] as string;
      const accesstoken: string = req.headers['x-vouch-idp-accesstoken'] as string;

      if (id === undefined || username === undefined || discriminator === undefined || accesstoken === undefined) {
        res.status(403).json({ error: 'Invalid credentials sent' });
        return
      }

      fetch(`${API_SERVER}/membership?username=${username}&discriminator=${discriminator}`)
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

    return router;
  }
}
