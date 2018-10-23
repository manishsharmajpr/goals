package com.metacube.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.web.util.matcher.RequestHeaderRequestMatcher;

//@EnableWebSecurity
//@EnableAutoConfiguration

@ComponentScan("com.metacube.user*")
@EnableJpaRepositories("com.metacube.user*")
@EntityScan("com.metacube.user*")
//@EnableOAuth2Sso
//@Configuration
//@EnableResourceServer
//@Order(-20)
@SpringBootApplication
public class UserApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserApplication.class, args);
	}
	
//	@Override
//	  public void configure(HttpSecurity http) throws Exception {
//		http
//			.requestMatcher(new RequestHeaderRequestMatcher("Authorization"))
//			.authorizeRequests()
//			.antMatchers("/usercrud/**").fullyAuthenticated()
//			.antMatchers("/hello/").permitAll()
//			.and().requestMatchers().antMatchers("/auth/login", "/logout", "/oauth/authorize", "/oauth/confirm_access")
//			.and().formLogin().loginPage("/auth/login").permitAll();
//	}
}
