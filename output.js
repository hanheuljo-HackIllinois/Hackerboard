function outputFiles(files) {

	// Organize Files
	var typecount = {};
	var total_size = 0;
	var total_files = 0;
	for (i = 0; i < files.length; i++) {
		var name_array = files[i].path.split("/");
		var file_name = name_array[name_array.length - 1];
		var file_array = file_name.split(".");
		var file_type = file_array[file_array.length - 1];
		if (file_type == file_name || file_type == "gitignore" || file_type == "md") {file_type = "other";}
		total_size += files[i].size;
		total_files++;
		if (typecount[file_type] == undefined) {
			typecount[file_type] = {
										file_type: file_type,
										count: 1,
										size: files[i].size,
										percent: 0};	// change to json?
		} else {
			typecount[file_type].count++;
			typecount[file_type].size += files[i].size;
		}
    }

//    console.log(typecount);

    var type_array = [];

	for (var key in typecount) {
		if (typecount.hasOwnProperty(key)) {
			typecount[key].percent = (typecount[key].size / total_size) * 100;	// typecount[key][2] = %
			type_array.push(typecount[key]);
		}
	}

    // Start Drawing
	var w = 450;
	var h = 200;
	var axis = 30;
	var barPadding = 1;

	d3.select("#fb_text").append("h4").text("You have a total of " + total_files + " files on your github repositories.");
	var files_svg = d3.select("#files")
						.append("svg")
						.attr("width", w + axis)
			            .attr("height", h + 2 * axis);

	var file_scale = d3.scale.linear()
						.domain([0, d3.max(type_array, function(d) { return d.count; })])
						.range([0, h]);

	var file_scale_axis = d3.scale.linear()
						.domain([0, d3.max(type_array, function(d) { return d.count; })])
						.range([h, 0]);

	var file_y = d3.svg.axis().scale(file_scale_axis).orient("right");

	files_svg.selectAll("rect")
			   .data(type_array)
			   .enter()
			   .append("rect")
			   .attr("y", function(d) {
			   	return h - file_scale(d.count) + axis;
			   })
			   .attr("width", w / type_array.length - barPadding)
			   .attr("height", function(d) {
			   	return file_scale(d.count);
			   })
			   .attr("x", function(d, i) {
				    return i * (w / type_array.length);
				});

	files_svg.selectAll("text")
			.data(type_array)
			.enter()
			.append("text")
			.text(function(d) {
				return d.file_type;
			})
			.attr("y", function(d) {
				return h + axis / 2 + axis;
			})
			.attr("x", function(d, i) {
				return i * (w / type_array.length) + (w / type_array.length - barPadding) / 2;
			})
			.attr("text-anchor", "middle");

	files_svg.append("g").attr("class", "axis")
    					.attr("transform", "translate(" + w + ", " + axis + ")")
    					.call(file_y);

	d3.select("#fb_text").append("h4").text("And all the files that you uploaded to github add up to a total of " + total_size + " bytes");
	var byte_svg = d3.select("#bytes")
			            .append("svg")
			            .attr("width", w + axis)
			            .attr("height", h + 2 * axis);

	var byte_scale = d3.scale.linear()
						.domain([0, d3.max(type_array, function(d) { return d.percent; })])
						.range([0, h]);

	var byte_scale_axis = d3.scale.linear()
						.domain([0, d3.max(type_array, function(d) { return d.percent * total_size; })])
						.range([h, 0]);

	var byte_y = d3.svg.axis().scale(byte_scale_axis).orient("right"); // Improve this, try scale first

	byte_svg.selectAll("rect")
			   .data(type_array)
			   .enter()
			   .append("rect")
			   .attr("y", function(d) {
			   	return h - byte_scale(d.percent) + axis;
			   })
			   .attr("width", w / type_array.length - barPadding)
			   .attr("height", function(d) {
			   	return byte_scale(d.percent);
			   })
			   .attr("x", function(d, i) {
				    return i * (w / type_array.length);
				});

	byte_svg.selectAll("text")
			.data(type_array)
			.enter()
			.append("text")
			.text(function(d) {
				return d.file_type;
			})
			.attr("y", function(d) {
				return h + axis / 2 + axis;
			})
			.attr("x", function(d, i) {
				return i * (w / type_array.length) + (w / type_array.length - barPadding) / 2;
			})
			.attr("text-anchor", "middle");

	byte_svg.append("g").attr("class", "axis")
    					.attr("transform", "translate(" + w + ", " + axis + ")")
    					.call(byte_y);

	d3.select("#map_text").append("h4").text("If you printed all your code, side by side, using 12 point font, in a single line,");
	d3.select("#map_text").append("h4").text("the code will span a toal of " + byteToLength(total_size));
	drawMap(byteToMeter(total_size));
}

