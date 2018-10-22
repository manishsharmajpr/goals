package com.metacube.user.manager;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.metacube.user.model.User;
import com.metacube.user.repository.UserRepository;

@Service
@Transactional
public class UserManagerImpl implements UserManager {

	@Autowired
	private UserRepository repository;

	public UserManagerImpl() {
	}
	@Override
    public List<User>findAll() {
		List<User>userRecords = new ArrayList<>();  
        repository.findAll().forEach(userRecords::add);  
        return userRecords;
    }

	@Override
	public User getUser(Integer id){  
        return repository.findById(id).orElse(null); 
    }

	@Override
    public User create(User user) {
        return repository.save(user);
    }

	@Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
	
	@Override
	public User update(User user) {
		return repository.save(user);
	}
}
