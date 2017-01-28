var width = 960;
var numtext = 0;

// open the json file			
d3.json('Results/result.json', function (error, dataAgg){
	
	// Get the scale of the x-Axis based on start and end of largest gene
	var xScale = d3.scale.linear()
        .domain(
         	[0,dataAgg.options.end-dataAgg.options.start]
        )
        .range([0,800]);


    var height = window.innerHeight - 100;


	var zoom = d3.behavior.zoom()
	    .x(xScale)
	    .on("zoom", zoomed);



    var drag = d3.behavior.drag()
     .on("drag", dragging)


	// Create the svg
	var svg = d3.select("body")
		.append("svg")
		.attr("class" , "svg")
	    .attr("width", width)
	    .attr("height", height)
	  	.append("g")
	    .call(zoom)
	    .call(drag)
	  	.append("g")
	  	.attr("class", "g");
	    

    svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", width)
	    .attr("height", dataAgg.options.height)


	var yloc = 12; // y location of the line representing the gene
	var yex = 9; // y location of the rectangle representing the exon
	var yend = 11; // y location of the rectangle representing the space from last exon to end of gene

	var text = svg.append("g").attr("class", "text");

	for(var i = 0; i < dataAgg.values.length; i++){

		// Blue line representing the gene
		svg.append("line")
            .attr("x1", 0)
            .attr("y1", yloc)
            .attr("x2", xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx))
            .attr("y2", yloc)
            .attr("stroke-width", 2)
			.attr("stroke", "#3498db");

		// The name of the gene
		d3.select(".svg").append("text")
			.attr("class", "vals")
			.attr("x", xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx))
            .attr("y", yloc+4)
            .text(dataAgg.values[i].name)
            .attr("font-family", "sans-serif")
            .style("font-size", "10px")
            .style('pointer-events', 'none');

        numtext++;

		// The unionized exons plotting
		for(var j = 0; j < dataAgg.values[i].union.exonStart.length; j++){

			svg.append("rect")
		        .attr("x", xScale(dataAgg.values[i].union.exonStart[j]) - xScale(dataAgg.values[i].union.startx))
		        .attr("y", yex)
		        .attr("width", xScale(dataAgg.values[i].union.exonEnd[j]) - xScale(dataAgg.values[i].union.exonStart[j]))
		        .attr("height", 6)
		        .style("fill", "red");
        }	
        
        // the end of the last exon
        var end = d3.max(dataAgg.values[i].union.exonEnd)

        // The start of the first exon 
		var start = d3.min(dataAgg.values[i].union.exonStart)
        
        // Distance between the end of the gene and the end of the last exon
        svg.append("rect")
            .attr("x", xScale(end) - xScale(dataAgg.values[i].union.startx))
            .attr("y", 9+5*10)
            .attr("width", xScale(dataAgg.values[i].union.endx) - xScale(end))
            .attr("height", 6)
            .style("fill", "green");

        // Distance between the start of the gene and the start of first exon
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 9+5*10)
            .attr("width", xScale(start) - xScale(dataAgg.values[i].union.startx))
            .attr("height", 6)
            .style("fill", "green");

        // increment y positions
		yex += 10;
        yend += 10;
		yloc += 10;

		//Plotting individual transcripts
		for(var j = 0; j < dataAgg.values[i].transcripts.length; j++){

			// The line representing each transcript
			svg.append("line")
                .attr("x1", xScale(dataAgg.values[i].transcripts[j].startx) - xScale(dataAgg.values[i].union.startx))
                .attr("y1", yloc)
                .attr("x2", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
                .attr("y2", yloc)
                .attr("stroke-width", 1)
				.attr("stroke", "#3498db");

			// The name of the transcript
			d3.select(".svg").append("text")
				.attr("class", "vals")
				.attr("x", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
                .attr("y", yloc+4)
                .text(dataAgg.values[i].transcripts[j].name)
                .attr("font-family", "sans-serif")
                .style("font-size", "10px")
                .style('pointer-events', 'none');

            numtext++;

            // Plotting exons of each transcript 
			for(var k = 0; k<dataAgg.values[i].transcripts[j].exonStart.length; k++){
				svg.append("rect")
                    .attr("x", xScale(dataAgg.values[i].transcripts[j].exonStart[k]) - xScale(dataAgg.values[i].union.startx))
                    .attr("y", yex)
                    .attr("width", xScale(dataAgg.values[i].transcripts[j].exonEnd[k]) - xScale(dataAgg.values[i].transcripts[j].exonStart[k]))
                    .attr("height", 6)
                    .style("fill", "orange");
            }

            // The end of the last exon
            var end = d3.max(dataAgg.values[i].transcripts[j].exonEnd)
            // The start of the first exon
			var start = d3.min(dataAgg.values[i].transcripts[j].exonStart)

			// Distance between the end of the gene and the end of the last exon
			svg.append("rect")
                .attr("x", xScale(end) - xScale(dataAgg.values[i].union.startx))
                .attr("y", yend)
                .attr("width", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(end))
                .attr("height", 2)
                .style("fill", "green");

            // Distance between the start of the gene and the start of first exon
        	svg.append("rect")
                .attr("x", xScale(dataAgg.values[i].transcripts[j].startx) - xScale(dataAgg.values[i].union.startx))
                .attr("y", yend)
                .attr("width", xScale(start) - xScale(dataAgg.values[i].transcripts[j].startx))
                .attr("height", 2)
                .style("fill", "green");
            
            // increment y pos
            yex += 10;
            yend += 10;
			yloc += 10;
		}
	}

	// array holding the position of text fields, used for zooming
	var vals = [];
	var valsY = []; 
	var scale = 1;
	var yTranslate = 0;

	function zoomed() {
		// if not dragging
		if(d3.event.sourceEvent.type == "wheel"){
			//zoom svg
			translate = [d3.event.translate[0], yTranslate];
			svg.attr("transform", "translate(" + translate + ")scale(" + d3.event.scale + ", 1)");
	
			// zoom behavior of texts 
			d3.selectAll(".vals").each(function(i, d){
				
				if(vals.length < numtext){
					vals[d] = d3.select(this).attr("x");
					valsY[d] = d3.select(this).attr("y");
				} 
			
				val = vals[d] * d3.event.scale + d3.event.translate[0];
				valY = Number(valsY[d]) + yTranslate;
				d3.select(this).attr("x", val);
				d3.select(this).attr("y", valY);

			})
			scale = d3.event.scale;
		}
		
	}

	

	function dragging(d) {

	  	// translate the svg
	  	var t = d3.transform(svg.attr("transform")).translate;
	  	yTranslate = t[1] + d3.event.dy;
      	svg.attr("transform", "translate(" + [t[0] + d3.event.dx, t[1] + d3.event.dy] + ")scale(" + scale + ", 1)");

      	// translate behavior of texts 
		d3.selectAll(".vals").each(function(i, d){
			
			if(vals.length < numtext){
				vals[d] = d3.select(this).attr("x");
				valsY[d] = d3.select(this).attr("y");
			} 
		
			val = vals[d] * scale + t[0] + d3.event.dx;
			valY = Number(valsY[d]) + yTranslate;
			d3.select(this).attr("x", val);
			d3.select(this).attr("y", valY);

		})
	};

})
			


			


			