function byteToLength(bytes) {
	var cm = bytes * .4233;
	var mi = (cm * .00000621371);
	var yards = (cm * 0.0109361);
	if (mi > 1) {
		return mi.toFixed(2) + " miles";
	}
	else {
		return yards.toFixed(2) + " yards";
	}

	/**
	if (cm > 1000000) {
		return (cm / 1000000).toFixed(2) + " kilometers";
	}
	if (cm > 1000) {
		return (cm / 1000).toFixed(2) + " meters";
	}
	return cm + " centimeters";
	*/
}

function byteToMeter(bytes) {
	return (bytes * .4233) / 1000;
}

function outputPunchcard(punchcard) {
	var days = [0, 0, 0, 0, 0, 0, 0];
	var hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//	console.log(hours.length);
	var total_commits = 0;
	for (i = 0; i < punchcard.length; i++) {
		days[punchcard[i][0]] += punchcard[i][2];
		hours[punchcard[i][1]] += punchcard[i][2];
		total_commits += punchcard[i][2];
	}

//	console.log(hours);

//	console.log($("#hours"));
	var w = 450;
	var h = 200;
	var axis = 30;
	var barPadding = 1;

	d3.select("#pc_text").append("h4").text("So far, you have made a total of " + total_commits + " made to your repositories");

	var days_svg = d3.select("#days")
			            .append("svg")
			            .attr("width", w + axis)
			            .attr("height", h + 2 * axis);

	var days_scale = d3.scale.linear()
						.domain([0, d3.max(days)])
						.range([0, h]);

	var days_scale_axis = d3.scale.linear()
						.domain([0, d3.max(days)])
						.range([h, 0]);

	var days_y = d3.svg.axis().scale(days_scale_axis).orient("right");

	days_svg.selectAll("rect")
				.data(days)
				.enter()
				.append("rect")
				.attr("y", function(d) {
					return h - days_scale(d) + axis;
				})
				.attr("width", w / days.length - barPadding)
				.attr("height", function(d) {
					return days_scale(d);
				})
				.attr("x", function(d, i) {
				    return i * (w / days.length);
				});

	days_svg.selectAll("text")
				.data(days)
				.enter()
				.append("text")
				.text(function(d, i) {
					if (i == 0) {return "Sun";}
					if (i == 1) {return "Mon";}
					if (i == 2) {return "Tues";}
					if (i == 3) {return "Wed";}
					if (i == 4) {return "Thu";}
					if (i == 5) {return "Fri";}
					if (i == 6) {return "Sat";}
				})
				.attr("y", function(d) {
					return h + axis / 2 + axis;
				})
				.attr("x", function(d, i) {
				    return i * (w / days.length) + (w / days.length - barPadding) / 2;
				})
				.attr("text-anchor", "middle");

	days_svg.append("g").attr("class", "axis")
    					.attr("transform", "translate(" + w + ", " + axis + ")")
    					.call(days_y);

	var hours_svg = d3.select("#hours").append("svg").attr("width", w + axis).attr("height", h + 2 * axis);

	var hours_scale = d3.scale.linear()
						.domain([0, d3.max(hours)])
						.range([0, h]);

	var hours_scale_axis = d3.scale.linear()
						.domain([0, d3.max(hours)])
						.range([h, 0]);

	var hours_y = d3.svg.axis().scale(hours_scale_axis).orient("right");

	hours_svg.selectAll("rect")
				.data(hours)
				.enter()
				.append("rect")
				.attr("width", w / hours.length - barPadding)
				.attr("height", function(d) {
					return hours_scale(d);
				})
				.attr("y", function(d) {
					return h - hours_scale(d) + axis;
				})
				.attr("x", function(d, i) {
					return i * (w / hours.length);
				});

	hours_svg.selectAll("text")
				.data(hours)
				.enter()
				.append("text")
				.text(function(d, i) {
					if (i == 0) {return "0";}
					if (i == 3) {return "3";}
					if (i == 6) {return "6";}
					if (i == 9) {return "9";}
					if (i == 12) {return "12";}
					if (i == 15) {return "15";}
					if (i == 18) {return "18";}
					if (i == 21) {return "21";}
				})
				.attr("y", function(d) {
					return h + axis / 2 + axis;
				})
				.attr("x", function(d, i) {
					return i * (w / hours.length);// + (w / hours.length - barPadding) / 2;
				});

	hours_svg.append("g").attr("class", "axis")
    					.attr("transform", "translate(" + w + ", " + axis + ")")
    					.call(hours_y);
}