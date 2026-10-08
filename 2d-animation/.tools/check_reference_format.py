from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
# Load helper definitions without executing their edit loop.
source = (ROOT / '.tools/format_reference_docs.py').read_text(encoding='utf-8')
helpers = {'__file__': str(ROOT / '.tools/format_reference_docs.py')}
exec(source[:source.index('originals =')], helpers)
originals = json.loads((ROOT / '.tools/reference-docs-before-format.json').read_text(encoding='utf-8'))

def shorten_blocks(text):
    blocks = re.split(r'(\n\n)', text)
    fenced = False
    frontmatter = text.startswith('---\n')
    for i, block in enumerate(blocks):
        if block == '\n\n':
            continue
        if frontmatter:
            if re.search(r'\n---(?:\n|$)', block):
                frontmatter = False
            continue
        if block.startswith('```') or fenced:
            if block.count('```') % 2:
                fenced = not fenced
            continue
        if block.startswith(('#', '|', '-', '>', '**On this page**')) or re.match(r'\d+\.', block):
            continue
        if len(block.split()) <= 80:
            continue
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z`])', block)
        groups = []
        current = []
        count = 0
        for sentence in sentences:
            current.append(sentence)
            count += len(sentence.split())
            if count >= 40:
                groups.append(' '.join(current))
                current = []
                count = 0
        if current:
            groups.append(' '.join(current))
        blocks[i] = '\n\n'.join(groups)
    return ''.join(blocks)

for name, before in originals.items():
    path = ROOT / name
    after = shorten_blocks(path.read_text(encoding='utf-8'))
    path.write_text(after, encoding='utf-8', newline='\n')
    recovered = after
    # Reconstruct only the tables deliberately presented as stacked entries.
    for block in re.findall(r'^\| .*\n\| [-| :]+\n(?:\| .*\n)+', before, re.M):
        header = block.splitlines()[0].split('|')[1].strip()
        if header in helpers['TABLES'].get(name, []):
            stacked = helpers['stack_tables'](block, [header]).strip()
            assert stacked in recovered, (name, header)
            recovered = recovered.replace(stacked, block.strip(), 1)
    for heading, _ in helpers['GROUPS'][name]:
        recovered = recovered.replace('### ' + heading + '\n', '', 1)
    recovered = re.sub(r'\*\*On this page\*\*\n\n(?:- \[.*\n)+\n', '', recovered)
    assert recovered.split() == before.split(), f'Content changed: {name}'
    fences = lambda s: re.findall(r'^```[^\n]*\n.*?^```[^\n]*$', s, re.M | re.S)
    assert fences(after) == fences(before), f'Code block changed: {name}'
    if before.startswith('---\n'):
        assert before.split('---', 2)[1] == after.split('---', 2)[1]
    # Existing heading targets remain; every added contents link resolves.
    headings = re.findall(r'^#{1,6} (.+)$', helpers['outside_fences'](after), re.M)
    anchors = {helpers['slug'](h) for h in headings}
    for anchor in re.findall(r'\]\(#([^)]*)\)', helpers['outside_fences'](after)):
        assert anchor in anchors, (name, anchor)
    print('PASS: wording, code blocks, metadata and contents links:', name)
