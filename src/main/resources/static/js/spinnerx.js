$.widget("jqx.spinnerx", {
	options: {
		value: null,
		step: 1,
		decimals: null,
		callback: null,
		min: null,
		max: null,
	},
	_create: function() {
		var _this = this;
		
		$($(this.element).parent().addClass('spinner-wrapper'));
		if (this.options.min==null && typeof $(this.element).attr('data-min')!=='undefined') {
			this.options.min = Number($(this.element).attr('data-min'));
		}
		if (this.options.max==null && typeof $(this.element).attr('data-max')!=='undefined') {
			this.options.max = Number($(this.element).attr('data-max'));
		}
		if (this.options.decimals==null && typeof $(this.element).attr('data-decimals')!=='undefined') {
			this.options.decimals = Number($(this.element).attr('data-decimals'));
		}
		if ($(this.element).attr('data-up') && $(this.element).attr('data-down')) {
			this.up = $($(this.element).attr('data-up')).click(function() {
				_this._up();
			})
			this.down = $($(this.element).attr('data-down')).click(function() {
				_this._down();
			})			
		} else {
			var s = this._makeButtons();
			$(this.element).after(s);
			this.up = $(this.element).parent().find('.spinner-up').click(function() {
				_this._up();
			})
			this.down = $(this.element).parent().find('.spinner-down').click(function() {
				_this._down();
			})	
		}
		if (this.options.value!=null) {
			$(this.element).val(this.options.value);
		}
		//console.log(JSON.stringify(this.options))
		this.__init();
	},
	_makeButtons: function(id) {
		return '<div class="spinner-buttons">' +
		'<i class="spinner-up icon-up-arrow2"></i>'+
		'<i class="spinner-down icon-down-arrow2"></i>'+		
		'</div>';
	},
	value: function() {
		return Number($(this.element).val());
	},
	_up: function() {
		var val = this.value();
		val = val + this.options.step;
		if (!this._valid(val) && (typeof this.options.max!='undefined' && this.options.max!=null)) {
			val = this.options.max;
		}
		$(this.element).val(val);
		$(this.element).focus();
	},
	_down: function() {
		var val = this.value();
		val = val - this.options.step;
		if (!this._valid(val) && (typeof this.options.min!='undefined' && this.options.min!=null)) {
			val = this.options.min;
		}
		$(this.element).val(val);
		$(this.element).focus();
	},
	__init : function() {
		var _this = this;
		//console.log('init:' + _this)
		$(this.element).keydown(function(ev) {
			//console.log('keydown:' + ev.keyCode)
			if (ev.keyCode==38) { //up arrow
				_this._up();
			} else if (ev.keyCode==40) { //down arrow
				_this._down();
			}
		}).keypress(function(ev) {
			var val = _this.value();
			//console.log('keypress:' + ev.keyCode + ' ' + _this._validKey(ev, val))
			if (ev.keyCode==38) { //up arrow
			} else if (ev.keyCode==40) { //down arrow
			} else if (!_this._validKey(ev, val)) {
			    ev.preventDefault();
				return false;					
			}
			if (!_this._valid(val)) {
				return false;
			}
		}).keyup(function(ev) {
			//console.log(_this.value())			
		});
	},
	_valid: function(val) {
		if (val=='') {
			return true;
		}
		if (typeof this.options.min!='undefined' && this.options.min!=null) {
			if (val<this.options.min) {
				return false;
			}
		}
		if (typeof this.options.max!='undefined' && this.options.max!=null) {
			if (val>this.options.max) {
				return false;
			}
		}
		return true;
	},
	_validKey: function(e, val) {
		if (this.options.decimals==0 && $.inArray(e.keyCode, [46]) !== -1) {
			return false;
		}
		if ($.inArray(e.keyCode, [46, 45, 43]) !== -1) { //.
			if (typeof val!=='undefined' && (''+val).indexOf(String.fromCharCode(e.keyCode))>=0) {
				return false;
			}
			return true;
		}			    
		if ($.inArray(e.keyCode, [8, 9, 27, 13, 110, 190]) !== -1 ||			    
		    (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || //Ctrl+A
		    (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||  //Ctrl+C			   
		    (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) || //Ctrl+X			   
		    (e.keyCode >= 35 && e.keyCode <= 39)) {  //home, end, left, right			   
		    return true; //e.shiftKey && 
		}
		if (e.keyCode >= 48 && e.keyCode <= 57) {  //numbers || (e.keyCode >= 96 && e.keyCode <= 105)
			return true;
		}
		return false;
	}
});


