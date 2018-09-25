$.widget("jqx.mselectx", {
	options: {
		container: null,
		name: 'items',
		nameSuffix: null,
		items: [],
		callback_add : null,
		spinner: false,
		name2: null,
		name2Suffix: null,
	},
	_create: function() {
		this.select = $(this.element).selectricx(this.options);
		this.container = $(this.options.container);
		var _this = this;
		this.container.find('.item-delete').click(function() {
			var idx = $(this).attr('id').substring('item-delete-'.length);
			_this.remove(idx);
		})
		var _this = this;
		$(this.element).change(function(ev) {
			var idx = this.selectedIndex;
			console.log(idx);
			var ul = $(this).parent().parent().find('ul');
			if ($(ul.find('li')[idx]).hasClass('item-selected')) {
				return;
			}
			var selected = $($(this).find('option')[idx]);
			console.log(selected.val() + " " + selected.html());
			var item = {key: idx, value: selected.val(), name:selected.html(), img:selected.attr('src'), 
					label1:selected.attr('label1'), label2:selected.attr('label2'), label2:selected.attr('label2')}; 
			console.log(JSON.stringify(item));
			_this.add(item);
		});
		if (typeof this.options.items!=='undefined' && this.options.items) {
			for (var i=0; i<this.options.items.length; i++) {
				var item = this.options.items[i];
				item.key = this._key(item.value);
				this.add(item);
			}			
		}
	},
	_name : function(index) {
		var name =  this.options.name + '[' + index +']' 
		+ (typeof this.options.nameSuffix!='undefined' && this.options.nameSuffix ? this.options.nameSuffix : '');
		return name;
	},
	_name2 : function(index) {
		var name2 =  (typeof this.options.name2!=='undefined' && this.options.name2 ? this.options.name2 : this.options.name) + '[' + index +']' 
		+ (typeof this.options.name2Suffix!='undefined' && this.options.name2Suffix ? this.options.name2Suffix :
			(typeof this.options.nameSuffix!='undefined' && this.options.nameSuffix ? this.options.nameSuffix : ''));
		return name2;
	},
	_buildItem : function(item) {
		var name =  this._name(item.index);		
		return '<div class="item row" id="item-' + item.key +'">'+
		'<div class="col-sm-' + (this.options.spinner ? '9' :'11') +'">'+
			(item.img ? '<img src="' + item.img + '"></img>' : '') +
			'<span class="label-wrapper">' +
			('<span>' + item.name +'</span>') +
			(item.label1 ? '<span class="label1">' + item.label1 + '</span>' : '') +
			(item.label2 ? '<span class="label2">' + item.label2 + '</span>' : '') +
			(item.label3 ? '<span class="label3">' + item.label3 + '</span>' : '') +
			'</span>' +
			'<input type="hidden" class="item-value" name="' + name + '" value="' + item.value +'"></input></div>'+
		(this.options.spinner ? '<div class="col-sm-2"><div><input class="spinner form-control" name="' +  this._name2(item.index) +'" ' +
				(typeof item.quantity!=='undefined' && item.quantity!=null ? ' value="' + item.quantity + '"' : '')+'></input></div></div>' : '') +
		'<div class="col-sm-1 text-right">'+
			'<i class="icon-cross red item-delete" id="item-delete-' + item.key +'" title="Delete Item"></i>'
		'</div></div>';
	},
	add: function(item) {
		if (!item.name) {
			return;
		}
		item.index = this.count();
		var html = this._buildItem(item);
		this.container.append(html);
		var _this = this;
		this.container.find('#item-' + item.key + ' .item-delete').click(function() {
			var idx = $(this).attr('id').substring('item-delete-'.length);
			_this.remove(idx);
		});
		if (this.options.spinner) {
			var _options = typeof this.options.spinner==='object' ? this.options.spinner : {};
			this.container.find('#item-' + item.key + ' .spinner').spinnerx(_options);			
		}
		var ul = $(_this.element).parent().parent().find('ul');
		$(ul.find('li')[item.key]).addClass('item-selected');
		var options = $(_this.element).find('option');
		$(options[item.key]).addClass('item-selected');
		this.select[0].selectedIndex = 0;
		this.select.selectric('refresh');
		if (this.options.callback_add) {
			this.options.callback_add(item)
		}
	},
	count : function() {
		var n = this.container.children().length;
		return typeof n!=='undefined' ? n : 0;
	}, 
	_index : function(k) {
		var i = 0;
		var idx = null;
		this.container.find('.item').each(function() {
			var k1 = $(this).attr('id').substring('item-'.length);
			console.log('?' + k1 + ' = ' + k + '[' + i + ']');
			if (k1==k) {
				idx = i;
			}
			i++;
		});
		return idx;
	},
	remove : function(k) {
		var idx = this._index(k);
		this.container.find('#item-'+k).remove();
		var ul = $(this.element).parent().parent().find('ul');
		$(ul.find('li')[k]).removeClass('item-selected');
		var options = $(this.element).find('option');
		$(options[k]).removeClass('item-selected');
		var _this = this;
		var i = 0
		this.container.find('.item').each(function() {
			var name =  _this._name(i);
			$(this).find('input.item-value').attr('name', name);			i++;
		});
	},
	_key : function(value) {
		var j = null;
		var i = 0
		$(this.element).find('option').each(function() {
			if ($(this).val()==value) {
				j = i;
			}
			i++;
		});
		return j;
	}
});


