package com.spring.asdf.web.controller;

import java.sql.Connection;
import java.sql.DriverManager;

import org.junit.jupiter.api.Test;

public class DbTest {
@Test

	public void test() {
		
		try {
			Class.forName("org.mariadb.jdbc.Driver"); 
			Connection con = DriverManager.getConnection("jdbc:mariadb://35.230.36.92:3306/h9_study", "app_su", "ghkfkd!@");
			
			System.out.println(con);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
}
