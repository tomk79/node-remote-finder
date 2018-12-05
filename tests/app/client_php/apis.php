<?php
require_once(__DIR__.'/../../../vendor/autoload.php');
$remoteFinder = new tomk79\remoteFinder\main(array(
	'default' => __DIR__.'/../../data/root1/'
), array(
	'paths_invisible' => array(
		'/invisibles/*',
		'*.hide'
	),
	'paths_readonly' => array(
		'/readonly/*',
	),
));
$value = $remoteFinder->gpi( json_decode( $_REQUEST['data'] ) );
header('Content-type: text/json');
echo json_encode($value);
exit;
