function outputAggregate() {	//WATCH OUT FOR UNDEFINED
	clearPage();
	var ref = new Firebase('https://hackerboard.firebaseio.com/');
	var usersRef = ref.child("users");
	usersRef.once("value", function(snap) {
		var snap = snap.val();
		var num_people = 0
		for (people in snap) {
			++num_people;
		}
		// Organize Files
		var typecount = {};
		var total_size = 0;
		var total_files = 0;
		for (user in snap) {
			var files = snap[user].files;
			for (i = 0; i < files.length; ++i) {
				var name_array = files[i].path.split("/");
				var file_name = name_array[name_array.length - 1];
				var file_array = file_name.split(".");
				var file_type = file_array[file_array.length - 1];
		//		console.log(file_type + " : " + files[i].size);
				file_type = ext_to_file(file_type);
				total_size += files[i].size;
				++total_files;
				if (file_type == "Media" || file_type == "Other" || file_type == "Docs") {
					// Do Nothing
					total_size -= files[i].size;
					--total_files;
				}
				else if (typecount[file_type] == undefined) {
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
		}
		var type_array = [];

		for (var key in typecount) {
			if (typecount.hasOwnProperty(key)) {
				typecount[key].percent = (typecount[key].size / total_size) * 100;	// typecount[key][2] = %
				type_array.push(typecount[key]);
			}
		}

		var w = 900;
		var h = 200;
		var axis = 30;
		var barPadding = 1;
		//	Draw with type_array
		drawFiles(type_array, total_size, w, h, axis, barPadding);

		d3.select("#fb_text").append("h4").text("In total, there are " + total_files + " files on the HackIllinois github repositories.");
		d3.select("#fb_text").append("h4").text("And all the files that we've uploaded add up to a total of " + comma(total_size) + " bytes");

		d3.select("#metric_text").append("h4").text("If we got a dollar for each kilobyte of code we wrote, we would have $" + byteToDollar(total_size) + " dollars!");

		var days = [0, 0, 0, 0, 0, 0, 0];
		var hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var total_commits = 0;

		for (user in snap) {
			var punchcard = snap[user].punchcard;
			for (i = 0; i < punchcard.length; ++i) {
				days[punchcard[i][0]] += punchcard[i][2];
				hours[punchcard[i][1]] += punchcard[i][2];
				total_commits += punchcard[i][2];
			}
		}

		w = 450;

		//	Draw with days, hours, total_commits
		drawPunchcard(days, hours, total_commits, w, h, axis, barPadding);

		d3.select("#pc_text").append("h4").text("So far, we've made a total of " + comma(total_commits) + " commits");

		d3.select("#map_text").append("h4").text("If all the code at HackIllinois was printed side by side using 12 point font in a single line,");
		d3.select("#map_text").append("h4").text("the code will span a toal of " + byteToLength(total_size));
		drawMap(byteToMeter(total_size));
	});
}