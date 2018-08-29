//-------------------------------------------------------
// 유틸 스크립트
// 앞에 Util을 붙여준다.
//-------------------------------------------------------

var Util = {};


String.prototype.toInt = function () {
    if (/^-/.test(this)) {
        return this.replace(/\..*$/g, '').replace(/[^\d]/g, '') * -1;
    } else {
        return this.replace(/\..*$/g, '').replace(/[^\d]/g, '') * 1;
    }
};
String.prototype.toNum = function () {
    if (/^-/.test(this)) {
        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '');
    } else {
        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '');
    }
};
String.prototype.toNum2 = function () {
    if (/^-/.test(this)) {
        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '') * -1.0;
    } else {
        return this.replace(/(\.[^\.]+)\..*$/g, '$1').replace(/[^\d\.]/g, '') * 1.0;
    }
};
String.prototype.numberFormat = function () {
    var num = (this.toNum2() + '').split(/\./);
    var commal = function (text) {
        var ret = text.replace(/(\d)(\d{3},)/g, '$1,$2');
        if (ret == text) return ret;
        return commal(ret);
    };
    var commar = function (text) {
        var ret = text.replace(/(,\d{3})(\d)/g, '$1,$2');
        if (ret == text) return ret;
        return commar(ret);
    };
    var ret = commal(num[0].replace(/(\d)(\d{3})$/g, '$1,$2'));
    if (num.length > 1) {
        ret += '.' + commar(num[1].replace(/^(\d{3})(\d)/g, '$1,$2'));
    }
    return ret;
};



//해당문자열의 바이트 수를 반환
Util.getBytes = function(str) {
	var size = 0;
	for(var i = 0; i < str.length; i++) {
		var temp = str.charAt(i);
		if (escape(temp) == '%0D')
			continue;
		if (escape(temp).indexOf("%u") != -1) {
			//size += 2;
			size += 3;
		} else {
			size++;
		}
	}
	return size;
};

//문자열 바이트로 자르기
Util.cutByteStr = function(orgStr, maxLen, tail){
	if(!tail) tail = "";
	
	var strLen = orgStr.length;
	var cntByte = 0;
	var i = 0;
	var subCnt = 0;
	
	for (i = 0; i < strLen; i++) {
		if (orgStr.charCodeAt(i) > 127){
			//cntByte += 2;
			cntByte += 3;
		}else{
			cntByte++;
		}
		if(cntByte <= maxLen){
			subCnt = i+1;
		}
	}
	
	var cutStr;
	if(cntByte>maxLen){
		cutStr = orgStr.substring(0, subCnt) + tail;
	}else{
		 cutStr = orgStr;
	}
	
	return cutStr;
};

//Textarea 길이 바이트 체크
Util.byteCheckTextarea = function(){
	
	$(document).find('textarea, input').each( function (i) {
		
		if($(this).attr('byteCheck') == "true" ){

			$(this).unbind('keyup');
			$(this).unbind('blur');
							
			// byte 초기값
			var startSize = Util.getBytes($(this).val());	
	 
			var size = $(this).attr('maxlength');

			var startTag = "<div name='byteCheck___div' class='txt alr'>";
			var endTag = "byte</div>";
			
			var innerTag = startTag + startSize + " / " + size+endTag;
			
			$(this).parent().find('div[name=byteCheck___div]').remove();
			
			$(innerTag).insertAfter($(this));
							
			$(this).keyup(function(e){
					if( Util.getBytes($(this).val()) > size ){
						Common.alertDialog( size + "byte 이상 입력 할 수 없습니다.");
						$(this).val( Util.cutByteStr( $(this).val(), size) );
					}
					
					$(this).parent().find('div[name=byteCheck___div]').remove();
					innerTag = startTag + Util.getBytes($(this).val()) + " / "+ size+endTag;
					$(innerTag).insertAfter($(this));
				
		    });
			
			$(this).blur(function(e){
					if( Util.getBytes($(this).val()) > size ){ 
						$(this).val( Util.cutByteStr( $(this).val(), size) );
					}
		
					$(this).parent().find('div[name=byteCheck___div]').remove();
					innerTag = startTag + Util.getBytes($(this).val()) + " / " +size+endTag;
					$(innerTag).insertAfter($(this));
				
		    }); 
	
		}
	});
};



//히든생성
Util.makeHidden = function(hiddenName, hiddenValue) {
  var objHidden = document.createElement("input");
  objHidden.type = "hidden";
  objHidden.id = hiddenName;
  objHidden.name = hiddenName;
  objHidden.value = hiddenValue;
  
  return objHidden;
};



