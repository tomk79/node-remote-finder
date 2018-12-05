<?php
/**
 * remote-finder
 */
namespace tomk79\remoteFinder;

/**
 * remote-finder
 */
class main{

	private $paths_root_dir = array();
	private $paths_readonly = array();
	private $paths_invisible = array();

	/**
	 * Constructor
	 */
	public function __construct($paths_root_dir, $options = array()){
		$this->paths_root_dir = $paths_root_dir;
		$this->paths_readonly = $options['paths_readonly'];
		$this->paths_invisible = $options['paths_invisible'];
	}

	private function getItemList(){}
	private function createNewFile(){}
	private function createNewFolder(){}
	private function rename(){}
	private function remove(){}
	private function getRealpath(){}
	private function getResolvedPath(){}
	private function isVisiblePath(){}
	private function isWritablePath(){}

	/**
	 * General Purpose Interface
	 */
	public function gpi($input){
		if( is_callable( $this, $input->api ) ){
			$result = $this->{$input->api}($input->path, $input->options);
			return $result;
		}
		return false;
	}
}
