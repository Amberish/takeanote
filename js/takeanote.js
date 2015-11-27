/*Author: Amberish Raj(amberish.raj@gmail.com)
Useful links:
https://learn.jquery.com/plugins/basic-plugin-creation/
https://learn.jquery.com/plugins/advanced-plugin-concepts/
https://remysharp.com/2010/06/03/signs-of-a-poorly-written-jquery-plugin
https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/How-did-we-get-here%3F
*/
;(function ( $, window, undefined ) {

	/*Helper methods are defined in this scope*/
	_helpers = {
		createSentence : function(string) {
			/*Adding full stop and trimming text*/
			string = (string.charAt(string.length-1) !== '.' && string.length !== 0)?string.trim() + '.': string.trim();
		    return string.charAt(0).toUpperCase() + string.slice(1);
		},
	};

	/*UI related actions and parameters are bunched in this scope*/
	_UI = {
		elements : {
			'wrapper'   : 'note-container',
			'header'    : 'takeanote-header',
			'body'      : 'takeanote-body',
			'footer'    : 'takeanote-footer',
			'count'     : 'note-count',
			'overlay'   : 'overlay',
		},

		markup : {
			'top'      : '<div class="takeanote-body"></div><div class="takeanote-footer"><p>Created By: Amberish Raj</p></div><div class="takeanote-header">Take a Note<div class="note-count">0</div></div>',
			'bottom'   : '<div class="takeanote-header">Take a Note <div class="note-count">0</div></div><div class="takeanote-body"></div><div class="takeanote-footer"><p>Created By: Amberish Raj</p></div>',
			'overlay'  : '<div class="overlay"></div>'
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
			/*Overlay settings*/
			/*'overlay' : {
				 
			}*/					
		},
		/*Style to be forced*/
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
				},
			},
			/*Overlay settings*/
			'overlay' : {
				'width'  : $(window).width() + 'px',
				'height' : $(window).height() + 'px',
			}			
		},

		/*Parameter store final style to be applied elements*/
		final_style : {},
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

	    	/*Adding markup to DOM*/
	    	object.append(markup);

	    	
	    	/*Adding overlay div to the parent element and applying style*/
	    	object.parent().append(this.markup.overlay);

	    	this.setupOverlay(ui_params.overlay);

			/*Setting Alignment*/
			this.setAlign(alignment);

			/*Setting all css information in final_style variable*/
			this.setFinalStyle(ui_params);

			/*Finally applying those css to respective elements*/
			this.applyCSS();

			/*Bind header click event*/
			this.bindHeaderClickAction();

			return this;
		},

		setupOverlay : function(params){

			var style = $.extend(params, this.forced.overlay);
			$('.' + this.elements.overlay).css(style).hide();
		},	

		setAlign : function(align){
			this.align = align;
		},

		getAlign : function(){
			return this.align;
		},

		setFinalStyle : function(ui_params){
			//Setting header parameter
			this.final_style.header = $.extend(ui_params.header, this.forced[this.getAlign()].header);
			//Setting body parameter
			this.final_style.body = $.extend(ui_params.body, this.forced[this.getAlign()].body);
			//Setting footer parameter
			this.final_style.footer = $.extend(ui_params.footer, this.forced[this.getAlign()].footer);
			//Setting wrapper parameter
			this.final_style.wrapper = $.extend(ui_params.wrapper, this.forced[this.getAlign()].wrapper);
		},

		getFinalStyle : function(){
			return this.final_style;
		},

		/**
		*This applyCSS method is used for applying final_style css to all the elements
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
	_UIActions =  {
		headerClick : function(uiobj){			
			/*Click event for note header*/
			$('.' + uiobj.elements.header).click(function(){
				/*Setting total height i.e. height of body + 30 offset(probably footer)*/
				var heightTotal = -(parseInt($('.' + uiobj.elements.body).css('height')) + 30 ) + 'px';
				var locationValue = ($('.' + uiobj.elements.wrapper).css(uiobj.getAlign()) === '0px')?heightTotal:'0px';
				var string = '{' +
								'"' + uiobj.getAlign() + '" : "' + locationValue + '"'
							 + '}';
				jsonParam = $.parseJSON(string);

				/*Overlay operation show/hide*/
				$('.' + uiobj.elements.overlay).hide();
				/*If panel colapse then hide overlay, else show overlay*/
				if(locationValue === '0px'){
					$('.' + uiobj.elements.overlay).show();				
				}
				
				$('.' + uiobj.elements.wrapper).animate(jsonParam);
			});
		},

		counterUpdate : function(){
			var count = parseInt($('.'+_UI.elements.count).text());
			count++;
			$('.'+_UI.elements.count).html(count);
		},
	};

	/*Note related actions are bunched in this scope*/
	_Note = {
		note    : '',
		current_point : '',

		list_style : {

		},

		init : function(){

			var object = this;

			/*Binding select action to document*/
	    	$(document).mouseup(function(){
	    		/*Generating selected text*/
	    		var point = _Selection.getSelection('text');

	    		/*Setting current_point*/
				object.setCurrentPoint(point);

				/*setting note variable*/
				object.setNote();

				/*Finally adding note created to body*/
				object.addNotesToBody();
	    	});
		},

		setCurrentPoint : function(type){
			/*creating list item*/
			this.current_point = '<li>' + _helpers.createSentence(_Selection.getSelection(type)) + '</li>';
		},

		getCurrentPoint : function(){
			return this.current_point;
		},

		setNote : function(){
			var bodyEL = '.' + _UI.elements.body;
			var html = ($(bodyEL).has('ul').length)?$('<ul/>').html($(bodyEL).find('ul').html()):$('<ul/>');
			var point = this.getCurrentPoint();
			var point_val = $(point).html();
			var count = 0;

			$.each(html.find('li'), function(i, obj){
				/*Iterating throught all elements. If current point matches any point, then count in incremented*/
				if(point_val === $(obj).html()){
					count++;
				}
			});

			if(count == 0 && point_val !== ''){
				html.append(point);
			}

			this.note = html.html();			
		},

		getNote : function(){
			return this.note;
		},

		addNotesToBody : function(){
			var bodyEl = '.' + _UI.elements.body;
			var body_ul_val = $(bodyEl).find('ul').html();
			var new_ul = $('<ul/>');
			var html = this.getNote();
			new_ul.append(html);
			ul_val = new_ul.html();

			/*Insert new ul in body only if it is different from watever in stored in body*/
			if(ul_val !== body_ul_val && ul_val != ''){
				$(bodyEl).html(new_ul);
				/*Update counter on insertion of new point*/
				_UIActions.counterUpdate();
			}			
		},
	};

	_Selection = {
		getSelection : function(type){			
			return $.selection(type);		
		},

		storeSelection : function(){

		}
	};

	var debug = function(param){
		console.log(param);
	};

	/*Takeanote Plugin Definition starts here.*/
	$.fn.takeanote = function(options) {
		//Setting goes here
		var settings = $.extend( {}, $.fn.takeanote.defaults, options);	    
	   
	    //Initialize UI elements
	    var align = settings.location;
    	var style = settings.ui;
    	_UI.init(this, align, style);

    	/*Initializing note actions*/
    	_Note.init();	
	};

	$.fn.takeanote.defaults = {
		'location'	     : 'bottom',
	};
}(jQuery, window));