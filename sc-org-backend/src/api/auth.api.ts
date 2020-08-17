import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as core from "express-serve-static-core";

import { environment } from '../environments/environment';

import { APIUtils } from './api-utils';
import * as viewParsers from './parsers-views';

const API_SERVER = `${environment.apiHost}${environment.apiPath}`;


export enum APISecurityLevel {
  None = 0,
  OwnRecords = 1,
  BranchRecords = 2,
  OrgRecords = 3
}

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
        user.username = res.username;
        user.discriminator = res.discriminator;
        user.id = res.id;
      })
      .then(() => fetch(`${API_SERVER}/membership?username=${user.username}&discriminator=${user.discriminator}`, {
        headers: {
          'authorization': req.headers['authorization']!,
          'x-org-manager-get-security-level': APISecurityLevel.OrgRecords.toString()
        }
      }))
      .then(APIUtils.checkStatusOrThrow)
      .then((records: Object[]) => {
        const proxyUsername = req.headers['x-proxy-username'];
        const proxyDiscriminator = req.headers['x-proxy-discriminator'];
        const proxyOrganization = req.headers['x-proxy-organization'];

        if (proxyUsername && proxyDiscriminator && proxyOrganization) {
          // todo(abrazite): lookup permissions from membership table
          // res.setHeader('x-org-manager-proxy-security-level', APISecurityLevel.OrgRecords);

          const memberships = records as viewParsers.Membership[];
          const membership = memberships.find(r => r.organizationId === proxyOrganization);
          if (!membership) {
            throw new Error(`Insufficient permissions to proxy ${proxyOrganization}`);
          }
          return fetch(`${API_SERVER}/membership?username=${proxyUsername}&discriminator=${proxyDiscriminator}`, {
            headers: {
              'x-org-manager-get-security-level': APISecurityLevel.OrgRecords.toString()
            }
          }).then(APIUtils.checkStatusOrThrow);
        } else if (proxyUsername || proxyDiscriminator || proxyOrganization) {
          throw new Error('For proxy a username, discriminator, and organization must be present');
        }

        return records;
      })
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
          res.setHeader('x-org-manager-get-security-level', APISecurityLevel.OrgRecords);
          res.setHeader('x-org-manager-post-security-level', APISecurityLevel.OrgRecords);
          res.setHeader('x-org-manager-put-security-level', APISecurityLevel.OrgRecords);
          res.setHeader('x-org-manager-del-security-level', APISecurityLevel.OrgRecords);
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

  static checkAuthHeaders(options?: {
    get?: APISecurityLevel,
    post?: APISecurityLevel,
    put?: APISecurityLevel,
    del?: APISecurityLevel
  }) : (req: core.Request, res: core.Response, next?: core.NextFunction) => boolean {
    return (req: core.Request, res: core.Response, next?: core.NextFunction) => {
      const personnelId: string = req.headers['x-org-manager-personnel-id'] as string;
      const organizations: string[] = req.headers['x-org-manager-organizations'] as string[];

      if (req.body.issuerPersonnelId && req.body.issuerPersonnelId !== personnelId) {
        res.status(403).json({ error: 'issuer id must match authenticated personnel id' });
        return false;
      }

      if (req.body.organizationId && !organizations.includes(req.body.organizationId)) {
        res.status(403).json({ error: 'organizationId not included in authorized organizations' });
        return false;
      }

      if (req.query.organizationId && !organizations.includes(req.query.organizationId as string)) {
        res.status(403).json({ error: 'organizationId not included in authorized organizations' });
        return false;
      }

      if (options && options.get) {
        const securityLevel = parseInt(req.headers['x-org-manager-get-security-level'] as string);
        if (isNaN(securityLevel) || securityLevel < options.get) {
          res.status(403).json({ error: 'insufficient get security level' });
          return false;
        }
      }

      if (options && options.post) {
        const securityLevel = parseInt(req.headers['x-org-manager-post-security-level'] as string);
        if (isNaN(securityLevel) || securityLevel < options.post) {
          res.status(403).json({ error: 'insufficient post security level' });
          return false;
        }
      }

      if (options && options.put) {
        const securityLevel = parseInt(req.headers['x-org-manager-put-security-level'] as string);
        if (isNaN(securityLevel) || securityLevel < options.put) {
          res.status(403).json({ error: 'insufficient put security level' });
          return false;
        }
      }

      if (options && options.del) {
        const securityLevel = parseInt(req.headers['x-org-manager-del-security-level'] as string);
        if (isNaN(securityLevel) || securityLevel < options.del) {
          res.status(403).json({ error: 'insufficient del security level' });
          return false;
        }
      }

      if (next) {
        next();
      }
      return true;
    };
  }
}
