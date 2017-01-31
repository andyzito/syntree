<?php
include '/var/www/html/div3/db/db-config.php';
class DB {
	function __construct($dbhost,$dbuser,$dbpass,$dbname) {
		$this->db = new mysqli($dbhost,$dbuser,$dbpass,$dbname);
	}

	public function raw_query($sql) {
		return $this->db->query($sql);
	}
}

$DB = new DB($dbhost,$dbuser,$dbpass,$dbname);