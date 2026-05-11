<?php include 'config.php'; ?>
<!DOCTYPE html>
<html>
<head>
<title>Smart Market System</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body{margin:0;font-family:Arial;background:#0f172a;color:white;}
.sidebar{width:220px;height:100vh;position:fixed;background:#1e293b;padding:20px;}
.sidebar h2{color:#38bdf8;}
.sidebar button{width:100%;margin:10px 0;padding:10px;background:#334155;border:none;color:white;cursor:pointer;}
.main{margin-left:240px;padding:20px;}
.card{background:#1e293b;padding:20px;border-radius:10px;margin-bottom:20px;}
input,select{padding:8px;margin:5px;}
</style>
</head>
<body>

<div class="sidebar">
<h2>Dashboard</h2>
<button onclick="showAdmin()">Admin</button>
<button onclick="showUser()">User</button>
</div>

<div class="main">

<div id="admin" class="card">
<h3>Add Price</h3>
<form method="POST">
<input type="text" name="product" placeholder="Vegetable" required>
<input type="number" name="price" placeholder="Price" required>
<button type="submit" name="add">Add</button>
</form>
</div>

<div id="user" class="card" style="display:none;">
<h3>View Prices</h3>

<select id="veg" onchange="loadGraph()">
<?php
$res=$conn->query("SELECT DISTINCT product FROM prices");
while($row=$res->fetch_assoc()){
 echo "<option value='{$row['product']}'>{$row['product']}</option>";
}
?>
</select>

<select id="range" onchange="loadGraph()">
<option value="7">Week</option>
<option value="30">Month</option>
<option value="365">Year</option>
</select>

<canvas id="chart"></canvas>
</div>

</div>

<?php
if(isset($_POST['add'])){
$p=$_POST['product'];
$pr=$_POST['price'];
$conn->query("INSERT INTO prices(product,price) VALUES('$p','$pr')");
echo "<script>alert('Saved')</script>";
}
?>

<script>
function showAdmin(){
document.getElementById('admin').style.display='block';
document.getElementById('user').style.display='none';
}
function showUser(){
document.getElementById('admin').style.display='none';
document.getElementById('user').style.display='block';
loadGraph();
}
let chart;
function loadGraph(){
let veg=document.getElementById('veg').value;
let range=document.getElementById('range').value;
fetch(`fetch.php?veg=${veg}&days=${range}`)
.then(res=>res.json())
.then(data=>{
if(chart) chart.destroy();
chart=new Chart(document.getElementById('chart'),{
type:'line',
data:{
labels:data.labels,
datasets:[{label:veg,data:data.values,borderColor:'cyan'}]
}
});
});
}
</script>

</body>
</html>
