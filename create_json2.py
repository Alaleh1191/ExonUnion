#Usage: python ./script.py <exonUnionFileName> <IndividualTranscriptFileName> <the number of Genes, default goes through the whole file>

#Imports
import json
import re
import ast
import sys
import collections as col

#Initializing of important variables
startGlobal = 0
endGlobal   = 0
i           = 0
maxLine     = 0
unions = col.defaultdict(set)
transcripts = col.defaultdict(list)


#Start and End values contains the start and end of the longest gene
jsonValues = {  'options' : {'start' : startGlobal, 'end' : endGlobal},
                'values' : []
             }

#Opening files
exonUnionFile       = open(sys.argv[1], 'r')
inputFile           = open(sys.argv[2], 'r')

inputLine        = inputFile.readline()
inputLineSplit   = inputLine.split()

#Determine if there is a threshold on how many genes
if(len(sys.argv) == 4):
    maxLine = int(sys.argv[3])
else: #read the whole file
    maxLine = 0

#retrieve the genes
geneIds = []

for line in exonUnionFile:
    i += 1

    if maxLine != 0 and i > maxLine: #if reached max number of genes
        break

    lineSplit = line.strip().split("\t")
    lineRESplit = re.findall('\[[^\[]*\]', line)

 #   name    = lineSplit[3]
    start   = int(lineSplit[1])
    end     = int(lineSplit[2])
    geneId  = int(lineSplit[7])
    geneIds.append(geneId)

    #Assess if this gene (the union of its transcript), has a larger length
    if((endGlobal - startGlobal) < (end - start)):
        startGlobal = start
        endGlobal   = end

    #Retrieve the unionized exons
    exonStart = ast.literal_eval(lineSplit[13])
    exonEnd = ast.literal_eval(lineSplit[14])

    union = {'startx':start, 'endx' : end, 'exonStart': exonStart, 'exonEnd' : exonEnd}
    unions[geneId] = union;

    


for line in inputFile:
    inputLineSplit = line.strip().split("\t")

    geneId  = int(inputLineSplit[7])
    if geneId not in geneIds:
        continue
    else:
        transcriptName = inputLineSplit[6]
        transcriptStart = inputLineSplit[1]
        transcriptEnd   = inputLineSplit[2]
        transcriptExonStart = ast.literal_eval(inputLineSplit[13])
        transcriptExonEnd   = ast.literal_eval(inputLineSplit[14])

        #Store the values
        transcript = {'name' : transcriptName, 'startx': transcriptStart, 'endx': transcriptEnd,
                      'exonStart': transcriptExonStart, 'exonEnd': transcriptExonEnd}
        transcripts[geneId].append(transcript)


for geneId in geneIds:
    jsonValues['values'].append({'name' : geneId, 'union' : unions[geneId], 'transcripts': transcripts[geneId]})

#Insert the start and end of the largest gene, and estimate the height of the svg
height = i*10*5
jsonValues['options'] = {'start' : startGlobal, 'end' : endGlobal, 'height' : height}

#Close files
exonUnionFile.close()
inputFile.close()

with open('Results/result.json', 'w') as resultJSONFile:
    json.dump(jsonValues, resultJSONFile)
