function valx(v, v0) { return typeof v === 'undefined' ? v0 : v};

function removeClassInAll(e, name) { e.find('.'+name).each(function() {$(this).removeClass(name); }); }

$Templates2 = {
	eval : function (expr, env) {
		try {
			var v =  math.eval(expr, env);   			
		} catch (e) {
			return '?'+e+'?';
		}
		return v;
	},
	sexpand : function (s, env) {
		var i = 0;
		var s2 = '';
		while (i<s.length) {
			var j = s.indexOf('{{', i);
			if (j>=0 && j<s.length-2) {
				s2 += s.substring(i, j);
				var j2 = s.indexOf('}}', j+2);
				if (j2>0) {
					var expr = s.substring(j+2, j2);
					var val = $Templates2.eval(expr, env);
					i = j2+2;
					if (s=='' && i>=s.length) {
						return val;
					}
					s2 += val;
				} else {
					s2 += s.substring(i);
					break;
				}
			}  else {
				s2 += s.substring(i);
				break;
			}
		}
		return s2;
	},
	expand : function (e, env, innerHtml) {
		function _expand(e, env) {
			var ifattr = e.attributes['x:if'];
			if (typeof ifattr!=='undefined') {
			     var name = ifattr.name;
			     var value = ifattr.value;
			     var b = $Templates2.sexpand(value, env);
			     if (!b || b==='false') {
			    	 e.parentNode.removeChild(e);
			    	 return;
			     }
			}
			var eachattr = e.attributes['x:each'];
			if (typeof eachattr!=='undefined') {
			     var name = eachattr.name;
			     var value = eachattr.value;
			     var i = value.indexOf(':');
			     if (i>0 && i<value.length-3) {
			    	 var varname = value.substring(0, i).trim();
			    	 value = value.substring(i+1).trim();
				     var l = $Templates2.sexpand(value, env);
				     l = l.substring(1, l.length-1);
				     l = l.split(',');
				     for (var i=0; i<l.length; i++) {
				    	 env[varname] = l[i].trim()
				    	 console.log('TODO:' + env[varname] )
				     }
			    	 return;

			     }
			}
			$.each(e.attributes, function(i, attr){
			     var name = attr.name;
			     var value = attr.value;
			     var value2 = $Templates2.sexpand(value, env)
			     attr.value = value2;		     
			});
			for (var p in e.childNodes) {
				var e2 = e.childNodes[p];
				if (e2.nodeType==1) {
					_expand(e2, env);
				} else if (e2.nodeType==3) {
					e2.textContent = $Templates2.sexpand(e2.textContent, env);
				}
			}	
			return e;
		}
		_expand(e, env, '')
		return innerHtml ? e.firstElementChild : e;		
	}
}

