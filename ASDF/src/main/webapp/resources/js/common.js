/* 퍼블에서 제공한 달력 start */
function setCalendar( strElemId, strYearRange, strMaxDate){
	/**
	 * jQuery UI Widgets - Datepicker
	 *
	 * changeYear: 년도 선택여부
	 * changeMonth: 월 선택여부
	 * monthNamesShort: 월 선택박스 텍스트
	 * showButtonPanel: 오늘버튼과 닫기버튼 선택여부
	 * currentText: 오늘 텍스트
	 * closeText: 닫기 텍스트
	 * dayNamesMin: 요일별 텍스트
	 * monthNames: 월별 텍스트
	 * prevText: 이전달 텍스트
	 * nextText: 다음달 텍스트
	 * dateFormat: 달력 선택 이후 출력할 텍스트 유형 (EX. 2009-01-01)
	 * showOn: datepicker 디자인 유형 (EX. focus 또는 button)
	 * buttonImage: showOn 옵션을 button 설정시 사용될 이미지
	 * buttonImageOnly: 버튼 이미지만 보여줄 것인지 선택여부
	 * buttonText: 버튼 이미지 툴팁
	 * yearRange: 선택 연도 범위 (EX. 1997:2010)
	 * maxDate: 선택가능한 최대일자
	 *
	 * strYearRange : 선택 연도 범위 (EX. 1997:2010)
	 * maxDate : 선택가능한 최대일자 (EX. 20101020)
	 */
	var yearMaxDate = strMaxDate.substring(0, 4);
	var monthMaxDate = strMaxDate.substring(5, 7);
	var dayMaxDate = strMaxDate.substring(8, 10);
	
	var  jqCalendar = {
	     changeYear: true,
	     changeMonth: true,
	     monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
	     showButtonPanel: true,
	     currentText: "오늘",
	     closeText: "닫기",
	     dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
	     monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
	     prevText: "이전달",
	     nextText: "다음달",
	     dateFormat: "yy.mm.dd",
	     buttonImageOnly: true,
	     buttonText: "",
	     yearRange: strYearRange,
	     maxDate: new Date(yearMaxDate, monthMaxDate - 1, dayMaxDate)
	};
	
	$("#daily_start_date").datepicker(jqCalendar);
	$("#daily_end_date").datepicker(jqCalendar);
}
/* 퍼블에서 제공한 달력 end */

/**
 * AJAX 공통 부분
 */
$(function(){
	
	$.ajaxSetup({
		cache : false,
        async : false,
		beforeSend : function(xhr){
			xhr.setRequestHeader("ajax",true);
		},
		error: function(xhr, textStatus, errorThrown){
			Common.alertDialog("시스템 장애가 발생 하였습니다. 잠시 후에 다시 시도해 주세요.");
		}	
	});
});

var Common = {};

Common.goLogin = function(){
	Common.alertDialog("로그인이 필요 합니다.", function(){
		location.href=_login_uri;
	});
};

/**
 * Ajax 로그인 체크
 * 	
 * if(Common.ajaxGoLogin(jsonData, this)) return;
 * Ajax success 맨위에 아래 소스 추가
 */
Common.ajaxGoLogin = function(data, loadObj){

	/* ajax, load함수를 사용했을 때 아래 조건문으로 처리 됩니다. */
	if(!$.isPlainObject(data)){
		if(data.indexOf("notLogin") >= 0){
			if(loadObj != undefined) 
				$(loadObj).empty();	
			Common.goLogin();
			return true;
		}
	}
	
	/* data.resultCode가 notLogin이면 로그인 페이지로 이동합니다. */
	if(data.resultCode == "notLogin") {
		Common.goLogin();
		return true;
	}
	
	return false;
};

/**
 * Alert 다이얼로그 띄움.
 * 
 * @param {String}
 *            msg 내용
 *            
 * 예) Common.alertDialog("안녕하세요.");
 */
Common.alertDialog = function(msg, fnc) {
	var dialogTag = "<div title=\"Alert\"><p style=\"margin-top:10px;\">" + msg + "</p></div>";
	$(dialogTag).dialog( {
		modal : true,
		resizable : false,
		buttons : {
			'확인' : function() {			
				$(this).dialog('destroy');				
				if($.isFunction(fnc))
					fnc();
			}
		}
	});
};


/**
 * Alert 다이얼로그 띄움(확장). 확인후 gourl로 이동.
 * 
 * @param {String}
 *            msg 내용
 * @param {String}
 *            gourl 이동경로
 *            
 * 예) Common.alertDialogExt("안녕하세요.","/main.do");
 */
Common.alertDialogExt = function(msg, gourl) {
	var dialogTag = "<div title=\"Alert\"><p style=\"margin-top:10px;\">" + msg + "</p></div>";
	$(dialogTag).dialog( {
		modal : true,
		resizable : false,		
		buttons : {
			'확인' : function() {
				$(this).dialog('destroy').remove();
                  location.href = gourl;
			}
		}
	});
};

/**
 * Alert 다이얼로그 띄운 후 취소, 확인 버튼을 출력 후 확인 버튼을 클릭할 경우에는 proc를 실행한다.
 * 
 * @param {String}
 *            msg 내용
 * @param {String}
 *            proc 작업
 *            
 * 예) 	Common.choiceDialog("수정 하시겠습니까?", function(){ $("#test_form").submit(); });           
 *            
 */
