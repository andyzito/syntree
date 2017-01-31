<?php
include 'db-config.php';

$db = new mysqli($dbhost,$dbuser,$dbpass,$dbname);

$db->query('CREATE TABLE user (id INT(10), username VARCHAR(30), password VARCHAR(30), firstname VARCHAR(30), lastname VARCHAR(30), email VARCHAR(30))');