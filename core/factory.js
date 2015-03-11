module.exports = function( general, callback ){

	return callback( general );

}
(
	// General
	{
		/* !!
		 * @ arr: Array Or Json
		 * @ callback: Function
		 * @ type: -1 => Reverse, even => 0 2 4, odd => 1 3 5, num => Number // Todo: arr => [from, to]
		 */
		each: function( arr, callback, type ){

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

			}( arr.length );

		},

		/* !!
		 * @ name => fucntion
		 * @ json: name => function
		 */
		extend: function(){

			var

				name = arguments[0],

				hand = arguments[1],

				fn = arguments.callee;

		},

		/* !!
		 * @ origin: 原始
		 * @ extend: 拓展 ( N )
		 */
		merge: function(){

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

	},

	// Callback
	function( $ ){

		return $.merge( $,
			
			// Tools
			{
				inArray: function( one, arr, i ){
					return arr ? [].indexOf.call( arr, one, i ) : -1;
				}
			},

			// Extends
			{
				/* !!
				 * Load Template
				 * ----- ----- ----- ----- -----
				 * @ active: Page Name
				 * @ callback: Callback Function
				 * @ def: Default Params
				 */
				template: function( active, callback, def ){

					var res = '', fn;

					return function( fs, def, handle ){

						if( def.length ){

							fn = arguments.callee;

							handle( fs, def.shift(), function( html ){

								res += html, fn( fs, def, handle );

							});
						}
						else{

							return callback( res );

						}
					}(
						require('fs'),

						def || ('resource head ' + active + ' foot init').split(' '),

						function( fs, page, callback ){

							fs.readFile( __dirname + '/../template/' + ( page == active ? '' : 'public/' ) + page + '.html', 'utf-8', function(e, html){

								return callback( e || html );

							});

						}
					);

				},

				/* !!
				 * Route Parse
				 * ----- ----- ----- ----- -----
				 * @ type: Param
				 * @ url: Url Address
				 */
				route: function( type, url ){

					return function( route, path, search, result ){

						url = route.parse( url );

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

								result = search.parse( url.query );

								break;

						}

						return result;

					}( require('url'), require('path'), require('querystring') );

				}
			}
		);

	}
);