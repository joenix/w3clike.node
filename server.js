(function( server, code ){

	server(

		// 参数
		{
			// 文档根目录
			root: __dirname,

			// 端口
			port: 9999,

			// 后缀名
			suffix: 'html css js json jpg png gif bmp eot svg ttf woff woff2'.split(' '),

			// 模块
			plate: 'index search star tool'.split(' '),

			// 调试模式
			debug: true
		},

		// 代码
		code
	);

})( require('./core/roo'), function( app, api ){

	var

		// Route 参数
		route = function( url, route ){

			// 当前
			return {
				// 后缀
				suffix: route( 'suffix', url ),
				// 模块
				active: route( 'active', url ),
				// 路径
				path:   route( 'path',   url ),
				// sep
				sep:    route( 'sep',    url ),
				// 参数
				param:  route( 'param',  url )

			}

		}( api.request.url, app.core.route ),

		// 模板(们)
		tempo = function( active ){

			return function( list ){

				return app.core.each( list, function( index, page ){

					list[ index ] = app.config.root + '/template' + ( page == active ? '' : '/public' ) + '/' + page + '.html';

				});

			}( ('resource head ' + active + ' foot init').split(' ') );

		};


	// 业务功能
	switch( route.suffix ){

		case '.html':

			app.core.template( tempo( route.active ), function( html ){

				html = app.core.render({
					info: html,
					data: {
						host: app.config.host,
						active: app.core.route( 'active', app.config.host )
					}
				});

				api.response.writeHead( 200, app.core.suffixType( route.suffix ) );
				api.response.end( html );
			});

			break;

		default:

			if( route.suffix ){

				app.core.read( route.path, function( item ){
					api.response.writeHead( 200, app.core.suffixType( route.suffix ) );
					api.response.end( item );
				});

				return;

			}

			api.response.writeHead( 404, app.core.suffixType( route.suffix ) );
			api.response.end();

			break;

	}

});