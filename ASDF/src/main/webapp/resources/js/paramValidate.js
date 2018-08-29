//-------------------------------------------------------
// Validate 스크립트
// 앞에  ParamValidate 를 붙여준다.
//-------------------------------------------------------

var ParamValidate = {};

//공백 체크
//ParamValidate.isEmpty(str)  => return true| false
ParamValidate.isEmpty = function(str) {
	return !(/\S/).test(str);
};

//숫자 체크
//ParamValidate.isNum(str)  => return true|false
ParamValidate.isNum = function(str) {
	return (/^[0-9]*$/).test(str);
};

//영문 체크
//ParamValidate.isAlpha()  => return true|false
ParamValidate.isAlpha = function(str){
	return (/^[a-zA-Z]+$/).test(str);	
};

//영문 숫자 체크
//ParamValidate.isAlphaNumber(str)  => return true|false
ParamValidate.isAlphaNumber = function(str){
	return (/^[0-9a-zA-Z]+$/).test(str);	
};

//한글 포함 여부 체크
//ParamValidate.isHangul(str)  => return true|false	
ParamValidate.isHangul = function(str){
	return (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/).test(str);
	//return (/^[ㄱ-힣]+$/).test(str);	
};

//이메일 체크
//ParamValidate.isEmail(str)  => return true|false	
ParamValidate.isEmail = function(str){
	return (/^[a-zA-Z0-9\-\.\_]+@[a-zA-Z0-9\-\.]+\.([a-zA-Z]{1,5})$/).test(str);
};

//패스워드 체크
//ParamValidate.isPassword(str)  => return true|false	
ParamValidate.isPassword = function(str){
	return (/^[a-zA-Z0-9!@#$%^&*()?_~]{8,16}$/).test(str);
}

ParamValidate.isPassword2 = function(str){
	return (/^[a-zA-Z0-9!@#$%^&*()?_~]{9,16}$/).test(str);
}


