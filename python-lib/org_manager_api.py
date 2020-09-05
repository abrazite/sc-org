import datetime
import requests
import json
import sys
import time
from typing import NewType, NamedTuple
import urllib.request
import uuid

import secrets


OrganizationId = NewType('OrganizationId', str)
PersonnelId = NewType('PersonnelId', str)
BranchId = NewType('BranchId', str)
RankId = NewType('RankId', str)
CertificationId = NewType('CertificationId', str)
NewRecordId = NewType('NewRecordId', str)
APIContext = NamedTuple('APIContext', [('id', str), ('username', str), ('discriminator', str)])


class OrgManagerAPI:
    def __init__(self, api_server: str, organization_id: OrganizationId):
        self.api_server = api_server
        self.organization_id = organization_id
        self.auth_state = uuid.uuid4()
        self.access_token = None
        self.token_type = None
        self.expires_in = None
        self.token_start_time = None
        self.api_get_token()

    def membership(self, ctx: APIContext, personnel_str: str):
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        if personnel_id:
            url = f'/membership?organizationId={self.organization_id}&personnelId={personnel_id}'
            results = self.api_get(ctx, url)
            if len(results) > 0:
                return results[0]

    def personnel_summary(self, ctx: APIContext, personnel_str: str):
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        if personnel_id:
            url = f'/personnel-summary?organizationId={self.organization_id}&personnelId={personnel_id}'
            results = self.api_get(ctx, url)
            if results and len(results) > 0:
                return results[0]

    def personnel_summary_all(self, ctx: APIContext):
        url = f'/personnel-summary?organizationId={self.organization_id}&limit=1000'  # todo(abrazite) add paging
        return self.api_get(ctx, url)

    def personnel(self, ctx: APIContext, personnel_str: str):
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        if personnel_id:
            url = f'/personnel/{personnel_id}?organizationId={self.organization_id}'
            return self.api_get(ctx, url)

    def branch(self, ctx: APIContext, branch_str: str):
        branch_id = self.find_branch_id(ctx, branch_str)
        if branch_id:
            url = f'/branches?organizationId={self.organization_id}&id={branch_id}'
            return self.api_get(ctx, url)

    def branches(self, ctx: APIContext, limit: int, page: int):
        url = f'/branches?organizationId={self.organization_id}&limit={limit}&page={page}'
        return self.api_get(ctx, url)

    def grade(self, ctx: APIContext, grade_str: str):
        grade_id = self.find_grade_id(ctx, grade_str)
        if grade_id:
            url = f'/grades?organizationId={self.organization_id}&id={grade_id}'
            return self.api_get(ctx, url)

    def grades(self, ctx: APIContext, limit: int, page: int):
        url = f'/grades?organizationId={self.organization_id}&limit={limit}&page={page}'
        return self.api_get(ctx, url)

    def rank(self, ctx: APIContext, rank_str: str):
        rank_id = self.find_rank_id(ctx, rank_str)
        if rank_id:
            url = f'/ranks-details?organizationId={self.organization_id}&rank_id={rank_id}'
            return self.api_get(ctx, url)

    def ranks(self, ctx: APIContext, limit: int, page: int):
        url = f'/ranks-details?organizationId={self.organization_id}&limit={limit}&page={page}'
        return self.api_get(ctx, url)

    def certification(self, ctx: APIContext, certification_str: str):
        certification_id = self.find_certification_id(ctx, certification_str)
        if certification_id:
            url = f'/certifications?organizationId={self.organization_id}&id={certification_id}'
            return self.api_get(ctx, url)

    def certifications(self, ctx: APIContext, limit: int, page: int):
        url = f'/certifications?organizationId={self.organization_id}&limit={limit}&page={page}'
        return self.api_get(ctx, url)

    def create_branch(self, ctx: APIContext, abbreviation: str, branch: str = None) -> BranchId:
        url = '/branches'
        body = {
            'organizationId': self.organization_id,
            'abbreviation': abbreviation
        }
        if branch:
            body['branch'] = branch
        return self.api_post(ctx, url, body)

    def create_grade(self, ctx: APIContext, abbreviation: str, grade: str = None) -> BranchId:
        url = '/grades'
        body = {
            'organizationId': self.organization_id,
            'abbreviation': abbreviation
        }
        if grade:
            body['grade'] = grade
        return self.api_post(ctx, url, body)

    def create_rank(self, ctx: APIContext, abbreviation: str, rank: str = None, branch_str: str = None, grade_str: str = None) -> RankId:
        branch_id = self.find_branch_id(ctx, branch_str)
        grade_id = self.find_grade_id(ctx, grade_str)

        if branch_str and branch_id is None:
            print('create_rank', abbreviation, branch_str, branch_id)
            return
        if grade_str and grade_id is None:
            print('create_rank', abbreviation, grade_str, grade_id)
            return

        url = '/ranks'
        body = {
            'organizationId': self.organization_id,
            'abbreviation': abbreviation
        }
        if rank:
            body['name'] = rank
        if branch_id:
            body['branchId'] = branch_id
        if grade_id:
            body['gradeId'] = grade_id
        return self.api_post(ctx, url, body)

      
    def create_certification(self, ctx: APIContext, branch_str: str, abbreviation: str, name: str) -> BranchId:
        branch_id = self.find_branch_id(ctx, branch_str)
        if branch_str and branch_id is None:
            print('create_certification', abbreviation, branch_str, branch_id)
            return

        url = '/certifications'
        body = {
            'organizationId': self.organization_id,
            'branchId': branch_id,
            'abbreviation': abbreviation,
            'name': name
        }
        return self.api_post(ctx, url, body)


    def create_permission(self, ctx: APIContext, subject_id: str, get: int, post: int, put: int, del_: int, proxy: int) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')

        if not issuer_id:
            print('create_permission', subject_id, issuer_id)
            return

        if not get and not post and not put and not del_ and not proxy:
            print('create_permission', subject_id, get, post, put, del_, proxy)
            return

        url = '/permissions'
        body = {
            'organizationId': self.organization_id,
            "subjectId": subject_id,
            'get': get if get else 0,
            'post': post if post else 0,
            'put': put if put else 0,
            'del': del_ if del_ else 0,
            'proxy': proxy if proxy else 0,
        }
        return self.api_post(ctx, url, body)

      
    def add_member(self, ctx: APIContext, discord_handle: str, sc_handle_name: str, rank_str: str, recruited_by_str: str, joined_date: datetime.datetime) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        discord_id = self.find_personnel_id(ctx, discord_handle)
        sc_handle_id = self.find_personnel_id(ctx, sc_handle_name)
        rank_id = self.find_rank_id(ctx, rank_str)

        discord_split = discord_handle.split('#')

        if discord_id or sc_handle_id or len(discord_split) != 2:
            print('add_member', discord_handle, discord_id, sc_handle_id, len(discord_split))
            return

        is_int = str(discord_split[1]) == str(int(discord_split[1])).zfill(len(str(discord_split[1])))

        if issuer_id and rank_id and is_int:
            personnel_id = str(uuid.uuid4())
            print(discord_handle)

            url = '/discord'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'username': discord_split[0],
                'discriminator': int(discord_split[1])
            }
            discord_record_id = self.api_post(ctx, url, body)

            url = '/rsi-citizen'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'handleName': sc_handle_name,
            }
            discord_record_id = self.api_post(ctx, url, body)

            rank_change_id = self.change_rank(ctx, personnel_id, rank_str)
            joined_org_change_id = self.record_joined_org(ctx, personnel_id, recruited_by_str, joined_date)

            return { 'id': personnel_id }
        else:
            print('add_member', discord_handle, rank_str, issuer_id, rank_id, is_int)

    def record_cert(self, ctx: APIContext, personnel_str: str, certification_str: str) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        certification_id = self.find_certification_id(ctx, certification_str)
        if issuer_id and personnel_id and certification_id:
            url = '/certification'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'certificationId': certification_id
            }
            return self.api_post(ctx, url, body)
        else:
            print('record_cert', personnel_str, certification_str, issuer_id, personnel_id, certification_id)

    def record_op(self, ctx: APIContext, personnel_str: str, op_name: str = None) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        if issuer_id and personnel_id:
            url = '/operation-attendence'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id
            }
            if op_name:
                body['name'] = op_name
            return self.api_post(ctx, url, body)
        else:
            print('record_op', personnel_str, issuer_id, personnel_id)

    def record_note(self, ctx: APIContext, personnel_str: str, note: str) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        if issuer_id and personnel_id and note:
            url = '/note'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'note': note
            }
            return self.api_post(ctx, url, body)
        else:
            print('record_note', personnel_str, issuer_id, personnel_id)

    def record_joined_org(self, ctx: APIContext, personnel_str: str, recruited_by_str: str, date: datetime.datetime) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        recruited_by_personnel_id = self.find_personnel_id(ctx, recruited_by_str)

        if issuer_id and personnel_id:
            url = '/joined-organization'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'joinedOrganizationId': self.organization_id,
            }
            if recruited_by_personnel_id:
                body['recruitedByPersonnelId'] = recruited_by_personnel_id
            if date:
                body['date'] = date.isoformat()
            return self.api_post(ctx, url, body)
        else:
            print('record_joined_org', personnel_str, issuer_id, personnel_id)

    def record_left_org(self, ctx: APIContext, personnel_str: str, date: datetime.datetime) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        personnel_id = self.find_personnel_id(ctx, personnel_str)

        if issuer_id and personnel_id:
            url = '/left-organization'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'leftOrganizationId': self.organization_id,
            }
            if date:
                body['date'] = date.isoformat()
            return self.api_post(ctx, url, body)
        else:
            print('record_left_org', personnel_str, issuer_id, personnel_id)

    def change_rank(self, ctx: APIContext, personnel_str: str, rank_str: str) -> NewRecordId:
        issuer_id = self.find_personnel_id(ctx, f'{ctx.username}#{ctx.discriminator}')
        personnel_id = self.find_personnel_id(ctx, personnel_str)
        rank_id = self.find_rank_id(ctx, rank_str)

        if issuer_id and personnel_id and rank_id:
            url = '/rank-change'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'rankId': rank_id,
            }
            return self.api_post(ctx, url, body)
        else:
            print('change_rank', personnel_str, rank_str, issuer_id, personnel_id, rank_id)

    def find_personnel_id(self, ctx: APIContext, personnel_str: str) -> PersonnelId:
        if personnel_str is None:
            return

        search_str = urllib.parse.quote(personnel_str, safe='')

        # try id lookup
        url = f'/personnel-summary?organizationId={self.organization_id}&personnelId={search_str}'
        personnel = self.api_get(ctx, url)
        if len(personnel) > 0:
            return personnel[0]['personnelId']

        if '#' in personnel_str:
            # try username#discriminator lookup
            split = personnel_str.split('#', 1)
            username = urllib.parse.quote(split[0], safe='')
            discriminator = urllib.parse.quote(split[1], safe='')

            url = f'/personnel-summary?organizationId={self.organization_id}&username={username}&discriminator={discriminator}'
            personnel = self.api_get(ctx, url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']
        else:
            # try handleName lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&handleName={search_str}'
            personnel = self.api_get(ctx, url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

            # try citizenName lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&citizenName={search_str}'
            personnel = self.api_get(ctx, url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

            # try citizenRecord lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&citizenRecord={search_str}'
            personnel = self.api_get(ctx, url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

            # try username lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&username={search_str}'
            personnel = self.api_get(ctx, url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

        return

    def find_branch_id(self, ctx: APIContext, branch_str: str) -> BranchId:
        url = f'/branches?organizationId={self.organization_id}&limit=1000'  # todo(abrazite): add paging
        branches = self.api_get(ctx, url)

        # try id
        for branch in branches:
            candidate = branch['id']
            if candidate == branch_str:
                return branch['id']

        # try BRANCH match
        matches = []
        for branch in branches:
            candidate = branch['abbreviation']
            if candidate == branch_str:
                matches.append(branch['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try name match
        for branch in branches:
            candidate = branch['branch']
            if candidate == branch_str:
                matches.append(branch['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

    def find_grade_id(self, ctx: APIContext, grade_str: str) -> BranchId:
        url = f'/grades?organizationId={self.organization_id}&limit=1000'  # todo(abrazite): add paging
        grades = self.api_get(ctx, url)

        # try id
        for grade in grades:
            candidate = grade['id']
            if candidate == grade_str:
                return grade['id']

        # try GRADE match
        matches = []
        for grade in grades:
            candidate = grade['abbreviation']
            if candidate == grade_str:
                matches.append(grade['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try name match
        for grade in grades:
            candidate = grade['grade']
            if candidate == grade_str:
                matches.append(grade['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

    def find_rank_id(self, ctx: APIContext, rank_str: str) -> RankId:
        url = f'/ranks-details?organizationId={self.organization_id}&limit=1000'  # todo(abrazite): add paging
        ranks = self.api_get(ctx, url)

        # try id
        for rank in ranks:
            candidate = rank['rankId']
            if candidate == rank_str:
                return rank['rankId']

        # try BRANCH-GRADE-RANK match
        matches = []
        for rank in ranks:
            candidate = (f'{rank["branchAbbreviation"]}-' if rank['branchAbbreviation'] else '') + \
                        (f'{rank["gradeAbbreviation"]}-' if rank['gradeAbbreviation'] else '') + \
                        (f'{rank["rankAbbreviation"]}' if rank['rankAbbreviation'] else '')
            if candidate == rank_str:
                matches.append(rank['rankId'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try BRANCH-RANK match
        for rank in ranks:
            candidate = (f'{rank["branchAbbreviation"]}-' if rank['branchAbbreviation'] else '') + \
                        (f'{rank["rankAbbreviation"]}' if rank['rankAbbreviation'] else '')
            if candidate == rank_str:
                matches.append(rank['rankId'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try RANK match
        for rank in ranks:
            candidate = rank['rankAbbreviation']
            if candidate == rank_str:
                matches.append(rank['rankId'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try name match
        for rank in ranks:
            candidate = rank['rankName']
            if candidate == rank_str:
                matches.append(rank['rankId'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

    def find_certification_id(self, ctx: APIContext, certification_str: str) -> CertificationId:
        url = f'/certifications?organizationId={self.organization_id}&limit=1000'  # todo(abrazite): add paging
        certifications = self.api_get(ctx, url)

        # try id
        for certification in certifications:
            candidate = certification['id']
            if candidate == certification_str:
                return certification['id']

        # try BRANCH-CERT match
        branches = self.branches(ctx, 1000, 0)  # todo(abrazite): add paging
        branches_by_id = {}
        for branch in branches:
            branches_by_id[branch['id']] = branch

        matches = []
        for certification in certifications:
            candidate = certification['abbreviation']
            branch_id = certification['branchId']
            if branch_id in branches_by_id:
                candidate = f'{branches_by_id[branch_id]["abbreviation"]}-{candidate}'
                if candidate == certification_str:
                    matches.append(certification['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try CERT match
        matches = []
        for certification in certifications:
            candidate = certification['abbreviation']
            if candidate == certification_str:
                matches.append(certification['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

        # try name match
        for certification in certifications:
            candidate = certification['name']
            if candidate == certification_str:
                matches.append(certification['id'])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return

    def validate(self, ctx: APIContext):
        url = '/validate'
        return self.api_get(ctx, url)

    def api_get(self, ctx: APIContext, url: str):
        try:
            if time.time() - self.token_start_time > self.expires_in - 86400:
                self.api_get_token()

            r = requests.get(f'{self.api_server}{url}', headers={
                'authorization': f'{self.token_type} {self.access_token}',
                'x-org-manager-organization-id': self.organization_id,
                'x-proxy-username': ctx.username,
                'x-proxy-discriminator': ctx.discriminator,
                'x-proxy-organization': self.organization_id,
            })

            r.raise_for_status()
            return r.json()
        except:
            print(sys.exc_info()[0])
            return

    def api_post(self, ctx: APIContext, url: str, body):
        try:
            if time.time() - self.token_start_time > self.expires_in - 86400:
                self.api_get_token()

            r = requests.post(f'{self.api_server}{url}',
                              data=json.dumps(body),
                              headers={
                                'Content-Type': 'application/json',
                                'authorization': f'{self.token_type} {self.access_token}',
                                'x-org-manager-organization-id': self.organization_id,
                                'x-proxy-username': ctx.username,
                                'x-proxy-discriminator': ctx.discriminator,
                                'x-proxy-organization': self.organization_id,
                              })
            r.raise_for_status()
            return r.json()
        except Exception as e:
            exceptName = type(e).__name__
            print(exceptName, sys.exc_info()[0])
            print(e)
            print(json.dumps(body))
            return

    def api_get_token(self):
        API_ENDPOINT = 'https://discord.com/api/v6'

        data = {
            'grant_type': 'client_credentials',
            'scope': 'identify guilds'
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers, auth=(secrets.CLIENT_ID, secrets.CLIENT_SECRET))
        r.raise_for_status()
        data = r.json()
        self.token_start_time = time.time()
        self.access_token = data['access_token']
        self.token_type = data['token_type']
        self.expires_in = data['expires_in']
