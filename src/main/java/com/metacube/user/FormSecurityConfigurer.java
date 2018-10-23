package com.metacube.user;

import java.util.Arrays;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

public class FormSecurityConfigurer  extends WebSecurityConfigurerAdapter {

	private SsoClientConfiguration config;
	
	private SsoClientLogoutHandler logoutHandler;
	
	private OAuth2ClientAuthenticationProcessingFilter ssoFilter;
	
	
	public FormSecurityConfigurer(SsoClientConfiguration config, SsoClientLogoutHandler logoutHandler, OAuth2ClientAuthenticationProcessingFilter ssoFilter) {
		this.config = config;
		this.logoutHandler = logoutHandler;
		this.ssoFilter = ssoFilter;
	}
	
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
			.antMatchers(config.getIgnore()).permitAll()
			.antMatchers(config.getIgnoreInclude()).permitAll()
			//.requestMatchers(new FormRequestMatcher()).authenticated()
			.anyRequest().authenticated()
			.and().logout().logoutUrl("/logout").permitAll().logoutSuccessUrl("/logout").logoutSuccessHandler(logoutHandler)
			.and().exceptionHandling().authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"))
			.and().addFilterBefore(ssoFilter, BasicAuthenticationFilter.class);
		
			if (Boolean.TRUE.equals(config.getCsrfEnabled())) {
				http.csrf().ignoringAntMatchers(config.getCsrfIgnore());
			} else {
				http.csrf().disable();
			}
			http.cors();
			http.headers().frameOptions().disable();
			if (config.getSessionCreationPolicy()!=null) {
				http.sessionManagement().sessionCreationPolicy(config.getSessionCreationPolicy());				
			}
	}
	
	@Bean
	@Primary
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("HEAD",
		    "GET", "POST", "PUT", "DELETE", "PATCH"));
		// setAllowCredentials(true) is important, otherwise:
		// The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
		configuration.setAllowCredentials(true);
		// setAllowedHeaders is important! Without it, OPTIONS preflight request
		// will fail with 403 Invalid CORS request
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	public static class FormRequestMatcher implements RequestMatcher {
		
		private AuthorizationTokenExtractor tokenExtractor = new AuthorizationTokenExtractor();
		
		@Override
		public boolean matches(HttpServletRequest request)  {
			Authentication authentication = tokenExtractor.extract(request);
			return authentication!=null;
		}
	}


	public static class AuthorizationTokenExtractor implements TokenExtractor {

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
				if (StringUtils.hasText(value)) {
					return value.trim();
				}
			}
			return null;
		}

	}


}
