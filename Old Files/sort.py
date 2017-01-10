#Usage: python ./sort.py <IndividualTranscriptFileName> <gene id column, default 0> <chromosome number column, default 3>
#Result saved in Results folder, under the name geneIdSorted.bedgraph

#import
import argparse
from operator import itemgetter

parser = argparse.ArgumentParser(description="")
parser.add_argument("indivTransFileName", help="Individual Transcript File Name")
parser.add_argument('-g', '--gene_column', default=0, help="Gene Id Column", type=int)
parser.add_argument('-c', '--chr_column', default=3, help="Chromosome Number Column", type=int)

args = parser.parse_args()

with open(args.indivTransFileName) as fin:
    lines = [line.split() for line in fin]

#sorting for exon union based on its id and the chr
lines.sort(key=itemgetter(args.gene_column,args.chr_column))

# exon union
with open('Results/geneIdSorted.bedGraph', 'w') as fout:
    for el in lines:
        fout.write('{0}\n'.format(' '.join(el)))
