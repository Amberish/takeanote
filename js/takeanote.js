/*Author: Amberish Raj(amberish.raj@gmail.com)
Useful links:
https://learn.jquery.com/plugins/basic-plugin-creation/
https://learn.jquery.com/plugins/advanced-plugin-concepts/
https://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin
https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/How-did-we-get-here%3F
*/
;(function ( $, window, undefined ) {
	//Plugin Definition
	$.fn.takeanote = function(options) {
		//Setting goes here
		var settings = $.extend( {
		  'classes'        : {
		  	'container' : 'note-container',
		  	'header'    : 'takeanote-header',
		  	'body'      : 'takeanote-body',
		  	'footer'    : 'takeanote-footer',
		  	'count'     : 'note-count',
		  },
	      'markupBottom'   : '<div class="takeanote-header">Take a Note <div class="note-count">0</div></div><div class="takeanote-body"><p>Here is note container</p></div><div class="takeanote-footer"><p>Creaed By: Amberish Raj</p></div>',
	      'markupTop'      : '<div class="takeanote-body"><p>Here is note container</p></div><div class="takeanote-footer"><p>Creaed By: Amberish Raj</p></div><div class="takeanote-header">Take a Note<div class="note-count">0</div></div>',
	    }, $.fn.takeanote.defaults, options);

	    settings.markupBottomSetting = function(){
	    	//Adjusting for bottom setings.
	    	var height = parseInt(settings.containerHeight);
			var heightTotal =  height + 30;
			
			//Setting body css
			$('.' + settings.classes.body).css({'height' : height + 'px'});

			//Setting header css
			setHeaderCSS($('.' + settings.classes.header), { 
				'header' : settings.header,
				'headerHover' : settings.headerHover,
			}, settings.location);			
			
			//Setting bottom value to negative(height + 30) to submerse container below screen
			$('.' + settings.classes.container).css({'bottom' : (-heightTotal) + 'px'});			
			params = {
				'objectHeader'    : $('.' + settings.classes.header),
				'objectContainer' : $('.' + settings.classes.container),
				'height'          : height,
				'heightTotal'     : heightTotal
			};
			headerClickAction(params, settings.location);
	    };

	    settings.markupTopSetting = function(){
	    	//Adjusting for top setings.
			var height = parseInt(settings.containerHeight);
			var heightTotal =  height + 30;	
			$('.' + settings.classes.body).css({'height' : height + 'px'});

			//Setting header css
			setHeaderCSS($('.' + settings.classes.header), { 
				'header' : settings.header,
				'headerHover' : settings.headerHover,
			}, settings.location);

			//Setting top value to negative(height + 30) to submerse container above screen
			$('.' + settings.classes.container).css({'top' : (-heightTotal) + 'px'});			
			params = {
				'objectHeader'    : $('.' + settings.classes.header),
				'objectContainer' : $('.' + settings.classes.container),
				'height'          : height,
				'heightTotal'     : heightTotal
			};
			headerClickAction(params, settings.location);
	    };

	    //set all settings to container.
	    return this.each(function() {
	    	var markup = (settings.location === 'top')?settings.markupTop:settings.markupBottom;
	    	$(this).attr({'class' : settings.classes.container}).css({
	    		//Default CSS for container
	    		'position': 'fixed',
				'width'   : '80%',
				'margin'  :'0px auto',
				'padding' : '0px',
				'left'    :'10%'
	    	});	    	
	    	$(this).append(markup);
	    	//Applying css settings as per location
	    	(settings.location === 'top')?settings.markupTopSetting():settings.markupBottomSetting();
	    });
	};

	//Private functions
	function setHeaderCSS(object, params, align){
    	var headerColor = (typeof params.header.background === 'undefined' || params.header.background === null)?'#B52D0F':params.header.background;
		var headerColorHover = (typeof params.headerHover.background === 'undefined' || params.headerHover.background === null)?headerColor:'#' + (parseInt(headerColor.substring(1), 16) + parseInt('ffdfa', 16)).toString(16);
		var style, styleHover;

		switch(align){
			case 'top':
				radius = '0px 0px 3px 3px';
				break;

			case 'bottom':
			default:
				radius = '3px 3px 0px 0px';
		}

		//params.header properties are stored her.
		//To strictly force some style, pass in third object
		//Default style in first object, header setting in second, force style-3rd object
		style = $.extend({
			'background' : headerColor
		}, params.header, {
			'border-radius'  : radius,
		});

		styleHover = $.extend({
			'background'  : headerColorHover,
		}, params.headerHover);

		//Binding all css
		object.css(style).mouseleave(function(){
			$(this).css(style);
		}).mouseenter(function(){
			$(this).css(styleHover);
		});		
	}

	function headerClickAction(params, location){
		//Click event for note header
		params.objectHeader.click(function(){
			var locationValue = (params.objectContainer.css(location) === '0px')?(-params.heightTotal) + 'px':'0px';
			var string = '{' +
							'"' + location + '" : "' + locationValue + '"'
						 + '}';
			jsonParam = $.parseJSON(string);
			
			params.objectContainer.animate(jsonParam);
		});
	}

	$.fn.takeanote.defaults = {
		'location'	     : 'bottom',
	    'containerHeight': '300px',
	    'header'         : {
			'background'  : '#B52D0F',
		},
		'headerHover' : {
			'background'  : '#C52B09',
		}
	};
}(jQuery, window));


$('.foo').takeanote({
	//two locations 'top' an 'bottom'
	'location' : 'bottom',
	'containerHeight' : '400px',
	//Define Header Css here, like color properties
	'header' : {
		//border radius will not override
		'width' : '150px',
		'border-radius'  : '10px',
	},
	'count' : {
		'background' : '#97A719'
	}
});