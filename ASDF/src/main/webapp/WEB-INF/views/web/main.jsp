<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
	
	<%@ include file="/WEB-INF/views/common/baseScript.jsp"%>
	
	<script type="text/javascript">
	function getStringAddTest(param){
		
		$.ajax({
	        url      : "/web/getStringAddTest",
	        type     : 'post',		
	        data	 : { param : param },
	        dataType : 'text',
	        success  : function(data) {
	        	$("#rtn_text_01").append(data);
	        },
	        complete : function(){
	        	console.log("complete");	
	        },
	        error : function(request, status, error ) {   // 오류가 발생했을 때 호출된다. 
	        	console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
	    });	
		
		
	}
	$( document ).ready(function(){
		
		$("#btn_submit").click(function(){
			var param = $("#txt_test_01").val();
			if(param == ""){
				alert("input text");
				$("#txt_test_01").focus();
				return false;
			}
			getStringAddTest(param);	
		});	
	});
	
	
	</script>
	
</head>
<body>
<input type="text" id="txt_test_01"/>
<input type="button" id="btn_submit" value="submit"/>
<span id="rtn_text_01"></span>


</body>
</html>
