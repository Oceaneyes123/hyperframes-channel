"""Backward-compatible wrapper for the repository Supertonic generator."""

from pathlib import Path
from runpy import run_path
import sys


PROJECT = Path(__file__).resolve().parents[1]
sys.argv = [str(Path(__file__).resolve())] + ["--project", str(PROJECT)] + sys.argv[1:]
run_path(str(Path(__file__).resolve().parents[3] / "scripts" / "supertonic_tts.py"), run_name="__main__")
