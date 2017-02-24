<?php
include $_SERVER['DOCUMENT_ROOT'] . '/db/db-config.php';

if (!class_exists('DB')) {
	class DB {
		function __construct($dbhost,$dbuser,$dbpass,$dbname) {
			$this->db = new mysqli($dbhost,$dbuser,$dbpass,$dbname);
		}

		public function raw_query($sql) {
			return $this->db->query($sql);
		}

		public function select($field,$table,$where='') {
			if ($this->db->query("SELECT id FROM $table") && !preg_match("/^id=/",$where)) {
				$sql = "SELECT id, $field FROM $table";				
			} else {
				$sql = "SELECT $field FROM $table";
			}
			if ($where !== '') {
				$sql .= " WHERE $where";
			}
			$sql .= ";";
			$dbobject = $this->db->query($sql);
			$result = [];
			if (is_object($dbobject)) {
				while($row = $dbobject->fetch_assoc()) {
					if (count($row) == 2) {
						$result[$row[array_keys($row)[0]]] = $row[array_keys($row)[1]];
					} else {
						array_push($result,$row[$field]);						
					}
				}
			}
			return $result;
		}

		public function update($field,$value,$table,$where) {
			$sql = "UPDATE $table SET $field='$value' WHERE $where;";
			return $this->db->query($sql);
		}

		public function get_user($name) {
			$sql = "SELECT * FROM user WHERE username='$name'";
			return $this->db->query($sql)->fetch_assoc();
		}

		public function create_user($id,$uname,$pass,$email,$fname,$lname) {
			$sql = "INSERT INTO user (id,username,password,email,firstname,lastname) VALUES($id,'$uname','$pass','$email','$fname','$lname')";
			return $this->db->query($sql);
		}

		public function save_tree($id,$ownerid,$treestring) {
			$alltreeids = $this->select('id','tree');
			if (in_array($id,$alltreeids)) {
				$sql = "UPDATE tree SET tree_string='$treestring' WHERE id=$id;";
			} else {
				$sql = "INSERT INTO tree (id,ownerid,tree_string) VALUES($id,$ownerid,'$treestring')";
			}
			return $this->db->query($sql);
		}

		public function get_trees_by_user($userid) {
			$trees = $this->select('tree_string', 'tree', "ownerid='$userid'");
			return $trees;
		}
	}
}

$DB = new DB($dbhost,$dbuser,$dbpass,$dbname);