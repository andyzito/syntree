<?php
include 'db-config.php';

$db = new mysqli($dbhost,$dbuser,$dbpass,$dbname);

$db->query('CREATE TABLE user (id INT(10), username VARCHAR(30), password VARCHAR(30), firstname VARCHAR(30), lastname VARCHAR(30), email VARCHAR(30), treeids TEXT)');

$db->query('CREATE TABLE data (name VARCHAR(30), value TEXT)');
$db->query("INSERT INTO data (name,value) VALUES ('ids','')");

$db->query("CREATE TABLE tree (id INT(10), ownerid INT(10), tree_string TEXT)");