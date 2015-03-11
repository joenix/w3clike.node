var

	// 配置项
	conf = require('./core/manifest')

	// 方法工厂
  ,	fact = require('./core/factory')

	// 初始化
  ,	init = function( http ){

		http
			// HTTP服务器
			.createServer(function (request, response) {

				console.log( require('url').parse(request.url) );
				console.log( '----- ----- -----' );

				console.log( fact.route( 'param', request.url ) );
				console.log( fact.route( 'suffix', request.url ) );
				console.log( fact.route( 'sep', request.url ) );
				console.log( fact.route( 'active', request.url ) );
				console.log( '----- ----- -----' );
				return;

				fact.template('index', function( html ){
					response.writeHead( 200, {'Content-Type': 'text/html'} );
					response.write( html );
					response.end();
				});
			})
			// 监听端口
			.listen( conf.port );

	}( require('http') );