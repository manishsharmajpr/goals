package com.metacube.user.model;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
@Embeddable
@JsonIgnoreProperties(ignoreUnknown=true)
public class User {
	@Id
	@GeneratedValue
	private Integer id;

	@NotNull
	private String name;

	@NotNull
	private Integer age;
	
	@NotNull
	private String address;

	@NotNull
	private String project;

	public User() {
	}

	public User(String name, Integer age, String address, String project) {
		this.name = name;
		this.age = age;
		this.address = address;
		this.project = project;
		
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}
	
}