Common.choiceDialog = function(msg, proc) {
	var dialogTag = "<div title=\"Confirm\"><p style=\"margin-top:10px;\">"
			+ msg + "</p></div>";
	$(dialogTag).dialog( {
		modal : true,
		resizable : false,		
		buttons : {
			'확인' : function() {
				if( typeof(proc)=='function' ){
					proc();
				}
				$(this).dialog('destroy').remove();
			},			
			'취소' : function() {
				$(this).dialog('destroy').remove();
			}
		}
	});
};
	
/**
 * 팝업 윈도우 화면의 중간에 위치.
 * 
 * @param winUrl 새창 url
 * @param winName 새창 이름
 * @param winWidth 창 넓이
 * @param winHeight 창 높이
 * @param winScroll 스크롤 여부 (yes|no)
 * @param winResize 리사이즈 여부 (yes|no)
 * @param winLeft 창 좌측 위치 값이 없으면 해상도 가로값
 * @param winTop 창 탑 위치 값이 없다면 해상도 세로값 
 * 
 * 예) Common.popUpWindow('주소','윈도우이름',500,400,'yes','no');
 * 
 */
Common.popUpWindow = function( winUrl, winName, winWidth, winHeight, winScroll, winResize, winLeft, winTop) {
	if(typeof(winLeft)=="undefined") winLeft = parseInt((window.screen.width-parseInt(winWidth))/2, 10); //해상도가로
	if(typeof(winTop)=="undefined") winTop = parseInt((window.screen.height-parseInt(winHeight))/2, 10); //해상도세로
	if( ((window.screen.height-80)-winHeight)<0 ){
		winHeight = window.screen.height-80;
		winTop = 0;
	}
	var newWin=window.open(winUrl, winName,"width="+winWidth+",height="+winHeight+",scrollbars="+winScroll+",resizable="+winResize+",left=" + winLeft + ",top=" + winTop+",directories=no,status=no,menubar=no");
	if(newWin) newWin.focus();
};

//로딩중 이미지 처리
Common.loadingStart = function(msg){
	
	var str = "로딩중 입니다...";		
	if(msg){
		str = msg;
	}		
	$.blockUI({
		message : '<img src="/resources/images/spinner.gif" alt="로딩"  width="16" height="16"/> '+str
		, css : { 
			border : '1px solid #aaa'
			,padding: '10px'
		}
		,overlayCSS : { 
			opacity : 0.1
		}
	});

};	

//로딩 완료
Common.loadingEnd = function(){
	$.unblockUI();	
};

/**
* 공통 코드 리스트 가져오기
* 
* @param group 코드그룹
* @param selectID 셀렉트ID값
* @param title 기본타이틀
* @param value 기본값
* @param selectedValue 기본 선택이 필요할 경우 값

* 
* 예) Common.selectCodeList('JOB', 'selectID', '전체', '', '' );
* 
*/	
Common.selectCodeList = function(group, selectID, title, value, selectedValue ) {

	if(typeof(title)=="undefined") title = "";
	if(typeof(value)=="undefined") value = "";
	if(typeof(selectedValue)=="undefined") selectedValue = "";

	$.ajax({
		url: '/common/code/'+group+'/list/ajax',
		type: "GET",
		dataType : 'json',
		cache : false,
		success: function(jsonData){
									 
			var option = "";
			
			if( title!="" ){
				option += "<option value='"+value+"'>"+title+"</option>";
			}
			
			for( index in jsonData ){	
				option += "<option value='"+jsonData[index].cd+"' ";
		         if( selectedValue !="" && jsonData[index].cd == selectedValue ){
		        	 option += " selected ";
		        }
				option += " >"+jsonData[index].cdNm+"</option>";
          }
          $('#'+selectID).html(option);
		},
		error: function(xhr, textStatus, errorThrown){
			//alert("오류!!");
		}
	});
};

//파일 다운로드 스크립트
Common.fileDownload = function(filePathName, fileLocalName){
	var iframe = $('<iframe src="/common/download?filePathName='+filePathName+'&fileLocalName='+fileLocalName+'" width="0" height="0" style="display:none;" title="빈 프레임" />');
    $('body').append(iframe);
};

/**
* 쿠키 셋팅
* @param name 쿠키이름
* @param value 쿠키값
* @param expiredays 날짜 ( 1:하루 )
*
* setCookie( "Notice", "done" , 1); 하루동안 쿠키 저장
*/
Common.setCookie = function( name, value, expiredays ){ 
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays ); 
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";
};

/**
* 쿠키값 가져오기
* @param name 쿠키이름
* @return String 쿠키값
*
* getCookie(쿠키이름)
*/
Common.getCookie = function(name){
	var prefix = name + "=";
	var cookieStartIndex = document.cookie.indexOf(prefix);
	if (cookieStartIndex == -1)
		return "";
	var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
	if (cookieEndIndex == -1)
		cookieEndIndex = document.cookie.length;
	return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
};

/**
* 쿠키 소멸
* @param name 쿠키이름
*/
Common.clearCookie = function(name){
	var today = new Date();
	//어제 날짜를 쿠키 소멸 날짜로 설정한다.
	var expire_date = new Date(today.getDate() - 1);
	document.cookie = name + "= " + "; path=/; expires=" + expire_date.toGMTString();
};

/**
 * 첫번째 객체가 undefined이거나 empty면 두번째 객체로 리턴
 */
Common.emptyChg = function(obj1, obj2){
	if(obj1 == undefined || obj1 == "")
		return obj2;
	else
		return obj1;
}
