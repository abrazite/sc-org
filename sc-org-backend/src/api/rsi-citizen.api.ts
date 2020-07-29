import express from 'express';
import * as core from "express-serve-static-core";
import request from 'request';
import { parse, TextNode } from 'node-html-parser';

import { RSICitizenSchema } from '../models/rsi-citizen.model';

export class RSICitizenAPI {
  static createRouter(): core.Router {
    const router = express.Router();

    router.get('/:handle', (req, res) => {
      const handle = req.params.handle;
      request(`https://robertsspaceindustries.com/citizens/${handle}`, { json: false }, (err, resp, body) => {
        if (err) {
          res.status(500).send('could not find handle');
        }

        const html = (parse(body) as unknown) as HTMLElement;
        const record = RSICitizenAPI.htmlToCitizenRecord(html);

        if (record) {
          res.send(JSON.stringify(record));
        } else {
          res.status(500).send(body);
        }
      });
    });

    return router;
  }

  static htmlToCitizenRecord(document: HTMLElement): RSICitizenSchema | undefined {
    let labels: string[] = [];
    const values: string[] = [];
    
    document.querySelectorAll('.label').forEach(e => labels.push(e.innerHTML.toLocaleLowerCase()));
    document.querySelectorAll('.value').forEach(e => {
      const lines: string[] = [];
      e.childNodes.forEach(c => {
        if (c instanceof TextNode) {
          lines.push(c.text);
        }
      });
      values.push(lines.join('').trim());
    });

    const websiteIndex = labels.indexOf('website');
    if (websiteIndex >= 0) {
      labels = [
        ...labels.slice(0, websiteIndex),
        ...labels.slice(websiteIndex+1)
      ];
    }

    const handleIndex = labels.indexOf('handle name');
    if (handleIndex < 0) {
      console.error('could not find handle name')
      return;
    }
    labels = [
      ...labels.slice(0, handleIndex),
      'citizen name',
      labels[handleIndex],
      'enlisted rank',
      ...labels.slice(handleIndex + 1)
    ];

    let sidIndex = labels.indexOf('spectrum identification (sid)');
    if (sidIndex >= 0) {
      labels = [
        ...labels.slice(0, sidIndex),
        'main org name',
        ...labels.slice(sidIndex)
      ];
    }
    if (sidIndex < 0) {
      sidIndex = labels.findIndex(l => l.includes('&nbsp;'));
      if (sidIndex >= 0) {
        labels = [
          ...labels.slice(0, sidIndex),
          'main org name',
          ...labels.slice(sidIndex)
        ];
        values[labels.indexOf('main org name')] = 'REDACTED';
      }
    }

    if (values.length !== labels.length) {
      console.error('mapping error', values.length, labels.length);
      return;
    }

    const indices: { [key: string]: number } = {
      citizenRecord: labels.indexOf('uee citizen record'),
      citizenName: labels.indexOf('citizen name'),
      handleName: labels.indexOf('handle name'),
      enlistedRank: labels.indexOf('enlisted rank'),

      mainOrganizationName: labels.indexOf('main org name'),
      mainOrganizationSpectrumIdentification: labels.indexOf('spectrum identification (sid)'),
      mainOrganizationRank: labels.indexOf('organization rank'),

      enlisted: labels.indexOf('enlisted'),
      location:labels.indexOf('location'),
      fluency: labels.indexOf('fluency'),
      bio: labels.indexOf('bio')
    };

    if (values[indices.citizenRecord].indexOf('#') !== 0 || isNaN(parseInt(values[indices.citizenRecord].slice(1)))) {
      indices.citizenRecord = -1;
    }

    if (isNaN((new Date(values[indices.enlisted]).getDate()))) {
      indices.enlisted = -1;
    }

    return {
      citizenRecord: indices.citizenRecord >= 0 ? parseInt(values[indices.citizenRecord].slice(1)) : undefined,
      citizenName: indices.citizenName >= 0 ? values[indices.citizenName] : undefined,
      handleName: indices.handleName >= 0 ? values[indices.handleName] : undefined,
      enlistedRank: indices.enlistedRank >= 0 ? values[indices.enlistedRank] : undefined,

      mainOrganization: {
        name: indices.mainOrganizationName >= 0 ? values[indices.mainOrganizationName] : undefined,
        spectrumIdentification: indices.mainOrganizationSpectrumIdentification >= 0 ? values[indices.mainOrganizationSpectrumIdentification] : undefined,
        rank: indices.mainOrganizationRank >= 0 ? values[indices.mainOrganizationRank] : undefined
      },

      enlisted: indices.enlisted >= 0 ? new Date(values[indices.enlisted]) : undefined,
      location: indices.location >= 0 ? RSICitizenAPI.cleanString(values[indices.location]) : undefined,
      fluency: indices.fluency >= 0 ? RSICitizenAPI.cleanString(values[indices.fluency]) : undefined,
      bio: indices.bio >= 0 ? RSICitizenAPI.cleanString(values[indices.bio]) : undefined
    }
  }

  private static cleanString(str: string): string {
    return str.split('\n').map(e => e.trim()).join('\n').trim().split('\n,').join(',');
  }
}