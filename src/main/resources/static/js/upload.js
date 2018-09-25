(function($) {
	$.fn.upload = function(options) {
		options = $.extend({
			file : '#file',
			form: '#upload-form',
			img: '#avatar',
			uri: '/upload',
			waitsrc: '/img/loading-icon.gif',
			callback: null,
		}, options);

		function doUpload() {
			$(options.file).click();
		}

		$(this).click(function() {
			doUpload();
		});

		$(options.file).change(function() {
			sendAvatar();
		});

		function sendAvatar() {
			var ctx = $("meta[name='ctx']").attr("content");
			if (typeof ctx === 'undefined') {
				ctx = '';
			}
			var formData = new FormData($(options.form)[0]);
			
			var uri = ctx + options.uri;
			if (typeof options.id!=='undefined' && options.id!==null) {
				uri += '?id=' + options.id;
			}
			var src;			
			$.ajax({url : uri, type : 'POST',	data : formData,
				success : function(_, _, xhr) {
					var location = xhr.getResponseHeader('Location');
					if (typeof options.img!=='undefined') {
						$(options.img).attr('src', location + "?_=" + Math.random());						
					}
					if (options.callback) {
						options.callback(location);
					}
				},
				error : function(_, _, xhr) {
					$(options.img).attr('src', src);
					error('Error uploading avatar. Not valid format. Only JPG, PNG and GIF images are allowed.')
				},
				cache : false,
				contentType : false,
				processData : false,
				xhr : function() { // Custom XMLHttpRequest
					var xhr = $.ajaxSettings.xhr();
					if (xhr.upload) {
						xhr.upload.addEventListener('progress', function() {
							if (typeof options.img!=='undefined') {
								src = $(options.img).attr('src');
								$(options.img).attr('src', ctx + options.waitsrc);
							}
						}, false);
					}
					return xhr;
				}
			});
		}
		return this;
	};
}(jQuery));
