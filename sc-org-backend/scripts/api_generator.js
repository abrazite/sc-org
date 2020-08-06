const fs = require('fs');

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

function snakeCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 1; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

class APIGenerator {
  static generateSwagger() {
    let template = '';
    template += APIGenerator.generateSwaggerPaths('active-duty');
    template += APIGenerator.generateSwaggerPaths('certification');
    template += APIGenerator.generateSwaggerPaths('discord');
    template += APIGenerator.generateSwaggerPaths('joined-organization');
    template += APIGenerator.generateSwaggerPaths('note');
    template += APIGenerator.generateSwaggerPaths('operation-attendence');
    template += APIGenerator.generateSwaggerPaths('rank-change');
    template += APIGenerator.generateSwaggerPaths('rsi-citizen');
    template += APIGenerator.generateSwaggerPaths('rsi-citizen-organization');
    template += APIGenerator.generateSwaggerPaths('rsi-organization');
    template += APIGenerator.generateSwaggerPaths('status');
    return template;
  }

  static generateSwaggerPaths(route) {
    const schema  = titleCase(route.split('-').join(' ')).split(' ').join('') + 'Record';

    const template = `
    /${route}:
      post:
        tags:
          - leadership
        requestBody:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/${schema}'
        responses:
          '200':
            description: search results matching criteria
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/CreateRecordResponse'
          '400':
            description: bad input parameter
          '500':
            description: server error
      get:
        tags:
          - personnel
        parameters:
          - in: query
            name: searchString
            description: pass an optional search string
            required: false
            schema:
              type: string
          - in: query
            name: page
            description: number of pages to skip for pagination
            schema:
              type: integer
              format: int32
              minimum: 0
          - in: query
            name: limit
            description: maximum number of records to return
            schema:
              type: integer
              format: int32
              minimum: 0
              maximum: 50
        responses:
          '200':
            description: search results matching criteria
            content:
              application/json:
                schema:
                  type: array
                  items:
                    $ref: '#/components/schemas/${schema}'
    /${route}/{id}:
      get:
        tags:
          - personnel
        parameters:
          - name: id
            in: path
            required: true
            schema:
              type: string
              format: uuid
              example: 2a6b26d3-0018-4b72-82e5-f5162392ffc1
        responses:
          '200':
            description: record
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/${schema}'
          '404':
            description: id not found
      put:
        tags:
          - admins
        parameters:
          - name: id
            in: path
            required: true
            schema:
              type: string
              format: uuid
              example: 2a6b26d3-0018-4b72-82e5-f5162392ffc1
        requestBody:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/${schema}'
        responses:
          '200':
            description: object updated
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/CreateRecordResponse'
          '400':
            description: bad input parameter
          '500':
            description: server error
      delete:
        tags:
          - admins
        parameters:
          - name: id
            in: path
            required: true
            schema:
              type: string
              format: uuid
              example: 2a6b26d3-0018-4b72-82e5-f5162392ffc1
        responses:
          '200':
            description: record deleted
          '404':
            description: id not found
`;
    return template;
  }

  static generateAllAPIEndpoints() {
    let commonFields = ['id', 'date', 'personnel_id', 'issuer_personnel_id'];
    let rsiCommonFields = ['id', 'date', 'personnel_id'];

    let template = '';
    template += APIGenerator.generateAPIEndpoints('active-duty', [...commonFields, 'description']);
    template += APIGenerator.generateAPIEndpoints('certification', [...commonFields, 'certification_id']);
    template += APIGenerator.generateAPIEndpoints('discord', [...commonFields, 'discord_id', 'username', 'discriminator']);
    template += APIGenerator.generateAPIEndpoints('joined-organization', [...commonFields, 'organization_id', 'recruited_by_personnel_id']);
    template += APIGenerator.generateAPIEndpoints('note', [...commonFields, 'note']);
    template += APIGenerator.generateAPIEndpoints('operation-attendence', [...commonFields, 'name']);
    template += APIGenerator.generateAPIEndpoints('rank-change', [...commonFields, 'rank_id']);
    template += APIGenerator.generateAPIEndpoints('rsi-citizen', [
      ...rsiCommonFields,
      'citizen_record',
      'citizen_name',
      'handle_name',
      'enlisted_rank',
      'enlisted',
      'location',
      'fluency',
      'website',
      'biography',
    ]);
    template += APIGenerator.generateAPIEndpoints('rsi-citizen-organization', [...rsiCommonFields, 'organization_id', 'main', 'rank']);
    template += APIGenerator.generateAPIEndpoints('rsi-organization', [
      'id', 
      'date',
      'organization_id',
      'name',
      'sid',
      'member_count',
      'archetype',
      'primary_activity',
      'secondary_activity',
      'commitment',
      'primary_language',
      'recruiting',
      'role_play',
      'exclusive',
    ]);
    template += APIGenerator.generateAPIEndpoints('status', [...commonFields, 'status_id']);

    return template;
  }  

