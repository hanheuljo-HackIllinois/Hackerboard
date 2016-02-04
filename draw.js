var comma = d3.format(",");

function drawFiles(type_array, total_size, w, h, axis, barPadding) {
	var files_svg = d3.select("#files")
						.append("svg")
						.attr("width", w + axis)
			            .attr("height", h + 2 * axis);

	var max_file = d3.max(type_array, function(d) { return d.count; });

	var file_scale = d3.scale.linear()
						.domain([0, max_file])
						.range([0, h]);

	var file_scale_axis = d3.scale.linear()
						.domain([0, max_file])
						.range([h, 0]);

	var file_color = d3.scale.quantize()
					.domain([0, max_file])
					.range(["#1C1B24", "#322F45", "#575673", "#5C89C3", "#BBE5F8", "#FFF6C6", "#DAA073", "#D76E5D"]);

	var file_y = d3.svg.axis()
					.scale(file_scale_axis)
					.orient("right")
					.tickValues([0, (max_file / 4), (max_file / 2), (3 * max_file / 4), max_file])
					.tickFormat(function(d) {
						if (d == 0) return "Never";
						else if (d == max_file / 4) return "Seldom";
						else if (d == max_file / 2) return "Sometimes";
						else if (d == 3 * max_file / 4) return "Usually";
						else if (d == max_file) return "Always";
					});

	var file_tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) {
						return "<span>" + comma(d.count) + " " + d.file_type + " files<span>";
					});

	files_svg.call(file_tip);

	files_svg.selectAll("rect")
				.data(type_array)
				.enter()
				.append("rect")
				.attr("class", "rect")
				.attr("y", function(d) {
					if (file_scale(d.count) < 5) return h + axis - 5;
					return h - file_scale(d.count) + axis;
				})
				.attr("width", w / type_array.length - barPadding)
				.attr("height", function(d) {
					if (file_scale(d.count) < 5) return 5;
					return file_scale(d.count);
				})
				.attr("x", function(d, i) {
					return i * (w / type_array.length);
				})
				.attr("fill", function(d) {
					return file_color(d.count);
				})
				.on("mouseover", file_tip.show)
				.on("mouseout", file_tip.hide);

	files_svg.selectAll("text")
			.data(type_array)
			.enter()
			.append("text")
			.text(function(d) {
				if (d.file_type == "JavaScript") return "JS";
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

	var byte_svg = d3.select("#bytes")
			            .append("svg")
			            .attr("width", w + axis)
			            .attr("height", h + 2 * axis);

	var max_byte = d3.max(type_array, function(d) { return d.percent; });

	var byte_scale = d3.scale.linear()
						.domain([0, max_byte])
						.range([0, h]);

	var byte_scale_axis = d3.scale.linear()
						.domain([0, max_byte])
						.range([h, 0]);

	var byte_color = d3.scale.quantize()
					.domain([0, max_byte])
					.range(["#1C1B24", "#322F45", "#575673", "#5C89C3", "#BBE5F8", "#FFF6C6", "#DAA073", "#D76E5D"]);

	var byte_y = d3.svg.axis()
					.scale(byte_scale_axis)
					.orient("right")
					.tickValues([0, (max_byte / 4), (max_byte / 2), (3 * max_byte / 4), max_byte])
					.tickFormat(function(d) {
						if (d == 0) return "Never";
						else if (d == max_byte / 4) return "Seldom";
						else if (d == max_byte / 2) return "Sometimes";
						else if (d == 3 * max_byte / 4) return "Usually";
						else if (d == max_byte) return "Always";
					});

	var byte_tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) {
					return "<span>" + comma(d.size) + " bytes of " + d.file_type + "<span>";
					});

	byte_svg.call(byte_tip);

	byte_svg.selectAll("rect")
				.data(type_array)
				.enter()
				.append("rect")
				.attr("class", "rect")
				.attr("y", function(d) {
					if (byte_scale(d.percent) < 5) return h + axis - 5;
					return h - byte_scale(d.percent) + axis;
				})
				.attr("width", w / type_array.length - barPadding)
				.attr("height", function(d) {
					if (byte_scale(d.percent) < 5) return 5;
					return byte_scale(d.percent);
				})
				.attr("x", function(d, i) {
					return i * (w / type_array.length);
				})
				.attr("fill", function(d) {
					return byte_color(d.percent);
				})
				.on("mouseover", byte_tip.show)
				.on("mouseout", byte_tip.hide);

	byte_svg.selectAll("text")
			.data(type_array)
			.enter()
			.append("text")
			.text(function(d) {
				if (d.file_type == "JavaScript") return "JS";
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
}

function byteToLength(bytes) {
	var points_in_mm = 0.35278;
	var points_in_inch = 0.01389
	var mm = bytes * points_in_mm * 12;
	var cm = mm / 100;

	var mi = (cm * .00000621371);
	var yards = (cm * 0.0109361);
	if (mi > 1) {
		return comma(mi.toFixed(2)) + " miles";
	}
	else {
		return comma(yards.toFixed(0)) + " yards";
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

function drawPunchcard(days, hours, total_commits, w, h, axis, barPadding) {
	var days_svg = d3.select("#days")
			            .append("svg")
			            .attr("width", w + axis)
			            .attr("height", h + 2 * axis);

	var max_days = d3.max(days);

	var days_scale = d3.scale.linear()
						.domain([0, max_days])
						.range([0, h]);

	var days_scale_axis = d3.scale.linear()
						.domain([0, max_days])
						.range([h, 0]);

	var days_color = d3.scale.quantize()
						.domain([0, max_days])
						.range(["#1C1B24", "#322F45", "#575673", "#5C89C3", "#BBE5F8", "#FFF6C6", "#DAA073", "#D76E5D"]);

	var days_y = d3.svg.axis()
					.scale(days_scale_axis)
					.orient("right")
					.tickValues([0, (max_days / 4), (max_days / 2), (3 * max_days / 4), max_days])
					.tickFormat(function(d) {
						if (d == 0) return "Never";
						else if (d == max_days / 4) return "Seldom";
						else if (d == max_days / 2) return "Sometimes";
						else if (d == 3 * max_days / 4) return "Usually";
						else if (d == max_days) return "Always";
					});

	var days_tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) {
					return "<span>" + comma(d) + " commits<span>";
					});

	days_svg.call(days_tip);

	days_svg.selectAll("rect")
				.data(days)
				.enter()
				.append("rect")
				.attr("class", "rect")
				.attr("y", function(d) {
					if (days_scale(d) < 5) return h + axis - 5;
					return h - days_scale(d) + axis;
				})
				.attr("width", w / days.length - barPadding)
				.attr("height", function(d) {
					if (days_scale(d) < 5) 5;
					return days_scale(d);
				})
				.attr("x", function(d, i) {
				    return i * (w / days.length);
				})
				.attr("fill", function(d) {
					return days_color(d);
				})
				.on("mouseover", days_tip.show)
				.on("mouseout", days_tip.hide);

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

	var max_hours = d3.max(hours)

	var hours_scale = d3.scale.linear()
						.domain([0, max_hours])
						.range([0, h]);

	var hours_color = d3.scale.quantize()
						.domain([0, max_hours])
						.range(["#1C1B24", "#322F45", "#575673", "#5C89C3", "#BBE5F8", "#FFF6C6", "#DAA073", "#D76E5D"]);

	var hours_scale_axis = d3.scale.linear()
						.domain([0, max_hours])
						.range([h, 0]);

	var hours_y = d3.svg.axis()
					.scale(hours_scale_axis)
					.orient("right")
					.tickValues([0, (max_hours / 4), (max_hours / 2), (3 * max_hours / 4), max_hours])
					.tickFormat(function(d) {
						if (d == 0) return "Never";
						else if (d == max_hours / 4) return "Seldom";
						else if (d == max_hours / 2) return "Sometimes";
						else if (d == 3 * max_hours / 4) return "Usually";
						else if (d == max_hours) return "Always";
					}); //.tickFormat(function(d) { console.log(d);return "nah"; }); USE THIS

	var hours_tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d, i) {
						var hour = i % 12;
						var pm = (i / 12) >= 1;
						var str = "";
						if (hour == 0) { hour = 12; }
						if (pm) { str = "" + hour + "PM"; }
						else { str = "" + hour + "AM";}
						return "<span>" + comma(d) + " commits at " + str + " <span>";
					});

	hours_svg.call(hours_tip);

	hours_svg.selectAll("rect")
				.data(hours)
				.enter()
				.append("rect")
				.attr("class", "rect")
				.attr("width", w / hours.length - barPadding)
				.attr("height", function(d) {
					if (hours_scale(d) < 5) return 5;
					return hours_scale(d);
				})
				.attr("y", function(d) {
					if (hours_scale(d) < 5) return h + axis - 5;
					return h - hours_scale(d) + axis;
				})
				.attr("x", function(d, i) {
					return i * (w / hours.length);
				})
				.attr("fill", function(d) {
					return hours_color(d);
				})
				.on("mouseover", hours_tip.show)
				.on("mouseout", hours_tip.hide);

	hours_svg.selectAll("text")
				.data(hours)
				.enter()
				.append("text")
				.text(function(d, i) {
					if (i == 1) {return "Night";}
					if (i == 5) {return "Dawn";}
					if (i == 8) {return "Morning";}
					if (i == 12) {return "Afternoon";}
					if (i == 17) {return "Evening";}
					if (i == 21) {return "Night";}
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