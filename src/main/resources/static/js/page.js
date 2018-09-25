var $page = {}

$page.show = function(n, menu) {
	//console.log('$page.show: ' + n)
	$('.page').hide();
	$('#page-' + n + ', .page-' + n).show();
	if (typeof menu!=='undefined' && menu) {
		menu.each('a').each(function() { $(this).removeClass('active')})
		$(menu.each('a')[n-1]).addClass('active');		
	}
}

$page.apply = function(e, menu, callback) {
	e.find('.next').click(function() {
		var n = $(this).attr('id').substring('next-'.length);
		var b = true;
		if (typeof callback!=='undefined' && callback) {
			var b2 = callback(n, true);
			if (typeof b2!=='undefined' && !b2) {
				b = false;
			}
		}
		if (b) {
			$page.show(n, menu);			
		}
		return false;
	});
	e.find('.prev').click(function() {
		var n = $(this).attr('id').substring('prev-'.length);
		var b = true;
		if (typeof callback!=='undefined' && callback) {
			var b2 = callback(n, true);
			if (typeof b2!=='undefined' && !b2) {
				b = false;
			}
		}
		if (b) {
			$page.show(n, menu);			
		}
		return false;
	});	
	$page.show(1, menu);
}
