(function(_, factory, undefined){

	!function($){

		factory(

			// 类库
			$ // _.roo
			
			// 节点
		  ,	{
				header:  $.selector('header', true),
				footer:  $.selector('footer', true),
				section: $.selector('section', true)
			}
			// 方法
		  ,	{
		  		// 彩虹
				rainbow: function( elements, colors ){
					$.each(colors, function(index, color){
						$.css( elements[ index ], { color: '#' + color });
					});
				},
				// 下拉
				drop: function( drops ){
					$.each( drops, function(index, drop){
						!function( menu, content ){
							$.on( drop, $.evt.mouseout, function(){
								$.css( content, { display: 'none' });
							});
							$.on( drop, $.evt.mouseover, function(){
								$.css( content, { display: 'block' });
							});
							$.trigger( drop, $.evt.mouseout );
						}( $.selector( drop, 'dt', true ), $.selector( drop, 'dd', true ) );
					});
				},
				// 选择
				select: function( menus, target, callback ){
					$.each( menus, function(index, menu){
						$.on( menu, $.evt.click, function(){
							target.innerHTML = menu.innerHTML;
						});
					});
				},
				// 变色
				deformate: function( element, colors ){
					!function( max, index ){
						max = --max;
						$.on( element, $.evt.mouseover, function(){
							!function( color ){
								$.css( element, {
									borderColor: color
								});
								$.css( $.selector( element, 'dl.drop', true ), {
									borderRightColor: color
								});
								$.css( $.selector( element, 'dl.drop dt i.caret', true ), {
									borderTopColor: color
								});
								$.css( $.selector( element, 'dl.drop dd', true ), {
									borderColor: color
								});
								$.css( $.selector( element, 'button', true ), {
									background: color
								});
							}( '#' + colors[ (index = index < max ? ++index : 0) ] );
						});
						$.trigger( element, $.evt.mouseover );
					}( colors.length );
				}
			}
		);

	}( _.roo );

})(window, function($, dom, action){

	// Rain Colors: Logo
	action.rainbow( $.selector( dom.header, 'i' ), '09c 0cf 0c6 f90 f60 c30 f00 fff fff fff fff'.split(' ') );

	// Drops: Search
	action.drop( $.selector('dl.drop') );

	// Drops: Select
	action.select( $.selector('dl.drop bdo'), $.selector('dl.drop strong', true) );

	// Hover Color: Search
	// action.deformate( $.selector('.search', true), '09c f00 0c6 f60'.split(' ') );

});