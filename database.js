var ref = new Firebase('https://hackerboard.firebaseio.com/');
var usersRef = ref.child("users");

function push_punchcard(id, punchcard) {
	var userRef = usersRef.child(id);
	userRef.update({
		punchcard: punchcard
	});
}

function push_files(id, files) {
	var userRef = usersRef.child(id);
	userRef.update({
		files: files
	});
}

function get_punchcard(id) {
	var userRef = usersRef.child(id);
	userRef.on("value", function(snapshot) {
		outputPunchcard(snapshot.val().punchcard);
	});
}

function get_files(id) {
	var userRef = usersRef.child(id);
	userRef.on("value", function(snapshot) {
		outputFiles(snapshot.val().files);
	});
}

function set_last_mod(id, time) {
	var userRef = usersRef.child(id);
	userRef.update({
		last_modified: time
	});
}

function get_last_mod(id) {
	var userRef = usersRef.child(id);
	userRef.on("value", function(snapshot) {
		console.log(snapshot.val().last_modified);
		return snapshot.val().last_modified;
	});
}