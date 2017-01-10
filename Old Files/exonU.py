def main():
	inputFile = open ('Results/geneIdSorted.bedGraph', 'r')
	outputFile = open ('Results/exonUnion.txt', 'w')

	values = {}
	geneName = ""
	exonStarts = []
	exonEnds = []
	exonIntervals = []
	words1 = []
	words2 = []
	strand = []
	transcriptStart = []
	transcriptEnd = []
	codingStart = []
	codingEnd = []
	exons = []
	score = []
	words12 = []
	words13 = []
	words14 = []
	words15 = []
	chrName = ""
	i = 1
	for line in inputFile:
		i += 1
#		if(i == 5):
#			break
		words = line.split(" ")
		#if(chrName == ""):
		#	chrName = words[3]
		#if(chrName != words[3]):
		#	chrName = words[3]
		#	geneName = ""
		if(geneName == ""):
			geneName = words[0]
			exonStarts = []
			exonEnds =[]
			exonIntervals = []
			words1 = []
			words2 = []
			strand = []
			transcriptStart = []
			transcriptEnd = []
			codingStart = []
			codingEnd = []
			score = []
			words12 = []
			words13 = []
			words14 = []
			words15 = []
		
#		print(geneName)
		
		if(geneName != words[0]):
			#exonStarts = sorted(set(exonStarts))
#			print("hi")
#			#exonEnds = sorted(set(exonEnds))
			
			exonIntervals = [list(t) for t in set(tuple(element) for element in exonIntervals)]
			words1 = sorted(set(words1))
			words2 = sorted(set(words2))
			strand = sorted(set(strand))
			transcriptStart = sorted(set(transcriptStart))
			transcriptEnd = sorted(set(transcriptEnd))
			codingStart = sorted(set(codingStart))
			codingEnd = sorted(set(codingEnd))
			score = sorted(set(score))
			words12 = sorted(set(words12))
			words13 = sorted(set(words13))
			words14 = sorted(set(words14))
			words15 = sorted(set(words15))
			exonCount = len(exonIntervals)
			string = "{} {} {} {} {} {} {} {} {} {} {} {} {} {} {} {}".format(geneName, words1, words2, words[3], strand, transcriptStart, transcriptEnd, codingStart, codingEnd, exonCount, exonIntervals, score, words12, words13, words14, words15)
			print(string, file = outputFile, end = '\n')
			exonStarts = []
			exonIntervals = []
			exonEnds = []
			words1 = []
			words2 = []
			strand = []
			transcriptStart = []
			transcriptEnd = []
			codingStart = []
			codingEnd = []
			score = []
			words12 = []
			words13 = []
			words14 = []
			words15 = []
			geneName = words[0]
		

		exons = words[10].split(",")
		del exons[-1]
		exonStarts.extend(map(int, exons))
		exons = words[11].split(",")
		del exons[-1]
		exonEnds.extend(map(int, exons))
		for start, end in zip(exonStarts, exonEnds):
			exonIntervals.append([start,end])
		words1.append(words[1])
		words2.append(words[2])
		strand.append(words[4])
		transcriptStart.append(int(words[5]))
		transcriptEnd.append(int(words[6]))
		codingStart.append(int(words[7]))
		codingEnd.append(int(words[8]))
		score.append(int(words[12]))
		words12.append(words[13])
		words13.append(words[14])
		words14.append(words[15])
		words15.append(words[16])
	
	exonIntervals = [list(t) for t in set(tuple(element) for element in exonIntervals)]
	words1 = sorted(set(words1))
	words2 = sorted(set(words2))
	strand = sorted(set(strand))
	transcriptStart = sorted(set(transcriptStart))
	transcriptEnd = sorted(set(transcriptEnd))
	codingStart = sorted(set(codingStart))
	codingEnd = sorted(set(codingEnd))
	score = sorted(set(score))
	words12 = sorted(set(words12))
	words13 = sorted(set(words13))
	words14 = sorted(set(words14))
	words15 = sorted(set(words15))
	exonCount = len(exonIntervals)
	string = "{} {} {} {} {} {} {} {} {} {} {} {} {} {} {} {}".format(geneName, words1, words2, words[3], strand, transcriptStart, transcriptEnd, codingStart, codingEnd, exonCount, exonIntervals, score, words12, words13, words14, words15)
	print(string, file = outputFile, end = '\n')

if __name__ == "__main__": main() 
