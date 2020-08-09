const fs = require('fs');

// todo: convert this file to ts and import environment.ts
const environment = {
  apiPort: 8081,
};

class CodeGenerator {
  constructor() {
    this.apiDefinitions = new APIDefinitions();
    this.definitions = this.apiDefinitions.createDefinitions();

    this.swaggerGenerator = new SwaggerGenerator(this.definitions);
    this.apiEndpointGenerator = new APIEndpointGenerator(this.definitions);
    this.parserGenerator = new ParserGenerator(this.definitions);
  }

  generateCode() {
    const swagger = this.swaggerGenerator.fromDefinitions();
    const apiEndpoints = this.apiEndpointGenerator.fromDefinitions();
    const parsers = this.parserGenerator.fromDefinitions();

    fs.writeFileSync('./src/assets/org-manager.space-api-1.0.0-swagger.yaml', swagger);
    fs.writeFileSync('./src/api/org-manager.api.ts', apiEndpoints);
    fs.writeFileSync('./src/api/parsers.ts',parsers);
  }
}

class APIDefinitions {
  createDefinitions() {
    const toJsonTypeMap = {
      'boolean': 'boolean',
      'Date': 'Date',
      'int': 'number',
      'longtext': 'string',
      'string-16': 'string',
      'string-32': 'string',
      'string-64': 'string',
      'string-128': 'string',
      'string-256': 'string',
      'string-512': 'string',
      'uuid': 'string',
    };
  
    const toMysqlTypeMap = {
      'boolean': 'BOOLEAN',
      'date': 'DATE',
      'int': 'INT',
      'longtext': 'LONGTEXT',
      'string-16': 'VARCHAR(16)',
      'string-32': 'VARCHAR(32)',
      'string-64': 'VARCHAR(64)',
      'string-128': 'VARCHAR(128)',
      'string-256': 'VARCHAR(256)',
      'string-512': 'VARCHAR(512)',
      'uuid': 'BINARY(16)',
    };

    let commonFields = ['id', 'date', 'organization_id', 'personnel_id', 'issuer_personnel_id'];
    let commonFieldTypes = ['uuid', 'Date', 'uuid', 'uuid', 'uuid'];
    let commonFieldRequired = [false, false, true, true, true];

    let rsiCommonFields = ['id', 'date', 'personnel_id'];
    let rsiCommonFieldTypes = ['uuid', 'Date', 'uuid'];
    let rsiCommonFieldRequired = [false, false, true];

    const definitions = [{
        route: 'active-duty',
        mysqlFields: [...commonFields, 'description'],
        fieldTypes: [...commonFieldTypes, 'string-128'],
        mysqlCreateFieldRequired: [...commonFieldRequired, false]
      }, {
        route: 'certification',
        mysqlFields: [...commonFields, 'certification_id'],
        fieldTypes: [...commonFieldTypes, 'uuid'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true]
      }, {
        route: 'discord',
        mysqlFields: [...commonFields, 'username', 'discriminator'],
        fieldTypes: [...commonFieldTypes, 'string-128', 'int'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true, true, true]
      }, {
        route: 'joined-organization',
        mysqlFields: [...commonFields, 'joined_organization_id', 'recruited_by_personnel_id'],
        fieldTypes: [...commonFieldTypes, 'uuid', 'uuid'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true, false]
      }, {
        route: 'left-organization',
        mysqlFields: [...commonFields, 'left_organization_id'],
        fieldTypes: [...commonFieldTypes, 'uuid'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true]
      }, {
        route: 'note',
        mysqlFields: [...commonFields, 'note'],
        fieldTypes: [...commonFieldTypes, 'longtext'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true]
      }, {
        route: 'operation-attendence',
        mysqlFields: [...commonFields, 'name'],
        fieldTypes: [...commonFieldTypes, 'string-128'],
        mysqlCreateFieldRequired: [...commonFieldRequired, false]
      }, {
        route: 'rank-change',
        mysqlFields: [...commonFields, 'rank_id'],
        fieldTypes: [...commonFieldTypes, 'uuid'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true]
      }, {
        route: 'status',
        mysqlFields: [...commonFields, 'status'],
        fieldTypes: [...commonFieldTypes, 'string-64'],
        mysqlCreateFieldRequired: [...commonFieldRequired, true]
      }, {
        route: 'rsi-citizen',
        mysqlFields: [
          ...rsiCommonFields,
          'citizen_record',
          'citizen_name',
          'handle_name',
          'enlisted_rank',
          'enlisted_date',
          'location',
          'fluency',
          'website',
          'biography',
        ],
        fieldTypes: [
          ...rsiCommonFieldTypes,
          'number',
          'string-64',
          'string-64',
          'string-64',
          'Date',
          'string-64',
          'string-64',
          'string-512',
          'longtext',
        ],
        mysqlCreateFieldRequired: [
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
        ]
      }, {
        route: 'rsi-citizen-organization',
        mysqlFields: [...rsiCommonFields, 'organization_id', 'main'],
        fieldTypes: [...rsiCommonFieldTypes, 'uuid', 'boolean'],
        mysqlCreateFieldRequired: [...rsiCommonFieldRequired, true, true, false]
      }, {
        route: 'rsi-organization',
        mysqlFields: [
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
        ],
        fieldTypes: [
          'uuid',
          'Date',
          'uuid',
          'string-64',
          'string-32',
          'number',
          'string-64',
          'string-64',
          'string-64',
          'string-64',
          'string-64',
          'boolean',
          'boolean',
          'boolean',
        ],
        mysqlCreateFieldRequired: [
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
        ]
      }, {
        route: 'branches',
        mysqlFields: ['id', 'organization_id', 'abbreviation', 'branch'],
        fieldTypes: ['uuid', 'uuid', 'string-16', 'string-64'],
        mysqlCreateFieldRequired: [false, true, true, false]
      }, {
        route: 'grades',
        mysqlFields: ['id', 'organization_id', 'abbreviation', 'grade'],
        fieldTypes: ['uuid', 'uuid', 'string-16', 'string-64'],
        mysqlCreateFieldRequired: [false, true, true, false]
      }, {
        route: 'ranks',
        mysqlFields: ['id', 'organization_id', 'branch_id', 'grade_id', 'abbreviation', 'name'],
        fieldTypes: ['uuid', 'uuid', 'uuid', 'uuid', 'string-16', 'string-64'],
        mysqlCreateFieldRequired: [false, true, false, false, true, false]
      }, {
        route: 'certifications',
        mysqlFields: ['id', 'organization_id', 'branch_id', 'abbreviation', 'name'],
        fieldTypes: ['uuid', 'uuid', 'uuid', 'string-16', 'string-64'],
        mysqlCreateFieldRequired: [false, true, false, true, false]
      }
    ];

    definitions.forEach(d => {
      d.schema  = APIDefinitions.titleCase(d.route.split('-').join(' ')).split(' ').join('') + 'Record';
      d.parser  = APIDefinitions.titleCase(d.route.split('-').join(' ')).split(' ').join('') + 'Parser';
      d.mysqlTable = d.route.split('-').join('_');
  
      d.insertFieldNames = d.mysqlFields.join(', ');
      d.insertFieldParams = d.mysqlFields.map(p => '?').join(', ');
      d.updateSetFields = d.mysqlFields.map(p => p + '=?').join(', ');

      d.interfaceTag  = APIDefinitions.titleCase(d.route.split('-').join(' ')).split(' ').join('');
      d.parser  = APIDefinitions.titleCase(d.route.split('-').join(' ')).split(' ').join('') + 'Parser';

      d.jsonNames = d.mysqlFields.map(s => APIDefinitions.snakeCase(s.split('_').join(' ')).split(' ').join(''));
      d.jsonFieldTypes = d.fieldTypes.map(t => toJsonTypeMap[t]);
      d.mysqlFieldTypes = d.fieldTypes.map(t => toMysqlTypeMap[t]);
    });

    return definitions;
  };

