# Roo v1 - Help


## Demo

	var roo = require('roo');
	
	roo( options, function( app ){
	
		console.log( app.config );
	
	});


## Config

*	root: 文档根目录
*	host: WEB根目录
*	ua: 客户端信息
*	suffix: 后缀名
*	plate: 模块


## Core

* each: 循环
* merge: 合并
* route: 路由解析
* suffixType: 后缀名头信息
* read: 资源读取
* template: 加载模板