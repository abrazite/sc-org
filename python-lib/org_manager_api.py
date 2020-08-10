from typing import NewType
import urllib.request
import json


OrganizationId = NewType('OrganizationId', str)
PersonnelId = NewType('PersonnelId', str)
RankId = NewType('RankId', str)
NewRecordId = NewType('NewRecordId', str)


class OrgManagerAPI:
    def __init__(self, api_server: str, organization_id: OrganizationId):
        self.api_server = api_server
        self.organization_id = organization_id
        self.auth_token = ''  # todo(abrazite): add auth token support

    def membership(self, personnel_str: str):
        personnel_id = self.find_personnel_id(personnel_str)
        if personnel_id:
            url = f'/membership?organizationId={self.organization_id}&personnelId={personnel_id}?'
            results = self.api_get(url)
            if len(results) > 0:
                return results[0]

    def personnel_summary(self, personnel_str: str):
        personnel_id = self.find_personnel_id(personnel_str)
        if personnel_id:
            url = f'/personnel-summary?organizationId={self.organization_id}&personnelId={personnel_id}?'
            results = self.api_get(url)
            if len(results) > 0:
                return results[0]

    def personnel(self, personnel_str: str):
        personnel_id = self.find_personnel_id(personnel_str)
        if personnel_id:
            url = f'/personnel/{personnel_id}?organizationId={self.organization_id}'
            return self.api_get(url)

    def rank(self, rank_str: str):
        rank_id = self.find_rank_id(rank_str)
        if rank_id:
            url = f'/ranks-details?organizationId={self.organization_id}&rank_id={rank_id}'
            return self.api_get(url)

    def change_rank(self, issuer_str: str, personnel_str: str, rank_str: str) -> NewRecordId:
        issuer_id = self.find_personnel_id(issuer_str)
        personnel_id = self.find_personnel_id(personnel_str)
        rank_id = self.find_rank_id(rank_str)

        if issuer_id and personnel_id and rank_id:
            url = f'/rank-change'
            body = {
                'organizationId': self.organization_id,
                'issuerPersonnelId': issuer_id,
                'personnelId': personnel_id,
                'rankId': rank_id,
            }
            return self.api_post(url, body)

    def find_rank_id(self, rank_str: str) -> RankId:
        url = f'/ranks-details?organizationId={self.organization_id}&limit=1000'  # todo(abrazite): add paging
        ranks = self.api_get(url)

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

    def find_personnel_id(self, personnel_str: str) -> PersonnelId:
        search_str = urllib.parse.quote(personnel_str, safe='')

        # try id lookup
        url = f'/personnel-summary?organizationId={self.organization_id}&personnelId={search_str}'
        personnel = self.api_get(url)
        if len(personnel) > 0:
            return personnel[0]['personnelId']

        if '#' in personnel_str:
            # try username#discriminator lookup
            split = personnel_str.split('#', 1)
            username = urllib.parse.quote(split[0], safe='')
            discriminator = urllib.parse.quote(split[1], safe='')

            url = f'/personnel-summary?organizationId={self.organization_id}&username={username}&discriminator={discriminator}'
            personnel = self.api_get(url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']
        else:
            # try handleName lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&handleName={search_str}'
            personnel = self.api_get(url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

            # try citizenName lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&citizenName={search_str}'
            personnel = self.api_get(url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

            # try citizenRecord lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&citizenRecord={search_str}'
            personnel = self.api_get(url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

            # try username lookup
            url = f'/personnel-summary?organizationId={self.organization_id}&username={search_str}'
            personnel = self.api_get(url)
            if len(personnel) > 0:
                return personnel[0]['personnelId']

        return None

    def api_get(self, url: str):
        try:
            # todo(abrazite): add auth headers here
            response = urllib.request.urlopen(f'{self.api_server}{url}')
            return json.loads(response.read().decode())
        except e:
            print(e)
            return

    def api_post(self, url: str, body):
        try:
            # todo(abrazite): add auth headers here
            response = urllib.request.urlopen(urllib.request.Request(
                url=f'{self.api_server}{url}',
                data=json.dumps(body).encode(),
                headers={'Content-Type': 'application/json'}))
            return json.loads(response.read().decode())
        except e:
            print(e)
            return
