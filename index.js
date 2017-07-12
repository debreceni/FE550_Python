
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    

	function drawplyrattr(x,y,fillcolor) {
	//debugger;
		var canvas = document.getElementById("attrMap");
		var ctx = canvas.getContext("2d");
		
		ctx.beginPath();
		ctx.font = '18px serif';
		ctx.ellipse(x, y, 35, 20, 0, 0, 2 * Math.PI);
		ctx.fillStyle = tmpcolor[fillcolor];
		ctx.fill();
		ctx.strokeText(fillcolor + '%', x-15,y+5);		
		ctx.stroke();

	}
	
	function hex (c) {
	  var s = "0123456789abcdef";
	  var i = parseInt (c);
	  if (i == 0 || isNaN (c))
		return "00";
	  i = Math.round (Math.min (Math.max (0, i), 255));
	  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
	}

	/* Convert an RGB triplet to a hex string */
	function convertToHex (rgb) {
	  return '#' + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
	}

	/* Remove '#' in color hex string */
	function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

	/* Convert a hex string to an RGB triplet */
	function convertToRGB (hex) {
	  var color = [];
	  color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
	  color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
	  color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
	  return color;
	}

	function generateColor(colors) {
		
		//always start with 100
		colorlen = 100;
		colorlen = colors.length==2?100:Math.floor(colorlen/(colors.length-1));
		
		colorcnt = 0;	
		colorary = [];
	//	debugger;
		//colors should be an array in order
		for(j=0; j < colors.length-1; j++) {
			tmpary = generategradeColor(colors[j],colors[j+1], colorlen);
			//debugger;
			colorary = _.union(colorary,tmpary);
			colorcnt += colorlen;
			if(j==colors.length-3)
				colorlen = 100- colorcnt;
			}
			//debugger;
		return colorary;
	}
	
	function generategradeColor(colorStart,colorEnd, gradlen){

		// The beginning of your gradient
		var start = convertToRGB (colorStart);    

		// The end of your gradient
		var end   = convertToRGB (colorEnd);    

		// The number of colors to compute
		var len = gradlen;

		//Alpha blending amount
		var alpha = 0.0;

		var saida = [];
		
		for (i = 0; i < len; i++) {
			var c = [];
			alpha += (1.0/len);
			
			c[0] = end[0] * alpha + (1 - alpha) * start[0];
			c[1] = end[1] * alpha + (1 - alpha) * start[1];
			c[2] = end[2] * alpha + (1 - alpha) * start[2];

			saida.push(convertToHex (c));
			
		}		
		
		return saida;
		
	}

	var tmpcolor = generateColor(["#FF0000","#FFFF00","#008000"]);
//debugger;
//	for (cor in tmp) {
//	  $('#result_show').append("<div style='padding:8px;color:#FFF;background-color:"+tmp[cor]+"'>COLOR "+cor+"° - "+tmp[cor]+"</div>")
	 
