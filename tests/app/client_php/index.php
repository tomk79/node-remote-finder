<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Remote Finder - TEST</title>

		<!-- px2style -->
		<link rel="stylesheet" href="../../../node_modules/px2style/dist/px2style.css" />
<?php if(($_GET['appearance']??'') == 'lightmode'){ ?>
		<link rel="stylesheet" href="../../../node_modules/px2style/dist/themes/default.css" />
<?php }elseif(($_GET['appearance']??'') == 'darkmode'){ ?>
		<link rel="stylesheet" href="../../../node_modules/px2style/dist/themes/darkmode.css" />
<?php }else{ ?>
		<link rel="stylesheet" href="../../../node_modules/px2style/dist/themes/auto.css" />
<?php } ?>

		<!-- remote-finder.css -->
		<link rel="stylesheet" href="../../../dist/remote-finder.css" />

		<!-- contents.css -->
		<link rel="stylesheet" href="./index_files/contents.css" />

		<style>
		:root{
			--px2-main-color: #000;
		}
		</style>

<?php if(($_GET['appearance']??'') == 'lightmode'){ ?>
		<!-- lightmode -->
		<style>
		body{
			color: #333;
			background-color: #eee;
		}
		</style>
		<link rel="stylesheet" href="../../../dist/themes/lightmode.css" />
<?php }elseif(($_GET['appearance']??'') == 'darkmode'){ ?>
		<!-- darkmode -->
		<style>
		body{
			color: #ddd;
			background-color: #333;
		}
		</style>
		<link rel="stylesheet" href="../../../dist/themes/darkmode.css" />
<?php }else{ ?>
		<!-- lightmode -->
		<style>
		@media (prefers-color-scheme: light) {
			body{
				color: #333;
				background-color: #eee;
			}
		}
		@media (prefers-color-scheme: dark) {
			body{
				color: #ddd;
				background-color: #333;
			}
		}
		</style>
		<link rel="stylesheet" href="../../../dist/themes/default.css" />
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
