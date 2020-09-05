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
      try {
        // populated by vouch-proxy and discord claims
        const authorization: string = req.headers['authorization'] as string
        let organizationId: string | undefined = req.headers['x-org-manager-organization-id'] as string

        // todo(abrazite): add org-id as required header
        // - create discord bot user

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

          const memberships = records as viewParsers.Membership[];
          if (organizationId === undefined) {
            const membership = memberships.find(r => r.organizationId !== null);
            organizationId = membership ? membership.organizationId! : undefined;
          }

          if (organizationId === undefined) {
            throw new Error('Invalid or missing organization id');
          }

          if (proxyUsername && proxyDiscriminator && proxyOrganization) {
            if (proxyOrganization !== organizationId) {
              throw new Error('organization id must match authenticated organization id');
            }

            const membership = memberships.find(r => r.organizationId === proxyOrganization && r.proxy >= APISecurityLevel.OrgRecords);
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
            res.setHeader('x-org-manager-organization-id', organizationId!);
            res.setHeader('x-org-manager-organization-ids', organizations);
            res.setHeader('x-org-manager-get-security-level', membership.get);
            res.setHeader('x-org-manager-post-security-level', membership.post);
            res.setHeader('x-org-manager-put-security-level', membership.put);
            res.setHeader('x-org-manager-del-security-level', membership.del);
            res.setHeader('x-org-manager-proxy-security-level', membership.proxy);
            res.status(200).json({ status: 200 });

          } else {
            res.status(403).json({ error: 'No membership records found' });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(403).json({ status: 'error', message: err.message });
        });
      } catch(err) {
        console.error(err);
        res.status(403).json({ status: 'error', message: err.message });
      }
    });

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
      const organizationId: string = req.headers['x-org-manager-organization-id'] as string;

      if (req.body.issuerPersonnelId && req.body.issuerPersonnelId !== personnelId) {
        res.status(403).json({ error: 'issuer id must match authenticated personnel id' });
        return false;
      }

      if (req.body.organizationId && req.body.organizationId !== organizationId) {
        res.status(403).json({ error: 'organization id must match authenticated organization id' });
        return false;
      }

      if (req.query.organizationId && req.query.organizationId !== organizationId) {
        res.status(403).json({ error: 'organization id must match authenticated organization id' });
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