  static titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }
  
  static snakeCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 1; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }
}

class Generator {
  fromDefinitions(definitions) { return '' };
  fromDefinition(definition) { return '' };
}

class SwaggerGenerator extends Generator {
  constructor(definitions) {
   super();
   this.definitions = definitions;
  }

  fromDefinitions() {
    const template = this.header + '\r' + 
      this.definitions.map(d => this.fromDefinition(d)).join('\r') + '\r' +
      this.footer;
    return template;
  }

  get header() {
    const str = `
openapi: 3.0.0
servers:
  - description: Live
    url: https://api.org-manager.space/1.0.0
  - description: Dev
    url: http://localhost:${environment.apiPort}/api/1.0.0
  - description: SwaggerHub API Auto Mocking
    url: https://virtserver.swaggerhub.com/org-manager.space/api/1.0.0

info:
  description: membership managment api
  version: 1.0.0rc0
  title: org-manager.space API
  contact:
    email: abrazite@protonmail.com
  license:
    name: Apache 2.0
    url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
tags:
  - name: admins
    description: Secured Admin-only calls
  - name: leadership
    description: Ability to manage membership
  - name: personnel
    description: Operations available to regular personnel
paths:    
`;
    return str;
  }

  fromDefinition(definition) {
    const template = `
  /${definition.route}:
    post:
      tags:
        - leadership
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/${definition.schema}'
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
                  $ref: '#/components/schemas/${definition.schema}'
  /${definition.route}/{id}:
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
                $ref: '#/components/schemas/${definition.schema}'
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
              $ref: '#/components/schemas/${definition.schema}'
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

  get footer() {
    return `
components:
  schemas:
    ActiveDutyRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        description:
          type: string
          example: 'Org meeting'
    CertificationRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        certificationId:
          type: string
          format: uuid
          example: 89f251f7-77cf-40d7-b928-44e36c8763bf          
    DiscordRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        discordId:
          type: string
          example: ''
        username:
          type: string
          example: 'abrazite'          
        discriminator:
          type: number
          example: 1234      
    JoinedOrganizationRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        joinedOrganizationId:
          type: string
          format: uuid
          example: 22f1dd6d-4efe-4fff-840a-a6e765a10353
        recruitedByPersonnelId:
          type: string
          format: uuid
          example: ae6382ab-f346-4133-9d75-56b6c403b1ab
    NoteRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        note:
          type: string
          example: 'This personnel has interest in FPS'
    OperationAttendenceRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        name:
          type: string
          example: 'Blizzard Storm Box Delivery'
    RankChangeRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        rankId:
          type: string
          format: uuid
          example: 459ce181-6ae8-4a18-ac68-cf46dde69beb
    RsiCitizenRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        citizenRecord:
          type: number
          example: 123456
        citizenName:
          type: string
          example: 'abrazite'
        handleName:
          type: string
          example: 'abrazite'
        enlistedRank:
          type: string
          example: 'abrazite'
        enlistedDate:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        location:
          type: string
          example: 'United States'
        fluency:
          type: string
          example: 'English'
        website:
          type: string
          example: 'org-manager.space'
        biography:
          type: string
          example: 'Flys ships in the verse'
    RsiOrganizationRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        name:
          type: string
          example: 'Interstellar Management Corps'
        sid:
          type: string
          example: 'THEIMC'
        memberCount:
          type: number
          example: 292
        archetype:
          type: string
          example: 'Organization'
        primaryActivity:
          type: string
          example: 'Freelancing'
        secondaryActivity:
          type: string
          example: 'Security'
        commitment:
          type: string
          example: 'Regular'
        primaryLanguage:
          type: string
          example: 'English'
        recruiting:
          type: boolean
          example: true
        rolePlay:
          type: boolean
          example: true
        exclusive:
          type: boolean
          example: true
    RsiCitizenOrganizationRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        main:
          type: boolean
          example: true
        rank:
          type: string
          example: 'Enlisted'
    StatusRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: ed159c6d-bfec-46e6-9092-0ec5acd96ced
        date:
          type: string
          format: date-time
          example: '2016-08-29T09:12:33.001Z'
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        personnelId:
          type: string
          format: uuid
          example: 1d9a97a1-9775-4f2a-ad32-8cb78c1961c3
        issuerPersonnelId:
          type: string
          format: uuid
          example: 32bd75e6-731e-469f-b79d-bcfb445b4b84
        statusId:
          type: string
          format: uuid
          example: a3609360-b3d9-4da4-ad2f-070ce997dd55
    BranchesRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: b3cc20d5-b8ba-45c4-b7be-d5158c034d73
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        abbreviation:
          type: string
          example: 'HJ'
        branch:
          type: string
          example: 'Helljumpers'
    GradesRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: 9e063482-423e-4912-9445-087d8796a221
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        abbreviation:
          type: string
          example: 'E1'
        grade:
          type: string
          example: 'Recruit'
    RanksRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: 4d69cad7-5316-4ce0-bccc-27710589f2cb
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        branch_id:
          type: string
          format: uuid
          example: da7c67e4-7afe-4b0c-91d9-cbef54a62eea
        grade_id:
          type: string
          format: uuid
          example: f9b575ff-40ff-4fed-bfae-0e25f8a5c864
        abbreviation:
          type: string
          example: 'CDR'
        name:
          type: string
          example: 'Commander'
    CertificationsRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: fd0265af-b083-44ce-8133-2c274a41691b
        organizationId:
          type: string
          format: uuid
          example: ef6ef62e-ad59-427b-8365-4bd7a522c7c2
        branch_id:
          type: string
          format: uuid
          example: da7c67e4-7afe-4b0c-91d9-cbef54a62eea
        abbreviation:
          type: string
          example: 'BG'
        name:
          type: string
          example: 'Basic Ground'                    
    CreateRecordResponse:
      type: object
      properties:
        status:
          type: string
          example: 'ok'
        id:
          type: string
          format: uuid
          example: d290f1ee-6c54-4b01-90e6-d701748f0851
    Personnel:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: d290f1ee-6c54-4b01-90e6-d701748f0851
        activeDutyRecords:
          type: array
          items:
            $ref: '#/components/schemas/ActiveDutyRecord'
        certificationRecords:
          type: array
          items:
            $ref: '#/components/schemas/CertificationRecord'
        discordRecords:
          type: array
          items:
            $ref: '#/components/schemas/DiscordRecord'
        joinedOrganizationRecords:
          type: array
          items:
            $ref: '#/components/schemas/JoinedOrganizationRecord'
        noteRecords:
          type: array
          items:
            $ref: '#/components/schemas/NoteRecord'
        operationAttendenceRecords:
          type: array
          items:
            $ref: '#/components/schemas/OperationAttendenceRecord'
        rankChangeRecords:
          type: array
          items:
            $ref: '#/components/schemas/RankChangeRecord'
        rsiCitizenRecords:
          type: array
          items:
            $ref: '#/components/schemas/RsiCitizenRecord'
        rsiOrganizationRecords:
          type: array
          items:
            $ref: '#/components/schemas/RsiOrganizationRecord'
        statusRecords:
          type: array
          items:
            $ref: '#/components/schemas/StatusRecord'
    `;
  }
}

class APIEndpointGenerator extends Generator {
  constructor(definitions) {
   super();
   this.definitions = definitions;
  }

  fromDefinitions() {
    const template = this.header + '\r' + 
      this.definitions.map(d => this.fromDefinition(d)).join('\r') + '\r' +
      this.footer;
    return template;
  }

  get header() {
    return `// Auto generated
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

    `;
  }

  fromDefinition(definition) {
    let template = `

    router.post('/${definition.route}', (req, res, next) => {
      try {
        const record = parsers.${definition.parser}.fromCreateRequest(req.body);
        this.databaseService.connection.query(
          'INSERT INTO ${definition.mysqlTable} (${definition.insertFieldNames}) VALUES (${definition.insertFieldParams})',
          parsers.${definition.parser}.toMySql(record),
          (err: mysql.MysqlError | null) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              console.log('POST ${definition.route} ' + record.id);
              res.status(200).json({ status: 'ok', id: record.id });
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/${definition.route}', (req, res, next) => {
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
          'SELECT ${definition.insertFieldNames} FROM ${definition.mysqlTable} ' + filterStr + ' LIMIT ? OFFSET ?',
          [...filterParams, limit, limit * page],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else {
              res.status(200).json(results!.map((r: any) => parsers.${definition.parser}.fromMySql(r)));
            }
          }
        )
      } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });

    router.get('/${definition.route}/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'SELECT ${definition.insertFieldNames} FROM ${definition.mysqlTable} WHERE id=?',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.length > 0) {
              res.status(200).json(results!.map((r: any) => parsers.${definition.parser}.fromMySql(r)));
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

    router.put('/${definition.route}/:id', (req, res, next) => {
      try {
        const record = parsers.${definition.parser}.fromCreateRequest(req.body);
        if (record.id !== req.params.id) {
          throw new Error('id mistmatch');
        }
        this.databaseService.connection.query(
          'UPDATE ${definition.mysqlTable} SET ${definition.updateSetFields} WHERE id=? LIMIT 1',
          [...parsers.${definition.parser}.toMySql(record), parsers.toBinaryUUID(record.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('PUT ${definition.route} ' + record.id);
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

    router.delete('/${definition.route}/:id', (req, res, next) => {
      try {
        this.databaseService.connection.query(
          'DELETE FROM ${definition.mysqlTable} WHERE id=? LIMIT 1',
          [parsers.toBinaryUUID(req.params.id)],
          (err: mysql.MysqlError | null, results?: any) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 'error', message: err.message });
            } else if (results && results.affectedRows === 1) {
              console.log('DEL ${definition.route} ' + req.params.id);
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

`;
    return template;
  }

  get footer() {
    return `
    return router;
  }
}    
    `;
  }
}

class ParserGenerator extends Generator {
  constructor(definitions) {
   super();
   this.definitions = definitions;
  }

  fromDefinitions() {
    const template = this.header + '\r' + 
      this.definitions.map(d => this.fromDefinition(d)).join('\r') + '\r' +
      this.footer;
    return template;
  }

  get header() {
    return `// Auto generated
import { v4 as uuidv4 } from 'uuid';

export function fromBinaryUUID(buf: Buffer | null): string | null {
  if (buf === null || buf === undefined) {
    return null;
  }

  return [
    buf.toString("hex", 4, 8),
    buf.toString("hex", 2, 4),
    buf.toString("hex", 0, 2),
    buf.toString("hex", 8, 10),
    buf.toString("hex", 10, 16),
  ].join("-");
}

export function toBinaryUUID(uuid: string | null): Buffer | null {
  if (uuid === null || uuid === undefined) {
    return null;
  }

  const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
  return Buffer.concat([
    buf.slice(6, 8),
    buf.slice(4, 6),
    buf.slice(0, 4),
    buf.slice(8, 16),
  ]);
}
    `;
  }

  fromDefinition(definition) {
    let template = `
export interface ${definition.interfaceTag} {
`;
    definition.jsonNames.forEach((e, i) => {
      template += `  ${e}: ${definition.jsonFieldTypes[i]} | null;
`;
    });
    template += '}';

    template += `

export class ${definition.parser} {
  static fromCreateRequest(json: any): ${definition.interfaceTag} {
`;
    definition.jsonNames.filter((e, i) => definition.mysqlCreateFieldRequired[i]).forEach((e, i) => {
      template += `    if (json.${e} === null) {
      throw new Error('missing required ${e}');
    }
`;
    });
    
    template += '    const record = {\r';
    definition.jsonNames.forEach((e, i) => {
      if (e === 'id') {
        template += '      id: json.id ? json.id : uuidv4(),\r';
      } else if (e === 'date') {
        template += '      date: json.date ? new Date(Date.parse(json.date)) : new Date(),\r';
      } else {
        if (definition.fieldTypes[i] === 'Date') {
          template += `      ${e}: json.${e} ? new Date(Date.parse(json.${e})) : null,
`;
        } else {
          template += `      ${e}: json.${e},
`;      
        }
      }
    });
    template += `    }
    return record;
  }
    
  static toMySql(record: ${definition.interfaceTag}): any {
    const mysql = [
`
definition.jsonNames.forEach((e, i) => {
      if (definition.fieldTypes[i] === 'uuid') {
        template += `      toBinaryUUID(record.${e}),
`;  
      } else {
        template += `      record.${e},
`;
      }
    });
    template += `    ];
    return mysql;
  }
    
  static fromMySql(mysql: any): ${definition.interfaceTag} {
    const record = {
`;
    definition.jsonNames.forEach((e, i) => {
      if (definition.fieldTypes[i] === 'Date') {
        template += `      ${e}: new Date(Date.parse(mysql.${definition.mysqlFields[i]})),
`;  
      } else if (definition.fieldTypes[i] === 'uuid') {
        template += `      ${e}: fromBinaryUUID(mysql.${definition.mysqlFields[i]}),
`;  
      } else {
        template += `      ${e}: mysql.${e},
`;
      }
    });

    template += `    };
    return record;
  }
}
`;
    return template;
  }

  get footer() {
    return ``;
  }
}

const codeGenerator = new CodeGenerator();
codeGenerator.generateCode();