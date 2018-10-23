package com.metacube.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.security.oauth2.common.AuthenticationScheme;

//import com.greenfence.sso.client.manager.GroupManager;
//import com.greenfence.sso.client.manager.GroupManagerImpl;
//import com.greenfence.sso.client.manager.RoleManager;
//import com.greenfence.sso.client.manager.RoleManagerImpl;
//import com.greenfence.sso.client.manager.SsoCacheResolver;
//import com.greenfence.sso.client.manager.UserManager;
//import com.greenfence.sso.client.manager.UserManagerImpl;


@EnableWebSecurity
@EnableConfigurationProperties(value=SsoClientConfiguration.class)
//@EnableCaching
@Import(OAuth2ResourcesConfigurer.class)
public class SsoClientEmbeddedSecurityConfigurer {


	@Autowired
	private SsoClientConfiguration config;
	
	@Autowired
	private OAuth2ClientContext oauth2ClientContext;

	@Bean
	public SsoClientLogoutHandler logoutHandler() {
		return new SsoClientLogoutHandler(config);
	}

	@Bean(name="ssoClientHttpRequestFactory")
	public ClientHttpRequestFactory clientHttpRequestFactory() {
		ConnectionConfiguration connectionConf = config.getConnection();
		HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
		
		if(connectionConf.getTimeout() != null) {
			clientHttpRequestFactory.setConnectTimeout(connectionConf.getTimeout());
		}
		if(connectionConf.getRequestTimeout() != null) {
		clientHttpRequestFactory.setConnectionRequestTimeout(connectionConf.getRequestTimeout());
		}
		if(connectionConf.getReadTimeout() != null) {
		clientHttpRequestFactory.setReadTimeout(connectionConf.getReadTimeout());
		}
		return clientHttpRequestFactory;
	}
	
	
	@Bean
	public OAuth2RestTemplate ssoOAuth2RestTemplate() {
		OAuth2RestTemplate template = new OAuth2RestTemplate(ssoAuthProvider(), oauth2ClientContext);			
		template.setRequestFactory(clientHttpRequestFactory());
		return template;
	}

	
	@Bean
	public OAuth2ClientAuthenticationProcessingFilter ssoFilter() {
		OAuth2RestTemplate template = ssoOAuth2RestTemplate();
		OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter("/auth/login");
		filter.setRestTemplate(template);
		UserInfoTokenServices tokenServices = new UserInfoTokenServices(userinfoResource().getUserInfoUri(), ssoAuthProvider().getClientId());
		tokenServices.setRestTemplate(template);
		filter.setTokenServices(tokenServices);
		return filter;
	}

	@Bean
	public AuthorizationCodeResourceDetails ssoAuthProvider() {
		AuthorizationCodeResourceDetails resource = new AuthorizationCodeResourceDetails();
		resource.setClientId(config.getClientId());
		resource.setClientSecret(config.getClientSecret());
		//redirect to SSO gateway login page, rather than /oauth/authorize directly
		//resource.setUserAuthorizationUri(SsoEndpoints.getLoginEndpoint(config));
		resource.setUserAuthorizationUri(SsoEndpoints.getAuthorizationEndpoint(config));
		resource.setAccessTokenUri(SsoEndpoints.getTokenEndpoint(config));
		resource.setTokenName(SsoClientConfiguration.OAUTH_TOKEN_NAME);
		resource.setAuthenticationScheme(AuthenticationScheme.header);
		resource.setClientAuthenticationScheme(AuthenticationScheme.header);
		resource.setScope(config.getScopes());
		return resource;
	}

	
	@Bean
	public ResourceServerProperties userinfoResource() {
		ResourceServerProperties resource = new ResourceServerProperties();
		resource.setUserInfoUri(SsoEndpoints.getUserInfoEndpoint(config));
		resource.setPreferTokenInfo(false);
		resource.setId("openid");
		return resource;
	}
	
//	@Bean
//	public FilterRegistrationBean<OAuth2ClientContextFilter> oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
//		FilterRegistrationBean<OAuth2ClientContextFilter> registration = new FilterRegistrationBean<OAuth2ClientContextFilter>();
//		registration.setFilter(filter);
//		registration.setOrder(-100);
//		return registration;
//	}
	
//	@Bean
//	public SsoClient ssoClient() {
//		return new SsoClient(config);
//	}
	
//	@Bean
//	public GroupManager groupManager() {
//		return new GroupManagerImpl(ssoCacheManager());
//	}
//	
//	@Bean
//	public UserManager userManager() {
//		return new UserManagerImpl(ssoCacheManager());
//	}
//	
//	@Bean
//	public RoleManager roleManager() {
//		return new RoleManagerImpl();
//	}
//	
//	@Bean
//	public SsoLogoutController logoutController() {
//		return new SsoLogoutController(config);
//	}

//	@Bean
//	@Primary
//	public CacheManager ssoCacheManager() {
//		EhCacheManagerFactoryBean cacheManagerFactoryBean = new EhCacheManagerFactoryBean();
//		cacheManagerFactoryBean.setConfigLocation(new ClassPathResource("ehcache.xml"));
//		cacheManagerFactoryBean.setShared(true);
//		cacheManagerFactoryBean.afterPropertiesSet();
//		return new EhCacheCacheManager(cacheManagerFactoryBean.getObject());
//	}
//	
//	@Bean
//	public SsoCacheResolver ssoCacheResolver() {
//		return new SsoCacheResolver(ssoCacheManager());
//	}
	
}