  static generateAPIEndpoints(route, mysqlFields) {
    const parser  = titleCase(route.split('-').join(' ')).split(' ').join('') + 'Parser';
    const mysqlTable = route.split('-').join('_');

    const insertFieldNames = mysqlFields.join(', ');
    const insertFieldParams = mysqlFields.map(p => '?').join(', ');
    const updateSetFields = mysqlFields.map(p => p + '=?').join(', ');

    let template = `

    router.post('/${route}', (req, res) => {
      const record = parsers.${parser}.fromCreateRequest(req.body);
      connection.query(
        'INSERT INTO ${mysqlTable} (${insertFieldNames}) VALUES (${insertFieldParams})',
        parsers.${parser}.toMySql(record),
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

    router.get('/${route}', (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      connection.query(
        'SELECT ${insertFieldNames} FROM ${mysqlTable} LIMIT ? OFFSET ?',
        [limit, limit * page],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else {
            res.status(200).json(results!.map((r: any) => parsers.${parser}.fromMySql(r)));
          }
        }
      )
    });

    router.get('/${route}/:id', (req, res) => {
      connection.query(
        'SELECT ${insertFieldNames} FROM ${mysqlTable} WHERE id=?',
        [parsers.toBinaryUUID(req.params.id)],
        (err: mysql.MysqlError | null, results?: any) => {
          if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
          } else if (results && results.length > 0) {
            res.status(200).json(results!.map((r: any) => parsers.${parser}.fromMySql(r)));
          } else {
            res.status(404).json({ status: 'error' });
          }
        }
      )
    });

    router.put('/${route}/:id', (req, res) => {
      const record = parsers.${parser}.fromCreateRequest(req.body);
      if (record.id !== req.params.id) {
        throw new Error('id mistmatch');
      }
      connection.query(
        'UPDATE ${mysqlTable} SET ${updateSetFields} WHERE id=? LIMIT 1',
        [...parsers.${parser}.toMySql(record), parsers.toBinaryUUID(record.id)],
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

    router.delete('/${route}/:id', (req, res) => {
      connection.query(
        'DELETE FROM ${mysqlTable} WHERE id=? LIMIT 1',
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

`;
    return template;
  }