//달력 기간 설정
//@sDate : 시작일자의 input id, @eDate : 종료일자의 input id, @p : 기간
Util.setTerm = function(sDate, eDate, p){
	var addDay = (p.indexOf('today') == 0) ? 0 : 1; 
	$("#" + sDate).val(Date.create().addDays(addDay).rewind(p).format("{yyyy}-{MM}-{dd}"));
	$("#" + eDate).val(Date.create().format("{yyyy}-{MM}-{dd}"));
};

//셀렉트 옵션 순서 변경 (멀티 선택 가능)
//objId : 셀렉트박스 아이디
//direction : up - 위로, down - 아래로, top - 제일위로, bottom - 제일아래로
Util.moveItem = function(objId, direction){
	var s = document.getElementById(objId);
	var len = s.options.length;
	var tempOp;    	
	if (direction == "up") {					//위로
		for (var i = 1; i < len; i++) {           
         	if (s.options[i].selected && !s.options[i - 1].selected) {
              tempOp = s.options[i];
              s.options[i] = new Option(s.options[i - 1].text, s.options[i - 1].value);
              s.options[i - 1] = tempOp;
          }
      }
	} else if (direction == "down") {		//아래로
		for (var i = len - 2; i >= 0; i--) {
         	if (s.options[i].selected && !s.options[i + 1].selected) {
              tempOp = s.options[i];
              s.options[i] = new Option(s.options[i + 1].text, s.options[i + 1].value);
              s.options[i + 1] = tempOp;
          }
      }
	} else if (direction == "top") {			//젤위로
		for(var x = 1; x < len; x++) {
	        for (var i = 1; i < len; i++) {           
	           	if (s.options[i].selected && !s.options[i - 1].selected) {
	                tempOp = s.options[i];
	                s.options[i] = new Option(s.options[i - 1].text, s.options[i - 1].value);
	                s.options[i - 1] = tempOp;
	            }
	        }
		}
	} else if (direction == "bottom") {	//젤아래로
		for (var x = len - 2; x >= 0; x--) {
	        for (var i = len - 2; i >= 0; i--) {
	           	if (s.options[i].selected && !s.options[i + 1].selected) {
	                tempOp = s.options[i];
	                s.options[i] = new Option(s.options[i + 1].text, s.options[i + 1].value);
	                s.options[i + 1] = tempOp;
	            }
	        }
		}
	}	
};




//3자리 콤마 구분
Util.GetNumberFormat = function(str) {
	return str.numberFormat();
};

//숫자만(int)
Util.GetToInt = function(str) {
	return str.toInt();
};

//숫자만(num)
Util.GetToNum = function(str) {
	return str.toNum();
};


//3자리 콤마 구분 (금액표현만)
Util.SetComma = function(obj) {
	var str = obj.value;
	if (str == "0") {
		return;
	}
	str = this.GetNumberFormat(str);
	if (str == "0") str = "";
	obj.value = str;
};

//숫자만 입력(int)
Util.SetInteger = function(obj) {
	var str = obj.value;
	if (str == "0") {
		return;
	}
	str = this.GetToInt(str);
	if (str == "0") str = "";
	obj.value = str;
};

//숫자만 입력(num)
Util.SetDigit = function(obj) {
	var str = obj.value;
	str = this.GetToNum(str);
	obj.value = str;
};

/*
 *********************************************************************************************************
 * 함수설명  : 날짜형식으로 년,월,일 사이에 구분자를 넣어준다.
 * str    : 날짜가 YYMMDD형식으로 담겨있는 문자열
 * mark   : 년,월,일 사이에 들어갈 구분자
 ***********************************************************************************************************
 */
Util.formatDate = function(str,mark){
	if(str != "" && str.length == 8) {
		return str.substring(0,4)+mark+str.substring(4,6)+mark+str.substring(6,8);
	}else{
		return "";
	}
};

/* 
 ****************************************************************************************************
 * 함수설명: 입력란을 오늘날짜로 채워준다.
 *
 * field : html에서 name으로 지정된 입력필드의 명
 *
 * 사용예
 ****************************************************************************************************
 */
Util.setToday = function (field){
	var cDate=new Date();
	var year=cDate.getYear();
	var month=(cDate.getMonth()+1).toString();
	month=month.length==1?"0"+month:month;
	var day=cDate.getDate().toString();
	day=day.length==1?"0"+day:day;
	field.value="" +year+month+day;
};

