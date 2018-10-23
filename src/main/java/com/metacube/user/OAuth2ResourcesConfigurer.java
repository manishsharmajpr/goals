package com.metacube.user;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.authentication.BearerTokenExtractor;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableResourceServer
public class OAuth2ResourcesConfigurer extends ResourceServerConfigurerAdapter {

	private Logger logger = Logger.getLogger(this.getClass());

	public static final String RESOURCE_OPENDID = "userinfo";
	
	@Autowired
	private SsoClientConfiguration config;
	
	
	@Override
	public void configure(HttpSecurity http) throws Exception {
		http
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
			.and()
			//.antMatcher("/api/**")
			.requestMatcher(new BearerAuthorizationHeaderMatcher())
		   	.authorizeRequests().anyRequest().authenticated();
		   
	}
	
	public static class BearerAuthorizationHeaderMatcher implements RequestMatcher {
		
		BearerTokenExtractor tokenExtractor = new BearerTokenExtractor();
		
		public BearerAuthorizationHeaderMatcher() {
		}
		
		@Override
		public boolean matches(HttpServletRequest request)  {
			Authentication authentication = tokenExtractor.extract(request);
			return authentication!=null;
		}
	}
	

	//@Bean
	public  DefaultTokenServices tokenServices() throws Exception {
		DefaultTokenServices tokenServices = new DefaultTokenServices();
		tokenServices.setTokenStore(tokenStore());
		tokenServices.setSupportRefreshToken(true);
		tokenServices.setReuseRefreshToken(true);
		tokenServices.setTokenEnhancer(accessTokenConverter());
		return tokenServices;
	}
	


	//@Bean
	public TokenStore tokenStore() throws Exception {
		JwtTokenStore store = new JwtTokenStore(accessTokenConverter());
		return store;
	}
	
	JwtAccessTokenConverter converter;
	
	public JwtAccessTokenConverter accessTokenConverter() throws Exception {
		if (converter!=null) {
			return converter;
		}
		converter = new JwtAccessTokenConverter();
		String tokenKey = getTokenKey();
		//converter.setVerifierKey(tokenKey);
		
		String password = "greenfence$sso-gw$123$";
		String keystore = "greenfence-sso-gateway.jks";
		String alias ="sso-gw";
		KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(new ClassPathResource(keystore), password.toCharArray());
		converter.setKeyPair(keyStoreKeyFactory.getKeyPair(alias));
		System.out.println(converter.getKey());
		
		converter.afterPropertiesSet();
		return converter;
	}
	
	private static String tokenKey;
	
	public String getTokenKey() {
		if (tokenKey!=null) {
			return tokenKey;
		}
		RestTemplate template = new RestTemplate();
		try {
			Map<?,?> result = template.getForObject(config.getServer()+ "/oauth/token_key", Map.class);			
			Object value = result.get("value");
			if (value!=null) {
				tokenKey = value.toString();
			}
			logger.info("getTokenKey: " + tokenKey);
			return tokenKey;
		} catch (RuntimeException e) {
			logger.error("getTokenKey: Failed to get token key from authentication server:" + config.getServer() + " " + e);
			return null;
		}
	}
	
	@Override
	public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
		resources.tokenServices(tokenServices())
		.resourceId(RESOURCE_OPENDID)
		.stateless(false);
	}

}
