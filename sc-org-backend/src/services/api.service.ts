import express from 'express';
import * as http from 'http';
import * as net from 'net';
import * as core from 'express-serve-static-core';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { environment } from '../environments/environment';
import { OrgManagerAPI } from '../api/org-manager.api';
import { OrgManagerViewsAPI } from '../api/org-manager-views.api';
import { RSICitizenAPI } from '../api/rsi-citizen.api';
import { DatabaseService } from './database.service';
import { AuthAPI } from '../api/auth.api';

export class APIService {
  public readonly app: core.Express;
  public readonly server: http.Server;

  constructor(databaseService: DatabaseService) {
    const authAPI = new AuthAPI();
    const orgManagerAPI = new OrgManagerAPI(databaseService);
    const orgManagerViewsAPI = new OrgManagerViewsAPI(databaseService);

    this.app = express();
    this.app.use(cors());

    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    const swaggerDocument = YAML.load('./assets/org-manager.space-api-1.0.0-swagger.yaml');
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    this.app.use(environment.apiPath, authAPI.createRouter());
    this.app.use(environment.apiPath, orgManagerAPI.createRouter());
    this.app.use(environment.apiPath, orgManagerViewsAPI.createRouter());

    this.app.use(`${environment.apiPath}/rsi/citizen`, RSICitizenAPI.createRouter());
    this.server = this.app.listen(environment.apiPort, () => {
      const host = (this.server.address() as net.AddressInfo).address;
      const port = (this.server.address() as net.AddressInfo).port;
      console.log(`listening at http://${host}:${port}`);
    });
  }
}