package com.metacube.user;

public class SsoEndpoints {

	public static String user(String id, SsoClientConfiguration config) {
		return users(config) + "/" + id;
	}

	public static String users(SsoClientConfiguration config) {
		return config.getServer() + "/api/user";
	}
	public static String getLoginEndpoint(SsoClientConfiguration config) {
		return config.getServer() + "/gateway/login";
	}

	public static String getLogoutEndpoint(SsoClientConfiguration config) {
		return config.getServer() + "/logout";
	}

	public static String getTokenRevokeEndpoint(SsoClientConfiguration config) {
		return config.getServer() + "/api/logout";
	}

	public static String getAuthorizationEndpoint(SsoClientConfiguration config) {
		return config.getServer() + getEndpointPrefix(config) + "/authorize";
	}

	public static String getTokenEndpoint(SsoClientConfiguration config) {
		return config.getServer() + getEndpointPrefix(config) + "/token";
	}

	public static String getUserInfoEndpoint(SsoClientConfiguration config) {
		return config.getServer() + getEndpointPrefix(config) + "/userinfo";
	}

	public static String getCheckTokenEndpoint(SsoClientConfiguration config) {
		return config.getServer() + getEndpointPrefix(config) + "/check_token";
	}

	public static String getKeyEndpoint(SsoClientConfiguration config) {
		return config.getServer() + getEndpointPrefix(config) + "/token_key";
	}

	public static String getEndpointPrefix(SsoClientConfiguration config) {
		return "/oauth";
	}

	public static String password(SsoClientConfiguration config) {
		return users(config) + "/password";

	}


}
