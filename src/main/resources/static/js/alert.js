
function msg(type, text) {
	var box = $('#msg-box');
	var box2 = $('#msg-box div');
	if (!box2.length) {
		box2 = box;
	}
	box2.text(text);
	box.fadeIn().addClass(type);
	setTimeout(function() { box.fadeOut() }, 4000)
	setTimeout(function() { box2.text(''); box.removeClass(type) }, 4600)
}

function error(text) { msg('msg-error', text) }
function alert(text) { msg('msg-error', text) }
function info(text) { msg('msg-info', text) }

$(function() {
	if (!$('#msg-box').length) {
		$('body').prepend('<div id="msg-box" class="msg-box"><div></div></div>');
	}
	if (typeof _error!=='undefined' && _error) {
		error(_error);
	}
	if (typeof _info!=='undefined' && _info) {
		info(_info);
	}
})
