package com.metacube.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class IndexController {

    @RequestMapping("/")
    public String direct() {

        return "redirect:/auth/login";
    }

}