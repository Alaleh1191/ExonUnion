#Usage: python ./sort.py <IndividualTranscriptFileName> <gene id column, default 0> <chromosome number column, default 3>
#Result saved in Results folder, under the name geneIdSorted.bedgraph

#import
import sys

with open('geneid_refGene.tsv') as fin:
    lines = [line.split() for line in fin]

from operator import itemgetter

#sorting for exon union based on its id and the chr
lines.sort(key=itemgetter(0,3))

# exon union
with open('Results/geneIdSorted.bedGraph', 'w') as fout:
    for el in lines:
        fout.write('{0}\n'.format(' '.join(el)))
