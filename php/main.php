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
	 * ファイルの詳細情報を取得する
	 */
	private function gpi_getItemInfo($path, $options){
		$realpath = $this->getRealpath($path);
		// var_dump($realpath);
		$rtn = array(
			'result' => true,
			'message' => "OK",
			'itemInfo' => array(),
		);

		$item = array();
		$item['name'] = basename($path);
		if(is_dir($realpath)){
			$item['type'] = 'dir';
		}elseif(is_file($realpath)){
			$item['type'] = 'file';
		}
		$item['visible'] = $this->isVisiblePath($path);
		if(!$item['visible']){
			return array(
				'result' => false,
				'message' => "Item not found",
				'itemInfo' => false,
			);
		}
		$item['writable'] = $this->isWritablePath($path);

		if($item['type'] == 'file'){
			$item['ext'] = null;
			if( preg_match('/\.([a-zA-Z0-9\-\_]+)$/', $item['name'], $matched) ){
				$item['ext'] = $matched[1];
				$item['ext'] = strtolower($item['ext']);
			}
			$item['size'] = filesize($realpath);
			$item['md5'] = md5_file($realpath);
			$item['base64'] = base64_encode(file_get_contents($realpath));
			$item['mime'] = mime_content_type($realpath);
		}

		$rtn['itemInfo'] = $item;
		return $rtn;
	}

	/**
	 * ファイルの内容を取得する
	 */
	private function gpi_getFileContent($path, $options){
		$realpath = $this->getRealpath($path);
		// var_dump($realpath);
		$rtn = array(
			'result' => true,
			'message' => "OK",
			'content' => array(),
		);

		$item = array();
		$item['name'] = basename($path);
		if(is_dir($realpath)){
			$item['type'] = 'dir';
		}elseif(is_file($realpath)){
			$item['type'] = 'file';
		}

		if( !$this->isVisiblePath($path) ){
			return array(
				'result' => false,
				'message' => "Item not found",
				'content' => false,
			);
		}
		if($item['type'] != 'file'){
			return array(
				'result' => false,
				'message' => "Item is not a file",
				'content' => false,
			);
		}
		$item['ext'] = null;
		if( preg_match('/\.([a-zA-Z0-9\-\_]+)$/', $item['name'], $matched) ){
			$item['ext'] = $matched[1];
			$item['ext'] = strtolower($item['ext']);
		}
		$item['size'] = filesize($realpath);
		$item['md5'] = md5_file($realpath);
		$item['base64'] = base64_encode(file_get_contents($realpath));
		$item['mime'] = mime_content_type($realpath);

		$rtn['content'] = $item;
		return $rtn;
	}

	/**
	 * ファイルとフォルダの一覧を取得する
	 */
	private function gpi_getItemList($path, $options){
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
			$item['size'] = filesize($realpath.'/'.$item['name']);
			array_push($rtn['list'], $item);
		}

		return $rtn;
	}

	/**
	 * 新しいファイルを作成する
	 */
	private function gpi_createNewFile($path, $options){
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
			'message' => (!$result ? 'Failed to write file. ' . $path : 'OK')
		);
	}

	/**
	 * 新しいフォルダを作成する
	 */
	private function gpi_createNewFolder($path, $options){

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
			'message' => (!$result ? 'Failed to mkdir. ' . $path : 'OK')
		);
	}

	/**
	 * ファイルを保存する
	 */
	private function gpi_saveFile($path, $options){
		if( !$this->isWritablePath( $path ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		$realpath = $this->getRealpath($path);

		$allow_overwrite = false;
		if( property_exists($options, 'allow_overwrite') && $options->allow_overwrite ){
			$allow_overwrite = true;
		}

		if( !$allow_overwrite && file_exists($realpath) ){
			return array(
				'result' => false,
				'message' => "Already exists."
			);
		}

		$bin = '';
		if( property_exists($options, 'base64') && $options->base64 ){
			$bin = base64_decode($options->base64);
		}

		$result = $this->fs->save_file($realpath, $bin);
		return array(
			'result' => !!$result,
			'message' => (!$result ? 'Failed to write file. ' . $path : 'OK')
		);
	}

	/**
	 * ファイルやフォルダを複製する
	 */
	private function gpi_copy($pathFrom, $options){
		$pathTo = $options->to;
		$rootDir = $this->paths_root_dir['default'];
		$realpathFrom = $this->getRealpath($pathFrom);
		$realpathTo = $this->getRealpath($pathTo);

		if( !$this->isWritablePath( $pathTo ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		if( !file_exists($realpathFrom) ){
			return array(
				'result' => false,
				'message' => "File or directory NOT exists." . $pathFrom
			);
		}

		if( file_exists($realpathTo) ){
			return array(
				'result' => false,
				'message' => "Already exists." . $pathTo
			);
		}

		$result = $this->fs->copy_r($realpathFrom, $realpathTo);
		return array(
			'result' => !!$result,
			'message' => (!$result ? 'Failed to copy file or directory. from ' . $pathFrom . ' to ' . $pathTo : 'OK')
		);
	}

	/**
	 * ファイルやフォルダを移動する
	 */
	private function gpi_rename($pathFrom, $options){
		$pathTo = $options->to;
		$rootDir = $this->paths_root_dir['default'];
		$realpathFrom = $this->getRealpath($pathFrom);
		$realpathTo = $this->getRealpath($pathTo);

		if( !$this->isWritablePath( $pathFrom ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		if( !$this->isWritablePath( $pathTo ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		if( !file_exists($realpathFrom) ){
			return array(
				'result' => false,
				'message' => "File or directory NOT exists." . $pathFrom
			);
		}

		if( file_exists($realpathTo) ){
			return array(
				'result' => false,
				'message' => "Already exists." . $pathTo
			);
		}

		$result = $this->fs->rename($realpathFrom, $realpathTo);
		return array(
			'result' => !!$result,
			'message' => (!$result ? 'Failed to rename file or directory. from ' . $pathFrom . ' to ' . $pathTo : 'OK')
		);
	}

	/**
	 * ファイルやフォルダを削除する
	 */
	private function gpi_remove($path, $options){
		if( !$this->isWritablePath( $path ) ){
			return array(
				'result' => false,
				'message' => "NOT writable path."
			);
		}

		$realpath = $this->getRealpath($path);

		if( !file_exists($realpath) ){
			return array(
				'result' => false,
				'message' => "Item NOT exists."
			);
		}

		$result = $this->fs->rm($realpath);
		return array(
			'result' => !!$result,
			'message' => (!$result ? 'Failed to remove file or directory. ' . $path : 'OK')
		);
	}

	/**
	 * 絶対パスを取得する
	 */
	public function getRealpath($path){
		$rootDir = $this->paths_root_dir['default'];
		$resolvedPath = $this->getResolvedPath($path);
		$realpath = $this->fs->get_realpath('.'.$resolvedPath, $rootDir);
		return $realpath;
	}

	/**
	 * パスを解決する
	 */
	public function getResolvedPath($path){
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
	public function isVisiblePath($path){
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
	public function isWritablePath($path){
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
		try{
			if( preg_match('/[^a-zA-Z0-9]/s', $input->api) ){
				return array(
					'result' => false,
					'message' => '"'.$input->api.'" is an invalid API name.',
				);
			}
			if( is_callable( array($this, 'gpi_'.$input->api) ) ){
				$options = json_decode('{}');
				if( property_exists($input, 'options') ){
					$options = $input->options;
				}
				$result = $this->{'gpi_'.$input->api}($input->path, $options);
				$result = json_decode( json_encode($result) );
				return $result;
			}
			return array(
				'result' => false,
				'message' => 'An API "'.$input->api.'" is undefined, or not callable.',
			);
		}catch(\Exception $ex){
			return array(
				'result' => false,
				'Unknown Error.',
			);
		}
	}
}
