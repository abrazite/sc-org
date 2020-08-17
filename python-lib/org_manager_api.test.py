import unittest
import time

import org_manager_api

API_SERVER = 'https://api.org-manager.space/1.0.0/'
# API_SERVER = 'http://localhost:8081/api/1.0.0/'
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


class TestBranch(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        branch = self.api.branch('HJ')
        self.assertIsNotNone(branch)

    def test_non_existant_query(self):
        branch = self.api.branch('3465jklhasd89fgq2')
        self.assertIsNone(branch)


class TestBranches(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        branches = self.api.branches(2, 0)
        self.assertIsNotNone(branches)
        self.assertEqual(len(branches), 2)


class TestGrade(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        grade = self.api.grade('E1')
        self.assertIsNotNone(grade)

    def test_non_existant_query(self):
        grade = self.api.grade('3465jklhasd89fgq2')
        self.assertIsNone(grade)


class TestGrades(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        grades = self.api.grades(2, 0)
        self.assertIsNotNone(grades)
        self.assertEqual(len(grades), 2)


class TestRank(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        rank = self.api.rank('HJ-SA')
        self.assertIsNotNone(rank)

    def test_non_existant_query(self):
        rank = self.api.rank('3465jklhasd89fgq2')
        self.assertIsNone(rank)


class TestRanks(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        ranks = self.api.ranks(2, 0)
        self.assertIsNotNone(ranks)
        self.assertEqual(len(ranks), 2)


class TestCertification(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        certification = self.api.certification('BG')
        self.assertIsNotNone(certification)

    def test_non_existant_query(self):
        certification = self.api.certification('3465jklhasd89fgq2')
        self.assertIsNone(certification)


class TestCertifications(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_query(self):
        certifications = self.api.certifications(2, 0)
        self.assertIsNotNone(certifications)
        self.assertEqual(len(certifications), 2)


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


class TestFindBranchId(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_branch(self):
        branch_id = self.api.find_branch_id('HJ')
        self.assertIsNotNone(branch_id)

    def test_branch_name(self):
        branch_id = self.api.find_branch_id('Helljumpers')
        self.assertIsNotNone(branch_id)

    def test_no_match(self):
        branch_id = self.api.find_branch_id('23891aklfklk2314kjsd')
        self.assertIsNone(branch_id)


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


class TestFindCertificationId(unittest.TestCase):
    api = None

    def setUp(self):
        self.api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

    def test_branch_certification(self):
        certification_id = self.api.find_certification_id('HJ-BG')
        self.assertIsNotNone(certification_id)

    def test_certification(self):
        certification_id = self.api.find_certification_id('BG')
        self.assertIsNotNone(certification_id)

    def test_certification_name(self):
        certification_id = self.api.find_certification_id('Basic Ground')
        self.assertIsNotNone(certification_id)

    def test_no_match(self):
        certification_id = self.api.find_certification_id('23891aklfklk2314kjsd')
        self.assertIsNone(certification_id)


if __name__ == '__main__':
    unittest.main()
