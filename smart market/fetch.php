<?php
include 'config.php';
$veg=$_GET['veg'];
$days=$_GET['days'];

$res=$conn->query("SELECT price,date FROM prices WHERE product='$veg' ORDER BY date DESC LIMIT $days");

$labels=[];
$values=[];

while($row=$res->fetch_assoc()){
 $labels[]=$row['date'];
 $values[]=$row['price'];
}

echo json_encode(["labels"=>array_reverse($labels),"values"=>array_reverse($values)]);
?>