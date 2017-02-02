<?php
function gen_id($n) {
	include $_SERVER['DOCUMENT_ROOT'] . '/syntree/classes/db.php';
	
	if ($n === 0) {
		return;
	} else if ($n === 1) {
		$ids = $DB->raw_query("SELECT value FROM data WHERE name='ids'")->fetch_assoc()['value'];
		$ids = explode(',', $ids);

		while (true) {
			$x = mt_rand(0,10000);
			if (!in_array($x,$ids)) {
				array_push($ids,strval($x));
				$ids = implode($ids,',');
				$DB->raw_query("UPDATE data SET value='$ids' WHERE name='ids'");
				return $x;
			}
		}
	} else {
		$result = [];
		$ids = $DB->raw_query("SELECT value FROM data WHERE name='ids'")->fetch_assoc()['value'];
		$ids = explode(',', $ids);
		$i = 0;

		while ($i < $n) {
			$x = mt_rand(0,10000);
			if (!in_array($x,$ids)) {
				array_push($ids,strval($x));
				$temp_ids = implode($ids,',');
				$DB->raw_query("UPDATE data SET value='$temp_ids' WHERE name='ids'");
				array_push($result,$x);
				$i = $i + 1;
			}
		}

		return $result;
	}
}