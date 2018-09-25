$.widget("jqx.table", {
	options: {
		uri: null,
		cols: null,
		types: null,
	},
	_init: function() {
		if (this.options.uri) {
			this.load(this.options.uri);
		}
	},
	load: function(uri) {
		var _this = this;
		$.ajax({
	        type: "GET",
	        url: uri,
	        dataType: "text",
	        success: function(data) { _this._buildTable(data);}
	     });		
	},
	_buildTable: function(data) {
		var s = '<table class="table table-striped table-reponsive"><tbody>';	
		console.log(data);
		var json = JSON.parse(data);
		var items = json.content;
		for (var i=0; i<items.length; i++) {
			var item = items[i];
			console.log(i + ' ' + JSON.stringify(item));
			s += '<tr>';
			if (this.options.cols) {
				for (var j=0; j<this.options.cols.length; j++) {
					var col = this.options.cols[j];
					var value = item[this.options.cols[j]];
					s+='<td>'
					var type = this.options.types &&  j<this.options.types.length ? this.options.types[j] : '';
					if (typeof value!=='undefined' && value!=null) {
						if ('img'==type) {
							s+= '<img class="avatar" src="' + value + '"></img>';
						} else {
							s+= value;
						}						
					}
					s+='</td>'
				}				
			} else {
				s+='<td>'
				s+= JSON.stringify(item);
				s+='</td>'
			}
			s += '</tr>';
		}
	    s += '</tbody></table>';
		$(this.element).html(s);
	}
});
