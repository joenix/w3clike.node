/* !!
 * Roo
 * Easy kit by script
 * ===== ===== ===== ===== =====
 */

(function( global, roo ){

	// 类库必须运行在浏览器内核环境下
	if( global.document ){

		// 运行类库
		roo( global, global.config || {});
	}
	else{

		// 抛出错误
		throw new Error('Roo must require in window with a document');
	}

})
(window || this, function(window, config){

	var
		version = '1.0.0.0'

	  ,	document = window.document

	  ,	body = document.body

	  ,	protocol = window.location.protocol

	  ,	root = protocol + '//' + window.location.host

	  ,	array = []

	  ,	slice = array.slice

	  ,	concat = array.concat

	  ,	push = array.push

	  ,	indexOf = array.indexOf

	  ,	sort = array.sort

	  ,	splice = array.splice

	  ,	json = {}

	  ,	toString = json.toString

	  ,	hasProperty = json.hasOwnProperty

	  ,	support = {}

	  ,	noop = function(){}

	  ,	_ = function(){

			return new _.ext.init( config );

		};

	_.fn = _.prototype = {

		version: version

	  ,	constructor: _

	  ,	length: 0

	  ,	init: function(){

			return this;

		}
	},

	// 核心
	_.ext = _.fn.ext = function(){

		var
			i = 1

		  ,	target = arguments[0] || {}

		  ,	length = arguments.length

		  ,	options

		  ,	name

		  ,	src

		  ,	copy;

		if( typeof target !== 'object' ){
			target = {};
		}

		if( i === length ){
			target = this;
			i--;
		}

		for( ; i < length; i++ ){

			if( (options = arguments[ i ]) ){

				// 参数为function
				if( typeof options !== 'object' ){

					target = this, name = arguments[0], copy = target[ name ];

					if( copy !== options ){
						target[ name ] = (copy = options);
					}

					continue;
				}

				// 参数为object
				for( name in options ){

					src = target[ name ], copy = options[ name ];

					if( target === copy ){
						continue;
					}

					target[ name ] = copy;

				}

			}

		}

		return target;

	};

	// 集合
	_.ext({

		constant: {

			type: 'Boolean Number String Function Array Date RegExp Object Error Json'.split(' '),

			protocol: 'Http Https Ftp Ws'.split(' '),

			event: ('blur focus focusin focusout load resize scroll unload click dblclick '
					+'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '
					+'change select submit keydown keypress keyup error contextmenu').split(' ')
		}

	});

	// 基础
	_.ext({

		// 检测: 包含
		inArray: function(obj, arr){
        	return arr == null ? -1 : indexOf.call( arr, obj );
    	},

		// 循环
		each: function( obj, callback, mode ){

			mode = mode || 0;

			var
				i = 0

			  ,	isScope = mode.constructor === array && mode.length >= 2

			  ,	mode = ( !~mode || _.inArray( mode, [-1, 0, 1, 2] ) || isScope) ? mode : 0

			  ,	length = obj.length

			  ,	start = i

			  ,	end = length

			  ,	increase = 1

			  ,	value;

			if( length ){

				if( !~mode ){

					for( i=length; i--; ){
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}

				}
				else{

					if( isScope ){

						start = mode[0], end = mode[1];

					}
					else{

						switch( mode ){

							case 1:
								start = increase, increase++;
								break;

							case 2:
								increase++;
								break;

						}

					}

					for( i=start; i<end; i+=increase ){
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}

				}

			}
			else{

				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}

			}

			return obj;
		},

		// 验证: 类型
		type: function(obj, type){
			if( type === 'Json' ){
				return this.type(obj, 'Object') && !obj.length;
			}
			return /\s\w+/.exec( toString.call(obj) ).toString().substr(1) == type;
		},

		// 验证: 链接
		link: function(str, type){
			return new RegExp( '^' + ( this.isArray(type) ? ('(' + type.join('|') + ')') : 'http' ) + ':' ).test( str );
		}
	});

	// 拓展: 验证
	_.each( _.constant.type, function(i, name){

		_.ext('is' + name, function(obj){
			return this.type( obj, name );
		});

	});

	// 拓展: 链接
	_.each( _.constant.protocol, function(i, name){

		_.ext('is' + name, function(str){
			return this.link( str, name.toLowerCase() );
		});

	});

	// 拓展: 事件
	(function( evt ){

		_.each( _.constant.event, function(i, name){

			evt[ name ] = name;

		});
		
	})( _.evt = {} );

	// 封装
	_.ext({

		// 事件
		event: {
			global: {},

			fn2name: function(fn){
				return fn ? (_.isFunction( fn ) ? fn.toString().match(/\w+/g)[1] : fn) : undefined;
			},

			type2on: function(type){
				return 'on' + type.substr(0, 1).toUpperCase() + type.substr(1);
			},

			protect: function(obj, type){
				return obj.events = obj.events || [], obj.events[type] = obj.events[type] || {}, obj;
			},

			add: function(obj, type, fn){

				var
					guide = _.event.global,

					evt = obj.addEventListener ? 'addEventListener' : 'attachEvent',

					name = _.event.fn2name( fn );

				_.event.protect( obj, type ).events[ type ][ name ] = fn;

				// 执行绑定事件
				obj[ evt ]( type, fn );

			},

			remove: function(obj, type, fn){

				var
					guide = _.event.global,

					evt = obj.removeEventListener ? 'removeEventListener' : 'detachEvent',

					events = obj.events || [],

					name = _.event.fn2name( fn );

				if( !events ){
					return;
				}

				if( type ){

					if( name ){

						obj[ evt ]( type, events[ type ][ name ] );

					}
					else{

						_.each( events[type], function(name, handle){

							obj[ evt ]( type, handle );

						});

					}

					return;

				}

				_.each( events, function(type, evts){

					_.each( evts, function(name, handle){

						obj[ evt ]( type, handle );

					});

				});

			},

			hand: function(obj, type, name){

				var
					events = obj.events || [],

					ecache,

					onEvent;

				if( type ){

					ecache = events[ type ] || _.noop;

					if( name ){

						ecache[name] ? ecache[name]() : ecache();
					}
					else{

						_.each( ecache, function(index, fn){

							fn();

						});

					}

				}
				else{

					_.each( _.constant.events, function(i, type){

						if( ecache = events[type] ){

							_.each( ecache, function( name, handle ){

								// onEvent = _.event.type2on( type );

								// 执行handle时, 没有event
								handle({
									target: obj,
									type: type
								});

							});

						}

					});

				}

			}
		},

		// 事件: 绑定
		on: function(obj, type, fn){

			_.event.add(obj, type, fn);

		},

		// 事件: 解绑
		off: function(obj, type, fn){

			_.event.remove(obj, type, fn);

		},

		// 事件: 执行
		trigger: function(obj, type){

			_.event.hand(obj, type);

		},


		// 数据
		data: function(){},


		// 选择器
		selector: function( obj, query, one ){

			obj = (this.isString(obj) ? ( one = query, query = obj, document ) : obj).querySelectorAll( query );

			return one ? obj[0] : obj;

		},


		// 样式
		css: function( obj, text ){

			if( text ){

				if( this.isString(text) ){

					obj.style.cssText = text;

				}
				else{

					this.each(text, function(name, style){

						obj.style[name] = style;

					});

				}

				return;

			}
		}

	});

	return window.r = window.roo = _;

});
