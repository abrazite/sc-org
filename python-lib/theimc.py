import org_manager_api
import string

BRANCHES = [
    {'abr': 'BOD', 'name': 'Board of Directors'},
    {'abr': 'FC', 'name': 'Fleet Command'},
    {'abr': 'HJ', 'name': 'Helljumpers'},
    {'abr': 'J', 'name': 'Jaegers'},
    {'abr': 'SD', 'name': 'Stanton Dynamics'},
    {'abr': 'VA', 'name': 'Void Angels'},
]

GRADES = [
    {'abr': 'E1', 'name': 'Enlisted-1'},
    {'abr': 'E2', 'name': 'Enlisted-2'},
    {'abr': 'E3', 'name': 'Enlisted-3'},
    {'abr': 'E4', 'name': 'Enlisted-4'},
    {'abr': 'E5', 'name': 'Enlisted-5'},
    {'abr': 'E6', 'name': 'Enlisted-6'},
    {'abr': 'O1', 'name': 'Officer-1'},
    {'abr': 'O2', 'name': 'Officer-2'},
    {'abr': 'O3', 'name': 'Officer-3'},
    {'abr': 'O4', 'name': 'Officer-4'},
    {'abr': 'O5', 'name': 'Officer-5'},
    {'abr': 'O6', 'name': 'Officer-6'},

    {'abr': 'GS1', 'name': None},
    {'abr': 'GS2', 'name': None},
    {'abr': 'GS3', 'name': None},
    {'abr': 'GS4', 'name': None},
    {'abr': 'GS5', 'name': None},
    {'abr': 'GS6', 'name': None},
    {'abr': 'GS13', 'name': None},
    {'abr': 'GS14', 'name': None},
    {'abr': 'GS15', 'name': None},
]

