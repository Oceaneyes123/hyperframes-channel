import unittest

from validate_project import DESIGN_VERSION


class ValidatorTests(unittest.TestCase):
    def test_design_version_is_semver(self):
        self.assertRegex(DESIGN_VERSION, r"^\d+\.\d+\.\d+$")


if __name__ == "__main__":
    unittest.main()
