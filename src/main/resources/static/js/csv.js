$.widget("jqx.csv", {
	options: {
		uri:null,
		pageSize: null,
		page: 0,
		callback: null
	},
	_init: function() {
		this.nlines = 0;
		this.page = this.options.page;
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
	        /*accepts: {
	            text: "text/plain"
	        },
	        headers: { 
	            Accept : "text/plain; charset=utf-8",
	            "Content-Type": "text/plain; charset=utf-8"
	        },*/
	        success: function(data) { 
	        	_this._buildTable(data);
	        	if (_this.callback) {
	        		_this.callback(data);
	        	}
	        }
	     });		
	},
	npages: function() {
		if (this.options.pageSize!=null) {
			return this.nlines/this.options.pageSize + (this.nlines%this.options.pageSize > 0 ? 1 : 0);
		}
	},
	currentPage: function() {
		return this.page;
	},
	nextPage: function() {
		if (this.page<this.npages()-1) {
			this.page++;
		}
		if (this.options.uri) {
			this.load(this.options.uri);
		}
	},
	prevPage: function() {
		if (this.page>0) {
			this.page--;
		}
		if (this.options.uri) {
			this.load(this.options.uri);
		}
	},
	_buildTable: function(data) {
		var s = '<table class="table table-striped table-reponsive"><tbody>';		
	    var ncol = 5;
	    var lines = data.split(/\r\n|\n/);
	    var n = 0;
		this.nlines = 0;
	    for (var i=0; i<lines.length; i++) {
			var line = lines[i];
			if (line.length==0) {
				continue;
			}
			if (line[0]=='#') {
				continue;
			}
			this.nlines++;
			if (this.page!=null && this.options.pageSize!=null) {
				if (line<this.page*this.options.pageSize) {
					continue;
				}
				if (n>=this.options.pageSize) {
					continue;
				}
			}
			var cols = line.split(',');
			//console.log(i + ' ' + line + ' ' + cols.length)
			s += '<tr>';
			for (var j=0; j<cols.length; j++) {
				s+='<td>'
				s+=cols[j];
				s+='</td>'
			}
			s += '</tr>';
			n++;
		}
	    s += '</tbody></table>';
		$(this.element).html(s);
	}
});
