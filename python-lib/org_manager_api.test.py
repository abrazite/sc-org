import unittest
import time

import org_manager_api

# API_SERVER = 'https://li1958-117.members.linode.com/1.0.0/'
API_SERVER = 'http://localhost:8081/api/1.0.0/'
ORGANIZATION_ID = '4b40e446-5ceb-4543-a6d8-fa4e28a00406'


class TestMembership(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        membership = self.api.membership('gunnerx98')
        self.assertIsNotNone(membership)

    def test_previous_member(self):
        personnel = self.api.personnel('1443936')
        membership = self.api.membership('1443936')
        self.assertIsNotNone(personnel)
        self.assertIsNone(membership)


class TestChangeRank(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_rank_change(self):
        issuer_id = self.api.find_personnel_id('gunnerx98')
        personnel_id = self.api.find_personnel_id('abrazite')
        personnel = self.api.personnel_summary(personnel_id)
        self.assertIsNotNone(personnel)

        record_id = self.api.change_rank('gunnerx98', 'abrazite', 'HJ-E1-SR')
        time.sleep(2)  # wait for change before reverting
        self.api.change_rank(issuer_id, personnel_id, personnel['rankId'])
        self.assertIsNotNone(record_id)


class TestFindRankId(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_branch_grade_rank(self):
        rank_id = self.api.find_rank_id('HJ-O1-LTCDR')
        self.assertIsNotNone(rank_id)

    def test_branch_rank(self):
        rank_id = self.api.find_rank_id('HJ-LTCDR')
        self.assertIsNotNone(rank_id)

    def test_rank(self):
        rank_id = self.api.find_rank_id('SR')
        self.assertIsNotNone(rank_id)

    def test_name(self):
        rank_id = self.api.find_rank_id('Starman Recruit')
        self.assertIsNotNone(rank_id)

    def test_no_match(self):
        rank_id = self.api.find_rank_id('23891aklfklk2314kjsd')
        self.assertIsNone(rank_id)


class TestFindPersonnelId(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_discord_handle(self):
        personnel_id = self.api.find_personnel_id('FelixNightmare#6401')
        self.assertIsNotNone(personnel_id)

    def test_discord_username(self):
        personnel_id = self.api.find_personnel_id('FelixNightmare')
        self.assertIsNotNone(personnel_id)

    def test_handle_name(self):
        personnel_id = self.api.find_personnel_id('FelixNightmare')
        self.assertIsNotNone(personnel_id)

    def test_citizen_name(self):
        personnel_id = self.api.find_personnel_id('Dead Fox')
        self.assertIsNotNone(personnel_id)

    def test_citizen_record(self):
        personnel_id = self.api.find_personnel_id('2549784')
        self.assertIsNotNone(personnel_id)

    def test_no_match(self):
        personnel_id = self.api.find_personnel_id('895198hsjkdfh983415kjdsh')
        self.assertIsNone(personnel_id)


if __name__ == '__main__':
    unittest.main()
