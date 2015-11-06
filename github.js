$(function() {
	$('#ghsubmitbtn').on('click', function(e){
		clearPage();
		e.preventDefault();

		var username = $('#ghusername').val();
		var requri   = 'https://api.github.com/users/'+username;
		var repouri  = 'https://api.github.com/users/'+username+'/repos';

		requestJSON(requri, function(json) {
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

				if(fullname == undefined) { fullname = username; }

				var outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
				outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
				outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
				outhtml = outhtml + '<div class="repolist clearfix">';

				var files = [];
				var repositories;
				var trees;
				var num_done = 0;
				var punch_done = 0;
				var punchcard = [];

				$.getJSON(repouri, function (json){
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
											for (i = 0; i < trees.length; i++) {
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
										}
									} else {
										console.log(num_done);
										if (num_done == 10) {  // limits the number of repos
											outputFiles(files);
										}
									}
									});
								}
							});
						} else {
							repo_length--;
						}
						var punchuri = 'https://api.github.com/repos/'+username+'/'+repositories[rl].name+'/stats/punch_card';
						$.getJSON(punchuri, function (json) {
							if (json && json.message != "Not Found") {
								for (i = 0; i < json.length; i++) {
									if (json[i][2] != 0 ) {
										punchcard.push(json[i]);
									}
								}
							}
						}).done(function () {
							punch_done++;
							if (punch_done == repositories.length) {
								outputPunchcard(punchcard);
								push_punchcard(username, punchcard);
							}
						});
					});
				});
			} // end of else
		}); // end requestJSON Ajax call
	}); // end click event handler

	function requestJSON(url, callback) {
		$.ajax({
			url: url,
			complete: function(xhr) {
				callback.call(null, xhr.responseJSON);
			}
		});
	}
});