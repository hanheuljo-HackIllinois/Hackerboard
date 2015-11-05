var firebaseRef = new Firebase('https://hackerboard.firebaseio.com/');

function push_punchcard(id, punchcard) { //pushes to firebase db no matter what, change to not push if data not changed according to github api
	firebaseRef.push({
		username: id,
		punchcard: punchcard
	});
}
