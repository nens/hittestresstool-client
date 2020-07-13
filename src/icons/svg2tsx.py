#!/usr/bin/env python3
TSX_TEMPLATE = '''\
import React from 'react';

const %s: React.FC = () => (
  %s
);

export default %s;
'''

import os
import re
import sys

CLASS_DEF_PATTERN = '\\.[a-z]{(?:.*?:.*?;)+?}'

if (len(sys.argv) != 2 or not sys.argv[1] or not os.path.exists(sys.argv[1])
    or not sys.argv[1].endswith('.svg')):
    print("Usage: svg2tsx.py <file.svg>")
    print("Creates a new file <File.tsx>.")
    sys.exit(1)

infile = sys.argv[1]

outfile = infile[0].upper() + infile[1:-4] + '.tsx'

if os.path.exists(outfile):
    print(outfile, "exists.")
    sys.exit(1)

content = open(infile).read()

classes = re.findall(CLASS_DEF_PATTERN, content)

for klass in classes:
    print(klass)
    k = klass[1]
    style = klass[3:-1]
    styles = {}
    for style in [k for k in klass[3:-1].split(";") if ':' in k]:
        key, value = style.split(":")
        styles[key] = value
    print(styles)

    stylestr = (
        'style={{' +
        ';'.join(['%s: "%s"' % (key, value) for (key, value) in styles.items()])
        +'}}')

    print(stylestr)

    content = content.replace('class="%s"' % (k,), stylestr)

start_defs = content.index('<defs>')
end_defs = content.index('</defs>') + len('</defs>')

content = content[:start_defs] + content[end_defs:]

open(outfile, "w").write(TSX_TEMPLATE % (outfile[:-4], content, outfile[:-4]))
