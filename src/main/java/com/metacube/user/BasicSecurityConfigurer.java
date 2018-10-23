package com.metacube.user;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.util.matcher.RequestMatcher;


public class BasicSecurityConfigurer extends WebSecurityConfigurerAdapter {

	@SuppressWarnings("unused")
	private Logger logger = Logger.getLogger(this.getClass());

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().authorizeRequests()
			.requestMatchers(new BasicRequestMatcher()).authenticated()
			.and().httpBasic();
	}
	
	
	public static class BasicRequestMatcher implements RequestMatcher {
				
		private BasicTokenExtractor basicTokenExtractor = new BasicTokenExtractor();
		
		@Override
		public boolean matches(HttpServletRequest request)  {
			Authentication authentication = basicTokenExtractor.extract(request);
			return authentication!=null;
		}
	}


	/**
	 * {@link BasicTokenExtractor} that strips the authenticator from a bearer token request (with an Authorization header in the
	 * form "Bearer <code>&lt;TOKEN&gt;</code>", or as a request parameter if that fails). The access token is the principal in
	 * the authentication token that is extracted. Based on {@link TokenExtractor}
	 * 
	 */
	public static class BasicTokenExtractor implements TokenExtractor {
		public static final String BASIC = "BASIC";

		@Override
		public Authentication extract(HttpServletRequest request) {
			String tokenValue = extractToken(request);
			if (tokenValue != null) {
				PreAuthenticatedAuthenticationToken authentication = new PreAuthenticatedAuthenticationToken(tokenValue, "");
				return authentication;
			}
			return null;
		}

		protected String extractToken(HttpServletRequest request) {
			String token = extractHeaderToken(request);
			return token;
		}

		
		/**
		 * Extract the Basic token from a header.
		 * 
		 * @param request The request.
		 * @return The token, or null if no BASIC authorization header was supplied.
		 */
		protected String extractHeaderToken(HttpServletRequest request) {
			Enumeration<String> headers = request.getHeaders(HttpHeaders.AUTHORIZATION);
			while (headers.hasMoreElements()) { // typically there is only one (most servers enforce that)
				String value = headers.nextElement();
				if ((value.toLowerCase().startsWith(BASIC))) {
					String authHeaderValue = value.substring(BASIC.length()).trim();
					int commaIndex = authHeaderValue.indexOf(',');
					if (commaIndex > 0) {
						authHeaderValue = authHeaderValue.substring(0, commaIndex);
					}
					return authHeaderValue;
				}
			}
			return null;
		}

	}


	
}
