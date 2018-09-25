function popupClear(prefix, fields, scopeVar){
	var $scope = angular.element($("#main")).scope();	
	$(fields).each(function(i, p) {	
		$scope[scopeVar][p] = '';
		$('#' + prefix + p).val('');
	});
}

function popupAdd(prefix, fields, scopeVar, index, template, templateId, container){
	
	if (typeof index!=='undefined' && index!=null) {
		//console.log(template);
		//template = template.replace(new RegExp(scopeVar, 'g'), scopeVar + '[' + index + ']');	
		template = template.replace(new RegExp('{{index}}', 'g'), index);
		//console.log(template);

	}
	
	for (var i=0; i<fields.length; i++) {
		var val = $('#' + prefix + fields[i]).val();
		template = template.replace(new RegExp('{{'+fields[i] + '}}', 'g'), val);	
	}
	if (templateId) {		
		var t = container.find('#' + templateId);
		if (t.length) {
			//console.log(template)
			t.replaceWith(template);
			return;
		}
	}
	container.append(template);
/*	
 	var $scope = angular.element($("#main")).scope();
	$target =  angular.element(container);
  angular.element($target).injector().invoke(function($compile) {
		$target.append($compile(template)($scope));			
	  	$scope.$apply(function() {
	  		$scope.index = index;
	  		$(fields).each(function(i, p) {	
	  			var val = $('#' + prefix + p).val();
	  			var v = $scope[scopeVar];
	  			if (typeof v==='undefined') {
	  				$scope[scopeVar] = v = {};
	  			}
	  			if (typeof index!=='undefined' && index!=null) {
	  				if (typeof v[index]==='undefined') {
	  					v[index] = {}
	  				}
	  				v = v[index];
	  			}
	  			console.log(p + '=' + val  + ' ' + (prefix + p));
	  			v[p] =  val;
	  		});
		});
	})*/
};

function popupEdit(from, prefix, to, prefix2, fields) {
	for (var i=0; i<fields.length; i++) {
		var e = from.find("*[name='" + prefix + fields[i] + "']");
		//console.log("*[name='" + prefix + fields[i] + "']" + e.length)
		var e2 = to.find("*[name='" + prefix2 + fields[i] + "']")
		//console.log("*[name='" + prefix2 + fields[i] + "']" + e2.length)
		//console.log(e2.prop('tagName') + ' ' + e2+ "." + fields[i] + "=" + e.val())
		if (e2.prop('tagName')=='SELECT') {
			var option = e2.find("*[value='" + e.val() + "']");
			//console.log("option:" + option + ' ' + option.val() + ' ' + option.html())
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