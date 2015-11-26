/*Author: Amberish Raj(amberish.raj@gmail.com)
Useful links:
https://learn.jquery.com/plugins/basic-plugin-creation/
https://learn.jquery.com/plugins/advanced-plugin-concepts/
https://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin
https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/How-did-we-get-here%3F
*/
;(function ( $, window, undefined ) {

	_UI = {
		elements : {
			'wrapper'   : 'note-container',
			'header'    : 'takeanote-header',
			'body'      : 'takeanote-body',
			'footer'    : 'takeanote-footer',
			'count'     : 'note-count',
		},

		markup : {
			'top'      : '<div class="takeanote-body"><p>Here is note container</p></div><div class="takeanote-footer"><p>Created By: Amberish Raj</p></div><div class="takeanote-header">Take a Note<div class="note-count">0</div></div>',
			'bottom'   : '<div class="takeanote-header">Take a Note <div class="note-count">0</div></div><div class="takeanote-body"><p>Here is note container</p></div><div class="takeanote-footer"><p>Created By: Amberish Raj</p></div>',
		},
		
		/*Limit properties that can be changed. Only those properties can be changed hose are defined in this variable*/
		properties : ['color', 'width', 'height', 'background'],

		/*Default value of current alignment*/
		align : 'top',

		alignments : {
			'top' : 'top',
			'bottom' : 'bottom',
		},

		defaults : {
			'top' : {
				'header' : {
					'background' : '#B52D0F',
				},
				'header-focus' : {
					'background' : '#B52D0F',
				}
			},
			'bottom' : {
				'header' : {
					'background' : '#B52D0F',
				},
				'header-focus' : {
					'background' : '#B52D0F',
				}
			},					
		},

		forced : {
			'top' : {
				'header' : {
					'radius' : '0px 0px 3px 3px',
				},
				'header-focus' : {
					
				},
				'wrapper' : {
					'position': 'fixed',
					'width'   : '80%',
					'margin'  :'0px auto',
					'padding' : '0px',
					'left'    :'10%',
					/*'top'     : '-330px',*/
				},
			},
			'bottom' : {
				'header' : {
					'radius' : '3px 3px 0px 0px',
				},
				'header-focus' : {
					
				},
				'wrapper' : {
					'position': 'fixed',
					'width'   : '80%',
					'margin'  :'0px auto',
					'padding' : '0px',
					'left'    :'10%',
					/*'bottom'     : '-330px',*/
				},
			},				
		},

		/*Parameter store final style applied to the element*/
		finalStyle : {},
		/*
		ui_params = {
			header : {
				'color' : 'red'
			}
		}
		*/
		init : function(object, alignment, ui_params){

			/*Inserting markup*/
			var markup = (alignment === 'top')?this.markup.top:this.markup.bottom;
	    	object.attr({'class' : this.elements.wrapper});
	    	object.append(markup);

			/*Setting Alignment*/
			this.setAlign(alignment);

			/*Setting all css information in finalStyle variable*/
			this.setFinalStyle(ui_params);

			/*Finally applying those css to respective elements*/
			this.applyCSS();

			/*Bind header click event*/
			this.bindHeaderClickAction();

			return this;
		},

		setAlign : function(align){
			this.align = align;
		},

		getAlign : function(){
			return this.align;
		},

		setFinalStyle : function(ui_params){
			//Setting header parameter
			this.finalStyle.header = $.extend(ui_params.header, this.forced[this.getAlign()].header);
			//Setting body parameter
			this.finalStyle.body = $.extend(ui_params.body, this.forced[this.getAlign()].body);
			//Setting footer parameter
			this.finalStyle.footer = $.extend(ui_params.footer, this.forced[this.getAlign()].footer);
			//Setting wrapper parameter
			this.finalStyle.wrapper = $.extend(ui_params.wrapper, this.forced[this.getAlign()].wrapper);
		},

		getFinalStyle : function(){
			return this.finalStyle;
		},

		/**
		*This applyCSS method is used for applying finalStyle css to all the elements
		**/
		applyCSS : function(){
			var style = this.getFinalStyle();
			
			//setting css for all elements			
			$('.' + this.elements.header).css(style.header);
			$('.' + this.elements.body).css(style.body);
			$('.' + this.elements.footer).css(style.footer);
			$('.' + this.elements.wrapper).css(style.wrapper);
			
			/*Now hide panel by sending upward or downwards depending upon alignment*/
			var locationValue = -(parseInt($('.' + this.elements.body).css('height')) + 30 ) + 'px';

			var adjustCSS = '{' +
							'"' + this.getAlign() + '" : "' + locationValue + '"'
						 + '}';
			jsonParam = $.parseJSON(adjustCSS);
			$('.' + this.elements.wrapper).css(jsonParam);
		},

		bindHeaderClickAction : function(){
			_UIActions.headerClick(this);
		}
	};

	/*All User Interface Actions goes in this object*/
	_UIActions = {
		headerClick : function(uiobj){
			//Click event for note header
			$('.' + uiobj.elements.header).click(function(){
				var heightTotal = -(parseInt($('.' + uiobj.elements.body).css('height')) + 30 ) + 'px';
				var locationValue = ($('.' + uiobj.elements.wrapper).css(uiobj.align) === '0px')?heightTotal:'0px';
				var string = '{' +
								'"' + uiobj.getAlign() + '" : "' + locationValue + '"'
							 + '}';
				jsonParam = $.parseJSON(string);
				
				$('.' + uiobj.elements.wrapper).animate(jsonParam);
			});
		}
	};

	var debug = function(param){
		console.log(param);
	}

	/*Takeanote Plugin Definition starts here.*/
	$.fn.takeanote = function(options) {
		//Setting goes here
		var settings = $.extend( {}, $.fn.takeanote.defaults, options);	    
	   
	    //Initialize UI elements
	    align = settings.location;
    	style = settings.ui;
    	_UI.init(this, align, style);
    	
	};

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