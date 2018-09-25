var $Notifications = {
	admin : false, 
	ctx: function() {
		var ctx = $("meta[name='ctx']").attr("content");
		return (typeof ctx!=='undefined' ? ctx: '');
	},
	uriPrefix: function() {
		var prefix = '/api';
		if ($Notifications.admin) {
			prefix = prefix + "/admin"
		}
		return prefix;
	}, 
	username:  function() {
		return $("meta[name='username']").attr("content");
	},
	endpoints: {
		list : function(pageSize) {
			console.log('ctx:'+$Notifications.ctx())

			return $Notifications.ctx() + $Notifications.uriPrefix() + '/notification?pageSize=' + pageSize +
			   ($Notifications.admin ? '&username=' + $Notifications.username() : '');
		},
		del : function(id) {
			return $Notifications.ctx() + $Notifications.uriPrefix() + '/notification/' + id +
			   ($Notifications.admin ? '?username=' + $Notifications.username() : '');
		}
	},
	show : function (notification) {
		//console.log("notification:" + JSON.stringify(notification));
	    var container = $("#notifications");
	    if (container.length) {
	        var template = $('#notification-template').html();
			var triggerTemplate = $('#trigger-template').html();
	        $Notifications.showIn(notification, container, template, triggerTemplate);
	    }
	},
	showIn : function(notification, container, template, triggerTemplate, callbackOnDelete) {
		console.log("showIn:" + JSON.stringify(notification));

		var html = $Notifications.makeHtml(notification, template);
		container.prepend(html);
		var id = $(html).attr('id');
		console.log(id + ' ' + container + ' ' + container.length +  ' ' + container.attr('id') + html);
		$Notifications.apply($('#'+id).find('.notification-delete'), callbackOnDelete);
		var html2 = $Notifications.makeTriggersHtml(notification, triggerTemplate);
	    if (html2) {
	        $('#'+id).find('.triggers').append(html2);  
	    }
	},
	CONTENT:
		'<span><a href="{{notification.principal.uri}}"><span>{{notification.principal.name}}</span></a> has ' +
		'<span>{{notification.action.type}}</span> <span>{{notification.source.type}}</span> ' +
		'<a href="{{notification.source.uri}}"><span>{{notification.source.name}}</span></a></span>'
	,
	makeHtml : function(notification, template) {
	    var scope = {notification: notification};
	    
	    if (typeof notification.formattedDate === 'undefined') {
	    	notification.formattedDate = new Date(notification.date).toDateString();
	    }

	    if (typeof notification.content === 'undefined') {
	    	notification.principal.name = valx(notification.principal.name, notification.principal.id);
	    	notification.source.name = valx(notification.source.name, notification.source.id);
	    	notification.content = $Notifications.CONTENT;
	    	
	    	notification.content = $Templates.expand(notification.content, scope);
	    }
	    template = $Templates.expand(template, scope);
	    return template;
	},
	makeTriggersHtml : function(notification, template) {
		if (typeof notification.triggers==='undefined') {
			return;
		}
		var s = '';
	    for (var i=0; i<notification.triggers.length; i++) {
	    	var trigger =  notification.triggers[i];
	    	trigger.name = valx(trigger.name, trigger.type);
	    	trigger.styleClass = 'Reject'==trigger.type ? 'deny_mod' : 'accept_mod'
	        var scope = {trigger : trigger};
	    	s += $Templates.expand(template, scope);
	    }
	    return s;
	},
	_delete : function (id) {
		//console.log('delete:' + id)
		$.ajax({
			url : $Notifications.endpoints.del(id),
			method : 'DELETE',
			contentType : 'application/json',
			success : function(result) {
				$('#notification-' + id).each(function() { $(this).remove();})
				$('.notification-' + id).each(function() { $(this).remove();  })
			},
			error : function(request, msg, error) {
			}
		});
	},
	apply : function (e, callbackOnDelete) {
		e.click(function(ev) {
			var i = this.id.indexOf("-delete-");
			var id = this.id.substring(i + '-delete-'.length);
			$Notifications._delete(id);
			ev.stopPropagation();
			if (callbackOnDelete) {
				callbackOnDelete(id);
			}
		})
	},
	showAllIn : function(notifications, container, template, triggerTemplate, callbackOnDelete) {
		if (typeof template==='undefined') {
		   template = $('#notification-template').html();				
		}
		for (var i= notifications.length-1 ; i>=0;i--) {
			var notification = notifications[i];
			//console.log(notification)
			$Notifications.showIn(notification, container, template, triggerTemplate, callbackOnDelete);
		}
	},
	loaded: false,
	loadAndShow : function(container, template, triggerTemplate, callback, callbackOnDelete) {
		var uri = $Notifications.endpoints.list(10);
		console.log('uri:'+ uri)
		$.getJSON(uri, function(data) {
			console.log('data:'+data)
			$Notifications.showAllIn(data, container,  template, triggerTemplate, callbackOnDelete);
			$Notifications.loaded = true;
			if (data.length>0 && callback) {
				callback(data)
			}		
		}, function() {
			console.log('error')
		});
	},
	decCounter : function(counter, emptyMsg) {
	    var n = Number.parseInt(counter.html())-1;
	    if (n<0) {
	    	n = 0;
	    }
	    counter.each(function() {
	    	var $this = $(this);
	    	$this.html(n);
		    if (n==0) {
		    	if (typeof emptyMsg!=='undefined') {
	    			$this.html(emptyMsg);
	    		} else {
			    	$this.html('');
			    	$this.hide();	    			
	    		}
		    } else {
		    	$this.show();
		    }
	    });
	},
	connect : function() {
		var sock = new SockJS($Notifications.ctx()+'/ws');
		stompClient = Stomp.over(sock);
		stompClient.connect({}, function (frame) {
		    var username = frame.headers['user-name']; 
		    if (typeof username==='undefined' || !username) {
			    username= $Notifications.username();		    	
		    }
		    if (typeof username==='undefined' || !username) {
		    	console.log('SockJS: Stomp: Connected: Username not found');
		    	return;
		    }
		    console.log('SockJS: Stomp: Connected: ' + username);
		    //console.log(frame);
		    var d = '/queue/'+ username; //'/topic/notifications';
		    stompClient.subscribe(d, function (message) {
		    	$Notifications.show(JSON.parse(message.body));
		    })
		});
	}
};

$(function() {
	$Notifications.connect();	
});
