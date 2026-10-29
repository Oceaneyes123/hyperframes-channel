# Findings

Initial checkout: 4,567 tracked files, 317,900,698 bytes; 40 commits. No .codegraph directory. Baseline hashes 731/731 and benchmark hashes 22/22 match.
3,681 generated media/log/register/inventory paths selected for external evidence retention (268,388,899 bytes). Retain Markdown-linked representative images and all runtime public assets, voice references, source, license and frozen JSON records.
.gitignore cannot enforce size. Add a 5 MiB new-blob guard with exact pre-existing blob exceptions, local hooks and CI.
Fresh clones need the evidence archive to run historical media/hash checks. Local working files remain available.
