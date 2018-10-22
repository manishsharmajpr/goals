package com.metacube.user;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/auth")
public class LoginController {
  
  @RequestMapping(value = "/login")
  public ModelAndView login(Model model) {
      return new ModelAndView("user/login");
  }
}
