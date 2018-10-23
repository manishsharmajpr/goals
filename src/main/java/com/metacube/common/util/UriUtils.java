package com.metacube.common.util;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.Map;

import org.springframework.util.StringUtils;

public class UriUtils {
	
	public static final String ENCODING_UTF8 = "UTF-8";
	
	public static URI makeURI(String uri) {
		try {
			return new URI(uri);
		} catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}		
	}
	
	public static URI appendQueryParameters(URI uri, Map<String, String> params) {
		for (Map.Entry<String, String> e: params.entrySet()) {
			uri = appendQueryParameter(uri, e.getKey(), e.getValue());
		}
		return uri;
	}
	
	public static URI appendFormattedQueryParameters(URI uri, Map<String, Object> params) {
		for (Map.Entry<String, Object> e: params.entrySet()) {
			uri = appendQueryParameter(uri, e.getKey(), e.getValue().toString());
		}
		return uri;
	}
	
	public static URI appendQueryParameter(URI uri, String name, Object value) {
		try {

			String query = uri.getRawQuery();
			String queryFragment = name + "=" + URLEncoder.encode(value.toString(), "UTF-8");
			if (query == null) {
				query = queryFragment;
			}
			else {
				query = query + "&" + queryFragment;
			}

			// first form the URI without query and fragment parts, so that it doesn't re-encode some query string chars
			// (SECOAUTH-90)
			URI update = new URI(uri.getScheme(), uri.getUserInfo(), uri.getHost(), uri.getPort(), uri.getPath(), null,
					null);
			// now add the encoded query string and the then fragment
			StringBuffer sb = new StringBuffer(update.toString());
			sb.append("?");
			sb.append(query);
			if (uri.getFragment() != null) {
				sb.append("#");
				sb.append(uri.getFragment());
			}

			return new URI(sb.toString());

		}
		catch (URISyntaxException e) {
			throw new IllegalArgumentException("Could not parse URI", e);
		}
		catch (UnsupportedEncodingException e) {
			throw new IllegalArgumentException("Could not encode URI", e);
		}		
	}
	
	public static String encodePath(String path, String encoding) {
		if(StringUtils.hasText(path)) {
			try {
				return org.springframework.web.util.UriUtils.encodePath(path, encoding);				
			} catch (RuntimeException e) {
			}
		}
		return path;
	}
	
	public static String encode(String path, String encoding) {
		if(StringUtils.hasText(path)) {
			try {
				return org.springframework.web.util.UriUtils.encode(path, encoding);				
			} catch (RuntimeException e) {
			}
		}
		return path;
	}
	
	public static String decode(String path, String encoding) {
		if(StringUtils.hasText(path)) {
			try {
				return org.springframework.web.util.UriUtils.decode(path, encoding);				
			} catch (RuntimeException e) {
			}
		}
		return path;
	}

	public static String extractId(URI uri) {
		return uri.toString().substring(uri.toString().lastIndexOf("/") + 1);
	}

	static String encodeUTF8(String s) {
		return encode(s, ENCODING_UTF8);
	}
	 
	public static String query(Map<?,?> map, String encoding) {
		StringBuilder sb = new StringBuilder();
		for (Map.Entry<?,?> e : map.entrySet()) {
			if (sb.length() > 0) {
				sb.append("&");
			}
			if (e.getValue()!=null) {
				sb.append(String.format("%s=%s", encode(e.getKey().toString(), encoding), encode(e.getValue().toString(), encoding)));
			}
		}
		return sb.toString();
	}
	
	public static String query(Map<?,?> map) {
		return query(map, ENCODING_UTF8);
	}

}