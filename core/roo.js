module.exports = function( options, code ){

// 开始
return function( api, app ){

	api.http
		// 服务器
		.createServer(function(request, response){

			app( ( api.request = request, api.response = response, api ), options );

		})
		// 端口
		.listen( options.port > 0 ? options.port : 9999 );

}
/* !!
 * -----
 * Roo 参数
 * ----- ----- ----- ----- -----
 */
(


/* !!
 * API 加载
 * ----- ----- -----
 */
{
	// HTTP服务器
	http: require('http'),

	// URL处理函数
	route: require('url'),

	// 路径处理函数
	path: require('path'),

	// 参数处理函数
	param: require('querystring'),

	// 文件处理函数
	fs: require('fs'),

	// 事件
	events: require('events')
},


/* !!
 * APP 接口
 * ----- ----- -----
 */
function( api, options ){

	return function( config ){

		var

			noop = function(){};


		// Debug
		process.on('uncaughtException', function( error ){

			if( options.debug ){

				// 错误
				console.log( error );

				// 栈
				console.log( error.stack );

			}

		});


		// Code
		code(

			// API
			{

				// 配置项
				config: config,

				// 工具方法
				core: {

					noop: noop

					/* !! 循环
					 * @ arr: Array Or Json
					 * @ callback: Function
					 * @ type: -1 => Reverse, even => 0 2 4, odd => 1 3 5, num => Number // Todo: arr => [from, to]
					 */
				  ,	each: function( arr, callback, type ){

						return function( len, i, rate ){

							rate = type ? ( type.constructor === Number ? type : 2 ) : 1;

							if( len ){

								if( !~type ){ // -1

									for( i = len; i--; ){

										callback( i, arr[i] );

									}

								}
								else{

									for( i = 0; i < len; i++ ){

										if( type == 'odd' ){

											if( i % rate == 1 ){

												callback( i, arr[i] );

											}

										}
										else{

											if( !(i % rate) ){

												callback( i, arr[i] );

											}

										}

									}

								}

							}
							else{

								for( i in arr ){

									callback( i, arr[i] );

								}

							}

							return arr;

						}( arr.length );

					}

					/* !! 合并
					 * @ origin: 原始
					 * @ extend: 拓展 ( N )
					 */
				  ,	merge: function(){

						var

							origin,

							extend,

							x,

							i;

						for( x = 0; x < arguments.length; x++ ){

							if( x ){

								extend = arguments[x];

								for( i in extend ){

									origin[i] = origin[i] || extend[i];

								}

							}
							else{

								origin = arguments[x];
							
							}

						}

						return origin;

					}

					/* !!
					 * 路由解析
					 * ----- ----- ----- ----- -----
					 * @ type: Param
					 * @ url: Url Address
					 */
				  ,	route: function( type, url ){

						return function( url, path, param, result ){

							switch( type ){

								// Result: String
								case 'suffix':

									result = path.extname( url.pathname );

									break;

								// Result: String
								case 'sep':

									result = path.dirname( url.pathname ).split( path.sep );

									break;

								// Result: String
								case 'active':

									result = path.basename( url.pathname, path.extname( url.pathname ) );

									break;

								// Result: Json
								case 'param':

									result = param.parse( url.query );

									break;

								// Result: Path
								case 'path':

									result = url.path;

									break;

							}

							return result;

						}( api.route.parse( url ), api.path, api.param );

					}

					/* !!
					 * Suffix Type
					 * ----- ----- ----- ----- -----
					 */
				  ,	suffixType: function( suffix ){

						return function( contentType ){

							return { 'Content-Type': contentType[ suffix || 'octet' ] };

						}({
							'octet': 'application/octet-stream',
							'.html': 'text/html',
							'.css': 'text/css',
							'.js': 'text/javascript',
							'.json': 'application/json',
							'.jpg': 'image/jpg',
							'.png': 'image/png',
							'.gif': 'image/gif',
							'.bmp': 'image/bmp',
							'.ico': 'image/ico'
						});

					}

					/* !!
					 * Render String
					 * ----- ----- ----- ----- -----
					 * @ info: String
					 * @ data: Json
					 * @ sub: Start
					 * @ sup: End
					 * @ callback: Callback Function
					 */
				  ,	render: function( options ){

						return function( options, callback, base ){

							return callback(

								// 参数
								{

									// 信息
									info: options.info || '',
									// 数据
									data: options.data || {},
									// 首标
									sub: options.sub || '{{',
									// 末标
									sup: options.sup || '}}',
									// 对象
									it: options.it || 'it',
									// 回调
									callback: options.callback || noop

								},

								// 方法
								{

									// 正则规则
									law: function( rule ){

										return '(' + base + ( rule ? ( '|' + rule ) : '' ) + ')+';

									},

									// 首末标
									statute: function( s ){

										return function( f ){

											return f + s.split('').join( f );

										}( unescape('%5C') );

									},

									clear: function( word ){

										return word.match( this.law() )[0];

									},

									recursive: function( list, data ){

										if( list.length ){

											return arguments.callee( list, data[ list.shift() ] );

										}

										return data;

									}
								}
							);

						}
						(
							options || {},

							function( options, action ){

								options.sub = action.statute( options.sub ), options.sup = action.statute( options.sup );

								return function( reg, data ){

									options.info = options.info.replace( new RegExp( reg, 'g' ), function( word ){

										return action.recursive( action.clear( word ).split('.'), ( data[ options.it ] = options.data, data ) );

									});

									return options.callback( options.info ), options.info;

								}( ( options.sub + action.law('\\s') + options.sup ), {} );

							},

							'\\w|\\.'
						);

					}

					/* !!
					 * Read Resource
					 * ----- ----- ----- ----- -----
					 * @ url: Resource Url
					 * @ callback: Callback Function
					 * @ base: Base Document
					 */
				  ,	read: function( path, callback ){

						return function( route, callback ){

							callback( api.fs, config.root + path );

						}
						(
							api.route,

							// Read Resource
							function( fs, path ){

								fs.readFile( path, function(e, item){

									return callback( e || item );

								});

							}
						);

					}

					/* !!
					 * Load Template
					 * ----- ----- ----- ----- -----
					 * @ active: Pages Url
					 * @ callback: Callback Function
					 */
				  ,	template: function( active, callback ){

						var res = '';

						return function( fs, active, handle, fn ){

							if( active.length ){

								fn = arguments.callee;

								handle( fs, active.shift(), function( html ){

									res += html, fn( fs, active, handle );

								});
							}
							else{

								return callback( res );

							}
						}(
							require('fs'),

							( active.constructor == Array ? active : active.split('') ),

							function( fs, url, callback ){

								fs.readFile( url, 'utf-8', function(e, html){

									return callback( e || html );

								});

							}
						);

					}
				}
			},

			// API
			api
		);

	}
	({
		// 调试
		debug: options.debug.constructor == Boolean ? options.debug : false,

		// 文档根目录
		root: options.root || __dirname,

		// WEB根目录
		host: 'http://' + api.request.headers['host'],

		// User Agent
		ua: api.request.headers['user-agent'],

		// 后缀名
		suffix: options.suffix ? options.suffix : 'htm html css js json jpg jpeg png gif bmp'.split(' '),

		// 模块
		plate: options.plate ? options.suffix : ['index']

	});

}


);

// 结束

};