RANKS = [
    {'branch': 'BOD', 'grade': 'O6', 'abr': 'DIR', 'name': "Director", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},

    {"branch": "HJ", "grade": "E1", "abr": "SR", 'name': "Starman Recruit", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E2", "abr": "SA", 'name': "Starman Apprentice", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E3", "abr": "SN", 'name': "Starman", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E4", "abr": "SPC", 'name': "Combat Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E4", "abr": "SO", 'name': "Space Warfare Operator", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E5", "abr": "SSPC-Z", 'name': "Senior Combat Specalist - Zulu", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E5", "abr": "CSO", 'name': "Chief Space Warfare Operator", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E5", "abr": "SSPC-E", 'name': "Senior Combat Specalist - Echo", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "E6", "abr": "MCSO", 'name': "Master Chief Space Warfare Operator", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "O1", "abr": "LTCDR", 'name': "Lieutenant Commander", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "O2", "abr": "CDR", 'name': "Commander", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "HJ", "grade": "O6", "abr": "DIR", 'name': "Director", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},

    {"branch": "VA", "grade": "GS1", "abr": "CM", 'name': "Crewman", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS6", "abr": "MC", 'name': "Master Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS2", "abr": "BM3", 'name': "Boatswain’s Mate - Petty Officer 3rd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS3", "abr": "BM2", 'name': "Boatswain’s Mate - Petty Officer 2nd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS4", "abr": "BM1", 'name': "Boatswain’s Mate - Petty Officer 1st Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS5", "abr": "BMC", 'name': "Boatswain’s Mate - Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS2", "abr": "QM3", 'name': "QuarterMaster - Petty Officer 3rd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS3", "abr": "QM2", 'name': "QuarterMaster - Petty Officer 2nd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS4", "abr": "QM1", 'name': "QuarterMaster - Petty Officer 1st Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS5", "abr": "QMC", 'name': "QuarterMaster - Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS2", "abr": "HM3", 'name': "Hospital Corpsman - Petty Officer 3rd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS3", "abr": "HM2", 'name': "Hospital Corpsman - Petty Officer 2nd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS4", "abr": "HM1", 'name': "Hospital Corpsman - Petty Officer 1st Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS5", "abr": "HMC", 'name': "Hospital Corpsman - Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS2", "abr": "EM3", 'name': "Engineering Mate - Petty Officer 3rd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS3", "abr": "EM2", 'name': "Engineering Mate - Petty Officer 2nd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS4", "abr": "EM1", 'name': "Engineering Mate - Petty Officer 1st Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS5", "abr": "EMC", 'name': "Engineering Mate - Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS2", "abr": "MA3", 'name': "Master-At-Arms - Petty Officer 3rd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS3", "abr": "MA2", 'name': "Master-At-Arms - Petty Officer 2nd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS4", "abr": "MA1", 'name': "Master-At-Arms - Petty Officer 1st Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS5", "abr": "MAC", 'name': "Master-At-Arms - Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS2", "abr": "CT3", 'name': "Communication Specialist - Petty Officer 3rd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS3", "abr": "CT2", 'name': "Communication Specialist - Petty Officer 2nd Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS4", "abr": "CT1", 'name': "Communication Specialist - Petty Officer 1st Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS5", "abr": "CTC", 'name': "Communication Specialist - Chief Petty Officer", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS13", "abr": "LT", 'name': "Lieutenant", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS14", "abr": "LTCDR", 'name': "Lieutenant Commander", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "VA", "grade": "GS15", "abr": "CDR", 'name': "Commander", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},

    {"branch": "SD", "grade": "GS1", "abr": "IN", 'name': "Intern", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS2", "abr": "JA", 'name': "Junior Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS3", "abr": "AS", 'name': "Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS4", "abr": "SA", 'name': "Senior Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS5", "abr": "AL", 'name': "Assistant Lead", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS5", "abr": "TL", 'name': "Team Lead", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS13", "abr": "MGR", 'name': "Manager", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS1", "abr": "CIN", 'name': "Commodity Management - Intern", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS2", "abr": "CJA", 'name': "Commodity Management - Junior Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS3", "abr": "CAS", 'name': "Commodity Management - Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS4", "abr": "CSA", 'name': "Commodity Management - Senior Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS5", "abr": "CAL", 'name': "Commodity Management - Assistant Lead", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS5", "abr": "CTL", 'name': "Commodity Management - Team Lead", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS13", "abr": "CMGR", 'name': "Commodity Management - Manager", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS1", "abr": "MIN", 'name': "Mineral Resources - Intern", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS2", "abr": "MJA", 'name': "Mineral Resources - Junior Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS3", "abr": "MAS", 'name': "Mineral Resources - Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS4", "abr": "MSA", 'name': "Mineral Resources - Senior Associate", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS5", "abr": "MAL", 'name': "Mineral Resources - Assistant Lead", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS5", "abr": "MTL", 'name': "Mineral Resources - Team Lead", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS13", "abr": "MMGR", 'name': "Mineral Resources - Manager", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},

    {"branch": "SD", "grade": "GS14", "abr": "DCMS", 'name': "Deputy Commissioner", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "SD", "grade": "GS15", "abr": "CMS", 'name': "Commissioner", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},

    {"branch": "J", "grade": "E1", "abr": "AR", 'name': "Airman Recruit", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E1", "abr": "AC", 'name': "Airman Cadet", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E2", "abr": "AM", 'name': "Airman", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E3", "abr": "AF", 'name': "Airman First Class", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E4", "abr": "CS", 'name': "Combat Control Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E4", "abr": "TS", 'name': "Tactical Air Control Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E4", "abr": "ES", 'name': "Electronic Warfare Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E5", "abr": "CS", 'name': "Chief Combat Control Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E5", "abr": "TS", 'name': "Chief Tactical Air Control Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E5", "abr": "ES", 'name': "Chief Electronic Warfare Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E6", "abr": "CS", 'name': "Master Combat Control Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E6", "abr": "TS", 'name': "Master Tactical Air Control Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "E6", "abr": "ES", 'name': "Master Electronic Warfare Specialist", "get": None, "post": None, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "O1", "abr": "LTCDR", 'name': "Lieutenant Commander", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
    {"branch": "J", "grade": "O2", "abr": "CDR", 'name': "Commander", "get": 3, "post": 3, "put": None, "del": None, "proxy": None},
]

CERTIFICATIONS = [
    {"branch": "HJ", "abr": "BG", "name": "Basic Ground"},
    {"branch": "HJ", "abr": "CQB", "name": "Close-Quarters Battle"},
    {"branch": "HJ", "abr": "HJ", "name": "Helljumper Qualification"},
    {"branch": "HJ", "abr": "AG", "name": "Advanced Ground Tactics"},
    {"branch": "HJ", "abr": "L", "name": "Leadership"},
    {"branch": "J", "abr": "F", "name": "Basic Flight"},
    {"branch": "VA", "abr": "TP", "name": "Transport"},
    {"branch": "SD", "abr": "TD", "name": "Trade"},
    {"branch": "HJ", "abr": "I-BG", "name": "Instructor - Basic Ground"},
    {"branch": "HJ", "abr": "I-CQB", "name": "Instructor - Close-Quarters Battle"},
    {"branch": "HJ", "abr": "I-HJ", "name": "Instructor - Helljumper Qualification"},
    {"branch": "HJ", "abr": "I-AG", "name": "Instructor - Advanced Ground Tactics"},
    {"branch": "J", "abr": "I-F", "name": "Instructor - Basic Flight"},
    {"branch": "VA", "abr": "I-TP", "name": "Instructor - Transport"},
    {"branch": "SD", "abr": "I-TD", "name": "Instructor - Trade"},
]


def create_org(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext):
    records = []
    create_branches(api, ctx, records)
    create_grades(api, ctx, records)
    create_ranks(api, ctx, records)
    create_certifications(api, ctx, records)
    print(records)


def sync_org(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext, members):
    records = []
    create_members(api, ctx, members, records)
    print(records)


def create_branches(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext, records):
    missing = []
    for branch in BRANCHES:
        if not api.find_branch_id(ctx, branch['name']):
            missing.append(branch)

    for branch in missing:
        records.append({
            'func': 'create_branches',
            'arg': branch['abr'],
            'id': api.create_branch(ctx, branch['abr'], branch['name'])
        })


def create_grades(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext, records):
    missing = []
    for grade in GRADES:
        if not api.find_grade_id(ctx, grade['abr']):
            missing.append(grade)

    for grade in missing:
        records.append({
            'func': 'create_grades',
            'arg': grade['abr'],
            'id': api.create_grade(ctx, grade['abr'], grade['name'])
        })


def create_ranks(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext, records):
    missing = []
    for rank in RANKS:
        if not api.find_rank_id(ctx, f"{rank['branch']}-{rank['grade']}-{rank['abr']}"):
            missing.append(rank)

    for rank in missing:
        record = api.create_rank(ctx, rank['abr'], rank['name'], rank['branch'], rank['grade'])
        records.append({
            'func': 'create_ranks',
            'arg': f"{rank['branch']}-{rank['grade']}-{rank['abr']}",
            'id': record
        })

        if rank['get'] or rank['post'] or rank['put'] or rank['del'] or rank['proxy']:
            records.append({
                'func': 'create_ranks_perms',
                'arg': f"{rank['branch']}-{rank['grade']}-{rank['abr']}",
                'id': api.create_permission(ctx, record['id'], rank['get'], rank['post'], rank['put'], rank['del'], rank['proxy'])
            })


def create_certifications(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext, records):
    missing = []
    for certification in CERTIFICATIONS:
        if not api.find_certification_id(ctx, certification['abr']):
            missing.append(certification)

    for certification in missing:
        records.append({
            'func': 'create_certifications',
            'arg': certification['abr'],
            'id': api.create_certification(ctx, certification['branch'], certification['abr'], certification['name'])
        })


def create_members(api: org_manager_api.OrgManagerAPI, ctx: org_manager_api.APIContext, members, records):
    all_personnel = api.personnel_summary_all(ctx)
    printable = set(string.printable)

    missing = []
    for personnel in members:
        username = ''.join(filter(lambda x: x in printable, personnel.name))
        found = False
        for existing in all_personnel:
            if existing['username'] == username and existing['discriminator'] == personnel.discriminator:
                found = True
        if not found:
            missing.append(personnel)

    branch_map = {
        'Board of Directors': 'BOD',
        # 'IMC Fleet Command': 'FC',
        'IMC Helljumper': 'HJ',
        'IMC Helljumper Command': 'HJ',
        'IMC Jaeger Command': 'J',
        'IMC Jaeger': 'J',
        'IMC Void Angel Command': 'VA',
        'IMC Void Angel': 'VA',
        'Stanton Dynamics Head Office': 'SD',
        'IMC Stanton Dynamics': 'SD',
    }

    cert_map = {
        'Basic Flight Certification': 'J-F',
        'Basic Trade Certification': 'SD-TD',
        'Ground Certification': 'HJ-BG',
        'Advanced Ground Certification': 'HJ-AG',
        'Transport Certification': 'VA-TP',
    }

    status_map = {
        'IMC Reserve': 'reserve',
        'Retired From IMC': 'retired',
        'Founder of the IMC': 'founder',
    }

    not_added = []
    for personnel in missing:
        username = ''.join(filter(lambda x: x in printable, personnel.name))
        display_name = ''.join(filter(lambda x: x in printable, personnel.display_name))
        discord_handle = f'{username}#{personnel.discriminator}'

        record = None
        for role in personnel.roles:
            if role.name in branch_map:
                branch = branch_map[role.name]

                if '[' in display_name and ']' in display_name:
                    split_1 = display_name.split(']')
                    split_2 = split_1[0].split('[')

                    tag = split_2[len(split_2) - 1].strip()
                    rank_str = f'{branch}-{tag}'
                    sc_handle_name = split_1[1].strip()

                    record = api.add_member(ctx, discord_handle, sc_handle_name, rank_str, None, personnel.joined_at)
                    records.append(record)
                    if not record:
                        not_added.append(personnel)
                else:
                    not_added.append(personnel)

        for role in personnel.roles:
            if record and role.name in cert_map:
                certification_str = cert_map[role.name]
                records.append(api.record_cert(ctx, record['id'], certification_str))

    for personnel in not_added:
        print('not: ' + personnel.display_name)
