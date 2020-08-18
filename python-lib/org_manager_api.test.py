import unittest
import time

import org_manager_api

API_SERVER = 'https://api.org-manager.space/1.0.0'
# API_SERVER = 'http://localhost:8081/api/1.0.0'
ORGANIZATION_ID = '4b40e446-5ceb-4543-a6d8-fa4e28a00406'
api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)


def create_api_context(username: str, discriminator: str) -> org_manager_api.APIContext:
    return org_manager_api.APIContext(
        username,
        discriminator
    )


ctx = create_api_context('abrazite', '7161')


class TestMembership(unittest.TestCase):
    def test_query(self):
        membership = api.membership(ctx, 'gunnerx98')
        self.assertIsNotNone(membership)

    def test_previous_member(self):
        personnel = api.personnel(ctx, '1443936')
        membership = api.membership(ctx, '1443936')
        self.assertIsNotNone(personnel)
        self.assertIsNone(membership)


class TestBranch(unittest.TestCase):
    def test_query(self):
        branch = api.branch(ctx, 'HJ')
        self.assertIsNotNone(branch)

    def test_non_existant_query(self):
        branch = api.branch(ctx, '3465jklhasd89fgq2')
        self.assertIsNone(branch)


class TestBranches(unittest.TestCase):
    def test_query(self):
        branches = api.branches(ctx, 2, 0)
        self.assertIsNotNone(branches)
        self.assertEqual(len(branches), 2)


class TestGrade(unittest.TestCase):
    def test_query(self):
        grade = api.grade(ctx, 'E1')
        self.assertIsNotNone(grade)

    def test_non_existant_query(self):
        grade = api.grade(ctx, '3465jklhasd89fgq2')
        self.assertIsNone(grade)


class TestGrades(unittest.TestCase):
    def test_query(self):
        grades = api.grades(ctx, 2, 0)
        self.assertIsNotNone(grades)
        self.assertEqual(len(grades), 2)


class TestRank(unittest.TestCase):
    def test_query(self):
        rank = api.rank(ctx, 'HJ-SA')
        self.assertIsNotNone(rank)

    def test_non_existant_query(self):
        rank = api.rank(ctx, '3465jklhasd89fgq2')
        self.assertIsNone(rank)


class TestRanks(unittest.TestCase):
    def test_query(self):
        ranks = api.ranks(ctx, 2, 0)
        self.assertIsNotNone(ranks)
        self.assertEqual(len(ranks), 2)


class TestCertification(unittest.TestCase):
    def test_query(self):
        certification = api.certification(ctx, 'BG')
        self.assertIsNotNone(certification)

    def test_non_existant_query(self):
        certification = api.certification(ctx, '3465jklhasd89fgq2')
        self.assertIsNone(certification)


class TestCertifications(unittest.TestCase):
    def test_query(self):
        certifications = api.certifications(ctx, 2, 0)
        self.assertIsNotNone(certifications)
        self.assertEqual(len(certifications), 2)


class TestChangeRank(unittest.TestCase):
    def test_rank_change(self):
        personnel_id = api.find_personnel_id(ctx, 'abrazite')
        personnel = api.personnel_summary(ctx, personnel_id)
        self.assertIsNotNone(personnel)

        record_id = api.change_rank(ctx, 'abrazite', 'HJ-E1-SR')
        time.sleep(2)  # wait for change before reverting
        api.change_rank(ctx, personnel_id, personnel['rankId'])
        self.assertIsNotNone(record_id)


class TestFindPersonnelId(unittest.TestCase):
    def test_discord_handle(self):
        personnel_id = api.find_personnel_id(ctx, 'FelixNightmare#6401')
        self.assertIsNotNone(personnel_id)

    def test_discord_username(self):
        personnel_id = api.find_personnel_id(ctx, 'FelixNightmare')
        self.assertIsNotNone(personnel_id)

    def test_handle_name(self):
        personnel_id = api.find_personnel_id(ctx, 'FelixNightmare')
        self.assertIsNotNone(personnel_id)

    def test_citizen_name(self):
        personnel_id = api.find_personnel_id(ctx, 'Dead Fox')
        self.assertIsNotNone(personnel_id)

    def test_citizen_record(self):
        personnel_id = api.find_personnel_id(ctx, '2549784')
        self.assertIsNotNone(personnel_id)

    def test_no_match(self):
        personnel_id = api.find_personnel_id(ctx, '895198hsjkdfh983415kjdsh')
        self.assertIsNone(personnel_id)


class TestFindBranchId(unittest.TestCase):
    def test_branch(self):
        branch_id = api.find_branch_id(ctx, 'HJ')
        self.assertIsNotNone(branch_id)

    def test_branch_name(self):
        branch_id = api.find_branch_id(ctx, 'Helljumpers')
        self.assertIsNotNone(branch_id)

    def test_no_match(self):
        branch_id = api.find_branch_id(ctx, '23891aklfklk2314kjsd')
        self.assertIsNone(branch_id)


class TestFindRankId(unittest.TestCase):
    def test_branch_grade_rank(self):
        rank_id = api.find_rank_id(ctx, 'HJ-O1-LTCDR')
        self.assertIsNotNone(rank_id)

    def test_branch_rank(self):
        rank_id = api.find_rank_id(ctx, 'HJ-LTCDR')
        self.assertIsNotNone(rank_id)

    def test_rank(self):
        rank_id = api.find_rank_id(ctx, 'SR')
        self.assertIsNotNone(rank_id)

    def test_name(self):
        rank_id = api.find_rank_id(ctx, 'Starman Recruit')
        self.assertIsNotNone(rank_id)

    def test_no_match(self):
        rank_id = api.find_rank_id(ctx, '23891aklfklk2314kjsd')
        self.assertIsNone(rank_id)


class TestFindCertificationId(unittest.TestCase):
    def test_branch_certification(self):
        certification_id = api.find_certification_id(ctx, 'HJ-BG')
        self.assertIsNotNone(certification_id)

    def test_certification(self):
        certification_id = api.find_certification_id(ctx, 'BG')
        self.assertIsNotNone(certification_id)

    def test_certification_name(self):
        certification_id = api.find_certification_id(ctx, 'Basic Ground')
        self.assertIsNotNone(certification_id)

    def test_no_match(self):
        certification_id = api.find_certification_id(ctx, '23891aklfklk2314kjsd')
        self.assertIsNone(certification_id)


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(DebugTest)
    unittest.TextTestRunner().run(suite)
    # unittest.main()
