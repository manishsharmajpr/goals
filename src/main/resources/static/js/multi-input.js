$.widget("jqx.multiInput", {
	options: {
		uri: "/api/user?q=%5E",
		uriBuilder: null,
		name: 'users',
		q: '#q',
		wrapper: null,
		singleItem: false,
		callback_add: null, 
		callback_remove: null,
		items: []
	},
	_create: function() {
		this.list = $('#'+$(this.element).attr('data-list'));
		this.container = $(this.element).find('.multi-input-items')
		this.q = $(this.element).find(this.options.q);
		this.selected = null;
    	this.__init();
    	this.items = this.options.items;
    	this._items = [];
    	var _this = this;
    	$.each(this.items, function(i, item) {
    		_this.add(item, i);
    	});
	},
	itemFactory: function(data, index) {
		return {label: data.username, label2: data.displayName, avatarURL: data.avatarURL, index: index};
	},
	buildItem: function (data) {
    	var ctx = $("meta[name='ctx']").attr("content");
    	if (typeof ctx==='undefined' || !ctx) {
    		ctx = '';
    	}
		//console.log(JSON.stringify(data))
    	return '<a id="multi-input-item-' + data.index + '">' +
    		'<img src="' + (typeof data.avatarURL!=='undefined' &&  data.avatarURL &&  !data.avatarURL.startsWith('/') ? data.avatarURL : (ctx + '/img/avatar.jpg')) + '"></img>' +
    		'<span>' + data.label + '</span>' +
    		(data.label2 ? '<span class="multi-input-item-label2">(' + data.label2 + ')</span>'  : '')+
    		(typeof data.name!=='undefined' ? '<input type="hidden" name="' + data.name + '" value="' + data.value + '"></input>' : '') +						
    		(typeof data.handler!=='undefined' ? '<i class="multi-input-item-delete icon-cross"></i>' : '') +
    		'</a>';
    },
    remove: function(i) {
    	$(this.container.children()[i]).remove();
		var _i = 0;
		this.container.children().each(function() {
			$(this).attr('id', 'multi-input-item-'+_i);
			_i++;
		});
		if (typeof this.options.callback_remove!=='undefined' &&  this.options.callback_remove) {
			this.options.callback_remove(this.items[i]);
		}
		this.items.splice(i, 1);
		for (var j=i; j<this.items.lenght;j++) {
			this.items[j].index = j;
		}

		if (this.options.maxItems) {
			var m = this.count();
			if (m<this.options.maxItems) {
				var wrapper;
				if (typeof this.options.wrapper!=='undefined' && this.options.wrapper) {
					wrapper = $(this.options.wrapper);
				} else {
					wrapper = $($(this.options.q).parent());
				}
				wrapper.show();
			}			
		}
    },
    _apply_rm: function(item) {
		//console.log('_apply_rm:' + item.parent().attr('id'))
    	this._on(item[0], {
    		click: function(ev) {
    			ev.preventDefault();
    			var i = $(ev.target).parent().attr('id').substring('multi-input-item-'.length);
    			//console.log('remove:' + i + ' ' + $(this.container.children()).length)
    			this.remove(i);
    		}
    	});
    },
    _apply_list: function(items) {
    	var _this = this;
    	items.each(function() {
        	_this._on(this, {
        		click: function(ev) {
        			ev.preventDefault();
        			//console.log($(ev.target))
        			if ($(ev.target).attr('id')) {
            			var i = $(ev.target).attr('id').substring('multi-input-item-'.length);
            			//console.log('click:' + i)
            			this._add(null, i);        				
        			}
        		}
        	});    		
    	})
    },   
    _update: function(data) {
		var items = '';
		this.data = data;
		if (data.length==0) {
			this.clear();
			return;
		}
		this.list.show()
		this.list.html('')
		var _this = this;
		var i = 0;
		$.each(data, function(key, val) {
			if (val) {
				var itemData = typeof _this.options.itemFactory!='undefined' ? _this.options.itemFactory(val, i) : _this.itemFactory(val, i);				
				if (itemData && itemData.value) {
					var item = _this.buildItem(itemData);
					//console.log(i + ' ' + JSON.stringify(itemData) + ' ' + item)
					items += item;
					i++;					
				} 
			}
		});
		this.list.html(items);
		this._apply_list(this.list.children())
		this.active(this.selected)
    },
    count: function() {
    	return m = this.container.children().length;
    },
    makeUri:function(q) {
    	var ctx = $("meta[name='ctx']").attr("content");
    	if (typeof ctx==='undefined' || !ctx) {
    		ctx = '';
    	}
    	var uri = null;
    	if (this.options.uriBuilder) {
    		uri = this.options.uriBuilder(q);
    	}
    	if (uri) {
    		uri = ctx + uri;
    	} else {
        	uri = ctx + this.options.uri + q;    		
    	}
    	return uri;
    }, 
    update:	function(q) {
    	var uri = this.makeUri(q);
    	//console.log('uri:' + uri)
    	var _this = this;
    	$.getJSON(uri, function(data) {
    		if (typeof data!='undefined' && data) {
        		if (typeof data.content!='undefined') {
        			data = data.content;
        		}
    			_this._update(data);    			
    		}
		});
	},
	add: function(item) {
		this._add(item)
	}, _add: function(q, i) {
		var value = q && typeof q.value!='undefined' ? q.value : q;
		var label = q && typeof q.label!='undefined' ? q.label : q;
		var avatarURL = q && typeof q.avatarURL!='undefined' ? q.avatarURL : '';
		var label2 = null;
		var m = this.count();
		
		var name = (typeof this.options.singleItem!=='undefined' && this.options.singleItem) ? 
				this.options.name : this.options.name + "[" + m + "]";
		var itemData;
		if (typeof i!=='undefined' && i!=null) {
			if ( typeof this.options.itemFactory!='undefined') {
				itemData = this.options.itemFactory(this.data[i], m);
			} else {
				value = this.data[i].username;
				label = this.data[i].displayName;
				avatarURL = this.data[i].avatarURL;
				itemData = {label: label, label2: label2, value: value, avatarURL: avatarURL}; 				
			}
			itemData.data = this.data[i];
		} else {
			i = this.count();
			itemData = {label: label, label2: label2, value: value, avatarURL: avatarURL}; 
			itemData.data = null;
		}
        itemData = $.extend({ value: value}, itemData );
		itemData.name = name;
		itemData.handler = true;
		itemData.index = m;
		var item = this.buildItem(itemData);
		//console.log('itemData:' + i + " " + JSON.stringify(itemData));
		this.container.append(item);
		this._apply_rm(this.container.find('#multi-input-item-'+m + " .multi-input-item-delete"));
		this.q.val('');
		this.clear();
		if (this.options.maxItems) {
			if (m+1>=this.options.maxItems) {
				var wrapper;
				if (typeof this.options.wrapper!=='undefined' && this.options.wrapper) {
					wrapper = $(this.options.wrapper);
				} else {
					wrapper = $($(this.options.q).parent());
				}
				wrapper.hide();
			}
		}
		this.items.push(itemData);
		if (typeof this.options.callback_add!=='undefined' &&  this.options.callback_add) {
			 this.options.callback_add(itemData);
		}

	},
	getItems: function(i) {
		return this.items;
	},	active: function(i) {
		this.list.show()
		var items = this.list.children();
		items.each(function() { $(this).removeClass('active'); });
		if (typeof i!=='undefined' && i!=null) {	
			if (i>=items.length) {
				i = items.length-1;
			}
			if (i<0) {
				i = 0;
			}
			$(items[i]).addClass('active');		
			//console.log('active:' + i)
		}
		this.selected = i;
	},
	clear : function() {
		this.selected = null;
		this.list.html('');
		this.list.hide();
	},
	__init : function() {
		this._on(this.q[0], {
			keyup : function(ev) {
			    ev.preventDefault();
				//console.log('keyup:' + this.selected);
				if (ev.keyCode==13) {
					var q = this.q.val();
					if (!q) {
						this.clear();
						return;
					}
					this._add(q, this.selected);
				} else if (ev.keyCode==38) { //up arrow
					//console.log('up:' + this.selected);
					this.active(typeof this.selected!=='undefined' && this.selected!==null? this.selected-1 : 0);
				} else if (ev.keyCode==40) { //down arrow
					//console.log('down:' + this.selected);
					this.active(typeof this.selected!=='undefined' && this.selected!==null ? this.selected+1 : 0);
				} else {
					var q =  this.q.val();
					//console.log('q:'+q + ' ' + ev.keyCode);
					this.selected = null;
					if (q) {
						this.update(q);						
					} else {
						this.clear();
					}
					
				}
				return false;
			},
			keydown : function(ev) {
				var q = this.q.val();
				//console.log('keydown:' + this.selected + ' q:' + q);
		
				if (ev.keyCode==13) {
				    ev.preventDefault();
					return false;					
				}
			},
			keypress : function(ev) {
				var q = this.q.val();
				//console.log('keypress:' + this.selected + ' q:' + q);		
				if (ev.keyCode==13) {
				    ev.preventDefault();
					return false;					
				}
			}
		});
	}	
});


