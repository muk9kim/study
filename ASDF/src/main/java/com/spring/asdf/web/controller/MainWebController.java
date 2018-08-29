package com.spring.asdf.web.controller;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.spring.asdf.web.service.MainWebService;


@Controller
@RequestMapping(value = "/web")
public class MainWebController {
	
	private static final Logger logger = LoggerFactory.getLogger(MainWebController.class);
	
	@Autowired MainWebService mainService;
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(Locale locale, Model model) {
		logger.info("Start", locale);
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String test = dateFormat.format(date);
		
		model.addAttribute("serverTime", test );
		
		return "/web/main";
	}
	
	@ResponseBody
	@RequestMapping(value = "/getStringAddTest", method = RequestMethod.POST)
	public String getStringAddTest(String param) {
		logger.info("getStringAddTest");
		String rtnVal = mainService.getStringAddTest(param);
		logger.info("getStringAddTest rtnVal == " + rtnVal);
		return rtnVal;
		
	}
	
}
