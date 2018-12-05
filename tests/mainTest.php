<?php
/**
 * test for tomk79/remote-finder
 */
class mainTest extends PHPUnit_Framework_TestCase{
	private $fs;

	public function setup(){
		mb_internal_encoding('UTF-8');
	}


	/**
	 * 普通にインスタンス化して実行してみるテスト
	 */
	public function testStandard(){
		$remoteFinder = new tomk79\remoteFinder\main();
	}

}
