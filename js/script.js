function countdown()
{
	
	sec.value = parseInt(sec.value) + 1;
	if(sec.value == 60){
		sec.value = 0;
		min.value = parseInt(min.value) + 1;
	}
	else
	{
		min.value = min.value;}

	
	time = (min.value<=9?'0':'')+min.value + ":"+(sec.value<=9?'0':'')+sec.value;

	document.getElementById('clock').innerHTML = time;
	SD = window.setTimeout("countdown();",1000);
	if(min.value == 45 && sec.value == 0) { 
		sec.value = 0; window.clearTimeout(SD); 
		$('#status').animate({"top":"-=26"},"slow"); 
				
		countdownOver();
	}
	if(min.value == 90 && sec.value == 0) { 
		sec.value = 0; window.clearTimeout(SD); 
		$('#status').animate({"top":"-=26"},"slow"); 
		
		countdownOver(); 
	}
	
}
function countdownOver()
{
	secOver.value = parseInt(secOver.value) + 1;
	if(secOver.value == 60){
		secOver.value = 0;
		minOver.value = parseInt(minOver.value) + 1;
	}
	else
	{
		minOver.value = minOver.value;}

	
	time = (minOver.value<=9?'0':'')+minOver.value + ":"+(secOver.value<=9?'0':'')+secOver.value;

	document.getElementById('status').innerHTML = time;
	SDover = window.setTimeout("countdownOver();",1000);
	if(min.value == 45 && sec.value > 0) { 
		secOver.value = 0; minOver.value = 0; 
		window.clearTimeout(SDover); 

		document.getElementById('status').innerHTML=''; 
	}
	
}
function toggle_startstop()
{
	var button = document.getElementById('startstop');
	if(button.value == 'start'){
		button.value='stop';
		if(min.value == "45"){ 
			$('#status').animate({"top":"+=26"},"slow",function(){
				$('#status').html(''); 
			});
			secOver.value = "0";
			minOver.value = "0";
		}
		countdown();
	} else {
		button.value = 'start';
		if(min.value == "45" && sec.value == "0"){ document.getElementById('status').innerHTML='Hálfleikur'; }
		window.clearTimeout(SD);
		window.clearTimeout(SDover);
	}	
}
function adjustDown()
{
	sec.value = parseInt(sec.value) - 1;
}
function adjustUp()
{
	sec.value = parseInt(sec.value) + 1;
}
function resetTime()
{
	sec.value = "0";
	min.value = "0";
	secOver.value = "0";
	minOver.value = "0";
	document.getElementById('clock').innerHTML = "00:00";
	document.getElementById('status').innerHTML = "";
	window.clearTimeout(SD);
	window.clearTimeout(SDover);
			$('#status').css("top","-2"); 
	$('#startstop').val('start');
			

}
function addScore(side)
{
	var box = document.getElementById(side+'_score');
	var score = parseInt(box.innerHTML);
	box.innerHTML = score + 1;
}	
function lowerScore(side)
{
	var box = document.getElementById(side+'_score');
	var score = parseInt(box.innerHTML);
	if(score > 0) {
		box.innerHTML = score - 1;
	}
}
function changeText(side)
{
	var box = document.getElementById(side+'_text');
	var text = document.getElementById(side+'_name');
	text.innerHTML = box.value;
}
function showMessage()
{
	var move = 29; // movement
	var timeout = 10; //sec

	var mlog_time = parseInt(min.value)+1;
	$('#message_log').append(new Option('['+mlog_time+'\'] '+$('#icon_select').val()+ ' ' + $('#message_input').val() ));
	if(messageShown == false)
	{
		$('#message_text').html($('#message_input').val());
		$('#message_text').attr('class',$('#icon_select').val());
		$('#message').animate({'top':'+='+move},'slow');
		$('#message').promise().done(function(){
			messageShown = true;
		});
		MSG = window.setTimeout(function(){
			$('#message').animate({'top':'-='+move},'slow');
			messageShown = false;
			window.clearTimeout(MSG);
		},timeout * 1000);		
	}
	else
	{
		if($('#message_input').val() != $('#message_text').html() || $('#message_text').attr('class') != $('#icon_select').val())
		{
			$('#message').animate({'top':'-='+move},'slow',function(){
				$('#message_text').html($('#message_input').val());
				$('#message_text').attr('class',$('#icon_select').val());
				window.clearTimeout(MSG);
				MSG = window.setTimeout(function(){
					$('#message').animate({'top':'-='+move},'slow');
					messageShown = false;
					window.clearTimeout(MSG);
				},timeout * 1000);	
			});
			$('#message').animate({'top':'+='+move},'slow');
		}
		/*else
		{
			//$('#message').animate({'top':'+='+move},'slow');
				
			messageShown = false;
		}*/
	}
}
function loadPlayersData(id)
{
	if(id == '')
	{
		alert('Ekkert leiknúmer');
		return false;
	}

	$.ajax('http://kfitv.is/Scoreboard/ksiAjax.php?section=game_report&id='+id, function(data) {
		$('#game_title').html(data.title);
		$('#game_date').html(data.date);

		$('#myTab a:eq(0)').html(data.home_title);
		$('#myTab a:eq(1)').html(data.guest_title);
		

		$('#home_name').html(data.home_title);
		$('#guest_name').html(data.guest_title);

        $('#home_players').empty();
        $.each(data.home.players, function(key,value) {
            $('#home_players').append(new Option(key+' '+value, key));
			$('#home_team').append(key+' '+value+'<br>');
        });
		$('#home_players').append(new Option('-- Varamenn --', ''));
        $.each(data.home.backup, function(key,value) {
            $('#home_players').append(new Option(key+' '+value, key));
			$('#home_team').append(key+' '+value+'<br>');
        });

        $('#guest_players').empty();
        $.each(data.guest.players, function(key,value) {
            $('#guest_players').append(new Option(key+' '+value, key));
			$('#away_team').append(key+' '+value+'<br>');
        });
		$('#guest_players').append(new Option('-- Varamenn --', ''));
        $.each(data.guest.backup, function(key,value) {
            $('#guest_players').append(new Option(key+' '+value, key));
			$('#away_team').append(key+' '+value+'<br>');
        });
    });
}

function ColorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}