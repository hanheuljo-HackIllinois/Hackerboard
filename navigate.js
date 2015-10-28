function clearPage() {
	//should clear all elements in page before loading new data
	d3.select("#bytes").selectAll("*").remove();
	d3.select("#files").selectAll("*").remove();
	d3.select("#mapdiv").selectAll("*").remove();
	d3.select("#hours").selectAll("*").remove();
	d3.select("#days").selectAll("*").remove();
	d3.select("#initial").style('display', 'none');
	d3.select("#filesnbytes").style('display', 'none');
	d3.select("#punchcard").style('display', 'none');
	d3.select("#commitsbutton").style('display', 'none');
	d3.select("#mapbutton").style('display', 'none');
	d3.select("#navigation").style('display', 'block');
}

// instead of doing style display none, try fade in, fade out
// use callback, fade out then in
$('#mapbutton').on('click', function(e){
	$('#filesnbytes').fadeOut();
	$('#punchcard').fadeOut();
	$('#commitsbutton').fadeOut();
	$('#mapbutton').fadeOut(function() {
		$('#mapdiv').fadeIn();
		$('#filesbutton').fadeIn();
		$('#map_text').fadeIn();
	});
	var btn = document.getElementById("filesbutton");
	btn.innerText = "NEXT";
});

$('#filesbutton').on('click', function(e){
	$('#mapdiv').fadeOut();
	$('#punchcard').fadeOut();
	$('#map_text').fadeOut();
	$('#filesbutton').fadeOut(function() {
		$('#mapbutton').fadeIn();
		$('#commitsbutton').fadeIn();
		$('#filesnbytes').fadeIn();
	});
});

$('#commitsbutton').on('click', function(e){
	$('#mapdiv').fadeOut();
	$('#filesnbytes').fadeOut();
	$('#mapbutton').fadeOut();
	$('#map_text').fadeOut();
	$('#commitsbutton').fadeOut(function() {
		$('#filesbutton').fadeIn();
		$('#punchcard').fadeIn();
	});
	var btn = document.getElementById("filesbutton");
	btn.innerText = "PREV";
});

/**
$('#show_all').on('click', function(e){
	$('#mapdiv').fadeIn();
	$('#filesnbytes').fadeIn();
	$('#punchcard').fadeIn();
});
*/