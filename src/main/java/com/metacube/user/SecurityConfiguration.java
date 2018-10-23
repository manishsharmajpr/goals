package com.metacube.user;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.RequestHeaderRequestMatcher;

/**
 * Spring Security Configuration for this App
 */
//@Configuration
//@EnableOAuth2Sso
//@Order(value = -20)
public class SecurityConfiguration /*extends WebSecurityConfigurerAdapter*/ {

//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//    			http
//    				//.requestMatcher(new RequestHeaderRequestMatcher("Authorization"))
//    				.authorizeRequests()
//    				.antMatchers("/usercrud/**").fullyAuthenticated()
//    				//.and().requestMatchers().antMatchers("/auth/login", "/logout", "/oauth/authorize", "/oauth/confirm_access")
//    				.and().formLogin().loginPage("/auth/login").permitAll();
//    }
//
//    @Override
//    public void configure(WebSecurity web) throws Exception {
//        super.configure(web);
//    }
//
////    @Override
////    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
////        //init two uses with different authorities
////        auth.inMemoryAuthentication().withUser("lyt").password("lyt").authorities("ROLE_USER")
////                .and().withUser("admin").password("admin").authorities("ROLE_ADMIN");
////    }
//
//    /**
//     * Expose AuthenticationManager for other place to use
//     * @return
//     * @throws Exception
//     */
//    @Bean
//    @Override
//    public AuthenticationManager authenticationManagerBean() throws Exception {
//        return super.authenticationManagerBean();
//    }
}