  static generateAllParsers() {
    let commonFields = ['id', 'date', 'personnel_id', 'issuer_personnel_id'];
    let commonFieldTypes = ['uuid', 'Date', 'uuid', 'uuid'];
    let commonFieldRequired = [false, false, true, true];

    let rsiCommonFields = ['id', 'date', 'personnel_id'];
    let rsiCommonFieldTypes = ['uuid', 'Date', 'uuid'];
    let rsiCommonFieldRequired = [false, false, true];

    let template = '';
    template += APIGenerator.generateParser('active-duty', [...commonFields, 'description'], [...commonFieldTypes, 'string'], [...commonFieldRequired, false]);
    template += APIGenerator.generateParser('certification', [...commonFields, 'certification_id'], [...commonFieldTypes, 'uuid'], [...commonFieldRequired, true]);
    template += APIGenerator.generateParser('discord', [...commonFields, 'discord_id', 'username', 'discriminator'], [...commonFieldTypes, 'string', 'string', 'number'], [...commonFieldRequired, true, true, true]);
    template += APIGenerator.generateParser('joined-organization', [...commonFields, 'organization_id', 'recruited_by_personnel_id'], [...commonFieldTypes, 'uuid', 'uuid'], [...commonFieldRequired, true, false]);
    template += APIGenerator.generateParser('note', [...commonFields, 'note'], [...commonFieldTypes, 'string'], [...commonFieldRequired, true]);
    template += APIGenerator.generateParser('operation-attendence', [...commonFields, 'name'], [...commonFieldTypes, 'string'], [...commonFieldRequired, false]);
    template += APIGenerator.generateParser('rank-change', [...commonFields, 'rank_id'], [...commonFieldTypes, 'uuid'], [...commonFieldRequired, true]);
    template += APIGenerator.generateParser('rsi-citizen', [
      ...rsiCommonFields,
      'citizen_record',
      'citizen_name',
      'handle_name',
      'enlisted_rank',
      'enlisted',
      'location',
      'fluency',
      'website',
      'biography',
    ], [
      ...rsiCommonFieldTypes,
      'number',
      'string',
      'string',
      'string',
      'Date',
      'string',
      'string',
      'string',
      'string',
    ], [
      ...rsiCommonFieldRequired,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    template += APIGenerator.generateParser('rsi-citizen-organization', [...rsiCommonFields, 'organization_id', 'main', 'rank'], [...commonFieldTypes, 'uuid', 'boolean', 'string'], [...commonFieldRequired, true, true, false]);
    template += APIGenerator.generateParser('rsi-organization', [
      'id', 
      'date',
      'organization_id',
      'name',
      'sid',
      'member_count',
      'archetype',
      'primary_activity',
      'secondary_activity',
      'commitment',
      'primary_language',
      'recruiting',
      'role_play',
      'exclusive',
    ], [
      'uuid',
      'Date',
      'uuid',
      'string',
      'string',
      'number',
      'string',
      'string',
      'string',
      'string',
      'string',
      'boolean',
      'boolean',
      'boolean',
    ], [
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    template += APIGenerator.generateParser('status', [...commonFields, 'status_id'], [...commonFieldTypes, 'uuid'], [...commonFieldRequired, false]);

    return template;
  }

  static generateParser(route, mysqlFields, mysqlFieldTypes, mysqlFieldRequired) {
    const interfaceTag  = titleCase(route.split('-').join(' ')).split(' ').join('');
    const parser  = titleCase(route.split('-').join(' ')).split(' ').join('') + 'Parser';
    const jsonNames = mysqlFields.map(s => snakeCase(s.split('_').join(' ')).split(' ').join(''));

    let template = `
export interface ${interfaceTag} {
`;
    jsonNames.forEach((e, i) => {
      template += `  ${e}: ${mysqlFieldTypes[i] === 'uuid' ? 'string | null' : mysqlFieldTypes[i] + ' | null'};
`;
    });
    template += '}';

    template += `

export class ${parser} {
  static fromCreateRequest(json: any): ${interfaceTag} {
`;
    jsonNames.filter((e, i) => mysqlFieldRequired[i]).forEach((e, i) => {
      template += `    if (json.${e} === null) {
      throw new Error('missing required ${e}');
    }
`;
    });
    
    template += `      const record = {
        id: json.id ? json.id : uuidv4(),
        date: json.date ? new Date(Date.parse(json.date)) : new Date(),
`;
    jsonNames.forEach((e, i) => {
      if (e !== 'id' && e !== 'date') {
        if (mysqlFieldTypes[i] === 'Date') {
          template += `        ${e}: json.${e} ? new Date(Date.parse(json.${e})) : null,
`;
        } else {
          template += `        ${e}: json.${e},
`;      
        }
      }
    });
    template += `      }
      return record;
    }
    
    static toMySql(record: ${interfaceTag}): any {
      const mysql = [
`
    jsonNames.forEach((e, i) => {
      if (mysqlFieldTypes[i] === 'uuid') {
        template += `        toBinaryUUID(record.${e}),
`;  
      } else {
        template += `        record.${e},
`;
      }
    });
    template += `      ];
      return mysql;
    }
    
    static fromMySql(mysql: any): ${interfaceTag} {
      const record = {
`;
    jsonNames.forEach((e, i) => {
      if (mysqlFieldTypes[i] === 'Date') {
        template += `        ${e}: new Date(Date.parse(mysql.${mysqlFields[i]})),
`;  
      } else if (mysqlFieldTypes[i] === 'uuid') {
        template += `        ${e}: fromBinaryUUID(mysql.${mysqlFields[i]}),
`;  
      } else {
        template += `        ${e}: mysql.${e},
`;
      }
    });

    template += `      };
      return record;
    }
  }
`;
    return template;
  }
}


fs.writeFileSync('out.api.yaml', APIGenerator.generateSwagger());
fs.writeFileSync('out.router.js', APIGenerator.generateAllAPIEndpoints());
fs.writeFileSync('out.parsers.js', APIGenerator.generateAllParsers());