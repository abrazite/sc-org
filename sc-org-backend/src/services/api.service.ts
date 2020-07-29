import express from 'express';
import * as http from 'http';
import * as net from 'net';
import * as core from 'express-serve-static-core';
import cors from 'cors';

import { RSICitizenAPI } from '../api/rsi-citizen.api';

export class APIService {
  public readonly app: core.Express;
  public readonly server: http.Server;

  constructor() {
    this.app = express();
    this.app.use(cors());

    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    this.app.use('/rsi/citizen', RSICitizenAPI.createRouter());
    this.server = this.app.listen(8081, () => {
      const host = (this.server.address() as net.AddressInfo).address;
      const port = (this.server.address() as net.AddressInfo).port;
      console.log(`listening at http://${host}:${port}`);
    });
  }
}