//	}
	
	$scope.renderattributes = function (idx) {
	
		$.getJSON( "https://debreceni.github.io/FE550_Python/Data/plyrattr.json", function( data ) {
			var items = [];
			tmpdata = data[idx];
			//debugger;
			
			
			var xcoor = 0;
			var ycoor = 30;
			
			//Add player in the middlectx.beginPath();
			var canvas = document.getElementById("attrMap");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			drawplyrattr(xcoor+130,ycoor+75,Math.round(tmpdata['volleys']));//volleys
			drawplyrattr(xcoor+110,ycoor+160,Math.round(tmpdata['crossing']));//Crossing
			drawplyrattr(xcoor+170,ycoor+240,Math.round(tmpdata['long_passing']));//Long Passing
			drawplyrattr(xcoor+320,ycoor+240,Math.round(tmpdata['short_passing']));//Short Passing
			drawplyrattr(xcoor+380,ycoor+160,Math.round(tmpdata['finishing']));//Finishing
			drawplyrattr(xcoor+360,ycoor+75,Math.round(tmpdata['dribbling']));//Dribbling
			drawplyrattr(xcoor+245,ycoor+40,Math.round(tmpdata['ball_control']));//Ball Control
			drawplyrattr(xcoor+245,ycoor+140,Math.round(tmpdata['overall_rating']));//Ball Control
			
			//Add player in the middlectx.beginPath();
			var canvas = document.getElementById("attrMap");
			var ctx = canvas.getContext("2d");
			
			ctx.beginPath();
			ctx.font = '18px serif';
			//ctx.ellipse(xcoor+245, ycoor+140, 35, 20, 0, 0, 2 * Math.PI);
			//ctx.fillStyle = '#8ED6FF';
			//ctx.fill();
			//ctx.strokeText(dcllbl[idx], xcoor+235,ycoor+145);		
			//ctx.stroke();
			// Add Labels
			ctx.fillStyle = '#000000';
			ctx.fillText('Crossing',xcoor+5,ycoor+165);
			ctx.fillText('Finishing',xcoor+425,ycoor+165);
			ctx.fillText('Short Passing',xcoor+275,ycoor+275);
			ctx.fillText('Long Passing',xcoor+120,ycoor+275);
			ctx.fillText('Volleys',xcoor+35,ycoor+80);
			ctx.fillText('Dribbling',xcoor+400,ycoor+80);
			ctx.fillText('Ball Control',xcoor+205,ycoor+15);
			
			var chrtLbl = { overall_rating : 'Rating',crossing:'Crossing', finishing:'Finishing',short_passing:'Short Passing',volleys:'Volleys',
				dribbling:'Dribbling', long_passing:'Long Passing', ball_control:'Ball Control'};
			
			
			var svg = dimple.newSvg("#decilechrt", 500, 400);
			var chartData = {};
			dcllbl = {1:"10th",2:"9th",3:"8th",4:"7th",5:"6th",6:"5th",7:"4th",8:"3rd",9:"2nd",10:"1st"};
			mykeys = _.keys(data[0]);
			
			chartData = _.chain(data)
					//.reduce(function (nobj,oobj){return 
					//	nobj += _.map(oobj,function(val,key){return {Skill:key, Data:val}})},{})
					.map(function(val,key){
						var dec = dcllbl[val['decile']];
						var overallr = val['overall_rating'];
						return _.chain(val)
								.omit(['decile','overall_rating'])
								.map(function(val,key){return {Skill:key, Data:(val/overallr)*100,Decile:"Decile " + dec}})
								.value();
								})
					.flatten()
					.value();
			
			var minrank = _.reduce(chartData, function(prev, curr) {
					return prev < curr.Data ? prev : curr.Data;
				},100);
			 var maxrank = _.reduce(chartData, function(prev, curr) {
					return prev > curr.Data ? prev : curr.Data;
				},0);
			
			var myChart = new dimple.chart(svg,chartData);
			 myChart.setBounds(20, 30, 400, 300);
			 var x =  myChart.addCategoryAxis("x", "Skill");
		
			 var y = myChart.addMeasureAxis("y", "Data");
			y.overrideMin = minrank;
			y.overrideMax = maxrank;
			y.showGridlines = false;
			y.ticks = 15;
				
			
			var s = myChart.addSeries("Decile", dimple.plot.line);
			//s.lineWeight = 1;
			//s.barGap = 0.05;	
			s.interpolation = "cardinal";
			x.addOrderRule(['overall_rating','ball_control','dribbling','finishing','short_passing','long_passing','crossing','volleys']);
			myChart.addLegend(430, 20, 100, 300, "left");
			svg.append("text")
			.attr("x", 200)             
			.attr("y", 30)
			.attr("text-anchor", "middle")  
			.style("font-size", "16px") 
			.style("text-decoration", "underline")  
			.text("Skill Relative to Overall Score");
			
			  myChart.draw();
		x.shapes.selectAll("text")
				.text(function (d) { 
					  	   return chrtLbl[d];
						   }
					  ).attr("transform", "rotate(30)");	
		//x.shapes.selectAll("text");
		
		});
		
		
		
	}
	
	
	$scope.renderattributes(10);
	
	$('.deciles input[type=radio]').on('change', function() {
		$scope.renderattributes(this.value);
		
	});
	
	$.getJSON( "https://debreceni.github.io/FE550_Python/Data/top100players.json").then( function( plydata ) {
		
		var svg = dimple.newSvg("#topplayerschart", 600, 500);
		var chartData = {};
		var chrtLbl = { overall_rating : 'Rating',crossing:'Crossing', finishing:'Finishing',short_passing:'Short Passing',volleys:'Volleys',
				dribbling:'Dribbling', long_passing:'Long Passing', ball_control:'Ball Control'};
		var mykeys = ['ball_control','dribbling','finishing','short_passing','long_passing','crossing','volleys'];
			debugger;
			chartData = _.chain(plydata)
					.map(function(val,key){
						var overallr = val['overallrank'];
						return _.chain(val)
								.pick(mykeys)
								.map(function(val,key){return {Skill:chrtLbl[key], Data:val,Rank:overallr}})
								.value();
								})
					.flatten()
					.value();
		
		var maxData = _.chain(chartData)
					.groupBy(function(g) { return g.Skill;})
					.map(function(val,key) {
						var maxval = _.reduce(val,function(prev, curr) {
							return prev > curr.Data ? prev : curr.Data;
							},0);
							return {Skill:key, Data:maxval, Rank:0};
					})
					.value();
		
		var minrank = _.reduce(chartData, function(prev, curr) {
					return prev < curr.Data ? prev : curr.Data;
				},100);
		 var maxrank = _.reduce(chartData, function(prev, curr) {
				return prev > curr.Data ? prev : curr.Data;
			},0);
		 var myChart = new dimple.chart(svg, chartData);
        myChart.setBounds(30, 30, 550, 400)
        var x =  myChart.addCategoryAxis("x", "Skill");
		
		var y = myChart.addMeasureAxis("y", "Data");
			y.title = "Rating"
			y.overrideMin = minrank;
			y.overrideMax = maxrank;
			y.showGridlines = false;
			y.hidden = true;
		//	y.ticks = 15;
		var s = myChart.addSeries("Skill", dimple.plot.bar);
		s.aggregate = dimple.aggregateMethod.avg;
		var t = myChart.addSeries("Skill", dimple.plot.bar);
		t.aggregate = dimple.aggregateMethod.max;
        
		 s.afterDraw = function (shape, data) {
        // Get the shape as a d3 selection
        var s = d3.select(shape),
          rect = {
            x: parseFloat(s.attr("x")),
            y: parseFloat(s.attr("y")),
            width: parseFloat(s.attr("width")),
            height: parseFloat(s.attr("height"))
          };
        // Only label bars where the text can fit
        if (rect.height >= 8) {
          // Add a text label for the value
          svg.append("text")
            // Position in the centre of the shape (vertical position is
            // manually set due to cross-browser problems with baseline)
            .attr("x", rect.x + rect.width / 2)
            .attr("y", rect.y + rect.height / 2 + 3.5)
            // Centre align
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-family", "sans-serif")
            // Make it a little transparent to tone down the black
            .style("opacity", 0.6)
            // Prevent text cursor on hover and allow tooltips
            .style("pointer-events", "none")
            // Format the number
            .text(d3.format(".1f")(data.yValue) + "%");
        }
		
      };
		 
		t.afterDraw = function (shape, data) {
        // Get the shape as a d3 selection
        var s = d3.select(shape),
          rect = {
            x: parseFloat(s.attr("x")),
            y: parseFloat(s.attr("y")),
            width: parseFloat(s.attr("width")),
            height: parseFloat(s.attr("height"))
          };
        // Only label bars where the text can fit
        if (rect.height >= 8) {
          // Add a text label for the value
          svg.append("text")
            // Position in the centre of the shape (vertical position is
            // manually set due to cross-browser problems with baseline)
            .attr("x", rect.x + rect.width / 2)
            .attr("y", rect.y + 30)
            // Centre align
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-family", "sans-serif")
            // Make it a little transparent to tone down the black
            .style("opacity", 0.6)
            // Prevent text cursor on hover and allow tooltips
            .style("pointer-events", "none")
            // Format the number
            .text(d3.format(".1f")(data.yValue) + "%");
        }
		
      };
        myChart.draw();
	});
		
});

