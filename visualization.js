var width = 960;
var numtext = 0;
//var fixBug;

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

	var positionLast;
	var transcriptLast;


    var drag = d3.behavior.drag()
    .on("dragstart", function() {
	  d3.event.sourceEvent.stopPropagation(); // silence other listeners
	})
     .on("drag", dragging);

     //.on("dragend", dragging)

    // stores which track is the first on the viewport
    var startID = 1;
    
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
	//var yex = 9; // y location of the rectangle representing the exon
	//var yend = 11; // y location of the rectangle representing the space from last exon to end of gene

	var text = svg.append("g").attr("class", "text");
	
	// figure out how many tracks fit in the window
	numTracks = Math.ceil((height - 2)/10);


		// array holding the position of text fields, used for zooming
	var vals = [];
	var valsY = []; 
	var textOrder = [];
	var lasti, lastj, lastID = 0;
	redraw(true, numTracks, true);
	lastID=numTracks;
	positionLast = numTracks * 10 + 6;


	var scale = 1;
	var yTranslate = 0;

	function zoomed() {
		// if not dragging
		if(d3.event.sourceEvent.type == "wheel"){
			//zoom svg
			translate = [d3.event.translate[0], yTranslate];
			svg.attr("transform", "translate(" + translate + ")scale(" + d3.event.scale + ", 1)");
	
			// zoom behavior of texts 
		/*	d=0;
			for(i=startID; i <= lastID; i++){
				val = vals[d] * d3.event.scale + d3.event.translate[0];
				valY = Number(valsY[d]) + yTranslate;
				d3.selectAll(".vals._"+i).attr("x", val);
				d3.selectAll(".vals._"+i).attr("y", valY);
				d++;
			}*/
			d3.selectAll(".vals").each(function(i, d){
				
			//	if(vals.length < numtext){
			//		vals[d] = d3.select(this).attr("x");
			//		valsY[d] = d3.select(this).attr("y");
			//	} 
			
				val = vals[d] * d3.event.scale + d3.event.translate[0];
				valY = Number(valsY[d]) + yTranslate;
				d3.select(this).attr("x", val);
				d3.select(this).attr("y", valY);

			})
			scale = d3.event.scale;
		}
		
	}

	function dragging2(d)
	{
		console.log(d3.event.dy);
	}
	

	var drawn = [];

	function dragging(d) {
	//	console.log("In dragging dy = " + d3.event.dy)

	  	// translate the svg
	  	var t = d3.transform(svg.attr("transform")).translate;
	  	yTranslate = t[1] + d3.event.dy;
      	svg.attr("transform", "translate(" + [t[0] + d3.event.dx, t[1] + d3.event.dy] + ")scale(" + scale + ", 1)");

      /*	var d=0;
      	for(i=startID; i <= lastID; i++){
				val = vals[d] * scale + t[0] + d3.event.dx;
				valY = Number(valsY[d]) + yTranslate;
				d3.selectAll(".vals._"+i).attr("x", val);
				d3.selectAll(".vals._"+i).attr("y", valY);
				d++;
			}*/
      	// translate behavior of texts 
		d3.selectAll(".vals").each(function(i, d){
			
			//if(vals.length < numtext){
			//	vals[d] = d3.select(this).attr("x");
			//	valsY[d] = d3.select(this).attr("y");
			//} 
		
			val = vals[d] * scale + t[0] + d3.event.dx;
			valY = Number(valsY[d]) + yTranslate;
			d3.select(this).attr("x", val);
			d3.select(this).attr("y", valY);

		})

		// call redraw with which to be redrawn

		if(d3.event.dy < 0){ // add to the end, delete from top
			//calculate the location of last track
			//console.log(d3.event);
			var posLast = Number(d3.selectAll(".vals._"+lastID).attr("y")) + 12;
			//console.log(pos);

			//testing
			count = Math.ceil((-yTranslate + height - posLast)/10);//Math.abs
		//	count = Math.ceil((-yTranslate + height - fixBug)/10);

			//console.log("lastID" + valsY[valsY.length-1]);
			//console.log(fixBug-10)
			if(count >= 1 && lasti != dataAgg.values.length ) {
				
				//console.log("fixBug is "+fixBug)
				//sucessfully added to bottom
			//	console.log("dragging last id: " + lastID)
				var res = d3.selectAll("line._"+lastID).attr("id").split(",");
				console.log(drawn);
				//drawn.push(res);

				console.log(res);
				console.log("count is "+count)

				var j = Number(res[1])+1;
				var i = Number(res[0]);

				drawn.push(res[0]+res[1]);

				if(j==dataAgg.values[i].transcripts.length){
					i++;
					j=-1;
				}
				
			//	console.log("Starting redraw from dragging level");
				redraw(false, count, true);
			//	console.log("Ended redraw from dragging level");
				//lastID++;
				//redraw(lasti, lastj, count, true);

			}
			
			var posFirst = Number(d3.selectAll("line._"+startID).attr("y1")) + 5;
			//console.log("Start ID is now " + startID + " and its position is " + posFirst)
			//console.log("yTranslate is "+ (-yTranslate))
			while(posFirst < -yTranslate){//Math.abs(yTranslate)
				console.log("deleting " + startID)
				index = textOrder.indexOf(startID);
				d3.selectAll("line._"+startID).remove();
				d3.selectAll("rect._"+startID).remove();
				d3.selectAll(".vals._"+startID).remove();
				console.log("index that I am deleting is "+index)
				vals.splice(index, 1);
				textOrder.splice(index, 1);
				valsY.splice(index,1);
			//	vals.shift();
			//	valsY.shift();

				//d3.selectAll(".vals._"+startID).style("opacity", 0);
				startID++;
				console.log("Now StartID is "+startID)
				posFirst = Number(d3.selectAll("line._"+startID).attr("y1")) + 5;
			}
			

		} else if(d3.event.dy > 0){ // add to beginning, delete from buttom
			console.log("dragging up");
			console.log(yTranslate);
			//console.log(yTranslate);
			console.log(startID);
			var posStart = Number(d3.selectAll("line._"+startID).attr("y1")) - 5;
			while(posStart > Math.abs(yTranslate) && startID != 1){
			//	console.log("must add "+posStart+ " "+Math.abs(yTranslate))
			//	startID--;
				
				var res = d3.selectAll("line._"+startID).attr("id").split(",");
				console.log(res);
				//redraw()
				var j = Number(res[1])-1;
				var i = Number(res[0]);

				if(j==-2){
					i--;
					j=dataAgg.values[i].transcripts.length-1;
				}
				
				redraw(false, 1, false);
				startID--;
				console.log("drawing"+startID)
				posStart = Number(d3.selectAll("line._"+startID).attr("y1")) - 5;
				break;
			}

			var posLast = Number(d3.selectAll("line._"+lastID).attr("y1")) - 5;
			while(posLast > (-yTranslate + height)){
				console.log("deleting last id" + lastID);
				index = textOrder.indexOf(lastID);
				d3.selectAll("line._"+lastID).remove();
				d3.selectAll("rect._"+lastID).remove();
				d3.selectAll(".vals._"+lastID).remove();
				console.log("index that I am deleting is "+index)
				vals.splice(index, 1);
				textOrder.splice(index, 1);
				valsY.splice(index,1);
			//	vals.shift();
			//	valsY.shift();

				//d3.selectAll(".vals._"+startID).style("opacity", 0);
				lastID--;
				posLast = Number(d3.selectAll("line._"+lastID).attr("y1")) + 5;
			}

		}

		//console.log("End of dragging with dy = " + d3.event.dy);
		// delete tracks no longer in the viewport
	};


	// adds the new tracks in viewports and deletes the ones coming out
	function redraw(empty, count, addToEnd){
		var localcount = 0;

		if(empty){
			starti = 0;
			startj = -1;
		} else if(addToEnd){
			res = d3.selectAll("line._"+lastID).attr("id").split(",");
			startj = Number(res[1])+1;
			starti = Number(res[0]);
			if(startj==dataAgg.values[starti].transcripts.length){
				starti++;
				startj=-1;
			}
		} else {
			var res = d3.selectAll("line._"+startID).attr("id").split(",");
			console.log(res);
			//redraw()
			var startj = Number(res[1])-1;
			var starti = Number(res[0]);

			if(startj==-2){
				starti--;
				startj=dataAgg.values[starti].transcripts.length-1;
			}
		}
		
		


		
		console.log("Starting redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);
	//	var num = 1; // counts number of tracks
		


		var textPos;
		//var localcount;
		if(addToEnd){ // if adding to end
			num = lastID+1;
			console.log("num"+num);
			if(num == 1){
				textPos = 4;
			}else{
				textPos = Number(d3.selectAll(".vals._"+lastID).attr("y"));
				//console.log(textPos);
				yloc = Number(d3.selectAll("line._"+lastID).attr("y1"))+10;
			}
			
		} else{//if adding to beginning
			num = startID-1;
			textPos = Number(d3.selectAll(".vals._"+startID).attr("y"))-22;
			console.log("text Pos"+textPos)
			console.log("starti"+starti);
			console.log("j"+startj)
			yloc = Number(d3.selectAll("line._"+startID).attr("y1"))-10;

		}
		yex = yloc-3;
		yend = yloc-1;

		if(startj != -1){ // in the middle of transcripts of a gene
			//Plotting individual transcripts
			for(var j = startj; j < dataAgg.values[starti].transcripts.length; j++){
				console.log("For loop in redraw i "+starti+ " j"+j)
				// The line representing each transcript
				svg.append("line")
					.attr("class", "_"+num)
	                .attr("x1", xScale(dataAgg.values[starti].transcripts[j].startx) - xScale(dataAgg.values[starti].union.startx))
	                .attr("y1", yloc)
	                .attr("x2", xScale(dataAgg.values[starti].transcripts[j].endx) - xScale(dataAgg.values[starti].union.startx))
	                .attr("y2", yloc)
	                .attr("id", starti+","+j)
	                .attr("stroke-width", 1)
					.attr("stroke", "#3498db");

				// The name of the transcript
				d3.select(".svg").append("text")
					.attr("class", "vals _"+num)
					//.attr("class", num)
					.attr("x", xScale(dataAgg.values[starti].transcripts[j].endx) - xScale(dataAgg.values[starti].union.startx))
	                .attr("y", textPos+12)//yloc+4
	                .text(dataAgg.values[starti].transcripts[j].name)
	                .attr("font-family", "sans-serif")
	                .style("font-size", "10px")
	                .style('pointer-events', 'none');

	            numtext++;

	           // vals[num-1] = xScale(dataAgg.values[starti].transcripts[j].endx) - xScale(dataAgg.values[starti].union.startx);
	           // valsY[num-1] = 4+yloc;
	          // if(addToEnd){
	           		vals.push(xScale(dataAgg.values[starti].transcripts[j].endx) - xScale(dataAgg.values[starti].union.startx));
	            	valsY.push(4+yloc)
	            	textOrder.push(num);
	          /* }else {
	           		vals.unshift(xScale(dataAgg.values[starti].transcripts[j].endx) - xScale(dataAgg.values[starti].union.startx));
	            	valsY.unshift(4+yloc)
	           }*/
	            

	            // Plotting exons of each transcript 
				for(var k = 0; k<dataAgg.values[starti].transcripts[j].exonStart.length; k++){
					svg.append("rect")
						.attr("class", "_"+num)
	                    .attr("x", xScale(dataAgg.values[starti].transcripts[j].exonStart[k]) - xScale(dataAgg.values[starti].union.startx))
	                    .attr("y", yex)
	                    .attr("width", xScale(dataAgg.values[starti].transcripts[j].exonEnd[k]) - xScale(dataAgg.values[starti].transcripts[j].exonStart[k]))
	                    .attr("height", 6)
	                    .style("fill", "orange");
	            }

	            // The end of the last exon
	            var end = d3.max(dataAgg.values[starti].transcripts[j].exonEnd)
	            // The start of the first exon
				var start = d3.min(dataAgg.values[starti].transcripts[j].exonStart)

				// Distance between the end of the gene and the end of the last exon
				svg.append("rect")
					.attr("class", "_"+num)
	                .attr("x", xScale(end) - xScale(dataAgg.values[starti].union.startx))
	                .attr("y", yend)
	                .attr("width", xScale(dataAgg.values[starti].transcripts[j].endx) - xScale(end))
	                .attr("height", 2)
	                .style("fill", "green");

	            // Distance between the start of the gene and the start of first exon
	        	svg.append("rect")
	        		.attr("class", "_"+num)
	                .attr("x", xScale(dataAgg.values[starti].transcripts[j].startx) - xScale(dataAgg.values[starti].union.startx))
	                .attr("y", yend)
	                .attr("width", xScale(start) - xScale(dataAgg.values[starti].transcripts[j].startx))
	                .attr("height", 2)
	                .style("fill", "green");
	            
	            // increment y pos
	            yex += 10;
	            yend += 10;
				yloc += 10;
				textPos += 10;
				localcount++;
				/*if(addToEnd){
					localcount = num-lastID;
					//lastID = num;
				} else {
					localcount = startID-num;
				} */
				if(localcount >= count && j+1 < dataAgg.values[starti].transcripts.length){
					lasti = starti;
					lastj = j+1;
					if(addToEnd) lastID = num;
					console.log("I am done with redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);
					return;
				}
				num += 1;
			}
			/*if(addToEnd){
				localcount = num-lastID;
				//lastID = num-1;
			} else {
				localcount = startID-num;
			} */
			if(localcount >= count){
				lasti = starti + 1;
				lastj = -1;
				if(addToEnd)lastID = num-1;
				console.log("I am done with redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);
				return;
			}
			starti++;
		}
		
		for(var i = starti; i < dataAgg.values.length; i++){
			console.log("For loop in redraw i "+i+ " j"+j)
	
			// Blue line representing the gene
			svg.append("line")
				.attr("class", "_"+num)
	            .attr("x1", 0)
	            .attr("y1", yloc)
	            .attr("x2", xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx))
	            .attr("y2", yloc)
	            .attr("id", i+",-1")
	            .attr("stroke-width", 2)
				.attr("stroke", "#3498db");


			// The name of the gene
			d3.select(".svg").append("text")
				.attr("class", "vals _"+num)
				.attr("x", xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx))
	            .attr("y", 12+textPos)//yloc+4
	            .text(dataAgg.values[i].name)
	            .attr("font-family", "sans-serif")
	            .style("font-size", "10px")
	            .style('pointer-events', 'none');

	        numtext++;

	        //vals[num-1] =  (xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx));
	        //valsY[num-1] = 4+yloc;
	       // if(addToEnd){
	        	vals.push(xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx));
	        	valsY.push(4+yloc);
	        	textOrder.push(num);
	       /* } else {
	        	vals.unshift(xScale(dataAgg.values[i].union.endx) - xScale(dataAgg.values[i].union.startx));
	        	valsY.unshift(4+yloc)
	        }*/
	        

			// The unionized exons plotting
			for(var j = 0; j < dataAgg.values[i].union.exonStart.length; j++){

				svg.append("rect")
					.attr("class", "_"+num)
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
	        	.attr("class", "_"+num)
	            .attr("x", xScale(end) - xScale(dataAgg.values[i].union.startx))
	            .attr("y", 9+5*10)
	            .attr("width", xScale(dataAgg.values[i].union.endx) - xScale(end))
	            .attr("height", 6)
	            .style("fill", "green");

	        // Distance between the start of the gene and the start of first exon
	        svg.append("rect")
	        	.attr("class", "_"+num)
	            .attr("x", 0)
	            .attr("y", 9+5*10)
	            .attr("width", xScale(start) - xScale(dataAgg.values[i].union.startx))
	            .attr("height", 6)
	            .style("fill", "green");

	        // increment y positions
			yex += 10;
	        yend += 10;
			yloc += 10;
			textPos += 10;
			localcount++;
			/*if(addToEnd){
				localcount = num-lastID;
				//lastID = num;
			} else {
				localcount = startID-num;
			} */
			if(localcount >= count){
				lasti = i;
				lastj = 0;
				if(addToEnd) lastID = num;
				console.log("I am done with redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);
				return;
			}

			num += 1;
			//Plotting individual transcripts
			for(var j = 0; j < dataAgg.values[i].transcripts.length; j++){

				// The line representing each transcript
				svg.append("line")
					.attr("class", "_"+num)
	                .attr("x1", xScale(dataAgg.values[i].transcripts[j].startx) - xScale(dataAgg.values[i].union.startx))
	                .attr("y1", yloc)
	                .attr("x2", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
	                .attr("y2", yloc)
	                .attr("id", i+","+j)
	                .attr("stroke-width", 1)
					.attr("stroke", "#3498db");

				// The name of the transcript
				d3.select(".svg").append("text")
					.attr("class", "vals _"+num)
					//.attr("class", num)
					.attr("x", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
	                .attr("y", 12+textPos)//+4
	                .text(dataAgg.values[i].transcripts[j].name)
	                .attr("font-family", "sans-serif")
	                .style("font-size", "10px")
	                .style('pointer-events', 'none');

	            numtext++;

	           // vals[num-1] =  xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx);
	        	//valsY[num-1] = 4+yloc;
	        	//if(addToEnd){
	        		vals.push(xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx));
	        		valsY.push(4+yloc);
	        		textOrder.push(num);
	        	/*} else {
	        		vals.unshift(xScale(dataAgg.values[i].transcripts[j].endx) - xScale(dataAgg.values[i].union.startx))
	        		valsY.unshift(4+yloc);	
	        	}*/
	        	

	            // Plotting exons of each transcript 
				for(var k = 0; k<dataAgg.values[i].transcripts[j].exonStart.length; k++){
					svg.append("rect")
						.attr("class", "_"+num)
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
					.attr("class", "_"+num)
	                .attr("x", xScale(end) - xScale(dataAgg.values[i].union.startx))
	                .attr("y", yend)
	                .attr("width", xScale(dataAgg.values[i].transcripts[j].endx) - xScale(end))
	                .attr("height", 2)
	                .style("fill", "green");

	            // Distance between the start of the gene and the start of first exon
	        	svg.append("rect")
	        		.attr("class", "_"+num)
	                .attr("x", xScale(dataAgg.values[i].transcripts[j].startx) - xScale(dataAgg.values[i].union.startx))
	                .attr("y", yend)
	                .attr("width", xScale(start) - xScale(dataAgg.values[i].transcripts[j].startx))
	                .attr("height", 2)
	                .style("fill", "green");
	            
	            // increment y pos
	            yex += 10;
	            yend += 10;
				yloc += 10;
				textPos += 10;
				localcount++;
				/*if(addToEnd){
					localcount = num-lastID;
				//	lastID = num;
				} else {
					localcount = startID - num;
				} */
				if(localcount >= count && j+1 < dataAgg.values[i].transcripts.length){
					lasti = i;
					lastj = j+1;
					if(addToEnd) lastID = num;
					console.log("I am done with redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);
					return;
				}
				num += 1;
			}
			/*if(addToEnd){
				localcount = num-lastID;
				//lastID = num-1;
			} else {
				localcount = startID - num;
			} */
			if(localcount >= count){
				lasti = i + 1;
				lastj = -1;
				if(addToEnd) lastID = num-1;
				console.log("I am done with redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);
				return;
			}
		}

		if(addToEnd) lastID = num-1;
		console.log("I am done with redraw with starti = " + starti + "| startj = " + startj + "| count = " + count + "| addToEnd = " + addToEnd);

	}
})
			


			


			
