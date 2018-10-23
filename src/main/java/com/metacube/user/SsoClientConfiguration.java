package com.metacube.user;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.security.config.http.SessionCreationPolicy;


/**
 * SSO configuration properties.
 * 
 * @author Manish Sharma {manish.sharma1@metacube.com}
 */
@ConfigurationProperties("custom-sso")
public class SsoClientConfiguration {

	public static String OAUTH_TOKEN_NAME = "oauth_token";

	public static String DEFAULT_SERVER = "http://localhost:28080";

	public static String DEFAULT_REDIRECT_URI = "http://localhost/";

	private String server = DEFAULT_SERVER;
	
	private String clientId;
	
	private String clientSecret;
	
	private List<String> scopes = Arrays.asList("openid");

	private String redirectUri = DEFAULT_REDIRECT_URI;

	private String[] ignore = { "/", "/index.html", "/login**", "/register**",
			"/webjars/**", "/css/**", "/js/**", "/img/**", "/images/**", "/fonts/**", "/favicon.ico",  "/assets/**", "/theme/**", "/api**", "/api/**", "/ws/**" };
	
	private String[] ignoreInclude = {};

	private String[] csrfIgnore = { "/oauth/**", "/login**", "/logout**", "/api**", "/api/**" };
	
	private Boolean csrfEnabled;
	
	private SessionCreationPolicy sessionCreationPolicy = SessionCreationPolicy.IF_REQUIRED;
	
	@NestedConfigurationProperty
	private ConnectionConfiguration connection = new ConnectionConfiguration();

	public SsoClientConfiguration() {
	}

	public String getServer() {
		return server;
	}

	public void setServer(String server) {
		this.server = server;
	}

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getClientSecret() {
		return clientSecret;
	}

	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}

	public List<String> getScopes() {
		return scopes;
	}

	public void setScopes(List<String> scopes) {
		this.scopes = scopes;
	}

	public String getRedirectUri() {
		return redirectUri;
	}

	public void setRedirectUri(String redirectUri) {
		this.redirectUri = redirectUri;
	}

	public String[] getIgnore() {
		return ignore;
	}

	public void setIgnore(String[] ignore) {
		this.ignore = ignore;
	}

	public String[] getIgnoreInclude() {
		return ignoreInclude;
	}

	public void setIgnoreInclude(String[] ignoreInclude) {
		this.ignoreInclude = ignoreInclude;
	}

	public String[] getCsrfIgnore() {
		return csrfIgnore;
	}

	public void setCsrfIgnore(String[] csrfIgnore) {
		this.csrfIgnore = csrfIgnore;
	}

	public Boolean getCsrfEnabled() {
		return csrfEnabled;
	}

	public void setCsrfEnabled(Boolean csrfEnabled) {
		this.csrfEnabled = csrfEnabled;
	}

	public ConnectionConfiguration getConnection() {
		return connection;
	}

	public void setConnection(ConnectionConfiguration connection) {
		this.connection = connection;
	}

	public SessionCreationPolicy getSessionCreationPolicy() {
		return sessionCreationPolicy;
	}

	public void setSessionCreationPolicy(SessionCreationPolicy sessionCreationPolicy) {
		this.sessionCreationPolicy = sessionCreationPolicy;
	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + " [" 
				+ (server != null ? "server=" + server + ", " : "")
				+ (clientId != null ? "clientId=" + clientId + ", " : "")
				+ (clientSecret != null ? "clientSecret=" + clientSecret + ", " : "")
				+ (scopes != null ? "scopes=" + scopes + ", " : "")
				+ (redirectUri != null ? "redirectUri=" + redirectUri + ", " : "")
				+ (ignore != null ? "ignore=" + Arrays.toString(ignore) + ", " : "")
				+ (ignoreInclude != null ? "ignoreInclude=" + Arrays.toString(ignoreInclude) + ", " : "")
				+ (csrfIgnore != null ? "csrfIgnore=" + Arrays.toString(csrfIgnore) + ", " : "")
				+ (csrfEnabled != null ? "csrfEnabled=" + csrfEnabled + ", " : "")
				+ (sessionCreationPolicy != null ? "sessionCreationPolicy=" + sessionCreationPolicy + ", " : "")
				+ (connection != null ? "connection=" + connection : "") 
				+ "]";
	}

	
	
}
