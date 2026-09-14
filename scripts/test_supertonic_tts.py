import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))

from supertonic_tts import narration_lines


class NarrationLinesTests(unittest.TestCase):
    def test_uses_only_indented_narration(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "SCRIPT.md"
            script.write_text("## Line 1 — Test\n\n**Time:** 0–1s\n\n    Spoken words.\n", encoding="utf-8")
            self.assertEqual(narration_lines(script), [("line-1", "Spoken words.")])


if __name__ == "__main__":
    unittest.main()
