package com.metacube.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.metacube.user.manager.UserManager;
import com.metacube.user.model.User;

@Controller
@RequestMapping("/usercrud")
public class UserController {

	@Autowired
	private UserManager manager;

	@RequestMapping(value = "/all")
	public ModelAndView findAll(Model model) {
		List<User> users = manager.findAll();
		model.addAttribute("users", users);
		return new ModelAndView("user/index");
	}

	@RequestMapping(value = "/delete", method = RequestMethod.DELETE)
	public String delete(@RequestParam("id") int id, Model model) {
		manager.delete(id);
		return "redirect:/usercrud/all";

	}

	@RequestMapping(value = "/view", method = RequestMethod.GET)
	public ModelAndView get(@RequestParam("id") int id, Model model) {
		User user = manager.getUser(id);
		model.addAttribute("user", user);
		return new ModelAndView("user/view");
	}

	@RequestMapping(value = "/edit", method = RequestMethod.GET)
	public ModelAndView editGet(@RequestParam("id") Integer id, Model model) {
		User user = manager.getUser(id);
		model.addAttribute("user", user);
		return createGet(model);
//		ModelAndView modelAndView = new ModelAndView("user/create");
//		return modelAndView;
	}

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public String save(User user) {
		manager.update(user);
		return "redirect:/usercrud/all";
	}

	@RequestMapping(value = "/create", method = RequestMethod.GET)
	public ModelAndView createGet(Model model) {
		ModelAndView modelAndView = new ModelAndView("user/create");
		return modelAndView;
	}
}
