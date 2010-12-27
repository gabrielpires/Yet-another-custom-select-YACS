/*
Project: YACS - Yet another custom html select
Developer: Gabriel Pires - cadastro at gabrielpires.com.br
Free to use, just keep the author.
*/
var YACS = {};
(function(){
	
	//CONTROLS
	YACS.id = '';
	YACS.control = null;
	YACS.properties = {};
	YACS.content = {};
	YACS.items = new Array();
	YACS.elements = {};
	
	YACS.elements.boxes = new Array();
	YACS.elements.currentIndex = 0;
	
	//PROPERTIES
	YACS.callback =  function(){};
	YACS.showEvent = "click";
	
	YACS.customize = function(control, properties)
	{
		YACS.createId(control);
		YACS.control = YACS.getEBI(control);
		YACS.elements.original = YACS.control;
		YACS.parseProperties(properties);
		YACS.getContent();
		YACS.elements.currentIndex++;
	};
	
	YACS.createId = function(baseName)
	{
		YACS.id = 'yacs_' + baseName;
	}
	
	YACS.parseProperties = function(properties)
	{
		YACS.properties = properties;
		
		if(YACS.properties != null)
		{
			if((YACS.properties.onchange != null || YACS.properties.onchange != undefined) && typeof(YACS.properties.onchange) == "function")
			{
				YACS.callback = YACS.properties.onchange;
			}
			
			if(YACS.properties.showEvent != null || 
				YACS.properties.showEvent != undefined || 
				YACS.properties.showEvent == "click" || 
				YACS.properties.showEvent == "mouseover")
				{
					YACS.showEvent = YACS.properties.showEvent;
				}
		}
	}
	
	YACS.getContent = function()
	{
		var options = YACS.control.getElementsByTagName('option');
		
		var item;
		for(var i = 0; i < options.length; i++)
		{
			var option = options[i];
			item = {};
			item.value = option.value;
			item.text = option.innerHTML;
			YACS.items.push(item);
		}
		
		YACS.buildCustomControl();
	}
	
	YACS.buildCustomControl = function()
	{
		//CREATE BOX
		var box = document.createElement('div');
		box.id = YACS.id + '_box';
		box.className = 'custom-select';
		YACS.elements.box = box;
		
		//CREATE SELECT VIEW
		var currentView = document.createElement('div');
		currentView.id = YACS.id + '_currentView';
		currentView.className = 'custom-select-view';
		YACS.elements.currentView = currentView;
		
		var currentContent = document.createElement('label');
		currentContent.id = YACS.id + '_currentContent_';
		currentContent.className = 'custom-select-label';
		YACS.elements.currentContent = currentContent;
		
		//CREATE CONTENT
		var list = document.createElement('ul');
		list.id = YACS.id + '_list';
		list.className = 'custom-select-list';
		list.show = false;
		var option;
		var link;
		for(var i = 0; i < YACS.items.length; i++)
		{
			var item = YACS.items[i];
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
		YACS.elements.list = list;
		
		//APPLY THE FIRST ITEM
		if(YACS.elements.list.childNodes.length > 0)
		{
			YACS.elements.currentContent.innerHTML = YACS.elements.list.childNodes[0].innerHTML;
		}
		
		//MOUNT CASCADE ELEMENTS
		currentView.appendChild(currentContent);
		box.appendChild(currentView);
		box.appendChild(list);
		
		//APPLY THE CUSTOM CONTROL IN THE INTERFACE
		document.body.insertBefore(box, YACS.control);
		YACS.hideCustomList();
		YACS.buildEvents();
		YACS.hideOriginalControl();		
	}
	
	YACS.buildEvents = function()
	{
		if(YACS.showEvent == "click")
		{
			YACS.elements.box.addEventListener("click", function(){
				if(!YACS.elements.list.show)
				{
					YACS.showCustomList();
					YACS.elements.list.show = true;	
					alert(YACS.elements.box.id);
				}
				else
				{
					YACS.hideCustomList();
					YACS.elements.list.show = false;
				}

			});
		}
		else
		{
			YACS.elements.box.addEventListener("mouseover", function(){
				YACS.showCustomList();
				YACS.elements.list.show = true;
			});
			
			YACS.elements.box.addEventListener("mouseout", function(){
				YACS.hideCustomList();
				YACS.elements.list.show = false;
			});
		}

		
		var item;
		for(var i = 0; i < YACS.elements.list.childNodes.length; i++)
		{
			console.log(YACS.elements.list.childNodes[i].innerHTML);
			item = YACS.elements.list.childNodes[i];
			item.addEventListener("click", function(e){
				
				//AVOID BUBBLE EFFECT 
				if (!e) 
				{
					var e = window.event;
					e.cancelBubble = true;
				};
				
				if (e.stopPropagation) 
				{
					e.stopPropagation();
				};
				
				YACS.elements.currentContent.innerHTML = this.innerHTML;
				YACS.elements.original.value = this.value;
				YACS.hideCustomList();
				YACS.callback();
			}, true);
		}
	}
	
	YACS.showOriginalControl = function()
	{
		YACS.control.style.display = '';
	}
	
	YACS.hideOriginalControl = function()
	{
		YACS.control.style.display = 'none';
	}
	
	YACS.showCustomList = function()
	{
		YACS.elements.list.style.display = '';
	}
	
	YACS.hideCustomList = function()
	{
		YACS.elements.list.style.display = 'none';
	}
	
	YACS.getEBI = function(name)
	{
		return document.getElementById(name);
	}
	
})();