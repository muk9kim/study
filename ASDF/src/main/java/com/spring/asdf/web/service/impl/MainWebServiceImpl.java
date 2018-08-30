package com.spring.asdf.web.service.impl;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.spring.asdf.web.service.MainWebService;

@Service
public class MainWebServiceImpl implements MainWebService{
		
	private static final Logger logger = LoggerFactory.getLogger(MainWebServiceImpl.class);
	
	private static final String namespace = "com.org.mapper.TestMapper";
	@Inject
	private SqlSession sqlSession;
	
	@Override
	public String getStringAddTest(String param) {
		// TODO Auto-generated method stub
		logger.info(param);
		String rtnVal = param + " __ " + param;
		return rtnVal;
	}
	
	@Override
	public String getTime() {
		return sqlSession.selectOne("getTime");
	}
}