/* 
 ****************************************************************************************************
 * 함수설명: 입력란을 이번달의 첫날로 채워준다..
 *
 * field : html에서 name으로 지정된 입력필드의 명
 *
 * 사용예
 ****************************************************************************************************
 */
Util.setMonthFirstDay = function(field){
	var cDate=new Date();
	var year=cDate.getYear();
	var month=(cDate.getMonth()+1).toString();
	month=month.length==1?"0"+month:month;
	var day="01";
	field.value="" +year+month+day;
};

/* 
 ****************************************************************************************************
 * 함수설명: 입력란을 올해 1월1일로 채워준다.
 *
 * field : html에서 name으로 지정된 입력필드의 명
 *
 * 사용예
 ****************************************************************************************************
 */
Util.setYearFirstDay = function(field){
    var cDate=new Date();
    var year=cDate.getYear();
    var month="01";
    var day="01";
    field.value="" +year+month+day;
};

/* 
 ****************************************************************************************************
 * 함수설명: 입력란을 오늘보다 한달전의 날짜로 채워준다..
 *
 * field : html에서 name으로 지정된 입력필드의 명
 *
 * 사용예
 ****************************************************************************************************
 */
Util.setOneMonthBefore = function(field){
	var cDate=new Date();
	var year=cDate.getYear();
	var month=(cDate.getMonth()).toString();
	month=month.length==1?"0"+month:month;
	
	if (month=="00"){
		month="12";
		year--;
	}
	var day=cDate.getDate().toString();
	day=day.length==1?"0"+day:day;
	field.value="" +year+month+day;
};

/* 
 ****************************************************************************************************
 * 함수설명: 입력란을 오늘보다 1년전의 날짜로 채워준다..
 *
 * field : html에서 name으로 지정된 입력필드의 명
 *
 * 사용예
 ****************************************************************************************************
 */
Util.setOneYearBefore = function(field){
	var cDate=new Date();
	var year=cDate.getYear()-1;
	var month=(cDate.getMonth()+1).toString();
	month=month.length==1?"0"+month:month;
	var day=cDate.getDate().toString();
	day=day.length==1?"0"+day:day;
	field.value="" +year+month+day;
};

/* 
 ****************************************************************************************************
 * 함수설명	  : 최종적으로 입력된 시작일과 종료일 두 날짜가 적합한지를 검사한다.
 *
 * fromField  : 시작일자 입력란의 필드 객체
 * ToField    : 종료일자 입력란의 필드 객체
 *
 * 사용예  <input type='text' name='test3' onBlur="javascript:checkDate('시작일',this);" >
 ****************************************************************************************************
 */
Util.checkDateFromTo = function(fromField,toField){
	if(!checkDate("시작일자",fromField) || !checkDate("종료일자",toField) ) {
		return false;
	}else if(fromField.value > toField.value){
		alert("시작일자가 종료일자보다 큽니다");
		fromField.focus();
		fromField.select(); 
		return false; 
	}
	return true;
};

/*
 *********************************************************************************************************
 * 함수설명  : 문자열이 빈문자열 혹은 공백만 있는 문자열이지 검사한다.
 * str    : 문자열
 ***********************************************************************************************************
 */
Util.isEmpty = function (str){
	if (trim(str) == '') return true;
	return false;
};

/*
 *********************************************************************************************************
 * 함수설명  : 문자열에서 특정문자를 제거한 새로운 문자열을 만든다.
 * str    : 문자열
 * ch    : 제거할 문자
 ***********************************************************************************************************
 */
Util.delChar = function (str, ch){
	var len = str.length;
	var ret = "";
 
	//문자열에서 ch 문자를 제거한다. 예) ,  - 등등
	for (var i=0; i<len; ++i){
		if (str.substring(i,i+1) != ch){
			ret = ret + str.substring(i,i+1);
		}
	}
	return ret;
};


//체크박스리스트 GET
Util.getCheckBoxList = function(areaId) {
    var checkVal = "";
    $.each($('#' + areaId + ' input[type="checkbox"]'), function () {
        if (this.checked) {
            checkVal += $(this).val() + ",";
        }
    });
    if (checkVal != "") checkVal = checkVal.substring(0, checkVal.length - 1);
    return checkVal;
};
//체크박스리스트 SET
Util.setCheckBoxList = function(areaId, codeList, separator) {
	if(!separator) separator = ",";
    var checkVal = codeList.split(separator);
    $.each($('#' + areaId + ' input[type="checkbox"]'), function (i) {
        for (var j = 0 ; j < checkVal.length; j++) {
            if (checkVal[j] == $(this).val()) {
                this.checked = true;
            }
        }
    });
};