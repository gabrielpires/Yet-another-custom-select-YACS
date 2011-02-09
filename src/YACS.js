/*
Project: YACS - Yet another custom html select
Developer: Gabriel Pires - cadastro at gabrielpires.com.br
Free to use, just keep the author.
*/
var YACS = {};
var console;
if(typeof console == 'undefined')
{
	console = {log: function(){}};
}
(function(){
	
	//CONTROLS
	YACS.id = '';
	YACS.control = null;
	YACS.properties = {};
	YACS.content = {};
	YACS.items = new Array();
	YACS.elements = {};
	
	YACS.selects = new Array();
	YACS.currentIndex = 0;
	
	//PROPERTIES
	YACS.callback =  function(){};
	YACS.showEvent = "click";
	
	YACS.customize = function(control, options)
	{		

		customControl = {};
		customControl.index = YACS.currentIndex;
		customControl.id = YACS.createId(control);
		customControl.select = YACS.getEBI(control);
		customControl.callback = YACS.getCallBack(options);
		customControl.showEvent = YACS.getShowEvent(options);
		customControl.content = YACS.getContent(customControl.select);
		customControl.elements = {};
		customControl.elements.box = YACS.buildCustomControl(customControl.select, customControl);
		
		YACS.buildEvents(customControl);
				
		customControl.showControl = function(target)
		{
			target.style.display = '';
		}

		customControl.hideControl = function(target)
		{
			target.style.display = 'none';
		}

		customControl.hideControl(customControl.elements.list);
		customControl.hideControl(customControl.select);
		
		YACS.selects.push(customControl);
		YACS.incrementIndex();
	};
	
	YACS.incrementIndex = function()
	{
		YACS.currentIndex++;
	}
	
	YACS.createId = function(baseName)
	{
		return 'yacs_' + baseName;
	}
	
	YACS.getCallBack = function(options)
	{
		var result = function(){};
		
		if(options != null || options != undefined)
		{
			if((options.onchange != null || options.onchange != undefined) && typeof(options.onchange) == "function")
			{
				result = options.onchange;
			}
		}
		
		return result;
	}
	
	YACS.getShowEvent = function(options)
	{
		var result = 'click';
		
		if(options != null || options != undefined)
		{
			if(options.showEvent != null || 
				options.showEvent != undefined || 
				options.showEvent == "click" || 
				options.showEvent == "mouseover")
				{
					result = options.showEvent;
				}	
		}

		return result;		
	}
	
	YACS.getContent = function(select)
	{
		var items = select.getElementsByTagName('option');
		var result = new Array();
		var item;
		for(var i = 0; i < items.length; i++)
		{
			var option = items[i];
			item = {};
			item.value = option.value;
			item.text = option.innerHTML;
			result.push(item);
		}
		
		return result;
	}
	
	YACS.buildCustomControl = function(control, customControl)
	{

		//CREATE BOX
		var box = document.createElement('div');
		box.id = customControl.id + '_box';
		box.className = 'custom-select';
		customControl.elements.box = box;
		
		//CREATE SELECT VIEW
		var currentView = document.createElement('div');
		currentView.id = customControl.id + '_currentView';
		currentView.className = 'custom-select-view';
		customControl.elements.currentView = currentView;
		
		var currentContent = document.createElement('label');
		currentContent.id = customControl.id + '_currentContent_';
		currentContent.className = 'custom-select-label';
		customControl.elements.currentContent = currentContent;

		//CREATE CONTENT
		var list = document.createElement('ul');
		list.id = customControl.id + '_list';
		list.className = 'custom-select-list';
		list.show = false;
		var option;
		var link;
		
		for(var i = 0; i < customControl.content.length; i++)
		{
			var item = customControl.content[i];
			console.log(item);
			option = document.createElement('li');
			option.innerHTML = item.text;
			option.value = item.value;
			
			if(i == 0)
			{
				option.className = 'custom-select-item custom-select-item-first';
			}
			else if(i == (YACS.items.length - 1))
			{
				option.className = 'custom-select-item custom-select-item-last';
			}
			else
			{
				option.className = 'custom-select-item';
			}
			
			list.appendChild(option);
		}
		
		customControl.elements.list = list;
		
		//APPLY THE FIRST ITEM
		if(customControl.content.length > 0)
		{
			currentContent.innerHTML = customControl.content[0].text;
		}
		
		//MOUNT CASCADE ELEMENTS
		currentView.appendChild(currentContent);
		box.appendChild(currentView);
		box.appendChild(list);
		
		console.log(control);
		YACS.applyCustomControl(control,box);
		
		return box;
	}
	
	YACS.applyCustomControl = function(original, custom){
		original.parentNode.insertBefore(custom,original);
	}
	
	YACS.buildEvents = function(customControl)
	{

		
		if(customControl.showEvent == "click")
		{

			var onClickFunction = function(e){
				var target = e.target || e.srcElement;

				if(target != this)
				{
					return;
				}
				
				if(!customControl.elements.list.show)
				{
					customControl.showControl(customControl.elements.list);
					customControl.elements.list.show = true;	
					console.log(customControl.elements.box.id);
				}
				else
				{
					customControl.hideControl(customControl.elements.list);
					customControl.elements.list.show = false;
				}

			};
			
			YACS.addEvent(customControl.elements.currentView, 'click', onClickFunction);

		}
		else
		{
			
			var mouseOverFunction = function(){
				customControl.showControl(customControl.elements.list);
				customControl.elements.list.show = true;
			};
			
			var mouseOutFunction = function(){
				customControl.hideControl(customControl.elements.list);
				customControl.elements.list.show = false;
			};
			
			YACS.addEvent(customControl.elements.box,'mouseover',mouseOverFunction);
			YACS.addEvent(customControl.elements.box,'onmouseout',mouseOutFunction);
		}

		var onClickItemFunction = function(e){
			
			
			customControl.elements.currentContent.innerHTML = this.innerHTML;
			customControl.select.value = this.value;
			customControl.hideControl(customControl.elements.list);
			customControl.elements.list.show = false;
			customControl.callback();
		};
		
		var item;
		for(var i = 0; i < customControl.elements.list.childNodes.length; i++)
		{
			console.log(customControl.elements.list.childNodes[i].innerHTML);
			item = customControl.elements.list.childNodes[i];
			
			YACS.addEvent(item, "click", onClickItemFunction);
		}
	}
	
	YACS.addEvent = function(control, event, event_function){
		var callback = function(e)
		{
			if(!e)
			{
				e = window.event;
			}
			event_function.call(control, e);
		};
		if(typeof control.attachEvent != 'undefined')
		{
			event = "on" + event;
			control.attachEvent(event,callback);
		}
		else
		{
			control.addEventListener(event, callback, false);
		}
	}
	
	YACS.getEBI = function(name)
	{
		return document.getElementById(name);
	}
	
})();