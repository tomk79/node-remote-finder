/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/remote-finder.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/remote-finder.js":
/*!******************************!*\
  !*** ./src/remote-finder.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Remote Finder\n */\nwindow.RemoteFinder = function($elm, options){\n\tvar _this = this;\n\tvar current_dir = '/';\n\tvar filter = '';\n\tvar $pathBar;\n\tvar $fileList;\n\toptions = options || {};\n\toptions.gpiBridge = options.gpiBridge || function(){};\n\toptions.open = options.open || function(pathinfo, callback){\n\t\tcallback();\n\t};\n\toptions.mkdir = options.mkdir || function(current_dir, callback){\n\t\tvar foldername = prompt('Folder name:');\n\t\tif( !foldername ){ return; }\n\t\tcallback( foldername );\n\t\treturn;\n\t};\n\toptions.mkfile = options.mkfile || function(current_dir, callback){\n\t\tvar filename = prompt('File name:');\n\t\tif( !filename ){ return; }\n\t\tcallback( filename );\n\t\treturn;\n\t};\n\toptions.copy = options.copy || function(copyFrom, callback){\n\t\tvar copyTo = prompt('Copy from '+copyFrom+' to:', copyFrom);\n\t\tcallback( copyFrom, copyTo );\n\t\treturn;\n\t};\n\toptions.rename = options.rename || function(renameFrom, callback){\n\t\tvar renameTo = prompt('Rename from '+renameFrom+' to:', renameFrom);\n\t\tcallback( renameFrom, renameTo );\n\t\treturn;\n\t};\n\toptions.remove = options.remove || function(path_target, callback){\n\t\tif( !confirm('Really?') ){\n\t\t\treturn;\n\t\t}\n\t\tcallback();\n\t\treturn;\n\t};\n\t$elm.classList.add('remote-finder');\n\n\t/**\n\t * サーバーサイドスクリプトに問い合わせる\n\t */\n\tfunction gpiBridge(input, callback){\n\t\toptions.gpiBridge(input, callback);\n\t}\n\n\t/**\n\t * ファイルを開く\n\t */\n\tthis.open = function(path, callback){\n\t\tvar ext = null;\n\t\ttry{\n\t\t\tif( path.match(/^[\\s\\S]*\\.([\\s\\S]+?)$/) ){\n\t\t\t\text = RegExp.$1.toLowerCase();\n\t\t\t}\n\t\t}catch(e){}\n\n\t\tvar pathinfo = {\n\t\t\t'path': path,\n\t\t\t'ext': ext\n\t\t};\n\t\toptions.open(pathinfo, function(isCompeted){\n\t\t\tif( isCompeted ){\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tcallback(isCompeted);\n\t\t});\n\t}\n\n\t/**\n\t * フォルダを作成する\n\t */\n\tthis.mkdir = function(current_dir, callback){\n\t\toptions.mkdir(current_dir, function(foldername){\n\t\t\tif( !foldername ){\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tgpiBridge(\n\t\t\t\t{\n\t\t\t\t\t'api': 'createNewFolder',\n\t\t\t\t\t'path': current_dir+foldername\n\t\t\t\t},\n\t\t\t\tfunction(result){\n\t\t\t\t\tif(!result.result){\n\t\t\t\t\t\talert(result.message);\n\t\t\t\t\t}\n\t\t\t\t\tcallback();\n\t\t\t\t}\n\t\t\t);\n\t\t\treturn;\n\t\t});\n\t}\n\n\t/**\n\t * ファイルを作成する\n\t */\n\tthis.mkfile = function(current_dir, callback){\n\t\toptions.mkfile(current_dir, function(filename){\n\t\t\tif( !filename ){\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tgpiBridge(\n\t\t\t\t{\n\t\t\t\t\t'api': 'createNewFile',\n\t\t\t\t\t'path': current_dir+filename\n\t\t\t\t},\n\t\t\t\tfunction(result){\n\t\t\t\t\tif(!result.result){\n\t\t\t\t\t\talert(result.message);\n\t\t\t\t\t}\n\t\t\t\t\tcallback();\n\t\t\t\t}\n\t\t\t);\n\t\t\treturn;\n\t\t});\n\t}\n\n\t/**\n\t * ファイルやフォルダを複製する\n\t */\n\tthis.copy = function(copyFrom, callback){\n\t\toptions.copy(copyFrom, function(copyFrom, copyTo){\n\t\t\tif( !copyTo ){ return; }\n\t\t\tif( copyTo == copyFrom ){ return; }\n\t\t\tgpiBridge(\n\t\t\t\t{\n\t\t\t\t\t'api': 'copy',\n\t\t\t\t\t'path': copyFrom,\n\t\t\t\t\t'options': {\n\t\t\t\t\t\t'to': copyTo\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tfunction(result){\n\t\t\t\t\tif(!result.result){\n\t\t\t\t\t\talert(result.message);\n\t\t\t\t\t}\n\t\t\t\t\tcallback();\n\t\t\t\t}\n\t\t\t);\n\t\t\treturn;\n\t\t});\n\t}\n\n\t/**\n\t * ファイルやフォルダの名前を変更する\n\t */\n\tthis.rename = function(renameFrom, callback){\n\t\toptions.rename(renameFrom, function(renameFrom, renameTo){\n\t\t\tif( !renameTo ){ return; }\n\t\t\tif( renameTo == renameFrom ){ return; }\n\t\t\tgpiBridge(\n\t\t\t\t{\n\t\t\t\t\t'api': 'rename',\n\t\t\t\t\t'path': renameFrom,\n\t\t\t\t\t'options': {\n\t\t\t\t\t\t'to': renameTo\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tfunction(result){\n\t\t\t\t\tif(!result.result){\n\t\t\t\t\t\talert(result.message);\n\t\t\t\t\t}\n\t\t\t\t\tcallback();\n\t\t\t\t}\n\t\t\t);\n\t\t\treturn;\n\t\t});\n\t}\n\n\t/**\n\t * ファイルやフォルダを削除する\n\t */\n\tthis.remove = function(path_target, callback){\n\t\toptions.remove(path_target, function(){\n\t\t\tgpiBridge(\n\t\t\t\t{\n\t\t\t\t\t'api': 'remove',\n\t\t\t\t\t'path': path_target\n\t\t\t\t},\n\t\t\t\tfunction(result){\n\t\t\t\t\tif(!result.result){\n\t\t\t\t\t\talert(result.message);\n\t\t\t\t\t}\n\t\t\t\t\tcallback();\n\t\t\t\t}\n\t\t\t);\n\t\t\treturn;\n\t\t});\n\t}\n\n\t/**\n\t * カレントディレクトリを得る\n\t */\n\tthis.getCurrentDir = function(){\n\t\treturn current_dir;\n\t}\n\n\t/**\n\t * カレントディレクトリをセットする\n\t */\n\tthis.setCurrentDir = function(path, callback){\n\t\tcurrent_dir = path;\n\t\tcallback = callback || function(){};\n\t\tgpiBridge(\n\t\t\t{\n\t\t\t\t'api': 'getItemList',\n\t\t\t\t'path': path,\n\t\t\t\t'options': options\n\t\t\t},\n\t\t\tfunction(result){\n\t\t\t\tif( !result.result ){\n\t\t\t\t\talert( result.message );\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\t// --------------------------------------\n\t\t\t\t// Path Bar\n\t\t\t\t$pathBar.innerHTML = '';\n\t\t\t\tvar tmpCurrentPath = '';\n\t\t\t\tvar tmpZIndex = 10000;\n\t\t\t\tvar breadcrumb = path.replace(/^\\/+/, '').replace(/\\/+$/, '').split('/');\n\t\t\t\tvar $li = document.createElement('li');\n\t\t\t\t$li.style.zIndex = tmpZIndex;tmpZIndex --;\n\t\t\t\tvar $a = document.createElement('a');\n\t\t\t\t$a.textContent = '/';\n\t\t\t\t$a.href = 'javascript:;';\n\t\t\t\t$a.addEventListener('click', function(){\n\t\t\t\t\t_this.setCurrentDir( '/' );\n\t\t\t\t});\n\t\t\t\t$li.append($a);\n\t\t\t\t$pathBar.append($li);\n\t\t\t\tfor(var i = 0; i < breadcrumb.length; i ++){\n\t\t\t\t\tif( !breadcrumb[i].length ){\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tvar $li = document.createElement('li');\n\t\t\t\t\t$li.style.zIndex = tmpZIndex;tmpZIndex --;\n\t\t\t\t\tvar $a = document.createElement('a');\n\t\t\t\t\t$a.textContent = breadcrumb[i];\n\t\t\t\t\t$a.href = 'javascript:;';\n\t\t\t\t\t$a.setAttribute('data-filename', breadcrumb[i]);\n\t\t\t\t\t$a.setAttribute('data-path', '/' + tmpCurrentPath + breadcrumb[i] + '/');\n\t\t\t\t\t$a.addEventListener('click', function(){\n\t\t\t\t\t\tvar targetPath = this.getAttribute('data-path');\n\t\t\t\t\t\t_this.setCurrentDir( targetPath );\n\t\t\t\t\t});\n\t\t\t\t\t$li.append($a);\n\t\t\t\t\t$pathBar.append($li);\n\t\t\t\t\ttmpCurrentPath += breadcrumb[i] + '/';\n\t\t\t\t}\n\n\t\t\t\t$elm.append($pathBar);\n\n\t\t\t\t// --------------------------------------\n\t\t\t\t// File list\n\t\t\t\t$fileList.innerHTML = '';\n\n\t\t\t\t// parent directory\n\t\t\t\tif(path != '/' && path){\n\t\t\t\t\tvar $li = document.createElement('li');\n\t\t\t\t\tvar $a = document.createElement('a');\n\t\t\t\t\t$a.textContent = '../';\n\t\t\t\t\t$a.href = 'javascript:;';\n\t\t\t\t\t$a.addEventListener('click', function(){\n\t\t\t\t\t\tvar tmp_path = path;\n\t\t\t\t\t\ttmp_path = tmp_path.replace(/\\/(?:[^\\/]*\\/?)$/, '/');\n\t\t\t\t\t\t_this.setCurrentDir( tmp_path );\n\t\t\t\t\t});\n\t\t\t\t\t$li.append($a);\n\t\t\t\t\t$fileList.append($li);\n\t\t\t\t}\n\n\n\t\t\t\t// contained file and folders\n\t\t\t\tfor( var idx in result.list ){\n\t\t\t\t\tif( filter.length ){\n\t\t\t\t\t\tif( result.list[idx].name.split(filter).length < 2 ){\n\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tvar $li = document.createElement('li');\n\t\t\t\t\tvar $a = document.createElement('a');\n\t\t\t\t\t$a.textContent = result.list[idx].name;\n\t\t\t\t\t$a.href = 'javascript:;';\n\t\t\t\t\t$a.setAttribute('data-filename', result.list[idx].name);\n\t\t\t\t\t$a.setAttribute('data-path', path + result.list[idx].name);\n\t\t\t\t\t$submenu = document.createElement('ul');\n\t\t\t\t\t$submenu.classList.add('remote-finder__file-list-submenu');\n\t\t\t\t\tif(result.list[idx].type == 'dir'){\n\t\t\t\t\t\t$a.textContent += '/';\n\t\t\t\t\t\t$a.classList.add('remote-finder__ico-folder');\n\t\t\t\t\t\t$a.addEventListener('click', function(e){\n\t\t\t\t\t\t\tvar filename = this.getAttribute('data-filename');\n\t\t\t\t\t\t\t_this.setCurrentDir( path+filename+'/' );\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}else if(result.list[idx].type == 'file'){\n\t\t\t\t\t\t$a.classList.add('remote-finder__ico-file');\n\t\t\t\t\t\t$a.addEventListener('click', function(e){\n\t\t\t\t\t\t\tvar path = this.getAttribute('data-path');\n\t\t\t\t\t\t\t_this.open( path, function(res){} );\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\n\t\t\t\t\tif( !result.list[idx].writable ){\n\t\t\t\t\t\t$a.classList.add('remote-finder__ico-readonly');\n\t\t\t\t\t}\n\n\t\t\t\t\t// copy\n\t\t\t\t\t$menu = document.createElement('button');\n\t\t\t\t\t$menu.textContent = 'copy';\n\t\t\t\t\t$menu.classList.add('remote-finder__ico-copy');\n\t\t\t\t\t$menu.setAttribute('data-filename', result.list[idx].name);\n\t\t\t\t\t$menu.addEventListener('click', function(e){\n\t\t\t\t\t\te.stopPropagation();\n\t\t\t\t\t\tvar filename = this.getAttribute('data-filename');\n\t\t\t\t\t\t_this.copy(path+filename, function(){\n\t\t\t\t\t\t\t_this.setCurrentDir( path );\n\t\t\t\t\t\t});\n\t\t\t\t\t});\n\t\t\t\t\t$submenuLi = document.createElement('li');\n\t\t\t\t\t$submenuLi.append($menu);\n\t\t\t\t\t$submenu.append($submenuLi);\n\n\t\t\t\t\t// rename\n\t\t\t\t\t$menu = document.createElement('button');\n\t\t\t\t\t$menu.textContent = 'rename';\n\t\t\t\t\t$menu.classList.add('remote-finder__ico-rename');\n\t\t\t\t\t$menu.setAttribute('data-filename', result.list[idx].name);\n\t\t\t\t\t$menu.addEventListener('click', function(e){\n\t\t\t\t\t\te.stopPropagation();\n\t\t\t\t\t\tvar filename = this.getAttribute('data-filename');\n\t\t\t\t\t\t_this.rename(path+filename, function(){\n\t\t\t\t\t\t\t_this.setCurrentDir( path );\n\t\t\t\t\t\t});\n\t\t\t\t\t});\n\t\t\t\t\t$submenuLi = document.createElement('li');\n\t\t\t\t\t$submenuLi.append($menu);\n\t\t\t\t\t$submenu.append($submenuLi);\n\n\t\t\t\t\t// delete\n\t\t\t\t\t$menu = document.createElement('button');\n\t\t\t\t\t$menu.textContent = 'delete';\n\t\t\t\t\t$menu.classList.add('remote-finder__ico-delete');\n\t\t\t\t\t$menu.setAttribute('data-filename', result.list[idx].name);\n\t\t\t\t\t$menu.addEventListener('click', function(e){\n\t\t\t\t\t\te.stopPropagation();\n\t\t\t\t\t\tvar filename = this.getAttribute('data-filename');\n\t\t\t\t\t\t_this.remove(path+filename, function(){\n\t\t\t\t\t\t\t_this.setCurrentDir( path );\n\t\t\t\t\t\t});\n\t\t\t\t\t});\n\t\t\t\t\t$submenuLi = document.createElement('li');\n\t\t\t\t\t$submenuLi.append($menu);\n\t\t\t\t\t$submenu.append($submenuLi);\n\n\t\t\t\t\t$a.append($submenu);\n\t\t\t\t\t$li.append($a);\n\t\t\t\t\t$fileList.append($li);\n\t\t\t\t}\n\t\t\t\t$elm.append($fileList);\n\t\t\t}\n\t\t);\n\t\treturn;\n\t}\n\n\t/**\n\t * Finderを初期化します。\n\t */\n\tthis.init = function( path, options, callback ){\n\t\tcurrent_dir = path;\n\t\tcallback = callback || function(){};\n\n\n\t\t// --------------------------------------\n\t\t// MENU\n\t\tvar $ulMenu = document.createElement('ul');\n\t\t$ulMenu.classList.add('remote-finder__menu');\n\n\t\t// create new folder\n\t\tvar $li = document.createElement('li');\n\t\tvar $a = document.createElement('a');\n\t\t$a.textContent = 'New Folder';\n\t\t$a.classList.add('remote-finder__ico-new-folder');\n\t\t$a.href = 'javascript:;';\n\t\t$a.addEventListener('click', function(){\n\t\t\t_this.mkdir(current_dir, function(){\n\t\t\t\t_this.setCurrentDir( current_dir );\n\t\t\t});\n\t\t});\n\t\t$li.append($a);\n\t\t$ulMenu.append($li);\n\n\t\t// create new file\n\t\tvar $li = document.createElement('li');\n\t\tvar $a = document.createElement('a');\n\t\t$a.textContent = 'New File';\n\t\t$a.classList.add('remote-finder__ico-new-file');\n\t\t$a.href = 'javascript:;';\n\t\t$a.addEventListener('click', function(){\n\t\t\t_this.mkfile(current_dir, function(){\n\t\t\t\t_this.setCurrentDir( current_dir );\n\t\t\t});\n\t\t});\n\t\t$li.append($a);\n\t\t$ulMenu.append($li);\n\n\t\t// file name filter\n\t\tvar $li = document.createElement('li');\n\t\tvar $input = document.createElement('input');\n\t\t$input.placeholder = 'Filter...';\n\t\t$input.type = 'text';\n\t\t$input.value = filter;\n\t\t$input.addEventListener('change', function(){\n\t\t\tfilter = this.value;\n\t\t\t_this.setCurrentDir( current_dir );\n\t\t});\n\t\t$li.append($input);\n\t\t$ulMenu.append($li);\n\n\t\t$elm.append($ulMenu);\n\n\t\t// --------------------------------------\n\t\t// Path Bar\n\t\t$pathBar = document.createElement('ul');\n\t\t$pathBar.classList.add('remote-finder__path-bar');\n\n\t\t$elm.append($pathBar);\n\n\t\t// --------------------------------------\n\t\t// File list\n\t\t$fileList = document.createElement('ul');\n\t\t$fileList.classList.add('remote-finder__file-list');\n\n\t\t$elm.append($fileList);\n\n\t\tthis.setCurrentDir(path, callback);\n\t}\n}\n\n\n//# sourceURL=webpack:///./src/remote-finder.js?");

/***/ })

/******/ });