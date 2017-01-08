#Usage: python ./script.py <exonUnionFileName> <IndividualTranscriptFileName>

#Imports
import json
import re
import ast
import sys

#Initializing of important variables
startGlobal = 0
endGlobal   = 0
i           = 0
maxLine     = 0

#Start and End values must contain the largest length of all the exonUnions
jsonValues = {  'options' : {'start' : startGlobal, 'end' : endGlobal},
                'values' : []
             }

#Opening files
exonUnionFile       = open(sys.argv[1], 'r')
geneIdSortedFile    = open(sys.argv[2], 'r')

geneIdSortedLine        = geneIdSortedFile.readline()
geneIdSortedLineSplit   = geneIdSortedLine.split()

#Determine if there is a threshold
if(len(sys.argv) == 4):
    maxLine = int(sys.argv[3])
else:
    maxLine = 0

for line in exonUnionFile:
    i += 1

    if maxLine != 0 and i > maxLine:
        break

    lineSplit = line.split()
    lineRESplit = re.findall('\[[^\[]*\]', line)

    name    = lineSplit[0]
    start   = int(re.search('\d+', lineRESplit[3]).group())
    end     = ast.literal_eval(lineRESplit[4])[-1]

    #Assess if this exonUnion is greater than the previous one
    if((endGlobal - startGlobal) < (end - start)):
        startGlobal = start
        endGlobal   = end

    #Retrieve the exons
    exonsString = re.search('\[\[.*\]\]', line).group()
    exons = ast.literal_eval(exonsString)

    #Retrieve the transcripts from the geneIdSortedFile
    transcripts = []

    while True:
        # Retrieve the values
        transcriptGene = geneIdSortedLineSplit[2]
        transcriptStart = geneIdSortedLineSplit[5]
        transcriptEnd   = geneIdSortedLineSplit[6]
        transcriptExonStart = ast.literal_eval(geneIdSortedLineSplit[10])
        transcriptExonEnd   = ast.literal_eval(geneIdSortedLineSplit[11])

        #Store the values
        transcript = {'name' : transcriptGene, 'startx': transcriptStart, 'endx': transcriptEnd,
                      'exonStart': transcriptExonStart, 'exonEnd': transcriptExonEnd}
        transcripts.append(transcript)

        #Retrieve next line and read the name
        geneIdSortedLine = geneIdSortedFile.readline()
        if(geneIdSortedLine == ''):
            break

        geneIdSortedLineSplit = geneIdSortedLine.split()
        transcriptName = geneIdSortedLineSplit[0]

        #Determine if the name is the same
        if(name != transcriptName):
            break

    union = {'startx':start, 'endx' : end, 'exons': exons}
    jsonValues['values'].append({'name' : name, 'union' : union, 'transcripts': transcripts})
#   jsonValues['values'].append({'name' : name, 'startx': start, 'endx' : end, 'exons' : exons, 'transcripts': transcripts})

#Insert the largest length of all the exonUnions
jsonValues['options'] = {'start' : startGlobal, 'end' : endGlobal}

#Close files
exonUnionFile.close()
geneIdSortedFile.close()

with open('result.json', 'w') as resultJSONFile:
    json.dump(jsonValues, resultJSONFile)
