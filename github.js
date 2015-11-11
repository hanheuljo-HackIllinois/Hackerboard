var ref = new Firebase('https://hackerboard.firebaseio.com/');
var usersRef = ref.child("users");

$(function() {
	$('#ghsubmitbtn').on('click', function(e){
		clearPage();
		e.preventDefault();

		var username = $('#ghusername').val();

		var requri   = 'https://api.github.com/users/'+username;
		var repouri  = 'https://api.github.com/users/'+username + '/repos?sort=updated';

		$.getJSON(requri, function(json, status, xhr) {
			if(json.message == "Not Found" || username == '') {
				$('#ghapidata').html("<h2>No User Info Found</h2>");
			} else {
				// else we have a user and we display their info
				var fullname   = json.name;
				var username   = json.login;
				var aviurl     = json.avatar_url;
				var profileurl = json.html_url;
				var location   = json.location;
				var followersnum = json.followers;
				var followingnum = json.following;
				var reposnum     = json.public_repos;

				userRef = usersRef.child(username);
				var last_mod_db;

				userRef.once("value", function(snapshot) {
					if (snapshot.val() == null) {
						last_mod_db = undefined;
					} else {
						last_mod_db = snapshot.val().last_modified;
					}

					var last_mod_api = xhr.getResponseHeader('Last-Modified');

					if (last_mod_db === undefined || last_mod_db != last_mod_api) {
						var files = [];
						var repositories;
						var trees;
						var num_done = 0;
						var punch_done = 0;
						var punchcard = [];

						if (fullname == undefined) { fullname = username; }

						var outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
						outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
						outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
						outhtml = outhtml + '<div class="repolist clearfix">';

						$.getJSON(repouri, function (json){		// add if changed call (304)
							repositories = json;
							var repo_length = repositories.length;
							//console.log(repo_length);
							//console.log(repositories);
							$.each(json, function (rl) {
								//console.log(rl);
								var refsuri = 'https://api.github.com/repos/'+username+'/'+repositories[rl].name+'/git/refs/heads';
								var sha;
								if (json[rl].size != 0) {
									$.getJSON(refsuri, function (json) {
										if (json && json.message != "Not Found" && json.message != "Git Repository is empty.") {
											sha = json[0].object.sha;
											var treesuri = 'https://api.github.com/repos/'+username+'/'+repositories[rl].name+'/git/trees/'+sha+'?recursive=1';
											$.getJSON(treesuri, function (json) {
												if (json.message != "Not Found") {
													trees = json.tree;
													for (i = 0; i < trees.length; ++i) {
														if (trees[i].size != undefined) {
															files.push(trees[i]);
														}
													}
												}
											}).done(function () {
											//console.log(files);
											num_done++;
											//console.log(num_done);
											if (repo_length < 10) {  // go ahead when less than 10 repos
												if (num_done == repo_length) {    // all done code here, or up to certain number of repos (10 at the moment, unordered?)
													//console.log(num_done);
													outputFiles(files);
													push_files(username, files);
												}
											} else {
												console.log(num_done);
												if (num_done == 10) {  // limits the number of repos
													outputFiles(files);
													push_files(username, files);
												}
											}
											});
										}
									});
								} else {
									repo_length--;
								}

								var punchuri = 'https://api.github.com/repos/'+username+'/'+repositories[rl].name+'/stats/punch_card';

								$.getJSON(punchuri, function (json) {		// add if changed (304)
									if (json && json.message != "Not Found") {
										for (i = 0; i < json.length; ++i) {
											if (json[i][2] != 0 ) {
												punchcard.push(json[i]);
											}
										}
									}
								}).done(function () {
									++punch_done;
									if (punch_done == repositories.length) {
										outputPunchcard(punchcard);
										push_punchcard(username, punchcard);
									}
								});
							});
						});
					set_last_mod(username, last_mod_api);
					} else {
						get_punchcard(username);
						get_files(username);
					}
				});
			}
		}); // end requestJSON Ajax call
	}); // end click event handler

	function requestJSON(url, time, callback) {
		$.ajax({
			url: url,
			headers: { 'If-Modified-Since': time },
			beforeSend: function(xhr) {
				xhr.setRequestHeader('If-Modified-Since', time);
				console.log(xhr);
				console.log(xhr.getAllResponseHeaders());
			},
			complete: function(xhr) {
				callback.call(null, xhr);
			}
		});
	}
});