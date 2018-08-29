package com.spring.asdf.web.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.spring.asdf.web.service.MainWebService;

@Service
public class MainWebServiceImpl implements MainWebService{
		
	private static final Logger logger = LoggerFactory.getLogger(MainWebServiceImpl.class);
	@Override
	public String getStringAddTest(String param) {
		// TODO Auto-generated method stub
		logger.info(param);
		String rtnVal = param + " __ " + param;
		return rtnVal;
	}
}
