function userUriBuilder(q) {
	return '/api/user?q=%5E' + q;
}

function memberUriBuilder(q) {
	var uri = userUriBuilder(q);
	var q2 = $('#q2').val();
	if (q2) {
		uri += '%2B@' + q2;
	}
	return uri;
}
