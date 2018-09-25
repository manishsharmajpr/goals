function notifications() {
	var container = $("#notifications");
	console.log('notifications():' + container.length)
	if (container.is(":visible")/*css("display")=="block")*/) {
		//container.slideUp()
		//console.log('notifications(): hide')
		//return;
	}

	var template = $('#notification-template2').html();
	var triggerTemplate = $('#trigger-template2').html();
	container.html('');
	$Notifications.loadAndShow(container, template,  triggerTemplate,
		function() { console.log('show'); $('#notifications-container .counter').show(); $("#notifications-container").slideDown(); },
		function() {
			$Notifications.decCounter($('#notifications-container .counter')) 
			$Notifications.decCounter($('#notifications-container .count'), 'No New') 
		} );				
				
}