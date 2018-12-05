<?php
/**
 * test for tomk79/remote-finder
 */
class mainTest extends PHPUnit_Framework_TestCase{
	private $fs;
	private $remoteFinder;

	public function setup(){
		mb_internal_encoding('UTF-8');
		$this->remoteFinder = new tomk79\remoteFinder\main(array(
			"default" => __DIR__.'/data/root1/'
		),array(
			'paths_invisible' => [
				'/invisibles/*',
				'*.hide'
			],
			'paths_readonly' => [
				'/readonly/*'
			]
		));
	}


	/**
	 * Initialize Instance
	 */
	public function testInitializeInstance(){
		$this->assertTrue( is_object($this->remoteFinder) );
	}


	/**
	 * Resolve Path
	 */
	public function testResolvePath(){
		$this->assertSame($this->remoteFinder->getResolvedPath('\\test\\test\\test.txt'), '/test/test/test.txt');
		$this->assertSame($this->remoteFinder->getResolvedPath('C:\\test\\test\\test.txt'), '/test/test/test.txt');
		$this->assertSame($this->remoteFinder->getResolvedPath('C:\\test\\..\\test.txt'), '/test.txt');
		$this->assertSame($this->remoteFinder->getResolvedPath('test.txt'), '/test.txt');

	}

	/**
	 * Invisibles
	 */
	public function testInvisibles(){
		$this->assertSame(true, $this->remoteFinder->isVisiblePath('/visible/test.txt'));
		$this->assertSame(false, $this->remoteFinder->isVisiblePath('/invisibles/test.txt'));
		$this->assertSame(false, $this->remoteFinder->isVisiblePath('/visible/test.hide'));
	}

	/**
	 * Read only
	 */
	public function testReadonly(){

		$this->assertSame(true, $this->remoteFinder->isWritablePath('/visible/test.txt'));
		$this->assertSame(true, $this->remoteFinder->isWritablePath('/writable/test.txt'));
		$this->assertSame(false, $this->remoteFinder->isWritablePath('/invisibles/test.txt')); // Invisible なパスは 自動的に ReadOnly になる
		$this->assertSame(false, $this->remoteFinder->isWritablePath('/visible/test.hide')); // Invisible なパスは 自動的に ReadOnly になる
		$this->assertSame(false, $this->remoteFinder->isWritablePath('/readonly/test.txt'));
	}


	/**
	 * Getting List
	 */
	public function testGettingList(){

		$this->assertSame(true, $this->remoteFinder->isWritablePath('/visible/test.txt'));
		$this->assertSame(true, $this->remoteFinder->isWritablePath('/writable/test.txt'));
		$this->assertSame(false, $this->remoteFinder->isWritablePath('/invisibles/test.txt')); // Invisible なパスは 自動的に ReadOnly になる
		$this->assertSame(false, $this->remoteFinder->isWritablePath('/visible/test.hide')); // Invisible なパスは 自動的に ReadOnly になる
		$this->assertSame(false, $this->remoteFinder->isWritablePath('/readonly/test.txt'));

		$result = $this->remoteFinder->gpi(json_decode(json_encode(array(
			'path' => '/',
			'api' => 'getItemList'
		))));

		$this->assertTrue($result->result);
		$this->assertSame($result->message, 'OK');
		$this->assertSame(count($result->list), 3);
		$this->assertSame($result->list[0]->name, 'readonly');
		$this->assertSame($result->list[1]->name, 'subdir1');

	}


	/**
	 * Creating Folder And Files
	 */
	public function testCreatingFolderAndFiles(){

		$result = $this->remoteFinder->gpi(json_decode(json_encode(array(
			'path' => '/create_test/',
			'api' => 'createNewFolder'
		))));

		// var_dump($result);
		$this->assertTrue($result->result);
		$this->assertSame($result->message, 'OK');

		$result = $this->remoteFinder->gpi(json_decode(json_encode(array(
			'path' => '/create_test/create_test.txt',
			'api' => 'createNewFile'
		))));

		$this->assertTrue($result->result);
		$this->assertSame($result->message, 'OK');
		$this->assertTrue(is_file(__DIR__.'/data/root1/create_test/create_test.txt'));

		$result = $this->remoteFinder->gpi(json_decode(json_encode(array(
			'path' => '/create_test/create_test_2.txt',
			'api' => 'createNewFile'
		))));

		$this->assertTrue($result->result);
		$this->assertSame($result->message, 'OK');
		$this->assertTrue(is_file(__DIR__.'/data/root1/create_test/create_test_2.txt'));

	}



	/**
	 * Remove Folder And Files
	 */
	public function testRemoveFolderAndFiles(){
		$result = $this->remoteFinder->gpi(json_decode(json_encode(array(
			'path' => '/create_test/create_test.txt',
			'api' => 'remove'
		))));

		$this->assertTrue($result->result);
		$this->assertSame($result->message, 'OK');

		$result = $this->remoteFinder->gpi(json_decode(json_encode(array(
			'path' => '/create_test/',
			'api' => 'remove'
		))));

		$this->assertTrue($result->result);
		$this->assertSame($result->message, 'OK');
		$this->assertTrue(!is_file(__DIR__.'/data/root1/create_test/create_test.txt'));
	}

}
