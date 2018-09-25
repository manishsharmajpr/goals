package com.metacube.user.manager;

import java.util.List;

import org.springframework.stereotype.Service;

import com.metacube.user.model.User;

@Service
public interface UserManager{
	
	List<User> findAll();
	
	User getUser(Integer id);
	
	User create(User user);
	
	void delete(Integer id);

	User update(User userRecord);
}
