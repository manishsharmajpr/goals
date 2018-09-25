function fieldClear(prefix, fields, scopeVar){
	$(fields).each(function(i, p) {	
		$('#' + prefix + p).val('');
	});
}

function fieldAdd(prefix, fields, scopeVar, index, template, templateId, container){
	
	if (typeof index!=='undefined' && index!=null) {
		template = template.replace(new RegExp('{{index}}', 'g'), index);
	}
	
	for (var i=0; i<fields.length; i++) {
		var val = $('#' + prefix + fields[i]).val();
		if(val == undefined){
			continue;
		}
		template = template.replace(new RegExp('{{'+fields[i] + '}}', 'g'), val);
	}
	
	replaced = false
	
	if (templateId) {		
		var t = container.find('#' + templateId);
		if (t.length) {
			t.replaceWith(template);
			replaced = true;
		}
	}
	if(!replaced){
		container.append(template);
	}	
	
	
};

function fieldEdit(from, prefix, to, prefix2, fields) {
	
	for (var i=0; i<fields.length; i++) {
		var e = from.find("*[name='" + prefix + fields[i] + "']");
		var e2 = to.find("*[name='" + prefix2 + fields[i] + "']")
		
		if(e2.attr('type') == 'file'){
			continue;
		}
		if (e2.prop('tagName')=='SELECT') {
			var option = e2.find("*[value='" + e.val() + "']");
			if (option.length) {
				option.attr('selected', 'selected');
			}
			e2.selectric();
		} else {
			e2.val(e.val());			
		}
	}
	
	to.modal('show');
}