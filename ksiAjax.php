<?
	ini_set('display_errors', TRUE);
	error_reporting( E_NOTICE ^ E_ALL);


function getPlayersFromHTML($sHtml,&$game,$sType = 'players')
{
	
	preg_match_all("/<tr class=\'(alt|)\'>(.*?)<\/tr>/s",$sHtml,$lines);

	foreach($lines[0] as $line)
	{

		$players_in_line = substr_count($line,'span="2"');
		if($players_in_line == 2) // tveir í línu
		{
			preg_match_all("/ing\">(.*?)&nbsp;.*?\">(.*?)<\/td>/s",$line,$two_players);
			//print_r($two_players);
			$two_players[2][0] = preg_replace("/&#?[a-z0-9]{2,8};/i","",$two_players[2][0]);
			$two_players[2][1] = preg_replace("/&#?[a-z0-9]{2,8};/i","",$two_players[2][1]);

			$game['home'][$sType][$two_players[1][0]] = utf8_encode(strip_tags($two_players[2][0]));
			$game['guest'][$sType][$two_players[1][1]] = utf8_encode(strip_tags($two_players[2][1]));
		}
		elseif($players_in_line == 1) // 1 í línu
		{
			$strpos_first = strpos($line,'span="2"');
			$strpos_second = strpos($line,'span="4"');
			if($strpost_first < $strpos_second)
			{
				preg_match("/ing\">(.*?)&nbsp;.*?\">(.*?)<\/td>/s",$line,$player);
				$player[2] = preg_replace("/&#?[a-z0-9]{2,8};/i","",$player[2]);
				$game['home'][$sType][$player[1]] = utf8_encode(strip_tags($player[2]));
				//print_r($player);
			}
			else
			{
				preg_match("/ing\">(.*?)&nbsp;.*?\">(.*?)<\/td>/s",$line,$player);
				$player[2] = preg_replace("/&#?[a-z0-9]{2,8};/i","",$player[2]);
				$game['guest'][$sType][$player[1]] = utf8_encode(strip_tags($player[2]));
			}
		}
	}	
}

if(isset($_GET['section'])) { $section = $_GET['section']; } else { $section = ''; }

switch($section)
{
	case 'game_report';
		$rawHtml = file('http://www.ksi.is/mot/motalisti/leikskyrsla/?Leikur='.$_GET['id']);
		$html = implode('',$rawHtml);
		$html = utf8_decode($html);
		preg_match("/<div class=\"boxbody.*?table.*?>.*?<\/[\s]*table>/s", $html, $table_match);
		
		$game = array('home'=>array('players'=>array(),'backup'=>array()),'guest'=>array('players'=>array(),'backup'=>array()));

		preg_match("/Byrjunarlið(.*?)Varamenn/s",$table_match[0],$byrjunarlid);
		getPlayersFromHTML($byrjunarlid[1],$game);
		
		preg_match("/Varamenn(.*?)Liðsstjórn/s",$table_match[0],$varamenn);
		getPlayersFromHTML($varamenn[1],$game,'backup');

		preg_match("/Leikur:<\/b> <span>(.*?)&nbsp;/s",$table_match[0],$game_title);
		preg_match("/Leikdagur:<\/b> <span>(.*?)&nbsp;/s",$table_match[0],$game_date);

		$game['title'] = utf8_encode($game_title[1]);
		$game['date'] = $game_date[1];
		$team_names = explode(' - ',$game['title']);

		$game['home_title'] = $team_names[0];
		$game['guest_title'] = $team_names[1];

		echo json_encode($game);
		//print_r($game);

		break;
	default;
		echo "ple";
}


?>