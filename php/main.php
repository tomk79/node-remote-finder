<?php
/**
 * remote-finder
 */
namespace tomk79\remoteFinder;

/**
 * remote-finder
 */
class main{

	private $fs;
	private $paths_root_dir = array();
	private $paths_readonly = array();
	private $paths_invisible = array();

	/**
	 * Constructor
	 */
	public function __construct($paths_root_dir, $options = array()){
		$this->fs = new \tomk79\filesystem();
		$this->paths_root_dir = $paths_root_dir;
		if( array_key_exists('paths_readonly', $options) ){
			$this->paths_readonly = $options['paths_readonly'];
		}
		if( array_key_exists('paths_invisible', $options) ){
			$this->paths_invisible = $options['paths_invisible'];
		}
	}


	/**
	 * ファイルとフォルダの一覧を取得する
	 */
	private function getItemList($path, $options){
		$realpath = $this->getRealpath($path);
		// var_dump($realpath);
		$rtn = array(
			'result' => true,
			'message' => "OK",
			'list' => array()
		);
		$list = $this->fs->ls($realpath);
		if( !is_array( $list ) ){
			$rtn['result'] = false;
			$rtn['message'] = 'Failed to read directory.';
			return $rtn;
		}

		sort($list);

		foreach($list as $idx=>$filename){
			$item = array();
			$item['name'] = $filename;
			if(is_dir($realpath.'/'.$item['name'])){
				$item['type'] = 'dir';
			}elseif(is_file($realpath.'/'.$item['name'])){
				$item['type'] = 'file';
			}
			$item['visible'] = $this->isVisiblePath($path.'/'.$item['name']);
			if(!$item['visible']){
				continue;
			}
			$item['writable'] = $this->isWritablePath($path.'/'.$item['name']);
			$item['ext'] = null;
			if( preg_match('/\.([a-zA-Z0-9\-\_]+)$/', $item['name'], $matched) ){
				$item['ext'] = $matched[1];
				$item['ext'] = strtolower($item['ext']);
			}
			array_push($rtn['list'], $item);
		}

		return $rtn;
	}

	/**
	 * 新しいファイルを作成する
	 */
	private function createNewFile($path, $options){
		if( !$this->isWritablePath( $path ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		$realpath = $this->getRealpath($path);

		if( file_exists($realpath) ){
			return array(
				'result' => false,
				'message' => "Already exists."
			);
		}

		$result = $this->fs->save_file($realpath, '');
		return array(
			'result' => !!$result,
			'message' => ($result ? 'Failed to write file. ' . $path : 'OK')
		);
	}

	/**
	 * 新しいフォルダを作成する
	 */
	private function createNewFolder($path, $options){

		if( !$this->isWritablePath( $path ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		$realpath = $this->getRealpath($path);

		if( file_exists($realpath) ){
			return array(
				'result' => false,
				'message' => "Already exists."
			);
		}

		$result = $this->fs->mkdir($realpath);
		return array(
			'result' => !!$result,
			'message' => ($result ? 'Failed to mkdir. ' . $path : 'OK')
		);
		return;
	}

	/**
	 * ファイルやフォルダを移動する
	 */
	private function rename($pathFrom, $options){}

	/**
	 * ファイルやフォルダを削除する
	 */
	private function remove($path, $options){}

	/**
	 * 絶対パスを取得する
	 */
	private function getRealpath($path){
		$rootDir = $this->paths_root_dir['default'];
		$resolvedPath = $this->getResolvedPath($path);
		$realpath = $this->fs->get_realpath('.'.$resolvedPath, $rootDir);
		return $realpath;
	}

	/**
	 * パスを解決する
	 */
	private function getResolvedPath($path){
		$resolvedPath = $path;
		$resolvedPath = preg_replace('/[\\/\\\\]/', '/', $resolvedPath);
		$resolvedPath = preg_replace('/^[A-Z]\:+/i', '/', $resolvedPath);
		$resolvedPath = $this->fs->get_realpath('./'.$resolvedPath, '/');
		$resolvedPath = preg_replace('/^[^\\/\\\\]+/', '', $resolvedPath);
		$resolvedPath = preg_replace('/[\\/\\\\]/', '/', $resolvedPath);
		return $resolvedPath;
	}

	/**
	 * パスが表示可能か調べる
	 */
	private function isVisiblePath($path){
		$path = $this->getResolvedPath($path);
		$blackList = $this->paths_invisible;
		foreach($blackList as $i=>$ptn){
			$ptn = '/^'.preg_quote($ptn, '/').'$/';
			$ptn = str_replace( preg_quote('*', '/'), '.*', $ptn );
			if( preg_match( $ptn, $path ) ){
				return false;
			}
			if( preg_match( $ptn, $path.'/' ) ){
				return false;
			}
		}
		return true;
	}

	/**
	 * パスが書き込み可能か調べる
	 */
	private function isWritablePath($path){
		if( !$this->isVisiblePath($path) ){
			// 見えないパスは書き込みもできないべき。
			return false;
		}
		$path = $this->getResolvedPath($path);
		$blackList = $this->paths_readonly;
		foreach($blackList as $i=>$ptn){
			$ptn = '/^'.preg_quote($ptn, '/').'$/';
			$ptn = str_replace( preg_quote('*', '/'), '.*', $ptn );
			if( preg_match( $ptn, $path ) ){
				return false;
			}
			if( preg_match( $ptn, $path.'/' ) ){
				return false;
			}
		}
		return true;
	}

	/**
	 * General Purpose Interface
	 */
	public function gpi($input){
		if( is_callable( array($this, $input->api) ) ){
			$options = json_decode('{}');
			if( property_exists($input, 'options') ){
				$options = $input->options;
			}
			$result = $this->{$input->api}($input->path, $options);
			return $result;
		}
		return false;
	}
}
