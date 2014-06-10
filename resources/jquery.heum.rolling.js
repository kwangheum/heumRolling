/**
 * version : 1.0
 * developer : kwangheum
 * email : myrkh1213@gmail.com
 * blog : http://kwangheum.blogspot.kr
 * github : http://github.com/kwangheum
*/
(function($, window, document, undefined) {
	var initSetTimeout = new Array(),
		scrollStatus  = new Array(),
		initOptions = new Array(),
		pluginName = "heumRolling", 
		defaults = {
			scroll : "horizontal",//horizontal,vertical
			rolling : "next",//next,prev
			autoscroll : true,
			button : false,
			timer : 5
			//groupsize
		};
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	function setInitOption(selector, options){
		var thisIndex = $(".heum-item-group").index(selector.find(".heum-item-group"));
		initOptions[thisIndex] = options;
	}
	function eventHandler(event, selector) {
	    event.stopPropagation();
	    event.preventDefault();
	    if (event.type === 'touchend'){
	        selector.off('click');
	    }
	}
	function rollingBridge(selector,autoscroll,timer,rolling,scroll){
		var thisIndex = $(".heum-item-group").index(selector.find(".heum-item-group"));
	    if(autoscroll){
	    	clearTimeout(initSetTimeout[thisIndex]);
	    	initSetTimeout[thisIndex] = setTimeout(function(){
	        	rollingSubBridge(selector,autoscroll,timer,rolling,scroll);
	        }, (timer*1000));     
	    }else{
	    	clearTimeout(initSetTimeout[thisIndex]);
	    	return false;
	    }
	    return false;
	}
	function rollingSubBridge(selector,autoscroll,timer,rolling,scroll){
		heum_rolling(selector,rolling,scroll);
		rollingBridge(selector,autoscroll,timer,rolling,scroll);
	}
	function buttonDisabled(selector,disabled){
		if(disabled){
			selector.find("*").filter(function() {
				$(this).addClass("disabled");
			});
		}else{
			selector.find("*").filter(function() {
				$(this).removeClass("disabled");
			});
		}
		selector.find("*").filter(function() {
			$(this).prop("disabled",disabled);
		});
	}
	function heum_rolling(selector,rolling,scroll){
		buttonDisabled(selector,true);
		if(rolling=="prev"){
			var element = selector.find(".heum-item-group .item:last");
			if(scroll =="vertical"){
				selector.find(".heum-item-group").css({"margin-top": "-"+Math.abs(element.outerHeight(true))+"px"});
				element.prependTo(selector.find(".heum-item-group"));
				selector.find(".heum-item-group").animate({
					"margin-top": "0px",
				}, "slow",function(){
					buttonDisabled(selector,false);
				});
			}else{
				selector.find(".heum-item-group").css({"margin-left": "-"+Math.abs(element.outerWidth(true))+"px"});
				element.prependTo(selector.find(".heum-item-group"));
				selector.find(".heum-item-group").animate({
					"margin-left": "0px",
				}, "slow",function(){
					buttonDisabled(selector,false);
				});
			}
		}else{
			var element = selector.find(".heum-item-group .item:first");
			if(scroll =="vertical"){
				var marginTop = parseInt(element.css("margin-top").replace("px"));
				var move=0;
				if(marginTop>0){
					move = Math.abs(element.outerHeight(true))-Math.abs(marginTop);
				}else{
					move = Math.abs(element.outerHeight(true))+Math.abs(marginTop);
				}
				selector.find(".heum-item-group").animate({
					"margin-top": "-"+move+"px",
				}, "slow",function(){
					selector.find(".heum-item-group").css({"margin-top":"0px"});
					element.appendTo(selector.find(".heum-item-group"));
					buttonDisabled(selector,false);
				});
			}else{
				selector.find(".heum-item-group").animate({
					"margin-left": "-"+Math.abs(element.outerWidth(true))+"px",
				}, "slow",function(){
					selector.find(".heum-item-group").css({"margin-left":"0px"});
					element.appendTo(selector.find(".heum-item-group"));
					buttonDisabled(selector,false);
				});
			}
		}
	}
 	function next(selector){
		var thisIndex = $(".heum-item-group").index(selector.find(".heum-item-group"));
		selector.find(".heum-item-group").clearQueue().finish();
		rollingBridge(
				selector,
				false,
				initOptions[thisIndex].timer,
				initOptions[thisIndex].rolling,
				initOptions[thisIndex].scroll
		);
		heum_rolling(selector,"next",initOptions[thisIndex].scroll);
		if(scrollStatus[thisIndex]){
			rollingBridge(
					selector,
					true,
					initOptions[thisIndex].timer,
					initOptions[thisIndex].rolling,
					initOptions[thisIndex].scroll
					);
		}
	}
	function prev(selector){
		var thisIndex = $(".heum-item-group").index(selector.find(".heum-item-group"));
		selector.find(".heum-item-group").clearQueue().finish();
		rollingBridge(
				selector,
				false,
				initOptions[thisIndex].timer,
				initOptions[thisIndex].rolling,
				initOptions[thisIndex].scroll
		);
		heum_rolling(selector,"prev",initOptions[thisIndex].scroll);
		if(scrollStatus[thisIndex]){
			rollingBridge(
					selector,
					true,
					initOptions[thisIndex].timer,
					initOptions[thisIndex].rolling,
					initOptions[thisIndex].scroll
			);
		}
	}
	function start(selector){
		var thisIndex = $(".heum-item-group").index(selector.find(".heum-item-group"));
		scrollStatus[thisIndex] = true;
		rollingBridge(
				selector,
				true,
				initOptions[thisIndex].timer,
				initOptions[thisIndex].rolling,
				initOptions[thisIndex].scroll
		);
	}
	function pause(selector){
		var thisIndex = $(".heum-item-group").index(selector.find(".heum-item-group"));
		scrollStatus[thisIndex] = false;
		rollingBridge(
				selector,
				false,
				initOptions[thisIndex].timer,
				initOptions[thisIndex].rolling,
				initOptions[thisIndex].scroll
		);
	}
	
	Plugin.prototype = {
		init : function() {
			var defaults = defaults;
			var element = $(this.element);
			setInitOption(element,this.options);
			if(this.options.scroll=="vertical"){
				var maxSize =  0;
				var maxWidth = 0;
				element.find(".item").each(function(){
					maxWidth = Math.max(maxWidth,$(this).outerWidth(true));
					var s = (parseInt($(this).css("margin-top").replace("px"))+parseInt($(this).css("margin-bottom").replace("px")))/2;
					maxSize+=($(this).innerHeight()+s);
				});
				var s = (parseInt(element.find(".item:last").css("margin-top").replace("px"))+parseInt(element.find(".item:last").css("margin-bottom").replace("px")))/2;
				var rollingSize = this.options.groupsize!=undefined?this.options.groupsize:(maxSize-(element.find(".item:last").innerHeight()+s));
				element.find(".heum-item-group").css({
					"height" : maxSize+"px"
				}).wrap(
						"<div class='heum-rolling-group' style='width:100%;max-width:"+maxWidth+"px;height :"+rollingSize+(/%/.test(rollingSize)?"":"px")+";'/>"
				);
			}else{
				element.find(".item").addClass("scroll-horizontal");
				var maxSize =  0;
				var maxHeight = 0;
				element.find(".item").each(function(){
					maxHeight = Math.max(maxHeight,$(this).outerHeight(true));
					maxSize+=$(this).outerWidth(true);
				});
				var rollingSize = this.options.groupsize!=undefined?this.options.groupsize:(maxSize-element.find(".item:last").outerWidth(true));
				
				element.find(".heum-item-group").css({
					"width" : maxSize+"px"
				}).wrap(
						"<div class='heum-rolling-group' style='width:100%;max-width:"+rollingSize+(/%/.test(rollingSize)?"":"px")+";height:"+maxHeight+"px;'/>"
				);
			}
			if(this.options.button){
				var startButton = $("<button/>",{
					type : "button",
					text : "start",
					data : {
						"heum-rolling" : "start"
					},
					css : {
						display : (!this.options.autoscroll?"":"none")
					}
				}).on("click touchend",function(event){
					eventHandler(event, $(this));
					$(this).hide();
					pauseButton.show();
					element.heumRolling().start();
				});
				startButton.appendTo(element);
				var pauseButton = $("<button/>",{
					type : "button",
					text : "pause",
					data : {
						"heum-rolling" : "pause"
					},
					css : {
						display : (this.options.autoscroll?"":"none")
					}
				}).on("click touchend",function(event){
					eventHandler(event, $(this));
					$(this).hide();
					startButton.show();
					element.heumRolling().pause();
				});
				pauseButton.appendTo(element);
				$("<button/>",{
					type : "button",
					text : "prev",
					data : {
						"heum-rolling" : "prev"
					}
				}).on("click touchend",function(event){
					eventHandler(event, $(this));
					element.heumRolling().prev();
				}).appendTo(element);
				$("<button/>",{
					type : "button",
					text : "next",
					data : {
						"heum-rolling" : "next"
					}
				}).on("click touchend",function(event){
					eventHandler(event, $(this));
					element.heumRolling().next();
				}).appendTo(element);
			}else{
				element.find("*[data-heum-rolling=start]").on("click touchend",function(event){
					eventHandler(event, $(this));
					element.heumRolling().start();
				});
				element.find("*[data-heum-rolling=pause]").on("click touchend",function(event){
					eventHandler(event, $(this));
					element.heumRolling().pause();
				});
				element.find("*[data-heum-rolling=next]").on("click touchend",function(event){
					eventHandler(event, $(this));
					element.heumRolling().next();
				});
				element.find("*[data-heum-rolling=prev]").on("click touchend",function(event){
					eventHandler(event, $(this));
					element.heumRolling().prev();
				});
			}
			var thisIndex = $(".heum-item-group").index($(this).find(".heum-item-group"));
			rollingBridge(
					element,
					this.options.autoscroll,
					this.options.timer,
					this.options.rolling,
					this.options.scroll
					);
		}
	};
	
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this,options));
			} else {
				$.fn.extend({
					next : function(){
						next(this);
					},
					prev : function(){
						prev(this);
					},
					start : function(){
						start(this);
					},
					pause : function(){
						pause(this);
					}
				});
			}
		});
	};
})(jQuery, window, document);