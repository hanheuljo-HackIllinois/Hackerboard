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
		if (file_type == file_name) {file_type = "other";}
		total_size += files[i].size;
		total_files++;
		if (typecount[file_type] == undefined) {
			typecount[file_type] = [file_type, 1, files[i].size, 0];	// change to json?
		} else {
			typecount[file_type][1]++;
			typecount[file_type][2] += files[i].size;
		}
    }

//    console.log(typecount);

    var type_array = [];

	for (var key in typecount) {
		if (typecount.hasOwnProperty(key)) {
			typecount[key][3] = (typecount[key][2] / total_size) * 100;	// typecount[key][2] = %
			type_array.push(typecount[key]);
		}
	}

    // Start Drawing
	var w = 450;
	var h = 100;
	var barPadding = 1;

	d3.select("#files").append("h4").text("Total Files: " + total_files + " files");
	var files_svg = d3.select("#files")
						.append("svg")
						.attr("width", w)
			            .attr("height", h);

	files_svg.selectAll("rect")
			   .data(type_array)
			   .enter()
			   .append("rect")
			   .attr("y", function(d) {
			   	return h - d[1];
			   })
			   .attr("width", w / type_array.length - barPadding)
			   .attr("height", function(d) {
			   	return d[1];
			   })
			   .attr("x", function(d, i) {
				    return i * (w / type_array.length);
				});

	files_svg.selectAll("text")
			.data(type_array)
			.enter()
			.append("text")
			.text(function(d) {
				return d[0];
			})
			.attr("y", function(d) {
				return h - d[1] - 10;
			})
			.attr("x", function(d, i) {
				return i * (w / type_array.length) + (w / type_array.length - barPadding) / 2;
			})
			.attr("text-anchor", "middle");

	d3.select("#bytes").append("h4").text("Total Size: " + total_size + " bytes");
	var type_svg = d3.select("#bytes")
			            .append("svg")
			            .attr("width", w)
			            .attr("height", h);

	type_svg.selectAll("rect")
			   .data(type_array)
			   .enter()
			   .append("rect")
			   .attr("y", function(d) {
			   	return h - d[3];
			   })
			   .attr("width", w / type_array.length - barPadding)
			   .attr("height", function(d) {
			   	return d[3];
			   })
			   .attr("x", function(d, i) {
				    return i * (w / type_array.length);
				});

	type_svg.selectAll("text")
			.data(type_array)
			.enter()
			.append("text")
			.text(function(d) {
				return d[0];
			})
			.attr("y", function(d) {
				return h - d[3] - 10;
			})
			.attr("x", function(d, i) {
				return i * (w / type_array.length) + (w / type_array.length - barPadding) / 2;
			})
			.attr("text-anchor", "middle");

	d3.select("#map_text").append("h4").text("Total Length: " + byteToLength(total_size));
	drawMap(byteToMeter(total_size));
}

function byteToLength(bytes) {
	var cm = bytes * .4233;
	var mi = (cm * .000000621371);
	if (mi > 1) return mi + " miles";
	else return (cm * 0.0109361).toFixed(2) + " yards";

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
	var w = 485;
	var h = 100;
	var barPadding = 1;

	d3.select("#pc_text").append("h4").text("Total Commits: " + total_commits);

	var days_svg = d3.select("#days")
			            .append("svg")
			            .attr("width", w)
			            .attr("height", h);

	days_svg.selectAll("rect")
				.data(days)
				.enter()
				.append("rect")
				.attr("y", function(d) {
					return h - d;
				})
				.attr("width", w / days.length - barPadding)
				.attr("height", function(d) {
					return d;
				})
				.attr("x", function(d, i) {
				    return i * (w / days.length);
				});

	days_svg.selectAll("text")
				.data(days)
				.enter()
				.append("text")
				.text(function(d, i) {
					if (i == 0) {return "S: " + d ;}
					if (i == 1) {return "M: " + d ;}
					if (i == 2) {return "Tu: " + d ;}
					if (i == 3) {return "W: " + d ;}
					if (i == 4) {return "Th: " + d ;}
					if (i == 5) {return "F: " + d ;}
					if (i == 6) {return "S: " + d ;}
				})
				.attr("y", function(d) {
					return h - d - 10;
				})
				.attr("x", function(d, i) {
				    return i * (w / days.length) + (w / days.length - barPadding) / 2;
				})
				.attr("text-anchor", "middle");

	var hours_svg = d3.select("#hours").append("svg").attr("width", w).attr("height", h);

	hours_svg.selectAll("rect")
				.data(hours)
				.enter()
				.append("rect")
				.attr("width", w / hours.length - barPadding)
				.attr("height", function(d) {
					return d;
				})
				.attr("y", function(d) {
					return h - d;
				})
				.attr("x", function(d, i) {
					return i * (w / hours.length);
				});
}