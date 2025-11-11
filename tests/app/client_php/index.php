<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Remote Finder - TEST</title>

		<!-- px2style -->
		<link rel="stylesheet" href="../../../node_modules/px2style/dist/px2style.css" />
		<link rel="stylesheet" href="../../../node_modules/px2style/dist/themes/default.css" />

		<!-- remote-finder.css -->
		<link rel="stylesheet" href="../../../dist/remote-finder.css" />

		<!-- contents.css -->
		<link rel="stylesheet" href="./index_files/contents.css" />

		<style>
		:root{
			--px2-main-color: #000;
		}
		</style>

<?php if($_GET['appearance']??'' == 'darkmode'){ ?>
		<!-- darkmode -->
		<style>
		body{
			color: #ddd;
			background-color: #333;
		}
		</style>
		<link rel="stylesheet" href="../../../dist/themes/darkmode.css" />
<?php } ?>
	</head>
	<body class="_px2-darkmode">

<h1>Remote Finder TEST</h1>
<div id="finder1"></div>
<ul>
	<li><a href="javascript:alert(remoteFinder.getCurrentDir());">current dir</a></li>
</ul>

<!-- px2style -->
<script src="../../../node_modules/px2style/dist/px2style.js"></script>

<!-- remote-finder.js -->
<script src="../../../dist/remote-finder.js"></script>

<!-- contents.js -->
<script>
	window.lang = <?= json_encode($_GET['lang']??'en'); ?>;
</script>
<script src="./index_files/contents.js"></script>

	</body>
</html>
