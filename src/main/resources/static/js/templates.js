function valx(v, v0) { return typeof v === 'undefined' ? v0 : v};

function removeClassInAll(e, name) { e.find('.'+name).each(function() {$(this).removeClass(name); }); }

$Templates = {
	expand : function (template, scope, prefix) {
		function _expand(template, scope, prefix) {
			//console.log(prefix);
			for (var p in scope) {
				var val = scope[p];
				key = p;
				if (typeof val==='object') {
					template = _expand(template, val, (prefix ? prefix + key + '.' : key + '.'));
				} else {
					if (typeof val=='undefined') {
						val = '??'+p+'??';
					} 
					//console.log(prefix + key + '=' + val + " " + (typeof val));
					template = template.replace(new RegExp('{{'+ prefix + key + '}}', 'g'), val);
				}
			}
			
			return template;
		};
		template = template.replace(new RegExp(' x-', 'g'), ' ');

		return _expand(template, scope, '')
	}
}

