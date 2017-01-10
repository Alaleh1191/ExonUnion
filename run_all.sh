#!/usr/bin/env bash

lineMax="0"

while getopts i:dg:c:l: option
do
        case "${option}"
        in
                i) inputFile=${OPTARG};;
                g) geneCol=${OPTARG};;
                c) chrCol=${OPTARG};;
                l) lineMax=$OPTARG;;
                d) deleteFiles=1
        esac
done

if [ ! -z $deleteFiles ]
then
    rm -f "Results/geneIdSorted.bedGraph"
    rm -f "Results/exonUnion.txt"
    exit 0
fi


if [ -z "$inputFile" ]
then
    echo "Please provide a filename using -i option"
    exit 1
fi

if [ ! -f "$inputFile" ]
then
    echo "No file found"
    exit 2
fi

if [ -z "$geneCol" ] && [ -z "$chrCol" ]
then
    python ./sort.py "$inputFile"
else
    python ./sort.py "$inputFile" -g "$geneCol" -c "$chrCol"
fi

python ./exonU.py


python ./create_json.py "Results/exonUnion.txt" "Results/geneIdSorted.bedGraph" "$lineMax"