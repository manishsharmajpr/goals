$.widget("jqx.selectricx", {
	options: {
	},
	_create: function() {
		function build(option) {
			var s = '<span>'
			if ($(option).attr('src')) {
				s += '<img src="' + $(option).attr('src') + '"></img>';
			}
			s += '<span class="label-wrapper">'
			if (option.attr('class') && option.attr('class')[0]=='_') {
				s +=  '<span class="option-icon clr-light icon ' + (option.attr('class') ? option.attr('class').substring(1) : '') +  '"></span>';
			}
			s += $(option).html();
			if ($(option).attr('label1')) {
				s += '<span class="label1">' + $(option).attr('label1') + '</span>';
			}
			if ($(option).attr('label2')) {
				s += '<span class="label2">' + $(option).attr('label2') + '</span>';
			}
			if ($(option).attr('label3')) {
				s += '<span class="label3">' + $(option).attr('label3') + '</span>';
			}
			if ($(option).attr('label4')) {
				s += '<span class="label4">' + $(option).attr('label4') + '</span>';
			}
			s += '</span>'
			return s;
		}
		$(this.element).selectric({
			optionsItemBuilder: function(itemData, element, index) {
				//console.log('selectricx.optionsItemBuilder:' + JSON.stringify(itemData) + " " + itemData.text + ' ' + element + ' ' + index)
				var option = $(element.find('option')[index])
				return build(option);
			},
			labelBuilder: function(currItem) {
				//console.log('selectricx.labelBuilder:' + currItem + " " + currItem.text + " " + JSON.stringify(currItem) + " " + currItem.element[0].tagName)
				var option = currItem.element
				return build(option);
			},
			arrowButtonMarkup: '<i class="button-icon icon-arrow-down"></i>'
		});
	}	
});


