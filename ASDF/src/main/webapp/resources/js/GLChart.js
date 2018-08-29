// trial version
if(window.location.protocol != 'file:' ){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','GLChart_ga');

	  GLChart_ga('create', 'UA-48871930-1');
}



(function( window ){
	
	var document = window.document,
	navigator = window.navigator,
	location = window.location;
	
	//var tSingle = 'U2luZ2xlIHdlYnNpdGUgbGljZW5zZXM=';
	//var tMulti = 'TXVsdGlwbGUgd2Vic2l0ZSBsaWNlbnNlcyAg';
	
	var GLChart = (function(){
		
		var GLChart = function( args ){
			this.aData_org		= null;
			this.aData 			= null;
			this.tempAData		= null;
			this.aImgData		= null;
			
			// 두번째 데이타
			this.aData2 = [];
			this.aSumData2 = [];
			this.aSaveColumnCoordValue2 = [];
			
			this.aSumData		= [];
			this.oRangeData_org = {};
			this.oRangeData		= {};
			
			this.aBubbleData	= [];
			
			this.legendTop		= 0;
			this.legendLeft		= 0;
			
			this.sContainer 	= args[0] || null;
			this.oCanvas_body 	= null;
			this.oCanvas_body_image = null;
			this.oCanvas_grid 	= null;
			this.oCanvas_item 	= null;
			this.oCanvas_item2 	= null;
			this.oCanvas_item3 	= null;
			this.oCanvas_event 	= null;
			this.oCanvas_tooltip= null;
			this.oCanvas_legend	= null;
			this.oCanvas_xRangePreview = null;
			this.oCanvas_xRangeHandle = null;
			this.graphics		= null;
			this.graphics_image = null;
			this.graphics_grid	= null;
			this.graphics_item	= null;
			this.graphics_item2	= null;
			this.graphics_item3	= null;
			this.graphics_event	= null;
			this.graphics_tooltip= null;
			this.graphics_legend= null;
			this.graphics_xRangePreview = null;
			this.graphics_xRangeHandle = null;
			this.sWidth 		= args[1] || null;
			this.sHeight 		= args[2] || null;
			this.support_touch 	= ('ontouchend' in document && 'ontouchstart' in document);
			this.support_userAgent= null;
			this.aSelectItem	= null;
			this.hasChart		= false;
			this.animationInst	= null;
			this.seriesColumnLen= 0;
			this.ranges = { 
				'xmin' : 0, 'xmax' : Number.MIN_VALUE, 
				'ymin' : 0, 'ymax' : Number.MIN_VALUE,
				'ymin2' : 0, 'ymax2' : Number.MIN_VALUE 
			};
			this.calculatedMargins={x:0,y:0,w:0,h:0};
			this.xLabels 		= null;
			this.xLabelWidth	= 0;
			this.yLabels 		= null;
			this.yLabels2		= null;
			this.labelMargin	= 4;
			this.xZero			= null;
			this.yZero			= null;
			this.y2Zero			= null;
			this.coordinate 	= [];
			this.coordinate2 	= [];
			this.coordinateLegend = [];
			this.bottom3DGap	= 20;
			this.common_options = {
				animation : true
				,background : {strokeColor:'#e2e2e2', strokeThickness:0, fill:'#ffffff', opacity:1}
				,background3D : {on: true, strokeColor:'#e2e2e2', strokeThickness:0, fill:'#dddddd'}
				,chartArea : {top:20, right:20, bottom:20, left:20}
				,colors : ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#fec500', '#ffff00', '#8cc700', '#db006c']
				,colors2 : ['#FF0F00', '#FF6600', '#FF9E01', '#FCD202', '#F8FF01', '#B0DE09', '#04D215', '#0D8ECF', '#0D52D1', '#2A0CD0', '#8A0CCF', '#CD0D74', '#754DEB'/*, '#DDDDDD', '#999999', '#333333', '#000000'*/]
				,downValueColors : ['#ff0000']
				,is3D : false
				,fontSize : 12
				,fontName : 'Gulim'
				,legend : {position:'none', strokeColor:'#e2e2e2', strokeThickness:0, fill:'#fff', opacity:1, pointStyle:'rectangle', maxLength:'auto'}
				,legendTextStyle : {color:'#000000', fontName:'Gulim', fontSize:12, style:'normal'}
				,legendBackground : {strokeColor:'#e2e2e2', strokeThickness:1, fill:'#ffffff', opacity:1, separation:4, margin:2}
				,legendIcon : {strokeThickness:3, opacity:0, gap:0}
				,pointerGuideLine : {on:false, strokeColor:'#ff0000', strokeThickness:1, opacity:1, verticalLine:true, horizontalLine:true}
				,pointerGuideLineLabel : true
				,pointerGuideLineLabelTextStyle : {color:'#ffffff', fontName:'Gulim', fontSize:12}
				,pointerGuideLineLabelBackground : {strokeColor:'#ff0000', strokeThickness:1, fill:'#ff0000', opacity:1, margin:2}
				,titlePrefix : ''
				,titlePrefixTextStyle : {color:'#000000', fontSize:12, fontName:'Gulim', fontStyle:'normal'}
				,title : ''
				,titleTextStyle : {color:'#000000', fontName:'Gulim', fontSize:12, fontStyle:'normal'}
				,tooltip : false
				,tooltipText : 'all'	// all, value, label, percentage
				,tooltipTitleTextStyle : {color:'#000000', fontName:'Gulim', fontSize:12, fontStyle:'bold', prefix:'', suffix:''}
				,tooltipTextStyle : {color:'#000000', fontName:'Gulim', fontSize:12, fontStyle:'normal', prefix:'', suffix:''}
				,tooltipBackground : {strokeColor:'#e2e2e2', strokeThickness:1, fill:'#ffffff', downValueFill:'#ffffff', opacity:1, separation:4, margin:2, cornerRadius:0, shadow:false}
				,tooltipIcon : {on:false, size:5, strokeColor:'#ffffff', strokeThickness:1, fill:'#ffffff', top:0, left:0, frontIcon:'up_arrow', separation:4}	// frontIcon:('up_arrow' | 'down_arrow')
				,theme : {
					axisStyle : 1
					,seriesGradientStyle : 3
					,seriesSelectedStyle : 'none'
					,tooltipStyle : 1
					,rangeSelectorStyle : 1
				}
				,axisLineColor : null
				,xAxis : {
					color : '#e2e2e2'
					,format : 'none'
					,maxAlternation:1
					,name : ''
					,nameTextStyle:{color:'#000000',fontName:'Gulim',fontSize:12}
					,slantedText:false
					,slantedTextAngle:30
					,showTextEvery:1
					,textStyle:{color:'#000000',fontName:'Gulim',fontSize:12, fontStyle:'normal'}
					,isValue : false
					,maxLength : 'auto'
					,minValue : 'auto'
					,showLastLabel : true
					,label : true
					,labelGap : 0
					,tooltipLabel : null
					,showGridLine : true
					,maxLength : 'auto'
				}
				,yAxis : {
					color : '#e2e2e2'
					,format : '#,##0'
					,name : ''
					,nameTextStyle:{color:'#000000',fontName:'Gulim',fontSize:12}
					,textStyle:{color:'#000000',fontName:'Gulim',fontSize:12, fontStyle:'normal'}
					,minValue : 'auto'
					,maxValue : 'auto'
					,label : true
					,tooltipLabel : null
					,prefix : ''
					,suffix : ''
					,showGridLine : true
					,maxLength : 'auto'
				}
				,yAxis2 : {
					format : '#,##0'
					,name : ''
					,nameTextStyle:{color:'#000000',fontName:'Gulim',fontSize:12}
					,color : '#b4b4b4'
					,textStyle:{color:'#000000',fontName:'Gulim',fontSize:12}
					,minValue : 'auto'
					,label : true
					,tooltipLabel : null
					,prefix : ''
					,suffix : ''
					,showGridLine : true
					,maxLength : 'auto'
				}
				,zeroPlane:true
				,zeroPlaneColor:'#000000'
				,zeroPlaneThickness:1
				,horizontalFill:{on:true, odd:'#e2e2e2', even:'#bbbbbb', opacity:0.5}
				,verticalFill:{on:false, odd:'#e2e2e2', even:'#bbbbbb', opacity:0.5}
				,xRange:{
					on:false
					,type:'range'	// range, scroll
					,min:'auto'
					,max:'auto'
					,background:{strokeColor:'#919191', strokeThickness:1, fill:'#a8a8a8', fill2:'#ffffff', opacity:1, roundedCorner:0}
					,rangeArea:{fill:'#000000', opacity:0.3}
					,scrollHandleStyle:{fill:'#ffffff', fill2:'#e2e2e2', fillAngle:0, strokeColor:'#919191', strokeThickness:4, opacity:1, height:20, width:20, roundedCorner:3}
					,handlesStyle:{fill:'#ffffff', fill2:'#e2e2e2', fillAngle:0, strokeColor:'#919191', strokeThickness:4, opacity:1, height:20, width:20, roundedCorner:3, isPattern:true}
					,preview:{on:true, zooming:false, width:'', height:40, margin:0}
					,previewBackground:{strokeColor:'#919191', strokeThickness:1, fill:'#ffffff', opacity:1}
					,previewHandles:{strokeColor:'#919191', strokeThickness:1, fill:'#000000', opacity:0.3}
				}
				,isDownValueColors:false
				,events:{
					click:null	// function(event, data)
				}
			};
			
			this.isAndroid = false;
			
			// range property
			this.hasRange		= false;
			this.rangeFlag 		= false;
			this.rangeFlag2 	= false;
			this.rangeFlagCenter= false;
			this.rangeSx		= null;
			this.rangeSx2		= null;
			this.moveSx			= null;
			this.moveSx2		= null;
			this.rangeEventSx	= null;
			this.rangeEventSx2	= null;
			this.rangeEventSxCenter = null;
			this.rangeAreaWidth	= null;
			this.rangeLeftSx	= null;
			this.rangeStartIndex= 0;
			
		};
		GLChart.$=function(s) { return document.getElementById(s); };
		GLChart.extend = function(a, b){
			var spp = a.prototype;
			for (var property in b){
			   spp[property] = b[property];
			}   
			return a;
		};
		GLChart.prototype.userAgent = function(){
		
			var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);
			if(trident != null && trident[1] == "5.0"){
				return {ie:false};
			}else if(trident != null && trident[1] == "6.0"){
				return {ie:false};
			}else if(trident != null && trident[1] == "4.0"){
				return {ie:true};
			}else{
				var ua=navigator.userAgent.toLowerCase();
				var chrome=/chrome/.test(ua);
				var opera=/opera/.test(ua);
				return {ie:!opera && /msie/.test(ua)};
			}

		};
		GLChart.prototype.isMobile = function( type ) {
		
			if( type == 'Android' ){
				this.isAndroid = navigator.userAgent.match(/Android/i) ? true : false;
			}else if( type == 'BlackBerry' ){
				return navigator.userAgent.match(/BlackBerry/i) ? true : false;
			}else if( type == 'iOS' ){
				return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
			}else if( type == 'Windows' ){
				return navigator.userAgent.match(/IEMobile/i) ? true : false;
			}else if( type == 'any' ){
				var bMobile = navigator.userAgent.match(/Android/i) ? true : false;
				var bMobile2 = navigator.userAgent.match(/BlackBerry/i) ? true : false;
				var bMobile3 = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
				var bMobile4 = navigator.userAgent.match(/IEMobile/i) ? true : false;
				return (bMobile || bMobile2 || bMobile3 || bMobile4);
			}
		};
		GLChart.prototype.getOldInternetExplorer = function(){   // IE 버전체크   
			var rv = -1; // Return value assumes failure.    
			if(navigator.appName == 'Microsoft Internet Explorer'){        
				var ua = navigator.userAgent;        
				var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");        
				if(re.exec(ua) != null){       
					rv = parseFloat(RegExp.$1);
				}
				/*
				var trident = ua.match(/Trident\/(\d.\d)/i);
				if(trident != null && trident[1] == "5.0"){
					rv = 9;
				}else if(trident != null && trident[1] == "6.0"){
					rv = 10;
				}else if(trident != null && trident[1] == "4.0"){
					rv = 8;
				}
				*/
			}  

			if( rv != -1 && rv < 9 ){
				return true;
			}else{
				return false;
			}
		};
		GLChart.prototype.attr = function(ele, name, value){
			if( ele ){
				if( !!ele.getAttribute ){
					if(value){
						ele.setAttribute(name, value);
					}else{
						return ele.getAttribute(name);
					}
				}else{
					if(value){
						ele[name] = value;
					}else{
						return ele.name;
					}
				}
			}
		};
		GLChart.prototype.clearRect = function( canvas, ctx, width, height ) {
		
			if( this.isAndroid ){
				canvas.width = width * window.devicePixelRatio;
				canvas.height = height * window.devicePixelRatio;
				canvas.style.width = width+'px';
				canvas.style.height = height+'px';
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);  
			}else{
				ctx.clearRect(0, 0, width, height);
			}
		};
		GLChart.prototype.DOMParser = function( sXml ){
		
			if (sXml == '' || !sXml) {
				throw 'Invalid XML';
				return '';
			}
			var DOM;
			var xmlData;
			try {
				if (window.DOMParser) {
					DOM = new DOMParser();
					xmlData = DOM.parseFromString(sXml, 'text/xml');
				} else {
					xmlData = new ActiveXObject('Microsoft.XMLDOM');
					xmlData.async = 'false';
					xmlData.loadXML(sXml);
				}
			} catch (e) {
				throw 'Invalid XML';
			}
			if (!xmlData || xmlData.textContent == "") {
				throw 'Invalid XML';
				return '';
			}
			DOM = xmlData.documentElement;
			if (!DOM || !DOM.nodeName || DOM.nodeName === 'parsererror') {
				throw 'Invalid XML';
			}
			return xmlData;
		};
		GLChart.prototype.applyOptions = function( op, applyO ){
			var oDefault = op || {};
			var e,j,i,o,p,q, r;
			
			if( typeof oDefault!=='object' )
			{  oDefault = {}; }
			 
			if( (e=applyO) != null )
			{
				for(j in e)
				{
					i = oDefault[j];
					o = e[j];
				
					if(j == 'background')
					{
						if(typeof o == 'string'){
						  oDefault[j].fill = o;
						}
						else if(typeof o == 'object')
						{
						  for(p in o)
						  {
							try{oDefault[j][p] = o[p];}catch(ex){oDefault[j] = o;}
						  }
						}
					}else if(
							  j == 'chartArea' 
							  || j == 'background3D'
							  || j == 'columnText'
							  || j == 'columnSumText'
							  || j == 'columnEachItem'
							  || j == 'barEachItem'
							  || j == 'targetColumnText'
							  || j == 'barText'
							  || j == 'barSumText'
							  || j == 'legend' 
							  || j == 'xAxis' 
							  || j == 'yAxis' 
							  || j == 'yAxis2' 
							  || j == 'theme' 
							  || j == 'legendTextStyle' 
							  || j == 'legendBackground'
							  || j == 'legendIcon'
							  || j == 'pointerGuideLine'
							  || j == 'pointerGuideLineLabelTextStyle'
							  || j == 'pointerGuideLineLabelBackground'
							  || j == 'tooltipBackground'
							  || j == 'pieSliceTextStyle'
							  || j == 'pieSlicePrefixTextStyle'
							  || j == 'pieSliceTitleTextStyle'
							  || j == 'linePointLabelTextStyle'
							  || j == 'linePointLabelBoxBackground'
							  || j == 'titleTextStyle'
							  || j == 'horizontalFill'
							  || j == 'verticalFill'
							  || j == 'tooltipTextStyle'
							  || j == 'tooltipTitleTextStyle'
							  || j == 'tooltipIcon'
							  || j == 'xRange'
							  || j == 'events')
					{
						if(typeof o == 'object')
						{
							for(p in o)
							{
								if( p == 'textStyle' || p == 'nameTextStyle' 
									|| p == 'background' 
									|| p == 'rangeArea' 
									|| p == 'handlesStyle' 
									|| p == 'scrollHandleStyle'
									|| p == 'preview' 
									|| p == 'previewBackground'
									|| p == 'previewHandles' ){
									for( q in o[p]){
										try{oDefault[j][p][q] = o[p][q];}catch(ex){oDefault[j][p] = o[p];}
									}
								}else{
									try{oDefault[j][p] = o[p];}catch(ex){oDefault[j] = o;}
								}
							}
						}
						else
						{ oDefault[j] = o; }
					}else if( j == 'series' ){
						try{
							oDefault[j] = o;
							if( this.aData != null ){
								var len = this.aData[0].length-1;
								var dataType = [];
								for( var i=0;i<len;i++ ){
								  dataType.push({type:'column',pointSize:2,pointType:'circle',lineType:'normal',lineWidth:2, parentYAxis:'F'});
								  
								  
								  if(this.options.series[i]) {
									var obj = this.options.series[i];
									for(r in obj){
									  dataType[i][r] = obj[r];
									}
								  }
								  if( dataType[i]['type'] == 'column'){
									this.seriesColumnLen++;
								  }
								  
								}
								this.options.series = dataType;
							}	
						}catch(ex){}
					}else{
						oDefault[j] = o;
					}
	  
				}
			}
			
			if( this.options.theme.rangeSelectorStyle == 2 && this.options.xRange.preview.on && this.options.xRange.on ){
				this.options.xRange.handlesStyle.height = 8;
			}
			
			if( this.options.xRange.type == 'scroll' ){
				this.options.xRange.preview.on = false;
				this.options.xRange.handlesStyle.width = parseFloat(this.options.xRange.handlesStyle.width)-4;
			}
			
		};
		GLChart.prototype.setCanvas = function(){
			var con = GLChart.$(this.sContainer);
			con.style.position = "relative";
			con.style.overflow = "hidden";
			this.support_userAgent = this.userAgent();
			this.isMobile('Android');
			var backgroundColor = this.support_userAgent.ie? 
									this.options.background.fill
									:this.colorToRgba(this.options.background.fill,this.options.background.opacity);
			var legendBackgroundColor = this.support_userAgent.ie? 
									this.options.legendBackground.fill
									:this.colorToRgba(this.options.legendBackground.fill,this.options.legendBackground.opacity);
			var tooltipBackgroundColor = this.support_userAgent.ie? 
									this.options.tooltipBackground.fill
									:this.colorToRgba(this.options.tooltipBackground.fill,this.options.tooltipBackground.opacity);
				
			var aHtml = [];
			// draw image canvas ===============================================================================================
			aHtml.push('<canvas id="'+this.sContainer+'___canvas__image" width="');
			aHtml.push(this.sWidth);
			aHtml.push('" height="');
			aHtml.push(this.sHeight);
			aHtml.push('" style="visibility:hidden;position:absolute;left:0;top:0;overflow:hidden;background-color:');
			aHtml.push(backgroundColor+';');	
			aHtml.push('border:'+this.options.background.strokeThickness+'px solid '+this.options.background.strokeColor+';');
			aHtml.push('"></canvas>');
			// draw image canvas ===============================================================================================
			
			var ua=navigator.userAgent.toLowerCase();
			var ie7 = /msie 7.0/.test(ua);
			
			if( ie7 && this.options.background.opacity == 0 ){
				aHtml.push('<canvas id="'+this.sContainer+'___canvas" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;');	
				aHtml.push('border:'+this.options.background.strokeThickness+'px solid '+this.options.background.strokeColor+';');
				aHtml.push('"></canvas>');
			}else{
				aHtml.push('<canvas id="'+this.sContainer+'___canvas" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;background-color:');
				aHtml.push(backgroundColor+';');	
				aHtml.push('border:'+this.options.background.strokeThickness+'px solid '+this.options.background.strokeColor+';');
				aHtml.push('"></canvas>');
			}
			if(this.options.type != 'pie' && this.options.type != 'multipie'){
				aHtml.push('<canvas id="'+this.sContainer+'___gridLayout" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
				
				if(this.options.type == 'singleYCombination' || this.options.type == 'dualYCombination'){
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout2" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout3" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
				}else if(this.options.type == 'line' && this.options.linePointLabelBox ){
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout2" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout3" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
				}else{
					aHtml.push('<canvas id="'+this.sContainer+'___itemLayout" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(this.sHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
				}
				
				if( this.options.xRange.on ){
				
					var xNTSize = parseInt(this.options.xAxis.nameTextStyle.fontSize,10);
					var yNTSize = parseInt(this.options.yAxis.nameTextStyle.fontSize,10);
					if( this.options.type == 'bar' || this.options.type == 'stackedBar' ){
						var xNTMargin = this.options.yAxis.name==''?0:yNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
					}else{
						var xNTMargin = this.options.xAxis.name==''?0:xNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
					}
					
					var xrangeHeight = (this.options.xRange.preview.on)? 
									   (this.options.xRange.preview.height
										+(parseInt(this.options.xRange.preview.margin,10)*2)
										+this.options.xRange.handlesStyle.height)
									   : this.options.xRange.handlesStyle.height;
					var xrangeTop = this.sHeight - (this.options.chartArea.bottom + xrangeHeight + xNTMargin);
					aHtml.push('<div id="'+this.sContainer+'___xRangeLayout_div" style="top:'+xrangeTop+'px;position:relative;overflow:hidden;width:'+this.sWidth+'px;height:'+xrangeHeight+'px;">');
					aHtml.push('<canvas id="'+this.sContainer+'___xRangePreviewLayout" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(xrangeHeight);
					aHtml.push('" style="position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
					
					aHtml.push('<canvas id="'+this.sContainer+'___xRangeHandleLayout" width="');
					aHtml.push(this.sWidth);
					aHtml.push('" height="');
					aHtml.push(xrangeHeight);
					aHtml.push('" style="z-index:2;position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
					aHtml.push('</div>');
					
				}
				
				aHtml.push('<canvas id="'+this.sContainer+'___eventLayout" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				aHtml.push('" style="z-index:3;position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
				
			}
			
			if( this.options.legend.position != 'none' ){
				aHtml.push('<canvas id="'+this.sContainer+'___legend" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				aHtml.push('" style="display:none;position:absolute;left:0;top:0;overflow:hidden;background-color:');
				aHtml.push(legendBackgroundColor+';');
				aHtml.push('border:'+this.options.legendBackground.strokeThickness+'px solid '+this.options.legendBackground.strokeColor+';');
				aHtml.push('"></canvas>');
            }
			
			if( this.options.tooltip ){
				/*
				aHtml.push('<canvas id="'+this.sContainer+'___tooltip" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				aHtml.push('" style="z-index:99999;display:none;position:absolute;left:0;top:0;overflow:hidden;background-color:');
				aHtml.push(tooltipBackgroundColor+';');
				aHtml.push('border:'+this.options.tooltipBackground.strokeThickness+'px solid '+this.options.tooltipBackground.strokeColor+';');
				aHtml.push('"></canvas>');
				*/
				aHtml.push('<canvas id="'+this.sContainer+'___tooltip" width="');
				aHtml.push(this.sWidth);
				aHtml.push('" height="');
				aHtml.push(this.sHeight);
				if(this.options.tooltipBackground.shadow){
					aHtml.push('" style="z-index:99999;display:none;position:absolute;left:0;top:0;overflow:hidden;-webkit-box-shadow:5px 5px 10px 0px rgba(0,0,0,0.2);-moz-box-shadow:5px 5px 10px 0px rgba(0,0,0,0.2);box-shadow:5px 5px 10px 0px rgba(0,0,0,0.2);"></canvas>');
				}else{
					aHtml.push('" style="z-index:99999;display:none;position:absolute;left:0;top:0;overflow:hidden;"></canvas>');
				}
			}
			
			// Trial version ==================================================================================================
			aHtml.push('<canvas id="'+this.sContainer+'___Trial" width="130" height="20" ');
			aHtml.push('style="position:absolute;right:0;bottom:0;overflow:hidden;border:0px solid #000;');
			aHtml.push('"></canvas>');
			
			// google analytics(Trial version)
			if(window.location.protocol != 'file:' ){
				GLChart_ga('send', {
				  'hitType': 'pageview',
				  'page': window.location.host
				});
			}
			// Trial version ==================================================================================================
			
			
			
			document.getElementById(this.sContainer).innerHTML = aHtml.join('');
			
			if(this.support_userAgent.ie){
				this.setCssOpacity(document.getElementById(this.sContainer+'___canvas__image'), this.options.background.opacity);
				if( !ie7 ){
					this.setCssOpacity(document.getElementById(this.sContainer+'___canvas'), this.options.background.opacity);
				}
				if( this.options.legend.position != 'none' ){
					this.setCssOpacity(document.getElementById(this.sContainer+'___legend'), this.options.legendBackground.opacity);
				}
				if( this.options.tooltip ){
					this.setCssOpacity(document.getElementById(this.sContainer+'___tooltip'), this.options.tooltipBackground.opacity);
				}
				if( this.options.xRange.on && this.options.type != 'pie' && this.options.type != 'multipie' ){
					this.setCssOpacity(document.getElementById(this.sContainer+'___xRangePreviewLayout'), this.options.xRange.previewBackground.opacity);
					this.setCssOpacity(document.getElementById(this.sContainer+'___xRangeHandleLayout'), this.options.xRange.background.opacity);
				}
			}	
			
			this.oCanvas_body_image	= GLChart.$(this.sContainer+'___canvas__image');
			this.oCanvas_body 		= GLChart.$(this.sContainer+'___canvas');
			if(this.options.type != 'pie' && this.options.type != 'multipie'){
				this.oCanvas_grid 	= GLChart.$(this.sContainer+'___gridLayout');
				if(this.options.type == 'singleYCombination' || this.options.type == 'dualYCombination'){
					this.oCanvas_item 	= GLChart.$(this.sContainer+'___itemLayout');
					this.oCanvas_item2 	= GLChart.$(this.sContainer+'___itemLayout2');
					this.oCanvas_item3 	= GLChart.$(this.sContainer+'___itemLayout3');
				}else if(this.options.type == 'line' && this.options.linePointLabelBox ){
					this.oCanvas_item 	= GLChart.$(this.sContainer+'___itemLayout');
					this.oCanvas_item2 	= GLChart.$(this.sContainer+'___itemLayout2');
					this.oCanvas_item3 	= GLChart.$(this.sContainer+'___itemLayout3');
				}else{
					this.oCanvas_item 	= GLChart.$(this.sContainer+'___itemLayout');
				}	
				this.oCanvas_event 	= GLChart.$(this.sContainer+'___eventLayout');
			}
			this.oCanvas_legend 	= GLChart.$(this.sContainer+'___legend');
			this.oCanvas_tooltip 	= GLChart.$(this.sContainer+'___tooltip');
			if( this.options.xRange.on ){
				this.oCanvas_xRangePreview = GLChart.$(this.sContainer+'___xRangePreviewLayout');
				this.oCanvas_xRangeHandle = GLChart.$(this.sContainer+'___xRangeHandleLayout');
			}
			
			if (window.G_vmlCanvasManager && window.attachEvent && !window.opera) {
				this.oCanvas_body_image = window.G_vmlCanvasManager.initElement(this.oCanvas_body_image);
				this.oCanvas_body 	= window.G_vmlCanvasManager.initElement(this.oCanvas_body);
				if(this.options.type != 'pie' && this.options.type != 'multipie'){
					this.oCanvas_grid 	= window.G_vmlCanvasManager.initElement(this.oCanvas_grid);
					if(this.options.type == 'singleYCombination' || this.options.type == 'dualYCombination'){
						this.oCanvas_item 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item);
						this.oCanvas_item2 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item2);
						this.oCanvas_item3 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item3);
					}else if(this.options.type == 'line' && this.options.linePointLabelBox ){
						this.oCanvas_item 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item);
						this.oCanvas_item2 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item2);
						this.oCanvas_item3 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item3);
					}else{
						this.oCanvas_item 	= window.G_vmlCanvasManager.initElement(this.oCanvas_item);
					}
					this.oCanvas_event 	= window.G_vmlCanvasManager.initElement(this.oCanvas_event);
				}
				this.oCanvas_legend = this.options.legend.position!='none'?window.G_vmlCanvasManager.initElement(this.oCanvas_legend):null;
				this.oCanvas_tooltip= this.options.tooltip?window.G_vmlCanvasManager.initElement(this.oCanvas_tooltip):null;
				
				if( this.options.xRange.on && this.options.type != 'pie' && this.options.type != 'multipie' ){
					this.oCanvas_xRangePreview = window.G_vmlCanvasManager.initElement(this.oCanvas_xRangePreview);
					this.oCanvas_xRangeHandle = window.G_vmlCanvasManager.initElement(this.oCanvas_xRangeHandle);
				}
			}
			this.graphics_image		= this.oCanvas_body_image.getContext('2d');
			this.graphics 			= this.oCanvas_body.getContext('2d');
			this.graphics_grid		= (this.options.type != 'pie' && this.options.type != 'multipie')?this.oCanvas_grid.getContext('2d'):null;
			if(this.options.type == 'singleYCombination' || this.options.type == 'dualYCombination'){
				this.graphics_item		= this.oCanvas_item.getContext('2d');
				this.graphics_item2		= this.oCanvas_item2.getContext('2d');
				this.graphics_item3		= this.oCanvas_item3.getContext('2d');
				
				this.setDevicePixelRatio(this.graphics_item, this.oCanvas_item, this.sWidth, this.sHeight);
				this.setDevicePixelRatio(this.graphics_item2, this.oCanvas_item2, this.sWidth, this.sHeight);
				this.setDevicePixelRatio(this.graphics_item3, this.oCanvas_item3, this.sWidth, this.sHeight);
			}else if(this.options.type == 'line' && this.options.linePointLabelBox ){
				this.graphics_item		= this.oCanvas_item.getContext('2d');
				this.graphics_item2		= this.oCanvas_item2.getContext('2d');
				this.graphics_item3		= this.oCanvas_item3.getContext('2d');
				
				this.setDevicePixelRatio(this.graphics_item, this.oCanvas_item, this.sWidth, this.sHeight);
				this.setDevicePixelRatio(this.graphics_item2, this.oCanvas_item2, this.sWidth, this.sHeight);
				this.setDevicePixelRatio(this.graphics_item3, this.oCanvas_item3, this.sWidth, this.sHeight);
			}else{
				this.graphics_item		= (this.options.type != 'pie' && this.options.type != 'multipie')?this.oCanvas_item.getContext('2d'):null;
				if( this.graphics_item ){
					this.setDevicePixelRatio(this.graphics_item, this.oCanvas_item, this.sWidth, this.sHeight);
				}
			}
			this.graphics_event		= (this.options.type != 'pie' && this.options.type != 'multipie')?this.oCanvas_event.getContext('2d'):null;
			this.graphics_legend 	= this.options.legend.position!='none'?this.oCanvas_legend.getContext('2d'):null;
			this.graphics_tooltip 	= this.options.tooltip?this.oCanvas_tooltip.getContext('2d'):null;
			if(this.graphics_event){
				this.setDevicePixelRatio(this.graphics_event, this.oCanvas_event, this.sWidth, this.sHeight);
			}
			/*
			if(this.graphics_legend){
				this.setDevicePixelRatio(this.graphics_legend, this.oCanvas_legend, this.sWidth, this.sHeight);
			}
			if(this.graphics_tooltip){
				this.setDevicePixelRatio(this.graphics_tooltip, this.oCanvas_tooltip, this.sWidth, this.sHeight);
			}
			*/
			if(this.graphics_image){
				this.setDevicePixelRatio(this.graphics_image, this.oCanvas_body_image, this.sWidth, this.sHeight);
			}			
			if(this.graphics){
				this.setDevicePixelRatio(this.graphics, this.oCanvas_body, this.sWidth, this.sHeight);
			}
			if(this.graphics_grid){
				this.setDevicePixelRatio(this.graphics_grid, this.oCanvas_grid, this.sWidth, this.sHeight);
			}	
			
			if( this.options.xRange.on && (this.options.type != 'pie' && this.options.type != 'multipie') ){
				this.graphics_xRangePreview		= this.oCanvas_xRangePreview.getContext('2d');
				this.graphics_xRangeHandle		= this.oCanvas_xRangeHandle.getContext('2d');
			}
			
			// Trial version ==================================================================================================
			var str = unescape("%68%74%74%70%3A%2F%2F%67%6C%63%68%61%72%74%2E%63%6F%6D%0A%09%09%09");
			var oCanvas_Trial = GLChart.$(this.sContainer+'___Trial');
			var oCanvas_Trial2 = GLChart.$(this.sContainer+'___eventLayout');
			if (window.G_vmlCanvasManager && window.attachEvent && !window.opera) {
				oCanvas_Trial = window.G_vmlCanvasManager.initElement(oCanvas_Trial);
				if(this.options.type != 'pie' && this.options.type != 'multipie'){
					oCanvas_Trial2 = window.G_vmlCanvasManager.initElement(oCanvas_Trial2);
				}	
			}
			var ctx = oCanvas_Trial.getContext('2d');
			ctx.beginPath();
			ctx.font = '14px "Arial"';
			ctx.textAlign = 'start';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#959595';
			ctx.fillText(str,0,0);
			ctx.font = this.options.fontSize+'px "'+this.options.fontName+'"';
			
			if(this.options.type != 'pie' && this.options.type != 'multipie'){
				var ctx2 = oCanvas_Trial2.getContext('2d');
				ctx2.beginPath();
				ctx2.font = '14px "Arial"';
				ctx2.textAlign = 'start';
				ctx2.textBaseline = 'top';
				ctx2.fillStyle = '#959595';
				ctx2.fillText(str,this.sWidth-130,this.sHeight-20);
				ctx2.font = this.options.fontSize+'px "'+this.options.fontName+'"';
			}
			
			// Trial version ==================================================================================================
			
		};
		GLChart.prototype.setDevicePixelRatio = function( context, canvas, w, h ) {
			if (window.devicePixelRatio) {
				var w2 = w;
				var h2 = h;
				//var canvas = GLChart.$(id);
				
				canvas.width = w * window.devicePixelRatio;
				canvas.height = h * window.devicePixelRatio;
				canvas.style.width = w+'px';
				canvas.style.height = h+'px';
				context.scale(window.devicePixelRatio, window.devicePixelRatio);    
				
			}
		};
		GLChart.prototype.adjustBrightness = function (CN, CK) {
			var CM;
			var CL, CQ;
			if ( typeof CN === "object" ) {
				CM = CN.color || "#000000";
				if ( isNaN(CN.alpha) || CN.alpha == null || !typeof CN.alpha === "number" ) {
					CQ = 1;
				} else {
					CQ = CN.alpha;
				}
			} else {
				CM = CN;
				CQ = 1;
			}
			CM = CM.replace(/#/, "0x");
			CM = Number(CM);
			var CP = Math.max(Math.min(((CM >> 16) & 255) + CK, 255), 0);
			var CO = Math.max(Math.min(((CM >> 8) & 255) + CK, 255), 0);
			var e = Math.max(Math.min((CM & 255) + CK, 255), 0);
			return "rgba(" + CP + ", " + CO + ", " + e + ", " + CQ + ")";
		};
		GLChart.prototype.colorToRgba = function (color, opacity) {
			color = color.replace(/#/, "0x");
			color = parseInt(color);
			var r = Math.max(Math.min(((color >> 16) & 255), 255), 0);
			var g = Math.max(Math.min(((color >> 8) & 255), 255), 0);
			var b = Math.max(Math.min((color & 255), 255), 0);
			if (opacity != 0 &&  (isNaN(opacity) || opacity == null || !typeof opacity === "number") ) {
				opacity = 1;
			}
			return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
		};
		GLChart.prototype.setCssOpacity = function(elem, opacity){
			if(this.support_userAgent.ie){
				opacity = opacity*100;
				elem.style.filter = 'alpha(opacity='+opacity+')';
			}else{
				elem.opacity = opacity;
			}
		};
		GLChart.prototype.formatter = function(value, arg){
			var formatType = "toString";
			var fixedCnt = 0;
			if(arg == "#,##0" || arg=="\#,##0")
			{
			  formatType = "number";
			  fixedCnt = 0;
			}
			else if(arg == "#,##0.0")
			{
			  formatType = "number";
			  fixedCnt = 1;
			}
			else if(arg == "#,##0.00")
			{
			  formatType = "number";
			  fixedCnt = 2;
			}
			else if(arg == "#,##0.000")
			{
			  formatType = "number";
			  fixedCnt = 3;
			}
			else if(arg == "#,##0.0000")
			{
			  formatType = "number";
			  fixedCnt = 4;
			}
			else if(arg == "none")
			{ return value; }
			else
			{ formatType = "toDateString"; }
	  
			if(formatType == "number"){
			  return this.number(value, fixedCnt, null);
			}else if(formatType == "toDateString"){
			  return this.toDateString(value, arg, null);
			}else{
			  var fixedCnt = 0;
			  if(arg == "0.0"){
				fixedCnt = 1;
			  }else if(arg == "0.00"){
				fixedCnt = 2;
			  } 
			  return isNaN(parseFloat(value))==true? value:parseFloat(value).toFixed(fixedCnt);
			}
		};
		GLChart.prototype.number = function(value, fixedCnt, direction){  
			if( !direction )
			{
				var negativeNum = false;
				if( (''+value).slice(0,1) == '-' ){
				  negativeNum = true;
				}
				value = (''+value).replace(/-/g, "");
			  
				var Num = '' + value; // toString    
				var newNum = '';     
				var newNum2 = "";     
				var count = 0;    
				var fract = '';       
				var fractLen = fixedCnt;  //표시할 소수점이하 자리수
				  
				var inx = Num.indexOf('.');   
				if ((inx != 0) && (fractLen > 0)) {  
					Num += '.';   
				}  
				  
				var inx = Num.indexOf('.');    
				if (inx != -1) { // 소수점이 있는 경우    
					var a = Num.split(".");      
					Num = a[0];    // 정수부 
					if(fractLen == 0){  // fractLen이 지정되지 않음 
					  fract = a[1];                      // 소수부 
					}else {
					  fract = a[1].substr(0, fractLen);  // 소수부  
					}
					var fillZero = fractLen - fract.length;   
					for(var i = 0; i < fillZero; i++) {  
					  fract += '0';   
					}  
				} 
					 
				// 컴마붙이기    
				for (var i = Num.length - 1; i >= 0; i--) {     
					var ch = Num.charAt(i);     
					if (count == 3) {     
					  newNum += ",";     
					  newNum += ch;     
					  count = 1;     
					  continue;     
					} else {    
					  newNum += ch;     
					  count ++;     
					}     
				}    
						
				// 문자열 두집기    
				for (var i = newNum.length-1; i >= 0; i--)    
				{    
					var ch = newNum.charAt(i);     
					newNum2 += ch;     
				}     
					
				if(fract.length > 0) {   
					newNum2 = newNum2 + "." + fract;    
				}  
					
				if(negativeNum){
					return '-'+newNum2;
				}else{
					return newNum2;
				}
			}
			else if( direction )
			{
				  var sType = typeof value;
				  if( sType == "number" ){
					return value;
				  }else if( sType == "string" ){
					return parseFloat(value.replace(/,/g,""));
				  } 
			}        
		};
		GLChart.prototype.toDateString = function( value, args, direction ){
			if( !direction )
			{
			  //if( ! args || ! Date.parse( value ) )
			  //  return "occur error during date formatting !";
				
			  var dTemp = new Date( parseFloat(value) );
	  
			  var sYYYY = dTemp.getFullYear();
			  var sY = dTemp.getYear();
			  var sYY = this.__modifyFigures( sY, 2 );
	  
			  var sM = dTemp.getMonth() + 1;
			  var sMM = this.__modifyFigures( sM, 2 );
			  
			  var sD = dTemp.getDate();
			  var sDD = this.__modifyFigures( sD, 2 );
			  
			  var sDAY = dTemp.getDay();
			  
			  
			  var sh = dTemp.getHours();
			  var shh = this.__modifyFigures( sh, 2 );
			  
			  var sm = dTemp.getMinutes();
			  var smm = this.__modifyFigures( sm, 2 );
			  
			  var ss = dTemp.getSeconds();
			  var sss = this.__modifyFigures( ss, 2 );
			  
			  args = args.replace(/YYYY/, sYYYY);
			  args = args.replace(/YY/, sYY);
			  args = args.replace(/Y/, sY);
			  args = args.replace(/MM/, sMM);
			  args = args.replace(/M/, sM);
			  args = args.replace(/DD/, sDD);
			  args = args.replace(/D/, sD);
			  args = args.replace(/hh/, shh);
			  args = args.replace(/h/, sh);
			  args = args.replace(/mm/, smm);
			  args = args.replace(/m/, sm);
			  args = args.replace(/ss/, sss);
			  args = args.replace(/s/, ss);
			  
			  return args;
			}
			else if( direction )
			{
			  var s = args.replace(/[Y|M|D|h|m|s]/g, "").split("");
			  var reDayDel = new RegExp( "\\" + s[0], "g" );
			  var reD2TDel = new RegExp( "\\" + s[2], "g" );
			  var reTimeDel = new RegExp( "\\" + s[4], "g" );
			  
			  value = value.replace(reDayDel, "/");
			  value = value.replace(reD2TDel, ",");
			  value = value.replace(reTimeDel, ":");
			  return ( new Date( value ) );
			}
		};
		GLChart.prototype.__modifyFigures = function( iValue, iDigit ){
			if( iValue == 0 ){
			  return ( Math.pow( 10, iDigit+1 ) ).toString().substring(2);
			}
			  
			var sValue = iValue.toString();
			var iDiffDig = sValue.length - iDigit;
			if( iDiffDig >= 0 ){
			  return sValue.substring( iDiffDig )
			}else{
			  return ( iValue * Math.pow( 10, -1*iDigit ) ).toFixed(iDigit).toString().substring(2);
			} 
		};
		GLChart.prototype.legendLabel = function(ctx, x, y, font, fontStyle, textAlign, textBaseline, label){
			ctx.beginPath();
			ctx.font = this.options.legendTextStyle.style+' '+font;
			ctx.textAlign = textAlign;
			ctx.textBaseline = textBaseline;
			ctx.fillStyle = fontStyle;
			//ctx.fontStretch = "wider";
			ctx.fillText(label,x,y);
		};
		GLChart.prototype.rect = function(ctx,x,y,width,height, bgcolor, strokeStyle){
			ctx.beginPath();
			ctx.fillStyle = bgcolor;
			ctx.fillRect(x,y,width,height);
		};
		GLChart.prototype.drawLegend = function(){
			var canvas		= this.oCanvas_legend;
			var ctx 		= this.graphics_legend;
			var vo			= this.options;
			this.coordinateLegend = [];
			var legendWidth = 0;
			var lastLegendWidth = 0;
			var tempLegendWidth;
			var aTempLegendWidth = [];
			var labels		= this.aData;
			var labelsItem	= '';
			var legendTextLen = labels.length;
			var textColor 	= vo.legendTextStyle.color;
			var textName 	= vo.legendTextStyle.fontName;
			var textSize 	= vo.legendTextStyle.fontSize;
			var separation	= vo.legendBackground.separation;
			var margin		= vo.legendBackground.margin;
			var x=margin, y=margin;
			var legendHeight = (((legendTextLen-1)*(textSize+separation))-separation)+(margin*2);
			var legendHeightIdx = 1;
			var iconGap = parseFloat(vo.legendIcon.gap);
			
			
			if( ctx ){
				canvas.style.display = 'block';
			  
				if( vo.type == 'pie' || vo.type == 'multipie' ){
					for(var i=1;i<legendTextLen;i++){
						
						if(vo.legend.maxLength == 'auto'){
							labelsItem = labels[i][0];
						}else{
							if( labels[i][0].length > parseFloat(vo.legend.maxLength) ){
								labelsItem = ( labels[i][0].substring(0, parseFloat(vo.legend.maxLength)) ) + '...';
							}else{
								labelsItem = labels[i][0];
							}
						}
						
						ctx.font = textSize+'px "'+textName+'"';
						tempLegendWidth = ctx.measureText(labelsItem).width+(textSize+2)+(margin*3);
						if( legendWidth < tempLegendWidth ){
						  legendWidth = tempLegendWidth;
						}
					}
					if(vo.legend.position == 'right'){
						this.legendTop = (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
						this.legendLeft = (((this.sWidth - legendWidth)+vo.background.strokeThickness)-5)+'px';
						canvas.style.top = this.legendTop;
						canvas.style.left = this.legendLeft;
					}else if(vo.legend.position == 'right-bottom'){
						this.legendTop = (parseFloat(this.sHeight) - legendHeight) + 'px';
						this.legendLeft = (((this.sWidth - legendWidth)+vo.background.strokeThickness)-5)+'px';
						canvas.style.top = parseInt(this.legendTop,10) - (vo.background.strokeThickness+5) + 'px';
						canvas.style.left = this.legendLeft;
					}else if( vo.legend.position == 'left' ){
						this.legendTop = (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
						this.legendLeft = vo.background.strokeThickness+5+'px';
						canvas.style.top = this.legendTop;
						canvas.style.left = this.legendLeft;
					}
					canvas.width = legendWidth;
					canvas.height = legendHeight;
					this.setDevicePixelRatio(ctx, this.oCanvas_legend, legendWidth, legendHeight);
					for(var i=1;i<legendTextLen;i++){
						
						if( vo.pieSliceTextStyle.color == 'setColor' ){
							textColor = vo.pieSliceTextColors[(i-1) % vo.pieSliceTextColors.length];
						}
						
						// guide line point
						if( vo.legend.pointStyle == 'rectangle' ){		// circle, rectangle
							this.rect(ctx, x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], '');
						}else if( vo.legend.pointStyle == 'circle' ){
							var color = vo.colors[(i-1) % vo.colors.length];
							var darkColor = this.adjustBrightness(color, -45);
							ctx.beginPath();
							ctx.arc((x+(parseInt(textSize)/2)),(y+(parseInt(textSize)/2)),parseInt(textSize)/2.2,0,Math.PI*2,false);
							ctx.fillStyle = this.colorToRgba(color, vo.legendIcon.opacity);
							ctx.fill();
							ctx.strokeStyle = color;
							ctx.lineWidth = vo.legendIcon.strokeThickness;
							ctx.stroke();
							ctx.closePath();
						}else{	
							this.rect(ctx, x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], '');
						}
						
						if(vo.legend.maxLength == 'auto'){
							labelsItem = labels[i][0];
						}else{
							if( labels[i][0].length > parseFloat(vo.legend.maxLength) ){
								labelsItem = ( labels[i][0].substring(0, parseFloat(vo.legend.maxLength)) ) + '...';
							}else{
								labelsItem = labels[i][0];
							}
						}
						
						this.legendLabel(ctx, textSize+(x+3+iconGap), (y+(textSize/2)), textSize+'px "'+textName+'"', textColor, 'left', 'middle', labelsItem);
						this.coordinateLegend.push( [x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], true] );
						y += (textSize+separation);
					}
				}else{
					legendTextLen = labels[0].length;
					if( vo.legend.position == 'bottom' ){
						for(var i=1;i<legendTextLen;i++){
							
							if(vo.legend.maxLength == 'auto'){
								labelsItem = labels[0][i];
							}else{
								if( labels[0][i].length > parseFloat(vo.legend.maxLength) ){
									labelsItem = ( labels[0][i].substring(0, parseFloat(vo.legend.maxLength)) ) + '...';
								}else{
									labelsItem = labels[0][i];
								}
							}
							
							ctx.font = textSize+'px "'+textName+'"';
							tempLegendWidth = ctx.measureText(labelsItem).width+(textSize+2)+(margin*3);
							legendWidth += tempLegendWidth;
							if( legendWidth > this.sWidth-4 ){
								if( lastLegendWidth < (legendWidth-tempLegendWidth) ){
									lastLegendWidth = legendWidth-tempLegendWidth;
								}
								legendWidth = 0;
								i -= 1;
								legendHeightIdx++;
							}else{
								aTempLegendWidth.push(tempLegendWidth);
							}
							
							if( i == legendTextLen-1 ){
								if( lastLegendWidth < legendWidth ){
									lastLegendWidth = legendWidth;
								}
							}
						}
						legendHeight = (legendHeightIdx*(textSize+separation))+(margin*2);
						canvas.width = lastLegendWidth;
						canvas.height = legendHeight-separation;
						this.setDevicePixelRatio(ctx, this.oCanvas_legend, lastLegendWidth, legendHeight-separation);
						this.legendTop = (((parseFloat(this.sHeight) - legendHeight)-5)+separation) + 'px';
						this.legendLeft = (parseFloat(this.sWidth) - lastLegendWidth)/2 + 'px';
						canvas.style.top = this.legendTop;
						canvas.style.left = this.legendLeft;
						for(var i=1;i<legendTextLen;i++){
							
							if(vo.legend.maxLength == 'auto'){
								labelsItem = labels[0][i];
							}else{
								if( labels[0][i].length > parseFloat(vo.legend.maxLength) ){
									labelsItem = ( labels[0][i].substring(0, parseFloat(vo.legend.maxLength)) ) + '...';
								}else{
									labelsItem = labels[0][i];
								}
							}
							
							if( x + aTempLegendWidth[i-1] < this.sWidth ){
								//this.rect(ctx, x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], '');
								
								// guide line point
								if( vo.legend.pointStyle == 'rectangle' ){		// circle, rectangle
									this.rect(ctx, x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], '');
								}else if( vo.legend.pointStyle == 'circle' ){
									var color = vo.colors[(i-1) % vo.colors.length];
									var darkColor = this.adjustBrightness(color, -45);
									ctx.beginPath();
									ctx.arc((x+(parseInt(textSize)/2)),(y+(parseInt(textSize)/2)),parseInt(textSize)/2.2,0,Math.PI*2,false);
									ctx.fillStyle = this.colorToRgba(color, vo.legendIcon.opacity);
									ctx.fill();
									ctx.strokeStyle = color;
									ctx.lineWidth = vo.legendIcon.strokeThickness;
									ctx.stroke();
									ctx.closePath();
								}else{	
									this.rect(ctx, x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], '');
								}
								
								this.legendLabel(ctx, textSize+(x+3), y, textSize+'px "'+textName+'"', textColor, 'left', 'top', labelsItem);
								this.coordinateLegend.push( [x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], true] );
							}
							x = x + aTempLegendWidth[i-1];
							if( x > this.sWidth ){
								x=margin;
								y += (textSize+separation);
								i -= 1;
							}
						}
					}else{
						legendHeight = (((legendTextLen-1)*(textSize+separation))-separation)+(margin*2);
						for(var i=1;i<legendTextLen;i++){
							
							if(vo.legend.maxLength == 'auto'){
								labelsItem = labels[0][i];
							}else{
								if( labels[0][i].length > parseFloat(vo.legend.maxLength) ){
									labelsItem = ( labels[0][i].substring(0, parseFloat(vo.legend.maxLength)) ) + '...';
								}else{
									labelsItem = labels[0][i];
								}
							}
							
							ctx.font = textSize+'px "'+textName+'"';
							tempLegendWidth = ctx.measureText(labelsItem).width+(textSize+2)+(margin*3);
							if( legendWidth < tempLegendWidth ){
							  legendWidth = tempLegendWidth;
							}
						}
						if(vo.legend.position == 'right'){
							this.legendTop = (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
							this.legendLeft = (((this.sWidth - legendWidth)+vo.background.strokeThickness)-5)+'px';
						}else if( vo.legend.position == 'left' ){
							this.legendTop = (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
							this.legendLeft = vo.background.strokeThickness+5+'px';
							
						}
						canvas.style.top = this.legendTop;
						canvas.style.left = this.legendLeft;
						canvas.width = legendWidth;
						canvas.height = legendHeight;
						this.setDevicePixelRatio(ctx, this.oCanvas_legend, legendWidth, legendHeight);
						for(var i=1;i<legendTextLen;i++){
							
							if(vo.legend.maxLength == 'auto'){
								labelsItem = labels[0][i];
							}else{
								if( labels[0][i].length > parseFloat(vo.legend.maxLength) ){
									labelsItem = ( labels[0][i].substring(0, parseFloat(vo.legend.maxLength)) ) + '...';
								}else{
									labelsItem = labels[0][i];
								}
							}
							
							this.rect(ctx, x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], '');
							this.legendLabel(ctx, textSize+(x+3), y, textSize+'px "'+textName+'"', textColor, 'left', 'top', labelsItem);
							this.coordinateLegend.push( [x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], true] );
							y += (textSize+separation);
						}
					}
				}
				
			}
		};
		GLChart.prototype.drawLegendBubble = function(){
			var canvas		= this.oCanvas_legend;
			var ctx 		= this.graphics_legend;
			var vo			= this.options;
			this.coordinateLegend = [];
			var legendWidth = 0;
			var lastLegendWidth = 0;
			var tempLegendWidth;
			var aTempLegendWidth = [];
			var bubbleData	= this.aBubbleData;
			var labels		= this.aData;
			var legendTextLen = bubbleData.length;
			var textColor 	= vo.legendTextStyle.color;
			var textName 	= vo.legendTextStyle.fontName;
			var textSize 	= vo.legendTextStyle.fontSize;
			var separation	= vo.legendBackground.separation;
			var margin		= vo.legendBackground.margin;
			var x=margin, y=margin;
			var legendHeight = ((legendTextLen*(textSize+separation))-separation)+(margin*2);
			var legendHeightIdx = 1;
			
			
			if( ctx ){
				canvas.style.display = 'block';
			  
				if( vo.legend.position == 'bottom' ){
					for(var i=0;i<legendTextLen;i++){
						ctx.font = textSize+'px "'+textName+'"';
						tempLegendWidth = ctx.measureText(labels[0][i+1]).width+(textSize+2)+(margin*3);
						legendWidth += tempLegendWidth;
						if( legendWidth > this.sWidth-4 ){
							if( lastLegendWidth < (legendWidth-tempLegendWidth) ){
								lastLegendWidth = legendWidth-tempLegendWidth;
							}
							legendWidth = 0;
							i -= 1;
							legendHeightIdx++;
						}else{
							aTempLegendWidth.push(tempLegendWidth);
						}
						
						if( i == legendTextLen-1 ){
							if( lastLegendWidth < legendWidth ){
								lastLegendWidth = legendWidth;
							}
						}
					}
					legendHeight = (legendHeightIdx*(textSize+separation))+(margin*2);
					canvas.width = lastLegendWidth;
					canvas.height = legendHeight-separation;
					this.setDevicePixelRatio(ctx, this.oCanvas_legend, lastLegendWidth, legendHeight-separation);
					this.legendTop		= (((parseFloat(this.sHeight) - legendHeight)-5)+separation) + 'px';
					this.legendLeft		= (parseFloat(this.sWidth) - lastLegendWidth)/2 + 'px';
					canvas.style.top = this.legendTop;
					canvas.style.left = this.legendLeft;
					for(var i=0;i<legendTextLen;i++){
						if( x + aTempLegendWidth[i] < this.sWidth ){
							this.rect(ctx, x, y,textSize, textSize, vo.colors[i % vo.colors.length], '');
							this.legendLabel(ctx, textSize+(x+3), y, textSize+'px "'+textName+'"', textColor, 'left', 'top', labels[0][i+1]);
							this.coordinateLegend.push( [x, y,textSize, textSize, vo.colors[i % vo.colors.length], true] );
						}
						x = x + aTempLegendWidth[i];
						if( x > this.sWidth ){
							x=margin;
							y += (textSize+separation);
							i -= 1;
						}
					}
				}else{
					legendHeight = ((legendTextLen*(textSize+separation))-separation)+(margin*2);
					for(var i=0;i<legendTextLen;i++){
						ctx.font = textSize+'px "'+textName+'"';
						tempLegendWidth = ctx.measureText(labels[0][i+1]).width+(textSize+2)+(margin*3);
						if( legendWidth < tempLegendWidth ){
						  legendWidth = tempLegendWidth;
						}
					}
					if(vo.legend.position == 'right'){
						this.legendTop		= (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
						this.legendLeft		= (((this.sWidth - legendWidth)+vo.background.strokeThickness)-5)+'px';
					}else if( vo.legend.position == 'left' ){
						this.legendTop		= (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
						this.legendLeft		= vo.background.strokeThickness+5+'px';
					}
					canvas.style.top = this.legendTop;
					canvas.style.left = this.legendLeft;
					canvas.width = legendWidth;
					canvas.height = legendHeight;
					this.setDevicePixelRatio(ctx, this.oCanvas_legend, legendWidth, legendHeight);
					for(var i=0;i<legendTextLen;i++){
						this.rect(ctx, x, y,textSize, textSize, vo.colors[i % vo.colors.length], '');
						this.legendLabel(ctx, textSize+(x+3), y, textSize+'px "'+textName+'"', textColor, 'left', 'top', labels[0][i+1]);
						this.coordinateLegend.push( [x, y,textSize, textSize, vo.colors[(i-1) % vo.colors.length], true] );
						y += (textSize+separation);
					}
				}
				
				
			}
		};
		GLChart.prototype.touchHandler = function(event){
			var touches = event.changedTouches,
				first = touches[0],
				type = "";
				
			switch(event.type){
				case "touchstart": type = "mousedown"; break;
				case "touchmove":  type="mousemove"; break;        
				case "touchend":   type="mouseup"; break;
				default: return;
			}
	  
			//initMouseEvent(type, canBubble, cancelable, view, clickCount, 
			//           screenX, screenY, clientX, clientY, ctrlKey, 
			//           altKey, shiftKey, metaKey, button, relatedTarget);
			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1, 
									  first.screenX, first.screenY, 
									  first.clientX, first.clientY, false, 
									  false, false, false, 0/*left*/, null);
	  
			first.target.dispatchEvent(simulatedEvent);
			event.preventDefault();
		};
		GLChart.prototype.setTouchEvent = function(){
			var con = GLChart.$(this.sContainer);
			this.addEvent("touchstart", con, this.touchHandler);
			this.addEvent("touchmove", con, this.touchHandler);
			this.addEvent("touchend", con, this.touchHandler);
		};
		GLChart.prototype.setTouchEvent_Range = function(){
			var con = GLChart.$(this.sContainer+'___xRangeLayout_div');
			this.addEvent("touchstart", con, this.touchHandler);
			this.addEvent("touchmove", con, this.touchHandler);
			this.addEvent("touchend", con, this.touchHandler);
		};
		GLChart.prototype.addEvent = function( evnt, elem, func ){
			if(elem.addEventListener){  // W3C DOM
				elem.addEventListener(evnt,func,false);
			}else if(elem.attachEvent){ // IE DOM
				elem.attachEvent("on"+evnt, func);
			}
		};
		GLChart.prototype.removeEvent = function( evnt, elem, func ){
			if(elem.addEventListener){  // W3C DOM
				elem.removeEventListener(evnt,func,false);
			}else if(elem.attachEvent){ // IE DOM
				elem.detachEvent("on"+evnt, func);
			}
		};
		GLChart.prototype.getMouseXY = function(e, elem){
			
			var obj =  elem;
			var x, y;
			var userAgent = this.userAgent();
			  
			// Browser with offsetX and offsetY
			if( userAgent.ie ){
				if( arguments[2] ){
					x = e.x - elem.offsetLeft;
					y = e.y - elem.offsetTop;
				}else{
					x = e.x;
					y = e.y;
				}	
			// FF and other
			} else {
				/*
				x = e.pageX;
				y = e.pageY;
				var tmpX = 0, tmpY = 0;
				if (obj.offsetParent) {
					do {
						tmpX += obj.offsetLeft;
						tmpY += obj.offsetTop;
					} while(obj = obj.offsetParent);
				}
				x -= tmpX;
				y -= tmpY;
				*/
				if(e.offsetX){
					x = e.offsetX;
					y = e.offsetY;
				}else{
					x = e.layerX;
					y = e.layerY;
				}	
			} 
			return [x, y];
		};
		GLChart.prototype.calculateRange = function( aValue ){
			
			this.ranges = { 
				'xmin' : Number.MAX_VALUE, 'xmax' : Number.MIN_VALUE, 
				'ymin' : Number.MAX_VALUE, 'ymax' : Number.MIN_VALUE,
				'ymin2' : Number.MAX_VALUE, 'ymax2' : Number.MIN_VALUE 
			};
			
			var len = aValue.length;
			var valueLen, xVal;
			var arr = [];
			if( this.options.type == 'stackedColumn' || this.options.type == 'stackedBar' || this.options.type == 'stackedArea' ){
				len = this.aSumData.length;
				for( var i=0;i<len;i++ ){
					arr = this.aSumData;
					if(isNaN(parseFloat(arr[i]))){
						continue;
					}
					this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat(arr[i]));
					this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat(arr[i]));
				}
				
				// 멀티 스택컬럼일경우
				if( this.options.type == 'stackedColumn' && this.aSumData2.length > 0 ){
					len = this.aSumData2.length;
					for( var i=0;i<len;i++ ){
						arr = this.aSumData2;
						if(isNaN(parseFloat(arr[i]))){
							continue;
						}
						this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat(arr[i]));
						this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat(arr[i]));
					}
				}
				
				if( this.options.stack100Percent ){
					this.ranges.ymax = 100;
				}
				
			}else if( this.options.type == 'dualYCombination' ){
				
				for(var i = 1; i<len; i++) { // for every series
					arr = aValue[i];
					valueLen = arr.length;
					for(var j = 1; j < valueLen; j++) { // for value
						
						if( this.options.series[j-1]['parentYAxis'] == 'S' ){
							this.ranges.ymin2 = Math.min(this.ranges.ymin2, isNaN(parseFloat(arr[j]))? 0:parseFloat(arr[j]) );
							this.ranges.ymax2 = Math.max(this.ranges.ymax2, isNaN(parseFloat(arr[j]))? 0:parseFloat(arr[j]) );
						}else{
							this.ranges.ymin = Math.min(this.ranges.ymin, isNaN(parseFloat(arr[j]))? 0:parseFloat(arr[j]) );
							this.ranges.ymax = Math.max(this.ranges.ymax, isNaN(parseFloat(arr[j]))? 0:parseFloat(arr[j]) );
						}
						
					}
				}
				
				
				var isSecond = false;
				if( this.options.columnIsStacked ){
					var len = this.aData.length;
					var len2 = this.aData[0].length;
					for( var i=1;i<len;i++ ) {
						total = 0;
						for( var j=1;j<len2;j++ ){
							if( this.options.series[j-1].type == 'column' ){
								total += parseFloat(this.aData[i][j]);
								if( this.options.series[j-1]['parentYAxis'] == 'S' ){
									isSecond = true;
								}
							}
						}
						this.aSumData.push(total);
					}
					len = this.aSumData.length;
					for( var i=0;i<len;i++ ){
						arr = this.aSumData;
						if( !isNaN(parseFloat(arr[i])) ){
							if( isSecond ){
								this.ranges.ymin2 = Math.min(this.ranges.ymin2, parseFloat(arr[i]) );
								this.ranges.ymax2 = Math.max(this.ranges.ymax2, parseFloat(arr[i]) );
							}else{
								this.ranges.ymin = Math.min(this.ranges.ymin, parseFloat(arr[i]) );
								this.ranges.ymax = Math.max(this.ranges.ymax, parseFloat(arr[i]) );
							}
						}
					}
					
				}
			}else if( this.options.type == 'scatter' ){
				
				if( this.tempAData == null ){
					for(var i = 1; i<len; i++) { // for every series
						arr = aValue[i];
						valueLen = arr.length;
						for(var j = 1; j < valueLen; j++) { // for value
							this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat( (arr[j] || 0) ));
							this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat( (arr[j] || 0) ));
						}
					}
					// isValue일때 xmin, xmax 값 체크.
					if( this.options.xAxis.isValue ){
						for(var i = 1; i<len; i++) {
							if( isNaN(parseFloat(aValue[i][0])) ){
								this.ranges.xmin = null;
								this.ranges.xmax = null;
								break;
							}else{
								xVal = parseFloat(aValue[i][0]);
								this.ranges.xmin = Math.min(this.ranges.xmin, xVal);
								this.ranges.xmax = Math.max(this.ranges.xmax, xVal);
							}
						}
					}
				}else{
					var tempArr;
					for( var k=0;k<len;k++ ){
						tempArr = aValue[k];
						for(var i = 1, tempALen=tempArr.length; i<tempALen; i++) { // for every series
							arr = tempArr[i];
							valueLen = arr.length;
							for(var j = 1; j < valueLen; j++) { // for value
								this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat( (arr[j] || 0) ));
								this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat( (arr[j] || 0) ));
							}
						}
						
						// xmin, xmax 값 체크.
						if( this.options.xAxis.isValue ){
							for(var i = 1, tempALen=tempArr.length; i<tempALen; i++) {
								if( isNaN(parseFloat(tempArr[i][0])) ){
									this.ranges.xmin = null;
									this.ranges.xmax = null;
									break;
								}else{
									xVal = parseFloat(tempArr[i][0]);
									this.ranges.xmin = Math.min(this.ranges.xmin, xVal);
									this.ranges.xmax = Math.max(this.ranges.xmax, xVal);
								}
							}
						}
						
						
					}
				}
				
			}else if( this.options.type == 'bubble' ){
				
				this.ranges = { 
					'xmin' : 0, 'xmax' : Number.MIN_VALUE, 
					'ymin' : 0, 'ymax' : Number.MIN_VALUE,
					'ymin2' : 0, 'ymax2' : Number.MIN_VALUE,
					'rmin' : 0, 'rmax' : Number.MIN_VALUE
				};
				
				var bubbleLen = this.aBubbleData[0].x.length;
				var bubbleItemLen = this.aBubbleData.length;
				
				for(var i = 0; i<bubbleItemLen; i++) { 
					for(var j = 0; j < bubbleLen; j++) { // for value
						this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat(this.aBubbleData[i].y[j]));
						this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat(this.aBubbleData[i].y[j]));
					}
				}
				// isValue일때 xmin, xmax 값 체크.
				if( this.options.xAxis.isValue ){
					this.ranges['xmin'] = Number.MAX_VALUE;
				
					for(var i = 0; i<bubbleItemLen; i++) {
						for(var j = 0; j < bubbleLen; j++) { // for value
							if( isNaN(parseFloat(this.aBubbleData[i].x[j])) ){
								this.ranges.xmin = null;
								this.ranges.xmax = null;
								break;
							}else{
								this.ranges.xmin = Math.min(this.ranges.xmin, parseFloat(this.aBubbleData[i].x[j]));
								this.ranges.xmax = Math.max(this.ranges.xmax, parseFloat(this.aBubbleData[i].x[j]));
							}
						}
					
					}
				}
				
				for(var i = 0; i<bubbleItemLen; i++) { 
					for(var j = 0; j < bubbleLen; j++) { // for value
						this.ranges.rmin = Math.min(this.ranges.rmin,parseFloat(this.aBubbleData[i].radius[j]));
						this.ranges.rmax = Math.max(this.ranges.rmax,parseFloat(this.aBubbleData[i].radius[j]));
					}
				}
				if( this.options.bubbleMaxValue && this.options.bubbleMaxValue > this.ranges.rmax ){
					this.ranges.rmax = this.options.bubbleMaxValue;
				}
				if( this.options.bubbleXMaxValue && this.options.bubbleXMaxValue > this.ranges.xmax ){
					this.ranges.xmax = this.options.bubbleXMaxValue;
				}
				if( this.options.bubbleYMaxValue && this.options.bubbleYMaxValue > this.ranges.ymax ){
					this.ranges.ymax = this.options.bubbleYMaxValue;
				}
				
			}else if( this.options.type == 'areaRange' ){
				for(var i = 1; i<len; i++) { // for every series
					arr = aValue[i];
					valueLen = arr.length;
					for(var j = 1; j < valueLen; j++) { // for value
						this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat(arr[j]));
						this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat(arr[j]));
						
						if( this.oRangeData[aValue[0][j]] ){
							this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat(this.oRangeData[aValue[0][j]][i][0]));
							this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat(this.oRangeData[aValue[0][j]][i][1]));
						}
					}
				}
				// isValue일때 xmin, xmax 값 체크.
				if( this.options.xAxis.isValue ){
					for(var i = 1; i<len; i++) {
						if( isNaN(parseFloat(aValue[i][0])) ){
							this.ranges.xmin = null;
							this.ranges.xmax = null;
							break;
						}else{
							xVal = parseFloat(aValue[i][0]);
							this.ranges.xmin = Math.min(this.ranges.xmin, xVal);
							this.ranges.xmax = Math.max(this.ranges.xmax, xVal);
						}
					}
				}
				
				
				
			}else{
				for(var i = 1; i<len; i++) { // for every series
					arr = aValue[i];
					valueLen = arr.length;
					for(var j = 1; j < valueLen; j++) { // for value
						this.ranges.ymin = Math.min(this.ranges.ymin,parseFloat(arr[j] || 0));
						this.ranges.ymax = Math.max(this.ranges.ymax,parseFloat(arr[j] || 0));
					}
				}
				// isValue일때 xmin, xmax 값 체크.
				if( this.options.xAxis.isValue ){
					for(var i = 1; i<len; i++) {
						if( isNaN(parseFloat(aValue[i][0])) ){
							this.ranges.xmin = null;
							this.ranges.xmax = null;
							break;
						}else{
							xVal = parseFloat(aValue[i][0]);
							this.ranges.xmin = Math.min(this.ranges.xmin, xVal);
							this.ranges.xmax = Math.max(this.ranges.xmax, xVal);
						}
					}
				}
			}	
			
			if( this.options.type == 'singleYCombination' && this.options.columnIsStacked ){
			
				var len = this.aData.length;
				var len2 = this.aData[0].length;
				for( var i=1;i<len;i++ ) {
					total = 0;
					for( var j=1;j<len2;j++ ){
						if( this.options.series[j-1].type == 'column' ){
							total += parseFloat(this.aData[i][j]);
						}
					}
					this.aSumData.push(total);
				}
				len = this.aSumData.length;
				for( var i=0;i<len;i++ ){
					arr = this.aSumData;
					if( !isNaN(parseFloat(arr[i])) ){
						this.ranges.ymin = Math.min(this.ranges.ymin, parseFloat(arr[i]) );
						this.ranges.ymax = Math.max(this.ranges.ymax, parseFloat(arr[i]) );
					}
				}
			}
			
			// y축 min값 체크.
			if( this.options.type != 'areaRange' ){
			
				if(this.options.yAxis.minValue != 'auto' 
					&& (this.options.type == 'column'
					|| this.options.type == 'stackedColumn'
					|| this.options.type == 'bar'
					|| this.options.type == 'stackedBar'
					|| this.options.type == 'stackedArea'
					|| this.options.type == 'singleYCombination'
					|| this.options.type == 'dualYCombination')
				){
					if( this.ranges.ymin > 0  ) {
					  this.ranges.ymin = 0;
					}
				} 
				
				if( this.options.type == 'dualYCombination' && this.options.yAxis.minValue == 'auto' ){
					
					var len2 = this.aData[0].length;
					for( var j=1;j<len2;j++ ){
						if( this.options.series[j-1].type == 'column' && this.options.series[j-1].parentYAxis != 'S' ){
							if( this.ranges.ymin > 0  ) {
							  this.ranges.ymin = 0;
							}
							break;
						}
					}
					
				}else{
					if(this.options.type == 'column'
						|| this.options.type == 'stackedColumn'
						|| this.options.type == 'bar'
						|| this.options.type == 'stackedBar'
						|| this.options.type == 'stackedArea'
						|| this.options.type == 'singleYCombination'
						|| this.options.type == 'dualYCombination'
					){
						if( this.ranges.ymin > 0  ) {
						  this.ranges.ymin = 0;
						}
					}
				}
				
				if(this.options.yAxis2.minValue != 'auto' && this.options.type == 'dualYCombination'){
					if( this.ranges.ymin2 > 0  ) {
					  this.ranges.ymin2 = 0;
					}
				}
				if(this.options.yAxis.maxValue != 'auto'){
				
					if( !isNaN(parseFloat(this.options.yAxis.maxValue)) ){
						if( this.ranges.ymax < parseFloat(this.options.yAxis.maxValue)  ) {
						  this.ranges.ymax = parseFloat(this.options.yAxis.maxValue);
						}
					}
					
				}
			}else{
				if(this.options.yAxis.minValue != 'auto'){
				
					if( !isNaN(parseFloat(this.options.yAxis.minValue)) ){
						if( this.ranges.ymin > parseFloat(this.options.yAxis.minValue)  ) {
						  this.ranges.ymin = parseFloat(this.options.yAxis.minValue);
						}
					}
					
				}
				if(this.options.yAxis.maxValue != 'auto'){
				
					if( !isNaN(parseFloat(this.options.yAxis.maxValue)) ){
						if( this.ranges.ymax < parseFloat(this.options.yAxis.maxValue)  ) {
						  this.ranges.ymax = parseFloat(this.options.yAxis.maxValue);
						}
					}
					
				}
			}
			
			if( this.ranges.ymax == this.ranges.ymin ){
				this.ranges.ymin = 0;
			}
		};
		GLChart.prototype.calculateMargin = function( ctx ){
			if( this.graphics_grid == null ){
				return;
			}
			var vo = this.options;
			var margin = [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var x = vo.chartArea.left;
			var y = vo.chartArea.top;
			var w = this.sWidth-(margin[3]+margin[1]);
			var h = this.sHeight-(margin[0]+margin[2]);
			var xTextSize = parseInt(vo.xAxis.textStyle.fontSize, 10);
			var xTextName = vo.xAxis.textStyle.fontName;
			var yTextSize = parseInt(vo.yAxis.textStyle.fontSize, 10);
			var yTextName = vo.yAxis.textStyle.fontName;
			var y2TextSize = parseInt(vo.yAxis2.textStyle.fontSize, 10);
			var y2TextName = vo.yAxis2.textStyle.fontName;
			
			var xNTSize = parseInt(vo.xAxis.nameTextStyle.fontSize,10);
			var xNTName = vo.xAxis.nameTextStyle.fontName;
			var yNTSize = vo.yAxis.nameTextStyle.fontSize;
			var yNTName = vo.yAxis.nameTextStyle.fontName;
			var y2NTSize = vo.yAxis2.nameTextStyle.fontSize;
			var y2NTName = vo.yAxis2.nameTextStyle.fontName;
			var titleSize = vo.title==''?0:parseInt(vo.titleTextStyle.fontSize,10)+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
			if( vo.type == 'bar' || vo.type == 'stackedBar' ){
				var yNTMargin = vo.xAxis.name==''?0:xNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
				var xNTMargin = vo.yAxis.name==''?0:yNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
			}else{
				var xNTMargin = vo.xAxis.name==''?0:xNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
				var yNTMargin = vo.yAxis.name==''?0:yNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
				var y2NTMargin = vo.yAxis2.name==''?0:y2NTSize+(this.labelMargin*3);// 여백을 좀더 넓힘. *3
			}	
			
			// y1
			ctx.font = yTextSize+'px "'+yTextName+'"';
			var ytextMargin = ctx.measureText(this.yLabels[0]).width;
			
			for( var i=0,len=this.yLabels.length;i<len;i++ ){
				ytextMargin = Math.max(ytextMargin, ctx.measureText(this.yLabels[i]).width);
			}
			
			// y2
			if( vo.type == 'dualYCombination' ){
				ctx.font = y2TextSize+'px "'+y2TextName+'"';
				var y2textMargin = ctx.measureText(this.yLabels2[0]).width;
				for( var i=0,len=this.yLabels2.length;i<len;i++ ){
					y2textMargin = Math.max(y2textMargin, ctx.measureText(this.yLabels2[i]).width);
				}
			}
			if( vo.type == 'bar' || vo.type == 'stackedBar' ){
				var yTextMax = 0;
				
				// maxLength
				if( this.options.xAxis.maxLength != 'auto' ){
					var maxLength = parseInt(this.options.xAxis.maxLength,10) || 100;
					for( var i=0,len=this.xLabels.length;i<len;i++ ){
						yTextMax = Math.max(yTextMax, ctx.measureText(this.xLabels[i].substring(0, maxLength)+'...').width);
					}
				}else{
					for( var i=0,len=this.xLabels.length;i<len;i++ ){
						yTextMax = Math.max(yTextMax, ctx.measureText(this.xLabels[i]).width);
					}
				}
				
				
				ytextMargin = yTextMax;
			}
			x = (x+ytextMargin)+this.labelMargin;
			w = (w-ytextMargin-yNTMargin)-this.labelMargin;
			// y2더하기
			if( vo.type == 'dualYCombination' ){
				w = (w-y2textMargin-y2NTMargin)-this.labelMargin;
			}
			h = (h-xTextSize-titleSize)-this.labelMargin;
			if( vo.type == 'bar' || vo.type == 'stackedBar' ){
				if( vo.yAxis.slantedText ){
					var textMax = 0;
					var resultSize = 0;
					ctx.font = xTextSize+'px "'+xTextName+'"';
					for( var i=0,len=this.yLabels.length;i<len;i++ ){
						textMax = Math.max(textMax, ctx.measureText(this.yLabels[i]).width);
					}
					resultSize = textMax * Math.sin(parseInt(vo.yAxis.slantedTextAngle,10) * (Math.PI/180));
					h -= parseInt(resultSize,10);
				}
			}else{
				if( vo.xAxis.slantedText ){
					var textMax = 0;
					var resultSize = 0;
					ctx.font = xTextSize+'px "'+xTextName+'"';
					for( var i=0,len=this.xLabels.length;i<len;i++ ){
						textMax = Math.max(textMax, ctx.measureText(this.xLabels[i]).width);
					}
					resultSize = textMax * Math.sin(parseInt(vo.xAxis.slantedTextAngle,10) * (Math.PI/180));
					h -= parseInt(resultSize,10);
				}
			}
			
			// title, xName, yName size 구하기
			x = x+yNTMargin;
			y = y+titleSize;
			h = h-xNTMargin;
			
			if( this.options.xRange.on ){
				var previewH = (vo.xRange.preview.on)? vo.xRange.preview.height : 0;
				h = h-(vo.xRange.handlesStyle.height+previewH);
			}
			
			this.calculatedMargins.x = x;
			this.calculatedMargins.y = y;
			this.calculatedMargins.w = w;
			this.calculatedMargins.h = h;
		};
		GLChart.prototype.calculateMarginRadar = function( ctx ){
			if( this.graphics_grid == null ){
				return;
			}
			var vo = this.options;
			var margin = [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var x = vo.chartArea.left;
			var y = vo.chartArea.top;
			var w = this.sWidth-(margin[3]+margin[1]);
			var h = this.sHeight-(margin[0]+margin[2]);
			var xTextSize = parseInt(vo.xAxis.textStyle.fontSize, 10);
			var xTextName = vo.xAxis.textStyle.fontName;
			var yTextSize = parseInt(vo.yAxis.textStyle.fontSize, 10);
			var yTextName = vo.yAxis.textStyle.fontName;
			
			var xNTSize = parseInt(vo.xAxis.nameTextStyle.fontSize,10);
			var xNTName = vo.xAxis.nameTextStyle.fontName;
			var yNTSize = parseInt(vo.yAxis.nameTextStyle.fontSize,10);
			var yNTName = vo.yAxis.nameTextStyle.fontName;
			var titleSize = vo.title==''?0:parseInt(vo.titleTextStyle.fontSize,10)+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
			
			var center, diameter;
			
			// x
			ctx.font = xTextSize+'px "'+xTextName+'"';
			var xtextMargin = ctx.measureText(this.xLabels[0]).width;
			for( var i=0,len=this.xLabels.length;i<len;i++ ){
				xtextMargin = Math.max(xtextMargin, ctx.measureText(this.xLabels[i]).width);
			}
			
			x = (x+xtextMargin)+this.labelMargin;
			y = y+titleSize+xTextSize+this.labelMargin;
			w = w-((xtextMargin*2)+(this.labelMargin*2));
			h = (h-(xTextSize*2)-titleSize)-(this.labelMargin*2);
			diameter = Math.min(w,h);
			if( w > h ){
				center = [x+(w/2), y+(diameter/2)];
			}else{
				center = [x+(diameter/2), y+(h/2)];
			}	
			
			
			this.calculatedMargins.x = x;
			this.calculatedMargins.y = y;
			this.calculatedMargins.w = w;
			this.calculatedMargins.h = h;
			this.calculatedMargins.diameter = diameter;
			this.calculatedMargins.center = center;
		};
		GLChart.prototype.createLabels = function( d, count, minValue, type ){
			var max=0, min=0, vo = this.options;
			count = count <= 1?2:count;	// minimum count 2.
			
			if( (type == 'bottom' && vo.xAxis.isValue == false && vo.xAxis.showTextEvery == 'auto') || (type == 'bottom' && this.ranges.xmin == null) ){
				var xCount = d.length;
				var xlabels = [];
				var ctx = this.graphics_grid;
				var nTextW = 0;
				this.xLabelWidth = 0;
				for( var i = 1; i < xCount; i++ ){
					nTextW = (ctx.measureText(''+d[i][0]).width+parseInt(this.options.xAxis.textStyle.fontSize,10)) + parseInt(this.options.xAxis.labelGap,10);
					this.xLabelWidth = (this.xLabelWidth < nTextW)? nTextW:this.xLabelWidth;
					xlabels.push(''+d[i][0]);
				} 
				this.xLabels = xlabels;
				return;
			}
			
			if( (type == 'bottom' && vo.xAxis.isValue == false) || (type == 'bottom' && this.ranges.xmin == null) ){
				var xCount = d.length;
				var xlabels = [];
				for( var i = 1; i < xCount; i++ ){
						xlabels.push(''+d[i][0]);
				} 
				this.xLabels = xlabels;
				return;
			}
			
			if( type == "left" ){
				min = this.ranges.ymin;
				max = this.ranges.ymax;
			}else if( type == 'right' ){
				min = this.ranges.ymin2;
				max = this.ranges.ymax2;
			}else if( type == 'bottom' ){
				min = this.ranges.xmin;
				max = this.ranges.xmax;
			}
			  
			if(minValue != 'auto'){
				min = (minValue < min)? parseFloat(minValue):min;
			}
			var gap = this.getMinMaxGap(min, max, count);
			var steps = Math.round((max - min) / gap);  // y축을 나눌 개수.
			  
			// min, max, steps(다시설정)**********************************
			max = ((Math.ceil(max / gap)*100) * gap)/100;
			min = ((Math.floor(min / gap)*100) * gap)/100;
			if(isNaN(max)){ max = 0;}
			if(isNaN(min)){ min = 0;}
			steps = Math.abs(max - min) / gap;
			if(isNaN(steps)){ steps = 0;}
			// min, max, steps(다시설정)**********************************
			  
			var labels = [], labelValue = '';
			for( var i = 0; i < (steps+1); i++ ) {
				if( type == "left" ) {
					labelValue = ''+this.formatter(((max*100) - (gap*100) * i)/100,vo.yAxis.format);
					labels.push(vo.yAxis.prefix+labelValue+vo.yAxis.suffix);
				}else if( type == "right" ) {
					labelValue = ''+this.formatter(((max*100) - (gap*100) * i)/100,vo.yAxis2.format);
					labels.push(vo.yAxis2.prefix+labelValue+vo.yAxis2.suffix);
				}else if( type == "bottom" ) {
					labelValue = ''+this.formatter(((min*100) + (gap*100) * i)/100,vo.xAxis.format);
					labels.push(labelValue);
				} 
			}
			  
			if( type == "left" ){
				this.ranges.ymin = min;
				this.ranges.ymax = max;
				this.yLabels = labels;
			}else if( type == "right" ){
				this.ranges.ymin2 = min;
				this.ranges.ymax2 = max;
				this.yLabels2 = labels;
			}else if( type == "bottom" ){
				this.ranges.xmin = min;
				this.ranges.xmax = max;
				this.xLabels = labels;
			}
		};
		GLChart.prototype.getMinMaxGap = function(min, max, num){
			if(num == 0){ num = 1;}
			var re = (parseFloat(max)-parseFloat(min)) / parseFloat(num);
			var aNumber = re.toExponential(0).toString().split("e"); 
			var iDigit = parseInt(aNumber[1]); 
			var fSeedValue =  parseInt(aNumber[0]).toFixed(1); 
			var aDims = [0.5, 1.5, 3.5, 7.5]; 
			var adims = [0, 1, 2, 5, 10];
			var iIndex = 0; 
			for( var i = 0; i < 4; i++ ){ 
				if( fSeedValue <= aDims[i] ){
				  break; 
				}else{
				  iIndex ++; 
				} 
			}
			return adims[iIndex] * Math.pow(10, iDigit); 
		};
		GLChart.prototype._drawUpArrow = function( ctx, x,y,w,h, pointSize, color, lineWidth, lineColor, top, left ){
			ctx.beginPath();
			//ctx.lineWidth = lineWidth;
			
			pointSize = pointSize*2;
			
			starHeight = y+parseInt(top,10);
			ctx.moveTo(x-0.5, starHeight+(pointSize/1.6));
			ctx.lineTo(x + (pointSize/2)-0.5, starHeight+0.5);
			ctx.lineTo(x + pointSize-0.5, starHeight+(pointSize/1.7));
			ctx.lineTo(x + (pointSize-(pointSize/4)-0.5), starHeight+(pointSize/1.7));
			ctx.lineTo(x + (pointSize-(pointSize/4)-0.5), starHeight + pointSize-1 );
			ctx.lineTo(x + (pointSize / 4)-0.5, starHeight + pointSize-1 );
			ctx.lineTo(x + (pointSize / 4)-0.5, starHeight+(pointSize/1.7) );
			ctx.lineTo(x, starHeight+(pointSize/1.7));
			
			ctx.closePath();
			ctx.fillStyle = color;
			//ctx.strokeStyle = lineColor;
			ctx.fill();
			//ctx.stroke();
			ctx.lineWidth = 1;
			
		};
		GLChart.prototype._drawDownArrow = function( ctx, x,y,w,h, pointSize, color, lineWidth, lineColor, top, left ){
			ctx.beginPath();
			//ctx.lineWidth = lineWidth;
			
			pointSize = pointSize*2;
			
			starHeight = y+parseInt(top,10);
			
			ctx.moveTo(x + (pointSize / 4)-0.5, starHeight+2 );
			ctx.lineTo(x + (pointSize-(pointSize/4)-0.5), starHeight+2);
			ctx.lineTo(x + (pointSize-(pointSize/4)-0.5), starHeight+(pointSize/1.6));
			ctx.lineTo(x + pointSize-0.5, starHeight+(pointSize/1.6));
			ctx.lineTo(x + (pointSize/2)-0.5, starHeight + pointSize+1);
			ctx.lineTo(x-0.5, starHeight+(pointSize/1.6));
			ctx.lineTo(x + (pointSize / 4)-0.5, starHeight+(pointSize/1.6));
			ctx.lineTo(x + (pointSize / 4)-0.5, starHeight+2);
			
			ctx.closePath();
			ctx.fillStyle = color;
			//ctx.strokeStyle = lineColor;
			ctx.fill();
			//ctx.stroke();
			ctx.lineWidth = 1;
			
		};
		GLChart.prototype.drawTooltip = function( e, aSelect, mouseXY, gap, down ){
			var canvas		= this.oCanvas_tooltip;
			var ctx 		= this.graphics_tooltip;
			var vo			= this.options;
			var tooltipWidth= 0;
			var tempTooltipWidth;
			var labels		= this.aData;
			var tooltipTextLen = labels.length;
			var titleColor 	= vo.tooltipTitleTextStyle.color;
			var titleName 	= vo.tooltipTitleTextStyle.fontName;
			var titleSize 	= vo.tooltipTitleTextStyle.fontSize;
			var titleStyle 	= vo.tooltipTitleTextStyle.fontStyle;
			var titlePrefix = vo.tooltipTitleTextStyle.prefix;
			var titleSuffix	= vo.tooltipTitleTextStyle.suffix;
			var textColor 	= vo.tooltipTextStyle.color;
			var textName 	= vo.tooltipTextStyle.fontName;
			var textSize 	= vo.tooltipTextStyle.fontSize;
			var textStyle 	= vo.tooltipTextStyle.fontStyle;
			var textPrefix 	= vo.tooltipTextStyle.prefix;
			var textSuffix	= vo.tooltipTextStyle.suffix;
			var separation	= vo.tooltipBackground.separation;
			var margin		= vo.tooltipBackground.margin;
			
			var iconSeparation = vo.tooltipIcon.separation;
			var iconSize	   = vo.tooltipIcon.size;
			
			var x=margin, y=margin;
			var tooltipHeight = ((textSize+titleSize)+separation)+(margin*2);
			var val = '';
			var xVal = '';
			var val_percentage = '';
			var tooltipTitleText = titlePrefix + labels[0][aSelect[1]+1] + titleSuffix;
			
			if( ctx ){
				canvas.style.display = 'block';
				
				if( vo.tooltipIcon.on ){
					x = x+iconSize+iconSeparation;
				}
				
				if( vo.type == 'pie' ){
					tooltipTitleText = titlePrefix + labels[aSelect[0]+1][0] + titleSuffix;
					val_percentage = ((labels[aSelect[0]+1][1] * 100) / this.aSumData).toFixed(1) + '%';
				}else if( vo.type == 'multipie' ){
					tooltipTitleText = titlePrefix + labels[aSelect[0]+1][0] + titleSuffix;
					val_percentage = ((labels[aSelect[0]+1][aSelect[1]+1] * 100) / this.aSumData[aSelect[1]]).toFixed(1) + '%';
				}else if( vo.type == 'line' || vo.type == 'area' ){
					tooltipTitleText = titlePrefix + labels[aSelect[0]+1][0] + titleSuffix;
				}
				
				if( vo.tooltipText == 'value' ){
					val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
					tooltipHeight = textSize+(margin*2);
				}else if( vo.tooltipText == 'xAxis-label' ){
					val = this.xLabels[aSelect[0]];
					tooltipHeight = ((textSize+titleSize)+separation)+(margin*2);
				}else if( vo.tooltipText == 'yAxis-label' ){
					val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
					tooltipHeight = ((textSize+titleSize)+separation)+(margin*2);
				}else if( vo.tooltipText == 'xyAxis-label' ){
					val = this.xLabels[aSelect[0]] + ', ';
					val += this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
					tooltipHeight = ((textSize+titleSize)+separation)+(margin*2);
				}else if( vo.tooltipText == 'percentage' ){
					val = val_percentage;
				}else if( vo.tooltipText == 'all' ){
					if( val_percentage == '' ){
						val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
					}else{
						val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0")+' ('+val_percentage+')';
					}	
				}
				
				if( vo.xAxis.tooltipLabel && vo.xAxis.tooltipLabel.constructor == Array ){
					tooltipTitleText = vo.xAxis.tooltipLabel[aSelect[0]]?titlePrefix + vo.xAxis.tooltipLabel[aSelect[0]] + titleSuffix : tooltipTitleText;
				}else if( vo.yAxis.tooltipLabel && vo.yAxis.tooltipLabel.constructor == Array ){
					val = vo.yAxis.tooltipLabel[aSelect[0]]?vo.yAxis.tooltipLabel[aSelect[0]]:val;
				}else if( vo.yAxis2.tooltipLabel && vo.yAxis2.tooltipLabel.constructor == Array ){
					val = vo.yAxis2.tooltipLabel[aSelect[0]]?vo.yAxis2.tooltipLabel[aSelect[0]]:val;
				}
				
				val = textPrefix + val + textSuffix;
				
				ctx.font = titleStyle+' '+titleSize+'px "'+titleName+'"';
				tooltipWidth = ctx.measureText(tooltipTitleText).width+(margin*2);
				ctx.font = textStyle+' '+textSize+'px "'+textName+'"';
				tempTooltipWidth = ctx.measureText(val).width+(margin*2)+2;
				if( tooltipWidth < tempTooltipWidth ){
					tooltipWidth = tempTooltipWidth;
				}
				
				if( vo.tooltipText == 'value' || vo.tooltipText == 'xAxis-label' ){
					tooltipWidth = tempTooltipWidth;
				}
				
				if( vo.tooltipIcon.on ){
					tooltipWidth = tooltipWidth+iconSize+iconSeparation;
				}
				
				if( vo.type == 'scatter' ){
					tooltipHeight = (((textSize*2)+titleSize)+(separation*2))+(margin*3);
				
					xVal = textPrefix + labels[aSelect[0]+1][0] + textSuffix;
					tempTooltipWidth = ctx.measureText(xVal).width+(margin*2)+5;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					if( vo.tooltipIcon.on ){
						tooltipWidth = tooltipWidth+iconSize+iconSeparation;
					}
				}
				if( vo.type == 'bubble' ){
					labels = this.aBubbleData;
					//tooltipHeight = ((textSize*3)+(separation*2))+(margin*3);
					tooltipHeight = (((textSize*3)+titleSize)+(separation*2))+(margin*4);
				
					xVal = 'x: '+ textPrefix + labels[aSelect[1]].x[aSelect[0]] + textSuffix;
					val = 'y: '+this.formatter(labels[aSelect[1]].y[aSelect[0]], "#,##0");
					var val2 = 'radius: '+this.formatter(labels[aSelect[1]].radius[aSelect[0]], "#,##0");
					tempTooltipWidth = ctx.measureText(xVal).width+(margin*2)+5;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					tempTooltipWidth = ctx.measureText(val).width+(margin*2)+5;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					tempTooltipWidth = ctx.measureText(val2).width+(margin*2)+5;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					
					if( vo.tooltipIcon.on ){
						tooltipWidth = tooltipWidth+iconSize+iconSeparation;
					}
				}else if( vo.type == 'singleYCombination' && vo.tooltipText == 'all' ){
					// original
					//tooltipHeight = (((textSize*2)+titleSize)+(separation*2))+(margin*2);
					// shinhan project type=======
					tooltipHeight = (((titleSize*2)+textSize)+(separation*2))+(margin*2);
					
					xVal = labels[aSelect[0]+1][0];
					
					tempTooltipWidth = tooltipTitleText;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					tempTooltipWidth = ctx.measureText(xVal).width+(margin*2)+5;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					tempTooltipWidth = ctx.measureText(val).width+(margin*2)+5;
					if( tooltipWidth < tempTooltipWidth ){
						tooltipWidth = tempTooltipWidth;
					}
					
					if( vo.tooltipIcon.on ){
						tooltipWidth = tooltipWidth+iconSize+iconSeparation;
					}
				}
				
				if(this.support_userAgent.ie){
					tooltipWidth = tooltipWidth + margin;
				}
				
				if( tooltipWidth+(mouseXY[0]+(gap*2)) > this.sWidth ){
					canvas.style.left = ((mouseXY[0]-(gap*2))-tooltipWidth)+'px';
				}else{
					canvas.style.left = mouseXY[0]+'px';
				}
				canvas.style.top = ((mouseXY[1]-tooltipHeight) <= 0? 0:(mouseXY[1]-tooltipHeight))+'px';
				canvas.width = tooltipWidth;
				canvas.height = tooltipHeight;
				this.setDevicePixelRatio(ctx, this.oCanvas_tooltip, tooltipWidth, tooltipHeight);
				
				var tooltipStrokeOpacity = (vo.tooltipBackground.strokeThickness == 0)? 0:1;
				var tooltipStroke = this.colorToRgba(vo.tooltipBackground.strokeColor, tooltipStrokeOpacity);
				
				this._roundedRect( ctx, 0, 0,tooltipWidth,tooltipHeight, parseInt(vo.tooltipBackground.cornerRadius,10), tooltipStroke, true, true, true, true, vo.tooltipBackground.strokeThickness);
				ctx.lineWidth = vo.tooltipBackground.strokeThickness;
				if(down){
					ctx.fillStyle = this.colorToRgba(vo.tooltipBackground.downValueFill, vo.tooltipBackground.opacity);
				}else{
					if(vo.tooltipBackground.fill == '' || vo.tooltipBackground.fill == null || vo.tooltipBackground.fill == undefined){
						if( vo.type == 'pie' || vo.type == 'multipie' ){
							ctx.fillStyle = this.colorToRgba(vo.colors[aSelect[0] % vo.colors.length], vo.tooltipBackground.opacity);
						}else{
							ctx.fillStyle = this.colorToRgba(vo.colors[aSelect[1] % vo.colors.length], vo.tooltipBackground.opacity);
						}
					}else{
						ctx.fillStyle = this.colorToRgba(vo.tooltipBackground.fill, vo.tooltipBackground.opacity);
					}	
				}
				ctx.fill();
				
				if(vo.tooltipBackground.strokeThickness != 0){
					ctx.stroke();
				}
				ctx.lineWidth = 1.5;
				
				if( vo.type == 'scatter' ){
					this.legendLabel(ctx, x, y, titleStyle+' '+titleSize+'px "'+titleName+'"', titleColor, 'left', 'top', tooltipTitleText);
					this.legendLabel(ctx, x, (y+titleSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', xVal);
					this.legendLabel(ctx, x, (y+titleSize+separation+textSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
				}else if( vo.type == 'singleYCombination' && vo.tooltipText == 'all' ){
					// original
					//this.legendLabel(ctx, x, y, titleStyle+' '+titleSize+'px "'+titleName+'"', titleColor, 'left', 'top', tooltipTitleText);
					//this.legendLabel(ctx, x, (y+titleSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', xVal);
					//this.legendLabel(ctx, x, (y+titleSize+separation+textSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
					// shinhan project type=======
					this.legendLabel(ctx, x+((tooltipWidth-(margin*2))/2), y, titleStyle+' '+titleSize+'px "'+titleName+'"', titleColor, 'center', 'top', xVal);
					this.legendLabel(ctx, x+((tooltipWidth-(margin*2))/2), (y+titleSize+separation), titleSize+' '+titleSize+'px "'+textName+'"', textColor, 'center', 'top', tooltipTitleText);
					this.legendLabel(ctx, x+((tooltipWidth-(margin*2))/2), (y+titleSize+separation+titleSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'center', 'top', val);
					
				}else if( vo.type == 'bubble' ){
					this.legendLabel(ctx, x, y, titleStyle+' '+titleSize+'px "'+titleName+'"', titleColor, 'left', 'top', tooltipTitleText);
					this.legendLabel(ctx, x, (y+titleSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', xVal);
					this.legendLabel(ctx, x, (y+titleSize+separation+textSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
					this.legendLabel(ctx, x, (y+titleSize+separation+textSize+separation+textSize+separation)
										, textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val2);
				}else{
					if( vo.tooltipText == 'value' ){
						this.legendLabel(ctx, x, y, textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
					}else{
						this.legendLabel(ctx, x, y, titleStyle+' '+titleSize+'px "'+titleName+'"', titleColor, 'left', 'top', tooltipTitleText);
						this.legendLabel(ctx, x, (y+titleSize+separation), textStyle+' '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
					}
				}
				
				if( vo.tooltipIcon.on ){
					if(down){
						this._drawDownArrow(
											ctx
											,x-iconSize-iconSeparation
											,y
											,iconSize
											,iconSize
											,vo.tooltipIcon.size
											,vo.tooltipIcon.fill
											,vo.tooltipIcon.strokeThickness
											,vo.tooltipIcon.strokeColor
											,vo.tooltipIcon.top
											,vo.tooltipIcon.left
										);
					}else{
						this._drawUpArrow(
											ctx
											,x-iconSize-iconSeparation
											,y
											,iconSize
											,iconSize
											,vo.tooltipIcon.size
											,vo.tooltipIcon.fill
											,vo.tooltipIcon.strokeThickness
											,vo.tooltipIcon.strokeColor
											,vo.tooltipIcon.top
											,vo.tooltipIcon.left
										);
					}
				}
			}
		};
		GLChart.prototype.drawTooltipPoint = function(aSelect, aColorIdx, down){
			if( !this.options.tooltip ){return;}
		
			// 원그리기**********************************************************
			var ctx = this.graphics_event;
			var vo = this.options;
			var xx = this.coordinate[aSelect[1]][aSelect[0]].x;
			var yy = this.coordinate[aSelect[1]][aSelect[0]].y; 
			var w = this.coordinate[aSelect[1]][aSelect[0]].width; 
			var h = this.coordinate[aSelect[1]][aSelect[0]].height; 
			if( vo.isDownValueColors && down ){
				var color = vo.downValueColors[aSelect[1] % vo.downValueColors.length];
			}else{
				var color = vo.colors[aSelect[1] % vo.colors.length];
			}
			var pointSize = 5;
			
			if( vo.type == 'column' || vo.type == 'stackedColumn' || vo.type == 'singleYCombination'|| vo.type == 'dualYCombination' ){
				xx = xx+(w/2)+0.5;
				yy = yy+h;
				color = vo.colors[aSelect[0] % vo.colors.length];
				pointSize = 4;
				if( vo.is3D ){
					yy += this.bottom3DGap/2;
				}
			}else if( vo.type == 'bar' || vo.type == 'stackedBar' ){
				xx = xx+w+0.5;
				yy = yy+(h/2);
				color = vo.colors[aColorIdx[0] % vo.colors.length];
				
				if( vo.barEachItem.on == true ){
					color = vo.colors[aColorIdx[1] % vo.colors.length];
				}
				
				pointSize = 4;
				if( vo.is3D ){
					xx -= this.bottom3DGap/4;
					yy += this.bottom3DGap/4;
				}
			}else if( vo.type == 'bubble' ){
				pointSize = (w/2)+2;
			}
			
			//ctx.clearRect(0,0,this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_event, ctx, this.sWidth, this.sHeight);
			
			if( vo.type == 'bubble' ){
				/*
				color = this.adjustBrightness(color, 50);
				ctx.beginPath();
				ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.arc(xx,yy,pointSize+3,0,Math.PI*2,false);
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.closePath();
				*/
				color = this.colorToRgba(color, 0.5);
				ctx.beginPath();
				ctx.arc(xx,yy,pointSize+1,0,Math.PI*2,false);
				ctx.strokeStyle = color;
				ctx.lineWidth = 8;
				ctx.stroke();
				ctx.closePath();
				
			}else{
				ctx.beginPath();
				ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.arc(xx,yy,pointSize-1,0,Math.PI*2,false);
				ctx.fillStyle = "#ffffff";
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				ctx.arc(xx,yy,1,0,Math.PI*2,false);
				ctx.strokeStyle = color;
				ctx.lineWidth = 1.5;
				ctx.stroke();
				ctx.closePath();
			}
		};
		GLChart.prototype.drawTooltipPointLine = function(e, mx, my){
			if( !this.options.tooltip ){return;}
			
			var ctx = this.graphics_event;
			var vo = this.options;
			// draw line ********************************************************
			var gx = this.calculatedMargins.x;
			var gy = this.calculatedMargins.y;
			var gw = this.calculatedMargins.w+this.calculatedMargins.x;
			var gh = this.calculatedMargins.h+this.calculatedMargins.y;
			//ctx.clearRect(0,0,this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_event, ctx, this.sWidth, this.sHeight);
			if( e.type =='mousemove' || e.type == 'mousedown' ){
				if( mx > gx && mx < gw && my > gy && my < gh  ){
					if( vo.pointerGuideLine.on && vo.pointerGuideLine.verticalLine ){
						this._drawLine(ctx, mx-0.5, gy, mx-0.5, gh, 'butt', vo.pointerGuideLine.strokeThickness, this.colorToRgba(vo.pointerGuideLine.strokeColor, vo.pointerGuideLine.opacity));
					}
					if( vo.pointerGuideLine.on && vo.pointerGuideLine.horizontalLine ){
						this._drawLine(ctx, gx, my-0.5, gw, my-0.5, 'butt', vo.pointerGuideLine.strokeThickness, this.colorToRgba(vo.pointerGuideLine.strokeColor, vo.pointerGuideLine.opacity));
					}
					
					this.setPointerGuideLineLabel(ctx, vo, e, mx, my, gx, gy, gw-gx, gh-gy);
					
				}
			}
		
		};
		GLChart.prototype.setPointerGuideLineLabel = function(ctx, vo, e, mx, my, gx, gy, gw, gh){
			
			var textColor 	= vo.pointerGuideLineLabelTextStyle.color;
			var textName 	= vo.pointerGuideLineLabelTextStyle.fontName;
			var textSize 	= vo.pointerGuideLineLabelTextStyle.fontSize;
			var margin		= vo.pointerGuideLineLabelBackground.margin; 
			var sy			= my + ((textSize+(margin*2))/2);
			var textWidth	= 0;
			var textHeight	= textSize+(margin*2);
			var valSum 		= 0;
			var val			= 0;
			var tooltipVal	= "";
			var aTooltipXY	= [];
			var oTooltipSize = {x:0, y:0, w:0, h:0};
			var topMove		= false;
			
			if( vo.pointerGuideLine.on && vo.pointerGuideLine.horizontalLine ){
				var ymin = parseFloat(this.yLabels[this.yLabels.length-1].replace(/,/g,''));
				var ymax = parseFloat(this.yLabels[0].replace(/,/g,''));
				var min = ymin < 0 ? Math.abs(ymin):ymin;
				var max = ymax < 0 ? Math.abs(ymax):ymax;
				if( ymin < 0 && ymax < 0 ){
					valSum = min - max;
				}else if( ymin < 0 && ymax >= 0 ){
					valSum = min + max;
				}else{
					valSum = max - min;
				}
				
				val = this.formatter(parseInt((valSum * (gh-(my-gy))) / gh, 10),vo.yAxis.format);
				textWidth = ctx.measureText(val).width;
				
				this._drawRect(ctx, gx-textWidth-(margin*2), sy, gx, sy, textSize+(margin*2)+1, 'butt');
				ctx.fillStyle = vo.pointerGuideLineLabelBackground.fill;
				ctx.fill();
				this.legendLabel(ctx, gx-margin, my, textSize+'px "'+textName+'"', textColor, 'right', 'middle', val);
				
			}
			if( vo.pointerGuideLine.on && vo.pointerGuideLine.verticalLine ){
				var xLen = this.xLabels.length-1;
				var step = vo.type=='line'?gw / (xLen+1) : gw / xLen;
				var xLabelCenterVal = vo.type=='line'?step : step/2;
				var currCursor = (mx-gx)/step;
				var sy	= gh+gy+textSize+(margin*2);
				var sx	= 0;
				
				if( (mx-gx)%step > xLabelCenterVal ){
					currCursor = parseInt(currCursor,10)+1;
				}else{
					currCursor = parseInt(currCursor,10);
				}
				val = this.xLabels[currCursor];
				
				textWidth = ctx.measureText(val).width;
				sx	= mx-((textWidth+(margin*2))/2);
				
				if( vo.theme.tooltipStyle == 3 ){
					this._drawRect(ctx, sx-1, vo.chartArea.top, sx+textWidth+(margin*2), vo.chartArea.top, textSize+(margin*2), 'butt');
					ctx.fillStyle = vo.pointerGuideLineLabelBackground.fill;
					ctx.fill();
					if( vo.pointerGuideLineLabelBackground.strokeThickness != 0 ){
						ctx.strokeStyle = vo.pointerGuideLineLabelBackground.strokeColor;//strokeThickness'#aeb1b9';
						ctx.stroke();
					}
					this.legendLabel(ctx, sx+margin, vo.chartArea.top-(margin/2), textSize+'px "'+textName+'"', textColor, 'left', 'bottom', val);
				}else{
					this._drawRect(ctx, sx-1, sy, sx+textWidth+(margin*2), sy, textSize+(margin*2), 'butt');
					ctx.fillStyle = vo.pointerGuideLineLabelBackground.fill;
					ctx.fill();
					this.legendLabel(ctx, sx+margin, sy-margin, textSize+'px "'+textName+'"', textColor, 'left', 'bottom', val);
				}
				
				
				for( var i=0, coorLen=this.coordinate.length; i<coorLen; i++ ){
					var xx = this.coordinate[i][currCursor].x;
					var yy = this.coordinate[i][currCursor].y; 
					var color = vo.colors[i % vo.colors.length];
					
					tooltipVal = vo.tooltipTextStyle.prefix + this.formatter(this.aData[currCursor+1][i+1], vo.yAxis.format) + vo.tooltipTextStyle.suffix;
					textWidth = ctx.measureText(tooltipVal).width;
					if( (xx+10)+textWidth+(margin*2) > this.sWidth ){
						aTooltipXY.push([(xx-10)-(textWidth+(margin*2)), yy-(textHeight/2), textWidth+(margin*2), color, tooltipVal, textHeight]);
					}else{
						aTooltipXY.push([xx+10, yy-(textHeight/2), textWidth+(margin*2), color, tooltipVal, textHeight]);
					}
					
					oTooltipSize.x = aTooltipXY[i][0];
					oTooltipSize.y = aTooltipXY[i][1];
					oTooltipSize.w = aTooltipXY[i][2];
					oTooltipSize.h = textHeight;
					
					if( i > 0 ){
						for( var j=0, aTLen=aTooltipXY.length; j<aTLen-1; j++ ){
							
							if( aTooltipXY[j][1] <= aTooltipXY[i][1] && aTooltipXY[i][1] <= (aTooltipXY[j][1]+textHeight) ){
								aTooltipXY[i][1] = aTooltipXY[j][1] - textHeight;
							}else if( aTooltipXY[j][1] <= (aTooltipXY[i][1]+textHeight) && (aTooltipXY[i][1]+textHeight) <= (aTooltipXY[j][1]+textHeight) ){
								aTooltipXY[i][1] = aTooltipXY[j][1] - textHeight;
							}
							
						}
						
					}
				}
				
				var topGap = aTooltipXY[coorLen-1][1];
				if( topGap < 0 ){
					topMove = true;
				}
				
				
				// 원그리기**********************************************************
				for( var i=0, coorLen=this.coordinate.length; i<coorLen; i++ ){
					var xx = this.coordinate[i][currCursor].x;
					var yy = this.coordinate[i][currCursor].y; 
					var w = this.coordinate[i][currCursor].width; 
					var h = this.coordinate[i][currCursor].height; 
					var color = vo.colors[i % vo.colors.length];
					var pointSize = 5;
					
					if( vo.type == 'column' || vo.type == 'stackedColumn' || vo.type == 'singleYCombination'|| vo.type == 'dualYCombination' ){
						xx = xx+(w/2)+0.5;
						yy = yy+h;
						color = vo.colors[aSelect[0] % vo.colors.length];
						pointSize = 4;
						if( vo.is3D ){
							yy += this.bottom3DGap/2;
						}
					}else if( vo.type == 'bar' || vo.type == 'stackedBar' ){
						xx = xx+w+0.5;
						yy = yy+(h/2);
						color = vo.colors[aColorIdx[0] % vo.colors.length];
						pointSize = 4;
						if( vo.is3D ){
							xx -= this.bottom3DGap/4;
							yy += this.bottom3DGap/4;
						}
					}
					
					ctx.beginPath();
					ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
					ctx.strokeStyle = color;
					ctx.lineWidth = 2;
					ctx.stroke();
					ctx.closePath();
					ctx.beginPath();
					ctx.arc(xx,yy,pointSize-1,0,Math.PI*2,false);
					ctx.fillStyle = "#ffffff";
					ctx.fill();
					ctx.closePath();
					ctx.beginPath();
					ctx.arc(xx,yy,1,0,Math.PI*2,false);
					ctx.strokeStyle = color;
					ctx.lineWidth = 1.5;
					ctx.stroke();
					ctx.closePath();
					
					
					// guide line tooltip ***************************************************************
					oTooltipSize.x = aTooltipXY[i][0];
					oTooltipSize.y = topMove?aTooltipXY[i][1]-topGap:aTooltipXY[i][1];
					oTooltipSize.w = aTooltipXY[i][2];
					oTooltipSize.h = textHeight;
					//this._drawRect(ctx, xx, yy, xx+textWidth+(margin*2), yy, textSize+(margin*2), 'butt');
					
					if( vo.theme.tooltipStyle == 3 ){
						this._roundedRect(
											ctx
											,oTooltipSize.x
											,oTooltipSize.y
											,oTooltipSize.w
											,oTooltipSize.h
											,0
											,aTooltipXY[i][3]
											, true, true, true, true
										);
						ctx.fillStyle = vo.pointerGuideLineLabelBackground.fill;
						ctx.fill();
					}else{
						this._roundedRect(
											ctx
											,oTooltipSize.x
											,oTooltipSize.y
											,oTooltipSize.w
											,oTooltipSize.h
											,2
											,vo.pointerGuideLineLabelBackground.strokeColor
											, true, true, true, true
										);
						ctx.fillStyle = aTooltipXY[i][3];
						ctx.fill();
					}
					this.legendLabel(
										ctx
										, oTooltipSize.x+margin
										, oTooltipSize.y+margin
										, textSize+'px "'+textName+'"'
										, textColor
										, 'left'
										, 'top'
										, aTooltipXY[i][4]
									);
				}
				
			}
			
		};
		GLChart.prototype.drawAxis = function( type ){
			
			if( this.aData ){
				if( this.options.type == 'bar' || this.options.type == 'stackedBar' ){
					var w = this.sWidth-(this.options.chartArea.left+this.options.chartArea.right);
					if( w <= 200 ){
						var count = 3;
					}else if( w > 200 && w <= 260 ){
						var count = 4;
					}else if( w > 260 ){
						var count = 5;
					}

				}else if(this.options.type == 'radar'){
					var w = this.sWidth-(this.options.chartArea.left+this.options.chartArea.right);
					var h = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
					var min = Math.min(w,h)/2;
					if( min <= 200 ){
						var count = 3;
					}else if( min > 200 && min <= 260 ){
						var count = 4;
					}else if( min > 260 ){
						var count = 5;
					}
					count = 5;
				}else{
					var h = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
					if( h <= 200 ){
						var count = 4;
					}else if( h > 200 && h <= 260 ){
						var count = 5;
					}else{
						var count = 8;
					}
				}
			
				// y축 min,max값 구하기.
				this.calculateRange( this.aData );
				// y축 label 생성.
				this.createLabels( this.aData, count, this.options.yAxis.minValue, 'left' );
				if( this.options.type == 'dualYCombination' ){
					this.createLabels( this.aData, count, this.options.yAxis2.minValue, 'right' );
				}
				// x축 label 생성.
				this.createLabels( this.aData, count, this.options.xAxis.minValue, 'bottom' );
				if( this.options.type == 'radar' ){
					this.calculateMarginRadar( this.graphics_grid );
					this.drawGridLineRadar(this.graphics_grid, 'radius'); 
					this.drawGridLineRadar(this.graphics_grid, 'arc');
					return;
				}
				// 여백계산(x, y label포함)
				this.calculateMargin( this.graphics_grid );
				// draw chart background (top round rect)
				if(this.options.theme.axisStyle+'' == '1' && !this.options.is3D){
					this.upperRoundChartBg( this.graphics_grid, 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)' );
				}else if(this.options.theme.axisStyle+'' == '2' && !this.options.is3D){
					this._drawRect( 
						this.graphics_grid
						, this.calculatedMargins.x+0.5
						, this.calculatedMargins.y+this.calculatedMargins.h+0.5
						, this.calculatedMargins.w+this.calculatedMargins.x+0.5
						, this.calculatedMargins.y+this.calculatedMargins.h+0.5
						, this.calculatedMargins.h+0.5
						, 'butt' 
					);
					this.graphics_grid.strokeStyle=this.options.xAxis.color;
					this.graphics_grid.stroke();
				}else if(this.options.theme.axisStyle+'' == '3' && !this.options.is3D){
				
					if(this.options.xAxis.showGridLine && this.options.yAxis.showGridLine){
						this._drawRect( 
							this.graphics_grid
							, this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+this.calculatedMargins.h+0.5
							, this.calculatedMargins.w+this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+this.calculatedMargins.h+0.5
							, this.calculatedMargins.h+0.5
							, 'butt' 
						);
						this.graphics_grid.strokeStyle=this.options.xAxis.color;
						this.graphics_grid.stroke();
					}else if( !this.options.xAxis.showGridLine && this.options.yAxis.showGridLine){
						this._drawLine( 
							this.graphics_grid
							, this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+0.5
							, this.calculatedMargins.w+this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+0.5
							, 'butt', 1, this.options.yAxis.color 
						);
						this._drawLine( 
							this.graphics_grid
							, this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+this.calculatedMargins.h+0.5
							, this.calculatedMargins.w+this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+this.calculatedMargins.h+0.5
							, 'butt', 1, this.options.yAxis.color 
						);
					}else if( this.options.xAxis.showGridLine && !this.options.yAxis.showGridLine){
						
						this._drawLine( 
							this.graphics_grid
							, this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+0.5
							, this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+this.calculatedMargins.h+0.5
							, 'butt', 1, this.options.xAxis.color 
						);
						this._drawLine( 
							this.graphics_grid
							, this.calculatedMargins.w+this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+0.5
							, this.calculatedMargins.w+this.calculatedMargins.x+0.5
							, this.calculatedMargins.y+this.calculatedMargins.h+0.5
							, 'butt', 1, this.options.xAxis.color 
						);
					}
				
				}else if( this.options.is3D && (this.options.type == 'bar' || this.options.type == 'stackedBar') ){
					this._draw3DBgRotate( this.graphics_grid, this.options.background3D.fill );
				}else if( this.options.is3D && this.options.background3D.on ){
					this._draw3DBg( this.graphics_grid, this.options.background3D.fill );
				}
				// draw x, y grid line.
				if(this.options.type == 'bar' || this.options.type == 'stackedBar'){
					this.drawGridLineRotate(this.graphics_grid, 'horizontal');
					this.drawGridLineRotate(this.graphics_grid, 'vertical');
				}else if(
							this.options.type == 'area' 
							|| this.options.type == 'stackedArea' 
							|| this.options.type == 'areaRange'
							|| (this.options.xAxis.isValue && this.ranges.xmin != null)
						){
					this.drawGridLineCompact(this.graphics_grid, 'vertical'); 
					this.drawGridLineCompact(this.graphics_grid, 'horizontal'); 
				}else{
					this.drawGridLine(this.graphics_grid, 'vertical'); 
					this.drawGridLine(this.graphics_grid, 'horizontal');
					if( this.options.type == 'dualYCombination' ){
						this.drawGridLine(this.graphics_grid, 'horizontal_2');
					}
				}
				
			}else{
				return;
			}	
		};
		GLChart.prototype._dashedLine = function(ctx, x1, y1, x2, y2, color, dashLen) {
			if (dashLen == undefined) dashLen = 2;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			
			var dX = x2 - x1;
			var dY = y2 - y1;
			var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
			var dashX = dX / dashes;
			var dashY = dY / dashes;
			
			var q = 0;
			while (q++ < dashes) {
			 x1 += dashX;
			 y1 += dashY;
			 ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
			}
			ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
			ctx.strokeStyle = color;
			ctx.stroke();
			ctx.closePath();
		};
		GLChart.prototype._drawLine = function( ctx, sX, sY, eX, eY, lineCap, lineWidth, lineColor ){
			ctx.beginPath();
			ctx.moveTo(sX, parseInt(sY,10)+0.5);
			ctx.lineTo(eX, parseInt(eY,10)+0.5);
			ctx.lineCap = lineCap;
			ctx.closePath();
			ctx.strokeStyle = lineColor;
			ctx.lineWidth = lineWidth;
			ctx.stroke();
			ctx.lineWidth = 1;
		};
		GLChart.prototype._drawEllipse = function (ctx, x, y, w, h) {
			var CN = 0.5522848;
			ox = (w / 2) * CN, oy = (h / 2) * CN, xe = x + w, ye = y + h, xm = x + w / 2, ym = y + h / 2;
			ctx.moveTo(x, ym);
			ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
			ctx.fill();
		};
		GLChart.prototype._drawEllipseNoFill = function (ctx, x, y, w, h) {
			var CN = 0.5522848;
			ox = (w / 2) * CN, oy = (h / 2) * CN, xe = x + w, ye = y + h, xm = x + w / 2, ym = y + h / 2;
			ctx.moveTo(x, ym);
			ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		};
		GLChart.prototype._drawRect = function( ctx, sX, sY, eX, eY, h, lineCap ){
			ctx.beginPath();
			ctx.moveTo(sX, parseInt(sY,10)+0.5);
			ctx.lineTo(eX, parseInt(eY,10)+0.5);
			ctx.lineTo(eX, parseInt(sY-h,10)+0.5);
			ctx.lineTo(sX, parseInt(sY-h,10)+0.5);
			ctx.lineCap = lineCap;
			ctx.closePath();
		};
		GLChart.prototype._roundedRect = function(ctx,x,y,width,height,radius, strokeStyle, tl, tr, bl, br, lineWidth){
			ctx.beginPath();
			ctx.lineWidth = lineWidth;
			ctx.moveTo(x,y+radius);
			if( bl ){
				ctx.lineTo(x,y+height-radius);
				ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
			}else{
				ctx.lineTo(x,y+height);
			}
			if( br ){
				ctx.lineTo(x+width-radius,y+height);
				ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
			}else{
				ctx.lineTo(x+width,y+height);
			}
			if( tr ){
				ctx.lineTo(x+width,y+radius);
				ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
			}else{
				ctx.lineTo(x+width,y);
			}
			if( tl ){
				ctx.lineTo(x+radius,y);
				ctx.quadraticCurveTo(x,y,x,y+radius);
			}else{
				ctx.lineTo(x,y);
			}	
			ctx.closePath();
			ctx.strokeStyle = strokeStyle;
			
			ctx.stroke();
			ctx.lineWidth = 1.5;
		};
		GLChart.prototype._upperRoundedRect = function(ctx,x,y,width,height,radius, strokeStyle){
		  ctx.beginPath();
		  ctx.moveTo(x,y+radius);
		  ctx.lineTo(x,y+height+0.5);
		  ctx.lineTo(x+width,y+height+0.5);
		  ctx.lineTo(x+width,y+radius);
		  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
		  ctx.lineTo(x+radius,y);
		  ctx.quadraticCurveTo(x,y,x,y+radius);
		  ctx.closePath();
		  ctx.strokeStyle = strokeStyle;
		  ctx.stroke();
		};
		GLChart.prototype.upperRoundChartBg = function(ctx, shadowColor, strokeColor){
			if( this.graphics_grid == null ){
				return;
			}
			ctx.shadowColor = shadowColor;
			//ctx.shadowOffsetX=1;
			//ctx.shadowOffsetY=1;
			ctx.shadowBlur=8;
			this._upperRoundedRect( 
				ctx
				, this.calculatedMargins.x
				, this.calculatedMargins.y
				, this.calculatedMargins.w
				, this.calculatedMargins.h
				, 8
				, strokeColor
			);
			ctx.fillStyle= this.colorToRgba('#ffffff', this.options.background.opacity);
			ctx.fill();
			ctx.shadowColor="rgba(0, 0, 0, 0)";
			//ctx.shadowOffsetX=0;
			//ctx.shadowOffsetY=0;
			ctx.shadowBlur=0;
		};
		GLChart.prototype._draw3DBg = function( ctx, color ){
			
			var color = this.options.background3D.fill;
			var opacity = this.options.background3D.opacity;
			var lcolor = this.adjustBrightness(color, 25);
			var dcolor = this.adjustBrightness(color, -25);
			var dcolor2 = this.adjustBrightness(color, -45);
			var dcolor3 = this.adjustBrightness(color, -85);
			var grd=ctx.createLinearGradient(
				this.calculatedMargins.x
				, this.calculatedMargins.y
				, this.calculatedMargins.x+50
				, this.sHeight
			); 
			grd.addColorStop(0,dcolor);  
			grd.addColorStop(0.8,lcolor); 
			grd.addColorStop(1,lcolor); 
			
			// 뒷배경 옆면
			var sX = this.calculatedMargins.x+this.calculatedMargins.w+0.5;
			var sY = this.calculatedMargins.y+this.calculatedMargins.h-this.bottom3DGap+0.5;
			var eX = this.calculatedMargins.x+this.calculatedMargins.w;
			var eY = this.calculatedMargins.y+this.calculatedMargins.h-this.bottom3DGap+0.5;
			var h = this.calculatedMargins.h-this.bottom3DGap+0.5;
			ctx.beginPath();
			ctx.moveTo(sX, sY);
			ctx.lineTo(eX+4.5, parseInt(eY-3,10));
			ctx.lineTo(eX+4.5, parseInt(sY-h+3,10));
			ctx.lineTo(sX, parseInt(sY-h,10));
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = dcolor;
			ctx.fill();
			
			// 바닥 윗면
			var grd2=ctx.createLinearGradient(
				this.calculatedMargins.x
				, sY
				, this.calculatedMargins.x
				, sY+10
			); 
			grd2.addColorStop(0.2,color);  
			grd2.addColorStop(1,dcolor2); 
			ctx.beginPath();
			ctx.moveTo(this.calculatedMargins.x-10, sY+10);
			ctx.lineTo(eX-10, sY+10);
			ctx.lineTo(eX, sY);
			ctx.lineTo(this.calculatedMargins.x, sY);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd2;
			ctx.fill();
			
			// 바닥 앞면
			var grd3=ctx.createLinearGradient(
				this.calculatedMargins.x
				, sY+10
				, this.calculatedMargins.x
				, sY+20
			); 
			grd3.addColorStop(0,color);  
			grd3.addColorStop(0.6,dcolor2);
			ctx.beginPath();
			ctx.moveTo(this.calculatedMargins.x-10, sY+20);
			ctx.lineTo(eX-10, sY+20);
			ctx.lineTo(eX-10, sY+10);
			ctx.lineTo(this.calculatedMargins.x-10, sY+10);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd3;
			ctx.fill();
			
			// 바닥 옆면
			ctx.beginPath();
			ctx.moveTo(eX-10, sY+20);
			ctx.lineTo(eX, sY+10);
			ctx.lineTo(eX, sY);
			ctx.lineTo(eX-10, sY+10);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = dcolor3;
			ctx.fill();
			
			// 뒷배경
			this._drawRect( 
				ctx
				, this.calculatedMargins.x+0.5
				, this.calculatedMargins.y+this.calculatedMargins.h-this.bottom3DGap+0.5
				, this.calculatedMargins.w+this.calculatedMargins.x+0.5
				, this.calculatedMargins.y+this.calculatedMargins.h-this.bottom3DGap+0.5
				, this.calculatedMargins.h-this.bottom3DGap+0.5
				, 'butt' 
			);
			ctx.fillStyle = grd;
			ctx.fill();
		};
		GLChart.prototype._draw3DBgRotate = function( ctx, color ){
			
			var gap = this.bottom3DGap;
			
			var color = this.options.background3D.fill;
			var lcolor = this.adjustBrightness(color, 25);
			var dcolor = this.adjustBrightness(color, -25);
			var dcolor2 = this.adjustBrightness(color, -45);
			var dcolor3 = this.adjustBrightness(color, -85);
			var grd=ctx.createLinearGradient(
				this.calculatedMargins.x
				, this.calculatedMargins.x
				, this.calculatedMargins.x+this.calculatedMargins.w
				, this.calculatedMargins.x+this.calculatedMargins.w
			); 
			grd.addColorStop(0,dcolor);  
			grd.addColorStop(0.5,lcolor); 
			grd.addColorStop(1,color); 
			
			// 뒷배경 윗면
			var sX = this.calculatedMargins.x+gap+0.5;
			var sY = this.calculatedMargins.y+0.5;
			var eX = this.calculatedMargins.x+this.calculatedMargins.w;
			var eY = this.calculatedMargins.y+this.calculatedMargins.h+0.5;
			var h = 3;
			ctx.beginPath();
			ctx.moveTo(sX, sY);
			ctx.lineTo(eX+0.5, sY);
			ctx.lineTo(eX-4.5, parseInt(sY-h,10));
			ctx.lineTo(sX+4.5, parseInt(sY-h,10));
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = dcolor2;
			ctx.fill();
			
			// y바닥 옆면
			var grd2=ctx.createLinearGradient(
				sX
				, sY
				, sX-(gap/3)
				, sY
			); 
			grd2.addColorStop(0.2,dcolor);  
			grd2.addColorStop(1,dcolor2); 
			ctx.beginPath();
			ctx.moveTo(sX-(gap/3), eY+(gap/3));
			ctx.lineTo(sX, eY);
			ctx.lineTo(sX, sY);
			ctx.lineTo(sX-(gap/3), sY+(gap/3));
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd2;
			ctx.fill();
			
			// y바닥 앞면
			var grd3=ctx.createLinearGradient(
				sX-(gap/3)
				, sY
				, sX-gap
				, sY
			); 
			grd3.addColorStop(0,color);  
			grd3.addColorStop(0.6,dcolor2);
			ctx.beginPath();
			ctx.moveTo(sX-(gap/1.25), eY+(gap/3));
			ctx.lineTo(sX-(gap/3), eY+(gap/3));
			ctx.lineTo(sX-(gap/3), sY+(gap/3));
			ctx.lineTo(sX-(gap/1.25), sY+(gap/3));
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd3;
			ctx.fill();
			
			// y바닥 윗면
			ctx.beginPath();
			ctx.moveTo(sX-(gap/1.25), sY+(gap/3));
			ctx.lineTo(sX-(gap/3), sY+(gap/3));
			ctx.lineTo(sX, sY);
			ctx.lineTo(sX-(gap/2.25), sY);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = dcolor3;
			ctx.fill();
			
			// 뒷배경
			this._drawRect( 
				ctx
				, this.calculatedMargins.x+gap+0.5
				, this.calculatedMargins.y+this.calculatedMargins.h+0.5
				, this.calculatedMargins.w+this.calculatedMargins.x+0.5
				, this.calculatedMargins.y+this.calculatedMargins.h+0.5
				, this.calculatedMargins.h+0.5
				, 'butt' 
			);
			ctx.fillStyle = grd;
			ctx.fill();
		};
		GLChart.prototype.drawGridLine = function( ctx, type ){
			var tickCnt = null;
			var vo = this.options;
			  
			var sX = 0; // x
			var sY = 0; // y
			var eX = 0;
			var eY = 0;
			var xg = 0; // gap of x
			var yg = 0; // gap of y
			var w  = this.calculatedMargins.w;
			var odd = false;
			var bottom3DGap = this.bottom3DGap;
			var clacHeight = this.calculatedMargins.h;
			var xLabelGap = null;
			  
			if( vo.is3D ){
				clacHeight = clacHeight - bottom3DGap;
			}else{
				bottom3DGap = 0;
			}  
			  
			if( type == 'horizontal' ){
				tickCnt = this.yLabels.length;
				sX = this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = this.calculatedMargins.w + this.calculatedMargins.x;
				eY = sY;
				yg = clacHeight / (tickCnt - 1);
				
				if( !vo.background3D.on ){
					this._drawLine( ctx, sX, sY, eX, eY, 'butt', 1, vo.yAxis.color );
					this._drawLine( ctx, sX, this.calculatedMargins.y, eX, this.calculatedMargins.y, 'butt', 1, vo.yAxis.color );
				}
				
				for(var i=0;i<tickCnt;i++){
				
					if( sY != eY ){eY -= yg;}
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						if( i != 0 ) {
							if( i != tickCnt-1 ){
							
								if( vo.horizontalFill.on ){
									if( i == tickCnt-2 && vo.theme.axisStyle == '1' ){
										this._upperRoundedRect( 
											ctx, sX, parseInt(sY-yg,10), w, yg, 8, "rgba(0, 0, 0, 0)");
									}else{
										this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
									}
									if( i%2 == 0 ){
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
										ctx.fill();
									}
								}
								if(vo.yAxis.showGridLine){
									this._drawLine( ctx, sX, sY, eX, eY, 'butt', 1, vo.yAxis.color );
								}
								if( vo.zeroPlane ){
									if( this.yLabels[(tickCnt-1)-i] == 0 ){
										if( vo.is3D ){
											ctx.beginPath();
											ctx.moveTo(this.calculatedMargins.x-5, sY+10);
											ctx.lineTo(eX-10, sY+10);
											ctx.lineTo(eX, sY);
											ctx.lineTo(this.calculatedMargins.x, sY);
											ctx.lineCap = 'butt';
											ctx.closePath();
											ctx.fillStyle = this.colorToRgba(vo.zeroPlaneColor,0.2);
											ctx.fill();
											//this._drawLine( ctx, sX-5, sY+10, eX-10, eY+10, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
										}else{
											this._drawLine( ctx, sX, sY, eX, eY, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
										}	
									}
								}
							}
						}else{
							if( vo.horizontalFill.on ){
								this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
								if( i%2 == 0 ){
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
									ctx.fill();
								}
							}
						}
					}
					// draw yLabel
					this.drawLabel(ctx, sX, sY, i, yg, type);
				  
					sY -= yg;
					eY = sY;
				}
			}else if( type == 'horizontal_2' ){
				tickCnt = this.yLabels2.length;
				sX = this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = this.calculatedMargins.w + this.calculatedMargins.x;
				eY = sY;
				yg = clacHeight / (tickCnt - 1);
				
				for(var i=0;i<tickCnt;i++){
				
					if( sY != eY ){eY -= yg;}
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						if( i != 0 ) {
							if( i != tickCnt-1 ){
								/*
								if( vo.horizontalFill.on ){
									if( i == tickCnt-2 && vo.theme.axisStyle == '1' ){
										this._upperRoundedRect( 
											ctx, sX, parseInt(sY-yg,10), w, yg, 8, "rgba(0, 0, 0, 0)");
									}else{
										this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
									}
									if( i%2 == 0 ){
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
										ctx.fill();
									}
								}
								*/
								if(vo.yAxis2.showGridLine){
									this._dashedLine( ctx, sX, sY+0.5, eX, eY+0.5, vo.yAxis2.color, 5 );
								}
								/*
								if( vo.zeroPlane ){
									if( this.yLabels[(tickCnt-1)-i] == 0 ){
										if( vo.is3D ){
											ctx.beginPath();
											ctx.moveTo(this.calculatedMargins.x-5, sY+10);
											ctx.lineTo(eX-10, sY+10);
											ctx.lineTo(eX, sY);
											ctx.lineTo(this.calculatedMargins.x, sY);
											ctx.lineCap = 'butt';
											ctx.closePath();
											ctx.fillStyle = this.colorToRgba(vo.zeroPlaneColor,0.2);
											ctx.fill();
											//this._drawLine( ctx, sX-5, sY+10, eX-10, eY+10, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
										}else{
											this._drawLine( ctx, sX, sY, eX, eY, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
										}	
									}
								}
								*/
							}
						}else{
							/*
							if( vo.horizontalFill.on ){
								this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
								if( i%2 == 0 ){
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
									ctx.fill();
								}
							}
							*/
						}
					}
					// draw yLabel
					this.drawLabel(ctx, eX, sY, i, yg, type);
				  
					sY -= yg;
					eY = sY;
				}
			}else if( type == 'vertical' ){
			  
				tickCnt = this.xLabels.length;
				this.yZero = null;
			  
				sX = this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / tickCnt;
				yg = clacHeight / (this.yLabels.length - 1);
				
				var tempcnt = 0;
				for( var i=(this.yLabels.length-1);i>=0;i-- ){
				  if( parseFloat(this.yLabels[i]) == 0 ){
					this.yZero = sY - (yg * tempcnt);
				  }
				  tempcnt++;
				}
				if( vo.type == 'dualYCombination' ){
					this.y2Zero = null;
					var tempcnt2 = 0;
					yg = clacHeight / (this.yLabels2.length - 1);
					for( var i=(this.yLabels2.length-1);i>=0;i-- ){
					  if( parseFloat(this.yLabels2[i]) == 0 ){
						this.y2Zero = sY - (yg * tempcnt2);
					  }
					  tempcnt2++;
					}
				}
				
				if(vo.xAxis.showTextEvery == 'auto'){
					xLabelGap = parseFloat(this.xLabelWidth / xg);
					var floorS = Math.floor(xLabelGap);
					xLabelGap = (xLabelGap > floorS)? floorS+1 : floorS;
				}
				
				
				for(var i=0;i<tickCnt;i++){
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						if( vo.xAxis.showTextEvery == 1 ) {
							if( vo.verticalFill.on ){
								if( i==0 && vo.theme.axisStyle == '1' ){
									this._roundedRect( ctx, eX, eY,xg,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
								}else if( i == tickCnt-1 && vo.theme.axisStyle == '1' ){
									this._roundedRect( ctx, eX, eY,xg,clacHeight,8, 'rgba(0,0,0,0)', false, true, false, false);
								}else{
									this._drawRect( ctx, sX, sY, sX+xg, sY, clacHeight, 'butt' );
								}	
								if( i%2 == 0 ){
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
									ctx.fill();
								}
							}
							if(i!=0){
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
							} 
						}else if( vo.xAxis.showTextEvery == 'auto' ) {
						
							if(i == 0 && vo.verticalFill.on){
								if( vo.theme.axisStyle == '1' ){
									this._roundedRect( ctx, eX, eY,xg/2,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
								}else{
									this._drawRect(ctx, sX+(xg/2), sY-0.5, (sX+(xg/2))+(xg*xLabelGap), sY-0.5, clacHeight-0.5, 'butt');
								}
								if( odd ){
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
									ctx.fill();
								}
								odd = odd?false:true;
							}
							if(i == tickCnt){
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
							}
							if( i % xLabelGap == 0 && i < tickCnt ){
								if( vo.verticalFill.on ){
									if( (sX+(xg/2))+(xg*xLabelGap) > this.calculatedMargins.w+this.calculatedMargins.x && vo.theme.axisStyle == '1' ){
										this._roundedRect( 
											ctx
											, sX+(xg/2)
											, eY
											,(this.sWidth-vo.chartArea.right)-(sX+(xg/2))
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, true, false, false
										);
									}else{
										this._drawRect( 
											ctx
											, sX+(xg/2)
											, sY-0.5
											, (sX+(xg/2))+(xg*xLabelGap)
											, sY-0.5
											, clacHeight-0.5
											, 'butt' 
										);
									}	
									if( odd ){
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
										ctx.fill();
									}
								}
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX+(xg/2),10)+0.5, sY, parseInt(eX+(xg/2),10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
								
								odd = odd?false:true;
							}
						}else{
							if(i == 0 && vo.verticalFill.on){
								if( vo.theme.axisStyle == '1' ){
									this._roundedRect( ctx, eX, eY,xg/2,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
								}else{
									this._drawRect(ctx, sX+(xg/2), sY-0.5, (sX+(xg/2))+(xg*vo.xAxis.showTextEvery), sY-0.5, clacHeight-0.5, 'butt');
								}
								if( odd ){
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
									ctx.fill();
								}
								odd = odd?false:true;
							}
							if(i == tickCnt){
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
							}
							if( i % vo.xAxis.showTextEvery == 0 && i < tickCnt ){
								if( vo.verticalFill.on ){
									if( (sX+(xg/2))+(xg*vo.xAxis.showTextEvery) > this.calculatedMargins.w+this.calculatedMargins.x && vo.theme.axisStyle == '1' ){
										this._roundedRect( 
											ctx
											, sX+(xg/2)
											, eY
											,(this.sWidth-vo.chartArea.right)-(sX+(xg/2))
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, true, false, false
										);
									}else{
										this._drawRect( 
											ctx
											, sX+(xg/2)
											, sY-0.5
											, (sX+(xg/2))+(xg*vo.xAxis.showTextEvery)
											, sY-0.5
											, clacHeight-0.5
											, 'butt' 
										);
									}	
									if( odd ){
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
										ctx.fill();
									}
								}
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX+(xg/2),10)+0.5, sY, parseInt(eX+(xg/2),10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
								
								odd = odd?false:true;
							}
						}
					}
					// draw xLabel
					if( i < tickCnt ) {
						// draw xLabel
						if(vo.xAxis.showTextEvery == 'auto'){
							if( i%xLabelGap == 0 ){
								this.drawLabel(ctx, sX, sY+bottom3DGap, i, xg, type);
							}
						}else{
							this.drawLabel(ctx, sX, sY+bottom3DGap, i, xg, type);
						}	
					}
					sX = sX + xg;
					eX = eX + xg;
				}
				
			}
		};
		GLChart.prototype.drawGridLineRadar = function( ctx, type ){
			var xTickCnt = null;
			var yTickCnt = null;
			var vo = this.options;
			
			var sX = 0;
			var sY = 0; // y
			var yg = 0; // gap of y
			var odd = false;
			var startTickCnt = 0, Cd, startAngle=-(Math.PI/2);
			var radius=this.calculatedMargins.diameter/2;
			var center=this.calculatedMargins.center;
			var x,y,tempX,tempY, tempX=0, tempY=0, labelStartY=center[1], axisTypeGap=radius/(this.yLabels.length-1);
			  
			if( type == 'arc' ){
				
				xTickCnt 	= this.xLabels.length;
				yTickCnt 	= this.yLabels.length;
				yg			= radius/(yTickCnt-1);
				sY			= radius;
				
				
				ctx.strokeStyle = vo.yAxis.color;
				for( var j=0;j<yTickCnt;j++ ){
				
					if( this.options.theme.axisStyle == 2 ){
						if( j == yTickCnt-2 ){
							ctx.lineWidth = 3;
						}else{
							ctx.lineWidth = 1;
						}
					}else{
						if( j == 0 ){
							ctx.lineWidth = 3;
						}else{
							ctx.lineWidth = 1;
						}
					}
					
					if( j != yTickCnt-1 ){
						
						if( this.options.theme.axisStyle == 2 ){
							
							ctx.beginPath();
							Cd = 360 / xTickCnt * 0 * Math.PI / 180;
							x = Math.ceil(Math.cos(Cd + startAngle) * sY + center[0])+0.5;
							y = Math.ceil(Math.sin(Cd + startAngle) * sY + center[1])+0.5;
							sX = x;
							
							ctx.arc(center[0]+0.5, center[1]+0.5, axisTypeGap, 0, Math.PI*2, false);
							ctx.stroke();
							ctx.closePath();
							
							this._dashedLine(ctx, center[0]+0.5, Math.round(center[1]-axisTypeGap)+0.5, center[0]+0.5+radius+yg-10, Math.round(center[1]-axisTypeGap)+0.5, vo.yAxis.color, 2);
							
						}else{
						
							ctx.beginPath();
							for(var i=0;i<xTickCnt+1;i++){
								Cd = 360 / xTickCnt * i * Math.PI / 180;
								x = Math.ceil(Math.cos(Cd + startAngle) * sY + center[0])+0.5;
								y = Math.ceil(Math.sin(Cd + startAngle) * sY + center[1])+0.5;
								if( j==0 && i==0 ){
									sX = x;
								}
								
								if(i != 0){
									ctx.lineTo(x,y);
								}else{
									ctx.moveTo(x,y);
								}
							}
							ctx.stroke();
							if( vo.horizontalFill.on ){
								for(var i=xTickCnt;i>=0;i--){
									Cd = 360 / xTickCnt * i * Math.PI / 180;
									tempX = Math.ceil(Math.cos(Cd + startAngle) * (sY-yg) + center[0])+0.5;
									tempY = Math.ceil(Math.sin(Cd + startAngle) * (sY-yg) + center[1])+0.5;
									ctx.lineTo(tempX,tempY);
								}
							}
							ctx.closePath();
							
							if( vo.horizontalFill.on ){
								if( odd ){
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
									odd = false;
								}else{
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
									odd = true;
								}
								ctx.fill();
							}
						}
						
					}
					
					this.drawLabelRadar( ctx, sX, labelStartY, j, null, type  );
				
					sY -= yg;
					labelStartY -= yg;
					if( this.options.theme.axisStyle == 2 ){
						axisTypeGap += yg;
					}
				}
				
				
			}else if( type == 'radius' ){
				
				var tempX, tempY, Cd2;
				xTickCnt = this.xLabels.length;
				ctx.beginPath();
				ctx.strokeStyle = vo.xAxis.color;
				for(var i=0;i<xTickCnt;i++){
					Cd = 360 / xTickCnt * i * Math.PI / 180;
					Cd2 = 360 / xTickCnt * (i+1) * Math.PI / 180;
					tempX = Math.cos(Cd + startAngle) * (radius+this.labelMargin+3) + center[0]+0.5;
					tempY = Math.sin(Cd + startAngle) * (radius+this.labelMargin+3) + center[1]+0.5;
					
					if( vo.verticalFill.on ){
						if( odd ){
							ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
							odd = false;
						}else{
							ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
							odd = true;
						}
						x = Math.ceil(Math.cos(Cd + startAngle) * radius + center[0])+0.5;
						y = Math.ceil(Math.sin(Cd + startAngle) * radius + center[1])+0.5;
						ctx.beginPath();
						ctx.moveTo(center[0]+0.5, center[1]+0.5);
						ctx.lineTo(x,y);
						x = Math.ceil(Math.cos(Cd2 + startAngle) * radius + center[0])+0.5;
						y = Math.ceil(Math.sin(Cd2 + startAngle) * radius + center[1])+0.5;
						ctx.lineTo(x,y);
						ctx.fill();
						
					}else{
						x = Math.ceil(Math.cos(Cd + startAngle) * radius + center[0])+0.5;
						y = Math.ceil(Math.sin(Cd + startAngle) * radius + center[1])+0.5;
						ctx.moveTo(center[0]+0.5, center[1]+0.5);
						ctx.lineTo(x,y);
					}
					
					this.drawLabelRadar( ctx, tempX, tempY, i, Cd, type);
				}
				ctx.closePath();
				ctx.stroke();
				
			}
		};
		GLChart.prototype.drawGridLineCompact = function( ctx, type ){
			var tickCnt = null;
			var vo = this.options;
			  
			var sX = 0; // x
			var sY = 0; // y
			var eX = 0;
			var eY = 0;
			var xg = 0; // gap of x
			var yg = 0; // gap of y
			var w  = this.calculatedMargins.w;
			var odd = false;
			var bottom3DGap = this.bottom3DGap;
			var clacHeight = this.calculatedMargins.h;
			var xLabelGap = null;
			
			if( vo.is3D ){
				clacHeight = clacHeight - bottom3DGap;
			}else{
				bottom3DGap = 0;
			}  
			  
			if( type == 'horizontal' ){
				tickCnt = this.yLabels.length;
				sX = this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = this.calculatedMargins.w + this.calculatedMargins.x;
				eY = sY;
				yg = clacHeight / (tickCnt - 1);
				
				for(var i=0;i<tickCnt;i++){
				
					if( sY != eY ){eY -= yg;}
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						if( i != 0 ) {
							if( i != tickCnt-1 ){
							
								if( vo.horizontalFill.on ){
									if( i == tickCnt-2 && vo.theme.axisStyle == '1' ){
										this._upperRoundedRect( 
											ctx, sX, parseInt(sY-yg,10), w, yg, 8, "rgba(0, 0, 0, 0)");
									}else{
										this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
									}
									if( i%2 == 0 ){
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
										ctx.fill();
									}
								}
								if(vo.yAxis.showGridLine){
									this._drawLine( ctx, sX, sY, eX, eY, 'butt', 1, vo.yAxis.color );
								}
								if( vo.zeroPlane ){
									if( this.yLabels[(tickCnt-1)-i] == 0 ){
										if( vo.is3D ){
											ctx.beginPath();
											ctx.moveTo(this.calculatedMargins.x-5, sY+10);
											ctx.lineTo(eX-10, sY+10);
											ctx.lineTo(eX, sY);
											ctx.lineTo(this.calculatedMargins.x, sY);
											ctx.lineCap = 'butt';
											ctx.closePath();
											ctx.fillStyle = this.colorToRgba(vo.zeroPlaneColor,0.2);
											ctx.fill();
											//this._drawLine( ctx, sX-5, sY+10, eX-10, eY+10, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
										}else{
											this._drawLine( ctx, sX, sY, eX, eY, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
										}	
									}
								}
							}
						}else{
							if( vo.horizontalFill.on ){
								this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
								if( i%2 == 0 ){
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
									ctx.fill();
								}
							}
						}
					}
					// draw yLabel
					this.drawLabel(ctx, sX, sY, i, yg, type);
				  
					sY -= yg;
					eY = sY;
				}
			}else if( type == 'vertical' ){
			  
				tickCnt = this.xLabels.length;
				this.yZero = null;
			  
				sX = this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (tickCnt-1);
				yg = clacHeight / (this.yLabels.length - 1);
				
				var tempcnt = 0;
				for( var i=(this.yLabels.length-1);i>=0;i-- ){
				  if( parseFloat(this.yLabels[i]) == 0 ){
					this.yZero = sY - (yg * tempcnt);
				  }
				  tempcnt++;
				} 
				
				if( vo.xAxis.isValue ){
					tempcnt = 0;
					for( var i=0;i<this.xLabels.length;i++ ){
					  if( parseFloat(this.xLabels[i]) == 0 ){
						this.xZero = sX - (xg * tempcnt);
					  }
					  tempcnt++;
					}
				}
				
				if(vo.xAxis.showTextEvery == 'auto'){
					xLabelGap = parseFloat(this.xLabelWidth / xg);
					var floorS = Math.floor(xLabelGap);
					xLabelGap = (xLabelGap > floorS)? floorS+1 : floorS;
				}
				
				for(var i=0;i<tickCnt;i++){
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						if( vo.xAxis.showTextEvery == 1 ) {
							if( vo.verticalFill.on ){
								if( i==0 && vo.theme.axisStyle == '1' ){
									this._roundedRect( ctx, eX, eY,xg,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
								}else if( i == tickCnt-2 && vo.theme.axisStyle == '1' ){
									this._roundedRect( ctx, eX, eY,xg,clacHeight,8, 'rgba(0,0,0,0)', false, true, false, false);
								}else if( i == tickCnt-1){
									;
								}else{
									this._drawRect( ctx, sX, sY, sX+xg, sY, clacHeight, 'butt' );
								}	
								if( i%2 == 0 ){
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
									ctx.fill();
								}
							}
							if(i!=0 && i != tickCnt-1){
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
							} 
						}else if( vo.xAxis.showTextEvery == 'auto' ){
							if(i == 0 && vo.verticalFill.on){
								if( vo.theme.axisStyle == '1' && sX+(xg*xLabelGap) < this.calculatedMargins.w+this.calculatedMargins.x ){
									this._roundedRect( ctx, eX, eY, xg*xLabelGap,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
								}else if( vo.theme.axisStyle == '1' && sX+(xg*xLabelGap) >= this.calculatedMargins.w+this.calculatedMargins.x ){
									this._roundedRect( ctx, eX, eY, (w+this.calculatedMargins.x)-sX,clacHeight,8, 'rgba(0,0,0,0)', true, true, false, false);
								}else if( vo.theme.axisStyle == '2' && sX+(xg*xLabelGap) > this.calculatedMargins.w+this.calculatedMargins.x ){
										this._roundedRect( 
											ctx
											, sX
											, eY
											,(this.sWidth-vo.chartArea.right)-sX
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, false, false, false
										);
								}else{
									this._drawRect(ctx, sX, sY-0.5, sX+(xg*xLabelGap), sY-0.5, clacHeight-0.5, 'butt');
								}
								if( odd ){
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
									ctx.fill();
								}
								odd = odd?false:true;
							}
							if(i == tickCnt){
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
							}
							if( i % xLabelGap == 0 && i < tickCnt-1 && i != 0 ){
								if( vo.verticalFill.on ){
									if( sX+(xg*xLabelGap) >= this.calculatedMargins.w+this.calculatedMargins.x && vo.theme.axisStyle == '1' ){
										this._roundedRect( 
											ctx
											, sX
											, eY
											,(this.sWidth-vo.chartArea.right)-sX
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, true, false, false
										);
									}else if( sX+(xg*xLabelGap) > this.calculatedMargins.w+this.calculatedMargins.x && vo.theme.axisStyle == '2' ){
										this._roundedRect( 
											ctx
											, sX
											, eY
											,(this.sWidth-vo.chartArea.right)-sX
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, false, false, false
										);
									}else{
										this._drawRect( 
											ctx
											, sX
											, sY-0.5
											, sX+(xg*xLabelGap)
											, sY-0.5
											, clacHeight-0.5
											, 'butt' 
										);
									}	
									if( odd ){
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
										ctx.fill();
									}
								}
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
								
								odd = odd?false:true;
							}
						}else{
							if(i == 0 && vo.verticalFill.on){
								if( vo.theme.axisStyle == '1' && sX+(xg*vo.xAxis.showTextEvery) < this.calculatedMargins.w+this.calculatedMargins.x ){
									this._roundedRect( ctx, eX, eY, xg*vo.xAxis.showTextEvery,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
								}else if( vo.theme.axisStyle == '1' && sX+(xg*vo.xAxis.showTextEvery) >= this.calculatedMargins.w+this.calculatedMargins.x ){
									this._roundedRect( ctx, eX, eY, (w+this.calculatedMargins.x)-sX,clacHeight,8, 'rgba(0,0,0,0)', true, true, false, false);
								}else if( vo.theme.axisStyle == '2' && sX+(xg*vo.xAxis.showTextEvery) > this.calculatedMargins.w+this.calculatedMargins.x ){
										this._roundedRect( 
											ctx
											, sX
											, eY
											,(this.sWidth-vo.chartArea.right)-sX
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, false, false, false
										);
								}else{
									this._drawRect(ctx, sX, sY-0.5, sX+(xg*vo.xAxis.showTextEvery), sY-0.5, clacHeight-0.5, 'butt');
								}
								if( odd ){
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
									ctx.fill();
								}
								odd = odd?false:true;
							}
							if(i == tickCnt){
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
							}
							if( i % vo.xAxis.showTextEvery == 0 && i < tickCnt-1 && i != 0 ){
								if( vo.verticalFill.on ){
									if( sX+(xg*vo.xAxis.showTextEvery) >= this.calculatedMargins.w+this.calculatedMargins.x && vo.theme.axisStyle == '1' ){
										this._roundedRect( 
											ctx
											, sX
											, eY
											,(this.sWidth-vo.chartArea.right)-sX
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, true, false, false
										);
									}else if( sX+(xg*vo.xAxis.showTextEvery) > this.calculatedMargins.w+this.calculatedMargins.x && vo.theme.axisStyle == '2' ){
										this._roundedRect( 
											ctx
											, sX
											, eY
											,(this.sWidth-vo.chartArea.right)-sX
											,clacHeight-0.5
											,8
											, 'rgba(0,0,0,0)'
											, false, false, false, false
										);
									}else{
										this._drawRect( 
											ctx
											, sX
											, sY-0.5
											, sX+(xg*vo.xAxis.showTextEvery)
											, sY-0.5
											, clacHeight-0.5
											, 'butt' 
										);
									}	
									if( odd ){
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
										ctx.fill();
									}
								}
								if(vo.xAxis.showGridLine){
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
								}
								
								odd = odd?false:true;
							}
						}
					}
					// draw xLabel
					if( i < tickCnt ) {
						// draw xLabel
						
						if(vo.xAxis.showTextEvery == 'auto'){
							if( i%xLabelGap == 0 ){
								this.drawLabelCompact(ctx, sX, sY+bottom3DGap, i, xg, type);
							}
						}else{
							this.drawLabelCompact(ctx, sX, sY+bottom3DGap, i, xg, type);
						}
					}
					sX = sX + xg;
					eX = eX + xg;
				}
				
			}
		};
		GLChart.prototype.drawGridLineRotate = function( ctx, type ){
			var tickCnt = null;
			var vo = this.options;
			  
			var sX = 0; // x
			var sY = 0; // y
			var eX = 0;
			var eY = 0;
			var xg = 0; // gap of x
			var yg = 0; // gap of y
			var w  = (vo.is3D && (vo.type == 'bar' || vo.type == 'stackedBar'))?this.calculatedMargins.w-this.bottom3DGap:this.calculatedMargins.w;
			var odd = true;
			var firstRect = true;
			var bottom3DGap = this.bottom3DGap;
			var c4Bottom3DGap = this.bottom3DGap/4;
			var clacHeight = this.calculatedMargins.h;
			
			clacHeight = clacHeight - bottom3DGap;
			
			if( vo.type == 'stackedBar' || vo.type == 'bar' ){
				clacHeight = this.calculatedMargins.h;
				bottom3DGap = 0;
			}
			  
			if( type == 'horizontal' ){
				tickCnt = this.xLabels.length+1;
				sX = (vo.is3D && (vo.type == 'bar' || vo.type == 'stackedBar'))?this.calculatedMargins.x+this.bottom3DGap:this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = this.calculatedMargins.w + this.calculatedMargins.x;
				eY = sY;
				yg = clacHeight / (tickCnt - 1);
				
				for(var i=0;i<tickCnt;i++){
				
					if( sY != eY ){eY -= yg;}
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						if( vo.xAxis.showTextEvery == 1 ) {
							if( i != 0 ) {
								if( i != tickCnt-1 ){
								
									if( vo.horizontalFill.on ){
										if( i == tickCnt-2 && vo.theme.axisStyle == '1' ){
											this._upperRoundedRect( 
												ctx, sX, parseInt(sY-yg,10), w, yg, 8, "rgba(0, 0, 0, 0)");
										}else{
											this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
										}
										if( odd ){
											ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
											ctx.fill();
										}else{
											ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
											ctx.fill();
										}
									}
									if(vo.yAxis.showGridLine){
										this._drawLine( ctx, sX, sY, eX, eY, 'butt', 1, vo.yAxis.color );
									}
								}
							}else{
								if( vo.horizontalFill.on ){
									this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
									if( odd ){
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
										ctx.fill();
									}
								}
							}
							odd = odd?false:true;
						}else if( ((tickCnt-1)-i) % vo.xAxis.showTextEvery == 1 ){
							sY = sY - (yg/2);
							eY = sY;
							if( i != 0 ) {
								if( i != tickCnt-1 ){
								
									if( vo.horizontalFill.on ){
										if( i == tickCnt-2 && vo.theme.axisStyle == '1' ){
											this._upperRoundedRect( 
												ctx, sX, parseInt(sY-(yg/2),10), w, (yg/2), 8, "rgba(0, 0, 0, 0)");
										}else{
											this._drawRect( ctx, sX, sY, eX, eY, yg*vo.xAxis.showTextEvery, 'butt' );
										}
										if( odd ){
											ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
											ctx.fill();
										}else{
											ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
											ctx.fill();
										}
									}
								}else{
									if( vo.horizontalFill.on ){
										this._drawRect( ctx, sX, sY, eX, eY, yg, 'butt' );
									}
								}
								
								//this._drawLine( ctx, sX, sY, eX, eY, 'butt', 1, vo.yAxis.color );
							}else{
								if( vo.horizontalFill.on ){
									this._drawRect( ctx, sX, sY, eX, eY, yg*vo.xAxis.showTextEvery, 'butt' );
									if( odd ){
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
										ctx.fill();
									}else{
										ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
										ctx.fill();
									}
									
								}
							}
							
							if(firstRect){
								this._drawRect( 
													ctx
													, sX
													, clacHeight + this.calculatedMargins.y
													, eX
													, clacHeight + this.calculatedMargins.y
													, (clacHeight + this.calculatedMargins.y) - sY
													, 'butt' );
								if( !odd ){
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.odd, vo.horizontalFill.opacity);
									ctx.fill();
								}else{
									ctx.fillStyle = this.colorToRgba(vo.horizontalFill.even, vo.horizontalFill.opacity);
									ctx.fill();
								}
								firstRect = false;
							}
							if(vo.yAxis.showGridLine){
								this._drawLine( ctx, sX, sY, eX, eY, 'butt', 1, vo.yAxis.color );
							}
							
							sY = sY + (yg/2);
							eY = sY;
							odd = odd?false:true;
						}
						
					}
					// draw yLabel
					if( i < tickCnt-1 ){
						this.drawLabelRotate(ctx, sX, sY, i, yg, type, tickCnt);
					}	
				  
					sY -= yg;
					eY = sY;
				}
				
				
			}else if( type == 'vertical' ){
			  
				tickCnt = this.yLabels.length-1;
				this.yZero = null;
			  
				sX = (vo.is3D && (vo.type == 'bar' || vo.type == 'stackedBar'))?this.calculatedMargins.x+this.bottom3DGap:this.calculatedMargins.x;
				sY = clacHeight + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = (vo.is3D && (vo.type == 'bar' || vo.type == 'stackedBar'))?(this.calculatedMargins.w-this.bottom3DGap) / tickCnt:this.calculatedMargins.w / tickCnt;
				yg = clacHeight / (this.yLabels.length);
				
				var tempcnt = 0;
				for( var i=tickCnt;i>=0;i-- ){
				  if( parseFloat(this.yLabels[i]) == 0 ){
					this.yZero = sX + (xg * tempcnt);
				  }
				  tempcnt++;
				} 
				
				for(var i=0;i<tickCnt+1;i++){
					if( i<tickCnt  ){
					if( vo.theme.axisStyle == '1' || vo.theme.axisStyle == '2' || vo.theme.axisStyle == '3' ){
						
						if( vo.verticalFill.on ){
							if( i==0 && vo.theme.axisStyle == '1' ){
								this._roundedRect( ctx, eX, eY,xg,clacHeight,8, 'rgba(0,0,0,0)', true, false, false, false);
							}else if( i == tickCnt-1 && vo.theme.axisStyle == '1' ){
								this._roundedRect( ctx, eX, eY,xg,clacHeight,8, 'rgba(0,0,0,0)', false, true, false, false);
							}else{
								this._drawRect( ctx, sX, sY, sX+xg, sY, clacHeight, 'butt' );
							}	
							if( i%2 == 0 ){
								ctx.fillStyle = this.colorToRgba(vo.verticalFill.odd, vo.verticalFill.opacity);
								ctx.fill();
							}else{
								ctx.fillStyle = this.colorToRgba(vo.verticalFill.even, vo.verticalFill.opacity);
								ctx.fill();
							}
						}
						if(i!=0){
							if(vo.xAxis.showGridLine){
								this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', 1, vo.xAxis.color );
							}
						} 
						
						if( vo.zeroPlane ){
							if( this.yLabels[tickCnt-i] == 0 && i != 0 ){
								if( vo.is3D ){
									ctx.beginPath();
									ctx.moveTo(sX, sY);
									ctx.lineTo(sX-c4Bottom3DGap, sY+c4Bottom3DGap);
									ctx.lineTo(sX-c4Bottom3DGap, eY+c4Bottom3DGap);
									ctx.lineTo(sX, eY);
									ctx.lineCap = 'butt';
									ctx.closePath();
									ctx.fillStyle = this.colorToRgba(vo.zeroPlaneColor,0.2);
									ctx.fill();
									//this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
								}else{
									this._drawLine( ctx, parseInt(sX,10)+0.5, sY, parseInt(eX,10)+0.5, eY, 'butt', vo.zeroPlaneThickness, vo.zeroPlaneColor );
								}	
							}
						}
					}
					}
					// draw xLabel
					if( i <= tickCnt ) {
						// draw xLabel
						this.drawLabelRotate(ctx, sX, sY+bottom3DGap, i, xg, type, tickCnt);
					}
					sX = sX + xg;
					eX = eX + xg;
				}
				
			}
		};
		GLChart.prototype.drawLabel = function( ctx, sX, sY, count, gap, type ){
			var labelMargin = this.labelMargin;
    
			if( type == 'horizontal' ){
				if(!this.options.yAxis.label){return;}
				sX = sX - labelMargin;
				var tickCnt = this.yLabels.length;
				var fontSize = parseInt(this.options.yAxis.textStyle.fontSize,10);
				var fontName = this.options.yAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				ctx.font = fontSize+'px "'+fontName+'"';
				
				// maxLength
				var sLabel = this.yLabels[tickCnt - (count+1)];
				if( this.options.yAxis.maxLength != 'auto' ){
					var maxLength = parseInt(this.options.yAxis.maxLength,10) || 100;
					sLabel = sLabel.substring(0, maxLength)+'...';
				}
				
				ctx.textAlign = 'end';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = this.options.yAxis.textStyle.color;
				ctx.fillText(sLabel,sX,sY);
				
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}else if( type == 'horizontal_2' ){
				if(!this.options.yAxis2.label){return;}
				sX = sX + labelMargin;
				var tickCnt = this.yLabels2.length;
				var fontSize = parseInt(this.options.yAxis2.textStyle.fontSize,10);
				var fontName = this.options.yAxis2.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				ctx.font = fontSize+'px "'+fontName+'"';
				
				// maxLength
				var sLabel = this.yLabels2[tickCnt - (count+1)];
				if( this.options.yAxis2.maxLength != 'auto' ){
					var maxLength = parseInt(this.options.yAxis2.maxLength,10) || 100;
					sLabel = sLabel.substring(0, maxLength)+'...';
				}
				
				ctx.textAlign = 'start';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = this.options.yAxis2.textStyle.color;
				ctx.fillText(sLabel,sX,sY);
				
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}else if( type == 'vertical' ) {
				if(!this.options.xAxis.label){return;}
				sY = sY + labelMargin;
				if(this.options.xAxis.showTextEvery != 'auto'){
					if( count % this.options.xAxis.showTextEvery != 0 ){
						if( this.options.xAxis.showLastLabel ) {
							if( this.xLabels.length-1 != count ){
								return;
							}
						}else{
							return;
						}
					}
				}
				var fontSize = parseInt(this.options.xAxis.textStyle.fontSize,10);
				var fontName = this.options.xAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				
				ctx.font = fontSize+'px "'+fontName+'"';
			  
			    // maxLength
				var sLabel = (this.xLabels[count]);
				if( this.options.xAxis.maxLength != 'auto' ){
					var maxLength = parseInt(this.options.xAxis.maxLength,10) || 100;
					sLabel = sLabel.substring(0, maxLength)+'...';
				}
			  
				if( this.options.xAxis.slantedText ){
					var angle = this.options.xAxis.slantedTextAngle * Math.PI/180;
				
					ctx.fillStyle = this.options.xAxis.textStyle.color;
					ctx.textAlign = 'right';
					ctx.textBaseline = 'middle';
				  
					ctx.translate(sX+(gap/2), sY);
					ctx.rotate( -angle );
					ctx.fillText(sLabel,0,this.labelMargin);
					ctx.rotate( angle );
					ctx.translate( -(sX+(gap/2)), -sY );
				}else{
				
					if( this.options.xAxis.maxAlternation == 2 ) {
						var cntEven = count % 2;
						
						ctx.fillStyle = this.options.xAxis.textStyle.color;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'top';
						if( cntEven == 1 ) {
						  ctx.fillText(sLabel,sX+(gap/2),(sY + fontSize));
						} else {
						  ctx.fillText(sLabel,sX+(gap/2),sY);
						}
					} else {
						ctx.fillStyle = this.options.xAxis.textStyle.color;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'top';
						ctx.fillText(sLabel,sX+(gap/2),sY);
					}
				}
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}
		};
		GLChart.prototype.drawLabelRadar = function( ctx, sX, sY, count, a, type ){
			var labelMargin = this.labelMargin;
    
			if( type == 'arc' ){
				if(!this.options.yAxis.label){return;}
				sX = sX - labelMargin;
				var tickCnt = this.yLabels.length;
				var fontSize = parseInt(this.options.yAxis.textStyle.fontSize,10);
				var fontName = this.options.yAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				ctx.font = this.options.yAxis.textStyle.fontStyle+' '+fontSize+'px "'+fontName+'"';
				
				ctx.textAlign = 'end';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = this.options.yAxis.textStyle.color;
				
				if( this.options.customYAxisLabel.on ){
					var val = this.yLabels[tickCnt - (count+1)];
					try{val = this.options.customYAxisLabel.value[count];}catch(ex){}
					if( this.options.customYAxisLabel.positionType == 1 ){
						ctx.fillText(val,sX,sY);
					}else if( this.options.customYAxisLabel.positionType == 2 ){
						var radius		= this.calculatedMargins.diameter/2;
						var center		= this.calculatedMargins.center;
						var yTickCnt 	= this.yLabels.length;
						var yg			= radius/(yTickCnt-1);
						sX = sX + radius + yg;
						
						ctx.textAlign = 'start';
						ctx.textBaseline = 'middle';
						
						ctx.fillText(val,sX,sY);
					}else{
						ctx.fillText(val,sX,sY);
					}
				}else{
					ctx.fillText(this.yLabels[tickCnt - (count+1)],sX,sY);
				}
				
				ctx.font = 'normal '+gFontSize+'px "'+gFontName+'"';
				
			}else if( type == 'radius' ) {
				if(!this.options.xAxis.label){return;}
				var fontSize = parseInt(this.options.xAxis.textStyle.fontSize,10);
				var fontName = this.options.xAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				
				ctx.font = this.options.xAxis.textStyle.fontStyle+' '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = this.options.xAxis.textStyle.color;
				
				if( a == 0 ){
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';
				}else if( a == Math.PI ){
					ctx.textAlign = 'center';
					ctx.textBaseline = 'top';
				}else if( a > Math.PI ){
					ctx.textAlign = 'end';
					ctx.textBaseline = 'middle';
				}else if( a < Math.PI ){
					ctx.textAlign = 'start';
					ctx.textBaseline = 'middle';
				}
				ctx.fillText(this.xLabels[count],sX,sY);
				ctx.font = 'normal '+gFontSize+'px "'+gFontName+'"';
				
			}
		};
		GLChart.prototype.drawLabelCompact = function( ctx, sX, sY, count, gap, type ){
			var labelMargin = this.labelMargin;
    
			if( type == 'horizontal' ){
				if(!this.options.yAxis.label){return;}
				sX = sX - labelMargin;
				var tickCnt = this.yLabels.length;
				var fontSize = parseInt(this.options.yAxis.textStyle.fontSize,10);
				var fontName = this.options.yAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				ctx.font = fontSize+'px "'+fontName+'"';
				
				ctx.textAlign = 'end';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = this.options.yAxis.textStyle.color;
				ctx.fillText(this.yLabels[tickCnt - (count+1)],sX,sY);
				
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}else if( type == 'vertical' ) {
				if(!this.options.xAxis.label){return;}
				sY = sY + labelMargin;
				if(this.options.xAxis.showTextEvery != 'auto'){
					if( count % this.options.xAxis.showTextEvery != 0 ){
						if( this.options.xAxis.showLastLabel ) {
							if( this.xLabels.length-1 != count ){
								return;
							}
						}else{
							return;
						}
					}
				}
				
				var fontSize = parseInt(this.options.xAxis.textStyle.fontSize,10);
				var fontName = this.options.xAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				
				ctx.font = fontSize+'px "'+fontName+'"';
			  
				if( this.options.xAxis.slantedText ){
					var angle = this.options.xAxis.slantedTextAngle * Math.PI/180;
				
					ctx.fillStyle = this.options.xAxis.textStyle.color;
					ctx.textAlign = 'right';
					ctx.textBaseline = 'middle';
				  
					ctx.translate(sX, sY);
					ctx.rotate( -angle );
					ctx.fillText(this.xLabels[count],0,this.labelMargin);
					ctx.rotate( angle );
					ctx.translate( -(sX), -sY );
				}else{
				
					if( this.options.xAxis.maxAlternation == 2 ) {
						var cntEven = count % 2;
						
						ctx.fillStyle = this.options.xAxis.textStyle.color;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'top';
						if( cntEven == 1 ) {
						  ctx.fillText(this.xLabels[count],sX,(sY + fontSize));
						} else {
						  ctx.fillText(this.xLabels[count],sX,sY);
						}
					} else {
						ctx.fillStyle = this.options.xAxis.textStyle.color;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'top';
						ctx.fillText(this.xLabels[count],sX,sY);
					}
				}
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}
		};
		GLChart.prototype.drawLabelRotate = function( ctx, sX, sY, count, gap, type, tickCnt ){
			var labelMargin = this.labelMargin;
    
			if( type == 'horizontal' ){
				if(!this.options.xAxis.label){return;}
				if( ((tickCnt-1)-count) % this.options.xAxis.showTextEvery != 1 && this.options.xAxis.showTextEvery != 1 && this.options.xAxis.showTextEvery != 'auto' ){
					return;
				}
				sX = (this.options.is3D)?(sX-labelMargin-this.bottom3DGap):(sX - labelMargin);
				var tickCnt = this.xLabels.length;
				var fontSize = parseInt(this.options.xAxis.textStyle.fontSize,10);
				var fontName = this.options.xAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				ctx.font = fontSize+'px "'+fontName+'"';
				
				// maxLength
				var sLabel = this.xLabels[tickCnt - (count+1)];
				if( this.options.xAxis.maxLength != 'auto' ){
					var maxLength = parseInt(this.options.xAxis.maxLength,10) || 100;
					sLabel = sLabel.substring(0, maxLength)+'...';
				}
				
				ctx.textAlign = 'end';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = this.options.xAxis.textStyle.color;
				ctx.fillText(sLabel,sX,sY-(gap/2));
				
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}else if( type == 'vertical' ) {
				if(!this.options.yAxis.label){return;}
				sY = sY + labelMargin;
				
				var fontSize = parseInt(this.options.yAxis.textStyle.fontSize,10);
				var fontName = this.options.yAxis.textStyle.fontName;
				var gFontSize = parseInt(this.options.fontSize,10);
				var gFontName = this.options.fontName;
				ctx.font = fontSize+'px "'+fontName+'"';
			  
				// maxLength
				var sLabel = this.yLabels[tickCnt-count];
				if( this.options.yAxis.maxLength != 'auto' ){
					var maxLength = parseInt(this.options.yAxis.maxLength,10) || 100;
					sLabel = sLabel.substring(0, maxLength)+'...';
				}
			  
				if( this.options.yAxis.slantedText ){
					var angle = this.options.yAxis.slantedTextAngle * Math.PI/180;
				
					ctx.fillStyle = this.options.yAxis.textStyle.color;
					ctx.textAlign = 'right';
					ctx.textBaseline = 'middle';
				  
					ctx.translate(sX, sY);
					ctx.rotate( -angle );
					ctx.fillText(sLabel,0,this.labelMargin);
					ctx.rotate( angle );
					ctx.translate( -sX, -sY );
				}else{
					ctx.fillStyle = this.options.yAxis.textStyle.color;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'top';
					ctx.fillText(sLabel,sX,sY);
				}
				ctx.font = gFontSize+'px "'+gFontName+'"';
				
			}
		};
		GLChart.prototype.drawCaptionText = function( type ){
			var ctx 	= this.graphics;
			var vo		= this.options;
			var gFontSize, gFontName, fontSize, fontName, fontColor, x, y;
			gFontSize = vo.fontSize;
			gFontName = vo.fontName;
			
			if( type == 'title' && vo.title != '' ){
				fontSize = vo.titleTextStyle.fontSize;
				fontName = vo.titleTextStyle.fontName;
				fontColor = vo.titleTextStyle.color;
				x = (this.calculatedMargins.w/2)+this.calculatedMargins.x;
				y = vo.chartArea.top;
				
				ctx.font = 'bold '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.fillText(vo.title,x,y);
			}else if( type == 'xName' && vo.xAxis.name != '' ){
				fontSize = vo.xAxis.nameTextStyle.fontSize;
				fontName = vo.xAxis.nameTextStyle.fontName;
				fontColor = vo.xAxis.nameTextStyle.color;
				x = (this.calculatedMargins.w/2)+this.calculatedMargins.x;
				y = this.sHeight - vo.chartArea.bottom;
				
				ctx.font = 'normal '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				ctx.fillText(vo.xAxis.name,x,y);
			}else if( type == 'yName' && vo.yAxis.name != '' ){
				fontSize = vo.yAxis.nameTextStyle.fontSize;
				fontName = vo.yAxis.nameTextStyle.fontName;
				fontColor = vo.yAxis.nameTextStyle.color;
				x = vo.chartArea.left;
				y = (this.calculatedMargins.h/2)+this.calculatedMargins.y;
				var angle = 90 * Math.PI/180;
				
				ctx.font = 'normal '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.translate(x, y);
				ctx.rotate( -angle );
				ctx.fillText(vo.yAxis.name,0,0);
				ctx.rotate( angle );
				ctx.translate(-x, -y);
			}else if( type == 'y2Name' && vo.yAxis2.name != '' ){
				fontSize = vo.yAxis2.nameTextStyle.fontSize;
				fontName = vo.yAxis2.nameTextStyle.fontName;
				fontColor = vo.yAxis2.nameTextStyle.color;
				x = this.sWidth-vo.chartArea.right;
				y = (this.calculatedMargins.h/2)+this.calculatedMargins.y;
				var angle = 90 * Math.PI/180;
				
				ctx.font = 'normal '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				ctx.translate(x, y);
				ctx.rotate( -angle );
				ctx.fillText(vo.yAxis2.name,0,0);
				ctx.rotate( angle );
				ctx.translate(-x, -y);
			}
			ctx.font = 'normal '+gFontSize+'px "'+gFontName+'"';
		};
		GLChart.prototype.drawCaptionTextRotate = function( type ){
			var ctx 	= this.graphics;
			var vo		= this.options;
			var gFontSize, gFontName, fontSize, fontName, fontColor, x, y;
			gFontSize = vo.fontSize;
			gFontName = vo.fontName;
			
			if( type == 'title' && vo.title != '' ){
				fontSize = vo.titleTextStyle.fontSize;
				fontName = vo.titleTextStyle.fontName;
				fontColor = vo.titleTextStyle.color;
				x = (this.calculatedMargins.w/2)+this.calculatedMargins.x;
				y = vo.chartArea.top;
				
				ctx.font = 'bold '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.fillText(vo.title,x,y);
			}else if( type == 'xName' && vo.yAxis.name != '' ){
				fontSize = vo.yAxis.nameTextStyle.fontSize;
				fontName = vo.yAxis.nameTextStyle.fontName;
				fontColor = vo.yAxis.nameTextStyle.color;
				x = (this.calculatedMargins.w/2)+this.calculatedMargins.x;
				y = this.sHeight - vo.chartArea.bottom;
				
				ctx.font = 'normal '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				ctx.fillText(vo.yAxis.name,x,y);
			}else if( type == 'yName' && vo.xAxis.name != '' ){
				fontSize = vo.xAxis.nameTextStyle.fontSize;
				fontName = vo.xAxis.nameTextStyle.fontName;
				fontColor = vo.xAxis.nameTextStyle.color;
				x = vo.chartArea.left;
				y = (this.calculatedMargins.h/2)+this.calculatedMargins.y;
				var angle = 90 * Math.PI/180;
				
				ctx.font = 'normal '+fontSize+'px "'+fontName+'"';
				ctx.fillStyle = fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.translate(x, y);
				ctx.rotate( -angle );
				ctx.fillText(vo.xAxis.name,0,0);
				ctx.rotate( angle );
				ctx.translate(-x, -y);
			}
			ctx.font = 'normal '+gFontSize+'px "'+gFontName+'"';
		};
		GLChart.prototype.redraw = function( o ){
			
			// google analytics(Trial version)
			if(window.location.protocol != 'file:' ){
				GLChart_ga('send', {
				  'hitType': 'pageview',
				  'page': window.location.host
				});
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}
			var vo = this.options;
			window.clearInterval(this.animationInst);
			if( vo.type == 'pie' ){
				this.drawPieSlice();
			}else if( vo.type == 'multipie' ){
				this.drawPieSlice();
			}else if( vo.type == 'line' ){
				this.drawLineChart();
			}else if( vo.type == 'area' ){
				this.drawAreaChart();
			}else if( vo.type == 'stackedArea' ){
				this.drawStackedAreaChart();
			}else if( vo.type == 'column' ){
				this.drawColumnChart();
			}else if( vo.type == 'stackedColumn' ){
				this.drawStackedColumnChart();
			}else if( vo.type == 'bar' ){
				this.drawBarChart();
			}else if( vo.type == 'stackedBar' ){
				this.drawStackedBarChart();
			}else if( vo.type == 'singleYCombination' ){
				this.drawSingleYCombinationChart();
			}else if( vo.type == 'dualYCombination' ){
				this.drawDualYCombinationChart();
			}else if( vo.type == 'scatter' ){
				if( this.options.xAxis.isValue && this.tempAData != null ){
					this.aData = this.tempAData;
					this.options.xAxis.isValue = true;
				}
				this.drawScatterChart();
			}else if( vo.type == 'bubble' ){
				this.drawBubbleChart();
			}else if( vo.type == 'radar' ){
				this.drawRadarChart();
			}else if( vo.type == 'areaRange' ){
				this.drawAreaRangeChart();
			}
			
			if( vo.legend.position != 'none' ){
				if(vo.type == 'bubble'){
					this.drawLegendBubble();
				}else{
					if( this.tempAData == null || !this.options.xAxis.isValue ){
						this.drawLegend();
					}else{
						if(this.options.type == 'scatter'){this.drawLegendSumScatter();}
					}
				}
			}
		};
		GLChart.prototype.setDataJsonSum = function( arg ){
			this.aData = arg[0];
			this.aSumData = [];
			
			if(arguments[0].length > 1){
				this.tempAData = [];
				var len = arguments[0].length;
				for( var i=0;i<len;i++ ){
					this.tempAData.push(arguments[0][i]);
				}
			}
				
			
		};
		GLChart.prototype.eventListener = function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var cb = function(elem){
				if(elem){
					if(elem.nodeName == "DIV" && elem.__canvas_body){
						eThis = elem.__canvas_body;
					}else{
						cb(elem.parentElement);
					}
				}
			};
			cb(target);
			if(!eThis){return;}
			var type = eThis.options.type;
			if( type == 'pie' ){
				eThis.canvas_event_func_pie(e);
			}else if( type == 'multipie' ){
				eThis.canvas_event_func_pie(e);
			}else if( type == 'line' ){
				eThis.canvas_event_func_line(e);
			}else if( type == 'area' ){
				eThis.canvas_event_func_area(e);
			}else if( type == 'stackedArea' ){
				eThis.canvas_event_func_stackedArea(e);
			}else if( type == 'column' ){
				if( eThis.chartType == 'targetColumn' ){
					eThis.canvas_event_func_targetColumn(e);
				}else{
					eThis.canvas_event_func_column(e);
				}	
			}else if( type == 'stackedColumn' ){
				eThis.canvas_event_func_stackedColumn(e);
			}else if( type == 'bar' ){
				eThis.canvas_event_func_bar(e);
			}else if( type == 'stackedBar' ){
				eThis.canvas_event_func_stackedBar(e);
			}else if( type == 'singleYCombination' ){
				eThis.canvas_event_func_sYCombi(e);
			}else if( type == 'dualYCombination' ){
				eThis.canvas_event_func_dYCombi(e);
			}else if( type == 'scatter' ){
				eThis.canvas_event_func_scatter(e);
			}else if( type == 'bubble' ){
				eThis.canvas_event_func_bubble(e);
			}else if( type == 'radar' ){
				eThis.canvas_event_func_radar(e);
			}else if( type == 'areaRange' ){
				eThis.canvas_event_func_areaRange(e);
			}
		};
		GLChart.prototype.eventListener_Range = function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body_range;
			var chartElem, chartCanvas;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body_range){
					eThis = elem.__canvas_body_range;
					chartElem = elem;
				}else if(elem.nodeName == "canvas" ){
					chartCanvas = elem;
					cb(elem.parentElement);
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			var type = eThis.options.type;
			if( type == 'pie' ){
				eThis.canvas_event_func_pie(e);
			}else if( type == 'multipie' ){
				eThis.canvas_event_func_pie(e);
			}else if( type == 'line' ){
				eThis.range_event_func(e, chartElem);
			}else if( type == 'area' ){
				eThis.range_event_func(e, chartElem);
			}else if( type == 'stackedArea' ){
				eThis.range_event_func(e, chartElem);
			}else if( type == 'column' ){
				if( eThis.chartType == 'targetColumn' ){
					eThis.range_event_func(e, chartElem);
				}else{
					eThis.range_event_func(e, chartElem);
				}	
			}else if( type == 'stackedColumn' ){
				eThis.range_event_func(e, chartElem);
			}else if( type == 'bar' ){
				eThis.canvas_event_func_bar(e);
			}else if( type == 'stackedBar' ){
				eThis.canvas_event_func_stackedBar(e);
			}else if( type == 'singleYCombination' ){
				eThis.range_event_func(e, chartElem);
			}else if( type == 'dualYCombination' ){
				eThis.range_event_func(e, chartElem);
			}else if( type == 'scatter' ){
				eThis.canvas_event_func_scatter(e);
			}else if( type == 'radar' ){
				eThis.canvas_event_func_radar(e);
			}else if( type == 'areaRange' ){
				eThis.range_event_func(e, chartElem);
			}
		};
		GLChart.prototype.range_event_func = function(e, chartElem){
			
			var vo 			= this.options;
			var handleW 	= vo.xRange.handlesStyle.width;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			var mx 			= mouseCoords[0];
			var my 			= mouseCoords[1];
			var hw			= vo.xRange.handlesStyle.width;
			var hSx			= (this.rangeSx-(hw/2));
			var hSx2		= (this.rangeSx2+(hw/2));
			
			if(e.type=='mousemove'){
				if( hSx < mx 
					&& mx < (hSx+handleW) 
					&& (this.calculatedMargins.y+this.calculatedMargins.h) < my 
					&& (this.sHeight - vo.chartArea.bottom) > my ){
					document.body.style.cursor = 'ew-resize';
				}else if( hSx2 < mx 
					&& mx < (hSx2+handleW)
					&& (this.calculatedMargins.y+this.calculatedMargins.h) < my 
					&& (this.sHeight - vo.chartArea.bottom) > my ){
					document.body.style.cursor = 'ew-resize';
				}else if( (hSx+handleW) < mx 
					&& mx < (hSx2)
					&& (this.calculatedMargins.y+this.calculatedMargins.h) < my 
					&& (this.sHeight - vo.chartArea.bottom) > my ){
					document.body.style.cursor = 'move';
				}else{
					document.body.style.cursor = 'default';
				}
			
			
				if( this.rangeFlag ){
					this.selectRangePoint(e, chartElem, 'F');
				}else if( this.rangeFlag2 ){
					this.selectRangePoint(e, chartElem, 'S');
				}else if( this.rangeFlagCenter ){
					this.selectRangePoint(e, chartElem, 'C');
				}	
			}else if( e.type=='mousedown' ){
				if( hSx < mx 
					&& mx < (hSx+handleW) 
					&& (this.calculatedMargins.y+this.calculatedMargins.h) < my 
					&& (this.sHeight - vo.chartArea.bottom) > my ){
					this.rangeFlag = true;
					this.rangeEventSx = mx;
				}else if( hSx2 < mx 
					&& mx < (hSx2+handleW)
					&& (this.calculatedMargins.y+this.calculatedMargins.h) < my 
					&& (this.sHeight - vo.chartArea.bottom) > my ){
					this.rangeFlag2 = true;
					this.rangeEventSx2 = mx;
				}else if( (hSx+handleW) < mx 
					&& mx < (hSx2)
					&& (this.calculatedMargins.y+this.calculatedMargins.h) < my 
					&& (this.sHeight - vo.chartArea.bottom) > my ){
					this.rangeFlagCenter = true;
					this.rangeEventSxCenter = mx;
				}
				
				this.moveSx = this.rangeSx;
				this.moveSx2 = this.rangeSx2;
			}else if( e.type=='mouseup' ){
				this.rangeFlag = false;
				this.rangeFlag2 = false;
				this.rangeFlagCenter= false;
				
				this.moveSx = null;
				this.moveSx2 = null;
			}
			if(!this.support_userAgent.ie){
				e.preventDefault();
			}
		};
		GLChart.prototype.selectRangePoint = function(e, chartElem, flag){
			
			var vo 			= this.options;
			var handleW 	= vo.xRange.handlesStyle.width;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			var mx 			= mouseCoords[0];
			var my 			= mouseCoords[1];
			
			if( flag == 'F' ){
				var moveX = this.rangeEventSx - mx;
				if( moveX < 0 ){
					moveX = Math.abs(moveX);
					this.rangeSx = this.moveSx + moveX;
				}else if( moveX > 0 ){
					moveX = Math.abs(moveX);
					this.rangeSx = this.moveSx - moveX;
				}
				
				if( this.rangeSx < this.rangeLeftSx ){
					this.rangeSx = this.rangeLeftSx;
				}else if( this.rangeSx > this.rangeSx2 ){
					this.rangeSx = this.rangeSx2;
				}else if( this.rangeSx > (this.rangeLeftSx + this.rangeAreaWidth - handleW) ){
					this.rangeSx = (this.rangeLeftSx + this.rangeAreaWidth - handleW);
				}
				
			}else if( flag == 'S' ){
				var moveX = this.rangeEventSx2 - mx;
				if( moveX < 0 ){
					moveX = Math.abs(moveX);
					this.rangeSx2 = this.moveSx2 + moveX;
				}else if( moveX > 0 ){
					moveX = Math.abs(moveX);
					this.rangeSx2 = this.moveSx2 - moveX;
				}
				
				if( this.rangeSx2 < this.calculatedMargins.x ){
					this.rangeSx2 = this.calculatedMargins.x;
				}else if( this.rangeSx2 < this.rangeSx ){
					this.rangeSx2 = this.rangeSx;
				}else if( this.rangeSx2 > (this.calculatedMargins.x + this.calculatedMargins.w - handleW) ){
					this.rangeSx2 = (this.calculatedMargins.x + this.calculatedMargins.w - handleW);
				}
			}else if( flag == 'C' ){
				var rSx = this.rangeSx;
				var rSx2 = this.rangeSx2;
			
				var moveX = this.rangeEventSxCenter - mx;
				if( moveX < 0 ){
					moveX = Math.abs(moveX);
					this.rangeSx = this.moveSx + moveX;
					this.rangeSx2 = this.moveSx2 + moveX;
				}else if( moveX > 0 ){
					moveX = Math.abs(moveX);
					this.rangeSx = this.moveSx - moveX;
					this.rangeSx2 = this.moveSx2 - moveX;
				}
				
				if( this.rangeSx < this.rangeLeftSx ){
					this.rangeSx = this.rangeLeftSx;
					this.rangeSx2 = rSx2;
				}else if( this.rangeSx2 > (this.rangeLeftSx + this.rangeAreaWidth - handleW) ){
					this.rangeSx = rSx;
					this.rangeSx2 = (this.rangeLeftSx + this.rangeAreaWidth - handleW);
				}
			}
			
			this.setRangeData();
			
		};
		GLChart.prototype.setRangeData = function(){
			var w = this.rangeAreaWidth;
			var s = this.calculatedMargins.x;
			var l = this.calculatedMargins.x + w;
			var len = this.aData_org.length-1;
			var litem = w / len;
			
			var nH = this.rangeSx - s;
			var nH2 = l - (this.rangeSx2 + this.options.xRange.handlesStyle.width);
			
			if(this.options.type == 'area' || this.options.type == 'stackedArea'){
				len = this.aData_org.length-2;
				litem = w / len;
				nH = Math.floor(nH / litem);
				nH2 = (len+1) - Math.round(nH2 / litem);
			}else if(this.options.type == 'stackedColumn' || this.options.type == 'column' || this.options.type == 'targetColumn'){
				nH = Math.floor(nH / litem);
				nH2 = len - Math.round(nH2 / litem);
			}else if(this.options.type == 'areaRange'){
				len = this.aData_org.length-2;
				litem = w / len;
				nH = Math.floor(nH / litem);
				nH2 = (len+1) - Math.round(nH2 / litem);
			}else{
				nH = Math.floor(nH / litem);
				nH2 = len - Math.floor(nH2 / litem);
			}
			
			var dataTitle = this.aData_org[0];
			var tempArr = this.aData_org;
			tempArr = tempArr.slice(1, tempArr.length);
			this.aData = tempArr.slice(nH, nH2);
			this.aData.unshift(dataTitle); 
			this.rangeStartIndex = nH;
			
			if(this.options.type == 'areaRange'){
				var rangeData_org = this.oRangeData_org;
				for( var prop in rangeData_org ){
					var dataTitle = rangeData_org[prop][0];
					var tempArr2 = rangeData_org[prop];
					tempArr2 = tempArr2.slice(1, tempArr2.length);
					this.oRangeData[prop] = tempArr2.slice(nH, nH2);
					this.oRangeData[prop].unshift(dataTitle); 
					this.rangeStartIndex = nH;
				}
				
			}
			
			var ani = this.options.animation;
			this.options.animation = false;
			if(this.options.type == 'areaRange'){
				this.updateData_range(this.aData, this.oRangeData);
			}else{
				this.updateData_range(this.aData);
			}
			
			this.options.animation = ani;
			
			
			//document.getElementById('chart_test').innerHTML = nH+", "+nH2+", "+len;
			//document.getElementById('chart_test').innerHTML = this.aData;
		};
		GLChart.prototype.setEvent = function( setObj ){
			if( setObj == 'range' ){
				//var o = GLChart.$(this.sContainer+'___xRangeLayout_div');
				var o = GLChart.$(this.sContainer);
				o.__canvas_body_range = this;
				this.setTouchEvent_Range();
				this.addEvent("mousedown", o, this.eventListener_Range);
				this.addEvent("mousemove", o, this.eventListener_Range);
				this.addEvent("mouseup", o, this.eventListener_Range);
			}else if( setObj == 'body' ){
				var o = GLChart.$(this.sContainer);
				o.__canvas_body = this;
				this.setTouchEvent();
				this.addEvent("mousedown", o, this.eventListener);
				this.addEvent("mousemove", o, this.eventListener);
				this.addEvent("mouseup", o, this.eventListener);
			}
			
		};
		GLChart.prototype.drawRange = function(){
			var vo 			= this.options;
			var ctxHandle 	= this.graphics_xRangeHandle;
			var ctxPreview 	= this.graphics_xRangePreview;
			var hw			= vo.xRange.handlesStyle.width;
			var hh			= vo.xRange.handlesStyle.height;
			
			var backStrokeThickness= vo.xRange.background.strokeThickness || 0;
			var backStrokeColor= (backStrokeThickness == 0)? vo.xRange.background.fill : vo.xRange.background.strokeColor;
			var backfill1	= vo.xRange.background.fill;
			var backfill2	= vo.xRange.background.fill2;
			var backRoundedCorner= vo.xRange.background.roundedCorner;
			var backw		= this.calculatedMargins.w;
			
			var sx			= this.calculatedMargins.x;
			var previewH	= vo.xRange.preview.height;
			var backsy		= (backStrokeThickness == 0)? 1:backStrokeThickness;
			var backh		= hh-(backsy*2);
			
			if( !this.hasRange ){
				this.rangeSx		= sx;
				this.rangeSx2		= (sx+backw)-hw;
				this.rangeAreaWidth	= backw;
				
				this.setEvent('range');
				
				if( vo.xRange.preview.on ){
					backsy = backsy+previewH;
					this.drawRangePreview();
					if(!this.support_userAgent.ie){
						this.setImage();
					}	
				}else{
					this.rangeLeftSx= sx;
				}
				// range back area ===============================================================================
				ctxPreview.lineWidth = backStrokeThickness;
				this._roundedRect(ctxPreview, this.rangeSx, backsy, backw, backh, backRoundedCorner, backStrokeColor, true, true, true, true);
				var grd=ctxPreview.createLinearGradient(this.rangeSx, backsy, this.rangeSx, backsy+backh); 
				grd.addColorStop(0,backfill1);  
				grd.addColorStop(1,backfill2); 
				ctxPreview.fillStyle = grd;
				ctxPreview.fill();
				// range back area ===============================================================================
				
				this.hasRange = true;
				
			}
			// draw range handles ============================================================================
			this.drawRangeHandles();
		};
		GLChart.prototype.drawRangePreview = function(){
			var vo 			= this.options;
			var ctxPreview 	= this.graphics_xRangePreview;
			var backw		= this.calculatedMargins.w;
			var previewH	= vo.xRange.preview.height;
			var backStrokeThickness= vo.xRange.previewBackground.strokeThickness || 0;
			var backStrokeColor= (backStrokeThickness == 0)? vo.xRange.previewBackground.fill : vo.xRange.previewBackground.strokeColor;
			var sx			= this.calculatedMargins.x;
			this.rangeLeftSx= sx;
			
			this._roundedRect(ctxPreview, sx%2==0?sx+0.5:sx, 0, backw, previewH, 0, backStrokeColor, true, true, true, true);
			ctxPreview.fillStyle = this.colorToRgba( vo.xRange.previewBackground.fill, vo.xRange.previewBackground.opacity );
			ctxPreview.fill();
			ctxPreview.strokeStyle = backStrokeColor;
			ctxPreview.stroke();
		};
		GLChart.prototype.drawRangeHandles = function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_xRangeHandle;
			var hw			= vo.xRange.handlesStyle.width;
			var hh			= vo.xRange.handlesStyle.height;
			var previewH	= vo.xRange.preview.height;
			var hStrokeThickness= vo.xRange.handlesStyle.strokeThickness || 0;
			var hStrokeColor= (hStrokeThickness == 0)? vo.xRange.handlesStyle.fill : vo.xRange.handlesStyle.strokeColor;
			var hfill1		= vo.xRange.handlesStyle.fill;
			var hfill2		= vo.xRange.handlesStyle.fill2;
			var hRoundedCorner= vo.xRange.handlesStyle.roundedCorner;
			
			var rangeCenterColor = vo.xRange.rangeArea.fill;
			var rangeCenterOpacity = vo.xRange.rangeArea.opacity;
			
			var sy			= (hStrokeThickness == 0)? 1:(hStrokeThickness/2);
			hh				= hh-(sy*2);
			var hSx			= (this.rangeSx-(hw/2));
			var hSx2		= (this.rangeSx2+(hw/2));
			
			// clear range
			this.clearRect( this.oCanvas_xRangeHandle, ctx, this.sWidth, vo.xRange.handlesStyle.height+previewH);
			
			if( vo.xRange.preview.on ){
				sy = sy+previewH;
				//,previewHandles:{strokeColor:'#919191', strokeThickness:1, fill:'#000000', opacity:0.3}
				var pvStrokeColor	= vo.xRange.previewHandles.strokeColor;
				var pvStrokeWidth	= vo.xRange.previewHandles.strokeThickness;
				var pvFill			= vo.xRange.previewHandles.fill;
				var pvOpacity		= vo.xRange.previewHandles.opacity;
				
				if( vo.theme.rangeSelectorStyle == 1 || vo.theme.rangeSelectorStyle == 2 ){
					// draw preview (Left, Right) area rect =================
					var pvLSx = this.rangeLeftSx%1==0?this.rangeLeftSx+0.5:this.rangeLeftSx;
					var pvLw = (this.rangeSx-pvLSx)%1==0?(this.rangeSx-pvLSx):(this.rangeSx-pvLSx)-0.5;
					pvLw = pvLw < 1? 0:pvLw;
					var pvRSx = (this.rangeSx2+hw);
					pvRSx = pvRSx%1==0?pvRSx+0.5:pvRSx;
					var pvRw = (this.calculatedMargins.x+this.calculatedMargins.w)-pvRSx;
					pvRw = pvRw%1==0?pvRw:pvRw+0.5;
					var pvH = previewH%1==0?previewH-0.5:previewH;
					this._roundedRect(ctx, pvLSx, 0, pvLw, pvH, 0, pvStrokeColor, true, true, true, true);
					ctx.fillStyle = this.colorToRgba( pvFill, pvOpacity );
					ctx.fill();
					this._roundedRect(ctx, pvRSx, 0, pvRw, pvH, 0, pvStrokeColor, true, true, true, true);
					ctx.fillStyle = this.colorToRgba( pvFill, pvOpacity );
					ctx.fill();
				}
				if( vo.theme.rangeSelectorStyle == 2 ){
					// draw preview area center rect ========================
					var handleStroke = 2;
					
					var pvCSx = this.rangeSx%1==0? this.rangeSx-0.5:this.rangeSx;
					var pvCw = (this.rangeSx2-this.rangeSx)+vo.xRange.handlesStyle.width;
					pvCw = (pvCw+pvCSx)%1==0? pvCw+0.5:pvCw;
					var pvCH = previewH%1==0?previewH-0.5:previewH;
					this._roundedRect(ctx, pvCSx, 0, pvCw+1, pvCH, 0, hStrokeColor, true, true, true, true);
					ctx.lineWidth = handleStroke;
					this._roundedRect(ctx, pvCSx+1.5, 2, pvCw-2, pvCH-(handleStroke*2)+0.5, 0, hfill1, true, true, true, true);
					ctx.lineWidth = 1;
					this._roundedRect(ctx, pvCSx+handleStroke+1, handleStroke+1.5, pvCw-(handleStroke*2)-1, pvCH-(handleStroke*2)-2.5, 0, hStrokeColor, true, true, true, true);
				}
			}
			
			
			
			if( (vo.theme.rangeSelectorStyle == 1 || !vo.xRange.preview.on) && vo.xRange.type == 'range' ){
				ctx.lineWidth = hStrokeThickness;
				// range center area ========================================
				//this._roundedRect(ctx, hSx+hw+4, sy, ((hSx2-hSx)-hw)-8, hh, hRoundedCorner, 'rgba(0,0,0,0)', true, true, true, true);
				this._roundedRect(ctx, hSx+hw-4, sy-1, ((hSx2-hSx)-hw)+8, hh+2, hRoundedCorner, 'rgba(0,0,0,0)', true, true, true, true);
				ctx.fillStyle = this.colorToRgba( rangeCenterColor, rangeCenterOpacity );
				ctx.fill();
				// range handle 1 ===========================================
				this._roundedRect(ctx, hSx, sy-1, hw, hh+2, hRoundedCorner, hStrokeColor, true, true, true, true);
				var grd2=ctx.createLinearGradient(this.rangeSx, sy, this.rangeSx, sy+hh); 
				grd2.addColorStop(0,hfill1);  
				grd2.addColorStop(1,hfill2); 
				ctx.fillStyle = grd2;
				ctx.fill();
				// range handle 2 ===========================================
				this._roundedRect(ctx, hSx2, sy-1, hw, hh+2, hRoundedCorner, hStrokeColor, true, true, true, true);
				var grd3=ctx.createLinearGradient(this.rangeSx2, sy, this.rangeSx2, sy+hh); 
				grd3.addColorStop(0,hfill1);  
				grd3.addColorStop(1,hfill2); 
				ctx.fillStyle = grd3;
				ctx.fill();
				
				if( vo.xRange.handlesStyle.isPattern ){
					var lineCenterS = (hSx+(hw/3));
					var lineCenterSy= sy+(hh/2);
					var lineCenterGap = 4;
					this._drawLine( ctx, lineCenterS, lineCenterSy-lineCenterGap, lineCenterS, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+1, lineCenterSy-lineCenterGap, lineCenterS+1, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS+3, lineCenterSy-lineCenterGap, lineCenterS+3, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+4, lineCenterSy-lineCenterGap, lineCenterS+4, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS+6, lineCenterSy-lineCenterGap, lineCenterS+6, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+7, lineCenterSy-lineCenterGap, lineCenterS+7, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					
					var lineCenterS2 = (hSx2+(hw/3));
					this._drawLine( ctx, lineCenterS2, lineCenterSy-lineCenterGap, lineCenterS2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+1, lineCenterSy-lineCenterGap, lineCenterS2+1, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS2+3, lineCenterSy-lineCenterGap, lineCenterS2+3, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+4, lineCenterSy-lineCenterGap, lineCenterS2+4, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS2+6, lineCenterSy-lineCenterGap, lineCenterS2+6, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+7, lineCenterSy-lineCenterGap, lineCenterS2+7, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
				}
			}else if( vo.xRange.type == 'scroll' ){
				// range center area ========================================
				
				this._roundedRect(ctx, this.rangeSx+hw, sy, this.rangeSx2-this.rangeSx-hw, hh, hRoundedCorner, hStrokeColor, true, true, true, true);
				var grd4=ctx.createLinearGradient(this.rangeSx, sy, this.rangeSx, sy+hh); 
				grd4.addColorStop(0,hfill1);  
				grd4.addColorStop(1,hfill2); 
				ctx.fillStyle = grd4;
				ctx.fill();
				// range handle 1 ===========================================
				this._roundedRect(ctx, this.rangeSx, sy, hw, hh, 0, hStrokeColor, true, true, true, true);
				var grd2=ctx.createLinearGradient(this.rangeSx, sy, this.rangeSx, sy+hh); 
				grd2.addColorStop(0,hfill1);  
				grd2.addColorStop(1,hfill2); 
				ctx.fillStyle = grd2;
				ctx.fill();
				// range handle 2 ===========================================
				this._roundedRect(ctx, this.rangeSx2, sy, hw, hh, 0, hStrokeColor, true, true, true, true);
				var grd3=ctx.createLinearGradient(this.rangeSx2, sy, this.rangeSx2, sy+hh); 
				grd3.addColorStop(0,hfill1);  
				grd3.addColorStop(1,hfill2); 
				ctx.fillStyle = grd3;
				ctx.fill();
				
				var lineCenterS = this.rangeSx+((this.rangeSx2-this.rangeSx)/2);
				var lineCenterSy= sy+(hh/2);
				var lineCenterGap = 4;
				this._drawLine( ctx, lineCenterS+5, lineCenterSy-lineCenterGap, lineCenterS+5, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
				this._drawLine( ctx, lineCenterS+8, lineCenterSy-lineCenterGap, lineCenterS+8, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
				this._drawLine( ctx, lineCenterS+11, lineCenterSy-lineCenterGap, lineCenterS+11, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
				
				// left arrow ===============================================
				var leftTriangleCenterS = this.rangeSx+(hw/3);
				var leftTriangleLineCenterSy= (hh/2)+lineCenterGap/2;
				ctx.beginPath();
				ctx.moveTo(leftTriangleCenterS, leftTriangleLineCenterSy);
				ctx.lineTo(leftTriangleCenterS+5, leftTriangleLineCenterSy-4);
				ctx.lineTo(leftTriangleCenterS+5, leftTriangleLineCenterSy+4);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = hStrokeColor;
				ctx.fill();
				
				// right arrow ==============================================
				var rightTriangleCenterS = this.rangeSx2+(hw/3);
				ctx.beginPath();
				ctx.moveTo(rightTriangleCenterS+5, leftTriangleLineCenterSy);
				ctx.lineTo(rightTriangleCenterS, leftTriangleLineCenterSy-4);
				ctx.lineTo(rightTriangleCenterS, leftTriangleLineCenterSy+4);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = hStrokeColor;
				ctx.fill();
				
			}else if( vo.theme.rangeSelectorStyle == 2 ){
				// range center area ========================================
				this._roundedRect(ctx, hSx+(hw/2), sy, (hSx2-hSx), hh, hRoundedCorner, 'rgba(0,0,0,0)', true, true, true, true);
				ctx.fillStyle = this.colorToRgba( rangeCenterColor, rangeCenterOpacity );
				ctx.fill();
				
				if( vo.xRange.handlesStyle.isPattern ){
					var lineCenterS = (hSx+(hw/2)+4.5);
					var lineCenterSy= previewH/2;
					var lineCenterGap = 4;
					this._drawLine( ctx, lineCenterS, lineCenterSy-lineCenterGap, lineCenterS, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+1, lineCenterSy-lineCenterGap, lineCenterS+1, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS+2, lineCenterSy-lineCenterGap, lineCenterS+2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+3, lineCenterSy-lineCenterGap, lineCenterS+3, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS+4, lineCenterSy-lineCenterGap, lineCenterS+4, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+5, lineCenterSy-lineCenterGap, lineCenterS+5, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					
					var lineCenterS2 = (hSx2+(hw/2)-9.5);
					this._drawLine( ctx, lineCenterS2, lineCenterSy-lineCenterGap, lineCenterS2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+1, lineCenterSy-lineCenterGap, lineCenterS2+1, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS2+2, lineCenterSy-lineCenterGap, lineCenterS2+2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+3, lineCenterSy-lineCenterGap, lineCenterS2+3, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS2+4, lineCenterSy-lineCenterGap, lineCenterS2+4, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+5, lineCenterSy-lineCenterGap, lineCenterS2+5, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
				}
			}else if( vo.theme.rangeSelectorStyle == 3 ){
				// range center area ========================================
				this._roundedRect(ctx, hSx+(hw/2), sy, (hSx2-hSx), hh, hRoundedCorner, 'rgba(0,0,0,0)', true, true, true, true);
				ctx.fillStyle = this.colorToRgba( rangeCenterColor, rangeCenterOpacity );
				ctx.fill();
				
				if( vo.xRange.handlesStyle.isPattern ){
					var lineCenterS = (hSx+(hw/2)+4.5);
					var lineCenterSy= previewH/2;
					var lineCenterGap = 4;
					this._drawLine( ctx, lineCenterS, lineCenterSy-lineCenterGap, lineCenterS, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+1, lineCenterSy-lineCenterGap, lineCenterS+1, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS+2, lineCenterSy-lineCenterGap, lineCenterS+2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+3, lineCenterSy-lineCenterGap, lineCenterS+3, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS+4, lineCenterSy-lineCenterGap, lineCenterS+4, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS+5, lineCenterSy-lineCenterGap, lineCenterS+5, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					
					var lineCenterS2 = (hSx2+(hw/2)-9.5);
					this._drawLine( ctx, lineCenterS2, lineCenterSy-lineCenterGap, lineCenterS2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+1, lineCenterSy-lineCenterGap, lineCenterS2+1, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS2+2, lineCenterSy-lineCenterGap, lineCenterS2+2, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+3, lineCenterSy-lineCenterGap, lineCenterS2+3, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
					this._drawLine( ctx, lineCenterS2+4, lineCenterSy-lineCenterGap, lineCenterS2+4, lineCenterSy+lineCenterGap, 'butt', 1, hfill1 );
					this._drawLine( ctx, lineCenterS2+5, lineCenterSy-lineCenterGap, lineCenterS2+5, lineCenterSy+lineCenterGap, 'butt', 1, hStrokeColor );
				}
			}
		};
		GLChart.prototype.setImage = function(){
			var canvas = this.oCanvas_xRangePreview;
			var ctx = this.graphics_xRangePreview;
		
			// this.calculatedMargins.h : this.options.xRange.preview.sheight = this.sHeight : 
			var h = parseInt((this.options.xRange.preview.height * this.sHeight) / this.calculatedMargins.h, 10)-4;
			var t = parseInt((this.options.xRange.preview.height * this.calculatedMargins.y) / this.calculatedMargins.h, 10);
		
			var img = Canvas2Image.saveAsPNG(this.oCanvas_item , true);
			img.style.height = h+'px';
			img.style.width = this.sWidth+'px';
			
			if( this.options.type == 'singleYCombination' ||  this.options.type == 'dualYCombination' ){
				var img2 = Canvas2Image.saveAsPNG(this.oCanvas_item2 , true);
				img2.style.height = h+'px';
				img2.style.width = this.sWidth+'px';
				var img3 = Canvas2Image.saveAsPNG(this.oCanvas_item3 , true);
				img3.style.height = h+'px';
				img3.style.width = this.sWidth+'px';
			}
			
			var elem2 = document.createElement('span');
			elem2.width = this.sWidth;
			elem2.height = this.options.xRange.preview.height;
			elem2.style.position = 'absolute';
			elem2.style.top = '-'+t+'px';
			elem2.style.display = 'block';
			elem2.appendChild(img);
			if( this.options.type == 'singleYCombination' ||  this.options.type == 'dualYCombination' ){
				var elem3 = document.createElement('span');
				elem3.width = this.sWidth;
				elem3.height = this.options.xRange.preview.height;
				elem3.style.position = 'absolute';
				elem3.style.top = '-'+t+'px';
				elem3.style.display = 'block';
				elem3.appendChild(img2);
				var elem4 = document.createElement('span');
				elem4.width = this.sWidth;
				elem4.height = this.options.xRange.preview.height;
				elem4.style.position = 'absolute';
				elem4.style.top = '-'+t+'px';
				elem4.style.display = 'block';
				elem4.appendChild(img3);
			}
			
			var elem = document.getElementById(this.sContainer+'___xRangeLayout_div');
			elem.style.padding = '-'+t+'px';
			elem.appendChild(elem2);
			if( this.options.type == 'singleYCombination' ||  this.options.type == 'dualYCombination' ){
				elem.appendChild(elem3);
				elem.appendChild(elem4);
			}
			
		};
		GLChart.prototype.updateData_range = function( d, rd ){
			
			try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){};
			if( this.options.type == 'scatter' ){
				this.tempAData = null;
				if(arguments.length > 1){
					this.setDataJsonSum( arguments );
				}else{
					this.setDataJson( d );
				}
			}else if(this.options.type == 'areaRange'){
				this.setDataJson( d );
				this.setRangeDataJson( rd );
			}else{
				this.setDataJson( d );
			}
			this.redraw();
		};
		GLChart.prototype.returnEventData = function( e, aSelect ){
			
			var vo			= this.options;
			var labels		= this.aData;
			var returnData 	= {};
			
			if(typeof vo.events.click == 'function'){
				if( vo.type == 'pie' ){
					returnData.index = aSelect+1;
					returnData.data = [ (labels[aSelect+1][0]), (labels[aSelect+1][1]) ];
					vo.events.click(e, returnData);
				}else if( vo.type == 'column' ){
					returnData.index = [this.rangeStartIndex + aSelect[0]+1, aSelect[1]+1];
					returnData.data = labels[aSelect[0]+1];
					vo.events.click(e, returnData);
				}else if( vo.type == 'stackedColumn' ){
					returnData.index = this.rangeStartIndex + aSelect[0]+1;
					returnData.data = [ (labels[aSelect[0]+1][0]), (labels[aSelect[0]+1][aSelect[1]+1]) ];
					vo.events.click(e, returnData);
				}else if( vo.type == 'line' || vo.type == 'area' ){
					returnData.index = this.rangeStartIndex + aSelect[0]+1;
					returnData.data = [ (labels[aSelect[0]+1][0]), (labels[aSelect[0]+1][aSelect[1]+1]) ];
					vo.events.click(e, returnData);
				}else if( vo.type == 'singleYCombination' ){
					returnData.index = this.rangeStartIndex + aSelect[0]+1;
					returnData.titleIndex = aSelect[1]+1;
					returnData.data = [ (labels[aSelect[0]+1][0]), (labels[aSelect[0]+1][aSelect[1]+1]) ];
					vo.events.click(e, returnData);
				}else if( vo.type == 'bubble' ){
				
					var xx = this.coordinate[aSelect[1]][aSelect[0]].x;
					var yy = this.coordinate[aSelect[1]][aSelect[0]].y; 
				
					returnData.index = aSelect[0];
					returnData.data = {
						x:this.aBubbleData[aSelect[1]].x[aSelect[0]]
						,y:this.aBubbleData[aSelect[1]].y[aSelect[0]]
						,radius:this.aBubbleData[aSelect[1]].radius[aSelect[0]]
						,pointX : xx
						,pointY : yy
					};
					if(e.type == "mousemove"){
						vo.events.mousemove(e, returnData);
					}else if(e.type == "click"){
						vo.events.click(e, returnData);
					}
					
				}else if( vo.type == 'areaRange' ){
				
					var xx = this.coordinate[aSelect[1]][aSelect[0]].x;
					var yy = this.coordinate[aSelect[1]][aSelect[0]].y; 
				
					returnData.index = [aSelect[1]+1, this.rangeStartIndex + aSelect[0]+1];
					returnData.data = {
						x: (labels[aSelect[0]+1][0])
						,y:(labels[aSelect[0]+1][aSelect[1]+1])
						,pointX : xx
						,pointY : yy
					};
					vo.events.click(e, returnData);
				}
			}
			
			
		};
		GLChart.prototype.seriesSelected = function( e, aSelect ){
			var x = this.coordinate[i][j].x;
			var y = this.coordinate[i][j].y;
			var width = this.coordinate[i][j].width;
			var height = y + this.coordinate[i][j].height;
			
			
		};
		GLChart.prototype.saveAsImage = function( imgType ){
			if( !imgType ){
				imgType = 'PNG';
			}
			
			if(this.support_userAgent.ie){
				return false;
			}
			
			var pCanvas = null;
			var vo = this.options;
			if( 
				vo.type == 'pie'
				|| vo.type == 'multipie'
			){
			
				var img1 = this.getBase64Img( this.oCanvas_body );
				this.graphics_image.drawImage(img1, 0, 0);
				if( vo.legend.position != 'none' ){
					var img2 = this.getBase64Img( this.oCanvas_legend );
					this.graphics_image.drawImage(img2, parseInt(this.legendLeft,10), parseInt(this.legendTop,10));
				}
				pCanvas = this.oCanvas_body_image;
			}else if( 
						vo.type == 'line'
						|| vo.type == 'area'
						|| vo.type == 'stackedArea'
						|| vo.type == 'column'
						|| vo.type == 'stackedColumn'
						|| vo.type == 'bar'
						|| vo.type == 'stackedBar'
						|| vo.type == 'scatter'
						|| vo.type == 'bubble'
						|| vo.type == 'radar'
						|| vo.type == 'areaRange'
			){
				
				var img1 = this.getBase64Img( this.oCanvas_body );
				var img2 = this.getBase64Img( this.oCanvas_grid );
				var img3 = this.getBase64Img( this.oCanvas_item );
				
				this.graphics_image.drawImage(img1, 0, 0);
				this.graphics_image.drawImage(img2, 0, 0);
				this.graphics_image.drawImage(img3, 0, 0);
				
				if( vo.xRange.on ){
					var xNTSize = parseInt(this.options.xAxis.nameTextStyle.fontSize,10);
					var yNTSize = parseInt(this.options.yAxis.nameTextStyle.fontSize,10);
					if( this.options.type == 'bar' || this.options.type == 'stackedBar' ){
						var xNTMargin = this.options.yAxis.name==''?0:yNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
					}else{
						var xNTMargin = this.options.xAxis.name==''?0:xNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
					}
					
					var xrangeHeight = (this.options.xRange.preview.on)? 
									   (this.options.xRange.preview.height
										+(parseInt(this.options.xRange.preview.margin,10)*2)
										+this.options.xRange.handlesStyle.height)
									   : this.options.xRange.handlesStyle.height;
					var xrangeTop = this.sHeight - (this.options.chartArea.bottom + xrangeHeight + xNTMargin);
					
					var img4 = this.getBase64Img( this.oCanvas_xRangePreview );
					var img5 = this.getBase64Img( this.oCanvas_xRangeHandle );
					this.graphics_image.drawImage(img4, 0, xrangeTop);
					this.graphics_image.drawImage(img5, 0, xrangeTop);
				}
				if( vo.legend.position != 'none' ){
					var img6 = this.getBase64Img( this.oCanvas_legend );
					this.graphics_image.drawImage(img6, parseInt(this.legendLeft,10), parseInt(this.legendTop,10));
				}
				pCanvas = this.oCanvas_body_image;
				
			
			}else if( 
						vo.type == 'singleYCombination'
						|| vo.type == 'dualYCombination'
			){
				var img1 = this.getBase64Img( this.oCanvas_body );
				var img2 = this.getBase64Img( this.oCanvas_grid );
				var img3 = this.getBase64Img( this.oCanvas_item );
				var img3_2 = this.getBase64Img( this.oCanvas_item2 );
				var img3_3 = this.getBase64Img( this.oCanvas_item3 );
				
				this.graphics_image.drawImage(img1, 0, 0);
				this.graphics_image.drawImage(img2, 0, 0);
				this.graphics_image.drawImage(img3, 0, 0);
				this.graphics_image.drawImage(img3_2, 0, 0);
				this.graphics_image.drawImage(img3_3, 0, 0);
				
				if( vo.xRange.on ){
					var xNTSize = parseInt(this.options.xAxis.nameTextStyle.fontSize,10);
					var yNTSize = parseInt(this.options.yAxis.nameTextStyle.fontSize,10);
					if( this.options.type == 'bar' || this.options.type == 'stackedBar' ){
						var xNTMargin = this.options.yAxis.name==''?0:yNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
					}else{
						var xNTMargin = this.options.xAxis.name==''?0:xNTSize+(this.labelMargin*3);	// 여백을 좀더 넓힘. *3
					}
					
					var xrangeHeight = (this.options.xRange.preview.on)? 
									   (this.options.xRange.preview.height
										+(parseInt(this.options.xRange.preview.margin,10)*2)
										+this.options.xRange.handlesStyle.height)
									   : this.options.xRange.handlesStyle.height;
					var xrangeTop = this.sHeight - (this.options.chartArea.bottom + xrangeHeight + xNTMargin);
					
					var img4 = this.getBase64Img( this.oCanvas_xRangePreview );
					var img5 = this.getBase64Img( this.oCanvas_xRangeHandle );
					this.graphics_image.drawImage(img4, 0, xrangeTop);
					this.graphics_image.drawImage(img5, 0, xrangeTop);
				}
				if( vo.legend.position != 'none' ){
					var img6 = this.getBase64Img( this.oCanvas_legend );
					this.graphics_image.drawImage(img6, parseInt(this.legendLeft,10), parseInt(this.legendTop,10));
				}
				pCanvas = this.oCanvas_body_image;
			}
			
			if( !pCanvas ){
				return false;
			}
			var bRes = false;
			if (imgType == "PNG"){
				bRes = Canvas2Image.getPNGString(pCanvas, true);
				
				var elem = document.createElement('a');
				elem.id = this.sContainer+'_imgDownload';
				elem.download = this.sContainer+'_download.png';
				elem.href = bRes;
				elem.style.display = 'none';
				elem.style.position = 'absolute';
				document.body.appendChild(elem);
				this.fire_event('click',document.getElementById(this.sContainer+'_imgDownload'));
				document.body.removeChild(document.getElementById(this.sContainer+'_imgDownload'));
			}	
			if (imgType == "BMP"){
				bRes = Canvas2Image.saveAsBMP(pCanvas);
			}	
			if (imgType == "JPEG"){
				bRes = Canvas2Image.saveAsJPEG(pCanvas);
			}
			if (!bRes) {
				alert("Sorry, this browser is not capable of saving " + imgType + " files!");
				return false;
			}
			
		};
		GLChart.prototype.getBase64Img = function( oCanvas ){
			//return oCanvas.toDataURL("image/png");
		
			return Canvas2Image.saveAsPNG(oCanvas , true);
		};
		GLChart.prototype.fire_event = function(evtNm, element) {
			var e = null;
			if (document.createEventObject) {
				//ie
				e = document.createEventObject();                    
				element.fireEvent('on'+evtNm, e);
			}else {
				//others
				e = document.createEvent('HTMLEvents');
				e.initEvent(evtNm, true, true);
				element.dispatchEvent(e);
			}
		};
		GLChart.prototype.smoothPath = function(path, smoothness, join, c) {
		
			/*
				var canvas = document.getElementById('canvas');
				var c = canvas.getContext('2d');
				var path = [{x: 100, y: 100}, {x: 20, y: 150}, {x: 200, y: 200}, {x: 100, y: 100}];
				var smoothness = 1.05;
				var joinPath = true;
				c.beginPath();
				smoothPath(path, smoothness, joinPath, c);
				c.stroke();
				c.closePath();
			*/
		
			this.lineIntersect = function(line1, line2) {
				var ua = ((line2[1].x-line2[0].x)*(line1[0].y-line2[0].y)-(line2[1].y-line2[0].y)*(line1[0].x-line2[0].x)) / ((line2[1].y-line2[0].y)*(line1[1].x-line1[0].x) - (line2[1].x-line2[0].x)*(line1[1].y-line1[0].y));							

				var x = line1[0].x + ua *(line1[1].x -line1[0].x);
				var y = line1[0].y + ua *(line1[1].y-line1[0].y);			

				if (ua <= 0 || ua > 1 || parseFloat(ua) != ua-0) {
					return false;
				} else {
					return {x: x, y: y};
				}
			};


			if (path.length < 2){
				return;
			}

			if (path.length == 2) {
				c.moveTo(path[0].x, path[0].y);
				c.lineTo(path[1].x, path[1].y);
				return;
			}

			if (path.length == 0){
				return;
			}	
			
			path[path.length] = path[1];

			for (var i = 0; i < path.length; i++) {

				if (i > 0 && i < path.length) {

					var s1 = {x:0, y:0};
					var s2 = {x:0, y:0};

					if (i == path.length - 1) {
						s2.x = path[i-1].x + (path[i-1].x - path[i-2].x);
						s2.y = path[i-1].y + (path[i-1].y - path[i-2].y);

					} else {
						s2.x = path[i].x + (path[i].x - path[i+1].x);
						s2.y = path[i].y + (path[i].y - path[i+1].y);
					}

					if (i <= 1) {
						if (join) {
							s1.x = path[i-1].x + (path[i-1].x - path[path.length-3].x);
							s1.y = path[i-1].y + (path[i-1].y - path[path.length-3].y);
						} else {
							s1.x = s2.x;
							s1.y = s2.y;
						}
					} else {

						s1.x = path[i-1].x + (path[i-1].x - path[i-2].x);
						s1.y = path[i-1].y + (path[i-1].y - path[i-2].y);

					}

					// fix unnecessary curvy last segments
					if (i == path.length - 2 && !join) {
						s2 = s1;
					}

					var intersect = this.lineIntersect([path[i-1], s1], [path[i], s2]);

					// if they intersect the bezier curve will have a loop. so just take the intersection as the point
					if (intersect) {
						s1 = s2 = intersect;
					}

					var s1a = {x:0, y:0};
					var s2a = {x:0, y:0};

					s1a.x = path[i-1].x + smoothness * (s1.x - path[i-1].x);
					s1a.y = path[i-1].y + smoothness * (s1.y - path[i-1].y);
					s2a.x = path[i].x + smoothness * (s2.x - path[i].x);
					s2a.y = path[i].y + smoothness * (s2.y - path[i].y);

					var s1b = {x:0, y:0}, s2b = {x:0, y:0};

					s1b.x = path[i-1].x + 0.5 * (s1a.x - path[i-1].x);
					s1b.y = path[i-1].y + 0.5 * (s1a.y - path[i-1].y);
					s2b.x = path[i].x + 0.5 * (s2a.x - path[i].x);
					s2b.y = path[i].y + 0.5 * (s2a.y - path[i].y);

					var m = {x:0, y:0};

					m.x = path[i-1].x + (path[i].x - path[i-1].x)/2;
					m.y = path[i-1].y + (path[i].y - path[i-1].y)/2;

					var pc1 = {x:0, y:0}, pc2 = {x:0, y:0};

					pc1.x = s1b.x + (m.x - s1b.x)/2;
					pc1.y = s1b.y + (m.y - s1b.y)/2;

					pc2.x = s2b.x + (m.x - s2b.x)/2;
					pc2.y = s2b.y + (m.y - s2b.y)/2;

					if (i < path.length - 1 || (!join && i == path.length + (join ? 0 : 1))) {
						c.lineTo(path[i-1].x, path[i-1].y);
						c.bezierCurveTo(pc1.x, pc1.y, pc2.x, pc2.y, path[i].x, path[i].y);
					}						
				}
			}

			path.pop();
		};
		GLChart.prototype.makeImagePattern = function( ctx, callback ){
			
			var _self = this;
			var arr = this.aImgData;
			var _ctx = ctx;
			var _arr = arr;
			var _callback = callback;
			var imgCnt = 0, url='', aImg=[], aImgPattern=[], oldUrl;
			
			if( _self.options.type == 'bar' ){
				
				for( var i=this.aImgData.length-1, len=this.aImgData.length; i>0; i-- ){
					
					for( var j=1, len2=this.aImgData[i].length; j<len2; j++ ){
						url = this.aImgData[i][j];
						if( url == '' || url == null || !url ){
							var a = '';
						}else{
							var bCreateImg = true;
							for( var k=0, len3=aImg.length; k<len3; k++ ){
								oldUrl = aImg[k];
								if( url == aImg[k] ){
									bCreateImg = false;
									break;
								}
							}
							if( bCreateImg ){
								aImg.push(url);
							}
						}
					}
				}
				
				var cb = function(){
					
					for( var i=_self.aImgData.length-1, len=_self.aImgData.length; i>0; i-- ){
						for( var j=1, len2=_self.aImgData[i].length; j<len2; j++ ){
							url = _self.aImgData[i][j];
							if( url == '' || url == null || !url ){
								var a = '';
							}else{
								for( var k=0, len3=aImg.length; k<len3; k++ ){
									oldUrl = aImg[k];
									if( url == aImg[k] ){
										
										for( var d=0,pattLen=aImgPattern.length; d<pattLen; d++ ){
											if( url == aImgPattern[d][0] ){
												_arr[i][j] = aImgPattern[d][1];
												break;
											}
										}
										break;
									}
								}
							}
						}
					}
					arr = _arr;
					_callback(arr);
				};
				for( var k=0, len3=aImg.length; k<len3; k++ ){
					
					var img = new Image();
					img.src = aImg[k];
					img._url = aImg[k];
					img.onload = function(){
						var pattern = _ctx.createPattern(this, 'repeat');
						aImgPattern.push([this._url, pattern]);
						if( aImgPattern.length == len3 ){
							cb();
						}
					};
					
				}
				
			}else{
			
				for( var i=1, len=this.aImgData.length; i<len; i++ ){
					
					for( var j=1, len2=this.aImgData[i].length; j<len2; j++ ){
						url = this.aImgData[i][j];
						if( url == '' || url == null || !url ){
							var a = '';
						}else{
							var bCreateImg = true;
							for( var k=0, len3=aImg.length; k<len3; k++ ){
								oldUrl = aImg[k];
								if( url == aImg[k] ){
									bCreateImg = false;
									break;
								}
							}
							if( bCreateImg ){
								aImg.push(url);
							}
						}
					}
				}
				
				var cb = function(){
					
					for( var i=1, len=_self.aImgData.length; i<len; i++ ){
						for( var j=1, len2=_self.aImgData[i].length; j<len2; j++ ){
							url = _self.aImgData[i][j];
							if( url == '' || url == null || !url ){
								var a = '';
							}else{
								for( var k=0, len3=aImg.length; k<len3; k++ ){
									oldUrl = aImg[k];
									if( url == aImg[k] ){
										for( var d=0,pattLen=aImgPattern.length; d<pattLen; d++ ){
											if( url == aImgPattern[d][0] ){
												_arr[i][j] = aImgPattern[d][1];
												break;
											}
										}
										break;
									}
								}
							}
						}
					}
					arr = _arr;
					_callback(arr);
				};
				for( var k=0, len3=aImg.length; k<len3; k++ ){
					
					var img = new Image();
					img.src = aImg[k];
					img._url = aImg[k];
					img.onload = function(){
						var pattern = _ctx.createPattern(this, 'repeat');
						aImgPattern.push([this._url, pattern]);
						if( aImgPattern.length == len3 ){
							cb();
						}
					};
					
				}
			}
			
		};
		
		// 외부노출 메서드==================================================
		GLChart.prototype.setDataJson = function( aData ){
			this.aData = aData;
			if( !this.hasRange ){
				this.aData_org = aData;
			}	
			this.aSumData = [];
			var total = 0;
			if(this.options.type == 'pie') {
				var len = this.aData.length;
				for(var i=1;i<len;i++) {
					total += parseFloat(this.aData[i][1]);
				}
				this.aSumData.push(total);
			}else if(this.options.type == 'multipie') {
				var len = this.aData.length;
				var len2 = this.aData[0].length;
				for( var i=1;i<len2;i++ ) {
					total = 0;
					for( var j=1;j<len;j++ ){
						total += parseFloat(this.aData[j][i]);
					}
					this.aSumData.push(total);
				}
			}else if(this.options.type == 'stackedColumn' || this.options.type == 'stackedBar' || this.options.type == 'stackedArea') {
				var len = this.aData.length;
				var len2 = this.aData[0].length;
				for( var i=1;i<len;i++ ) {
					total = 0;
					for( var j=1;j<len2;j++ ){
						if( isNaN(parseFloat(this.aData[i][j])) ){
							continue;
						}
						total += parseFloat(this.aData[i][j]);
					}
					this.aSumData.push(total);
				}
			}
			
			if(arguments.length > 1){
				this.tempAData = [];
				var len = arguments.length;
				for( var i=0;i<len;i++ ){
					this.tempAData.push(arguments[i]);
				}
			}
			
			// multi stacked column용 데이타 셋팅.
			if(this.options.type == 'stackedColumn' && arguments.length > 1){
				this.aData2 = arguments[1];
				var len = this.aData2.length;
				var len2 = this.aData2[0].length;
				for( var i=1;i<len;i++ ) {
					total = 0;
					for( var j=1;j<len2;j++ ){
						if( isNaN(parseFloat(this.aData2[i][j])) ){
							continue;
						}
						total += parseFloat(this.aData2[i][j]);
					}
					this.aSumData2.push(total);
				}
			}
			
			
		};
		GLChart.prototype.setImagesUrl = function( aData ){
			this.aImgData = aData;
		};
		GLChart.prototype.setRangeDataJson = function( oData ){
			this.oRangeData = oData;
			if( !this.hasRange ){
				this.oRangeData_org = {};
				for( var prop in oData ){
					this.oRangeData_org[prop] = oData[prop];
				}
			
			}
		};
		GLChart.prototype.setDataXml = function( sXml ){
			var xmlDom = this.DOMParser( sXml );
			
			
		};
		GLChart.prototype.setSelection = function( arr ){
			// arr = [{row:2,column:1}];
			if( this.aData === null ){
				return;
			} 
			
			if( arr ){
			
				if(this.options.type == 'column'){
					var arrLen	= arr.length;
					this.aSelection = {};
					var row, col;
					for( var i=0;i<arrLen;i++ ){
						row = (arr[i].row)+'';
						col = (arr[i].column)+'';
						this.aSelection[row+'^'+col] = arr[i];
					}
				}else if(this.options.type == 'areaRange'){
					this.aSelectItem = arr;
				}else{
					var len 	= this.aData.length;
					var columnLen= this.aData[0].length-1;
					var tempArr	= [];
					var arrLen	= arr.length;
					
					for( var i=1;i<len;i++ ){
						tempArr.push(['false' ,new Array(columnLen)]);
					}
					
					for( var i=0;i<arrLen;i++ ){
						try{
							row = parseInt(arr[i].row,10);
							column = parseInt(arr[i].column,10);
						}catch(ex){
							row = 'false';
							column = 'false';
						}
						
						if( row != 'false' ){
							tempArr[row][0] = 'true';
						}
						if( column != 'false' && columnLen-1 >= column ){
							tempArr[row][1][column] = 'true';
						}
						
					}
					this.aSelectItem = tempArr;
					
					if( this.hasChart ){
						this.redraw();
					}
				}	
			}
		};
		GLChart.prototype.updateDataJson = function( d ){
			
			if( this.options.xRange.on ){
				this.hasRange = false;
				var ctx = this.graphics_xRangePreview;
				var previewH = this.options.xRange.preview.height;
				this.clearRect( this.oCanvas_xRangePreview, ctx, this.sWidth, this.options.xRange.handlesStyle.height+previewH);
				var elem = document.getElementById(this.sContainer+'___xRangeLayout_div');
				var len = elem.children.length;
				for( var i=0;i<len;i++ ){
					if(elem.children[i].tagName == 'SPAN'){
						elem.removeChild(elem.children[i]);
					}
				}
			}
			try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){};
			if( this.options.type == 'scatter' ){
				this.tempAData = null;
				if(arguments.length > 1){
					this.setDataJsonSum( arguments );
				}else{
					this.setDataJson( d );
				}
			}else if( this.options.type == 'bubble' ){
				if( arguments[1] && arguments[1].constructor == Object ){
					var o = arguments[1];
					this.applyOptions( this.options, o );
				}
			
				this.setDataJson(d);
				this.aBubbleData = [];
				this.setBubbleData();
			}else{
				this.setDataJson( d );
			}
			this.redraw();
		};
		GLChart.prototype.updateDataXml = function( xml ){
		};
		
		
		return GLChart;
	})();
	
	GLChart.Pie = function(){
		GLChart.call(this, arguments);
		this.segments = [];
		this.segments_org = [];
		this.aMoveSliceCenter = [];
		this.viewAngle = null;
		this.viewAngle2 = null;
		this.reColors = [];
		this.rePieSliceTextColors = [];
		this.rePieSliceShadow = [];
		this.reData = [];
		this.reCustomSliceTextData = [];
		this.reASelectItem = [];
		
		this.rePattern = [];
		
		this.options = {
			type : 'pie'
			,pieHeight : 10
			,startAngle : -90
			,pieSliceBorderColor : null
			,pieSliceText : 'label'
			,pieSlicePrefixTextArray : ['']
			,pieSliceTextArray : ['']
			,pieSliceTextLocation : 'in'
			,pieSliceTextGuideLineWidth : 1
			,pieSliceTextGuideLineColor : '#000'
			,pieSliceTextGuideLinePoint : false
			,pieSliceTextGuideLinePointSize : 5
			,pieSliceTitleTextStyle : {color:'#000', fontSize:12, fontName:'Gulim', fontStyle:'normal', fontAlign:'center'}
			,pieSlicePrefixTextStyle : {color:'#000', fontSize:12, fontName:'Gulim'}
			,pieSliceTextStyle : {color:'#000', fontName:'Gulim', fontSize:12}
			,pieSliceTextColors : ['#ffffff']
			,pieSliceTextBox : false
			,pieSliceTextBoxMargin : 8
			,pieSliceTextBoxOuterMargin : 40
			,pieSliceTextBoxOuterBottomMargin : 5
			,pieSliceTextBoxFill : '#000000'
			,pieSliceTextTitleBoxFill : '#000000'
			,pieSliceTextBoxStrokeColor : '#424242'
			,pieSliceTextBoxStrokeThickness : 1
			,pieSliceSelectAnimation : false
			,reverseCategories : false
			,centerHoleSize : 0
			,pieSliceMoveSize : 15
			,pieSliceGradientColor : true
			,pieSliceSelectionAll : false
			
			// 신규추가(2016.07.27)---------------
			,pieSliceBackgroundImg : false
			,pieSliceShadow : [false]
			// 신규추가(2016.07.27)---------------
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		
		// 신규추가(2016.07.27)---------------
		this.aImgPattern = [];
		// 신규추가(2016.07.27)---------------
	};
	GLChart.Pie.prototype = new GLChart([]);
	GLChart.extend(GLChart.Pie, {
		render : function( o ){
			var _self = this;
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				
				// 이미지 배경을 사용하고자 할때처리.
				if(this.support_userAgent.ie){
					this.options.pieSliceBackgroundImg = false;
					this.drawPieSlice();
				}else{
					if( this.options.pieSliceBackgroundImg && this.aImgData ){
						this.makeImagePattern( this.graphics, function( arr ){
							_self.aImgPattern = arr;
							_self.drawPieSlice();
						});
					}else{
						this.drawPieSlice();
					}
				}
				
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			if( this.options.events.click ){
				this.addEvent("click", o, this.eventListener);
			}
		},
		drawPieSlice : function(){
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				if( this.hasChart ){
					//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
					this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				}
				this.setSegments(360);
				this.setPieSlice(360);
			}
		},
		setAnimation : function(){
			
			var sA = 0.001;
			var acc = 7;
			var Angle = 360/acc;
			var pie = this;
			
			pie.animationInst = window.setInterval( function(){
				
				acc *= 1.12;
				if(acc>250){acc = 250;}
				Angle = 360/acc;
				sA += Angle;
				
				//pie.graphics.clearRect(0,0,pie.sWidth,pie.sHeight);
				pie.clearRect( pie.oCanvas_body, pie.graphics, pie.sWidth, pie.sHeight);
				pie.setSegments(sA);
				pie.setPieSlice(sA);
				
				if( sA > 360 ){
					//pie.graphics.clearRect(0,0,pie.sWidth,pie.sHeight);
					pie.clearRect( pie.oCanvas_body, pie.graphics, pie.sWidth, pie.sHeight);
					pie.setSegments(360);
					pie.setPieSlice(360);
					window.clearInterval(pie.animationInst);
				}
			},50);
			
		},
		setPieSlice : function(totalAngle){
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			if(pieArea.w < 0 || pieArea.h < 0){return;}
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/2.5;
			var holeRadius	= (radius-(radius-(vo.centerHoleSize/2)));
			var tempRadius	= radius;
			var tempHoleRadius	= holeRadius;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			
			var x, y, holeX, holeY, len=this.aData.length, color, darkColor, darkColor1, darkColor2, lightColor, g1, g1_2, g2, g3, sA,eA,sA2,eA2,holeSA,holeEA;
			var userAgent 	= this.userAgent();
			
			if( totalAngle == 360 && vo.pieSliceSelectionAll && !arguments[1] && vo.centerHoleSize == 0 ){
				this.setPieSliceSelectAll();
				return;
			}
			
			if( ctx ){
				
				// pie 넓이 조정.
				this.reViewAngle([margin, pieArea, pieHeight]);
				
				var tempCenter1 = (centerUp[0])*this.viewAngle;
				var tempCenter2 = (centerUp[1])*this.viewAngle2;
				
				// test
				for( var i=1;i<len;i++ ){
				
					color 		= this.reColors[i-1 % vo.colors.length];
					darkColor 	= this.adjustBrightness(color, -35);
					darkColor1 	= this.adjustBrightness(color, -98);
					darkColor2 	= this.adjustBrightness(color, -55);
					lightColor	= this.adjustBrightness(color, 65);
					// pie click 반지름 셋팅=======================================
					if( arguments[1] ){
						radius = tempRadius-vo.pieSliceMoveSize;
						if( this.segments_org[arguments[1]-1][0] == this.segments[i-1][0] ){
							centerUp 	= this.aMoveSliceCenter[i-1];
							centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
						}else{
							centerUp 	= [pieExtent/2, pieExtent/2];
							centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
						}
					}else{
						// this.aSelectItem 체크
						if( totalAngle == 360 ){
							if( this.aSelectItem != null ){
								radius = tempRadius-vo.pieSliceMoveSize;
								if( this.reASelectItem[i-1][0] == 'true' ){
									centerUp = this.aMoveSliceCenter[i-1];
									centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
									
								}else{
									centerUp 	= [pieExtent/2, pieExtent/2];
									centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
								}
							}
						}
					}
					
					if(vo.title != '' && i == 1){
						if(vo.titlePrefix != ''){
							ctx.font = vo.titlePrefixTextStyle.fontSize+'px "'+vo.titlePrefixTextStyle.fontName+'"';
							var tW = ctx.measureText(vo.titlePrefix).width;
							var tH = vo.titlePrefixTextStyle.fontSize;
							ctx.font = vo.titleTextStyle.fontSize+'px "'+vo.titleTextStyle.fontName+'"';
							var tW2 = ctx.measureText(vo.title).width;
							var tH2 = vo.titleTextStyle.fontSize;
							tH = Math.max(tH,tH2);
							
							ctx.beginPath();
							ctx.font = vo.titlePrefixTextStyle.fontSize+'px "'+vo.titlePrefixTextStyle.fontName+'"';
							ctx.textAlign = "left";
							ctx.textBaseline = 'bottom';
							ctx.fillStyle = vo.titlePrefixTextStyle.color;
							ctx.fillText(vo.titlePrefix,((pieExtent/2)-((tW+tW2)/2)), ((pieExtent/2)+(tH/2)));
							
							ctx.beginPath();
							ctx.font = vo.titleTextStyle.fontSize+'px "'+vo.titleTextStyle.fontName+'"';
							ctx.textAlign = "left";
							ctx.textBaseline = 'bottom';
							ctx.fillStyle = vo.titleTextStyle.color;
							//ctx.fontStretch = "wider";
							ctx.fillText(vo.title,tW+((pieExtent/2)-((tW+tW2)/2)), ((pieExtent/2)+(tH/2)));
						}else{
							ctx.beginPath();
							ctx.font = vo.titleTextStyle.fontStyle+' '+vo.titleTextStyle.fontSize+'px "'+vo.titleTextStyle.fontName+'"';
							ctx.textAlign = "center";
							ctx.textBaseline = 'middle';
							ctx.fillStyle = vo.titleTextStyle.color;
							//ctx.fontStretch = "wider";
							ctx.fillText(vo.title,centerUp[0],centerUp[1]);
						}
					}
					
					// pie click 반지름 셋팅=======================================
					if( vo.theme.seriesGradientStyle == 1 ){
						g1 = color;
						g1_2 = darkColor2;
					}else if( vo.theme.seriesGradientStyle == 2 ){
						g1 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
						g1.addColorStop(0, darkColor2);
						g1.addColorStop(0.9, color);
						g1.addColorStop(1, color);
						g1_2 = darkColor2;
					}else if( vo.theme.seriesGradientStyle == 3 ){
						g1 = ctx.createLinearGradient(centerUp[0]-radius, centerUp[1], centerUp[0]+radius, centerUp[1]+radius);
						g1.addColorStop(0, color);
						g1.addColorStop(0.2, lightColor);
						g1.addColorStop(0.45, color);
						g1.addColorStop(0.7, darkColor);
						g1.addColorStop(1, color);
						g1_2 = ctx.createLinearGradient(centerUp[0]-radius, centerUp[1], centerUp[0]+radius, centerUp[1]);
						g1_2.addColorStop(0, darkColor1);
						g1_2.addColorStop(0.5, darkColor);
						g1_2.addColorStop(0.7, color);
						g1_2.addColorStop(0.8, darkColor);
						g1_2.addColorStop(1, darkColor1);
					}
					
					g2 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
					g2.addColorStop(0, color);
					g2.addColorStop(0.89, color);
					g2.addColorStop(1, darkColor2);
					if( vo.centerHoleSize != 0 ){
						var innerG = (holeRadius/radius);
						
						g3 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
						g3.addColorStop(innerG, darkColor2);
						g3.addColorStop((innerG+0.1) > 1? 1:(innerG+0.1), color);
						g3.addColorStop(0.89, color);
						g3.addColorStop(1, darkColor2);
					}	
				
					if( vo.is3D ){
						// pie 호 부분======================================================================
						sA=(Math.PI/180)*this.segments[i-1][0];
						eA=(Math.PI/180)*this.segments[i-1][1];
						holeSA = (Math.PI/180)*this.segments[i-1][0];
						holeEA = (Math.PI/180)*this.segments[i-1][1];
						if( sA < 0 && eA > 0 && eA < Math.PI ){
							sA = 0;
						}
						if( sA < 0 && eA > 0 && eA > Math.PI ){
							sA = 0;
							eA = Math.PI;
						}
						if( sA > 0 && eA > Math.PI ){
							eA = Math.PI;
						}
						if( sA >= Math.PI && eA >= Math.PI ){
							sA = sA;
						}else{
							ctx.beginPath();
							ctx.arc(centerUp[0],centerUp[1],radius,sA,eA,false);
							ctx.arc(centerdown[0],centerdown[1],radius,eA,sA,true);
							ctx.closePath();
							ctx.fillStyle = g1_2;
							ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
							ctx.lineWidth=1; 
							ctx.lineJoin = 'round';
							ctx.stroke();
							ctx.fill();
						}
						if( vo.centerHoleSize != 0 ){
							ctx.beginPath();
							ctx.arc(centerUp[0],centerUp[1],holeRadius,holeSA,holeEA,false);
							ctx.arc(centerdown[0],centerdown[1],holeRadius,holeEA,holeSA,true);
							ctx.closePath();
							ctx.fillStyle = darkColor;
							ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
							ctx.lineWidth=1; 
							ctx.lineJoin = 'round';
							ctx.stroke();
							ctx.fill();
						}
						// pie 호 부분======================================================================
						
						// pie 옆면==========================================================================
						if(i != len-1 || totalAngle < 180){
							if( sA > Math.PI/2 ){
								x = centerUp[0] + radius * Math.cos(this.segments[i-1][0] * (Math.PI / 180));
								y = centerUp[1] + radius * Math.sin(this.segments[i-1][0] * (Math.PI / 180));
							}else{
								x = centerUp[0] + radius * Math.cos(this.segments[i-1][1] * (Math.PI / 180));
								y = centerUp[1] + radius * Math.sin(this.segments[i-1][1] * (Math.PI / 180));
							}
							if( vo.centerHoleSize == 0 ){
								ctx.beginPath();
								ctx.moveTo(centerUp[0], centerUp[1]);
								ctx.lineTo(x, y);
								ctx.lineTo(x, y+pieHeight);
								ctx.lineTo(centerdown[0], centerdown[1]);
								ctx.closePath();
							}else{
								if( sA > Math.PI/2 ){
									holeX = centerUp[0] + holeRadius * Math.cos(this.segments[i-1][0] * (Math.PI / 180));
									holeY = centerUp[1] + holeRadius * Math.sin(this.segments[i-1][0] * (Math.PI / 180));
								}else{
									holeX = centerUp[0] + holeRadius * Math.cos(this.segments[i-1][1] * (Math.PI / 180));
									holeY = centerUp[1] + holeRadius * Math.sin(this.segments[i-1][1] * (Math.PI / 180));
								}
								ctx.beginPath();
								ctx.moveTo(holeX, holeY);
								ctx.lineTo(x, y);
								ctx.lineTo(x, y+pieHeight);
								ctx.lineTo(holeX, holeY+pieHeight);
								ctx.closePath();
							}
							ctx.fillStyle = darkColor;
							ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
							ctx.lineWidth=1; 
							ctx.stroke();
							ctx.fill();
						}
						// pie 옆면==========================================================================
					}
					  
					// pie 윗면 =========================================================================
					sA2=(Math.PI/180)*this.segments[i-1][0];
					eA2=(Math.PI/180)*this.segments[i-1][1];
					
					ctx.beginPath();
					if( vo.centerHoleSize == 0 ){
						ctx.moveTo(centerUp[0], centerUp[1]);
						ctx.arc(centerUp[0], centerUp[1], radius, sA2, eA2, false);
						ctx.lineTo(centerUp[0], centerUp[1]);
					}else{
						ctx.arc(centerUp[0], centerUp[1], radius, sA2, eA2, false);
						ctx.arc(centerUp[0], centerUp[1], holeRadius, eA2, sA2, true);
					}
					ctx.closePath();
					if( userAgent.ie || !vo.pieSliceGradientColor ){
						ctx.fillStyle = color;
					}else{
						if( vo.centerHoleSize == 0 ){
							ctx.fillStyle = vo.is3D?g1:g2;
						}else{
							ctx.fillStyle = vo.is3D?g1:g3;
						}
					}
					
					// 이미지 배경을 사용하고자 할때처리.
					if( vo.pieSliceBackgroundImg && this.aImgData ){
						var pattern = this.rePattern[i-1];
						ctx.fillStyle = pattern;
						
					}
					
					if( !vo.is3D ){
						if(this.rePieSliceShadow[(i-1) % vo.pieSliceShadow.length]){
							ctx.shadowColor="rgba(0, 0, 0, 0.5)";
							ctx.shadowOffsetX=3;
							ctx.shadowOffsetY=3;
							ctx.shadowBlur=6;
						}
					}
					
					ctx.strokeStyle=vo.pieSliceBorderColor || color;
					ctx.lineWidth=1; 
					ctx.lineJoin = 'round';
					ctx.stroke();
					ctx.fill();
					
					if(this.rePieSliceShadow[(i-1) % vo.pieSliceShadow.length]){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
					}
					// pie 윗면 =========================================================================
					
					
					
				}
				ctx.restore();	
				if( totalAngle == 360 ){
					if( arguments[1] ){
						this.drawText(arguments[1]);
					}else{
						this.drawText();
					}	
				}
			}
			
			
		},
		setPieSliceSelectAll : function(totalAngle){
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			if(pieArea.w < 0 || pieArea.h < 0){return;}
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/2.5;
			var holeRadius	= (radius-(radius-(vo.centerHoleSize/2)));
			var tempRadius	= radius;
			var tempHoleRadius	= holeRadius;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			
			var totalAngle = 360;
			
			var x, y, holeX, holeY, len=this.aData.length, color, darkColor, darkColor1, darkColor2, lightColor;
			var g1, g1_2, g2, g3, sA,eA,sA2,eA2,holeSA,holeEA, centerUpSelect, centerDownSelect, moveArc=0, moveHoleArc=0, currArc;
			var userAgent 	= this.userAgent();
			
			
			// pie 넓이 조정.
			this.reViewAngle([margin, pieArea, pieHeight]);
			
			for( var i=1;i<len;i++ ){
			
				if(this.segments[i-1][0] == this.segments[i-1][1]){ continue; }
			
				color 		= this.reColors[i-1 % vo.colors.length];
				darkColor 	= this.adjustBrightness(color, -35);
				darkColor1 	= this.adjustBrightness(color, -98);
				darkColor2 	= this.adjustBrightness(color, -55);
				lightColor	= this.adjustBrightness(color, 65);
				
				
				centerUpSelect = this.aMoveSliceCenter[i-1];
				centerDownSelect = [centerUpSelect[0], centerUpSelect[1]+pieHeight];
				currArc = Math.abs(this.segments[i-1][0] - this.segments[i-1][1]);
				moveArc = (vo.pieSliceMoveSize * Math.sin(parseInt(currArc/2,10) * (Math.PI/180)))/2;
				moveHoleArc = (vo.pieSliceMoveSize * Math.sin(parseInt(currArc/2,10) * (Math.PI/180)))/2;
				sA2=(Math.PI/180)*(this.segments[i-1][0]+moveArc);
				eA2=(Math.PI/180)*(this.segments[i-1][1]-moveArc);
				
				radius = tempRadius;
				
				
				if(vo.title != ''){
					if(vo.titlePrefix != ''){
						ctx.font = vo.titlePrefixTextStyle.fontSize+'px "'+vo.titlePrefixTextStyle.fontName+'"';
						var tW = ctx.measureText(vo.titlePrefix).width;
						var tH = vo.titlePrefixTextStyle.fontSize;
						ctx.font = vo.titleTextStyle.fontSize+'px "'+vo.titleTextStyle.fontName+'"';
						var tW2 = ctx.measureText(vo.title).width;
						var tH2 = vo.titleTextStyle.fontSize;
						tH = Math.max(tH,tH2);
						
						ctx.beginPath();
						ctx.font = vo.titlePrefixTextStyle.fontSize+'px "'+vo.titlePrefixTextStyle.fontName+'"';
						ctx.textAlign = "left";
						ctx.textBaseline = 'bottom';
						ctx.fillStyle = vo.titlePrefixTextStyle.color;
						ctx.fillText(vo.titlePrefix,(centerUp[0]-((tW+tW2)/2)), (centerUp[1]+(tH/2)));
						
						ctx.beginPath();
						ctx.font = vo.titleTextStyle.fontSize+'px "'+vo.titleTextStyle.fontName+'"';
						ctx.textAlign = "left";
						ctx.textBaseline = 'bottom';
						ctx.fillStyle = vo.titleTextStyle.color;
						//ctx.fontStretch = "wider";
						ctx.fillText(vo.title,tW+(centerUp[0]-((tW+tW2)/2)), (centerUp[1]+(tH/2)));
					}else{
						ctx.beginPath();
						ctx.font = vo.titleTextStyle.fontStyle+' '+vo.titleTextStyle.fontSize+'px "'+vo.titleTextStyle.fontName+'"';
						ctx.textAlign = "center";
						ctx.textBaseline = 'middle';
						ctx.fillStyle = vo.titleTextStyle.color;
						//ctx.fontStretch = "wider";
						ctx.fillText(vo.title,centerUp[0],centerUp[1]);
					}
				}
				
				// pie click 반지름 셋팅=======================================
				if( vo.theme.seriesGradientStyle == 1 ){
					g1 = color;
					g1_2 = darkColor2;
				}else if( vo.theme.seriesGradientStyle == 2 ){
					g1 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
					g1.addColorStop(0, darkColor2);
					g1.addColorStop(0.9, color);
					g1.addColorStop(1, color);
					g1_2 = darkColor2;
				}else if( vo.theme.seriesGradientStyle == 3 ){
					g1 = ctx.createLinearGradient(centerUp[0]-radius, centerUp[1], centerUp[0]+radius, centerUp[1]+radius);
					g1.addColorStop(0, color);
					g1.addColorStop(0.2, lightColor);
					g1.addColorStop(0.45, color);
					g1.addColorStop(0.7, darkColor);
					g1.addColorStop(1, color);
					g1_2 = ctx.createLinearGradient(centerUp[0]-radius, centerUp[1], centerUp[0]+radius, centerUp[1]);
					g1_2.addColorStop(0, darkColor1);
					g1_2.addColorStop(0.5, darkColor);
					g1_2.addColorStop(0.7, color);
					g1_2.addColorStop(0.8, darkColor);
					g1_2.addColorStop(1, darkColor1);
				}
				
				g2 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
				g2.addColorStop(0, color);
				g2.addColorStop(0.89, color);
				g2.addColorStop(1, darkColor2);
				if( vo.centerHoleSize != 0 ){
					var innerG = (holeRadius/radius);
					
					g3 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
					g3.addColorStop(innerG, darkColor2);
					g3.addColorStop((innerG+0.1) > 1? 1:(innerG+0.1), color);
					g3.addColorStop(0.89, color);
					g3.addColorStop(1, darkColor2);
				}	
			
				if( vo.is3D ){
					// pie 호 부분======================================================================
					sA 		= (Math.PI/180)*this.segments[i-1][0];
					eA 		= (Math.PI/180)*this.segments[i-1][1];
					
					if( sA < 0 && eA > 0 && eA < Math.PI ){
						sA = 0;
					}
					if( sA < 0 && eA > 0 && eA > Math.PI ){
						sA = 0;
						eA = Math.PI;
					}
					if( sA > 0 && eA > Math.PI ){
						eA = Math.PI;
					}
					if( sA >= Math.PI && eA >= Math.PI ){
						sA = sA;
					}else{
						
						sA=(Math.PI/180)*(this.segments[i-1][0]+moveArc);
						eA=(Math.PI/180)*(this.segments[i-1][1]-moveArc);
						
						
						ctx.beginPath();
						ctx.arc(centerUp[0],centerUp[1],radius,sA,eA,false);
						ctx.arc(centerdown[0],centerdown[1],radius,eA,sA,true);
						ctx.closePath();
						ctx.fillStyle = g1_2;
						ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
						ctx.lineWidth=1; 
						ctx.lineJoin = 'round';
						ctx.stroke();
						ctx.fill();
					}
					if( vo.centerHoleSize != 0 ){
						holeSA 	= (Math.PI/180)*(this.segments[i-1][0]+moveHoleArc);
						holeEA 	= (Math.PI/180)*(this.segments[i-1][1]-moveHoleArc);
						
						ctx.beginPath();
						ctx.arc(centerUp[0],centerUp[1],holeRadius,holeSA,holeEA,false);
						ctx.arc(centerdown[0],centerdown[1],holeRadius,holeEA,holeSA,true);
						ctx.closePath();
						ctx.fillStyle = darkColor;
						ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
						ctx.lineWidth=1; 
						ctx.lineJoin = 'round';
						ctx.stroke();
						ctx.fill();
						
					}
					// pie 호 부분======================================================================
					
					// pie 옆면==========================================================================
					if(i != len-1 || totalAngle < 180){
						if( sA > Math.PI/2 ){
							x = centerUp[0] + radius * Math.cos((this.segments[i-1][0]+moveArc) * (Math.PI / 180));
							y = centerUp[1] + radius * Math.sin((this.segments[i-1][0]+moveArc) * (Math.PI / 180));
						}else{
							x = centerUp[0] + radius * Math.cos((this.segments[i-1][1]-moveArc) * (Math.PI / 180));
							y = centerUp[1] + radius * Math.sin((this.segments[i-1][1]-moveArc) * (Math.PI / 180));
						}
						if( vo.centerHoleSize == 0 ){
							ctx.beginPath();
							ctx.moveTo(centerUpSelect[0], centerUpSelect[1]);
							ctx.lineTo(x, y);
							ctx.lineTo(x, y+pieHeight);
							ctx.lineTo(centerDownSelect[0], centerDownSelect[1]);
							ctx.closePath();
						}else{
							
							holeX = centerUp[0] + holeRadius * Math.cos((this.segments[i-1][1]-moveHoleArc) * (Math.PI / 180));
							holeY = centerUp[1] + holeRadius * Math.sin((this.segments[i-1][1]-moveHoleArc) * (Math.PI / 180));
							
							ctx.beginPath();
							ctx.moveTo(holeX, holeY);
							ctx.lineTo(x, y);
							ctx.lineTo(x, y+pieHeight);
							ctx.lineTo(holeX, holeY+pieHeight);
							ctx.closePath();
						}
						ctx.fillStyle = darkColor;
						ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
						ctx.lineWidth=1; 
						ctx.stroke();
						ctx.fill();
					}
					// pie 옆면==========================================================================
				}
				  
				// pie 윗면 =========================================================================
				ctx.beginPath();
				if( vo.centerHoleSize == 0 ){
					ctx.moveTo(centerUpSelect[0], centerUpSelect[1]);
					ctx.arc(centerUp[0], centerUp[1], radius, sA2, eA2, false);
					ctx.lineTo(centerUpSelect[0], centerUpSelect[1]);
				}else{
				
					ctx.arc(centerUp[0], centerUp[1], radius, sA2, eA2, false);
					
					var moveHoleArc = ((Math.abs(this.segments[i-1][0] - this.segments[i-1][1]) * vo.pieSliceMoveSize) / holeRadius)/2;
					sA2=(Math.PI/180)*(this.segments[i-1][0]+moveHoleArc);
					eA2=(Math.PI/180)*(this.segments[i-1][1]-moveHoleArc);
					
					ctx.arc(centerUp[0], centerUp[1], holeRadius, eA2, sA2, true);
				}
				ctx.closePath();
				if( userAgent.ie || !vo.pieSliceGradientColor ){
					ctx.fillStyle = color;
				}else{
					if( vo.centerHoleSize == 0 ){
						ctx.fillStyle = vo.is3D?g1:g2;
					}else{
						ctx.fillStyle = vo.is3D?g1:g3;
					}
				}
				ctx.strokeStyle=vo.pieSliceBorderColor || color;
				ctx.lineWidth=1; 
				ctx.lineJoin = 'round';
				ctx.stroke();
				ctx.fill();
				// pie 윗면 =========================================================================
				
				
				
			}
			ctx.restore();
			this.drawText();
			
			
			
		},
		drawText : function(){
		
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/2.5;
			var radius_org	= radius;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			var guideLinePointSize = parseInt(vo.pieSliceTextGuideLinePointSize,10);
			
			var x, y, x0, y0, len=this.aData.length, color, darkColor;
			var total 	= this.aSumData[0];
			var oTempCenter1 = centerUp[0];
			var oTempCenter2 = centerUp[1];
			var tempCenter1 = (centerUp[0])*this.viewAngle;
			var tempCenter2 = (centerUp[1])*this.viewAngle2;
			var lineP = null;
			//var fontGap = 10;
			var textPosition= 1.3;
			
			var labelLeftCnt = 0;
			var labelRightCnt = 0;
			var leftStart_Y = 2;
			var rightStart_Y = 2;
			var leftCurrCnt = 0;
			var rightCurrCnt = 0;
			if( vo.pieSliceText == 'custom-label2' ){	// 좌우측 label개수 구하기
				for(var i=1;i<len;i++) {
					var angle =this.segments[i-1];
					var degrees = angle[1] - angle[0];
					degrees = angle[0] + degrees/2;
					
					if( arguments[0] ){
						if( this.segments_org[arguments[0]-1][0] == this.segments[i-1][0] ){
							radius = vo.pieSliceTextLocation == 'out'?radius_org:radius_org + vo.pieSliceMoveSize;
						}else{
							radius = radius_org - vo.pieSliceMoveSize;
						}
					}else{
						// this.aSelectItem 체크
						if( this.aSelectItem != null ){
							radius = radius_org - vo.pieSliceMoveSize;
							if( this.reASelectItem[i-1][0] == 'true' ){
								radius = vo.pieSliceTextLocation == 'out'?radius_org:radius_org + vo.pieSliceMoveSize;
							}
						}
						
					}
					
					x0 = centerUp[0] + Math.round(radius * Math.cos(degrees * (Math.PI / 180)));
					x0 = ((tempCenter1 * x0) / oTempCenter1)+margin[3];
					
					if( x0 > (centerUp[0] + margin[3]) ){	// 오른쪽
						labelRightCnt++;
					}else{
						labelLeftCnt++;
					}
				}
			}
			
			for(var i=1;i<len;i++) {
				var angle =this.segments[i-1];
				var degrees = angle[1] - angle[0];
				degrees = angle[0] + degrees/2;
				lineP = Math.cos(degrees * (Math.PI / 180));
				
				if( arguments[0] ){
					if( this.segments_org[arguments[0]-1][0] == this.segments[i-1][0] ){
						radius = vo.pieSliceTextLocation == 'out'?radius_org:radius_org + vo.pieSliceMoveSize;
					}else{
						radius = radius_org - vo.pieSliceMoveSize;
					}
				}else{
					// this.aSelectItem 체크
					if( this.aSelectItem != null ){
						radius = radius_org - vo.pieSliceMoveSize;
						if( this.reASelectItem[i-1][0] == 'true' ){
							radius = vo.pieSliceTextLocation == 'out'?radius_org:radius_org + vo.pieSliceMoveSize;
						}
					}
					
				}
			
				// percentage, value, label, none.
				var valPrefix = '';
				var valLabelTitle = '';
				switch(vo.pieSliceText){
				  case "none":{
					break;
				  }case "percentage":{
					var val = ((this.reData[i-1][1] * 100) / total).toFixed(1) + "%";
					break;
				  }case "value":{
					var val = this.formatter(this.reData[i-1][1], "#,##0");
					break;
				  }case "label":{
					var val = this.reData[i-1][0];
					break;
				  }case "custom-label":{
					var val = this.reCustomSliceTextData[(i-1) % vo.pieSliceTextArray.length];
					valPrefix = this.reCustomSlicePrefixTextData[(i-1) % vo.pieSlicePrefixTextArray.length];
				  }case "custom-label2":{
					var val = this.reCustomSliceTextData[(i-1) % vo.pieSliceTextArray.length];
					valPrefix = this.reCustomSlicePrefixTextData[(i-1) % vo.pieSlicePrefixTextArray.length];
					valLabelTitle = this.reData[i-1][0];
				  }
				}
				
				if( valPrefix == '' && val == '' ){
					continue;
				}
			
				if( vo.pieSliceTextLocation == 'out' && vo.pieSliceText != 'none' && parseFloat(this.reData[i-1][1]) != 0 ) {
				  x = centerUp[0] + Math.round(radius/0.85 * Math.cos(degrees * (Math.PI / 180)));
				  y = (centerUp[1]+(pieHeight/3)) + Math.round(radius/0.87 * Math.sin(degrees * (Math.PI / 180)));
				  x0 = centerUp[0] + Math.round(radius * Math.cos(degrees * (Math.PI / 180)));
				  y0 = centerUp[1] + Math.round(radius * Math.sin(degrees * (Math.PI / 180)));
				  x = ((tempCenter1 * x) / oTempCenter1)+margin[3];
				  y = ((tempCenter2 * y) / oTempCenter2)+margin[0];
				  x0 = ((tempCenter1 * x0) / oTempCenter1)+margin[3];
				  y0 = ((tempCenter2 * y0) / oTempCenter2)+margin[0];
				  
					if( vo.pieSliceTextGuideLineColor != 'none' ) {
					  
					  
						if( vo.pieSliceText != 'custom-label2' ){
					  
						  ctx.beginPath();
						  ctx.lineWidth = vo.pieSliceTextGuideLineWidth || 1;
						  ctx.moveTo(x0, y0);
						  /*
							if( angle[1] - angle[0] < 13 ){
								y = y-fontGap;
								fontGap -= 13;
							}else{
								fontGap = 13;
							}
						  */
						  ctx.lineTo(x, y);
						  if( lineP > 0 ) {
							//x = ((this.sWidth/2)+radius)+20;
							ctx.lineTo(x+29, y);
							x = x+30;
						  }else{
							//x = ((radius*0.85)-20);
							ctx.lineTo(x-29, y);
							x = x-30;
						  }
						  ctx.strokeStyle = vo.pieSliceTextGuideLineColor;
						  ctx.stroke();
						  ctx.closePath();
						  ctx.lineWidth = 1;
						  
						  // guide line point
						  if( vo.pieSliceTextGuideLinePoint ){
							var color = this.reColors[i-1 % vo.colors.length];
							var darkColor = this.adjustBrightness(color, -45);
							ctx.beginPath();
							ctx.arc(x0,y0,guideLinePointSize,0,Math.PI*2,false);
							ctx.fillStyle = color;
							ctx.fill();
							ctx.closePath();
							ctx.beginPath();
							ctx.arc(x0,y0,guideLinePointSize/3,0,Math.PI*2,false);
							ctx.strokeStyle = darkColor;
							ctx.fillStyle = darkColor;
							ctx.fill();
							ctx.lineWidth = 1;
							ctx.stroke();
							ctx.closePath();
						  }
						}
					  
					}
				}else{
					textPosition = arguments[0]?1.3:textPosition;
					var x = centerUp[0] + Math.round(radius/textPosition * Math.cos(degrees * (Math.PI / 180)));
					var y = centerUp[1] + Math.round(radius/textPosition * Math.sin(degrees * (Math.PI / 180)));
					x = ((tempCenter1 * x) / oTempCenter1) + margin[3];
					y = ((tempCenter2 * y) / oTempCenter2) + margin[0];
				}
				
				var textSize = vo.pieSliceTextStyle.fontSize;
				var textName = vo.pieSliceTextStyle.fontName;
				var textSizePrefix = vo.pieSlicePrefixTextStyle.fontSize;
				var textNamePrefix = vo.pieSlicePrefixTextStyle.fontName;
				
				if( vo.pieSliceTextStyle.color == 'pieColor' ){
					var textColor = this.reColors[i-1 % vo.colors.length];
				}else if( vo.pieSliceTextStyle.color == 'setColor' ){
					var textColor = this.rePieSliceTextColors[(i-1) % vo.pieSliceTextColors.length];
				}else{
					var textColor = vo.pieSliceTextStyle.color;
				}
				
				if( vo.pieSlicePrefixTextStyle.color == 'pieColor' ){
					var textColorPrefix = this.reColors[i-1 % vo.colors.length];
				}else if( vo.pieSlicePrefixTextStyle.color == 'setColor' ){
					var textColorPrefix = this.rePieSliceTextColors[(i-1) % vo.pieSliceTextColors.length];
				}else{
					var textColorPrefix = vo.pieSlicePrefixTextStyle.color;
				}
				
				ctx.beginPath();
				ctx.font = textSize+'px "'+textName+'"';
				
				if( parseFloat(this.reData[i-1][1]) != 0 ){
					// label에 박스 그리기--------------------------------
					
					if( vo.pieSliceTextBox ){
						var tX=0, tY=0, tBoxMargin=parseInt(vo.pieSliceTextBoxMargin, 10);
						var tW = ctx.measureText(val).width;
						var tH = textSize+(tBoxMargin*2);
						var titleTH = vo.pieSliceTitleTextStyle.fontSize+(tBoxMargin*2);
						var backColor = vo.pieSliceTextBoxFill;
						var titleBackColor = vo.pieSliceTextTitleBoxFill;
						var boxStrokeColor = vo.pieSliceTextBoxStrokeColor;
						var boxStrokeThickness = vo.pieSliceTextBoxStrokeThickness;
						
						ctx.font = textSizePrefix+'px "'+textNamePrefix+'"';
						var tWPrefix = ctx.measureText(valPrefix).width;
						var tHPrefix = textSizePrefix+(tBoxMargin*2);
						
						if(valPrefix != ''){
							tH = Math.max(tH, tHPrefix);
						}
						tW = tW + tWPrefix+(tBoxMargin*2);
						
						if( vo.pieSliceTextLocation == 'out' ) {
							
							if( vo.pieSliceText == 'custom-label2' ){
								
								if( x0 > (centerUp[0] + margin[3]) ){	// 오른쪽
									rightCurrCnt++;
									tX = centerUp[0] + margin[3] + radius + vo.pieSliceTextBoxOuterMargin;
									if( rightCurrCnt > 1 ){
										rightStart_Y += (titleTH + tH + vo.pieSliceTextBoxOuterBottomMargin);
									}
									tY = rightStart_Y;
									
									if( rightCurrCnt > 4 ){
										tX = (centerUp[0] + margin[3]) - (tW + radius + vo.pieSliceTextBoxOuterMargin);
										tY = ((titleTH + tH + vo.pieSliceTextBoxOuterBottomMargin) * (labelLeftCnt + (labelRightCnt - rightCurrCnt)) ) + 2;
									}
									
								}else{	// 왼쪽
									leftCurrCnt++;
									tX = (centerUp[0] + margin[3]) - (tW + radius + vo.pieSliceTextBoxOuterMargin);
									
									if( leftCurrCnt > 1 ){
										leftStart_Y += (titleTH + tH + vo.pieSliceTextBoxOuterBottomMargin);
									}
									tY = leftStart_Y;
									
									if( leftCurrCnt > 4 ){
										tX = centerUp[0] + margin[3] + radius + vo.pieSliceTextBoxOuterMargin;
										tY = ((titleTH + tH + vo.pieSliceTextBoxOuterBottomMargin) * (labelRightCnt + (labelLeftCnt - leftCurrCnt)) ) + 2;
									}
								}
								
							}else{
								if( lineP > 0 ){
									tX = Math.round(x - tBoxMargin) + 0.5;
									tY = Math.round(y - (tH/2)) + 1.5;
								}else{
									tX = Math.round(x-(tW-tBoxMargin)) + 0.5;
									tY = Math.round(y - (tH/2)) + 1.5;
								}
							}
						  
							if( vo.pieSliceText == 'custom-label2' ){
								
								ctx.beginPath();
								ctx.lineWidth = vo.pieSliceTextGuideLineWidth || 1;
								ctx.moveTo(x0, y0);
								if( tX > (centerUp[0] + margin[3]) ){	// 오른쪽
									ctx.lineTo(tX-(vo.pieSliceTextBoxOuterMargin-15), tY+titleTH);
								}else{
									ctx.lineTo(tX+tW+(vo.pieSliceTextBoxOuterMargin-15), tY+titleTH);
								}
								ctx.lineTo(tX, tY+titleTH);
								ctx.strokeStyle = vo.pieSliceTextGuideLineColor;
								ctx.stroke();
								ctx.closePath();
								ctx.lineWidth = 1;
								  
								// guide line point
								if( vo.pieSliceTextGuideLinePoint ){
									var color = this.reColors[i-1 % vo.colors.length];
									var darkColor = this.adjustBrightness(color, -45);
									ctx.beginPath();
									ctx.arc(x0,y0,guideLinePointSize,0,Math.PI*2,false);
									ctx.fillStyle = color;
									ctx.fill();
									ctx.closePath();
									ctx.beginPath();
									ctx.arc(x0,y0,guideLinePointSize/3,0,Math.PI*2,false);
									ctx.strokeStyle = darkColor;
									ctx.fillStyle = darkColor;
									ctx.fill();
									ctx.lineWidth = 1;
									ctx.stroke();
									ctx.closePath();
								}
								
								// box
								this._roundedRect( ctx, tX, tY,tW,titleTH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
								ctx.fillStyle = titleBackColor;
								ctx.fill();
								this._roundedRect( ctx, tX, tY+titleTH,tW,tH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
								ctx.fillStyle = backColor;
								ctx.fill();
							}else{
								this._roundedRect( ctx, tX, tY,tW,tH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
								ctx.fillStyle = backColor;
								ctx.fill();
							}
						  
						}
					}
					
					// label에 박스 그리기--------------------------------
					
					ctx.fillStyle = textColor;
					//ctx.fontStretch = "wider";
					if(vo.pieSliceText != 'none'){
						if( vo.pieSliceText == 'custom-label' ){
							ctx.fillStyle = textColorPrefix;
							ctx.textAlign = "left";
							ctx.fillText(valPrefix,tX+tBoxMargin,tY+(tH-(tBoxMargin*2))+4);
							
							ctx.fillStyle = textColor;
							ctx.font = textSize+'px "'+textName+'"';
							ctx.fillText(val,tX+tWPrefix+tBoxMargin,tY+(tH-(tBoxMargin*2))+4);
						}else if( vo.pieSliceText == 'custom-label2' ){
							
							ctx.fillStyle = vo.pieSliceTitleTextStyle.color;
							ctx.font = vo.pieSliceTitleTextStyle.fontStyle+' '+vo.pieSliceTitleTextStyle.fontSize+'px "'+vo.pieSliceTitleTextStyle.fontName+'"';
							if(vo.pieSliceTitleTextStyle.fontAlign == 'center'){
								ctx.textAlign = "center";
								ctx.fillText(valLabelTitle,tX+(tW/2), (tY+titleTH)-(tBoxMargin+2) );
							}else if(vo.pieSliceTitleTextStyle.fontAlign == 'right'){
								ctx.textAlign = "right";
								ctx.fillText(valLabelTitle,(tX+tW)-tBoxMargin, (tY+titleTH)-(tBoxMargin+2) );
							}else{
								ctx.textAlign = "left";
								ctx.fillText(valLabelTitle,tX+tBoxMargin, (tY+titleTH)-(tBoxMargin+2) );
							}
							ctx.fillStyle = textColorPrefix;
							ctx.font = textSizePrefix+'px "'+textNamePrefix+'"';
							ctx.textAlign = "left";
							ctx.fillText(valPrefix,tX+tBoxMargin,tY+titleTH+(tH-(tBoxMargin*2))+4);
							
							ctx.fillStyle = textColor;
							ctx.font = textSize+'px "'+textName+'"';
							ctx.fillText(val,tX+tWPrefix+tBoxMargin,tY+titleTH+(tH-(tBoxMargin*2))+4);
						}else{
							ctx.font = textSize+'px "'+textName+'"';
							if( vo.pieSliceTextLocation == 'out' ) {
							  if( lineP > 0 ){
								ctx.textAlign = "left";
							  }else{
								ctx.textAlign = "right";
							  } 
							  ctx.textBaseline = 'middle';
							}else{
							  ctx.textAlign = "center";
							  ctx.textBaseline = 'middle';
							}
							ctx.fillStyle = textColor;
							//ctx.fontStretch = "wider";
							if(vo.pieSliceText != 'none'){
								ctx.fillText(val,x,y);
							}
						}
					}
				}
			}
		},
		setMoveCenter : function(){
			
			this.aMoveSliceCenter = [];
			var vo = this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var centerUp 	= [pieExtent/2, pieExtent/2];
			var len 		= this.aData.length;
			for(var i=1;i<len;i++) {
				var angle =this.segments[i-1];
				var degrees = angle[1] - angle[0];
				degrees = angle[0] + degrees/2;
				
				// pie slice click했을때 center (360일때)==================================================			
				var centerX = centerUp[0] + Math.round(vo.pieSliceMoveSize * Math.cos(degrees * (Math.PI / 180)));
				var centerY = centerUp[1] + Math.round(vo.pieSliceMoveSize * Math.sin(degrees * (Math.PI / 180)));
				this.aMoveSliceCenter.push([centerX, centerY]);
				// pie slice click했을때 center (360일때)==================================================
			}
			
		},
		setSegments : function(totalAngle){
			this.segments = [];
			this.segments_org = [];
			this.reColors = [];
			this.rePieSliceTextColors = [];
			this.rePieSliceShadow = [];
			this.rePieSliceShadow = [];
			this.reData = [];
			this.reCustomSliceTextData = [];
			this.reCustomSlicePrefixTextData = [];
			this.reASelectItem = [];
			var startSegment = this.options.startAngle;
			var endSegment;
			var total 	= this.aSumData[0];
			var d		= this.aData;
			var angle;
			var len 	= d.length;
			for (var i=1; i<len; i++) {
				angle = parseFloat(totalAngle*(d[i][1]/total));
				if(angle==0 && totalAngle != 360){
					endSegment = startSegment + 0.1;
				}else{
					endSegment = startSegment + angle;
				}
				if(i == len && endSegment< totalAngle){endSegment = totalAngle;}
				this.segments_org.push([startSegment,endSegment]);
				startSegment = endSegment;
			}
			
			// z-index별로 순서를 변경 (segments, color, data)===========================
			var a = [];
			var pi = Math.PI/2;
			var lastItem = null;
			var lastColorItem = null;
			var lastTextColorItem = null;
			var lastSliceShadowItem = null;
			var lastSliceTextItem = null;
			var lastSlicePrefixTextItem = null;
			var lastDataItem = null;
			var reStart = this.segments_org.length-1;
			var lastSelectItem = null;
			// 이미지 배경을 사용하고자 할때처리.
			var vo = this.options;
			if( vo.pieSliceBackgroundImg && this.aImgData ){
				var orgPattern = this.aImgPattern;
				
				this.rePattern = [];
				var lastPatternItem = null;
				var reStartPattern = orgPattern.length-1;
			}
			
			
			for( var i=0;i<len-1;i++ ){
				sA=(Math.PI/180)*this.segments_org[i][0];
				eA=(Math.PI/180)*this.segments_org[i][1];
				if( lastItem == null ){
					if( sA <= pi && eA >= pi ){
						lastItem 		= this.segments_org[i];
						lastColorItem = this.options.colors[i % this.options.colors.length];
						lastTextColorItem = this.options.pieSliceTextColors[i % this.options.pieSliceTextColors.length];
						lastSliceShadowItem = this.options.pieSliceShadow[i % this.options.pieSliceShadow.length];
						lastSliceTextItem = this.options.pieSliceTextArray[i % this.options.pieSliceTextArray.length];
						lastSlicePrefixTextItem = this.options.pieSlicePrefixTextArray[i % this.options.pieSlicePrefixTextArray.length];
						lastDataItem = this.aData[i+1];
						if( this.aSelectItem != null ){
							lastSelectItem = this.aSelectItem[i];
						}	
						// 이미지 배경을 사용하고자 할때처리.
						if( vo.pieSliceBackgroundImg && this.aImgData ){
							lastPatternItem = orgPattern[i+1][1];
						}
					}else{
						a.push(this.segments_org[i]);
						this.reColors.push(this.options.colors[i % this.options.colors.length]);
						this.rePieSliceTextColors.push(this.options.pieSliceTextColors[i % this.options.pieSliceTextColors.length]);
						this.rePieSliceShadow.push(this.options.pieSliceShadow[i % this.options.pieSliceShadow.length]);
						this.reData.push(this.aData[i+1]);
						this.reCustomSliceTextData.push(this.options.pieSliceTextArray[i % this.options.pieSliceTextArray.length]);
						this.reCustomSlicePrefixTextData.push(this.options.pieSlicePrefixTextArray[i % this.options.pieSlicePrefixTextArray.length]);
						if( this.aSelectItem != null ){
							this.reASelectItem.push(this.aSelectItem[i]);
						}
						
						// 이미지 배경을 사용하고자 할때처리.
						if( vo.pieSliceBackgroundImg && this.aImgData ){
							this.rePattern.push(orgPattern[i+1][1]);
						}
						
					}
				}else{
					a.push(this.segments_org[reStart]);
					this.reColors.push(this.options.colors[reStart % this.options.colors.length]);
					this.rePieSliceTextColors.push(this.options.pieSliceTextColors[reStart % this.options.pieSliceTextColors.length]);
					this.rePieSliceShadow.push(this.options.pieSliceShadow[reStart % this.options.pieSliceShadow.length]);
					this.reData.push(this.aData[reStart+1]);
					this.reCustomSliceTextData.push(this.options.pieSliceTextArray[reStart % this.options.pieSliceTextArray.length]);
					this.reCustomSlicePrefixTextData.push(this.options.pieSlicePrefixTextArray[reStart % this.options.pieSlicePrefixTextArray.length]);
					if( this.aSelectItem != null ){
						this.reASelectItem.push(this.aSelectItem[reStart]);
					}
					
					// 이미지 배경을 사용하고자 할때처리.
					if( vo.pieSliceBackgroundImg && this.aImgData ){
						this.rePattern.push(orgPattern[reStartPattern][1]);
						reStartPattern--;
					}
					
					reStart--;
				}
			}
			a.push(lastItem);
			this.reColors.push(lastColorItem);
			this.rePieSliceTextColors.push(lastTextColorItem);
			this.rePieSliceShadow.push(lastSliceShadowItem);
			this.reCustomSliceTextData.push(lastSliceTextItem);
			this.reCustomSlicePrefixTextData.push(lastSlicePrefixTextItem);
			this.reData.push(lastDataItem);
			this.segments = a;
			if( this.aSelectItem != null ){
				this.reASelectItem.push(lastSelectItem);
			}	
			
			
			// 이미지 배경을 사용하고자 할때처리.
			if( vo.pieSliceBackgroundImg && this.aImgData ){
				this.rePattern.push(lastPatternItem);
			}
			// z-index별로 순서를 변경 (segments, color, data)===========================
			
			
			if( totalAngle == 360 ){
				this.setMoveCenter();
			}	
		},
		reViewAngle : function( arg ){
			var ctx 		= this.graphics;
			var margin		= arg[0];
			var canvasSize 	= arg[1];
			var pieHeight	= arg[2];
			ctx.save();
		
			ctx.translate(margin[3],margin[0]);
			var viewAngle = 1;
			var viewAngle2 = 1;
			if( canvasSize.w > canvasSize.h ) { // width가 더 넓으면
				viewAngle2 = this.options.is3D? canvasSize.h/(canvasSize.w+pieHeight):canvasSize.h/canvasSize.w;
				
			}else if( canvasSize.w == canvasSize.h ) {
				viewAngle = canvasSize.h/canvasSize.w;
				viewAngle2 = this.options.is3D? canvasSize.h/(canvasSize.h+pieHeight):1;
			} else {                // height가 더 높으면
				viewAngle = canvasSize.w/canvasSize.h;
				viewAngle2 = this.options.is3D? canvasSize.h/(canvasSize.h+pieHeight):1;
			}
			ctx.scale(viewAngle,viewAngle2);
			this.viewAngle = viewAngle;
			this.viewAngle2 = viewAngle2;
		},
		setSelectSlice : function(e){
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var gap			= 7;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/3.4;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			var tempCenter1 = (centerUp[0])*this.viewAngle;
			var tempCenter2 = (centerUp[1])*this.viewAngle2;  
      
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var tmpX = mouseCoords[0] - vo.background.strokeThickness;
			var tmpY = mouseCoords[1] - vo.background.strokeThickness;
			var x         	= (tmpX - tempCenter1)-margin[3];
			var y         	= (tmpY - tempCenter2)-margin[0];
		
			var tempCenterGap = Math.abs(tempCenter1 - tempCenter2);
			var tempCenterMax = Math.max(tempCenter1, tempCenter2);
			
			if(tempCenter1 < tempCenter2){
				y = (y * (tempCenterMax - tempCenterGap)) / tempCenterMax;
			}else{
				x = (x * (tempCenterMax - tempCenterGap)) / tempCenterMax;
			} 
			
			var radians     = Math.atan(y / x); // RADIANS
			if (x < 0 && y >= 0) {
			  radians += Math.PI;
			} else if (x < 0 && y < 0) {
				radians +=  Math.PI;
			} else if (x > 0 && y < 0) {
				radians += Math.PI*2;
			}
			
			// 360도 넘었을 경우
			if (radians > Math.PI*2) {
			  radians = Math.round(Math.PI*2);
			}
			
			// pie를 벗어난 곳에 마우스가 있을경우 return null.
			if( vo.pieSliceTextLocation == 'out' ) {
			  if((y / Math.sin(radians)) > (Math.min(pieArea.w,pieArea.h)/2.5) ){
			    try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				if(arguments[2]){
					//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
					this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
					this.setPieSlice(360);
				}
				return null;
			  }	
			} else {
			  if((y / Math.sin(radians)) > (Math.min(pieArea.w,pieArea.h)/2) ){
			    try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				if(arguments[2]){
					//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
					this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
					this.setPieSlice(360);
				}
				return null;
			  }	
			}
			
			
			var startSegment = 270;
			var segments = [];
			var len = this.aData.length;
			for (i=1; i<len; i++) {
			  var angle = parseFloat(360*(this.aData[i][1]/this.aSumData)); 
			  var endSegment = startSegment + angle;
			  if(i+1 == len && endSegment< 360){endSegment = 360;}
			  segments.push([startSegment,endSegment]);
			  startSegment = endSegment;
			}
			
			
			if(tempCenterMax < (tempCenter1 < tempCenter2? Math.abs(y):Math.abs(x))  )
			{ return null; }
			var degrees = radians * (360/(Math.PI*2));
		  
			var selectPie = null;
			for (var i=0; i<segments.length; i++) 
			{
			  if( degrees < 270 )
			  { degrees += 360; }
			  
			  if(degrees >= segments[i][0] && degrees < segments[i][1]) {
					 selectPie = i;
					 break;
			  }
			}
			
			if( arguments[2] ){
				if( arguments[2] == 'mousedown' ){
					//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
					this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
					this.setPieSlice(360, selectPie+1);
					this.drawTooltip( e, [selectPie, 0], [mouseCoords[0]+gap,mouseCoords[1]-gap], gap );
				}else if( arguments[2] == 'click' ){
					this.returnEventData(e, selectPie);
				}else if( arguments[2] == 'mouseup' ){
					//this.returnEventData(e, selectPie);
					if( this.isMobile('any') ){
						this.returnEventData(e, selectPie);
					}
				}
			}else{
				this.drawTooltip( e, [selectPie, 0], [mouseCoords[0]+gap,mouseCoords[1]-gap], gap );
			}	
			
		},
		canvas_event_func_pie : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectSlice(e, chartElem);
			}else if( e.type=='mousedown' ){
				if( eThis.options.pieSliceSelectAnimation ){
					eThis.setSelectSlice(e, chartElem, 'mousedown');
				}
			}else if( e.type=='mouseup' ){
				eThis.setSelectSlice(e, chartElem, 'mouseup');
			}else if( e.type=='click' ){
				eThis.setSelectSlice(e, chartElem, 'click');
			}
			
			// IE 일 경우   
			//if(!e){window.event.cancelBubble(true);}	
			// 표준 브라우저일 경우   
			//else{e.stopPropagation();}
		}
		
		
	});
	
	GLChart.MultiPie = function(){
		GLChart.call(this, arguments);
		this.segments = [];
		this.segments_org = [];
		this.aMoveSliceCenter = [];
		this.viewAngle = null;
		this.viewAngle2 = null;
		this.reColors = [];
		this.reData = [];
		this.reASelectItem = [];
		this.pieWeightSize = null;
		this.options = {
			type : 'multipie'
			,pieHeight : 10
			,startAngle : -90
			,pieSliceBorderColor : "#fff"
			,pieSliceText : 'label'
			,pieSliceTextLocation : 'in'
			,pieSliceTextGuideLineColor : '#000'
			,pieSliceTextStyle : {color:'#000', fontName:'Gulim', fontSize:12}
			,pieSliceSelectAnimation : false
			,reverseCategories : false
			,centerHoleSize : 0
			,pieSliceMoveSize : 15
			,pieSeriesSpacing : 1
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		
	};
	GLChart.MultiPie.prototype = new GLChart([]);
	GLChart.extend(GLChart.MultiPie, {
		render : function( o ){
			
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				this.applyOptions( this.options, o );
			}	
			
			// default set options 
			this.options.is3D = false;
			this.options.theme.seriesGradientStyle = 1;
			
			this.setCanvas();
			if( this.aData ){
				this.drawPieSlice();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			
		},
		drawPieSlice : function(){
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				if( this.hasChart ){
					//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
					this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				}
				this.setSegments(360);
				this.setPieSlice(360);
			}
		},
		setAnimation : function(){
			
			var sA = 0.001;
			var acc = 7;
			var Angle = 360/acc;
			var pie = this;
			
			pie.animationInst = window.setInterval( function(){
				
				acc *= 1.12;
				if(acc>250){acc = 250;}
				Angle = 360/acc;
				sA += Angle;
				
				//pie.graphics.clearRect(0,0,pie.sWidth,pie.sHeight);
				pie.clearRect( pie.oCanvas_body, pie.graphics, pie.sWidth, pie.sHeight);
				pie.setSegments(sA);
				pie.setPieSlice(sA);
				
				if( sA > 360 ){
					//pie.graphics.clearRect(0,0,pie.sWidth,pie.sHeight);
					pie.clearRect( pie.oCanvas_body, pie.graphics, pie.sWidth, pie.sHeight);
					pie.setSegments(360);
					pie.setPieSlice(360);
					window.clearInterval(pie.animationInst);
				}
			},50);
			
		},
		setPieSlice : function(totalAngle){
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/3.4;
			var holeRadius	= (radius-(radius-(vo.centerHoleSize/2)));
			var tempRadius	= radius;
			var tempHoleRadius	= holeRadius;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			
			var x, y, holeX, holeY, len=this.aData.length, len2=this.aData[0].length, color, darkColor, darkColor1, darkColor2, lightColor, g1, g1_2, g2, g3, sA,eA,sA2,eA2,holeSA,holeEA;
			var userAgent 	= this.userAgent();
			
			if( ctx ){
				
				// pie 넓이 조정.
				this.reViewAngle([margin, pieArea, pieHeight]);
				
				var tempCenter1 = (centerUp[0])*this.viewAngle;
				var tempCenter2 = (centerUp[1])*this.viewAngle2;
				var tempPieSize = (radius-holeRadius) / (len2-1);
				this.pieWeightSize = tempPieSize;
				
				for( var j=1;j<len2;j++ ){
					
					if( j == 1 ){
						holeRadius = (radius - tempPieSize) + (vo.pieSeriesSpacing)/2;
					}else{
						radius = (radius - tempPieSize) - (vo.pieSeriesSpacing)/2;
						holeRadius = (radius - tempPieSize) + (vo.pieSeriesSpacing)/2;
					}
					
					for( var i=1;i<len;i++ ){
					
						color 		= this.reColors[j-1][i-1 % vo.colors.length];
						darkColor 	= this.adjustBrightness(color, -35);
						darkColor1 	= this.adjustBrightness(color, -98);
						darkColor2 	= this.adjustBrightness(color, -55);
						lightColor	= this.adjustBrightness(color, 65);
						// pie click 반지름 셋팅=======================================
						if( arguments[1] ){
							radius = tempRadius-vo.pieSliceMoveSize;
							if( this.segments_org[arguments[1]-1][0] == this.segments[i-1][0] ){
								centerUp 	= this.aMoveSliceCenter[i-1];
								centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
							}else{
								centerUp 	= [pieExtent/2, pieExtent/2];
								centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
							}
						}else{
							// this.aSelectItem 체크
							if( totalAngle == 360 ){
								if( this.aSelectItem != null ){
									radius = tempRadius-vo.pieSliceMoveSize;
									if( this.reASelectItem[j-1][i-1][0] == 'true' ){
										centerUp = this.aMoveSliceCenter[j-1][i-1];
										centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
										
									}else{
										centerUp 	= [pieExtent/2, pieExtent/2];
										centerdown 	= [centerUp[0], centerUp[1]+pieHeight];
									}
								}
							}
						}
						// pie click 반지름 셋팅=======================================
						if( vo.theme.seriesGradientStyle == 1 ){
							g1 = color;
							g1_2 = darkColor1;
						}else if( vo.theme.seriesGradientStyle == 2 ){
							g1 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
							g1.addColorStop(0, darkColor2);
							g1.addColorStop(0.9, color);
							g1.addColorStop(1, color);
							g1_2 = darkColor2;
						}else if( vo.theme.seriesGradientStyle == 3 ){
							g1 = ctx.createLinearGradient(centerUp[0]-radius, centerUp[1], centerUp[0]+radius, centerUp[1]+radius);
							g1.addColorStop(0, color);
							g1.addColorStop(0.2, lightColor);
							g1.addColorStop(0.45, color);
							g1.addColorStop(0.7, darkColor);
							g1.addColorStop(1, color);
							g1_2 = ctx.createLinearGradient(centerUp[0]-radius, centerUp[1], centerUp[0]+radius, centerUp[1]);
							g1_2.addColorStop(0, darkColor1);
							g1_2.addColorStop(0.5, darkColor);
							g1_2.addColorStop(0.7, color);
							g1_2.addColorStop(0.8, darkColor);
							g1_2.addColorStop(1, darkColor1);
						}
						
						g2 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
						g2.addColorStop(0, color);
						g2.addColorStop(0.89, color);
						g2.addColorStop(1, darkColor2);
						if( vo.centerHoleSize != 0 ){
							var innerG = Math.floor(holeRadius/radius);
						
							g3 = ctx.createRadialGradient(centerUp[0], centerUp[1], 0, centerUp[0], centerUp[1], radius);
							g3.addColorStop(innerG, darkColor2);
							g3.addColorStop(innerG+0.1, color);
							g3.addColorStop(0.89, color);
							g3.addColorStop(1, darkColor2);
						}	
					
						if( vo.is3D ){
							// pie 호 부분======================================================================
							sA=(Math.PI/180)*this.segments[j-1][i-1][0];
							eA=(Math.PI/180)*this.segments[j-1][i-1][1];
							holeSA = (Math.PI/180)*this.segments[j-1][i-1][0];
							holeEA = (Math.PI/180)*this.segments[j-1][i-1][1];
							if( sA < 0 && eA > 0 && eA < Math.PI ){
								sA = 0;
							}
							if( sA < 0 && eA > 0 && eA > Math.PI ){
								sA = 0;
								eA = Math.PI;
							}
							if( sA > 0 && eA > Math.PI ){
								eA = Math.PI;
							}
							if( sA >= Math.PI && eA >= Math.PI ){
								sA = sA;
							}else{
								ctx.beginPath();
								ctx.arc(centerUp[0],centerUp[1],radius,sA,eA,false);
								ctx.arc(centerdown[0],centerdown[1],radius,eA,sA,true);
								ctx.closePath();
								ctx.fillStyle = g1_2;
								ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
								ctx.lineWidth=1; 
								ctx.lineJoin = 'round';
								ctx.stroke();
								ctx.fill();
							}
							if( vo.centerHoleSize != 0 ){
								ctx.beginPath();
								ctx.arc(centerUp[0],centerUp[1],holeRadius,holeSA,holeEA,false);
								ctx.arc(centerdown[0],centerdown[1],holeRadius,holeEA,holeSA,true);
								ctx.closePath();
								ctx.fillStyle = darkColor;
								ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
								ctx.lineWidth=1; 
								ctx.lineJoin = 'round';
								ctx.stroke();
								ctx.fill();
							}
							// pie 호 부분======================================================================
							
							// pie 옆면==========================================================================
							if(i != len-1 || totalAngle < 180){
								if( sA > Math.PI/2 ){
									x = centerUp[0] + radius * Math.cos(this.segments[j-1][i-1][0] * (Math.PI / 180));
									y = centerUp[1] + radius * Math.sin(this.segments[j-1][i-1][0] * (Math.PI / 180));
								}else{
									x = centerUp[0] + radius * Math.cos(this.segments[j-1][i-1][1] * (Math.PI / 180));
									y = centerUp[1] + radius * Math.sin(this.segments[j-1][i-1][1] * (Math.PI / 180));
								}
								if( vo.centerHoleSize == 0 ){
									ctx.beginPath();
									ctx.moveTo(centerUp[0], centerUp[1]);
									ctx.lineTo(x, y);
									ctx.lineTo(x, y+pieHeight);
									ctx.lineTo(centerdown[0], centerdown[1]);
									ctx.closePath();
								}else{
									if( sA > Math.PI/2 ){
										holeX = centerUp[0] + holeRadius * Math.cos(this.segments[j-1][i-1][0] * (Math.PI / 180));
										holeY = centerUp[1] + holeRadius * Math.sin(this.segments[j-1][i-1][0] * (Math.PI / 180));
									}else{
										holeX = centerUp[0] + holeRadius * Math.cos(this.segments[j-1][i-1][1] * (Math.PI / 180));
										holeY = centerUp[1] + holeRadius * Math.sin(this.segments[j-1][i-1][1] * (Math.PI / 180));
									}
									ctx.beginPath();
									ctx.moveTo(holeX, holeY);
									ctx.lineTo(x, y);
									ctx.lineTo(x, y+pieHeight);
									ctx.lineTo(holeX, holeY+pieHeight);
									ctx.closePath();
								}
								ctx.fillStyle = darkColor;
								ctx.strokeStyle=vo.pieSliceBorderColor || darkColor;
								ctx.lineWidth=1; 
								ctx.stroke();
								ctx.fill();
							}
							// pie 옆면==========================================================================
						}
						  
						// pie 윗면 =========================================================================
						sA2=(Math.PI/180)*this.segments[j-1][i-1][0];
						eA2=(Math.PI/180)*this.segments[j-1][i-1][1];
						
						ctx.beginPath();
						if( vo.centerHoleSize == 0 ){
							ctx.moveTo(centerUp[0], centerUp[1]);
							ctx.arc(centerUp[0], centerUp[1], radius, sA2, eA2, false);
							ctx.lineTo(centerUp[0], centerUp[1]);
						}else{
							ctx.arc(centerUp[0], centerUp[1], radius, sA2, eA2, false);
							ctx.arc(centerUp[0], centerUp[1], holeRadius, eA2, sA2, true);
						}
						ctx.closePath();
						if( userAgent.ie ){
							ctx.fillStyle = color;
						}else{
							if( vo.centerHoleSize == 0 ){
								ctx.fillStyle = g1;//vo.is3D?g1:g2;
							}else{
								ctx.fillStyle = g1;//vo.is3D?g1:g3;
							}
						}	
						ctx.strokeStyle=vo.pieSliceBorderColor || color;
						ctx.lineWidth=1; 
						ctx.lineJoin = 'round';
						ctx.stroke();
						ctx.fill();
						// pie 윗면 =========================================================================
						
						
						
					}
				}
				ctx.restore();	
				if( totalAngle == 360 ){
					if( arguments[1] ){
						this.drawText(arguments[1]);
					}else{
						this.drawText();
					}	
				}
			}
			
			
		},
		drawText : function(){
		
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/3.4;
			var radius_org	= radius;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			
			var x, y, x0, y0, len=this.aData.length, len2=this.aData[0].length, color, darkColor;
			var total 	= this.aSumData[0];
			var oTempCenter1 = centerUp[0];
			var oTempCenter2 = centerUp[1];
			var tempCenter1 = (centerUp[0])*this.viewAngle;
			var tempCenter2 = (centerUp[1])*this.viewAngle2;
			var lineP = null;
			//var fontGap = 10;
			var textPosition= 1.3;
			
			var holeRadius	= (radius-(radius-(vo.centerHoleSize/2)));
			var tempPieSize = (radius-holeRadius) / (len2-1);
			for( var j=1;j<len2;j++ ){
				if(j == 1){
					radius = radius - (tempPieSize/2);
				}else{
					radius = radius - tempPieSize;
				}
				total 	= this.aSumData[j-1];
			
				for(var i=1;i<len;i++) {
					var angle =this.segments[j-1][i-1];
					var degrees = angle[1] - angle[0];
					degrees = angle[0] + degrees/2;
					lineP = Math.cos(degrees * (Math.PI / 180));
					
					if( arguments[0] ){
						if( this.segments_org[j-1][arguments[0]-1][0] == this.segments[j-1][i-1][0] ){
							radius = vo.pieSliceTextLocation == 'out'?radius_org:radius_org + vo.pieSliceMoveSize;
						}else{
							radius = radius_org - vo.pieSliceMoveSize;
						}
					}else{
						// this.aSelectItem 체크
						if( this.aSelectItem != null ){
							radius = radius_org - vo.pieSliceMoveSize;
							if( this.reASelectItem[j-1][i-1][0] == 'true' ){
								radius = vo.pieSliceTextLocation == 'out'?radius_org:radius_org + vo.pieSliceMoveSize;
							}
						}
						
					}
				
					if( vo.pieSliceTextLocation == 'out' && vo.pieSliceText != 'none' ) {
					  x = centerUp[0] + Math.round(radius/0.85 * Math.cos(degrees * (Math.PI / 180)));
					  y = (centerUp[1]+(pieHeight/3)) + Math.round(radius/0.7 * Math.sin(degrees * (Math.PI / 180)));
					  x0 = centerUp[0] + Math.round(radius * Math.cos(degrees * (Math.PI / 180)));
					  y0 = centerUp[1] + Math.round(radius * Math.sin(degrees * (Math.PI / 180)));
					  x = ((tempCenter1 * x) / oTempCenter1)+margin[3];
					  y = ((tempCenter2 * y) / oTempCenter2)+margin[0];
					  x0 = ((tempCenter1 * x0) / oTempCenter1)+margin[3];
					  y0 = ((tempCenter2 * y0) / oTempCenter2)+margin[0];
					  
					  ctx.beginPath();
					  ctx.moveTo(x0, y0);
					  /*
						if( angle[1] - angle[0] < 13 ){
							y = y-fontGap;
							fontGap -= 13;
						}else{
							fontGap = 13;
						}
					  */
					  ctx.lineTo(x, y);
					  if( lineP > 0 ) {
						//x = ((this.sWidth/2)+radius)+20;
						ctx.lineTo(x+9, y);
						x = x+10;
					  }else{
						//x = ((radius*0.85)-20);
						ctx.lineTo(x-9, y);
						x = x-10;
					  }
					  ctx.strokeStyle = vo.pieSliceTextGuideLineColor;
					  ctx.stroke();
					  ctx.closePath();
					}else{
						textPosition = 1;//arguments[0]?1.3:textPosition;
						var x = centerUp[0] + Math.round(radius/textPosition * Math.cos(degrees * (Math.PI / 180)));
						var y = centerUp[1] + Math.round(radius/textPosition * Math.sin(degrees * (Math.PI / 180)));
						x = ((tempCenter1 * x) / oTempCenter1) + margin[3];
						y = ((tempCenter2 * y) / oTempCenter2) + margin[0];
					}
					
					
					var textSize = vo.pieSliceTextStyle.fontSize;
					var textName = vo.pieSliceTextStyle.fontName;
					var textColor = vo.pieSliceTextStyle.color;
					
					
					ctx.beginPath();
					ctx.font = textSize+'px "'+textName+'"';
					if( vo.pieSliceTextLocation == 'out' ) {
					  if( lineP > 0 ){
						ctx.textAlign = "left";
					  }else{
						ctx.textAlign = "right";
					  } 
					  ctx.textBaseline = 'middle';
					}else{
					  ctx.textAlign = "center";
					  ctx.textBaseline = 'middle';
					}
					ctx.fillStyle = textColor;
					//ctx.fontStretch = "wider";
					
					// percentage, value, label, none.
					switch(vo.pieSliceText){
					  case "none":{
						break;
					  }case "percentage":{
						var val = ((this.reData[j-1][i-1][j] * 100) / total).toFixed(1) + "%";
						ctx.fillText(val,x,y);
						break;
					  }case "value":{
						var val = this.formatter(this.reData[j-1][i-1][j], "#,##0");
						ctx.fillText(val,x,y);
						break;
					  }case "label":{
						var val = this.reData[j-1][i-1][0];
						ctx.fillText(val,x,y);
						break;
					  }
					}
					
				}
			}
		},
		setMoveCenter : function(){
			
			this.aMoveSliceCenter = [];
			var vo = this.options;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var centerUp 	= [pieExtent/2, pieExtent/2];
			var len 		= this.aData.length;
			var len2		= this.aData[0].length;
			var a = [];
			for(var j=1;j<len2;j++){
				for(var i=1;i<len;i++) {
					var angle =this.segments[j-1][i-1];
					var degrees = angle[1] - angle[0];
					degrees = angle[0] + degrees/2;
					
					// pie slice click했을때 center (360일때)==================================================			
					var centerX = centerUp[0] + Math.round(vo.pieSliceMoveSize * Math.cos(degrees * (Math.PI / 180)));
					var centerY = centerUp[1] + Math.round(vo.pieSliceMoveSize * Math.sin(degrees * (Math.PI / 180)));
					a.push([centerX, centerY]);
					// pie slice click했을때 center (360일때)==================================================
				}
				this.aMoveSliceCenter.push(a);
			}
			
		},
		setSegments : function(totalAngle){
			this.segments = [];
			this.segments_org = [];
			this.reColors = [];
			this.reData = [];
			this.reASelectItem = [];
			var t_reColors = [];
			var t_reASelectItem = [];
			var t_reData = [];
			
			var startSegment = this.options.startAngle;
			var endSegment;
			var total 	= this.aSumData[0];
			var d		= this.aData;
			var angle;
			var len 	= d.length;
			var len2	= d[0].length;
			for( var j=1; j<len2; j++ ) {
				total 	= this.aSumData[j-1];
				t_segments_org = [];
				startSegment = this.options.startAngle;
				for (var i=1; i<len; i++) {
					angle = parseFloat(totalAngle*(d[i][j]/total));
					endSegment = startSegment + angle;
					if(i == len && endSegment< totalAngle){endSegment = totalAngle;}
					t_segments_org.push([startSegment,endSegment]);
					startSegment = endSegment;
				}
				this.segments_org.push(t_segments_org);
			}
			
			// z-index별로 순서를 변경 (segments, color, data)===========================
			var a = [];
			var pi = Math.PI/2;
			var lastItem = null;
			var lastColorItem = null;
			var lastDataItem = null;
			var reStart = this.segments_org.length-1;
			var lastSelectItem = null;
			var sA, eA;
			for( var j=0; j<len2-1; j++ ) {
				a = [];
				lastItem = null;
				lastColorItem = null;
				lastDataItem = null;
				reStart = this.segments_org[j].length-1;
				lastSelectItem = null;
				t_reASelectItem = [];
				t_reColors = [];
				t_reData = [];
				for( var i=0;i<len-1;i++ ){
					sA=(Math.PI/180)*this.segments_org[j][i][0];
					eA=(Math.PI/180)*this.segments_org[j][i][1];
					if( lastItem == null ){
						if( sA <= pi && eA >= pi ){
							lastItem 		= this.segments_org[j][i];
							lastColorItem = this.options.colors[i % this.options.colors.length];
							lastDataItem = this.aData[i+1];
							if( this.aSelectItem != null ){
								lastSelectItem = this.aSelectItem[i];
							}	
						}else{
							a.push(this.segments_org[j][i]);
							t_reColors.push(this.options.colors[i % this.options.colors.length]);
							t_reData.push(this.aData[i+1]);
							if( this.aSelectItem != null ){
								t_reASelectItem.push(this.aSelectItem[i]);
							}
						}
					}else{
						a.push(this.segments_org[j][reStart]);
						t_reColors.push(this.options.colors[reStart % this.options.colors.length]);
						t_reData.push(this.aData[reStart+1]);
						if( this.aSelectItem != null ){
							t_reASelectItem.push(this.aSelectItem[reStart]);
						}
						reStart--;
					}
				}
				a.push(lastItem);
				t_reColors.push(lastColorItem);
				this.reColors.push(t_reColors);
				t_reData.push(lastDataItem);
				this.segments.push(a);
				if( this.aSelectItem != null ){
					t_reASelectItem.push(lastSelectItem);
					this.reASelectItem.push(t_reASelectItem);
				}
				
				this.reData.push(t_reData);
			}	
			// z-index별로 순서를 변경 (segments, color, data)===========================
			
			if( totalAngle == 360 ){
				this.setMoveCenter();
			}	
		},
		reViewAngle : function( arg ){
			var ctx 		= this.graphics;
			var margin		= arg[0];
			var canvasSize 	= arg[1];
			var pieHeight	= arg[2];
			ctx.save();
		
			ctx.translate(margin[3],margin[0]);
			var viewAngle = 1;
			var viewAngle2 = 1;
			if( canvasSize.w > canvasSize.h ) { // width가 더 넓으면
				viewAngle2 = this.options.is3D? canvasSize.h/(canvasSize.w+pieHeight):canvasSize.h/canvasSize.w;
				
			}else if( canvasSize.w == canvasSize.h ) {
				viewAngle = canvasSize.h/canvasSize.w;
				viewAngle2 = this.options.is3D? canvasSize.h/(canvasSize.h+pieHeight):1;
			} else {                // height가 더 높으면
				viewAngle = canvasSize.w/canvasSize.h;
				viewAngle2 = this.options.is3D? canvasSize.h/(canvasSize.h+pieHeight):1;
			}
			ctx.scale(viewAngle,viewAngle2);
			this.viewAngle = viewAngle;
			this.viewAngle2 = viewAngle2;
		},
		setSelectSlice : function(e){
			var ctx 		= this.graphics;
			var vo 			= this.options;
			var gap			= 7;
			var margin 		= [vo.chartArea.top, vo.chartArea.right, vo.chartArea.bottom, vo.chartArea.left];
			var pieArea 	= {w:(this.sWidth - margin[1]) - margin[3], h:(this.sHeight - margin[0]) - margin[2]};
			var pieHeight 	= vo.is3D? vo.pieHeight : 0;
			var pieExtent 	= Math.max( pieArea.w, pieArea.h );
			var radius		= vo.pieSliceTextLocation == 'in'? pieExtent/2 : pieExtent/3.4;
			var centerUp 	= [pieExtent/2, pieExtent/2];      			// 원의 중앙위치
			var centerdown 	= [centerUp[0], centerUp[1]+pieHeight];  	// 원의 중앙위치 + pie두께.
			var tempCenter1 = (centerUp[0])*this.viewAngle;
			var tempCenter2 = (centerUp[1])*this.viewAngle2; 

			var len 		= this.aData.length;
			var len2 		= this.aData[0].length;
			
			var _pieSize	= Math.min(pieArea.w,pieArea.h)/2;
			var tempSize	= 0;
			var aPieSize	= [];
			for(var j=0;j<len2;j++){
				aPieSize.push( _pieSize - tempSize );
				tempSize += this.pieWeightSize;
			}
		
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var tmpX = mouseCoords[0] - vo.background.strokeThickness;
			var tmpY = mouseCoords[1] - vo.background.strokeThickness;
			var x         	= (tmpX - tempCenter1)-margin[3];
			var y         	= (tmpY - tempCenter2)-margin[0];
		
			var tempCenterGap = Math.abs(tempCenter1 - tempCenter2);
			var tempCenterMax = Math.max(tempCenter1, tempCenter2);
			
			if(tempCenter1 < tempCenter2){
				y = (y * (tempCenterMax - tempCenterGap)) / tempCenterMax;
			}else{
				x = (x * (tempCenterMax - tempCenterGap)) / tempCenterMax;
			} 
			
			var radians     = Math.atan(y / x); // RADIANS
			if (x < 0 && y >= 0) {
			  radians += Math.PI;
			} else if (x < 0 && y < 0) {
				radians +=  Math.PI;
			} else if (x > 0 && y < 0) {
				radians += Math.PI*2;
			}
			
			// 360도 넘었을 경우
			if (radians > Math.PI*2) {
			  radians = Math.round(Math.PI*2);
			}
			
			// pie를 벗어난 곳에 마우스가 있을경우 return null.
			var mpSize = (y / Math.sin(radians));
			if( mpSize > _pieSize || mpSize < aPieSize[aPieSize.length-1] ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				if(arguments[2]){
					//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
					this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
					this.setPieSlice(360);
				}
				return null;
			}	
			
			
			
			var startSegment = 270;
			var segments = [];
			var t_segments = [];
			
			for(var j=1;j<len2;j++){
				t_segments = [];
				startSegment = 270;
				for (var i=1; i<len; i++) {
				  var angle = parseFloat(360*(this.aData[i][j]/this.aSumData[j-1])); 
				  var endSegment = startSegment + angle;
				  if(i+1 == len && endSegment< 360){endSegment = 360;}
				  t_segments.push([startSegment,endSegment]);
				  startSegment = endSegment;
				}
				segments.push(t_segments);
			}
			
			
			if(tempCenterMax < (tempCenter1 < tempCenter2? Math.abs(y):Math.abs(x))  )
			{ return null; }
			var degrees = radians * (360/(Math.PI*2));
		  
			var selectPie = null;
			var selectRow = null;
			var tempRadians = radians;
			
			for (var i=0; i<segments.length; i++) {
				if( mpSize < aPieSize[i] && mpSize > aPieSize[i+1] ){
					selectRow = i;
				}
			}
			
			for(var j=0;j<segments[0].length;j++){
				
				if( degrees < 270 )
				{ degrees += 360; }
				  
				if(degrees >= segments[selectRow][j][0] && degrees < segments[selectRow][j][1]) {
					selectPie = j;
					break;
				}
				
			}
			
			
				this.drawTooltip( e, [selectPie, selectRow], [mouseCoords[0]+gap,mouseCoords[1]-gap], gap );
			
			
		},
		canvas_event_func_pie : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectSlice(e, chartElem);
			}else if( e.type=='mousedown' ){
				if( eThis.options.pieSliceSelectAnimation ){
					eThis.setSelectSlice(e, chartElem, 'mousedown');
				}
			}else if( e.type=='mouseup' ){
					
			}
			
			// IE 일 경우   
			//if(!e){window.event.cancelBubble(true);}	
			// 표준 브라우저일 경우   
			//else{e.stopPropagation();}
			
		}
		
	});

	// Pie 차트--------------------------------------------------------
	GLChart.SinglePie = function(){
		GLChart.call(this, arguments);
		this.options = {
			container: arguments[0] || null
			,colors : ['#3366cc', '#ebebeb']
			,width: '100%'
			,height: '100%'
			,animation : true
			,chartArea: {top:1, left:1, bottom:1, right:1}
			,strokeWeight: 10
			,backgroundImage: ''
		};
		this._chartData 		= [];
		this._containerId 		= arguments[0] || null;
		this._chartValue 		= { min: Number.MAX_VALUE, max: Number.MIN_VALUE, sum:0 };
		this._calculatedMargins = {x:0,y:0,w:0,h:0};
		this._sHtml = [];
		this._itemTag = [];
		this._moveIntervalId = null;
		this.pieItemElem = null;
		
		this.applyOptions(this.options, this.common_options);
	};
	GLChart.SinglePie.prototype = new GLChart([]);
	GLChart.extend(GLChart.SinglePie, {
		show: function(opt){
			var _self = this;
			if( opt ){
				this.applyOptions( this.options, opt );
			}
			
			this._setFrame();
			this._setValue();
			this._drawPie();
		}
		,setData: function( aData ){
			this._chartData = aData || [];
		}
		,_setFrame: function(){
			var opt   = this.options;
			var sId   = this._containerId;
			var svgContainer= null;
			var sHtml   = [];
			
			// 브라우져 체크
			this._isOldIE = this.getOldInternetExplorer() || false;
		   
			if( this._isOldIE ){
				
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml"); 
				document.createStyleSheet().addRule(".ev", "behavior:url(#default#VML);position:absolute;display:inline-block;");
				svgContainer = document.getElementById(sId);
				
				sHtml.push(' <div id="SelfCheck_measureText_'+sId+'" style="overflow:hidden;min-height:0;display:inline;"></div>');
				document.getElementById(this._containerId).innerHTML = sHtml.join('');
				document.getElementById(this._containerId).style.position = "relative";
				opt.height = svgContainer.clientHeight || 0;
				opt.width = svgContainer.clientWidth || 0;
			}else{
				if( this.userAgent() == 'Firefox' ){
					var conDiv = document.getElementById(this._containerId);
					sHtml.push('<svg id="SelfCheck_frame_'+sId+'" height="'+(conDiv.clientHeight)+'" width="'+(conDiv.clientWidth)+'"></svg>');
					document.getElementById(this._containerId).innerHTML = sHtml.join('');
					// save height, width
					opt.height = conDiv.clientHeight || 0;
					opt.width = conDiv.clientWidth || 0;
				}else{
					sHtml.push('<svg id="SelfCheck_frame_'+sId+'" height="'+(opt.height)+'" width="'+(opt.width)+'"></svg>');
					document.getElementById(this._containerId).innerHTML = sHtml.join('');
					// save height, width
					svgContainer = document.getElementById('SelfCheck_frame_'+sId);
					opt.height = svgContainer.clientHeight || 0;
					opt.width = svgContainer.clientWidth || 0;
				}
			}
		}
		,_setValue: function(){
			// get min max
			this._getMinMax();
			this._calculateMargin();
		}
		,_getMinMax: function(){
			var data = this._chartData;
			var len = data.length;
			this._chartValue = { min: Number.MAX_VALUE, max: Number.MIN_VALUE, sum:0 };
			
			for( var i=0; i<len; i++ ){
				this._chartValue.min = Math.min( this._chartValue.min, parseFloat(data[i]) || null );
				this._chartValue.max = Math.max( this._chartValue.max, parseFloat(data[i]) || null );
				this._chartValue.sum = this._chartValue.sum + parseFloat(data[i]);
			}
		}
		,_calculateMargin: function(){
			var opt = this.options;
			
			var x = parseFloat(opt.chartArea.left) || 0;
			var y = parseFloat(opt.chartArea.top) || 0;
			var w = opt.width - (parseFloat(opt.chartArea.right) + parseFloat(opt.chartArea.left));
			var h = opt.height - (parseFloat(opt.chartArea.bottom) + parseFloat(opt.chartArea.top));
			var wh = Math.min(w, h);
			
			this._calculatedMargins.x = x;
			this._calculatedMargins.y = y;
			this._calculatedMargins.w = wh;
			this._calculatedMargins.h = wh;
		}
		,_drawPie: function(){
			
			var opt = this.options;
			var sId = this._containerId;
			var sHtml = this._sHtml;
			var imgUrl = opt.backgroundImage;
			
			if( this._isOldIE ){
				this._drawPie_IE();
				
				if( opt.animation ){
					this._setAnimation();
				}else{
					this._setPiePath_IE(360);
				}
				return;
			}
			
			this._drawPieItemTag();
			
			// START SVG Chart -----------------------------------
			if( this.userAgent() == 'Firefox' ){
				var conDiv = document.getElementById(sId);
				sHtml.push('<svg version="1.1" id="SelfCheck_frame_'+sId+'" height="'+(conDiv.clientHeight)+'" width="'+(conDiv.clientWidth)+'" xmlns="http://www.w3.org/2000/svg">');
				sHtml.push(' <desc>Pie차트</desc>');
				sHtml.push('<defs>');
				sHtml.push('	<pattern id="SelfCheck_pattern_'+sId+'" patternUnits="userSpaceOnUse" width="'+(opt.width)+'" height="'+(opt.height)+'">');
				sHtml.push('		<image xlink:href="'+imgUrl+'" width="'+(opt.width)+'" height="'+(opt.height)+'" />');
				sHtml.push('	</pattern>');
				sHtml.push('</defs>');
				sHtml.push(this._itemTag.join(''));
				sHtml.push('</svg>');
			}else{
				sHtml.push('<svg version="1.1" id="SelfCheck_frame_'+sId+'" height="'+(opt.height)+'" width="'+(opt.width)+'" xmlns="http://www.w3.org/2000/svg">');
				sHtml.push(' <desc>Pie차트</desc>');
				sHtml.push('<defs>');
				sHtml.push('	<pattern id="SelfCheck_pattern_'+sId+'" patternUnits="userSpaceOnUse" width="'+(opt.width)+'" height="'+(opt.height)+'">');
				sHtml.push('		<image xlink:href="'+imgUrl+'" width="'+(opt.width)+'" height="'+(opt.height)+'" />');
				sHtml.push('	</pattern>');
				sHtml.push('</defs>');
				sHtml.push(this._itemTag.join(''));
				sHtml.push('</svg>');
			}
			document.getElementById(sId).innerHTML = sHtml.join('');
			
			if( this.options.animation ){
				this._setAnimation();
			}else{
				this._setPiePath(360);
			}
		}
		,_drawPie_IE: function(){
			
			this._sHtml = [];
			var opt   = this.options;
			var sId   = this._containerId;
			var sHtml   = this._sHtml;
			var imgUrl = opt.backgroundImage;
			var strokeWeight = opt.strokeWeight || 0;
			var x = this._calculatedMargins.x;
			var y = this._calculatedMargins.y;
			var w = this._calculatedMargins.w;
			var h = this._calculatedMargins.h;
			var left = (strokeWeight/2)+x;
			var top = (strokeWeight/2)+y;
			
			this._drawPieItemTag();
			
			sHtml.push('<v:group class="ev" style="position:absolute;top:'+top+'px;left:'+left+'px;width:'+w+'px;height:'+h+'px;" coordorigin="0,0" coordsize="'+w+','+h+'">');
			sHtml.push( this._itemTag.join('') );
			sHtml.push('</v:group>');
			document.getElementById(sId).innerHTML = sHtml.join('');
			
			this.pieItemElem = document.getElementById('SelfCheck_pie_item_'+sId+'_0');
			
		}
		,_drawPieItemTag: function(){
			
			if( this._isOldIE ){
				this._drawPieItemTag_IE();
				return;
			}
			
			this._itemTag = [];
			var sId = this._containerId;
			var opt = this.options;
			var color = '#ffffff';
			var strokeWeight = opt.strokeWeight || 0;
			var data = this._chartData;
			var len = data.length || 0;
			
			for( var i=0; i<len; i++ ){
				if( i == 0 ){
					color = opt.colors[1];
					this._itemTag.push('<path d="" id="SelfCheck_pie_item_'+sId+'_1" fill="none" stroke="'+color+'" stroke-width="'+(strokeWeight)+'" stroke-linecap="round" />');
				}else{
					if(opt.backgroundImage == ''){
						this._itemTag.push('<path d="" id="SelfCheck_pie_item_'+sId+'_0" fill="none" stroke="'+opt.colors[0]+'" stroke-width="'+strokeWeight+'" stroke-linecap="round" />');
					}else{
						this._itemTag.push('<path d="" id="SelfCheck_pie_item_'+sId+'_0" fill="none" stroke="url(#SelfCheck_pattern_'+sId+')" stroke-width="'+strokeWeight+'" stroke-linecap="round" />');
					}
				}
				
			}
		}
		,_drawPieItemTag_IE: function(){
			
			this._itemTag = [];
			var sId = this._containerId;
			var opt = this.options;
			var color = '#ffffff';
			var strokeWeight = opt.strokeWeight || 0;
			var imgUrl = opt.backgroundImage;
			var data = this._chartData;
			var len = data.length || 0;
			var x = this._calculatedMargins.x;
			var y = this._calculatedMargins.y;
			var w = this._calculatedMargins.w-strokeWeight;
			var h = this._calculatedMargins.h-strokeWeight;
			
			for( var i=0; i<len; i++ ){
				if( i == 0 ){
					color = opt.colors[1];
					this._itemTag.push('<v:arc class="ev" id="SelfCheck_pie_item_'+sId+'_1" style="width:'+w+'px;height:'+h+'px;" startangle="0" endangle="360">');
					this._itemTag.push('	<v:fill class="ev" on="false" />');
					this._itemTag.push('	<v:stroke class="ev" on="true" color="'+color+'" filltype="tile" endcap="round" weight="'+strokeWeight+'px"></v:stroke>');
					this._itemTag.push('</v:arc>');
				}else{
					this._itemTag.push('<v:arc class="ev" id="SelfCheck_pie_item_'+sId+'_0" style="width:'+w+'px;height:'+h+'px;" startangle="0" endangle="0">');
					this._itemTag.push('	<v:fill class="ev" on="false" />');
					if(imgUrl == ''){
						this._itemTag.push('<v:stroke class="ev" color="'+opt.colors[0]+'" filltype="" opacity="1" on="true" endcap="round" weight="'+strokeWeight+'px"></v:stroke>');
					}else{
						this._itemTag.push('<v:stroke class="ev" src="'+imgUrl+'" on="true" filltype="tile" endcap="round" weight="'+strokeWeight+'px"></v:stroke>');
					}
					this._itemTag.push('</v:arc>');
				}
				
			}
		}
		,_setPiePath: function( totalAngle ){
			
			var x = this._calculatedMargins.x;
			var y = this._calculatedMargins.y;
			var w = this._calculatedMargins.w;
			var h = this._calculatedMargins.h;
			
			var opt = this.options;
			var sId = this._containerId;
			var data = this._chartData;
			var len = data.length || 0;
			var sum = this._chartValue.sum;
			var strokeWeight = opt.strokeWeight || 0;
			var startAngle = -91;
			var endAngle = 0;
			var r = parseInt(w/2, 10);
			var clockwise = 0, d=[], xx, yy;
			var radians;
			var r2 = r-(strokeWeight/2); 
			
			endAngle = parseInt( Math.ceil(totalAngle * data[0]/sum), 10);
			clockwise = endAngle > 180? 1:0;
			
			for( var i=0; i<len; i++ ){	
				if( i==1 ){
					startAngle = -90;
					endAngle = 370;
				}
				d = [];
				for( var j=0; j<endAngle; j++ ){
					startAngle +=1;  
					radians= (startAngle/180) * Math.PI;
					xx = (r + Math.cos(radians) * r2) + x;
					yy = (r + Math.sin(radians) * r2) + y;
					
					if(j==0) {
						d.push(' M '+xx+' '+yy+' ');
					}else{
						d.push(' L '+xx+' '+yy+' ');
					} 
						
				}
				this.attr(document.getElementById('SelfCheck_pie_item_'+sId+'_'+i), 'd', d.join(''));
			}
			
		}
		,_setPiePath_IE: function( totalAngle ){
			var data = this._chartData;
			var sum = this._chartValue.sum;
			var endAngle = parseInt( Math.ceil(totalAngle * data[0]/sum), 10);
			endAngle = endAngle > 360? 360:endAngle;
			this.pieItemElem.endangle = endAngle;
		}
		,_setAnimation: function(){
			
			var sA = 0.001;
			var acc = 11;
			var Angle = 360/acc;
			var pie = this;
			
			if( this._isOldIE ){
				pie._moveIntervalId = window.setInterval( function(){
					
					acc *= 1.07;
					if(acc>250){acc = 320;}
					Angle = 360/acc;
					sA += Angle;
					
					pie._setPiePath_IE(sA);
					
					if( sA > 360 ){
						pie._setPiePath_IE(360);
						window.clearInterval(pie._moveIntervalId);
					}
				},50);
			}else{
				pie._moveIntervalId = window.setInterval( function(){
					acc *= 1.07;
					if(acc>250){acc = 320;}
					Angle = 360/acc;
					sA += Angle;
					
					pie._setPiePath(sA);
					
					if( sA > 360 ){
						pie._setPiePath(360);
						window.clearInterval(pie._moveIntervalId);
					}
					/*
					acc *= 1.12;
					if(acc>250){acc = 250;}
					Angle = 360/acc;
					sA += Angle;
					
					pie._setPiePath(sA);
					
					if( sA > 360 ){
						pie._setPiePath(360);
						window.clearInterval(pie._moveIntervalId);
					}
					*/
				},50);
			}
		}
		,_setEvent: function(){
			
			var _this = this;
			
			// 코인막대부분에 마우스오버 했을때
			$('.coin_graph div.circle_area li').off('mouseover').on('mouseover', function(e){
				
				var $li = $('.weather_area li');
				var $coinli = $('.circle_area li');
				var $tabli = $('.tab_area li');
				var $this = $(this);
				var idx = parseInt( $this.attr('indexCnt'), 10);
				$li.removeClass('on');
				$coinli.removeClass('on');
				$tabli.removeClass('over');
				$('.weather_area li.active').addClass('on');
				$('.circle_area li.active').addClass('on');
				
				$($li[idx]).addClass('on');
				$($coinli[idx]).addClass('on');
				$($tabli[idx]).addClass('over');
				
				$('.circle_area li a').css('top','0px');
				$this.find('a').css('top','-7px');
			});
			// 코인막대부분에서 마우스아웃 ?을때
			$('.coin_graph div.circle_area li').off('mouseout').on('mouseout', function(e){
				
				$('.weather_area li').removeClass('on');
				$('.circle_area li').removeClass('on');
				$('.tab_area li').removeClass('over');
				$('.weather_area li.active').addClass('on');
				$('.circle_area li.active').addClass('on');
				
				$('.coin_graph div.circle_area li a').css('top','0px');
			});
			
			// 차트의 tab(text)부분에 마우스오버 했을때
			$('.coin_graph div.tab_area li').off('mouseover').on('mouseover', function(e){
				
				var $li = $('.weather_area li');
				var $coinli = $('.circle_area li');
				var $tabli = $('.tab_area li');
				var $this = $(this);
				var idx = parseInt( $this.attr('indexCnt'), 10);
				$li.removeClass('on');
				$coinli.removeClass('on');
				$tabli.removeClass('over');
				$('.weather_area li.active').addClass('on');
				$('.circle_area li.active').addClass('on');
				
				$($li[idx]).addClass('on');
				$($coinli[idx]).addClass('on');
				$($tabli[idx]).addClass('over');
				
				$('.circle_area li a').css('top','0px');
				$($coinli[idx]).find('a').css('top','-7px');
			});
			
			// 차트의 tab(text)부분에 마우스아웃 했을때
			$('.coin_graph div.tab_area li').off('mouseout').on('mouseout', function(e){
				
				$('.weather_area li').removeClass('on');
				$('.circle_area li').removeClass('on');
				$('.tab_area li').removeClass('over');
				$('.weather_area li.active').addClass('on');
				$('.circle_area li.active').addClass('on');
				
				$('.coin_graph div.circle_area li a').css('top','0px');
			});
			
			// 코인막대를 클릭 했을때
			$('.coin_graph div.circle_area li').off('click').on('click', function(e){
				
				var $weatherul = $('.weather_area ul');
				var $coinul = $('.circle_area ul');
				var $tabul = $('.tab_area ul');
				$weatherul.addClass('off');
				$coinul.addClass('off');
				$tabul.addClass('off');
				
				var $coinli = $('.circle_area li');
				var $tabli = $('.tab_area li');
				
				var $this = $(this);
				var $li = $('.weather_area li');
				var $coinli = $('.circle_area li');
				var $tabli = $('.tab_area li');
				var idx = parseInt( $this.attr('indexCnt'), 10);
				$li.removeClass('active');
				$coinli.removeClass('active');
				$($li[idx]).addClass('active on');
				$($coinli[idx]).addClass('active on');
				
				
				var oData = $this.attr('data') || '{}';
				var sName = oData.split('^')[1] || '';
				var sStatus = oData.split('^')[0] || '';
				oData = {
					name: sName
					,status: sStatus
				};
				if(typeof _this._options.events.click == 'function'){
					var $li = $('.coin_graph div.tab_area li');
					var idx = parseInt( $this.attr('indexCnt'), 10);
					$li.removeClass('on');
					$($li[idx]).addClass('on');
					// callback
					_this._options.events.click(e, this, oData);
				}
				
				$('.circle_area').slideUp("fast");
				$('.coin_graph a.bt_show').removeClass('down').addClass('up');
			});
			
			// 차트의 tab(text)부분 클릭 했을때
			$('.coin_graph div.tab_area li').off('click').on('click', function(e){
				
				var $weatherul = $('.weather_area ul');
				var $coinul = $('.circle_area ul');
				var $tabul = $('.tab_area ul');
				$weatherul.addClass('off');
				$coinul.addClass('off');
				$tabul.addClass('off');
				
				var $this = $(this);
				var $li = $('.weather_area li');
				var $coinli = $('.circle_area li');
				var $tabli = $('.tab_area li');
				var idx = parseInt( $this.attr('indexCnt'), 10);
				$li.removeClass('active');
				$coinli.removeClass('active');
				$tabli.removeClass('on');
				$($li[idx]).addClass('active on');
				$($coinli[idx]).addClass('active on');
				$(this).addClass('on');
				
				var oData = $this.attr('data') || '{}';
				var sName = oData.split('^')[1] || '';
				var sStatus = oData.split('^')[0] || '';
				oData = {
					name: sName
					,status: sStatus
				};
				if(typeof _this._options.events.tabClick == 'function'){
					// callback
					_this._options.events.tabClick(e, this, oData);
				}
				
				$('.circle_area').slideUp("fast");
				$('.coin_graph a.bt_show').removeClass('down').addClass('up');
			});
			
			// 상하 토글 버튼 클릭 했을때
			$('.coin_graph a.bt_show').off('click').on('click', function(e){
				e.preventDefault();
				var $this = $(this);
				if( $this.hasClass('up') ){
					$('.circle_area').slideDown("fast");
					$this.removeClass('up').addClass('down');
				}else{
					$('.circle_area').slideUp("fast");
					$this.removeClass('down').addClass('up');
				}
				
			});
			
		}
		
	});
	
	
	GLChart.Line = function(){
		GLChart.call(this, arguments);
		this.aSaveLineCoordValue = [];
		this.options = {
			type : 'line'
			,lineWidth : [2]
			,lineShadow : false
			,lineType : 'normal'	// 'normal', 'curve', 'step'
			,linePointSize : [3]
			,linePointColor : ['#ffffff']
			,linePointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
			,linePointStep : [1]	// step만큼 point를 띄워서 보여줌
			,linePointLabelTextStyle : {color:['#ffffff'], fontSize:[12], fontName:['Gulim'], fontStyle:['normal']}
			,linePointLabelBox : false
			,linePointLabelBoxPosition : ['top']
			,linePointLabelBoxBackground : {strokeColor:['auto'], strokeThickness:[1], fill:['auto'], opacity:[1], margin:[2]}
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
	};
	GLChart.Line.prototype = new GLChart([]);
	GLChart.extend(GLChart.Line, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawLineChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
		},
		drawLineChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
				if( this.options.linePointLabelBox ){
					this.clearRect( this.oCanvas_item2, this.graphics_item2, this.sWidth, this.sHeight);
					this.clearRect( this.oCanvas_item3, this.graphics_item3, this.sWidth, this.sHeight);
				}
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawLine();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
			
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var line = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var acc = 0.07;
			var th;
			
			this.drawAxis();
			this.drawLine('calc');
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			line.animationInst = window.setInterval( function(){
			
				line.clearRect( line.oCanvas_item, line.graphics_item, line.sWidth, line.sHeight);
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				
				th = line.calculatedMargins.h+line.calculatedMargins.y;
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				line.redrawLineSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,line.sWidth,line.sHeight);
					line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
					line.drawLine();
					window.clearInterval(line.animationInst);
					
					if( line.options.xRange.on ){
						line.drawRange();
					}
				}
			},40);
			
		},
		redrawLineSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var val			= this.aSaveLineCoordValue;
			var lineCnt		= this.aData[0].length;
			var len			= val.length;
			var lineWidth;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			//this.clearRect( this.oCanvas_item, ctx, this.sWidth, this.sHeight);
			
			for( var j=1; j<lineCnt; j++ ) {
				lineWidth = vo.lineWidth[(j-1)%vo.lineWidth.length];
				if( vo.lineShadow && lineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				ctx.beginPath();
				len	= val[j-1].length;
				for( var i=0;i<len;i++ ){
					if( vo.lineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
						}
					}else if( vo.lineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
						}
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = lineWidth;
				ctx.stroke();
				ctx.lineWidth = 1;
			}
			if( vo.lineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawLine : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aData;
			var lineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null, aDownColorValue=[];
			
			for( var j=1; j<lineCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 1);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				sX = sX + (xg/2);
				lineWidth = vo.lineWidth[(j-1)%vo.lineWidth.length];
				
				if( vo.lineShadow && lineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.lineType == 'curve' || vo.lineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				if( vo.isDownValueColors ){
					aDownColorValue = [];
				}
				
				this.aSaveLineCoordValue.push([]);
				
				if(!this.yZero){
					this.yZero = (vo.chartArea.top);
				}
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						if( vo.yAxis.minValue == 0 ){
							yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}else{
							yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
						}
					}
				  
					if( isNaN(yHeight) ){
						yHeight = this.calculatedMargins.h + this.yZero;
					}
				  
					// draw bezierCurve 
					if( vo.lineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							
							if( isNaN(yHeight) ){
								yHeight = this.calculatedMargins.h + this.yZero;
							}
							
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							
							if( d[i][j] != null ){
								ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
							}	
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								if( vo.yAxis.minValue == 0 ){
									yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
								}else{
									tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								}
							}
							
							if( isNaN(yHeight) ){
								yHeight = this.calculatedMargins.h + this.yZero;
							}
							
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							
							if( d[i][j] != null ){
								ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
							}
						}
					}else if( vo.lineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							if( d[i][j] != null ){
								ctx.lineTo(sX, fy);
								ctx.lineTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
							}
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							
							if( d[i][j] != null ){	
								if( vo.isDownValueColors && fy < yHeight ){
									
									ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
									ctx.lineWidth = lineWidth;
									if( !arguments[0] ){
										ctx.stroke();
									}	
									ctx.lineWidth = 1;
									ctx.beginPath();
									ctx.moveTo(sX, yHeight);
								
									aDownColorValue.push([sX-xg, fy, sX, yHeight, 'butt', lineWidth, vo.downValueColors[(j-1)%vo.downValueColors.length]]);
									this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
								}else{
									ctx.lineTo(sX, yHeight);
									this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
								}
							}
						}	
						
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight;
					sX = sX + xg;
					eX = sX;
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = lineWidth;
				if( !arguments[0] ){
					ctx.stroke();
				}	
				ctx.lineWidth = 1;
				
				if( vo.isDownValueColors ){
					for(var l = 0,len=aDownColorValue.length; l<len; l++){
						this._drawLine( 
										ctx
										,aDownColorValue[l][0]
										,aDownColorValue[l][1]
										,aDownColorValue[l][2]
										,aDownColorValue[l][3]
										,aDownColorValue[l][4]
										,aDownColorValue[l][5]
										,aDownColorValue[l][6]
									);
					}
				}
				
				// draw line point ================================
				//if( vo.linePointSize[(j-1)%vo.linePointSize.length] != 0 && !arguments[0] ) {
				if( !arguments[0] ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 1);
					sX = sX + (xg/2);
					this.drawLinePointer(sX, xg, pointCnt, j, lineWidth);
				}
				// draw line point ================================
				
			}
			
			if( vo.lineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawLineLegend : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aData;
			var lineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null;
			
			for( var j=1; j<lineCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 1);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				sX = sX + (xg/2);
				lineWidth = vo.lineWidth[(j-1)%vo.lineWidth.length];
				
				if( vo.lineShadow && lineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.lineType == 'curve' || vo.lineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue.push([]);
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.lineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}
					}else if( vo.lineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight;
					sX = sX + xg;
					eX = sX;
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = lineWidth;
				if( this.coordinateLegend[j-1][5] ){
					ctx.stroke();
				}
				ctx.lineWidth = 1;
				
				// draw line point ================================
				if( vo.linePointSize[(j-1)%vo.linePointSize.length] != 0  ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 1);
					sX = sX + (xg/2);
					if( this.coordinateLegend[j-1][5] ){
						this.drawLinePointer(sX, xg, pointCnt, j, lineWidth);
					}else{
						this.drawLinePointer(sX, xg, pointCnt, j, lineWidth, false);
					}	
				}
				// draw line point ================================
				
			}
			
			if( vo.lineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawLinePointer : function( sX, xg, pointCnt, j, lineWidth, isDraw ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yTempHeight = null, yHeight=null, downColorHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var ctx 		= this.graphics_item;
			var pointType	= vo.linePointType[(j-1)%vo.linePointType.length];
			var pointSize	= vo.linePointSize[(j-1)%vo.linePointSize.length];
			var pointColor	= vo.linePointColor[(j-1)%vo.linePointColor.length];
			var pointColor2	= vo.colors[(j-1)%vo.colors.length];
			var pointStep	= vo.linePointStep[(j-1)%vo.linePointStep.length];
			var starHeight	= null;
			
			// point에 label 붙이기 관련변수--------------------------
			if(vo.linePointLabelBox){
				var plbX, plbY, plbW, plbH, plbVal, plbGap = 5;
				var plbTextColor = vo.linePointLabelTextStyle.color[(j-1)%vo.linePointLabelTextStyle.color.length];
				var plbTextSize = vo.linePointLabelTextStyle.fontSize[(j-1)%vo.linePointLabelTextStyle.fontSize.length];
				var plbTextName = vo.linePointLabelTextStyle.fontName[(j-1)%vo.linePointLabelTextStyle.fontName.length];
				var plbTextStyle = vo.linePointLabelTextStyle.fontStyle[(j-1)%vo.linePointLabelTextStyle.fontStyle.length];
				var plbPosition = vo.linePointLabelBoxPosition[(j-1)%vo.linePointLabelBoxPosition.length];
				var plbStrokeColor 	= vo.linePointLabelBoxBackground.strokeColor[(j-1)%vo.linePointLabelBoxBackground.strokeColor.length];
				var plbStrokeThickness = vo.linePointLabelBoxBackground.strokeThickness[(j-1)%vo.linePointLabelBoxBackground.strokeThickness.length];
				var plbFill 		= vo.linePointLabelBoxBackground.fill[(j-1)%vo.linePointLabelBoxBackground.fill.length];
				var plbOpacity 		= vo.linePointLabelBoxBackground.opacity[(j-1)%vo.linePointLabelBoxBackground.opacity.length];
				var plbMargin 		= vo.linePointLabelBoxBackground.margin[(j-1)%vo.linePointLabelBoxBackground.margin.length];
			}
			
			for(var i=1;i<pointCnt;i++) {
			
				if( d[i][j] != null ){
			
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						if( vo.yAxis.minValue == 0 ){
							yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}else{
							yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
						}
					}
					
					if( isNaN(yHeight) ){
						yHeight = this.calculatedMargins.h + this.yZero;
					}
					
					if( i==1 ){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
					}
					ctx.fillStyle = pointColor;
					
					if( (i % pointStep) == 0  ){
						
						ctx.beginPath();
						ctx.lineWidth = lineWidth;
						if( pointType == 'circle' ){
							ctx.lineWidth = lineWidth+1;
							ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
						}else if( pointType == 'rectangle' ){
							ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
							ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
							ctx.lineWidth = lineWidth/2;
						}else if( pointType == 'diamond' ){
							ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
							ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
							ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
							ctx.lineTo((sX-pointSize), yHeight);
							ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						}else if( pointType == 'upTriangle' ){
							ctx.moveTo((sX-pointSize), yHeight + pointSize);
							ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
							ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
							ctx.lineTo((sX-pointSize), yHeight + pointSize);
						}else if( pointType == 'downTriangle' ){
							ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
							ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
							ctx.lineTo((sX-pointSize), yHeight - pointSize);
							ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
						}else if( pointType == 'star' ){
							starHeight = yHeight-pointSize/1.2;
							ctx.moveTo(sX, starHeight-pointSize/5);
							ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
							ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
							ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
							ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
							ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
							ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
							ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
							ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
							ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
							ctx.lineTo(sX, starHeight-pointSize/5)
						}
						ctx.closePath();
						ctx.fillStyle = pointColor;
						if( vo.isDownValueColors && downColorHeight ){
							if(downColorHeight < yHeight){
								ctx.strokeStyle = vo.downValueColors[(j-1)%vo.downValueColors.length];
							}else{
								ctx.strokeStyle = pointColor2;
							}
						}else{
							ctx.strokeStyle = pointColor2;
						}	
						
						
						if( isDraw != false ){
							ctx.stroke();
							ctx.fill();
						}
						
						// point에 label 붙이기----------------------------------------------------------------
						if(vo.linePointLabelBox){
						
							var ctx2 		= this.graphics_item2;
						
							ctx2.font = plbTextStyle+' '+plbTextSize+'px "'+plbTextName+'"';
							ctx2.textAlign = 'center';
							ctx2.textBaseline = 'middle';
						
							plbVal = this.formatter(d[i][j], vo.yAxis.format);
							plbW = ctx2.measureText(plbVal).width+(plbMargin*2);
							plbH = plbTextSize+(plbMargin*2);
							if( plbPosition == 'top' ){
								plbX = sX - (plbW/2);
								plbY = yHeight - plbH - pointSize - plbGap;
							}else if( plbPosition == 'left' ){
								plbX = sX - (plbW + plbGap + pointSize);
								plbY = yHeight - (plbH/2);
							}else if( plbPosition == 'right' ){
								plbX = sX + (plbGap + pointSize);
								plbY = yHeight - (plbH/2);
							}else if( plbPosition == 'bottom' ){
								plbX = sX - (plbW/2);
								plbY = yHeight + pointSize + plbGap;
							}else{
								plbX = sX - (plbW/2);
								plbY = yHeight - plbH - pointSize - plbGap;
							}
							
							if(plbStrokeColor == 'auto'){
								plbStrokeColor = pointColor2;
							}
							if(plbFill == 'auto'){
								plbFill = pointColor2;
							}
							if(plbStrokeThickness == 0){
								plbStrokeColor = pointColor2;
								plbStrokeThickness = 1;
							}
							
							//plbStrokeColor = this.colorToRgba(plbStrokeColor, plbOpacity);
							
							this._roundedRect( ctx2, plbX, plbY, plbW, plbH, 0, plbStrokeColor, true, true, true, true, plbStrokeThickness);
							ctx2.fillStyle = this.colorToRgba(plbFill, plbOpacity);
							ctx2.fill();
							
							ctx2.fillStyle = plbTextColor;
							ctx2.fillText(plbVal ,plbX+(plbW/2), plbY+(plbH/2));
						}
					
					}
					
				}
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:yHeight
					  ,width:15
					  ,height:15
					  ,down:(i==1)?false:(downColorHeight < yHeight? true:false)
					};
				if( isDraw == false ){
					aColumn.push({x:0,y:0,width:0,height:0,down:false});
				}else{
					aColumn.push(oCoor);
				}	
				
				sX = sX + xg;
				downColorHeight = yHeight;
			}
			this.coordinate.push(aColumn); 
		},
		setSelectLinePoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					var down = this.coordinate[i][j].down;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap, down );
								this.drawTooltipPoint([j,i], '', down);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap, down );
								this.drawTooltipPoint([j,i], '', down);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectLegendItem : function(e){
			var vo 			= this.options;
			var ctx 		= this.graphics_legend;
			var selectFlag	= false;
			var pointX, pointY, gap=10, x, y, width, height, color;
			if( arguments[2] ){
				var mouseCoords = this.getMouseXY(e, arguments[1], arguments[2]);
			}else{
				var mouseCoords = this.getMouseXY(e, arguments[1]);
			}
			
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinateLegend.length;
			  
			for( var i=0;i<len;i++ ) {
			
				x = this.coordinateLegend[i][0];
				y = this.coordinateLegend[i][1];
				width = this.coordinateLegend[i][2];
				height = this.coordinateLegend[i][3];
				color = this.coordinateLegend[i][4];
				
				if( x < mx && mx < (x+width) ) {
					if( y < my && my < y+height ) {
					
						if( this.coordinateLegend[i][5] ){
							this.rect(ctx, x, y, width, height, '#e2e2e2', '');
							this.coordinateLegend[i][5] = false;
						}else{
							this.rect(ctx, x, y, width, height, color, '');
							this.coordinateLegend[i][5] = true;
						}
						
						//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
						this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
						this.drawLineLegend();
						
					}
				}
				
			}
		},
		setSelectLinePointLine : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			this.drawTooltipPointLine(e, mx, my);
			
		},
		setSelectLinePoint_click : function(e){
			var vo 			= this.options;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								this.returnEventData( e, [j, i] );
							}
						}else{
							if( height > my && my > y ) {
							
								this.returnEventData( e, [j, i] );
							}
						}
					}
				}
			}
			
			
		},
		canvas_event_func_line : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem, chartCanvas;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else if(elem.nodeName == "canvas" ){
						chartCanvas = elem;
						cb(elem.parentElement);
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				if( e.type=='mouseup' ){
					eThis.setSelectLegendItem(e, chartElem);
				}
				return;
			}
			
			if(e.target){
				if( target.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartElem);
					}
					return;
				}
			}else{
				if( chartCanvas.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartCanvas, true);
					}
					return;
				}
			}
			
			
			var options = eThis.options;
			
			if(options.theme.tooltipStyle == 1){
				if(e.type=='mousemove'){
					eThis.setSelectLinePoint(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectLinePoint(e, chartElem);
				}else if( e.type=='mouseup' ){
						
				}else if( e.type=='click' ){
					eThis.setSelectLinePoint_click(e, chartElem);
				}
			}else if(options.theme.tooltipStyle == 2){
				if(e.type=='mousemove'){
					eThis.setSelectLinePointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectLinePointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					eThis.setSelectLinePointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectLinePointLine(e, chartElem);	
				}else if( e.type=='click' ){
					eThis.setSelectLinePoint_click(e, chartElem);
				}
			}else if(options.theme.tooltipStyle == 3){
				if(e.type=='mousemove'){
					eThis.setSelectLinePointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectLinePointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					eThis.setSelectLinePointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectLinePointLine(e, chartElem);	
				}else if( e.type=='click' ){
					eThis.setSelectLinePoint_click(e, chartElem);
				}
			}
		}
	});
	
	GLChart.Area = function(){
		GLChart.call(this, arguments);
		this.aSaveLineCoordValue = [];
		this.iAreaPointerWidth = 15;
		this.options = {
			type : 'area'
			,areaLineWidth : [2]
			,areaLineShadow : false
			,areaLineType : 'normal'	// 'normal', 'curve', 'step'
			,areaLinePointSize : [3]
			,areaLinePointStep : [1]
			,areaLinePointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
			,areaOpacity : 0.3
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
	};
	GLChart.Area.prototype = new GLChart([]);
	GLChart.extend(GLChart.Area, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawAreaChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
			
		},
		drawAreaChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawArea();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var area = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var acc = 0.07;
			var th;
			
			this.drawAxis();
			this.drawArea('calc');
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			area.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				
				th = area.calculatedMargins.h+area.calculatedMargins.y;
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				area.redrawAreaSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,area.sWidth,area.sHeight);
					area.clearRect( area.oCanvas_item, area.graphics_item, area.sWidth, area.sHeight);
					area.drawArea();
					window.clearInterval(area.animationInst);
					
					if( area.options.xRange.on ){
						area.drawRange();
					}
				}
			},40);
			
		},
		redrawAreaSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var val			= this.aSaveLineCoordValue;
			var areaCnt		= this.aData[0].length;
			var len			= val.length;
			var areaWidth;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			
			for( var j=1; j<areaCnt; j++ ) {
				areaWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				if( vo.areaLineShadow && areaWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				ctx.beginPath();
				len	= val[j-1].length;
				for( var i=0;i<len;i++ ){
					if( vo.areaLineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
						}
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaWidth;
				ctx.stroke();
				
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
				//ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
				//ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
				ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, (!!this.yZero?this.yZero:this.calculatedMargins.h+this.calculatedMargins.y));
				ctx.lineTo(this.calculatedMargins.x, (!!this.yZero?this.yZero:this.calculatedMargins.h+this.calculatedMargins.y));
				ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				ctx.fill();
				ctx.lineWidth = 1;
			}
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawArea : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var areaCnt		= this.aData[0].length;
			var d			= this.aData;
			var areaLineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null;
			
			for( var j=1; j<areaCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 2);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				//sX = sX + (xg/2);
				areaLineWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				
				if( vo.areaLineShadow && areaLineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.areaLineType == 'curve' || vo.areaLineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue.push([]);
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.areaLineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}
					}else if( vo.areaLineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight;
					sX = sX + xg;
					eX = sX;
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaLineWidth;
				if( !arguments[0] ){
					ctx.stroke();
					
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
					//ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					//ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, (!!this.yZero?this.yZero:this.calculatedMargins.h+this.calculatedMargins.y));
					ctx.lineTo(this.calculatedMargins.x, (!!this.yZero?this.yZero:this.calculatedMargins.h+this.calculatedMargins.y));
					
					ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
					ctx.fill();
					
				}	
				ctx.lineWidth = 1;
				
				// draw line point ================================
				//if( vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length] != 0 && !arguments[0] ) {
				if( !arguments[0] ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 2);
					//sX = sX + (xg/2);
					this.drawAreaPointer(sX, xg, pointCnt, j, areaLineWidth);
				}
				// draw line point ================================
				
			}
			
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawAreaLegend : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var areaCnt		= this.aData[0].length;
			var d			= this.aData;
			var areaLineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null;
			
			for( var j=1; j<areaCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 2);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				//sX = sX + (xg/2);
				areaLineWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				
				if( vo.areaLineShadow && areaLineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.areaLineType == 'curve' || vo.areaLineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue.push([]);
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.areaLineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}
					}else if( vo.areaLineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight;
					sX = sX + xg;
					eX = sX;
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaLineWidth;
				if( this.coordinateLegend[j-1][5] ){
					ctx.stroke();
				
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
					ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
					ctx.fill();
					
				}	
				ctx.lineWidth = 1;
				
				// draw line point ================================
				if( vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length] != 0 ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 2);
					//sX = sX + (xg/2);
					if( this.coordinateLegend[j-1][5] ){
						this.drawAreaPointer(sX, xg, pointCnt, j, areaLineWidth);
					}else{
						this.drawAreaPointer(sX, xg, pointCnt, j, areaLineWidth, false);
					}
				}
				// draw line point ================================
				
			}
			
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawAreaPointer : function( sX, xg, pointCnt, j, areaLineWidth, isDraw ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var ctx 		= this.graphics_item;
			var pointType	= vo.areaLinePointType[(j-1)%vo.areaLinePointType.length];
			var pointSize	= vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length];
			var pointStep	= vo.areaLinePointStep[(j-1)%vo.areaLinePointStep.length];
			var pointColor	= vo.colors[(j-1)%vo.colors.length];
			var starHeight	= null;
			
			for(var i=1;i<pointCnt;i++) {
				if( vo.yAxis.minValue == 'auto' ){
					yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
					yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
				}else{
					yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
				}
				
				if( i==1 ){
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
				}
				
				if( (i % pointStep) == 0  ){
				
					ctx.beginPath();
					ctx.lineWidth = areaLineWidth;
					if( pointType == 'circle' ){
						ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
					}else if( pointType == 'rectangle' ){
						ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.lineWidth = areaLineWidth/2;
					}else if( pointType == 'diamond' ){
						ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
						ctx.lineTo((sX-pointSize), yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
					}else if( pointType == 'upTriangle' ){
						ctx.moveTo((sX-pointSize), yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize), yHeight + pointSize);
					}else if( pointType == 'downTriangle' ){
						ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize), yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
					}else if( pointType == 'star' ){
						starHeight = yHeight-pointSize/1.2;
						ctx.moveTo(sX, starHeight-pointSize/5);
						ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
						ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX, starHeight-pointSize/5)
					}
					ctx.closePath();
					ctx.fillStyle = '#ffffff';
					ctx.strokeStyle = pointColor;
					if( isDraw != false ){
						ctx.stroke();
						ctx.fill();
					}
				}
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:yHeight
					  ,width:this.iAreaPointerWidth
					  ,height:this.iAreaPointerWidth
					};
				if( isDraw == false ){
					aColumn.push({x:0,y:0,width:0,height:0});
				}else{
					aColumn.push(oCoor);
				}
				
				sX = sX + xg;
			}
			this.coordinate.push(aColumn); 
		},
		setSelectAreaPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
							}
						}else{
							if( height > my && my > y ) {
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		
		setSelectAreaPointTight : function(e){
			var vo 			= this.options;
			var half		= Math.round(this.iAreaPointerWidth/2);
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			  
			  
			var xIndex = Math.round(((mx - this.calculatedMargins.x) * (this.aData.length-2) ) / this.calculatedMargins.w);
			var sxIndex = Math.round(((mx - this.calculatedMargins.x - half) * (this.aData.length-2) ) / this.calculatedMargins.w);
			var exIndex = Math.round(((mx - this.calculatedMargins.x + half) * (this.aData.length-2) ) / this.calculatedMargins.w);
			//document.getElementById('chartCon03_text').innerHTML = mx+', '+my+', '+xIndex+", "+sxIndex+ ", "+exIndex;
			
			var selX = null;
			var selData = null;
			  
			  
			if( sxIndex < 0 ){ sxIndex = 0; }
			if( exIndex > (this.aData.length-1) ){ exIndex = (this.aData.length-1); }
			var indexLen = exIndex - sxIndex;  
			  
			for( var i=0;i<len;i++ ) {
				for( var j=sxIndex; j<(sxIndex+indexLen); j++ ){
					var x = this.coordinate[i][j].x - half;
					var y = this.coordinate[i][j].y - half;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+half + gap;
								pointY = height - gap-5;
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [ e, [j, i], [pointX,pointY], gap ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i], [pointX,pointY], gap ];
									}
								}
								
								//this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								//this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
							}
						}else{
							if( height > my && my > y ) {
								pointX = x+half + gap;
								pointY = height - gap-5;
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [ e, [j, i], [pointX,pointY], gap ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i], [pointX,pointY], gap ];
									}
								}
								
								//this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								//this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
							}
						}
					}
				}
			}
			
			if( selX ){
				this.drawTooltip( selData[0], selData[1], selData[2], selData[3] );
				this.drawTooltipPoint(selData[1]);
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		
		setSelectLegendItem : function(e){
			var vo 			= this.options;
			var ctx 		= this.graphics_legend;
			var selectFlag	= false;
			var pointX, pointY, gap=10, x, y, width, height, color;
			if( arguments[2] ){
				var mouseCoords = this.getMouseXY(e, arguments[1], arguments[2]);
			}else{
				var mouseCoords = this.getMouseXY(e, arguments[1]);
			}
			
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinateLegend.length;
			  
			for( var i=0;i<len;i++ ) {
			
				x = this.coordinateLegend[i][0];
				y = this.coordinateLegend[i][1];
				width = this.coordinateLegend[i][2];
				height = this.coordinateLegend[i][3];
				color = this.coordinateLegend[i][4];
				
				if( x < mx && mx < (x+width) ) {
					if( y < my && my < y+height ) {
					
						if( this.coordinateLegend[i][5] ){
							this.rect(ctx, x, y, width, height, '#e2e2e2', '');
							this.coordinateLegend[i][5] = false;
						}else{
							this.rect(ctx, x, y, width, height, color, '');
							this.coordinateLegend[i][5] = true;
						}
						
						//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
						this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
						this.drawAreaLegend();
						
					}
				}
				
			}
		},
		setSelectAreaPointLine : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			this.drawTooltipPointLine(e, mx, my);
			
		},
		setSelectAreaPoint_click : function(e){
			var vo 			= this.options;
			var half		= Math.round(this.iAreaPointerWidth/2);
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			
			var xIndex = Math.round(((mx - this.calculatedMargins.x) * (this.aData.length-2) ) / this.calculatedMargins.w);
			var sxIndex = Math.round(((mx - this.calculatedMargins.x - half) * (this.aData.length-2) ) / this.calculatedMargins.w);
			var exIndex = Math.round(((mx - this.calculatedMargins.x + half) * (this.aData.length-2) ) / this.calculatedMargins.w);
			//document.getElementById('chartCon03_text').innerHTML = mx+', '+my+', '+xIndex+", "+sxIndex+ ", "+exIndex;
			
			var selX = null;
			var selData = null;
			  
			  
			if( sxIndex < 0 ){ sxIndex = 0; }
			if( exIndex > (this.aData.length-1) ){ exIndex = (this.aData.length-1); }
			var indexLen = exIndex - sxIndex;  
			  
			if( exIndex == sxIndex ){ indexLen = 1; }  
			  
			for( var i=0;i<len;i++ ) {
				for( var j=sxIndex; j<(sxIndex+indexLen); j++ ){
					var x = this.coordinate[i][j].x - half;
					var y = this.coordinate[i][j].y - half;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								//this.returnEventData( e, [j, i] );
								
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [ e, [j, i] ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i] ];
									}
								}
								
								
							}
						}else{
							if( height > my && my > y ) {
							
								//this.returnEventData( e, [j, i] );
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [ e, [j, i] ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i] ];
									}
								}
							}
						}
					}
				}
			}
			if( selData ){
				this.returnEventData( selData[0], selData[1] );
			}
			
		},
		canvas_event_func_area : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem, chartCanvas;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else if(elem.nodeName == "canvas" ){
						chartCanvas = elem;
						cb(elem.parentElement);
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			
			if( target.id == eThis.sContainer+'___legend' ){
				if( e.type=='mouseup' ){
					eThis.setSelectLegendItem(e, chartElem);
				}
				return;
			}
			if(e.target){
				if( target.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartElem);
					}
					return;
				}
			}else{
				if(!chartCanvas){
					return;
				}
			
				if( chartCanvas.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartCanvas, true);
					}
					return;
				}
			}
			
			var options = eThis.options;
			
			if(options.theme.tooltipStyle == 1){
				if(e.type=='mousemove'){
					
					var xg = eThis.calculatedMargins.w / (eThis.aData.length - 2);
					if( eThis.iAreaPointerWidth > xg ) {
						eThis.setSelectAreaPointTight(e, chartElem);
					}else{
						eThis.setSelectAreaPoint(e, chartElem);
					}
					
				}else if( e.type=='mousedown' ){
					//eThis.setSelectAreaPoint(e, chartElem);
				}else if( e.type=='mouseup' ){
						
				}else if( e.type=='click' ){
					eThis.setSelectAreaPoint_click(e, chartElem);
				}
			}else if(options.theme.tooltipStyle == 2){
				if(e.type=='mousemove'){
					eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					//eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					//eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='click' ){
					eThis.setSelectAreaPoint_click(e, chartElem);
				}
			}else if(options.theme.tooltipStyle == 3){
				if(e.type=='mousemove'){
					eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					//eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					//eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='click' ){
					eThis.setSelectAreaPoint_click(e, chartElem);
				}
			}
		}
	});
	
	GLChart.StackedArea = function(){
		GLChart.call(this, arguments);
		this.aSaveLineCoordValue = [];
		this.options = {
			type : 'stackedArea'
			,areaLineWidth : [2]
			,areaLineShadow : false
			,areaLineType : 'normal'	// 'normal', 'curve', 'step'
			,areaLinePointSize : [3]
			,areaLinePointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
			,areaOpacity : 0.3
			,stack100Percent : false
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
	};
	GLChart.StackedArea.prototype = new GLChart([]);
	GLChart.extend(GLChart.StackedArea, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawStackedAreaChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("mouseout", o, this.eventListener);
			
		},
		drawStackedAreaChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawStackedArea();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var area = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var acc = 0.07;
			var th;
			
			this.drawAxis();
			this.drawStackedArea('calc');
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			area.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				
				th = area.calculatedMargins.h+area.calculatedMargins.y;
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				area.redrawStackedAreaSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,area.sWidth,area.sHeight);
					area.clearRect( area.oCanvas_item, ctx, area.sWidth, area.sHeight);
					area.drawStackedArea();
					window.clearInterval(area.animationInst);
					
					if( area.options.xRange.on ){
						area.drawRange();
					}
				}
			},40);
			
		},
		redrawStackedAreaSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var val			= this.aSaveLineCoordValue;
			var val2		= null;
			var val3		= null;
			var areaCnt		= this.aData[0].length;
			var len			= val.length;
			var pointCnt 	= this.aData.length;
			var areaWidth;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item, ctx, this.sWidth, this.sHeight);
			
			for( var j=1; j<areaCnt; j++ ) {
				areaWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				if( vo.areaLineShadow && (areaWidth != 1 || areaWidth != 0) ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				len	= val[j-1].length;
				for( var i=0;i<len;i++ ){
					if( vo.areaLineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
						}
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaWidth;
				if( areaWidth != 0 ){
					ctx.stroke();
				}
				
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
				for(var i=pointCnt-1;i>0;i--) {
					if( j==1 ){
						ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
						ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					}else{
						val2 = this.aSaveLineCoordValue[j-2][i-1];
						val3 = this.aSaveLineCoordValue[j-2][i];
						if( vo.areaLineType == 'curve' ){
							if( i==pointCnt-1 ){
								ctx.lineTo(val2[4], val2[5]-(areaWidth/2));
							}else if( i == 1 ){
								ctx.bezierCurveTo( val3[2], val3[3]-(areaWidth/2), val3[0], val3[1]-(areaWidth/2), val2[0], val2[1]-(areaWidth/2));
							}else{
								ctx.bezierCurveTo( val3[2], val3[3]-(areaWidth/2), val3[0], val3[1]-(areaWidth/2), val2[4], val2[5]-(areaWidth/2));
							}
						}else if( vo.areaLineType == 'step' ){
							if( i==pointCnt-1 ){
								ctx.lineTo(val2[2], val2[3]-(areaWidth/2));
							}else if( i == 1 ){
								ctx.lineTo( val3[0], val3[1]-(areaWidth/2));
								ctx.lineTo( val2[0], val2[1]-(areaWidth/2));
							}else{
								ctx.lineTo( val3[0], val3[1]-(areaWidth/2));
								ctx.lineTo( val2[2], val2[3]-(areaWidth/2));
							}
						}else if( vo.areaLineType == 'normal' ){
							if( i==pointCnt-1 ){
								ctx.lineTo(val2[0], val2[1]-(areaWidth/2));
							}else if( i == 1 ){
								ctx.lineTo( val3[0], val3[1]-(areaWidth/2));
								ctx.lineTo( val2[0], val2[1]-(areaWidth/2));
							}else{
								ctx.lineTo( val3[0], val3[1]-(areaWidth/2));
							}
						}
					}
				}
				ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				ctx.fill();
				ctx.lineWidth = 1;
			}
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawStackedArea : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var areaCnt		= this.aData[0].length;
			var d			= this.aData;
			var areaLineWidth	= 1;
			var aPreYHeight	= [];
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			var calcData = null;
			
			var sX, sY, aSY=[], eX, eY, xg, yg, yTempHeight, yHeight = null, val=null, val2=null;
			
			for( var j=1; j<areaCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = null;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 2);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				aSY.push([]);
				//sX = sX + (xg/2);
				areaLineWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				
				if( vo.areaLineShadow && (areaLineWidth != 1 || areaLineWidth != 0) ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.areaLineType == 'curve' || vo.areaLineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue.push([]);
				
				for(var i=1;i<pointCnt;i++) {
				
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(calcData-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.areaLineType == 'curve' ){
					
						if( j==1 ){
							sY = yHeight;
						}else{
							if( i>1 ){
								sY = this.aSaveLineCoordValue[j-2][i-1][5]-((this.calculatedMargins.y+this.calculatedMargins.h)-yHeight);
							}else{
								sY = this.aSaveLineCoordValue[j-2][i-1][1]-((this.calculatedMargins.y+this.calculatedMargins.h)-yHeight);
							}	
						}
					
						if( i==1 ){
							ctx.moveTo(sX, sY);
							this.aSaveLineCoordValue[j-1].push([sX, sY]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = sY;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, sY);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, sY]);
						}else{
							rx = sX-(xg/divideVal);
							ry = sY;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, sY);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, sY]);
						}
					}else if( vo.areaLineType == 'step' ){
					
						if( j==1 ){
							sY = yHeight;
						}else{
							if( i>1 ){
								sY = this.aSaveLineCoordValue[j-2][i-1][3]-((this.calculatedMargins.y+this.calculatedMargins.h)-yHeight);
							}else{
								sY = this.aSaveLineCoordValue[j-2][i-1][1]-((this.calculatedMargins.y+this.calculatedMargins.h)-yHeight);
							}	
						}
					
						if( i==1 ){
							ctx.moveTo(sX, sY);
							this.aSaveLineCoordValue[j-1].push([sX, sY]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, sY);
							this.aSaveLineCoordValue[j-1].push([sX, fy, sX, sY]);
						}
					}else{
					
						if( j==1 ){
							sY = yHeight;
						}else{
							sY = this.aSaveLineCoordValue[j-2][i-1][1]-((this.calculatedMargins.y+this.calculatedMargins.h)-yHeight);
						}
					
						if( i==1 ){
							ctx.moveTo(sX, sY);
							this.aSaveLineCoordValue[j-1].push([sX, sY]);
						}else{
							ctx.lineTo(sX, sY);
							this.aSaveLineCoordValue[j-1].push([sX, sY]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = sY;
					sX = sX + xg;
					eX = sX;
					aSY[j-1].push(sY);
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaLineWidth;
				if( !arguments[0] ){
					if( areaLineWidth != 0 ){
						ctx.stroke();
					}
					
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
					for(var i=pointCnt-1;i>0;i--) {
						if( j==1 ){
							ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
							ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
						}else{
							val = this.aSaveLineCoordValue[j-2][i-1];
							val2 = this.aSaveLineCoordValue[j-2][i];
							if( vo.areaLineType == 'curve' ){
								if( i==pointCnt-1 ){
									ctx.lineTo(val[4], val[5]-(areaLineWidth/2));
								}else if( i == 1 ){
									ctx.bezierCurveTo( val2[2], val2[3]-(areaLineWidth/2), val2[0], val2[1]-(areaLineWidth/2), val[0], val[1]-(areaLineWidth/2));
								}else{
									ctx.bezierCurveTo( val2[2], val2[3]-(areaLineWidth/2), val2[0], val2[1]-(areaLineWidth/2), val[4], val[5]-(areaLineWidth/2));
								}
							}else if( vo.areaLineType == 'step' ){
								if( i==pointCnt-1 ){
									ctx.lineTo(val[2], val[3]-(areaLineWidth/2));
								}else if( i == 1 ){
									ctx.lineTo( val2[0], val2[1]-(areaLineWidth/2));
									ctx.lineTo( val[0], val[1]-(areaLineWidth/2));
								}else{
									ctx.lineTo( val2[0], val2[1]-(areaLineWidth/2));
									ctx.lineTo( val[2], val[3]-(areaLineWidth/2));
								}
							}else if( vo.areaLineType == 'normal' ){
								if( i==pointCnt-1 ){
									ctx.lineTo(val[0], val[1]-(areaLineWidth/2));
								}else if( i == 1 ){
									ctx.lineTo( val2[0], val2[1]-(areaLineWidth/2));
									ctx.lineTo( val[0], val[1]-(areaLineWidth/2));
								}else{
									ctx.lineTo( val2[0], val2[1]-(areaLineWidth/2));
								}
							}
						}
					}
					ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
					ctx.fill();
					
				}	
				ctx.lineWidth = 1;
				
				
				
			}
			
			for( var j=1; j<areaCnt; j++ ) {
				// draw line point ================================
				//if( vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length] != 0 && !arguments[0] ) {
				if( !arguments[0] ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 2);
					//sX = sX + (xg/2);
					this.drawStackedAreaPointer(sX, aSY[j-1], xg, pointCnt, j, areaLineWidth);
				}
				// draw line point ================================
			}
			
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawStackedAreaPointer : function( sX, aSY, xg, pointCnt, j, areaLineWidth ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var ctx 		= this.graphics_item;
			var pointType	= vo.areaLinePointType[(j-1)%vo.areaLinePointType.length];
			var pointSize	= vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length];
			var pointColor	= vo.colors[(j-1)%vo.colors.length];
			var starHeight	= null;
			
			for(var i=1;i<pointCnt;i++) {
				yHeight = aSY[i-1];
				
				if( i==1 ){
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
				}
				ctx.beginPath();
				ctx.lineWidth = areaLineWidth;
				if( pointType == 'circle' ){
					ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
				}else if( pointType == 'rectangle' ){
					ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					ctx.lineWidth = areaLineWidth/2;
				}else if( pointType == 'diamond' ){
					ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
                    ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
                    ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
                    ctx.lineTo((sX-pointSize), yHeight);
                    ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
				}else if( pointType == 'upTriangle' ){
					ctx.moveTo((sX-pointSize), yHeight + pointSize);
                    ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
                    ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
                    ctx.lineTo((sX-pointSize), yHeight + pointSize);
				}else if( pointType == 'downTriangle' ){
					ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
                    ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
                    ctx.lineTo((sX-pointSize), yHeight - pointSize);
                    ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
				}else if( pointType == 'star' ){
					starHeight = yHeight-pointSize/1.2;
					ctx.moveTo(sX, starHeight-pointSize/5);
					ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
					ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
					ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
					ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
					ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
					ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
					ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
					ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
					ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
					ctx.lineTo(sX, starHeight-pointSize/5)
				}
				ctx.closePath();
				ctx.fillStyle = '#ffffff';
				ctx.strokeStyle = pointColor;
				ctx.stroke();
				ctx.fill();
				
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:yHeight
					  ,width:15
					  ,height:15
					};
				aColumn.push(oCoor);
				
				sX = sX + xg;
			}
			this.coordinate.push(aColumn); 
		},
		setSelectStackedAreaPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectStackedAreaPointLine : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			this.drawTooltipPointLine(e, mx, my);
			
		},
		canvas_event_func_stackedArea : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			var options = eThis.options;
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(options.theme.tooltipStyle == 1){
				if(e.type=='mousemove'){
					eThis.setSelectStackedAreaPoint(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectStackedAreaPoint(e, chartElem);
				}else if( e.type=='mouseup' ){
						
				}
			}else if(options.theme.tooltipStyle == 2){
				if(e.type=='mousemove'){
					eThis.setSelectStackedAreaPointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectStackedAreaPointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					eThis.setSelectStackedAreaPointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectStackedAreaPointLine(e, chartElem);	
				}
			}else if(options.theme.tooltipStyle == 3){
				if(e.type=='mousemove'){
					eThis.setSelectStackedAreaPointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectStackedAreaPointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					eThis.setSelectStackedAreaPointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectStackedAreaPointLine(e, chartElem);	
				}
			}	
		}
	});
	
	GLChart.Column = function(){
		GLChart.call(this, arguments);
		this.aSaveColumnCoordValue = [];
		this.aSelection = null;
		this.options = {
			type : 'column'
			,columnOuterGap : 40
			,columnInnerGap : 0	// 멀티막대일 경우에 막대와 막대사이 간격.
			,columnShadow : false
			// columnText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			,columnText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12, fontStyle:'normal', prefix:'', suffix:'', margin:0}
			,columnType : 'rectangle'	// cylinder, rectangle.
			,columnSelectedColor : ['#ff0000']
			,columnEachItem : {on: false, colors: []}
			// 신규추가(2015.06.08)---------------
			,columnTextGuideLine : false
			,columnTextGuideLineColor : '#424242'
			,columnTextGuideLinePoint : false
			,columnTextBox : false
			,columnTextBoxMargin : 8
			,columnTextBoxFill : '#1b1b1b'
			,columnTextBoxStrokeColor : '#424242'
			,columnTextBoxStrokeThickness : 2
			,columnTextColors : []
			// 신규추가(2015.06.08)---------------
			// 신규추가(2016.07.27)---------------
			,columnBackgroundImg : false
			// 신규추가(2016.07.27)---------------
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		
		// 신규추가(2016.07.27)---------------
		this.aImgPattern = [];
		// 신규추가(2016.07.27)---------------
	};
	GLChart.Column.prototype = new GLChart([]);
	GLChart.extend(GLChart.Column, {
		render : function( o ){
			var _self = this;
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}	
			
			if( this.options.columnType == 'cylinder' ){
				this.options.is3D = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				
				// 이미지 배경을 사용하고자 할때처리.
				if(this.support_userAgent.ie){
					this.options.columnBackgroundImg = false;
					this.drawColumnChart();
				}else{
					if( this.options.columnBackgroundImg && this.aImgData ){
						this.makeImagePattern( this.graphics_item, function( arr ){
							_self.aImgPattern = arr;
							_self.drawColumnChart();
						});
					}else{
						this.drawColumnChart();
					}
				}
				
				
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
		},
		drawColumnChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawColumn();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var vo = this.options;
			var line = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var th;
			
			this.drawAxis();	
			this.calcColumnData();	
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			line.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				if(vo.is3D){
					if( vo.columnType == 'cylinder' ){
						th = line.yZero+(line.bottom3DGap/4);
					}else{
						th = line.yZero+(line.bottom3DGap/2);
					}	
				}else{
					th = line.yZero;
				}	
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				line.redrawColumnSameValue(h);
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,line.sWidth,line.sHeight);
					line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
					line.drawColumn();
					window.clearInterval(line.animationInst);
					
					if( line.options.xRange.on ){
						line.drawRange();
					}
				}
			},50);
			
		},
		calcColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / (columnCnt-1);
			var columnStart = sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * (columnCnt-1) )) / 2;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.is3D ){
						if( vo.columnType == 'cylinder' ){
							this.calcColumn3DCylinderData(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}else{
							this.calcColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}	
					}else{
						if( vo.columnEachItem.on ){
							color = vo.colors[(i-1)%vo.colors.length];
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
						}
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						// 이미지 배경을 사용하고자 할때처리.
						if( vo.columnBackgroundImg && this.aImgData ){
							grd = this.aImgPattern[i][j];
						}
						
						if( parseFloat(vo.columnInnerGap) == 0 ){
							this.aSaveColumnCoordValue[i-1].push([columnStart, yZero, columnWidth, yHeight, grd, strokeColor]);
						}else{
							var innerGap = parseFloat(vo.columnInnerGap)/2;
							this.aSaveColumnCoordValue[i-1].push([columnStart, yZero, columnWidth-innerGap, yHeight, grd, strokeColor]);
						}
					}
					
					if( parseFloat(vo.columnInnerGap) == 0 ){
						columnStart = columnStart + columnWidth;
					}else{
						var innerGap = parseFloat(vo.columnInnerGap)/2;
						columnStart = (columnStart + columnWidth)+innerGap;
					}
				}
				
				sX = sX + xg;
			}
			
		},
		calcColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			
			if(isNaN(yHeight)){
				this.aSaveColumnCoordValue=[];
				return;
			}
			
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			if( vo.columnEachItem.on ){
				color = vo.colors[(i-1)%vo.colors.length];
			}else{
				color = vo.colors[(j-1)%vo.colors.length];
			}
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
		},
		calcColumn3DCylinderData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			var arr = null;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor); 
			
			// column 아래면
			bottomColor = grd2;
			if( yZero < y ){
				arr = [columnStart,(yHeight+yZero)-(this.bottom3DGap/2),columnWidth,10,bottomColor];
			}else{
				arr = [columnStart,yZero-(this.bottom3DGap/2),columnWidth,10,bottomColor];
			}
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			
			
			this.aSaveColumnCoordValue[i-1].push([
													[parseInt(columnStart,10), yZero-cylinder3DGap, parseInt(columnWidth,10), yHeight,grd2]
													,arr
													,[columnStart,tempY-10,columnWidth,10, grd3]
												]);
		},
		redrawColumnSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var val				= this.aSaveColumnCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/2)/v);
			
			if(val.length == 0){
				return;
			}
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<xCnt; i++ ){
				for( var j=1; j<columnCnt; j++ ){
					if( vo.is3D && val[i-1][j-1][2][3] != 0 && vo.columnType != 'cylinder' ){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						// column 옆면.
						ctx.beginPath();
						ctx.moveTo(calcVal[0][0], calcVal[0][1]);
						ctx.lineTo(calcVal[0][2], calcVal[0][3]-cv);
						ctx.lineTo(calcVal[0][4], calcVal[0][5]-cv);
						ctx.lineTo(calcVal[0][6], calcVal[0][7]);
						ctx.lineCap = calcVal[0][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[0][9];
						ctx.fill();
						// column 윗면.
						ctx.beginPath();
						ctx.moveTo(calcVal[1][0], calcVal[1][1]);
						ctx.lineTo(calcVal[1][2], calcVal[1][3]);
						ctx.lineTo(calcVal[1][4], calcVal[1][5]-cv);
						ctx.lineTo(calcVal[1][6], calcVal[1][7]-cv);
						ctx.lineCap = calcVal[1][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[1][9];
						ctx.fill();
						// column 앞면
						ctx.fillStyle = calcVal[2][4];
						ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
						
					}else if(vo.columnType == 'cylinder' && this.aData[i][j] != 0){
						y = val[i-1][j-1][0][1];
						calcVal = val[i-1][j-1];
						
						// column 앞면
						ctx.fillStyle = calcVal[0][4];
						ctx.fillRect(calcVal[0][0], calcVal[0][1], calcVal[0][2], calcVal[0][3]);
						
						// column 아래면
						ctx.beginPath();
						ctx.fillStyle = calcVal[1][4];
						this._drawEllipse(ctx,calcVal[1][0],calcVal[1][1],calcVal[1][2]-1,calcVal[1][3]);
						
						// column 윗면.
						ctx.beginPath();
						ctx.fillStyle = calcVal[2][4];
						this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
						
					}else{
						y = val[i-1][j-1][1];
						ctx.fillStyle = val[i-1][j-1][4];
						ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
					}
				
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		drawColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var cFontStyle		= vo.columnText.fontStyle;
			var cFontPrefix		= vo.columnText.prefix;
			var cFontSuffix		= vo.columnText.suffix;
			var cSX, cSY, cText;
			var yZero = this.yZero;
			
			var selectionCnt	= 0;
			var guideLineX, guideLineY, guideLinePointSize=5;
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / (columnCnt-1);
			var columnStart = sX + (xg - columnWidth) / 2;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=1;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * (columnCnt-1) )) / 2;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.is3D && yHeight != 0 ){
						if( vo.columnType == 'cylinder' ){
							this.drawColumn3DCylinder(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}else if( vo.columnType == 'rectangle' ){
							this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}	
					}else{
					
						if(this.aSelection && this.aSelection.constructor == Object && this.aSelection[(i-1)+'^'+(j-1)]){
							
							color = vo.columnSelectedColor[selectionCnt%vo.columnSelectedColor.length];
							selectionCnt++;
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							
						}else{
							if( vo.columnEachItem.on ){
								color = vo.colors[(i-1)%vo.colors.length];
							}else{
								color = vo.colors[(j-1)%vo.colors.length];
							}
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
						}
						
						if( parseFloat(vo.columnInnerGap) == 0 ){
							if( yHeight != 0 ){
								ctx.strokeStyle = strokeColor;
								ctx.lineWidth = 1; 
								ctx.strokeRect(parseInt(columnStart,10)+0.5, yZero, parseInt(columnWidth,10)-2.5, yHeight-0.5);
							}
							
							// 이미지 배경을 사용하고자 할때처리.
							if( vo.columnBackgroundImg && this.aImgData ){
								var pattern = this.aImgPattern[i][j];
								ctx.fillStyle = pattern;
								ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10)-1.5, yHeight);
								
							}else{
								ctx.fillStyle = grd;
								ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10)-1.5, yHeight);
							}
							
						}else{
							var innerGap = parseFloat(vo.columnInnerGap)/2;
							if( yHeight != 0 ){
								ctx.strokeStyle = strokeColor;
								ctx.lineWidth = 1; 
								ctx.strokeRect(parseInt(columnStart,10)+0.5, yZero, (parseInt(columnWidth,10)-2.5)-innerGap, yHeight-0.5);
							}
							// 이미지 배경을 사용하고자 할때처리.
							if( vo.columnBackgroundImg && this.aImgData ){
								var pattern = this.aImgPattern[i][j];
								ctx.fillStyle = pattern;
								ctx.fillRect(parseInt(columnStart,10), yZero, (parseInt(columnWidth,10)-1.5)-innerGap, yHeight);
								
							}else{
								ctx.fillStyle = grd;
								ctx.fillRect(parseInt(columnStart,10), yZero, (parseInt(columnWidth,10)-1.5)-innerGap, yHeight);
							}
							
						}
					}
					
					if( cOn ){
						ctx.textAlign 	= 'center';
						ctx.fillStyle 	= cFontColor;
						ctx.font 		= cFontStyle+' '+cFontSize+'px "'+cFontName+'"';
						cSX 			= columnStart+columnWidth/2;
						if( cPosition == 'external' ){
							if( d[i][j] < 0 ){
								ctx.textBaseline = 'top';
								if( vo.columnTextGuideLine ){
									cSY = yZero+yHeight+20;
								}else{
									cSY = yZero+yHeight+ vo.columnText.margin;
								}
							}else{
								ctx.textBaseline = 'bottom';
								if( vo.columnTextGuideLine ){
									cSY = yZero+(yHeight-20)-1;
								}else{
									cSY = yZero+yHeight-1- vo.columnText.margin;
								}
							}
							
							
							if( vo.columnTextGuideLine ) {
								guideLineX = Math.round(columnStart)+1.5;
								if( d[i][j] < 0 ){
									guideLineY = cSY+cFontSize;
								}else{
									guideLineY = cSY;
								}
								cSY = guideLineY;
								if(vo.columnTextBox){
									cSX = columnStart+parseInt(vo.columnTextBoxMargin, 10)+(guideLinePointSize/2);
								}
								ctx.beginPath();
								ctx.moveTo(guideLineX, yZero+yHeight+(this.bottom3DGap/2));
								ctx.lineTo(guideLineX, guideLineY);
								ctx.strokeStyle = vo.columnTextGuideLineColor;
								ctx.stroke();
								ctx.closePath();
							}
							
						}else if( cPosition == 'inside_top' ){
							if( d[i][j] <= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero+yHeight-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = yZero+yHeight+1;
							}
						}else if( cPosition == 'inside_middle' ){
							if( d[i][j] == 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero+yHeight-1;
							}else if( d[i][j] < 0 ){
								ctx.textBaseline = 'middle';
								cSY = yZero+(Math.abs(yHeight)/2);
							}else{
								ctx.textBaseline = 'middle';
								cSY = yZero-(Math.abs(yHeight)/2);
							}
						}else if( cPosition == 'inside_bottom' ){
							if( d[i][j] >= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = yZero+1;
							}
						}
						if( vo.is3D ){
							//cSY += (this.bottom3DGap/2);
						}
						if( d[i][j] != null ){
							cText = cFontPrefix+this.formatter(d[i][j], vo.yAxis.format)+cFontSuffix;
							
							// label에 박스 그리기--------------------------------
							if( vo.columnTextBox ){
								if( vo.columnTextGuideLine ){
									ctx.textAlign 	= 'left';
								}
								var tX=guideLineX, tBoxMargin=parseInt(vo.columnTextBoxMargin, 10);
								var tW = ctx.measureText(cText).width+(tBoxMargin*2);
								var tH = cFontSize+(tBoxMargin*2);
								var tY = guideLineY - (tH/2);
								var backColor = vo.columnTextBoxFill;
								var boxStrokeColor = vo.columnTextBoxStrokeColor;
								var boxStrokeThickness = vo.columnTextBoxStrokeThickness;
								if( cPosition == 'external' ) {
									this._roundedRect( ctx, tX, tY,tW,tH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
									ctx.fillStyle = backColor;
									ctx.fill();
								  
									// guide line point--------------------
									if( vo.columnTextGuideLinePoint ){
										if( vo.columnEachItem.on ){
											if( vo.columnTextColors.length != 0 ){
												var color = vo.columnTextColors[(i-1) % vo.columnTextColors.length];
											}else{
												var color = vo.colors[(i-1) % vo.colors.length];
											}
										}else{
											var color = vo.colors[(j-1) % vo.colors.length];
										}
										var darkColor = this.adjustBrightness(color, -45);
										ctx.beginPath();
										ctx.arc(guideLineX, guideLineY,guideLinePointSize,0,Math.PI*2,false);
										ctx.fillStyle = color;
										ctx.fill();
										ctx.closePath();
										ctx.beginPath();
										ctx.arc(guideLineX, guideLineY,guideLinePointSize/3,0,Math.PI*2,false);
										ctx.strokeStyle = darkColor;
										ctx.fillStyle = darkColor;
										ctx.fill();
										ctx.lineWidth = 1;
										ctx.stroke();
										ctx.closePath();
										
									}
									// guide line point--------------------
								}
								ctx.textBaseline = 'middle';
								
							}
							// label에 박스 그리기--------------------------------
							
							if( vo.columnTextColors.length != 0 ){
								ctx.fillStyle = vo.columnTextColors[(i-1) % vo.columnTextColors.length];
							}else{
								ctx.fillStyle 	= cFontColor;
							}
							ctx.font = cFontStyle+' '+cFontSize+'px "'+cFontName+'"';
							ctx.fillText(cText, cSX, cSY);
						}
					}	
					
					// 좌표저장
					oCoor = {
						  x:parseInt(columnStart,10)
						  ,y:yZero
						  ,width:parseInt(columnWidth,10)-1.5
						  ,height:yHeight
						};
					aColumn.push(oCoor);
			
					if( parseFloat(vo.columnInnerGap) == 0 ){
						columnStart = columnStart + columnWidth;
					}else{
						var innerGap = parseFloat(vo.columnInnerGap)/2;
						columnStart = (columnStart + columnWidth)+innerGap;
					}
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
		},
		drawColumn3D : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight-0.5;
			
			if( vo.columnEachItem.on ){
				color = vo.colors[(i-1)%vo.colors.length];
			}else{
				color = vo.colors[(j-1)%vo.colors.length];
			}
			lcolor = this.adjustBrightness(color, 25);
			dcolor = this.adjustBrightness(color, -55);
			
			if(isNaN(y)){ return; }
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(x, yZero);
			ctx.lineTo(x+10, yZero-10);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(x, y);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( yZero < y ){
				grd3 = dcolor;
				y = yZero;
			}
			ctx.beginPath();
			ctx.moveTo(columnStart, y+0.5);
			ctx.lineTo(x, y+0.5);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(columnStart+10, y-10);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd3;
			ctx.fill();
			
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight);
		},
		drawColumn3DCylinder : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
		
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor); 
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), yZero-cylinder3DGap, parseInt(columnWidth,10), yHeight);
			
			
			// column 아래면
			bottomColor = grd2;
			ctx.beginPath();
			ctx.fillStyle = bottomColor;
			if( yZero < y ){
				this._drawEllipse(ctx,columnStart,(yHeight+yZero)-(this.bottom3DGap/2),columnWidth,10);
			}else{
				this._drawEllipse(ctx,columnStart,yZero-(this.bottom3DGap/2),columnWidth,10);
			}
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( yZero < y ){
				grd3 = dcolor;
				y = yZero;
			}
			ctx.beginPath();
			ctx.fillStyle = grd3;
			this._drawEllipse(ctx,columnStart,y-10,columnWidth,10);
		},
		setSelectColumnPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectColumnPoint_click : function(e){
			var vo 			= this.options;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.returnEventData( e, [i, j]);
								
								if( parseInt(vo.theme.seriesSelectedStyle,10) == 1 ){
									this.seriesSelected(e, [i,j]);
								}
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.returnEventData( e, [i, j]);
								
								if( parseInt(vo.theme.seriesSelectedStyle,10) == 1 ){
									this.seriesSelected(e, [i,j]);
								}
							}
						}
					}
				}
			}
			
			
		},
		canvas_event_func_column : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}else if( e.type=='click' ){
				eThis.setSelectColumnPoint_click(e, chartElem);
			}
		}
	});
	
	GLChart.StackedColumn = function(){
		GLChart.call(this, arguments);
		this.aSaveColumnCoordValue = [];
		this.options = {
			type : 'stackedColumn'
			,columnOuterGap : 50
			,columnShadow : false
			,columnConnectLine : false
			,columnConnectlineThickness : 1
			// columnText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			// columnText valueType : (all, value, percentage) 2가지.
			,columnText : {on:false, position:'external', valueType:'value', color:'#000000', fontName:'Gulim', fontSize:12, prefix:'', suffix:'', margin:0}
			,columnSumText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnType : 'rectangle'	// cylinder, rectangle.
			,stack100Percent : false
			// 신규추가(2015.06.08)---------------
			,columnSumTextGuideLine : false				// 막대상단 총합값에대한 가이드선 표현할지 여부.
			,columnSumTextGuideLineColor : '#424242'
			,columnSumTextBox : false					// 막대상단 총합값에대한 박스로 감싸줄지 여부.
			,columnSumTextBoxType : 'circle'			// 막대상단 총합값에대한 박스 모양설정 (circle만 있음. 추후 더 추가)
			,columnSumTextBoxFill : '#aaaaaa'			// 막대상단 총합값에대한 박스의 배경색깔
			,columnSumTextBoxStrokeColor : '#214d4e'	// 막대상단 총합값에대한 박스의 stroke색깔
			,columnSumTextBoxStrokeThickness : 2		// 막대상단 총합값에대한 박스의 stroke두께
			,columnSumTextBoxMargin : 6					// 막대상단 총합값에대한 박스 내부의 마진값
			,columnSumTextBoxBottomMargin : 0			// 막대상단 총합값에대한 박스와 막대그래프 사이의 간격.
			
			,columnTextGuideLine : false
			,columnTextGuideLineColor : '#424242'
			,columnTextGuideLinePoint : false
			,columnTextBox : false
			,columnTextBoxMargin : 8
			,columnTextBoxFill : '#1b1b1b'
			,columnTextBoxStrokeColor : '#424242'
			,columnTextBoxStrokeThickness : 2
			//,columnTextColors : []
			// 신규추가(2015.06.08)---------------
			// 신규추가(2016.07.27)---------------
			,columnBackgroundImg : false
			// 신규추가(2016.07.27)---------------
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		
		// 신규추가(2016.07.27)---------------
		this.aImgPattern = [];
		// 신규추가(2016.07.27)---------------
	};
	GLChart.StackedColumn.prototype = new GLChart([]);
	GLChart.extend(GLChart.StackedColumn, {
		render : function( o ){
			var _self = this;
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}	
			
			if( this.options.columnType == 'cylinder' ){
				this.options.is3D = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				
				// 이미지 배경을 사용하고자 할때처리.
				if(this.support_userAgent.ie){
					this.options.columnBackgroundImg = false;
					this.drawStackedColumnChart();
				}else{
					if( this.options.columnBackgroundImg && this.aImgData ){
						this.makeImagePattern( this.graphics_item, function( arr ){
							_self.aImgPattern = arr;
							_self.drawStackedColumnChart();
						});
					}else{
						this.drawStackedColumnChart();
					}
				}
				
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
		},
		drawStackedColumnChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawStackedColumn();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var vo = this.options;
			var line = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var th;
			
			this.drawAxis();	
			this.calcStackedColumnData();	
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			line.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				if(vo.is3D){
					if( vo.columnType == 'cylinder' ){
						th = line.yZero+(line.bottom3DGap/4);
					}else{
						th = line.yZero+(line.bottom3DGap/2);
					}
				}else{
					th = line.yZero;
				}	
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				line.redrawStackedColumnSameValue(h);
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,line.sWidth,line.sHeight);
					line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
					line.drawStackedColumn();
					window.clearInterval(line.animationInst);
					
					if( line.options.xRange.on ){
						line.drawRange();
					}
				}
			},50);
			
		},
		calcStackedColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			var calcData = null;
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
					
					if( vo.is3D ){
						if( vo.columnType == 'cylinder' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.calcStackedColumn3DCylinderData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.calcStackedColumn3DCylinderData(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}							
						}else if( vo.columnType == 'rectangle' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}
						}		
					}else{
					
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						// 이미지 배경을 사용하고자 할때처리.
						if( vo.columnBackgroundImg && this.aImgData ){
							var pattern = this.aImgPattern[i][j];
							grd = pattern;
						}
						
						this.aSaveColumnCoordValue[i-1].push([columnStart, sY, columnWidth, yHeight, grd, strokeColor]);
					}
					
					sY = sY+yHeight;
				}
				
				sX = sX + xg;
			}
			
		},
		calcStackedColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero, drawTop ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			if( drawTop ){
				this.aSaveColumnCoordValue[i-1].push([
														[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
														,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
														,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
													]);
			}else{
				this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[0,0,0,0,0,0,0,0,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
			}
		},
		calcStackedColumn3DCylinderData : function( ctx, i, j, columnStart, columnWidth, yHeight, sY, drawTop ){
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var arr = ['','','','',''];
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			sY += (this.bottom3DGap/2)+1;
			var y = sY+yHeight+0.5;
			var tempY = sY+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor); 
			
			// column 아래면
			bottomColor = grd2;
			if( sY < y ){
				arr = [columnStart,(yHeight+sY)-(this.bottom3DGap/2),columnWidth,10, bottomColor];
			}else{
				arr = [columnStart,sY-(this.bottom3DGap/2),columnWidth,10, bottomColor];
			}
			
			if( drawTop ){
				
				
				// column 윗면.
				var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
				if( sY < y ){
					grd3 = dcolor;
					tempY = sY;
				}else{
					grd3.addColorStop(0.2,lcolor);  
					grd3.addColorStop(1,color);
				}
			}
			
			this.aSaveColumnCoordValue[i-1].push([
													[parseInt(columnStart,10), sY-cylinder3DGap, parseInt(columnWidth,10), yHeight,grd2]
													,arr
													,[columnStart,tempY-10,columnWidth,10, grd3]
												]);
			
		},
		redrawStackedColumnSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var val				= this.aSaveColumnCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/2)/v);
			
			
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<xCnt; i++ ){
				for( var j=1; j<columnCnt; j++ ){
					if( vo.is3D && val[i-1][j-1][2][3] != 0 && vo.columnType != 'cylinder' ){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						// column 옆면.
						ctx.beginPath();
						ctx.moveTo(calcVal[0][0], calcVal[0][1]);
						ctx.lineTo(calcVal[0][2], calcVal[0][3]-cv);
						ctx.lineTo(calcVal[0][4], calcVal[0][5]-cv);
						ctx.lineTo(calcVal[0][6], calcVal[0][7]);
						ctx.lineCap = calcVal[0][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[0][9];
						ctx.fill();
						// column 윗면.
						ctx.beginPath();
						ctx.moveTo(calcVal[1][0], calcVal[1][1]);
						ctx.lineTo(calcVal[1][2], calcVal[1][3]);
						ctx.lineTo(calcVal[1][4], calcVal[1][5]-cv);
						ctx.lineTo(calcVal[1][6], calcVal[1][7]-cv);
						ctx.lineCap = calcVal[1][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[1][9];
						ctx.fill();
						// column 앞면
						ctx.fillStyle = calcVal[2][4];
						ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
						
					}else if(vo.columnType == 'cylinder' && val[i-1][j-1][2][3] != 0){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						
						// column 앞면
						ctx.fillStyle = calcVal[0][4];
						ctx.fillRect(calcVal[0][0], calcVal[0][1], calcVal[0][2], calcVal[0][3]);
						
						// column 아래면
						ctx.beginPath();
						ctx.fillStyle = calcVal[1][4];
						this._drawEllipse(ctx,calcVal[1][0],calcVal[1][1],calcVal[1][2]-1,calcVal[1][3]);
						
						// column 윗면.
						ctx.beginPath();
						ctx.fillStyle = calcVal[2][4];
						this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
						
					}else{
						y = val[i-1][j-1][1];
						ctx.fillStyle = val[i-1][j-1][4];
						ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
					}
				
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		drawStackedColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, nextSY, eX, eY, xg, yg, yHeight = null, nextYHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cValueType		= vo.columnText.valueType;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var csOn			= vo.columnSumText.on;
			var csPosition		= vo.columnSumText.position;
			var csFontSize		= vo.columnSumText.fontSize;
			var csFontName		= vo.columnSumText.fontName;
			var csFontColor		= vo.columnSumText.color;
			var cSX, cSY, cText, csSY, csText;
			var yZero = this.yZero;
			var calcData = null, nextCalcData = null;
			var guideLineX, guideLineY, guideLinePointSize=5;
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				
				sY = yZero;
				nextSY = yZero;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
					
					if( vo.is3D && yHeight != 0 ){
						if( vo.columnType == 'cylinder' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.drawColumn3DCylinder(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.drawColumn3DCylinder(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}
						}else if( vo.columnType == 'rectangle' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}
						}
					}else{
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						
						// 이미지 배경을 사용하고자 할때처리.
						if( vo.columnBackgroundImg && this.aImgData ){
							var pattern = this.aImgPattern[i][j];
							ctx.fillStyle = pattern;
							ctx.fillRect(parseInt(columnStart,10), sY, parseInt(columnWidth,10)-1.5, yHeight);
						}else{
							ctx.fillStyle = grd;
							ctx.fillRect(parseInt(columnStart,10), sY, parseInt(columnWidth,10)-1.5, yHeight);
						}
						
						
					}
					
					if( vo.columnConnectLine && i < xCnt-1 ){
					
						if( vo.stack100Percent ){
							nextCalcData = (d[i+1][j] * 100) / this.aSumData[i];
						}else{
							nextCalcData = d[i+1][j];
						}
					
						if( this.calculatedMargins.y - yZero == 0 ){
							nextYHeight = (this.calculatedMargins.h * nextCalcData) / this.ranges.ymin;
						}else{
							nextYHeight = -((yZero - this.calculatedMargins.y) * nextCalcData) / this.ranges.ymax;
						}
						
						yHeight = isNaN(yHeight)?0:yHeight;
						nextYHeight = isNaN(nextYHeight)?0:nextYHeight;
					
						ctx.beginPath();
						ctx.strokeStyle = this.adjustBrightness(vo.colors[(j-1)%vo.colors.length], 25);
						if( vo.is3D && vo.columnType != 'cylinder' ){
							ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight+(this.bottom3DGap/2)+1.5);
							ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2)+1.5, nextSY+nextYHeight+(this.bottom3DGap/2)+1.5 );
						}else if( vo.is3D && vo.columnType == 'cylinder' ){
							ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight+(this.bottom3DGap/4)+1.5);
							ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2)+1.5, nextSY+nextYHeight+(this.bottom3DGap/4)+1.5 );
						}else{
							ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight);
							ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2), nextSY+nextYHeight );
						}	
						ctx.lineWidth = vo.columnConnectlineThickness;
						ctx.stroke();
					}
					
					// 좌표저장
					oCoor = {
						  x:parseInt(columnStart,10)
						  ,y:sY
						  ,width:parseInt(columnWidth,10)-1.5
						  ,height:yHeight
						};
					aColumn.push(oCoor);
			
					sY = sY+yHeight;
					nextSY += nextYHeight;
					
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
			sX = this.calculatedMargins.x;
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				
				for( var j=1; j<columnCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = Math.round((d[i][j] * 100) / this.aSumData[i-1]);
					}else{
						calcData = d[i][j];
					}
				
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
					
					if( cOn ){
						ctx.textAlign 	= 'center';
						ctx.fillStyle 	= cFontColor;
						ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
						cSX 			= columnStart+columnWidth/2;
						if( cPosition == 'external' ){
							if( d[i][j] < 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}else{
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}
						}else if( cPosition == 'inside_top' ){
							if( d[i][j] <= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = sY+yHeight+1;
							}
						}else if( cPosition == 'inside_middle' ){
							if( d[i][j] == 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}else if( d[i][j] < 0 ){
								ctx.textBaseline = 'middle';
								cSY = sY+(Math.abs(yHeight)/2);
							}else{
								ctx.textBaseline = 'middle';
								cSY = sY-(Math.abs(yHeight)/2);
							}
						}else if( cPosition == 'inside_bottom' ){
							if( d[i][j] >= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = sY+1;
							}
						}
						if( vo.is3D ){
							cSY += (this.bottom3DGap/2);
						}
						
						if(d[i][j] != null){
						
							if( cValueType == 'value' ){
								cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
							}else if( cValueType == 'percentage' && vo.stack100Percent ){
								cText = (calcData != 0)?this.formatter(calcData, vo.yAxis.format)+'%':'';
							}else if( cValueType == 'all' && vo.stack100Percent ){
								cText = ((d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'')+((calcData != 0)?'('+this.formatter(calcData, vo.yAxis.format)+'%)':'');
							}else{
								cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
							}
							cText = (vo.columnText.prefix + cText + vo.columnText.suffix);
							
							// label에 박스 그리기--------------------------------
							if( vo.columnTextBox && cPosition == 'inside_middle' ){
								guideLineX = (columnStart+columnWidth);
								guideLineY = cSY;
								ctx.textAlign 	= 'left';
								
								var tX=guideLineX+guideLinePointSize, tBoxMargin=parseInt(vo.columnTextBoxMargin, 10);
								var tW = ctx.measureText(cText).width+(tBoxMargin*2);
								var tH = cFontSize+(tBoxMargin*2);
								var tY = guideLineY - (tH/2);
								var backColor = vo.columnTextBoxFill;
								var boxStrokeColor = vo.columnTextBoxStrokeColor;
								var boxStrokeThickness = vo.columnTextBoxStrokeThickness;
								
								this._roundedRect( ctx, tX, tY,tW,tH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
								ctx.fillStyle = backColor;
								ctx.fill();
							  
								// guide line point--------------------
								if( vo.columnTextGuideLinePoint ){
									var color = vo.colors[(j-1) % vo.colors.length];
									var darkColor = this.adjustBrightness(color, -45);
									ctx.beginPath();
									ctx.arc((guideLineX-(guideLinePointSize/2)), guideLineY,guideLinePointSize,0,Math.PI*2,false);
									ctx.fillStyle = color;
									ctx.fill();
									ctx.closePath();
									ctx.beginPath();
									ctx.arc((guideLineX-(guideLinePointSize/2)), guideLineY,guideLinePointSize/3,0,Math.PI*2,false);
									ctx.strokeStyle = darkColor;
									ctx.fillStyle = darkColor;
									ctx.fill();
									ctx.lineWidth = 1;
									ctx.stroke();
									ctx.closePath();
								}
								// guide line point--------------------
								ctx.textBaseline = 'middle';
								
								//cSX = tX;
							}
							// label에 박스 그리기--------------------------------
						
							ctx.fillStyle 	= cFontColor;
							ctx.fillText(cText, tX+tBoxMargin, cSY);
						}
					}
					
					sY = sY+yHeight;
				}
				
				if( csOn ){
					
					if(vo.columnSumTextBox){
						ctx.textAlign 	= 'center';
						ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
						cSX 			= Math.round(columnStart+columnWidth)-2.5;
						if( csPosition == 'external' ){
							if( this.aSumData[i-1] < 0 ){
								ctx.textBaseline = 'top';
								csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+csFontSize+vo.columnSumTextBoxMargin:sY+csFontSize+vo.columnSumTextBoxMargin;
							}else{
								ctx.textBaseline = 'bottom';
								csSY = sY-(csFontSize+vo.columnSumTextBoxMargin+vo.columnSumTextBoxBottomMargin);
							}
						}
						csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
						
						var tW = ctx.measureText(csText).width;
						
						if( vo.columnSumTextGuideLine ){
							ctx.beginPath();
							ctx.lineWidth = 1;
							ctx.moveTo(cSX, csSY);
							ctx.lineTo(cSX, csSY+(csFontSize+vo.columnSumTextBoxMargin+vo.columnSumTextBoxBottomMargin));
							
							ctx.strokeStyle = vo.columnSumTextGuideLineColor;
							ctx.stroke();
							ctx.lineWidth = 1;
						}
						
						// 원 그리기
						var circleSize = csFontSize;
						if( vo.columnSumTextBoxType == 'circle' ){
							
							if( tW > csFontSize ){
								var radius = (circleSize/2)+vo.columnSumTextBoxMargin+2;
								var height = circleSize+(vo.columnSumTextBoxMargin*2);
								var width = tW+(vo.columnSumTextBoxMargin*2);
								var x = cSX-(tW/2)-vo.columnSumTextBoxMargin;
								var y = csSY-(height/2);
							
								ctx.beginPath();
								ctx.lineWidth = (vo.columnSumTextBoxStrokeThickness*2);
								ctx.moveTo(x, y+radius);
								ctx.lineTo(x,y+height-radius);
								ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
								ctx.lineTo(x+width-radius,y+height);
								ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
								ctx.lineTo(x+width,y+radius);
								ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
								ctx.lineTo(x+radius,y);
								ctx.quadraticCurveTo(x,y,x,y+radius);
								ctx.closePath();
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.stroke();
								ctx.lineWidth = 1;
			
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
							}else{
								ctx.beginPath();
								ctx.arc(cSX,csSY,(circleSize/2)+vo.columnSumTextBoxMargin,0,Math.PI*2,false);
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
								ctx.lineWidth = vo.columnSumTextBoxStrokeThickness;
								ctx.stroke();
								ctx.closePath();
								ctx.lineWidth = 1;
							}
							
							
						}
						
						ctx.fillStyle 	= csFontColor;
						ctx.fillText(csText, cSX, (csSY+(circleSize/2)));
						/*
						var circleSize = csFontSize;
						if( vo.columnSumTextBoxType == 'circle' ){
							
							if( tW > csFontSize ){
							
								var radius = ((circleSize+vo.columnSumTextBoxMargin)/2)+6;
								var height = circleSize+(vo.columnSumTextBoxMargin*2);
								var width = tW+(vo.columnSumTextBoxMargin*2);
								var x = cSX-(tW/2)-vo.columnSumTextBoxMargin;
								var y = csSY-(height/2);
							
								ctx.beginPath();
								ctx.lineWidth = (vo.columnSumTextBoxStrokeThickness*2);
								ctx.moveTo(x, y+radius);
								ctx.lineTo(x,y+height-radius);
								ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
								ctx.lineTo(x+width-radius,y+height);
								ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
								ctx.lineTo(x+width,y+radius);
								ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
								ctx.lineTo(x+radius,y);
								ctx.quadraticCurveTo(x,y,x,y+radius);
								ctx.closePath();
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.stroke();
								ctx.lineWidth = 1;
			
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
							}else{
								ctx.beginPath();
								ctx.arc(cSX,csSY,circleSize,0,Math.PI*2,false);
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
								ctx.lineWidth = vo.columnSumTextBoxStrokeThickness;
								ctx.stroke();
								ctx.closePath();
								ctx.lineWidth = 1;
							}
							
							
						}
						
						ctx.fillStyle 	= csFontColor;
						ctx.fillText(csText, cSX, (csSY+(circleSize/2)));
						*/
					}else{
						ctx.textAlign 	= 'center';
						ctx.fillStyle 	= csFontColor;
						ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
						cSX 			= columnStart+columnWidth/2;
						if( csPosition == 'external' ){
							if( this.aSumData[i-1] < 0 ){
								ctx.textBaseline = 'top';
								csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+3:sY+3;
							}else{
								ctx.textBaseline = 'bottom';
								csSY = sY-1;
							}
						}
						csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
						ctx.fillText(csText, cSX, csSY);
					}
				}
				
				sX = sX + xg;
			}	
			
		},
		drawColumn3D : function( ctx, i, j, columnStart, columnWidth, yHeight, sY, drawTop ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			sY += (this.bottom3DGap/2)+1;
			var y = sY+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, sY); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(x, sY);
			ctx.lineTo(x+10, sY-10);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(x, y);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// column 윗면.
			if( drawTop ){
				var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( sY < y ){
					grd3 = dcolor;
					y = sY;
				}
				ctx.beginPath();
				ctx.moveTo(columnStart, y);
				ctx.lineTo(x, y);
				ctx.lineTo(x+10, y-10);
				ctx.lineTo(columnStart+10, y-10);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = grd3;
				ctx.fill();
			}
			
			var grd2=ctx.createLinearGradient(columnStart, sY+yHeight, columnStart, sY); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), sY, parseInt(columnWidth,10), yHeight);
		},
		drawColumn3DCylinder : function( ctx, i, j, columnStart, columnWidth, yHeight, sY, drawTop ){
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			sY += (this.bottom3DGap/2)+1;
			var y = sY+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor); 
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), sY-cylinder3DGap, parseInt(columnWidth,10), yHeight);
			
			// column 아래면
			bottomColor = grd2;
			ctx.beginPath();
			ctx.fillStyle = bottomColor;
			if( sY < y ){
				this._drawEllipse(ctx,columnStart,(yHeight+sY)-(this.bottom3DGap/2),columnWidth,10);
			}else{
				this._drawEllipse(ctx,columnStart,sY-(this.bottom3DGap/2),columnWidth,10);
			}
			
			if( drawTop ){
			
				
			
				// column 윗면.
				var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( sY < y ){
					grd3 = dcolor;
					y = sY;
				}
				ctx.beginPath();
				ctx.fillStyle = grd3;
				this._drawEllipse(ctx,columnStart,y-10,columnWidth,10);
			}
			
		},
		setSelectColumnPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			my = (vo.is3D)?my-(this.bottom3DGap/2):my;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectColumnPoint_click : function(e){
			var vo 			= this.options;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			my = (vo.is3D)?my-(this.bottom3DGap/2):my;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								this.returnEventData( e, [i, j] );
							}
						}else{
							if( height > my && my > y ) {
							
								this.returnEventData( e, [i, j] );
							}
						}
					}
				}
			}
			
		},
		canvas_event_func_stackedColumn : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}else if( e.type=='click' ){
				eThis.setSelectColumnPoint_click(e, chartElem);
			}
		}
	});
	
	GLChart.MultiStackedColumn = function(){
		GLChart.call(this, arguments);
		
		// 두번째 데이타
		this.aData2 = [];
		this.aSumData2 = [];
		this.aSaveColumnCoordValue2 = [];
		
		this.aSaveColumnCoordValue = [];
		this.options = {
			type : 'stackedColumn'
			,columnOuterGap : 50
			,columnShadow : false
			,columnConnectLine : false
			,columnConnectlineThickness : 1
			// columnText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			// columnText valueType : (all, value, percentage) 2가지.
			,columnText : {on:false, position:'external', valueType:'value', color:'#000000', fontName:'Gulim', fontSize:12, prefix:'', suffix:''}
			,columnSumText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnType : 'rectangle'	// cylinder, rectangle.
			,stack100Percent : false
			// 신규추가(2015.06.08)---------------
			,columnSumTextGuideLine : false				// 막대상단 총합값에대한 가이드선 표현할지 여부.
			,columnSumTextGuideLineColor : '#424242'
			,columnSumTextBox : false					// 막대상단 총합값에대한 박스로 감싸줄지 여부.
			,columnSumTextBoxType : 'circle'			// 막대상단 총합값에대한 박스 모양설정 (circle만 있음. 추후 더 추가)
			,columnSumTextBoxFill : '#aaaaaa'			// 막대상단 총합값에대한 박스의 배경색깔
			,columnSumTextBoxStrokeColor : '#214d4e'	// 막대상단 총합값에대한 박스의 stroke색깔
			,columnSumTextBoxStrokeThickness : 2		// 막대상단 총합값에대한 박스의 stroke두께
			,columnSumTextBoxMargin : 6					// 막대상단 총합값에대한 박스 내부의 마진값
			,columnSumTextBoxBottomMargin : 0			// 막대상단 총합값에대한 박스와 막대그래프 사이의 간격.
			
			,columnTextGuideLine : false
			,columnTextGuideLineColor : '#424242'
			,columnTextGuideLinePoint : false
			,columnTextBox : false
			,columnTextBoxMargin : 8
			,columnTextBoxFill : '#1b1b1b'
			,columnTextBoxStrokeColor : '#424242'
			,columnTextBoxStrokeThickness : 2
			//,columnTextColors : []
			
			,multiColumnIntimacy : 0	// 막대와 막대의 간격을 얼마나 줄일지 값
			// 신규추가(2015.06.08)---------------
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
	};
	GLChart.MultiStackedColumn.prototype = new GLChart([]);
	GLChart.extend(GLChart.MultiStackedColumn, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}	
			
			if( this.options.columnType == 'cylinder' ){
				this.options.is3D = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				this.drawStackedColumnChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
		},
		drawStackedColumnChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawStackedColumn();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var vo = this.options;
			var line = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var th;
			
			this.drawAxis();	
			this.calcStackedColumnData();	
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			line.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				if(vo.is3D){
					if( vo.columnType == 'cylinder' ){
						th = line.yZero+(line.bottom3DGap/4);
					}else{
						th = line.yZero+(line.bottom3DGap/2);
					}
				}else{
					th = line.yZero;
				}	
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				line.redrawStackedColumnSameValue(h);
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,line.sWidth,line.sHeight);
					line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
					line.drawStackedColumn();
					window.clearInterval(line.animationInst);
					
					if( line.options.xRange.on ){
						line.drawRange();
					}
				}
			},50);
			
		},
		calcStackedColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var d2				= this.aData2;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			this.aSaveColumnCoordValue2 = [];
			var sX, sY, sY2, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yHeight2 = null;
			var yZero = this.yZero;
			var calcData = null;
			var calcData2 = null;
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			sY2 = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			xg = (this.aData2.length > 1)? xg/2 : xg;	// 막대 데이타가 멀티일때
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				sY2 = yZero;
				this.aSaveColumnCoordValue.push([]);
				this.aSaveColumnCoordValue2.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
				
					// 막대 데이타가 멀티일때 처리
					if( this.aData2.length > 1 ){
						if( vo.stack100Percent ){
							calcData2 = (d2[i][j] * 100) / this.aSumData2[i-1];
						}else{
							calcData2 = d2[i][j];
						}
					
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight2 = (this.calculatedMargins.h * calcData2) / this.ranges.ymin;
						}else{
							yHeight2 = -((yZero - this.calculatedMargins.y) * calcData2) / this.ranges.ymax;
						}
					}
					
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
					
					
					
					
					if( vo.is3D ){
						if( vo.columnType == 'cylinder' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.calcStackedColumn3DCylinderData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.calcStackedColumn3DCylinderData(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}							
						}else if( vo.columnType == 'rectangle' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}
						}		
					}else{
					
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						this.aSaveColumnCoordValue[i-1].push([columnStart+vo.multiColumnIntimacy, sY, columnWidth, yHeight, grd, strokeColor]);
						// 막대 데이타가 멀티일때 처리
						if( this.aData2.length > 1 ){
							color = vo.colors2[(j-1)%vo.colors2.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							this.aSaveColumnCoordValue2[i-1].push([(columnStart+xg)-vo.multiColumnIntimacy, sY2, columnWidth, yHeight2, grd, strokeColor]);
						}
					}
					
					sY = sY+yHeight;
					// 막대 데이타가 멀티일때 처리
					if( this.aData2.length > 1 ){
						sY2 = sY2+yHeight2;
					}
				}
				
				
				// 막대 데이타가 멀티일때 처리
				if( this.aData2.length > 1 ){
					sX = sX + (xg*2);
				}else{
					sX = sX + xg;
				}
				
			}
			
		},
		calcStackedColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero, drawTop ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			if( drawTop ){
				this.aSaveColumnCoordValue[i-1].push([
														[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
														,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
														,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
													]);
			}else{
				this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[0,0,0,0,0,0,0,0,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
			}
		},
		calcStackedColumn3DCylinderData : function( ctx, i, j, columnStart, columnWidth, yHeight, sY, drawTop ){
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var arr = ['','','','',''];
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			sY += (this.bottom3DGap/2)+1;
			var y = sY+yHeight+0.5;
			var tempY = sY+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor); 
			
			// column 아래면
			bottomColor = grd2;
			if( sY < y ){
				arr = [columnStart,(yHeight+sY)-(this.bottom3DGap/2),columnWidth,10, bottomColor];
			}else{
				arr = [columnStart,sY-(this.bottom3DGap/2),columnWidth,10, bottomColor];
			}
			
			if( drawTop ){
				
				
				// column 윗면.
				var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
				if( sY < y ){
					grd3 = dcolor;
					tempY = sY;
				}else{
					grd3.addColorStop(0.2,lcolor);  
					grd3.addColorStop(1,color);
				}
			}
			
			this.aSaveColumnCoordValue[i-1].push([
													[parseInt(columnStart,10), sY-cylinder3DGap, parseInt(columnWidth,10), yHeight,grd2]
													,arr
													,[columnStart,tempY-10,columnWidth,10, grd3]
												]);
			
		},
		redrawStackedColumnSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var val				= this.aSaveColumnCoordValue;
			var val2			= this.aSaveColumnCoordValue2;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/2)/v);
			
			
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<xCnt; i++ ){
				for( var j=1; j<columnCnt; j++ ){
					if( vo.is3D && val[i-1][j-1][2][3] != 0 && vo.columnType != 'cylinder' ){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						// column 옆면.
						ctx.beginPath();
						ctx.moveTo(calcVal[0][0], calcVal[0][1]);
						ctx.lineTo(calcVal[0][2], calcVal[0][3]-cv);
						ctx.lineTo(calcVal[0][4], calcVal[0][5]-cv);
						ctx.lineTo(calcVal[0][6], calcVal[0][7]);
						ctx.lineCap = calcVal[0][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[0][9];
						ctx.fill();
						// column 윗면.
						ctx.beginPath();
						ctx.moveTo(calcVal[1][0], calcVal[1][1]);
						ctx.lineTo(calcVal[1][2], calcVal[1][3]);
						ctx.lineTo(calcVal[1][4], calcVal[1][5]-cv);
						ctx.lineTo(calcVal[1][6], calcVal[1][7]-cv);
						ctx.lineCap = calcVal[1][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[1][9];
						ctx.fill();
						// column 앞면
						ctx.fillStyle = calcVal[2][4];
						ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
						
					}else if(vo.columnType == 'cylinder' && val[i-1][j-1][2][3] != 0){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						
						// column 앞면
						ctx.fillStyle = calcVal[0][4];
						ctx.fillRect(calcVal[0][0], calcVal[0][1], calcVal[0][2], calcVal[0][3]);
						
						// column 아래면
						ctx.beginPath();
						ctx.fillStyle = calcVal[1][4];
						this._drawEllipse(ctx,calcVal[1][0],calcVal[1][1],calcVal[1][2]-1,calcVal[1][3]);
						
						// column 윗면.
						ctx.beginPath();
						ctx.fillStyle = calcVal[2][4];
						this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
						
					}else{
						y = val[i-1][j-1][1];
						ctx.fillStyle = val[i-1][j-1][4];
						ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
						// 막대 데이타가 멀티일때 처리
						if( this.aData2.length > 1 ){
							y = val2[i-1][j-1][1];
							ctx.fillStyle = val2[i-1][j-1][4];
							ctx.fillRect(parseInt(val2[i-1][j-1][0],10), y, parseInt(val2[i-1][j-1][2],10)-1.5, val2[i-1][j-1][3]);
						}
					}
				
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		drawStackedColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var d2				= this.aData2;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, nextSY, eX, eY, xg, yg, yHeight = null, nextYHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cValueType		= vo.columnText.valueType;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var csOn			= vo.columnSumText.on;
			var csPosition		= vo.columnSumText.position;
			var csFontSize		= vo.columnSumText.fontSize;
			var csFontName		= vo.columnSumText.fontName;
			var csFontColor		= vo.columnSumText.color;
			var cSX, cSY, cText, csSY, csText;
			var yZero = this.yZero;
			var calcData = null, nextCalcData = null;
			var guideLineX, guideLineY, guideLinePointSize=5;
			var sY2, calcData2 = null, yHeight2 = null;
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			sY2 = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			xg = (this.aData2.length > 1)? xg/2 : xg;	// 막대 데이타가 멀티일때
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				
				sY = yZero;
				sY2 = yZero;
				nextSY = yZero;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
					
					// 막대 데이타가 멀티일때 처리
					if( this.aData2.length > 1 ){
						if( vo.stack100Percent ){
							calcData2 = (d2[i][j] * 100) / this.aSumData2[i-1];
						}else{
							calcData2 = d2[i][j];
						}
					
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight2 = (this.calculatedMargins.h * calcData2) / this.ranges.ymin;
						}else{
							yHeight2 = -((yZero - this.calculatedMargins.y) * calcData2) / this.ranges.ymax;
						}
					}
					
					if( vo.is3D && yHeight != 0 ){
						if( vo.columnType == 'cylinder' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.drawColumn3DCylinder(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.drawColumn3DCylinder(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}
						}else if( vo.columnType == 'rectangle' ){
							if( j == 1 && yHeight>=0 || yHeight < 0 && j == columnCnt-1  ){
								this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
							}else{
								this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
							}
						}
					}else{
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						ctx.fillStyle = grd;
						ctx.fillRect(parseInt(columnStart+vo.multiColumnIntimacy,10), sY, parseInt(columnWidth,10)-1.5, yHeight);
						// 막대 데이타가 멀티일때 처리
						if( this.aData2.length > 1 ){
							color = vo.colors2[(j-1)%vo.colors2.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							
							ctx.fillStyle = grd;
							ctx.fillRect(parseInt(columnStart+xg-vo.multiColumnIntimacy,10), sY2, parseInt(columnWidth,10)-1.5, yHeight2);
						}
					}
					
					if( vo.columnConnectLine && i < xCnt-1 ){
					
						if( vo.stack100Percent ){
							nextCalcData = (d[i+1][j] * 100) / this.aSumData[i];
						}else{
							nextCalcData = d[i+1][j];
						}
					
						if( this.calculatedMargins.y - yZero == 0 ){
							nextYHeight = (this.calculatedMargins.h * nextCalcData) / this.ranges.ymin;
						}else{
							nextYHeight = -((yZero - this.calculatedMargins.y) * nextCalcData) / this.ranges.ymax;
						}
						
						yHeight = isNaN(yHeight)?0:yHeight;
						nextYHeight = isNaN(nextYHeight)?0:nextYHeight;
					
						ctx.beginPath();
						ctx.strokeStyle = this.adjustBrightness(vo.colors[(j-1)%vo.colors.length], 25);
						if( vo.is3D && vo.columnType != 'cylinder' ){
							ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight+(this.bottom3DGap/2)+1.5);
							ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2)+1.5, nextSY+nextYHeight+(this.bottom3DGap/2)+1.5 );
						}else if( vo.is3D && vo.columnType == 'cylinder' ){
							ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight+(this.bottom3DGap/4)+1.5);
							ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2)+1.5, nextSY+nextYHeight+(this.bottom3DGap/4)+1.5 );
						}else{
							ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight);
							ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2), nextSY+nextYHeight );
						}	
						ctx.lineWidth = vo.columnConnectlineThickness;
						ctx.stroke();
					}
					
					// 좌표저장
					oCoor = {
						  x:parseInt(columnStart,10)
						  ,y:sY
						  ,width:parseInt(columnWidth,10)-1.5
						  ,height:yHeight
						};
					aColumn.push(oCoor);
			
					sY = sY+yHeight;
					// 막대 데이타가 멀티일때 처리
					if( this.aData2.length > 1 ){
						sY2 = sY2+yHeight2;
					}
					nextSY += nextYHeight;
					
				}
				
				this.coordinate.push(aColumn); 
				
				// 막대 데이타가 멀티일때 처리
				if( this.aData2.length > 1 ){
					sX = sX + (xg*2);
				}else{
					sX = sX + xg;
				}
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
			sX = this.calculatedMargins.x;
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				columnStart = columnStart + vo.multiColumnIntimacy;
				sY = yZero;
				
				for( var j=1; j<columnCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = Math.round((d[i][j] * 100) / this.aSumData[i-1]);
					}else{
						calcData = d[i][j];
					}
				
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
					}
					
					if( cOn ){
						ctx.textAlign 	= 'center';
						ctx.fillStyle 	= cFontColor;
						ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
						cSX 			= columnStart+columnWidth/2;
						if( cPosition == 'external' ){
							if( d[i][j] < 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}else{
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}
						}else if( cPosition == 'inside_top' ){
							if( d[i][j] <= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = sY+yHeight+1;
							}
						}else if( cPosition == 'inside_middle' ){
							if( d[i][j] == 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY+yHeight-1;
							}else if( d[i][j] < 0 ){
								ctx.textBaseline = 'middle';
								cSY = sY+(Math.abs(yHeight)/2);
							}else{
								ctx.textBaseline = 'middle';
								cSY = sY-(Math.abs(yHeight)/2);
							}
						}else if( cPosition == 'inside_bottom' ){
							if( d[i][j] >= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = sY-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = sY+1;
							}
						}
						if( vo.is3D ){
							cSY += (this.bottom3DGap/2);
						}
						
						if(d[i][j] != null){
						
							if( cValueType == 'value' ){
								cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
							}else if( cValueType == 'percentage' && vo.stack100Percent ){
								cText = (calcData != 0)?this.formatter(calcData, vo.yAxis.format)+'%':'';
							}else if( cValueType == 'all' && vo.stack100Percent ){
								cText = ((d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'')+((calcData != 0)?'('+this.formatter(calcData, vo.yAxis.format)+'%)':'');
							}else{
								cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
							}
							cText = (vo.columnText.prefix + cText + vo.columnText.suffix);
							
							// label에 박스 그리기--------------------------------
							if( vo.columnTextBox && cPosition == 'inside_middle' ){
								guideLineX = (columnStart+columnWidth);
								guideLineY = cSY;
								ctx.textAlign 	= 'left';
								
								var tX=guideLineX+guideLinePointSize, tBoxMargin=parseInt(vo.columnTextBoxMargin, 10);
								var tW = ctx.measureText(cText).width+(tBoxMargin*2);
								var tH = cFontSize+(tBoxMargin*2);
								var tY = guideLineY - (tH/2);
								var backColor = vo.columnTextBoxFill;
								var boxStrokeColor = vo.columnTextBoxStrokeColor;
								var boxStrokeThickness = vo.columnTextBoxStrokeThickness;
								
								this._roundedRect( ctx, tX, tY,tW,tH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
								ctx.fillStyle = backColor;
								ctx.fill();
							  
								// guide line point--------------------
								if( vo.columnTextGuideLinePoint ){
									var color = vo.colors[(j-1) % vo.colors.length];
									var darkColor = this.adjustBrightness(color, -45);
									ctx.beginPath();
									ctx.arc((guideLineX-(guideLinePointSize/2)), guideLineY,guideLinePointSize,0,Math.PI*2,false);
									ctx.fillStyle = color;
									ctx.fill();
									ctx.closePath();
									ctx.beginPath();
									ctx.arc((guideLineX-(guideLinePointSize/2)), guideLineY,guideLinePointSize/3,0,Math.PI*2,false);
									ctx.strokeStyle = darkColor;
									ctx.fillStyle = darkColor;
									ctx.fill();
									ctx.lineWidth = 1;
									ctx.stroke();
									ctx.closePath();
								}
								// guide line point--------------------
								ctx.textBaseline = 'middle';
								
								//cSX = tX;
							}
							// label에 박스 그리기--------------------------------
						
							ctx.fillStyle 	= cFontColor;
							ctx.fillText(cText, tX+tBoxMargin, cSY);
						}
					}
					
					sY = sY+yHeight;
				}
				
				if( csOn ){
					
					if(vo.columnSumTextBox){
						ctx.textAlign 	= 'center';
						ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
						cSX 			= Math.round(columnStart+columnWidth)-2.5;
						if( csPosition == 'external' ){
							if( this.aSumData[i-1] < 0 ){
								ctx.textBaseline = 'top';
								csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+csFontSize+vo.columnSumTextBoxMargin:sY+csFontSize+vo.columnSumTextBoxMargin;
							}else{
								ctx.textBaseline = 'bottom';
								csSY = sY-(csFontSize+vo.columnSumTextBoxMargin+vo.columnSumTextBoxBottomMargin);
							}
						}
						csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
						
						var tW = ctx.measureText(csText).width;
						
						if( vo.columnSumTextGuideLine ){
							ctx.beginPath();
							ctx.lineWidth = 1;
							ctx.moveTo(cSX, csSY);
							ctx.lineTo(cSX, csSY+(csFontSize+vo.columnSumTextBoxMargin+vo.columnSumTextBoxBottomMargin));
							
							ctx.strokeStyle = vo.columnSumTextGuideLineColor;
							ctx.stroke();
							ctx.lineWidth = 1;
						}
						
						// 원 그리기
						var circleSize = csFontSize;
						if( vo.columnSumTextBoxType == 'circle' ){
							
							if( tW > csFontSize ){
								var radius = (circleSize/2)+vo.columnSumTextBoxMargin+2;
								var height = circleSize+(vo.columnSumTextBoxMargin*2);
								var width = tW+(vo.columnSumTextBoxMargin*2);
								var x = cSX-(tW/2)-vo.columnSumTextBoxMargin;
								var y = csSY-(height/2);
							
								ctx.beginPath();
								ctx.lineWidth = (vo.columnSumTextBoxStrokeThickness*2);
								ctx.moveTo(x, y+radius);
								ctx.lineTo(x,y+height-radius);
								ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
								ctx.lineTo(x+width-radius,y+height);
								ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
								ctx.lineTo(x+width,y+radius);
								ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
								ctx.lineTo(x+radius,y);
								ctx.quadraticCurveTo(x,y,x,y+radius);
								ctx.closePath();
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.stroke();
								ctx.lineWidth = 1;
			
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
							}else{
								ctx.beginPath();
								ctx.arc(cSX,csSY,(circleSize/2)+vo.columnSumTextBoxMargin,0,Math.PI*2,false);
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
								ctx.lineWidth = vo.columnSumTextBoxStrokeThickness;
								ctx.stroke();
								ctx.closePath();
								ctx.lineWidth = 1;
							}
							
							
						}
						
						ctx.fillStyle 	= csFontColor;
						ctx.fillText(csText, cSX, (csSY+(circleSize/2)));
						/*
						var circleSize = csFontSize;
						if( vo.columnSumTextBoxType == 'circle' ){
							
							if( tW > csFontSize ){
							
								var radius = ((circleSize+vo.columnSumTextBoxMargin)/2)+6;
								var height = circleSize+(vo.columnSumTextBoxMargin*2);
								var width = tW+(vo.columnSumTextBoxMargin*2);
								var x = cSX-(tW/2)-vo.columnSumTextBoxMargin;
								var y = csSY-(height/2);
							
								ctx.beginPath();
								ctx.lineWidth = (vo.columnSumTextBoxStrokeThickness*2);
								ctx.moveTo(x, y+radius);
								ctx.lineTo(x,y+height-radius);
								ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
								ctx.lineTo(x+width-radius,y+height);
								ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
								ctx.lineTo(x+width,y+radius);
								ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
								ctx.lineTo(x+radius,y);
								ctx.quadraticCurveTo(x,y,x,y+radius);
								ctx.closePath();
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.stroke();
								ctx.lineWidth = 1;
			
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
							}else{
								ctx.beginPath();
								ctx.arc(cSX,csSY,circleSize,0,Math.PI*2,false);
								ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
								ctx.fillStyle = vo.columnSumTextBoxFill;
								ctx.fill();
								ctx.lineWidth = vo.columnSumTextBoxStrokeThickness;
								ctx.stroke();
								ctx.closePath();
								ctx.lineWidth = 1;
							}
							
							
						}
						
						ctx.fillStyle 	= csFontColor;
						ctx.fillText(csText, cSX, (csSY+(circleSize/2)));
						*/
					}else{
						ctx.textAlign 	= 'center';
						ctx.fillStyle 	= csFontColor;
						ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
						cSX 			= columnStart+columnWidth/2;
						if( csPosition == 'external' ){
							if( this.aSumData[i-1] < 0 ){
								ctx.textBaseline = 'top';
								csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+3:sY+3;
							}else{
								ctx.textBaseline = 'bottom';
								csSY = sY-1;
							}
						}
						csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
						ctx.fillText(csText, cSX, csSY);
					}
				}
				
				// 막대 데이타가 멀티일때 처리
				if( this.aData2.length > 1 ){
					sX = sX + (xg*2);
				}else{
					sX = sX + xg;
				}
			}	
			
			// 막대 데이타가 멀티일때 처리
			if( this.aData2.length > 1 ){
				sX = this.calculatedMargins.x;
				for( var i=1; i<xCnt; i++ ){
					
					columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
					columnStart = columnStart+xg-vo.multiColumnIntimacy;
					sY = yZero;
					
					for( var j=1; j<columnCnt; j++ ){
					
						if( vo.stack100Percent ){
							calcData = Math.round((d2[i][j] * 100) / this.aSumData2[i-1]);
						}else{
							calcData = d2[i][j];
						}
					
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight = (this.calculatedMargins.h * calcData) / this.ranges.ymin;
						}else{
							yHeight = -((yZero - this.calculatedMargins.y) * calcData) / this.ranges.ymax;
						}
						
						if( cOn ){
							ctx.textAlign 	= 'center';
							ctx.fillStyle 	= cFontColor;
							ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
							cSX 			= columnStart+columnWidth/2;
							if( cPosition == 'external' ){
								if( d2[i][j] < 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else{
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}
							}else if( cPosition == 'inside_top' ){
								if( d2[i][j] <= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = sY+yHeight+1;
								}
							}else if( cPosition == 'inside_middle' ){
								if( d2[i][j] == 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else if( d2[i][j] < 0 ){
									ctx.textBaseline = 'middle';
									cSY = sY+(Math.abs(yHeight)/2);
								}else{
									ctx.textBaseline = 'middle';
									cSY = sY-(Math.abs(yHeight)/2);
								}
							}else if( cPosition == 'inside_bottom' ){
								if( d2[i][j] >= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = sY+1;
								}
							}
							if( vo.is3D ){
								cSY += (this.bottom3DGap/2);
							}
							
							if(d2[i][j] != null){
							
								if( cValueType == 'value' ){
									cText = (d2[i][j] != 0)?this.formatter(d2[i][j], vo.yAxis.format):'';
								}else if( cValueType == 'percentage' && vo.stack100Percent ){
									cText = (calcData != 0)?this.formatter(calcData, vo.yAxis.format)+'%':'';
								}else if( cValueType == 'all' && vo.stack100Percent ){
									cText = ((d2[i][j] != 0)?this.formatter(d2[i][j], vo.yAxis.format):'')+((calcData != 0)?'('+this.formatter(calcData, vo.yAxis.format)+'%)':'');
								}else{
									cText = (d2[i][j] != 0)?this.formatter(d2[i][j], vo.yAxis.format):'';
								}
								cText = (vo.columnText.prefix + cText + vo.columnText.suffix);
								
								// label에 박스 그리기--------------------------------
								if( vo.columnTextBox && cPosition == 'inside_middle' ){
									guideLineX = (columnStart+columnWidth);
									guideLineY = cSY;
									ctx.textAlign 	= 'left';
									
									var tX=guideLineX+guideLinePointSize, tBoxMargin=parseInt(vo.columnTextBoxMargin, 10);
									var tW = ctx.measureText(cText).width+(tBoxMargin*2);
									var tH = cFontSize+(tBoxMargin*2);
									var tY = guideLineY - (tH/2);
									var backColor = vo.columnTextBoxFill;
									var boxStrokeColor = vo.columnTextBoxStrokeColor;
									var boxStrokeThickness = vo.columnTextBoxStrokeThickness;
									
									this._roundedRect( ctx, tX, tY,tW,tH, 0, boxStrokeColor, true, true, true, true, boxStrokeThickness);
									ctx.fillStyle = backColor;
									ctx.fill();
								  
									// guide line point--------------------
									if( vo.columnTextGuideLinePoint ){
										var color = vo.colors2[(j-1) % vo.colors2.length];
										var darkColor = this.adjustBrightness(color, -45);
										ctx.beginPath();
										ctx.arc((guideLineX-(guideLinePointSize/2)), guideLineY,guideLinePointSize,0,Math.PI*2,false);
										ctx.fillStyle = color;
										ctx.fill();
										ctx.closePath();
										ctx.beginPath();
										ctx.arc((guideLineX-(guideLinePointSize/2)), guideLineY,guideLinePointSize/3,0,Math.PI*2,false);
										ctx.strokeStyle = darkColor;
										ctx.fillStyle = darkColor;
										ctx.fill();
										ctx.lineWidth = 1;
										ctx.stroke();
										ctx.closePath();
									}
									// guide line point--------------------
									ctx.textBaseline = 'middle';
									
									//cSX = tX;
								}
								// label에 박스 그리기--------------------------------
							
								ctx.fillStyle 	= cFontColor;
								ctx.fillText(cText, tX+tBoxMargin, cSY);
							}
						}
						
						sY = sY+yHeight;
					}
					
					if( csOn ){
						
						if(vo.columnSumTextBox){
							ctx.textAlign 	= 'center';
							ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
							cSX 			= Math.round(columnStart+columnWidth)-2.5;
							if( csPosition == 'external' ){
								if( this.aSumData2[i-1] < 0 ){
									ctx.textBaseline = 'top';
									csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+csFontSize+vo.columnSumTextBoxMargin:sY+csFontSize+vo.columnSumTextBoxMargin;
								}else{
									ctx.textBaseline = 'bottom';
									csSY = sY-(csFontSize+vo.columnSumTextBoxMargin+vo.columnSumTextBoxBottomMargin);
								}
							}
							csText = this.formatter(this.aSumData2[i-1], vo.yAxis.format);
							
							var tW = ctx.measureText(csText).width;
							
							if( vo.columnSumTextGuideLine ){
								ctx.beginPath();
								ctx.lineWidth = 1;
								ctx.moveTo(cSX, csSY);
								ctx.lineTo(cSX, csSY+(csFontSize+vo.columnSumTextBoxMargin+vo.columnSumTextBoxBottomMargin));
								
								ctx.strokeStyle = vo.columnSumTextGuideLineColor;
								ctx.stroke();
								ctx.lineWidth = 1;
							}
							
							// 원 그리기
							var circleSize = csFontSize;
							if( vo.columnSumTextBoxType == 'circle' ){
								
								if( tW > csFontSize ){
									var radius = (circleSize/2)+vo.columnSumTextBoxMargin+2;
									var height = circleSize+(vo.columnSumTextBoxMargin*2);
									var width = tW+(vo.columnSumTextBoxMargin*2);
									var x = cSX-(tW/2)-vo.columnSumTextBoxMargin;
									var y = csSY-(height/2);
								
									ctx.beginPath();
									ctx.lineWidth = (vo.columnSumTextBoxStrokeThickness*2);
									ctx.moveTo(x, y+radius);
									ctx.lineTo(x,y+height-radius);
									ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
									ctx.lineTo(x+width-radius,y+height);
									ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
									ctx.lineTo(x+width,y+radius);
									ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
									ctx.lineTo(x+radius,y);
									ctx.quadraticCurveTo(x,y,x,y+radius);
									ctx.closePath();
									ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
									ctx.stroke();
									ctx.lineWidth = 1;
				
									ctx.fillStyle = vo.columnSumTextBoxFill;
									ctx.fill();
								}else{
									ctx.beginPath();
									ctx.arc(cSX,csSY,(circleSize/2)+vo.columnSumTextBoxMargin,0,Math.PI*2,false);
									ctx.strokeStyle = vo.columnSumTextBoxStrokeColor;
									ctx.fillStyle = vo.columnSumTextBoxFill;
									ctx.fill();
									ctx.lineWidth = vo.columnSumTextBoxStrokeThickness;
									ctx.stroke();
									ctx.closePath();
									ctx.lineWidth = 1;
								}
								
								
							}
							
							ctx.fillStyle 	= csFontColor;
							ctx.fillText(csText, cSX, (csSY+(circleSize/2)));
							
						}else{
							ctx.textAlign 	= 'center';
							ctx.fillStyle 	= csFontColor;
							ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
							cSX 			= columnStart+columnWidth/2;
							if( csPosition == 'external' ){
								if( this.aSumData2[i-1] < 0 ){
									ctx.textBaseline = 'top';
									csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+3:sY+3;
								}else{
									ctx.textBaseline = 'bottom';
									csSY = sY-1;
								}
							}
							csText = this.formatter(this.aSumData2[i-1], vo.yAxis.format);
							ctx.fillText(csText, cSX, csSY);
						}
					}
					
					sX = sX + (xg*2);
				}
			}
			
		},
		drawColumn3D : function( ctx, i, j, columnStart, columnWidth, yHeight, sY, drawTop ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			sY += (this.bottom3DGap/2)+1;
			var y = sY+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, sY); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(x, sY);
			ctx.lineTo(x+10, sY-10);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(x, y);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// column 윗면.
			if( drawTop ){
				var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( sY < y ){
					grd3 = dcolor;
					y = sY;
				}
				ctx.beginPath();
				ctx.moveTo(columnStart, y);
				ctx.lineTo(x, y);
				ctx.lineTo(x+10, y-10);
				ctx.lineTo(columnStart+10, y-10);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = grd3;
				ctx.fill();
			}
			
			var grd2=ctx.createLinearGradient(columnStart, sY+yHeight, columnStart, sY); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), sY, parseInt(columnWidth,10), yHeight);
		},
		drawColumn3DCylinder : function( ctx, i, j, columnStart, columnWidth, yHeight, sY, drawTop ){
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			sY += (this.bottom3DGap/2)+1;
			var y = sY+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor); 
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), sY-cylinder3DGap, parseInt(columnWidth,10), yHeight);
			
			// column 아래면
			bottomColor = grd2;
			ctx.beginPath();
			ctx.fillStyle = bottomColor;
			if( sY < y ){
				this._drawEllipse(ctx,columnStart,(yHeight+sY)-(this.bottom3DGap/2),columnWidth,10);
			}else{
				this._drawEllipse(ctx,columnStart,sY-(this.bottom3DGap/2),columnWidth,10);
			}
			
			if( drawTop ){
			
				
			
				// column 윗면.
				var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( sY < y ){
					grd3 = dcolor;
					y = sY;
				}
				ctx.beginPath();
				ctx.fillStyle = grd3;
				this._drawEllipse(ctx,columnStart,y-10,columnWidth,10);
			}
			
		},
		setSelectColumnPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			my = (vo.is3D)?my-(this.bottom3DGap/2):my;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectColumnPoint_click : function(e){
			var vo 			= this.options;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			my = (vo.is3D)?my-(this.bottom3DGap/2):my;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								this.returnEventData( e, [i, j] );
							}
						}else{
							if( height > my && my > y ) {
							
								this.returnEventData( e, [i, j] );
							}
						}
					}
				}
			}
			
		},
		canvas_event_func_stackedColumn : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}else if( e.type=='click' ){
				eThis.setSelectColumnPoint_click(e, chartElem);
			}
		}
	});
	
	
	GLChart.Bar = function(){
		GLChart.call(this, arguments);
		this.aSaveBarCoordValue = [];
		this.options = {
			type : 'bar'
			,barOuterGap : 40
			,barInnerGap : 0
			,barShadow : false
			,barConnectLine : false
			,barConnectlineThickness : 1
			// barText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			,barText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12, margin:0}
			,barType : 'rectangle'	// cylinder, rectangle.
			,yAxis : {
				slantedText:false
				,slantedTextAngle:30
			}
			/* 추가옵션 */ 
			,barEachItem : {on: false, colors: []}
			// 신규추가(2016.07.27)---------------
			,barBackgroundImg : false
			// 신규추가(2016.07.27)---------------
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		
		// bar 차트일때 default options 아래 두가지 조정.
		this.common_options.horizontalFill.on = false;
		this.common_options.verticalFill.on = true;
		
		this.applyOptions(this.options, this.common_options);
		
		// 신규추가(2016.07.27)---------------
		this.aImgPattern = [];
		// 신규추가(2016.07.27)---------------
	};
	GLChart.Bar.prototype = new GLChart([]);
	GLChart.extend(GLChart.Bar, {
		render : function( o ){
			var _self = this;
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}

			if( this.options.barType == 'cylinder' ){
				this.options.is3D = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				
				// 이미지 배경을 사용하고자 할때처리.
				if(this.support_userAgent.ie){
					this.options.barBackgroundImg = false;
					this.drawBarChart();
				}else{
					if( this.options.barBackgroundImg && this.aImgData ){
						this.makeImagePattern( this.graphics_item, function( arr ){
							_self.aImgPattern = arr;
							_self.drawBarChart();
						});
					}else{
						this.drawBarChart();
					}
				}
				
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
		},
		drawBarChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawBar();
				this.drawCaptionTextRotate('title');
				this.drawCaptionTextRotate('xName');
				this.drawCaptionTextRotate('yName');
			}
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var vo = this.options;
			var bar = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var w = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var tw;
			
			this.drawAxis();	
			this.calcBarData();	
			this.drawCaptionTextRotate('title');
			this.drawCaptionTextRotate('xName');
			this.drawCaptionTextRotate('yName');
			ctx.save();
			
			bar.animationInst = window.setInterval( function(){
				
				if( w > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				w = w+acc;
				if(vo.is3D){
					if( vo.barType == 'cylinder' ){
						tw = bar.yZero-((bar.bottom3DGap/4)/2);
					}else{
						tw = bar.yZero-(bar.bottom3DGap/4);
					}
				}else{
					tw = bar.yZero;
				}	
				tw = tw-(tw*w);
				
				ctx.save();
				ctx.translate(tw, 0);
				ctx.scale(w, 1);
				bar.redrawBarSameValue(w);
				ctx.restore();
				
				if( w >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,bar.sWidth,bar.sHeight);
					bar.clearRect( bar.oCanvas_item, ctx, bar.sWidth, bar.sHeight);
					bar.drawBar();
					window.clearInterval(bar.animationInst);
				}
			},50);
		},
		calcBarData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var yCnt	 		= this.aData.length;
			var barCnt			= this.aData[0].length;
			var d				= this.aData;
			var barOuterGap 	= vo.barOuterGap;
			var bottom3DGap		= this.bottom3DGap;
			
			this.aSaveBarCoordValue = [];
			var sX, sY, eX, eY, xg, yg, xHeight = null, color, lcolor, dcolor, strokeColor;
			
			var xZero = this.yZero;
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.y+this.calculatedMargins.h;
			eX = sX;
			eY = this.calculatedMargins.y;
			yg = this.calculatedMargins.h / (yCnt-1);
			xg = this.calculatedMargins.w / (this.yLabels.length - 1);
			
			var barWidth = ((yg * (100 - barOuterGap)) / 100) / (barCnt-1);
			var barStart;
			var tempJ=0;tempI=0;
			
			for( var i=yCnt-1; i>=1; i-- ){
				
				barStart = (sY - ( yg - (barWidth * (barCnt-1)) ) / 2)-barWidth;
				this.aSaveBarCoordValue.push([]);
				tempJ = 0;
				
				for( var j=barCnt-1; j>=1; j-- ){
					if( (this.calculatedMargins.x+this.calculatedMargins.w) - xZero == 0 ){
						if( vo.is3D ){
							xHeight = -((this.calculatedMargins.w-bottom3DGap) * d[i][j]) / this.ranges.ymin;
						}else{
							xHeight = -(this.calculatedMargins.w * d[i][j]) / this.ranges.ymin;
						}
					}else{
						xHeight = (((this.calculatedMargins.w+this.calculatedMargins.x)-xZero) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.is3D && xHeight != 0 ){
						if( vo.barType == 'cylinder' ){
							this.calcBar3DCylinderData(ctx, tempI, j, barStart, barWidth, xHeight, xZero);
						}else{
							if( parseFloat(vo.barInnerGap) == 0 ){
								this.calcBar3DData(ctx, tempI, j, barStart, barWidth, xHeight, xZero);
							}else{
								var innerGap = parseFloat(vo.barInnerGap)/2;
								this.calcBar3DData(ctx, tempI, j, parseInt(barStart,10)+innerGap, parseInt(barWidth,10)-innerGap, xHeight, xZero);
							}
							
							
						}
					}else{
						if( vo.barEachItem.on ){
							color = vo.colors[(i-1)%vo.colors.length];
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
						}
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						// 이미지 배경을 사용하고자 할때처리.
						if( vo.barBackgroundImg && this.aImgData ){
							grd = this.aImgPattern[i][j];
						}
						
						//ctx.fillRect(xZero, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5);
						if( parseFloat(vo.barInnerGap) == 0 ){
							this.aSaveBarCoordValue[tempI].push([xZero, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5, grd, strokeColor]);
						}else{
							var innerGap = parseFloat(vo.barInnerGap)/2;
							this.aSaveBarCoordValue[tempI].push([xZero, (parseInt(barStart,10)+1.5)+innerGap, xHeight, (parseInt(barWidth,10)-1.5)-innerGap, grd, strokeColor]);
						}
					
					}
						
					
					if( parseFloat(vo.barInnerGap) == 0 ){
						barStart = barStart - barWidth-1;
					}else{
						var innerGap = parseFloat(vo.barInnerGap)/2;
						barStart = (barStart - barWidth-1)-(innerGap/2);
					}
					
					tempJ++;
				}
				
				sY = sY - yg;
				tempI++;
			}
			
		},
		calcBar3DData : function(ctx, i, j, barStart, barWidth, xHeight, xZero){
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var tempX;
			var y = barStart+barWidth-1.5;
			
			if( vo.barEachItem.on ){
				color = vo.colors[(i-1)%vo.colors.length];
			}else{
				color = vo.colors[(j-1)%vo.colors.length];
			}
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// bar 옆면.
			var grd=ctx.createLinearGradient(x, barStart, xZero, barStart);
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// bar 윗면.
			var grd3=ctx.createLinearGradient(x+8, y, x, y); 
			grd3.addColorStop(0.2,color);  
			grd3.addColorStop(1,dcolor);
			if( xZero > x ){
				grd3 = dcolor;
				tempX = xZero-0.5;
			}else{
				tempX = x;
			}
			
			var grd2=ctx.createLinearGradient( xZero+xHeight, barStart, xZero, barStart); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
		
			this.aSaveBarCoordValue[i].push([
												[xZero, barStart,x, barStart, x, barStart-5, xZero, barStart-5, 'butt',grd]
												,[tempX, barStart, tempX, y, tempX, y-5, tempX, barStart-5,'butt',grd3]
												,[xZero, parseInt(barStart,10), xHeight, parseInt(barWidth,10), grd2]
											]);
		},
		calcBar3DCylinderData : function(ctx, i, j, barStart, barWidth, xHeight, xZero){
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var harf = (this.bottom3DGap/4)/2;
			var vo = this.options;
			var color, lcolor, dcolor, grd, bottomColor;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var tempX;
			var y = barStart+barWidth-1.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// bar 앞면.
			var grd2=ctx.createLinearGradient( xZero, barStart, xZero, barStart+barWidth );
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor);
			
			// bar 아래면
			bottomColor = grd2;
			var arr = null;
			if( xZero > x ){
				arr = [xHeight+xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10), bottomColor];
			}else{
				arr = [xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10), bottomColor];
			}
			
			// bar 윗면.
			var grd3=ctx.createLinearGradient(x, y, x+harf, y); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( xZero > x ){
				grd3 = dcolor;
				x = xZero-0.5;
			}
		
			this.aSaveBarCoordValue[i].push([
												[xZero+harf, parseInt(barStart,10), xHeight, parseInt(barWidth,10),grd2]
												,arr
												,[x,barStart,harf*2,parseInt(barWidth,10)-1, grd3]
											]);
		},
		redrawBarSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item;
			var yCnt	 		= this.aData.length;
			var barCnt			= this.aData[0].length;
			var val				= this.aSaveBarCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/4)/v);
			//alert(cv);
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<yCnt; i++ ){
				for( var j=1; j<barCnt; j++ ){
					if( vo.is3D && val[i-1][j-1][2][3] != 0 && vo.barType != 'cylinder' ){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						// bar 옆면.
						ctx.beginPath();
						ctx.moveTo(calcVal[0][0], calcVal[0][1]);
						ctx.lineTo(calcVal[0][2], calcVal[0][3]);
						ctx.lineTo(calcVal[0][4]+cv, calcVal[0][5]);
						ctx.lineTo(calcVal[0][6]+cv, calcVal[0][7]);
						ctx.lineCap = calcVal[0][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[0][9];
						ctx.fill();
						// bar 윗면.
						ctx.beginPath();
						ctx.moveTo(calcVal[1][0], calcVal[1][1]);
						ctx.lineTo(calcVal[1][2], calcVal[1][3]);
						ctx.lineTo(calcVal[1][4]+cv, calcVal[1][5]);
						ctx.lineTo(calcVal[1][6]+cv, calcVal[1][7]);
						ctx.lineCap = calcVal[1][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[1][9];
						ctx.fill();
						// bar 앞면
						ctx.fillStyle = calcVal[2][4];
						ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
						
					}else if(vo.barType == 'cylinder' && val[i-1][j-1][2][3] != 0){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						
						// bar 앞면
						ctx.fillStyle = calcVal[0][4];
						ctx.fillRect(calcVal[0][0], calcVal[0][1], calcVal[0][2], calcVal[0][3]);
						
						// bar 아래면
						ctx.beginPath();
						ctx.fillStyle = calcVal[1][4];
						this._drawEllipse(ctx,calcVal[1][0],calcVal[1][1],calcVal[1][2]-1,calcVal[1][3]);
						
						// bar 윗면.
						ctx.beginPath();
						ctx.fillStyle = calcVal[2][4];
						this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
						
					}else{
						y = val[i-1][j-1][1];
						ctx.fillStyle = val[i-1][j-1][4];
						ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
					}
				
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		drawBar : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var yCnt	 		= this.aData.length;
			var barCnt			= this.aData[0].length;
			var d				= this.aData;
			var barOuterGap 	= vo.barOuterGap;
			var bottom3DGap		= this.bottom3DGap;
			var oCoor = null;
			var aBar = [];
			this.coordinate 	= [];
			this.aSaveBarCoordValue = [];
			var sX, sY, eX, eY, xg, yg, xHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.barText.on;
			var cPosition		= vo.barText.position;
			var cFontSize		= vo.barText.fontSize;
			var cFontName		= vo.barText.fontName;
			var cFontColor		= vo.barText.color;
			var cSX, cSY, cText, cTextWidth;
			var xZero = this.yZero;
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.y+this.calculatedMargins.h;
			eX = sX;
			eY = this.calculatedMargins.y;
			yg = this.calculatedMargins.h / (yCnt-1);
			xg = this.calculatedMargins.w / (this.yLabels.length - 1);
			
			var barWidth = ((yg * (100 - barOuterGap)) / 100) / (barCnt-1);
			var barStart;
			
			if(vo.barShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=1;
				ctx.shadowOffsetY=2;
				ctx.shadowBlur=3;
			}
			
			for( var i=yCnt-1; i>=1; i-- ){
				
				barStart = (sY - ( yg - (barWidth * (barCnt-1)) ) / 2)-barWidth;
				aBar = [];
				
				for( var j=barCnt-1; j>=1; j-- ){
					if( (this.calculatedMargins.x+this.calculatedMargins.w) - xZero == 0 ){
						if( vo.is3D ){
							xHeight = -((this.calculatedMargins.w-bottom3DGap) * d[i][j]) / this.ranges.ymin;
						}else{
							xHeight = -(this.calculatedMargins.w * d[i][j]) / this.ranges.ymin;
						}
					}else{
						xHeight = (((this.calculatedMargins.w+this.calculatedMargins.x)-xZero) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.is3D && xHeight != 0 ){
						if( vo.barType == 'cylinder' ){
							this.drawBar3DCylinder(ctx, i, j, barStart, barWidth, xHeight, xZero);
						}else{
							
							if( parseFloat(vo.barInnerGap) == 0 ){
								this.drawBar3D(ctx, i, j, barStart, barWidth, xHeight, xZero);
							}else{
								var innerGap = parseFloat(vo.barInnerGap)/2;
								this.drawBar3D(ctx, i, j, parseInt(barStart,10)+innerGap, parseInt(barWidth,10)-innerGap, xHeight, xZero);
							}
							
							
						}	
					}else{
						if( vo.barEachItem.on ){
							color = vo.colors[(i-1)%vo.colors.length];
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
						}
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						
						if( parseFloat(vo.barInnerGap) == 0 ){
							if( xHeight != 0 ){
								ctx.strokeStyle = strokeColor;
								ctx.lineWidth = 1; 
								ctx.strokeRect(xZero, parseInt(barStart,10)+1.5, xHeight-0.5, parseInt(barWidth,10)-1.5);
							}
							
							// 이미지 배경을 사용하고자 할때처리.
							if( vo.barBackgroundImg && this.aImgData ){
								var pattern = this.aImgPattern[i][j];
								ctx.fillStyle = pattern;
								ctx.fillRect(xZero, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5);
								
							}else{
								ctx.fillStyle = grd;
								ctx.fillRect(xZero, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5);
							}
						}else{
							var innerGap = parseFloat(vo.barInnerGap)/2;
							if( xHeight != 0 ){
								ctx.strokeStyle = strokeColor;
								ctx.lineWidth = 1; 
								ctx.strokeRect(xZero, (parseInt(barStart,10)+1.5)+innerGap, xHeight-0.5, (parseInt(barWidth,10)-1.5)-innerGap);
							}
							// 이미지 배경을 사용하고자 할때처리.
							if( vo.barBackgroundImg && this.aImgData ){
								var pattern = this.aImgPattern[i][j];
								ctx.fillStyle = pattern;
								ctx.fillRect(xZero, (parseInt(barStart,10)+1.5)+innerGap, xHeight, (parseInt(barWidth,10)-1.5)-innerGap);
								
							}else{
								ctx.fillStyle = grd;
								ctx.fillRect(xZero, (parseInt(barStart,10)+1.5)+innerGap, xHeight, (parseInt(barWidth,10)-1.5)-innerGap);
							}
						}
						
						
					}
					
					if( cOn ){
						ctx.textAlign 	= 'left';
						ctx.textBaseline = 'middle';
						ctx.fillStyle 	= cFontColor;
						ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
						cSY = (vo.is3D)?(barStart+(barWidth/2))+(this.bottom3DGap/6):barStart+(barWidth/2);
						if( cPosition == 'external' ){
							
							if( d[i][j] <= 0 ){
								ctx.textAlign = 'right';
								cSX = xZero+xHeight-1- vo.barText.margin;
							}else{
								ctx.textAlign 	= 'left';
								cSX = xZero+xHeight+1+ vo.barText.margin;
							}
							
						}else if( cPosition == 'inside_top' ){
							ctx.textAlign = 'right';
							if( d[i][j] <= 0 ){
								ctx.textAlign = 'left';
								cSX = xZero+xHeight;
							}else{
								cSX = (vo.is3D)?xZero+xHeight-(this.bottom3DGap/3):xZero+xHeight-1;
							}
						}else if( cPosition == 'inside_middle' ){
							ctx.textAlign 	= 'center';
							if( d[i][j] == 0 ){
								cSX = xZero+xHeight+1;
							}else if( d[i][j] < 0 ){
								cSX = (vo.is3D)?xZero-((Math.abs(xHeight)/2)+(this.bottom3DGap/3)):xZero-(Math.abs(xHeight)/2);
							}else{
								cSX = (vo.is3D)?xZero+((Math.abs(xHeight)/2)-(this.bottom3DGap/3)):xZero+(Math.abs(xHeight)/2);
							}
						}else if( cPosition == 'inside_bottom' ){
							if( d[i][j] >= 0 ){
								cSX = (vo.is3D)?xZero-(this.bottom3DGap/3)+1:xZero;
							}else{
								ctx.textAlign = 'right';
								cSX = (vo.is3D)?xZero-(this.bottom3DGap/3):xZero;
							}
						}
						
						cText = this.formatter(d[i][j], vo.yAxis.format);
						
						if( cPosition == 'inside_top' || cPosition == 'inside_middle' || cPosition == 'inside_bottom' ){
							cTextWidth = ctx.measureText(cText).width;
							if( cTextWidth < Math.abs(xHeight) ){
								ctx.fillText(cText, cSX, cSY);
							}else{
								
								if( d[i][j] <= 0 ){
									ctx.textAlign 	= 'right';
									cSX = xZero+xHeight-1- vo.barText.margin;
								}else{
									ctx.textAlign 	= 'left';
									cSX = xZero+xHeight+1+ vo.barText.margin;
								}
								ctx.fillText(cText, cSX, cSY);
							}
						}else{
							ctx.fillText(cText, cSX, cSY);
						}
						
					}	
					
					// 좌표저장
					oCoor = {
						  x:xZero
						  ,y:parseInt(barStart,10)
						  ,width:xHeight
						  ,height:parseInt(barWidth,10)
						};
					aBar.push(oCoor);
			
					if( parseFloat(vo.barInnerGap) == 0 ){
						barStart = barStart - barWidth-1;
					}else{
						var innerGap = parseFloat(vo.barInnerGap)/2;
						barStart = (barStart - barWidth-1)-(innerGap/2);
					}
				}
				
				this.coordinate.push(aBar); 
				
				sY = sY - yg;
			}
			
			if(vo.barShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawBar3D : function( ctx, i, j, barStart, barWidth, xHeight, xZero ){
			
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var y = barStart+barWidth-1.5;
			
			if( vo.barEachItem.on ){
				color = vo.colors[(i-1)%vo.colors.length];
			}else{
				color = vo.colors[(j-1)%vo.colors.length];
			}
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// bar 옆면.
			var grd=ctx.createLinearGradient(x, barStart, xZero, barStart);
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(xZero, barStart);
			ctx.lineTo(x, barStart);
			ctx.lineTo(x+5, barStart-5);
			ctx.lineTo(xZero+5, barStart-5);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// bar 윗면.
			var grd3=ctx.createLinearGradient(x+8, y, x, y); 
			grd3.addColorStop(0.2,color);  
			grd3.addColorStop(1,dcolor);
			if( xZero > x ){
				grd3 = dcolor;
				x = xZero-0.5;
			}
			ctx.beginPath();
			ctx.moveTo(x, barStart);
			ctx.lineTo(x, y);
			ctx.lineTo(x+5, y-5);
			ctx.lineTo(x+5, barStart-5);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd3;
			ctx.fill();
			
			
			var grd2=ctx.createLinearGradient( xZero+xHeight, barStart, xZero, barStart); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(xZero, parseInt(barStart,10), xHeight, parseInt(barWidth,10));
		},
		drawBar3DCylinder : function( ctx, i, j, barStart, barWidth, xHeight, xZero ){
			
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var harf = (this.bottom3DGap/4)/2;
			var vo = this.options;
			var color, lcolor, dcolor, grd, bottomColor;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var y = barStart+barWidth-1.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// bar 앞면.
			var grd2=ctx.createLinearGradient( xZero, barStart, xZero, barStart+barWidth );
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor);
			ctx.fillStyle = grd2;
			ctx.fillRect(xZero+harf, parseInt(barStart,10), xHeight, parseInt(barWidth,10));
			
			// bar 아래면
			bottomColor = grd2;
			ctx.beginPath();
			ctx.fillStyle = bottomColor;
			if( xZero > x ){
				this._drawEllipse(ctx,xHeight+xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10));
			}else{
				this._drawEllipse(ctx,xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10));
			}
			
			// bar 윗면.
			var grd3=ctx.createLinearGradient(x, y, x+harf, y); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( xZero > x ){
				grd3 = dcolor;
				x = xZero-0.5;
			}
			ctx.beginPath();
			ctx.fillStyle = grd3;
			this._drawEllipse(ctx,x,barStart,harf*2,parseInt(barWidth,10)-1);
			
		},
		setSelectBarPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			var tempI=len-1,tempJ=len2-1;  
			for( var i=0;i<len;i++ ) {
				tempJ=len2-1;
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x-(this.bottom3DGap/4);
					var y = this.coordinate[i][j].y+(this.bottom3DGap/4);
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					
					if( y < my && my < height ) {
						if( 0 > width ) {
							if( x > mx && mx > x+width ) {
								pointX = x+width + gap;
								pointY = y - gap;
								this.drawTooltip( e, [tempI,tempJ], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i],[tempJ,tempI]);
								selectFlag = true;
							}
						}else{
							if( width+x > mx && mx > x ) {
								pointX = x+width + gap;
								pointY = y - gap;
								this.drawTooltip( e, [tempI,tempJ], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i],[tempJ,tempI]);
								selectFlag = true;
							}
						}
					}
					tempJ--;
				}
				tempI--;
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		canvas_event_func_bar : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectBarPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectBarPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}
		}
	});
	
	GLChart.StackedBar = function(){
		GLChart.call(this, arguments);
		this.aSaveBarCoordValue = [];
		this.options = {
			type : 'stackedBar'
			,barOuterGap : 50
			,barShadow : false
			,barConnectLine : false
			,barConnectlineThickness : 1
			// barText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			,barText : {on:false, position:'external', valueType:'value', color:'#000000', fontName:'Gulim', fontSize:12}
			,barSumText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,barType : 'rectangle'	// cylinder, rectangle.
			,stack100Percent : false
			,yAxis : {
				slantedText:false
				,slantedTextAngle:30
			}
			
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		
		// bar 차트일때 default options 아래 두가지 조정.
		this.common_options.horizontalFill.on = false;
		this.common_options.verticalFill.on = true;
		
		this.applyOptions(this.options, this.common_options);
	};
	GLChart.StackedBar.prototype = new GLChart([]);
	GLChart.extend(GLChart.StackedBar, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}

			if( this.options.barType == 'cylinder' ){
				this.options.is3D = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				this.drawStackedBarChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
		},
		drawStackedBarChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawStackedBar();
				this.drawCaptionTextRotate('title');
				this.drawCaptionTextRotate('xName');
				this.drawCaptionTextRotate('yName');
			}
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var vo = this.options;
			var bar = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var w = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var tw;
			
			this.drawAxis();	
			this.calcStackedBarData();	
			this.drawCaptionTextRotate('title');
			this.drawCaptionTextRotate('xName');
			this.drawCaptionTextRotate('yName');
			ctx.save();
			
			bar.animationInst = window.setInterval( function(){
				
				if( w > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				w = w+acc;
				if(vo.is3D){
					if( vo.barType == 'cylinder' ){
						tw = bar.yZero-((bar.bottom3DGap/4)/2);
					}else{
						tw = bar.yZero-(bar.bottom3DGap/4);
					}
				}else{
					tw = bar.yZero;
				}	
				tw = tw-(tw*w);
				
				ctx.save();
				ctx.translate(tw, 0);
				ctx.scale(w, 1);
				bar.redrawStackedBarSameValue(w);
				ctx.restore();
				
				if( w >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,bar.sWidth,bar.sHeight);
					bar.clearRect( bar.oCanvas_item, ctx, bar.sWidth, bar.sHeight);
					bar.drawStackedBar();
					window.clearInterval(bar.animationInst);
				}
			},50);
		},
		calcStackedBarData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var yCnt	 		= this.aData.length;
			var barCnt			= this.aData[0].length;
			var d				= this.aData;
			var barOuterGap 	= vo.barOuterGap;
			var bottom3DGap		= this.bottom3DGap;
			
			this.aSaveBarCoordValue = [];
			var sX, sY, eX, eY, xg, yg, xHeight = null, color, lcolor, dcolor, strokeColor;
			var calcData = null;
			var xZero = this.yZero;
			
			
			sX = xZero;
			sY = this.calculatedMargins.y+this.calculatedMargins.h;
			eX = sX;
			eY = this.calculatedMargins.y;
			yg = this.calculatedMargins.h / (yCnt-1);
			xg = this.calculatedMargins.w / (this.yLabels.length - 1);
			
			var barWidth = (yg * (100 - barOuterGap)) / 100;
			var barStart = sY;
			var tempI=0;
			
			for( var i=yCnt-1; i>=1; i-- ){
				
				barStart = (sY - ( yg - barWidth ) / 2)-barWidth;
				sX = xZero;
				this.aSaveBarCoordValue.push([]);
				tempJ = 0;
				
				for( var j=1; j<barCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( (this.calculatedMargins.x+this.calculatedMargins.w) - xZero == 0 ){
						if( vo.is3D ){
							xHeight = -((this.calculatedMargins.w-bottom3DGap) * calcData) / this.ranges.ymin;
						}else{
							xHeight = -(this.calculatedMargins.w * calcData) / this.ranges.ymin;
						}
					}else{
						xHeight = (((this.calculatedMargins.w+this.calculatedMargins.x)-xZero) * calcData) / this.ranges.ymax;
					}
					
					if( vo.is3D ){
						if( vo.barType == 'cylinder' ){
							if( j==barCnt-1 && xHeight>0 || j==1 && xHeight<0 || j==1 && xHeight==0 || j==barCnt-1 && xHeight==0 ){
								this.calcStackedBar3DCylinderData(ctx, tempI, j, barStart, barWidth, xHeight, sX, true);
							}else{
								this.calcStackedBar3DCylinderData(ctx, tempI, j, barStart, barWidth, xHeight, sX, false);
							}
						}else{
							if( j==barCnt-1 && xHeight>0 || j==1 && xHeight<0 || j==1 && xHeight==0 || j==barCnt-1 && xHeight==0 ){
								this.calcStackedBar3DData(ctx, tempI, j, barStart, barWidth, xHeight, sX, true);
							}else{
								this.calcStackedBar3DData(ctx, tempI, j, barStart, barWidth, xHeight, sX, false);
							}
						}
					}else{
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						//ctx.fillRect(xZero, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5);
						this.aSaveBarCoordValue[tempI].push([sX, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5, grd, strokeColor]);
					}
						
					
					sX += xHeight;
				}
				
				sY = sY - yg;
				tempI++;
			}
			
		},
		calcStackedBar3DData : function(ctx, i, j, barStart, barWidth, xHeight, xZero, drawTop){
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var tempX;
			var y = barStart+barWidth-1.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// bar 옆면.
			var grd=ctx.createLinearGradient(x, barStart, xZero, barStart);
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// bar 윗면.
			if( drawTop ){
				var grd3=ctx.createLinearGradient(x+8, y, x, y); 
				grd3.addColorStop(0.2,color);  
				grd3.addColorStop(1,dcolor);
				if( xZero > x ){
					grd3 = dcolor;
					tempX = xZero-0.5;
				}else{
					tempX = x;
				}
			}
			
			var grd2=ctx.createLinearGradient( xZero+xHeight, barStart, xZero, barStart); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
		
			this.aSaveBarCoordValue[i].push([
												[xZero, barStart,x, barStart, x, barStart-5, xZero, barStart-5, 'butt',grd]
												,[tempX, barStart, tempX, y, tempX, y-5, tempX, barStart-5,'butt',grd3]
												,[xZero, parseInt(barStart,10), xHeight, parseInt(barWidth,10), grd2]
											]);
		},
		calcStackedBar3DCylinderData : function(ctx, i, j, barStart, barWidth, xHeight, xZero, drawTop){
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var harf = (this.bottom3DGap/4)/2;
			var vo = this.options;
			var color, lcolor, dcolor, grd, bottomColor;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var tempX;
			var y = barStart+barWidth-1.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// bar 앞면.
			var grd2=ctx.createLinearGradient( xZero, barStart, xZero, barStart+barWidth );
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor);
			
			// bar 아래면
			bottomColor = grd2;
			var arr = null;
			if( xZero > x ){
				arr = [xHeight+xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10), bottomColor];
			}else{
				arr = [xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10), bottomColor];
			}
			
			if( drawTop ){
				// bar 윗면.
				var grd3=ctx.createLinearGradient(x, y, x+harf, y); 
				grd3.addColorStop(0.2,color);  
				grd3.addColorStop(1,dcolor);
				if( xZero > x ){
					grd3 = dcolor;
					tempX = xZero-0.5;
				}else{
					tempX = x;
				}
				
			}
			
		
			this.aSaveBarCoordValue[i].push([
												[xZero+harf, parseInt(barStart,10), xHeight, parseInt(barWidth,10),grd2]
												,arr
												,[tempX,barStart,harf*2,parseInt(barWidth,10)-1, grd3]
											]);
		},
		redrawStackedBarSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item;
			var yCnt	 		= this.aData.length;
			var barCnt			= this.aData[0].length;
			var val				= this.aSaveBarCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/4)/v);
			//alert(cv);
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<yCnt; i++ ){
				for( var j=1; j<barCnt; j++ ){
					if( vo.is3D && val[i-1][j-1][2][3] != 0 && vo.barType != 'cylinder' ){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						// bar 옆면.
						ctx.beginPath();
						ctx.moveTo(calcVal[0][0], calcVal[0][1]);
						ctx.lineTo(calcVal[0][2], calcVal[0][3]);
						ctx.lineTo(calcVal[0][4]+cv, calcVal[0][5]);
						ctx.lineTo(calcVal[0][6]+cv, calcVal[0][7]);
						ctx.lineCap = calcVal[0][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[0][9];
						ctx.fill();
						// bar 윗면.
						ctx.beginPath();
						ctx.moveTo(calcVal[1][0], calcVal[1][1]);
						ctx.lineTo(calcVal[1][2], calcVal[1][3]);
						ctx.lineTo(calcVal[1][4]+cv, calcVal[1][5]);
						ctx.lineTo(calcVal[1][6]+cv, calcVal[1][7]);
						ctx.lineCap = calcVal[1][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[1][9];
						ctx.fill();
						// bar 앞면
						ctx.fillStyle = calcVal[2][4];
						ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
						
					}else if(vo.barType == 'cylinder' && val[i-1][j-1][2][3] != 0){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						
						// bar 앞면
						ctx.fillStyle = calcVal[0][4];
						ctx.fillRect(calcVal[0][0], calcVal[0][1], calcVal[0][2], calcVal[0][3]);
						
						// bar 아래면
						ctx.beginPath();
						ctx.fillStyle = calcVal[1][4];
						this._drawEllipse(ctx,calcVal[1][0],calcVal[1][1],calcVal[1][2]-1,calcVal[1][3]);
						
						// bar 윗면.
						ctx.beginPath();
						ctx.fillStyle = calcVal[2][4];
						this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
						
					}else{
						y = val[i-1][j-1][1];
						ctx.fillStyle = val[i-1][j-1][4];
						ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
					}
				
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		drawStackedBar : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var yCnt	 		= this.aData.length;
			var barCnt			= this.aData[0].length;
			var d				= this.aData;
			var barOuterGap 	= vo.barOuterGap;
			var bottom3DGap		= this.bottom3DGap;
			var oCoor = null;
			var aBar = [];
			this.coordinate 	= [];
			this.aSaveBarCoordValue = [];
			var sX, nextSX, sY, eX, eY, xg, yg, xHeight = null, nextXHeight=null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.barText.on;
			var cPosition		= vo.barText.position;
			var cValueType		= vo.barText.valueType;
			var cFontSize		= vo.barText.fontSize;
			var cFontName		= vo.barText.fontName;
			var cFontColor		= vo.barText.color;
			var csOn			= vo.barSumText.on;
			var csPosition		= vo.barSumText.position;
			var csFontSize		= vo.barSumText.fontSize;
			var csFontName		= vo.barSumText.fontName;
			var csFontColor		= vo.barSumText.color;
			var cSX, csSX, cSY, cText, csText;
			var xZero = this.yZero;
			var calcData = null, nextCalcData = null;
			
			sX = xZero;
			sY = this.calculatedMargins.y+this.calculatedMargins.h;
			eX = sX;
			eY = this.calculatedMargins.y;
			yg = this.calculatedMargins.h / (yCnt-1);
			xg = this.calculatedMargins.w / (this.yLabels.length - 1);
			
			var barWidth = (yg * (100 - barOuterGap)) / 100;
			var barStart = sY;
			
			if(vo.barShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=2;
				ctx.shadowBlur=3;
			}
			
			for( var i=yCnt-1; i>=1; i-- ){
				
				barStart = (sY - ( yg - barWidth ) / 2)-barWidth;
				sX = xZero;
				nextSX = xZero;
				aBar = [];
				
				for( var j=1; j<barCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = (d[i][j] * 100) / this.aSumData[i-1];
					}else{
						calcData = d[i][j];
					}
				
					if( (this.calculatedMargins.x+this.calculatedMargins.w) - xZero == 0 ){
						if( vo.is3D ){
							xHeight = -((this.calculatedMargins.w-bottom3DGap) * calcData) / this.ranges.ymin;
						}else{
							xHeight = -(this.calculatedMargins.w * calcData) / this.ranges.ymin;
						}
					}else{
						xHeight = (((this.calculatedMargins.w+this.calculatedMargins.x)-xZero) * calcData) / this.ranges.ymax;
					}
					
					if( vo.is3D ){
					
						if( vo.barType == 'cylinder' ){
							if( j==barCnt-1 && xHeight>0 || j==1 && xHeight<0 || j==1 && xHeight==0 || j==barCnt-1 && xHeight==0 ){
								this.drawStackedBar3DCylinder(ctx, i, j, barStart, barWidth, xHeight, sX, true);
							}else{
								this.drawStackedBar3DCylinder(ctx, i, j, barStart, barWidth, xHeight, sX, false);
							}
						}else{
							if( j==barCnt-1 && xHeight>0 || j==1 && xHeight<0 || j==1 && xHeight==0 || j==barCnt-1 && xHeight==0 ){
								this.drawStackedBar3D(ctx, i, j, barStart, barWidth, xHeight, sX, true);
							}else{
								this.drawStackedBar3D(ctx, i, j, barStart, barWidth, xHeight, sX, false);
							}
						}
					
						
					}else{
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(0, parseInt(barStart,10)+1.5, 0, barStart+barWidth); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						if( xHeight != 0 ){
							ctx.strokeStyle = strokeColor;
							ctx.lineWidth = 1; 
							ctx.strokeRect(sX, parseInt(barStart,10)+1.5, xHeight-0.5, parseInt(barWidth,10)-1.5);
						}
						ctx.fillStyle = grd;
						ctx.fillRect(sX, parseInt(barStart,10)+1.5, xHeight, parseInt(barWidth,10)-1.5);
					}
					
					if( vo.barConnectLine && i > 1 ){
					
						if( vo.stack100Percent ){
							nextCalcData = (d[i-1][j] * 100) / this.aSumData[i-2];
						}else{
							nextCalcData = d[i-1][j];
						}
					
						if( (this.calculatedMargins.x+this.calculatedMargins.w) - xZero == 0 ){
							if( vo.is3D ){
								nextXHeight = -((this.calculatedMargins.w-bottom3DGap) * nextCalcData) / this.ranges.ymin;
							}else{
								nextXHeight = -(this.calculatedMargins.w * nextCalcData) / this.ranges.ymin;
							}
						}else{
							nextXHeight = (((this.calculatedMargins.w+this.calculatedMargins.x)-xZero) * nextCalcData) / this.ranges.ymax;
						}
						
						xHeight = isNaN(xHeight)?0:xHeight;
						nextXHeight = isNaN(nextXHeight)?0:nextXHeight;
					
						ctx.beginPath();
						ctx.strokeStyle = this.adjustBrightness(vo.colors[(j-1)%vo.colors.length], 25);
						if( vo.is3D ){
							if( vo.is3D && vo.barType != 'cylinder' ){
								ctx.moveTo(sX+xHeight-(bottom3DGap/4), barStart+(bottom3DGap/4)-1);
								ctx.lineTo( nextSX+nextXHeight-(bottom3DGap/4), barStart-(yg-barWidth)-1+(bottom3DGap/4) );
							}else{
								ctx.moveTo(sX+xHeight-((bottom3DGap/4)/2), barStart+(bottom3DGap/4)-1);
								ctx.lineTo( nextSX+nextXHeight-((bottom3DGap/4)/2), barStart-(yg-barWidth)-1+(bottom3DGap/4) );
							}	
						}else{
							ctx.moveTo(sX+xHeight, barStart+1);
							ctx.lineTo( nextSX+nextXHeight, barStart-(yg-barWidth)-1 );
						}	
						ctx.lineWidth = vo.barConnectlineThickness;
						ctx.stroke();
						
						nextSX += nextXHeight;
					}
					
					// 좌표저장
					oCoor = {
						  x:sX
						  ,y:parseInt(barStart,10)
						  ,width:xHeight
						  ,height:parseInt(barWidth,10)
						};
					aBar.push(oCoor);
					
					sX += xHeight;
					
				}
				
				this.coordinate.push(aBar); 
				
				sY = sY - yg;
			}
			
			if(vo.barShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
			sY = this.calculatedMargins.y+this.calculatedMargins.h;
			for( var i=yCnt-1; i>=1; i-- ){
				
				barStart = (sY - ( yg - barWidth ) / 2)-barWidth;
				sX = xZero;
				
				for( var j=1; j<barCnt; j++ ){
				
					if( vo.stack100Percent ){
						calcData = Math.round((d[i][j] * 100) / this.aSumData[i-1]);
					}else{
						calcData = d[i][j];
					}
				
					if( (this.calculatedMargins.x+this.calculatedMargins.w) - xZero == 0 ){
						if( vo.is3D ){
							xHeight = -((this.calculatedMargins.w-bottom3DGap) * calcData) / this.ranges.ymin;
						}else{
							xHeight = -(this.calculatedMargins.w * calcData) / this.ranges.ymin;
						}
					}else{
						xHeight = (((this.calculatedMargins.w+this.calculatedMargins.x)-xZero) * calcData) / this.ranges.ymax;
					}
					
					if( cOn ){
						ctx.textAlign 	= 'left';
						ctx.textBaseline = 'middle';
						ctx.fillStyle 	= cFontColor;
						ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
						cSY = (vo.is3D)?(barStart+(barWidth/2))+(this.bottom3DGap/6):barStart+(barWidth/2);
						if( cPosition == 'external' ){
							cSX = sX+xHeight+1;
						}else if( cPosition == 'inside_top' ){
							ctx.textAlign = 'right';
							if( d[i][j] <= 0 ){
								cSX = sX+xHeight+cFontSize;
							}else{
								cSX = (vo.is3D)?sX+xHeight-(this.bottom3DGap/3):sX+xHeight-1;
							}
						}else if( cPosition == 'inside_middle' ){
							ctx.textAlign 	= 'center';
							if( d[i][j] == 0 ){
								cSX = (vo.is3D)?sX-((Math.abs(xHeight)/2)+(this.bottom3DGap/3)):sX-(Math.abs(xHeight)/2);
							}else if( d[i][j] < 0 ){
								cSX = (vo.is3D)?sX-((Math.abs(xHeight)/2)+(this.bottom3DGap/3)):sX-(Math.abs(xHeight)/2);
							}else{
								cSX = (vo.is3D)?sX+((Math.abs(xHeight)/2)-(this.bottom3DGap/3)):sX+(Math.abs(xHeight)/2);
							}
						}else if( cPosition == 'inside_bottom' ){
							if( d[i][j] >= 0 ){
								cSX = (vo.is3D)?sX-(this.bottom3DGap/3)+1:sX;
							}else{
								ctx.textAlign = 'right';
								cSX = (vo.is3D)?sX-(this.bottom3DGap/3):sX;
							}
						}
						
						if( cValueType == 'value' ){
							cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
						}else if( cValueType == 'percentage' && vo.stack100Percent ){
							cText = (calcData != 0)?this.formatter(calcData, vo.yAxis.format)+'%':'';
						}else if( cValueType == 'all' && vo.stack100Percent ){
							cText = ((d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'')+((calcData != 0)?'('+this.formatter(calcData, vo.yAxis.format)+'%)':'');
						}else{
							cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
						}
						
						ctx.fillText(cText, cSX, cSY);
					}
					sX += xHeight;
			
				}
				
				if( csOn ){
					ctx.textBaseline 	= 'middle';
					ctx.fillStyle 	= csFontColor;
					ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
					cSY 			= (barStart+barWidth/2)+3;
					if( csPosition == 'external' ){
						if( this.aSumData[i-1] < 0 ){
							ctx.textAlign = 'right';
							csSX = (vo.is3D)?sX-(this.bottom3DGap/2):sX-3;
						}else{
							ctx.textAlign = 'left';
							csSX = sX+1;
						}
					}
					csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
					ctx.fillText(csText, csSX, cSY);
				}
				
				sY = sY - yg;
			}
			
		},
		drawStackedBar3D : function( ctx, i, j, barStart, barWidth, xHeight, xZero, drawTop ){
			
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var y = barStart+barWidth-1.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// bar 옆면.
			var grd=ctx.createLinearGradient(x, barStart, xZero, barStart);
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(xZero, barStart);
			ctx.lineTo(x, barStart);
			ctx.lineTo(x+5, barStart-5);
			ctx.lineTo(xZero+5, barStart-5);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// bar 윗면.
			if( drawTop ){
				var grd3=ctx.createLinearGradient(x+8, y, x, y); 
				grd3.addColorStop(0.2,color);  
				grd3.addColorStop(1,dcolor);
				if( xZero > x ){
					grd3 = dcolor;
					x = xZero-0.5;
				}
				ctx.beginPath();
				ctx.moveTo(x, barStart);
				ctx.lineTo(x, y+1);
				ctx.lineTo(x+5, y-5);
				ctx.lineTo(x+5, barStart-5);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = grd3;
				ctx.fill();
			}
			
			var grd2=ctx.createLinearGradient( xZero+xHeight, barStart, xZero, barStart); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(xZero, parseInt(barStart,10), xHeight, parseInt(barWidth,10));
		},
		drawStackedBar3DCylinder : function( ctx, i, j, barStart, barWidth, xHeight, xZero, drawTop ){
			
			barStart = barStart+(this.bottom3DGap/4);
			xZero = xZero+(this.bottom3DGap/4);
			var harf = (this.bottom3DGap/4)/2;
			var vo = this.options;
			var color, lcolor, dcolor, grd, bottomColor;
			xZero -= (this.bottom3DGap/2);
			var x = xZero+xHeight-0.5;
			var y = barStart+barWidth-1.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// bar 앞면.
			var grd2=ctx.createLinearGradient( xZero, barStart, xZero, barStart+barWidth );
			grd2.addColorStop(0,dcolor); 
			grd2.addColorStop(0.15,'#ffffff'); 
			grd2.addColorStop(0.25,lcolor); 
			grd2.addColorStop(0.55,color);
			grd2.addColorStop(0.83,dcolor); 
			grd2.addColorStop(0.93,lcolor);
			ctx.fillStyle = grd2;
			ctx.fillRect(xZero+harf, parseInt(barStart,10), xHeight, parseInt(barWidth,10));
			
			// bar 아래면
			bottomColor = grd2;
			ctx.beginPath();
			ctx.fillStyle = bottomColor;
			if( xZero > x ){
				this._drawEllipse(ctx,xHeight+xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10));
			}else{
				this._drawEllipse(ctx,xZero, parseInt(barStart,10), harf*2, parseInt(barWidth,10));
			}
			
			if( drawTop ){
				// bar 윗면.
				var grd3=ctx.createLinearGradient(x, y, x+harf, y); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( xZero > x ){
					grd3 = dcolor;
					x = xZero-0.5;
				}
				ctx.beginPath();
				ctx.fillStyle = grd3;
				this._drawEllipse(ctx,x,barStart,harf*2,parseInt(barWidth,10)-1);
			}
			
		},
		setSelectStackedBarPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			var tempI=len-1;  
			for( var i=0;i<len;i++ ) {
				
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x-(this.bottom3DGap/4);
					var y = this.coordinate[i][j].y+(this.bottom3DGap/4);
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					
					if( y < my && my < height ) {
						if( 0 > width ) {
							if( x > mx && mx > x+width ) {
								pointX = x+width + gap;
								pointY = y - gap;
								this.drawTooltip( e, [tempI,j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i],[j,tempI]);
								selectFlag = true;
							}
						}else{
							if( width+x > mx && mx > x ) {
								pointX = x+width + gap;
								pointY = y - gap;
								this.drawTooltip( e, [tempI,j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i],[j,tempI]);
								selectFlag = true;
							}
						}
					}
					
				}
				tempI--;
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		canvas_event_func_stackedBar : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectStackedBarPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectStackedBarPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}
		}
	});

	GLChart.SingleYCombination = function(){
		GLChart.call(this, arguments);
		this.aSaveColumnCoordValue = [];
		this.aSaveLineCoordValue = [];
		
		this.iSingleYpointerWidth = 15;
		this.isColumn = false;
		
		this.options = {
			type : 'singleYCombination'
			// column-----------------------------------------------------------------------------------
			,columnOuterGap : 50
			,columnShadow : false
			// columnText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			,columnText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnSumText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnIsStacked : false
			// line-------------------------------------------------------------------------------------
			,lineWidth : 2
			,lineShadow : false
			,lineType : 'normal'	// 'normal', 'curve', 'step'
			,linePointSize : 3
			,linePointType : 'circle'	// circle, rectangle, diamond, upTriangle, downTriangle, star
			,linePointStep : 1
			// area-------------------------------------------------------------------------------------
			,areaOpacity : 0.3
			,series : null
			
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
	};
	GLChart.SingleYCombination.prototype = new GLChart([]);
	GLChart.extend(GLChart.SingleYCombination, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawSingleYCombinationChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
		},
		drawSingleYCombinationChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item2.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item3.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item2, this.graphics_item2, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item3, this.graphics_item3, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawSingleYCombination();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var ctx2 = this.graphics_item2;
			var ctx3 = this.graphics_item3;
			var vo = this.options;
			var singleY = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var th;
			
			this.drawAxis();	
			this.calcSingleYCombination();	
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			ctx2.save();
			ctx3.save();
			
			singleY.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				if(vo.is3D){
					th = singleY.yZero+(singleY.bottom3DGap/2);
				}else{
					th = singleY.yZero;
				}	
				th = th-(th*h);
				
				ctx2.save();
				ctx2.translate(0, th);
				ctx2.scale(1, h);
				singleY.redrawColumnSameValue(h);
				ctx2.restore();
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				ctx3.save();
				ctx3.translate(0, th);
				ctx3.scale(1, h);
				singleY.redrawLineSameValue();
				ctx.restore();
				ctx3.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,singleY.sWidth,singleY.sHeight);
					singleY.clearRect( singleY.oCanvas_item, ctx, singleY.sWidth, singleY.sHeight);
					ctx2.restore();
					//ctx2.clearRect(0,0,singleY.sWidth,singleY.sHeight);
					singleY.clearRect( singleY.oCanvas_item2, ctx2, singleY.sWidth, singleY.sHeight);
					ctx3.restore();
					//ctx3.clearRect(0,0,singleY.sWidth,singleY.sHeight);
					singleY.clearRect( singleY.oCanvas_item3, ctx3, singleY.sWidth, singleY.sHeight);
					singleY.drawSingleYCombination();
					window.clearInterval(singleY.animationInst);
					
					if( singleY.options.xRange.on ){
						singleY.drawRange();
					}
				}
			},50);
			
		},
		calcSingleYCombination : function(){
			if( this.options.columnIsStacked ){
				this.calcStackedColumnData();
			}else{
				this.calcColumnData();
			}	
			this.calcLineData();
		},
		calcColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / this.seriesColumnLen;
			var columnStart = sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * this.seriesColumnLen )) / 2;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1]['type'] == 'column' ) {
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
						}else{
							yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}
						
						if( vo.is3D ){
							this.calcColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							this.aSaveColumnCoordValue[i-1].push([columnStart, yZero, columnWidth, yHeight, grd, strokeColor]);
						}
						
						columnStart = columnStart + columnWidth;
					}else{
						this.aSaveColumnCoordValue[i-1].push([]);
					}
				}
				
				sX = sX + xg;
			}
			
		},
		calcColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart += 2;
			columnStart = columnStart-(this.bottom3DGap/4);
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
		},
		calcStackedColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			var stackedFirst	= true;
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1].type == 'column' ){
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
						}else{
							yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}
						
						if( vo.is3D ){
							if( this.aSumData[i-1] < 0 ){
								if( stackedFirst ){
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
								}else{
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
								}
								stackedFirst = false;
							}else{
								if( j==columnCnt-1 ){
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
								}else{
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
								}
							}	
						}else{
						
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							this.aSaveColumnCoordValue[i-1].push([columnStart, sY, columnWidth, yHeight, grd, strokeColor]);
						}
						
						sY = sY+yHeight;
					}else{
						this.aSaveColumnCoordValue[i-1].push([]);
					}
				}
				
				sX = sX + xg;
			}
			
		},
		calcStackedColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero, drawTop ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			if( drawTop ){
				this.aSaveColumnCoordValue[i-1].push([
														[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
														,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
														,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
													]);
			}else{
				this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[0,0,0,0,0,0,0,0,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
			}
		},
		calcLineData : function(){
			this.drawLine('calc');
		},
		redrawColumnSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var val				= this.aSaveColumnCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/2)/v);
			
			
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<xCnt; i++ ){
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1]['type'] == 'column' ) {
						if( vo.is3D && val[i-1][j-1][2][3] != 0 ){
							y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
							calcVal = val[i-1][j-1];
							// column 옆면.
							ctx.beginPath();
							ctx.moveTo(calcVal[0][0], calcVal[0][1]);
							ctx.lineTo(calcVal[0][2], calcVal[0][3]-cv);
							ctx.lineTo(calcVal[0][4], calcVal[0][5]-cv);
							ctx.lineTo(calcVal[0][6], calcVal[0][7]);
							ctx.lineCap = calcVal[0][8];
							ctx.closePath();
							ctx.fillStyle = calcVal[0][9];
							ctx.fill();
							// column 윗면.
							ctx.beginPath();
							ctx.moveTo(calcVal[1][0], calcVal[1][1]);
							ctx.lineTo(calcVal[1][2], calcVal[1][3]);
							ctx.lineTo(calcVal[1][4], calcVal[1][5]-cv);
							ctx.lineTo(calcVal[1][6], calcVal[1][7]-cv);
							ctx.lineCap = calcVal[1][8];
							ctx.closePath();
							ctx.fillStyle = calcVal[1][9];
							ctx.fill();
							// column 앞면
							ctx.fillStyle = calcVal[2][4];
							ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
							
						}else{
							y = val[i-1][j-1][1];
							ctx.fillStyle = val[i-1][j-1][4];
							ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
						}
					}
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		redrawLineSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item3;
			var val			= this.aSaveLineCoordValue;
			var lineCnt		= this.aData[0].length;
			var len			= val.length;
			var xg 			= this.calculatedMargins.w / (this.aData.length - 1);
			
			var lineWidth	= vo.lineWidth;
			var lineType	= vo.lineType;
			var linePointSize= vo.linePointSize;
			var linePointType= vo.linePointType;
			var linePointStep= vo.linePointStep;
			var areaOpacity = vo.areaOpacity;
			
			ctx.shadowColor="rgba(0, 0, 0, 0)";
			ctx.shadowOffsetX=0;
			ctx.shadowOffsetY=0;
			ctx.shadowBlur=0;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item3, ctx, this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			
			for( var j=1; j<lineCnt; j++ ) {
				if( vo.series[j-1]['type'] == 'line' || vo.series[j-1]['type'] == 'area' ) {
				
					lineWidth	= vo.series[j-1]['lineWidth'] || vo.lineWidth;
					lineType	= vo.series[j-1]['lineType'] || vo.lineType;
					linePointSize= vo.series[j-1]['pointSize'] || vo.linePointSize;
					linePointType= vo.series[j-1]['pointType'] || vo.linePointType;
					linePointStep= vo.series[j-1]['pointStep'] || vo.linePointStep;
					areaOpacity = vo.series[j-1]['areaOpacity'] || vo.areaOpacity;
					
					if(vo.series[j-1]['type'] == 'line'){
						ctx = this.graphics_item3;
					}else{
						ctx = this.graphics_item;
					}
				
					ctx.beginPath();
					len	= val[j-1].length;
					for( var i=0;i<len;i++ ){
						if( lineType == 'curve' ) {
							if( i==0 ){
								ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
							}else{
								ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
							}
						}else if( lineType == 'step' ) {
							if( i==0 ){
								ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
							}else{
								ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
								ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
							}
							
						}else{
							if( i==0 ){
								ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
							}else{
								ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							}
						}
					}
					ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
					ctx.lineWidth = lineWidth;
					ctx.stroke();
					ctx.lineWidth = 1;
					
					if(vo.series[j-1]['type'] == 'area'){
						if(vo.is3D){
							ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2)-(this.bottom3DGap/4), this.yZero);
							ctx.lineTo(this.calculatedMargins.x+(xg/2)-(this.bottom3DGap/4), this.yZero);
						}else{
							ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2), this.yZero);
							ctx.lineTo(this.calculatedMargins.x+(xg/2), this.yZero);
						}	
						ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], areaOpacity);
						ctx.fill();
					}
					
				}
			}
		},
		drawSingleYCombination : function(){
			if( this.options.columnIsStacked ){
				this.drawStackedColumn();
			}else{
				this.drawColumn();
			}	
			this.drawLine();
		},
		drawColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var cSX, cSY, cText;
			var yZero = this.yZero;

			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / this.seriesColumnLen;
			var columnStart = sX + (xg - columnWidth) / 2;
			var tempColumnStart;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=1;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * this.seriesColumnLen )) / 2;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1]['type'] == 'column' ) {
						this.isColumn = true;
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
						}else{
							yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}
						
						if( vo.is3D && yHeight != 0 ){
							this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, yZero, true);
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							
							if( yHeight != 0 ){
								ctx.strokeStyle = strokeColor;
								ctx.lineWidth = 1; 
								ctx.strokeRect(parseInt(columnStart,10)+0.5, yZero, parseInt(columnWidth,10)-2.5, yHeight-0.5);
							}
							ctx.fillStyle = grd;
							ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10)-1.5, yHeight);
						}
						
						if( cOn ){
							tempColumnStart = (vo.is3D)?columnStart-(this.bottom3DGap/4):columnStart;
							ctx.textAlign 	= 'center';
							ctx.fillStyle 	= cFontColor;
							ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
							cSX 			= tempColumnStart+columnWidth/2;
							if( cPosition == 'external' ){
								if( d[i][j] < 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}else{
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}
							}else if( cPosition == 'inside_top' ){
								if( d[i][j] <= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = yZero+yHeight+1;
								}
							}else if( cPosition == 'inside_middle' ){
								if( d[i][j] == 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}else if( d[i][j] < 0 ){
									ctx.textBaseline = 'middle';
									cSY = yZero+(Math.abs(yHeight)/2);
								}else{
									ctx.textBaseline = 'middle';
									cSY = yZero-(Math.abs(yHeight)/2);
								}
							}else if( cPosition == 'inside_bottom' ){
								if( d[i][j] >= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = yZero+1;
								}
							}
							if( vo.is3D ){
								cSY += (this.bottom3DGap/2);
							}
							cText = this.formatter(d[i][j], vo.yAxis.format);
							ctx.fillText(cText, cSX, cSY);
						}	
						
						// 좌표저장
						oCoor = {
							  x:(vo.is3D)?columnStart-(this.bottom3DGap/4):columnStart
							  ,y:yZero
							  ,width:parseInt(columnWidth,10)-1.5
							  ,height:yHeight
							};
						aColumn.push(oCoor);
				
						columnStart = columnStart + columnWidth;
					}else{
						// 좌표저장
						oCoor = {
							  x:0
							  ,y:0
							  ,width:0
							  ,height:0
							};
						aColumn.push(oCoor);
					}
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawColumn3D : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero, drawTop ){
			columnStart += 2;
			columnStart = columnStart-(this.bottom3DGap/4);
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(x, yZero);
			ctx.lineTo(x+10, yZero-10);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(x, y);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// column 윗면.
			if( drawTop ){
				var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( yZero < y ){
					grd3 = dcolor;
					y = yZero;
				}
				ctx.beginPath();
				ctx.moveTo(columnStart, y);
				ctx.lineTo(x, y);
				ctx.lineTo(x+10, y-10);
				ctx.lineTo(columnStart+10, y-10);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = grd3;
				ctx.fill();
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight);
		},
		drawStackedColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, nextSY, eX, eY, xg, yg, yHeight = null, nextYHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var csOn			= vo.columnSumText.on;
			var csPosition		= vo.columnSumText.position;
			var csFontSize		= vo.columnSumText.fontSize;
			var csFontName		= vo.columnSumText.fontName;
			var csFontColor		= vo.columnSumText.color;
			var cSX, cSY, cText, csSY, csText;
			var yZero = this.yZero;
			var stackedFirst	= true;
			
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				nextSY = yZero;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1].type == 'column' ){
						this.isColumn = true;
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
						}else{
							yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}
						
						if( vo.is3D && yHeight != 0 ){
							if( this.aSumData[i-1] < 0 ){
								if( stackedFirst ){
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, true);
								}else{
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, false);
								}
								stackedFirst = false;
							}else{
								if( j==columnCnt-1 ){
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, true);
								}else{
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, true);
								}
							}	
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							
							ctx.fillStyle = grd;
							ctx.fillRect(parseInt(columnStart,10), sY, parseInt(columnWidth,10)-1.5, yHeight);
						}
						
						if( vo.columnConnectLine && i < xCnt-1 ){
							if( this.calculatedMargins.y - yZero == 0 ){
								nextYHeight = (this.calculatedMargins.h * d[i+1][j]) / this.ranges.ymin;
							}else{
								nextYHeight = -((yZero - this.calculatedMargins.y) * d[i+1][j]) / this.ranges.ymax;
							}
							
							yHeight = isNaN(yHeight)?0:yHeight;
							nextYHeight = isNaN(nextYHeight)?0:nextYHeight;
						
							ctx.beginPath();
							ctx.strokeStyle = this.adjustBrightness(vo.colors[(j-1)%vo.colors.length], 25);
							if( vo.is3D ){
								ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight+(this.bottom3DGap/2)+1.5);
								ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2)+1.5, nextSY+nextYHeight+(this.bottom3DGap/2)+1.5 );
							}else{
								ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight);
								ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2), nextSY+nextYHeight );
							}	
							ctx.lineWidth = vo.columnConnectlineThickness;
							ctx.stroke();
						}
						
						// 좌표저장
						oCoor = {
							  x:columnStart
							  ,y:sY
							  ,width:parseInt(columnWidth,10)-1.5
							  ,height:yHeight
							};
						aColumn.push(oCoor);
				
						sY = sY+yHeight;
						nextSY += nextYHeight;
					}else{
						// 좌표저장
						oCoor = {
							  x:0
							  ,y:0
							  ,width:0
							  ,height:0
							};
						aColumn.push(oCoor);
					}
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
			sX = this.calculatedMargins.x;
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - columnWidth) / 2;
				sY = yZero;
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1].type == 'column' ){
						if( this.calculatedMargins.y - yZero == 0 ){
							yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
						}else{
							yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}
						
						if( cOn ){
							ctx.textAlign 	= 'center';
							ctx.fillStyle 	= cFontColor;
							ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
							cSX 			= (vo.is3D)?(columnStart+columnWidth/2)-(this.bottom3DGap/4):columnStart+columnWidth/2;
							if( cPosition == 'external' ){
								if( d[i][j] < 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else{
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}
							}else if( cPosition == 'inside_top' ){
								if( d[i][j] <= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = sY+yHeight+1;
								}
							}else if( cPosition == 'inside_middle' ){
								if( d[i][j] == 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else if( d[i][j] < 0 ){
									ctx.textBaseline = 'middle';
									cSY = sY+(Math.abs(yHeight)/2);
								}else{
									ctx.textBaseline = 'middle';
									cSY = sY-(Math.abs(yHeight)/2);
								}
							}else if( cPosition == 'inside_bottom' ){
								if( d[i][j] >= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = sY+1;
								}
							}
							if( vo.is3D ){
								cSY += (this.bottom3DGap/2);
							}
							cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
							ctx.fillText(cText, cSX, cSY);
						}
						
						sY = sY+yHeight;
					}
				}
				
				if( csOn ){
					ctx.textAlign 	= 'center';
					ctx.fillStyle 	= csFontColor;
					ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
					cSX 			= (vo.is3D)?(columnStart+columnWidth/2)-(this.bottom3DGap/4):columnStart+columnWidth/2;
					if( csPosition == 'external' ){
						if( this.aSumData[i-1] < 0 ){
							ctx.textBaseline = 'top';
							csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+3:sY+3;
						}else{
							ctx.textBaseline = 'bottom';
							csSY = sY-1;
						}
					}
					csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
					ctx.fillText(csText, cSX, csSY);
				}
				
				sX = sX + xg;
			}	
			
		},
		drawLine : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aData;
			
			var lineWidth	= vo.lineWidth;
			var lineType	= vo.lineType;
			var linePointSize= vo.linePointSize;
			var linePointType= vo.linePointType;
			var linePointStep= vo.linePointStep;
			var areaOpacity = vo.areaOpacity;
			
			this.coordinate2 = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null;
			
			var clacHeight = this.calculatedMargins.h;
			  
			if( vo.is3D ){
				clacHeight = clacHeight - this.bottom3DGap;
			} 
			
			for( var j=1; j<lineCnt; j++ ) {
				this.aSaveLineCoordValue.push([]);
				if( vo.series[j-1]['type'] == 'line' || vo.series[j-1]['type'] == 'area' ) {
				
					lineWidth	= vo.series[j-1]['lineWidth'] || vo.lineWidth;
					lineType	= vo.series[j-1]['lineType'] || vo.lineType;
					linePointSize= vo.series[j-1]['pointSize'] || vo.linePointSize;
					linePointType= vo.series[j-1]['pointType'] || vo.linePointType;
					linePointStep= vo.series[j-1]['pointStep'] || vo.linePointStep;
					areaOpacity = vo.series[j-1]['areaOpacity'] || vo.areaOpacity;
				
					if(vo.series[j-1]['type'] == 'line'){
						ctx = this.graphics_item3;
					}else{
						ctx = this.graphics_item;
					}
				
					sX = this.calculatedMargins.x;
					sY = clacHeight + this.calculatedMargins.y;
					eX = sX;
					eY = this.calculatedMargins.y;
					xg = this.calculatedMargins.w / (pointCnt - 1);
					yg = clacHeight / (this.yLabels.length - 1);
					sX = sX + (xg/2);
					sX = (vo.is3D)?sX-(this.bottom3DGap/4):sX;
					
					if( vo.lineShadow && lineWidth != 1 ) {
						ctx.shadowColor="rgba(0, 0, 0, 0.5)";
						ctx.shadowOffsetX=1;
						ctx.shadowOffsetY=1;
						ctx.shadowBlur=2;
					}
					
					ctx.beginPath();
					
					if( lineType == 'curve' || lineType == 'step' ) {
					  var fx = null;
					  var fy = null;
					  var rx = null;
					  var ry = null;
					  var fH = null;
					  var rH = null;
					  var divideVal = 3;
					  var tempDivideVal = 0;
					  var tempDivideVal_2 = 0;
					  var tempDivideVal2 = 0;
					  var tempDivideVal3 = 0;
					  var tempDivideVal3_2 = 0;
					  var tempDivideVal4 = 0;
					  
					}
					
					for(var i=1;i<pointCnt;i++) {
						if( vo.yAxis.minValue == 'auto' ){
							yTempHeight = (clacHeight*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							yHeight = (clacHeight - yTempHeight)+this.calculatedMargins.y;
						}else{
							yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
						}
					  
						// draw bezierCurve 
						if( lineType == 'curve' ){
							if( i==1 ){
								ctx.moveTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}else if(i==pointCnt-1){
								rx = sX;
								ry = yHeight;
								if( vo.yAxis.minValue == 'auto' ){
									tempDivideVal3  = (clacHeight*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal3_2  = (clacHeight*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								}else{
									yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
								}
								tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
								tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
								if( tempDivideVal3 < 0 ){
									fy = fy - tempDivideVal4;
								}else{
									fy = fy + tempDivideVal4;
								}
								ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
							}else{
								rx = sX-(xg/divideVal);
								ry = yHeight;
								
								if( vo.yAxis.minValue == 'auto' ){
									tempDivideVal   = (clacHeight*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal_2 = (clacHeight*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal3  = (clacHeight*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
									tempDivideVal3_2  = (clacHeight*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								}else{
									yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
								}
								tempDivideVal = tempDivideVal_2 - tempDivideVal;
								tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
								tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
								tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
								
								if( tempDivideVal < 0 ){
									ry = ry + tempDivideVal2;
								}else{
									ry = ry - tempDivideVal2;
								}
								if( tempDivideVal3 < 0 ){
									fy = fy - tempDivideVal4;
								}else{
									fy = fy + tempDivideVal4;
								}
								ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
							}
						}else if( lineType == 'step' ){
							if( i==1 ){
								ctx.moveTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}else{
								ctx.lineTo(sX, fy);
								ctx.lineTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
							}
						}else{
							if( i==1 ){
								ctx.moveTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}else{
								ctx.lineTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}	
						}
					
						fx = (i==1)?sX:(sX+(xg/divideVal));
						fy = yHeight;
						sX = sX + xg;
						eX = sX;
					}
					ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
					ctx.lineWidth = lineWidth;
					if( !arguments[0] ){
						ctx.stroke();
					}	
					ctx.lineWidth = 1;
					
					if(vo.series[j-1]['type'] == 'area' && !arguments[0]){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
						if(vo.is3D){
							ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2)-(this.bottom3DGap/4), this.yZero);
							ctx.lineTo(this.calculatedMargins.x+(xg/2)-(this.bottom3DGap/4), this.yZero);
						}else{
							ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2), this.yZero);
							ctx.lineTo(this.calculatedMargins.x+(xg/2), this.yZero);
						}	
						ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], areaOpacity);
						ctx.fill();
					}
					
					// draw line point ================================
					//if( linePointSize != 0 && !arguments[0] ) {
					if( !arguments[0] ) {
						sX = this.calculatedMargins.x;
						xg = this.calculatedMargins.w / (pointCnt - 1);
						sX = sX + (xg/2);
						sX = (vo.is3D)?sX-(this.bottom3DGap/4):sX;
						this.drawLinePointer(ctx, sX, xg, pointCnt, j, lineWidth, clacHeight, linePointSize, linePointType, linePointStep);
					}
					// draw line point ================================
				}else{
					if( !arguments[0] ) {
						var oCoor 		= null;
						var aColumn 	= [];
						for(var i=1;i<pointCnt;i++) {
							// 좌표저장
							oCoor = {
								  x:null
								  ,y:null
								  ,width:null
								  ,height:null
								};
							aColumn.push(oCoor);
						}
						this.coordinate2.push(aColumn); 
					}
				}
			}
			
			if( vo.lineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawLinePointer : function( ctx, sX, xg, pointCnt, j, lineWidth, clacHeight, linePointSize, linePointType, linePointStep ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var pointType	= linePointType;
			var pointSize	= linePointSize;
			var pointStep	= linePointStep;
			var pointColor	= vo.colors[(j-1)%vo.colors.length];
			var starHeight	= null;
			
			if( linePointSize == 0 ) {
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (clacHeight*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (clacHeight - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					// 좌표저장
					oCoor = {
						  x:sX
						  ,y:yHeight
						  ,width:this.iSingleYpointerWidth
						  ,height:this.iSingleYpointerWidth
						};
					aColumn.push(oCoor);
					
					sX = sX + xg;
				}
				this.coordinate2.push(aColumn); 
				
				return;
			}
			
			for(var i=1;i<pointCnt;i++) {
				if( vo.yAxis.minValue == 'auto' ){
					yTempHeight = (clacHeight*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
					yHeight = (clacHeight - yTempHeight)+this.calculatedMargins.y;
				}else{
					yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
				}
				
				if( i==1 ){
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
				}
				
				if( (i%pointStep) == 0 ){
				
					ctx.beginPath();
					ctx.lineWidth = lineWidth;
					if( pointType == 'circle' ){
						ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
					}else if( pointType == 'rectangle' ){
						ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.lineWidth = lineWidth/2;
					}else if( pointType == 'diamond' ){
						ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
						ctx.lineTo((sX-pointSize), yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
					}else if( pointType == 'upTriangle' ){
						ctx.moveTo((sX-pointSize), yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize), yHeight + pointSize);
					}else if( pointType == 'downTriangle' ){
						ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize), yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
					}else if( pointType == 'star' ){
						starHeight = yHeight-pointSize/1.2;
						ctx.moveTo(sX, starHeight-pointSize/5);
						ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
						ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX, starHeight-pointSize/5)
					}
					ctx.closePath();
					ctx.fillStyle = '#ffffff';
					ctx.strokeStyle = pointColor;
					ctx.stroke();
					ctx.fill();
				
				}
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:yHeight
					  ,width:this.iSingleYpointerWidth
					  ,height:this.iSingleYpointerWidth
					};
				aColumn.push(oCoor);
				
				sX = sX + xg;
			}
			this.coordinate2.push(aColumn); 
		},
		setSelectsingleYCombinationPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			var selectArray = [];  
			var selectArray2 = [];
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
							}
						}
					}
				}
			}
			
			
			var len = this.coordinate2.length;
			try{var len2= this.coordinate2[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate2[i][j].x - 7;
					var y = this.coordinate2[i][j].y - 7;
					var width = this.coordinate2[i][j].width;
					var height = y + this.coordinate2[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPointSingleYLine([j,i]);
								selectFlag = true;
								
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPointSingleYLine([j,i]);
								selectFlag = true;
								
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		
		setSelectsingleYCombinationPointTight : function(e){
			var vo 			= this.options;
			var half		= Math.round(this.iSingleYpointerWidth/2);
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			
			
			var xIndex = Math.round(((mx - this.calculatedMargins.x) * (this.aData.length-1) ) / this.calculatedMargins.w);
			var sxIndex = Math.round(((mx - this.calculatedMargins.x - half) * (this.aData.length-1) ) / this.calculatedMargins.w);
			var exIndex = Math.round(((mx - this.calculatedMargins.x + half) * (this.aData.length-1) ) / this.calculatedMargins.w);
			//document.getElementById('chartCon03_text').innerHTML = mx+', '+my+', '+xIndex+", "+sxIndex+ ", "+exIndex;
			
			var selX = null;
			var selData = null;
			
			if( sxIndex < 0 ){ sxIndex = 0; }
			if( exIndex > (this.aData.length-1) ){ exIndex = (this.aData.length-1); }
			var indexLen = exIndex - sxIndex;
			
			var len = this.coordinate2.length;
			
			for( var i=0;i<len;i++ ) {
				for( var j=sxIndex; j<(sxIndex+indexLen); j++ ){
					var x = this.coordinate2[i][j].x - half;
					var y = this.coordinate2[i][j].y - half;
					var width = this.coordinate2[i][j].width;
					var height = y + this.coordinate2[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+half + gap;
								pointY = height - gap-5;
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [ e, [j, i], [pointX,pointY], gap ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i], [pointX,pointY], gap ];
									}
								}
								
								//this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								//this.drawTooltipPointSingleYLine([j,i]);
								selectFlag = true;
								
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+half + gap;
								pointY = height - gap-5;
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [ e, [j, i], [pointX,pointY], gap ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i], [pointX,pointY], gap ];
									}
								}
								
								//this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								//this.drawTooltipPointSingleYLine([j,i]);
								selectFlag = true;
								
							}
						}
					}
				}
			}
			
			if( selX ){
				this.drawTooltip( selData[0], selData[1], selData[2], selData[3] );
				this.drawTooltipPointSingleYLine(selData[1]);
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		
		drawTooltipPointSingleYLine : function( aSelect, aColorIdx ){
			if( !this.options.tooltip ){return;}
		
			// 원그리기**********************************************************
			var ctx = this.graphics_event;
			var vo = this.options;
			var xx = this.coordinate2[aSelect[1]][aSelect[0]].x;
			var yy = this.coordinate2[aSelect[1]][aSelect[0]].y; 
			var w = this.coordinate2[aSelect[1]][aSelect[0]].width; 
			var h = this.coordinate2[aSelect[1]][aSelect[0]].height; 
			var color = vo.colors[aSelect[1] % vo.colors.length];
			var pointSize = 5;
			
			//ctx.clearRect(0,0,this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_event, ctx, this.sWidth, this.sHeight);
			
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize-1,0,Math.PI*2,false);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,1,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			ctx.closePath();
		},
		setSelectsingleYCombinationPoint_click : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								//this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								//this.drawTooltipPoint([j,i]);
								this.returnEventData( e, [i, j] );
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								//this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								//this.drawTooltipPoint([j,i]);
								this.returnEventData( e, [i, j] );
								selectFlag = true;
							}
						}
					}
				}
			}
			
			var len = this.coordinate2.length;
			try{var len2= this.coordinate2[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate2[i][j].x - 7;
					var y = this.coordinate2[i][j].y - 7;
					var width = this.coordinate2[i][j].width;
					var height = y + this.coordinate2[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								//this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								//this.drawTooltipPointSingleYLine([j,i]);
								this.returnEventData( e, [j, i] );
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								//this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								//this.drawTooltipPointSingleYLine([j,i]);
								this.returnEventData( e, [j, i] );
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
		},
		setSelectsingleYCombinationPointTight_click : function(e){
			var vo 			= this.options;
			var half		= Math.round(this.iSingleYpointerWidth/2);
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var xIndex = Math.round(((mx - this.calculatedMargins.x) * (this.aData.length-1) ) / this.calculatedMargins.w);
			var sxIndex = Math.round(((mx - this.calculatedMargins.x - half) * (this.aData.length-1) ) / this.calculatedMargins.w);
			var exIndex = Math.round(((mx - this.calculatedMargins.x + half) * (this.aData.length-1) ) / this.calculatedMargins.w);
			//document.getElementById('chartCon03_text').innerHTML = mx+', '+my+', '+xIndex+", "+sxIndex+ ", "+exIndex;
			
			var selX = null;
			var selData = null;
			
			if( sxIndex < 0 ){ sxIndex = 0; }
			if( exIndex > (this.aData.length-1) ){ exIndex = (this.aData.length-1); }
			var indexLen = exIndex - sxIndex;
			
			var len = this.coordinate2.length;
			  
			for( var i=0;i<len;i++ ) {
				for( var j=sxIndex; j<(sxIndex+indexLen); j++ ){
					var x = this.coordinate2[i][j].x - half;
					var y = this.coordinate2[i][j].y - half;
					var width = this.coordinate2[i][j].width;
					var height = y + this.coordinate2[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								
								//this.returnEventData( e, [j, i] );
								//selectFlag = true;
								
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [e, [j, i] ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i] ];
									}
								}
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								
								//this.returnEventData( e, [j, i] );
								//selectFlag = true;
								
								if( !selData ){
									selX = Math.abs((x+half) - mx);
									selData = [e, [j, i] ];
								}else{
									if( Math.abs((x+half) - mx) < selX ){
										selX = Math.abs((x+half) - mx);
										selData = [ e, [j, i] ];
									}
								}
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( selX ){
				this.returnEventData( selData[0], selData[1] );
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
		},
		canvas_event_func_sYCombi : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
			
				var xg = eThis.calculatedMargins.w / (eThis.aData.length - 1);
				if( !eThis.isColumn && eThis.iSingleYpointerWidth > xg ) {
					eThis.setSelectsingleYCombinationPointTight(e, chartElem);
				}else{
					eThis.setSelectsingleYCombinationPoint(e, chartElem);
				}
				
			}else if( e.type=='mousedown' ){
				//eThis.setSelectsingleYCombinationPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}else if( e.type=='click' ){
				var xg = eThis.calculatedMargins.w / (eThis.aData.length - 1);
				if( !eThis.isColumn && eThis.iSingleYpointerWidth > xg ) {
					eThis.setSelectsingleYCombinationPointTight_click(e, chartElem);
				}else{
					eThis.setSelectsingleYCombinationPoint_click(e, chartElem);
				}
			
				
			}
		}
	});
	
	GLChart.DualYCombination = function(){
		GLChart.call(this, arguments);
		this.aSaveColumnCoordValue = [];
		this.aSaveLineCoordValue = [];
		this.options = {
			type : 'dualYCombination'
			// column-----------------------------------------------------------------------------------
			,columnOuterGap : 50
			,columnShadow : false
			// columnText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			,columnText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnSumText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnIsStacked : false
			// line-------------------------------------------------------------------------------------
			,lineWidth : 2
			,lineShadow : false
			,lineType : 'normal'	// 'normal', 'curve', 'step'
			,linePointSize : 3
			,linePointStep : 1
			,linePointType : 'circle'	// circle, rectangle, diamond, upTriangle, downTriangle, star
			// area-------------------------------------------------------------------------------------
			,areaOpacity : 0.3
			,series : null
			
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
	};
	GLChart.DualYCombination.prototype = new GLChart([]);
	GLChart.extend(GLChart.DualYCombination, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawDualYCombinationChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
		},
		drawDualYCombinationChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item2.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item3.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item2, this.graphics_item2, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item3, this.graphics_item3, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawDualYCombination();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				this.drawCaptionText('y2Name');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var ctx2 = this.graphics_item2;
			var ctx3 = this.graphics_item3;
			var vo = this.options;
			var dualY = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var th;
			
			this.drawAxis();	
			this.calcDualYCombination();	
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			this.drawCaptionText('y2Name');
			ctx.save();
			ctx2.save();
			ctx3.save();
			
			dualY.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				if(vo.is3D){
					th = (dualY.calculatedMargins.y+dualY.calculatedMargins.h)-(dualY.bottom3DGap/2);
				}else{
					th = (dualY.calculatedMargins.y+dualY.calculatedMargins.h);
				}	
				th = th-(th*h);
				
				ctx2.save();
				ctx2.translate(0, th);
				ctx2.scale(1, h);
				//ctx2.clearRect(0,0,dualY.sWidth,dualY.sHeight);
				dualY.clearRect( dualY.oCanvas_item2, ctx2, dualY.sWidth, dualY.sHeight);
				dualY.redrawColumnSameValue(h);
				ctx2.restore();
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				ctx3.save();
				ctx3.translate(0, th);
				ctx3.scale(1, h);
				dualY.redrawLineSameValue();
				ctx.restore();
				ctx3.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,dualY.sWidth,dualY.sHeight);
					dualY.clearRect( dualY.oCanvas_item, ctx, dualY.sWidth, dualY.sHeight);
					ctx2.restore();
					//ctx2.clearRect(0,0,dualY.sWidth,dualY.sHeight);
					dualY.clearRect( dualY.oCanvas_item2, ctx2, dualY.sWidth, dualY.sHeight);
					ctx3.restore();
					//ctx3.clearRect(0,0,dualY.sWidth,dualY.sHeight);
					dualY.clearRect( dualY.oCanvas_item3, ctx3, dualY.sWidth, dualY.sHeight);
					dualY.drawDualYCombination();
					window.clearInterval(dualY.animationInst);
					
					if( dualY.options.xRange.on ){
						dualY.drawRange();
					}
				}
			},50);
			
		},
		calcDualYCombination : function(){
			if( this.options.columnIsStacked ){
				this.calcStackedColumnData();
			}else{
				this.calcColumnData();
			}	
			this.calcLineData();
		},
		calcColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			var y2Zero = this.y2Zero;
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / this.seriesColumnLen;
			var columnStart = sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * this.seriesColumnLen )) / 2;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1]['type'] == 'column' ) {
						if( vo.series[j-1]['parentYAxis'] == 'S' ) {
							yZero = y2Zero;
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin2;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax2;
							}
						}else{
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
						}
						
						if( vo.is3D ){
							this.calcColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							this.aSaveColumnCoordValue[i-1].push([columnStart, yZero, columnWidth, yHeight, grd, strokeColor]);
						}
						
						columnStart = columnStart + columnWidth;
					}else{
						this.aSaveColumnCoordValue[i-1].push([]);
					}
				}
				
				sX = sX + xg;
			}
			
		},
		calcColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart += 2;
			columnStart = columnStart-(this.bottom3DGap/4);
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
		},
		calcStackedColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			var y2Zero = this.y2Zero;
			var stackedFirst	= true;
			
			for( var j=1; j<columnCnt; j++ ){
				if( vo.series[j-1].type == 'column' && vo.series[j-1]['parentYAxis'] == 'S' ){
					yZero = y2Zero;
				}
			}
			
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1].type == 'column' ){
						if( vo.series[j-1]['parentYAxis'] == 'S' ) {
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin2;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax2;
							}
						}else{
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
						}
						
						if( vo.is3D ){
							if( this.aSumData[i-1] < 0 ){
								if( stackedFirst ){
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
								}else{
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, false);
								}
								stackedFirst = false;
							}else{
								if( j==columnCnt-1 ){
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
								}else{
									this.calcStackedColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, sY, true);
								}
							}	
						}else{
						
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							this.aSaveColumnCoordValue[i-1].push([columnStart, sY, columnWidth, yHeight, grd, strokeColor]);
						}
						
						sY = sY+yHeight;
					}else{
						this.aSaveColumnCoordValue[i-1].push([]);
					}
				}
				
				sX = sX + xg;
			}
			
		},
		calcStackedColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero, drawTop ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			if( drawTop ){
				this.aSaveColumnCoordValue[i-1].push([
														[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
														,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
														,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
													]);
			}else{
				this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[0,0,0,0,0,0,0,0,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
			}
		},
		calcLineData : function(){
			this.drawLine('calc');
		},
		redrawColumnSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var val				= this.aSaveColumnCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/2)/v);
			
			
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<xCnt; i++ ){
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1]['type'] == 'column' ) {
						if( vo.is3D && val[i-1][j-1][2][3] != 0 ){
							y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
							calcVal = val[i-1][j-1];
							// column 옆면.
							ctx.beginPath();
							ctx.moveTo(calcVal[0][0], calcVal[0][1]);
							ctx.lineTo(calcVal[0][2], calcVal[0][3]-cv);
							ctx.lineTo(calcVal[0][4], calcVal[0][5]-cv);
							ctx.lineTo(calcVal[0][6], calcVal[0][7]);
							ctx.lineCap = calcVal[0][8];
							ctx.closePath();
							ctx.fillStyle = calcVal[0][9];
							ctx.fill();
							// column 윗면.
							ctx.beginPath();
							ctx.moveTo(calcVal[1][0], calcVal[1][1]);
							ctx.lineTo(calcVal[1][2], calcVal[1][3]);
							ctx.lineTo(calcVal[1][4], calcVal[1][5]-cv);
							ctx.lineTo(calcVal[1][6], calcVal[1][7]-cv);
							ctx.lineCap = calcVal[1][8];
							ctx.closePath();
							ctx.fillStyle = calcVal[1][9];
							ctx.fill();
							// column 앞면
							ctx.fillStyle = calcVal[2][4];
							ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
							
						}else{
							y = val[i-1][j-1][1];
							ctx.fillStyle = val[i-1][j-1][4];
							ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
						}
					}
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		redrawLineSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item3;
			var val			= this.aSaveLineCoordValue;
			var lineCnt		= this.aData[0].length;
			var len			= val.length;
			var xg 			= this.calculatedMargins.w / (this.aData.length - 1);
			
			var lineWidth	= vo.lineWidth;
			var lineType	= vo.lineType;
			var linePointSize= vo.linePointSize;
			var linePointType= vo.linePointType;
			var linePointStep= vo.linePointStep;
			var areaOpacity = vo.areaOpacity;
			var yZero		= null;
			
			var clacHeight 	= this.calculatedMargins.h;
			if( vo.is3D ){
				clacHeight = clacHeight - this.bottom3DGap;
			} 
			
			ctx.shadowColor="rgba(0, 0, 0, 0)";
			ctx.shadowOffsetX=0;
			ctx.shadowOffsetY=0;
			ctx.shadowBlur=0;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item3, ctx, this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			
			for( var j=1; j<lineCnt; j++ ) {
				if( vo.series[j-1]['type'] == 'line' || vo.series[j-1]['type'] == 'area' ) {
				
					lineWidth	= vo.series[j-1]['lineWidth'] || vo.lineWidth;
					lineType	= vo.series[j-1]['lineType'] || vo.lineType;
					linePointSize= vo.series[j-1]['pointSize'] || vo.linePointSize;
					linePointType= vo.series[j-1]['pointType'] || vo.linePointType;
					linePointStep= vo.series[j-1]['pointStep'] || vo.linePointStep;
					areaOpacity = vo.series[j-1]['areaOpacity'] || vo.areaOpacity;
					
					if(vo.series[j-1]['type'] == 'line'){
						ctx = this.graphics_item3;
					}else{
						ctx = this.graphics_item;
					}
				
					ctx.beginPath();
					len	= val[j-1].length;
					for( var i=0;i<len;i++ ){
						if( lineType == 'curve' ) {
							if( i==0 ){
								ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
							}else{
								ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
							}
						}else if( lineType == 'step' ) {
							if( i==0 ){
								ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
							}else{
								ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
								ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
							}
							
						}else{
							if( i==0 ){
								ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
							}else{
								ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							}
						}
					}
					ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
					ctx.lineWidth = lineWidth;
					ctx.stroke();
					ctx.lineWidth = 1;
					
					if(vo.series[j-1]['type'] == 'area'){
						if( vo.series[j-1]['parentYAxis'] == 'S' ) {
							yZero = (!!this.y2Zero?this.y2Zero:clacHeight+this.calculatedMargins.y);
							if(vo.is3D){
								ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2)-(this.bottom3DGap/4), yZero);
								ctx.lineTo(this.calculatedMargins.x+(xg/2)-(this.bottom3DGap/4), yZero);
							}else{
								ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2), yZero);
								ctx.lineTo(this.calculatedMargins.x+(xg/2), yZero);
							}
						}else{
							yZero = (!!this.yZero?this.yZero:clacHeight+this.calculatedMargins.y);
							if(vo.is3D){
								ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2)-(this.bottom3DGap/4), yZero);
								ctx.lineTo(this.calculatedMargins.x+(xg/2)-(this.bottom3DGap/4), yZero);
							}else{
								ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2), yZero);
								ctx.lineTo(this.calculatedMargins.x+(xg/2), yZero);
							}
						}
						ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], areaOpacity);
						ctx.fill();
					}
					
				}
			}
		},
		drawDualYCombination : function(){
			if( this.options.columnIsStacked ){
				this.drawStackedColumn();
			}else{
				this.drawColumn();
			}	
			this.drawLine();
		},
		drawColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var cSX, cSY, cText;
			var yZero = this.yZero;
			var y2Zero = this.y2Zero;

			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / this.seriesColumnLen;
			var columnStart = sX + (xg - columnWidth) / 2;
			var tempColumnStart;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=1;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * this.seriesColumnLen )) / 2;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1]['type'] == 'column' ) {
						if(vo.series[j-1]['parentYAxis'] == 'S'){
							yZero = y2Zero;
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin2;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax2;
							}
						}else{
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
						}
						
						if( vo.is3D && yHeight != 0 ){
							this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, yZero, true);
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							
							if( yHeight != 0 ){
								ctx.strokeStyle = strokeColor;
								ctx.lineWidth = 1; 
								ctx.strokeRect(parseInt(columnStart,10)+0.5, yZero, parseInt(columnWidth,10)-2.5, yHeight-0.5);
							}
							ctx.fillStyle = grd;
							ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10)-1.5, yHeight);
						}
						
						if( cOn ){
							tempColumnStart = (vo.is3D)?columnStart-(this.bottom3DGap/4):columnStart;
							ctx.textAlign 	= 'center';
							ctx.fillStyle 	= cFontColor;
							ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
							cSX 			= tempColumnStart+columnWidth/2;
							if( cPosition == 'external' ){
								if( d[i][j] < 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}else{
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}
							}else if( cPosition == 'inside_top' ){
								if( d[i][j] <= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = yZero+yHeight+1;
								}
							}else if( cPosition == 'inside_middle' ){
								if( d[i][j] == 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero+yHeight-1;
								}else if( d[i][j] < 0 ){
									ctx.textBaseline = 'middle';
									cSY = yZero+(Math.abs(yHeight)/2);
								}else{
									ctx.textBaseline = 'middle';
									cSY = yZero-(Math.abs(yHeight)/2);
								}
							}else if( cPosition == 'inside_bottom' ){
								if( d[i][j] >= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = yZero-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = yZero+1;
								}
							}
							if( vo.is3D ){
								cSY += (this.bottom3DGap/2);
							}
							cText = this.formatter(d[i][j], vo.yAxis.format);
							ctx.fillText(cText, cSX, cSY);
						}	
						
						// 좌표저장
						oCoor = {
							  x:(vo.is3D)?columnStart-(this.bottom3DGap/4):columnStart
							  ,y:yZero
							  ,width:parseInt(columnWidth,10)-1.5
							  ,height:yHeight
							};
						aColumn.push(oCoor);
				
						columnStart = columnStart + columnWidth;
					}else{
						// 좌표저장
						oCoor = {
							  x:0
							  ,y:0
							  ,width:0
							  ,height:0
							};
						aColumn.push(oCoor);
					}
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawColumn3D : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero, drawTop ){
			columnStart += 2;
			columnStart = columnStart-(this.bottom3DGap/4);
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(x, yZero);
			ctx.lineTo(x+10, yZero-10);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(x, y);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// column 윗면.
			if( drawTop ){
				var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
				if( yZero < y ){
					grd3 = dcolor;
					y = yZero;
				}
				ctx.beginPath();
				ctx.moveTo(columnStart, y);
				ctx.lineTo(x, y);
				ctx.lineTo(x+10, y-10);
				ctx.lineTo(columnStart+10, y-10);
				ctx.lineCap = 'butt';
				ctx.closePath();
				ctx.fillStyle = grd3;
				ctx.fill();
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight);
		},
		drawStackedColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item2;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			var sX, sY, nextSY, eX, eY, xg, yg, yHeight = null, nextYHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var csOn			= vo.columnSumText.on;
			var csPosition		= vo.columnSumText.position;
			var csFontSize		= vo.columnSumText.fontSize;
			var csFontName		= vo.columnSumText.fontName;
			var csFontColor		= vo.columnSumText.color;
			var cSX, cSY, cText, csSY, csText;
			var yZero = this.yZero;
			var y2Zero = this.y2Zero;
			var stackedFirst	= true;
			
			for( var j=1; j<columnCnt; j++ ){
				if( vo.series[j-1].type == 'column' && vo.series[j-1]['parentYAxis'] == 'S' ){
					yZero = y2Zero;
				}
			}
			
			
			sX = this.calculatedMargins.x;
			sY = yZero;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = (xg * (100 - columnOuterGap)) / 100;
			var columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = (vo.is3D)?(sX + (xg - columnWidth) / 2)-(this.bottom3DGap/4):sX + (xg - columnWidth) / 2;
				sY = yZero;
				nextSY = yZero;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1].type == 'column' ){
						if(vo.series[j-1].parentYAxis == 'S'){
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin2;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax2;
							}
						}else{
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
						}
						
						if( vo.is3D && yHeight != 0 ){
							if( this.aSumData[i-1] < 0 ){
								if( stackedFirst ){
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, true);
								}else{
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, false);
								}
								stackedFirst = false;
							}else{
								if( j==columnCnt-1 ){
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, true);
								}else{
									this.drawColumn3D(ctx, i, j, columnStart+(this.bottom3DGap/4), columnWidth, yHeight, sY, true);
								}
							}	
						}else{
							color = vo.colors[(j-1)%vo.colors.length];
							strokeColor = this.adjustBrightness(color, -35);
							if( vo.theme.seriesGradientStyle+'' == '3' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -35);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.1,'#ffffff'); 
								grd.addColorStop(0.2,dcolor); 
								grd.addColorStop(0.55,color);
								grd.addColorStop(0.7,lcolor); 
								grd.addColorStop(0.73,lcolor); 
								grd.addColorStop(0.83,color); 
								grd.addColorStop(0.93,dcolor); 
							}else if( vo.theme.seriesGradientStyle+'' == '2' ){
								lcolor = this.adjustBrightness(color, 45);
								dcolor = this.adjustBrightness(color, -55);
								grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
								grd.addColorStop(0,dcolor); 
								grd.addColorStop(0.33,color); 
								grd.addColorStop(0.5,lcolor); 
								grd.addColorStop(0.68,color);
								grd.addColorStop(1,dcolor); 
							}else{
								grd = color;
							}
							
							ctx.fillStyle = grd;
							ctx.fillRect(parseInt(columnStart,10), sY, parseInt(columnWidth,10)-1.5, yHeight);
						}
						
						if( vo.columnConnectLine && i < xCnt-1 ){
							if(vo.series[j-1].parentYAxis == 'S'){
								if( this.calculatedMargins.y - yZero == 0 ){
									nextYHeight = (this.calculatedMargins.h * d[i+1][j]) / this.ranges.ymin2;
								}else{
									nextYHeight = -((yZero - this.calculatedMargins.y) * d[i+1][j]) / this.ranges.ymax2;
								}
							}else{
								if( this.calculatedMargins.y - yZero == 0 ){
									nextYHeight = (this.calculatedMargins.h * d[i+1][j]) / this.ranges.ymin;
								}else{
									nextYHeight = -((yZero - this.calculatedMargins.y) * d[i+1][j]) / this.ranges.ymax;
								}
							}
							
							yHeight = isNaN(yHeight)?0:yHeight;
							nextYHeight = isNaN(nextYHeight)?0:nextYHeight;
						
							ctx.beginPath();
							ctx.strokeStyle = this.adjustBrightness(vo.colors[(j-1)%vo.colors.length], 25);
							if( vo.is3D ){
								ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight+(this.bottom3DGap/2)+1.5);
								ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2)+1.5, nextSY+nextYHeight+(this.bottom3DGap/2)+1.5 );
							}else{
								ctx.moveTo(columnStart+columnWidth-1.5, sY+yHeight);
								ctx.lineTo( ((sX + xg) + (xg - columnWidth) / 2), nextSY+nextYHeight );
							}	
							ctx.lineWidth = vo.columnConnectlineThickness;
							ctx.stroke();
						}
						
						// 좌표저장
						oCoor = {
							  x:columnStart
							  ,y:sY
							  ,width:parseInt(columnWidth,10)-1.5
							  ,height:yHeight
							};
						aColumn.push(oCoor);
				
						sY = sY+yHeight;
						nextSY += nextYHeight;
					}else{
						// 좌표저장
						oCoor = {
							  x:0
							  ,y:0
							  ,width:0
							  ,height:0
							};
						aColumn.push(oCoor);
					}
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
			sX = this.calculatedMargins.x;
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - columnWidth) / 2;
				sY = yZero;
				
				for( var j=1; j<columnCnt; j++ ){
					if( vo.series[j-1].type == 'column' ){
						if(vo.series[j-1].parentYAxis == 'S'){
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin2;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax2;
							}
						}else{
							if( this.calculatedMargins.y - yZero == 0 ){
								yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
							}else{
								yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
						}
						
						if( cOn ){
							ctx.textAlign 	= 'center';
							ctx.fillStyle 	= cFontColor;
							ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
							cSX 			= (vo.is3D)?(columnStart+columnWidth/2)-(this.bottom3DGap/4):columnStart+columnWidth/2;
							if( cPosition == 'external' ){
								if( d[i][j] < 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else{
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}
							}else if( cPosition == 'inside_top' ){
								if( d[i][j] <= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = sY+yHeight+1;
								}
							}else if( cPosition == 'inside_middle' ){
								if( d[i][j] == 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY+yHeight-1;
								}else if( d[i][j] < 0 ){
									ctx.textBaseline = 'middle';
									cSY = sY+(Math.abs(yHeight)/2);
								}else{
									ctx.textBaseline = 'middle';
									cSY = sY-(Math.abs(yHeight)/2);
								}
							}else if( cPosition == 'inside_bottom' ){
								if( d[i][j] >= 0 ){
									ctx.textBaseline = 'bottom';
									cSY = sY-1;
								}else{
									ctx.textBaseline = 'top';
									cSY = sY+1;
								}
							}
							if( vo.is3D ){
								cSY += (this.bottom3DGap/2);
							}
							cText = (d[i][j] != 0)?this.formatter(d[i][j], vo.yAxis.format):'';
							ctx.fillText(cText, cSX, cSY);
						}
						
						sY = sY+yHeight;
					}
				}
				
				if( csOn ){
					ctx.textAlign 	= 'center';
					ctx.fillStyle 	= csFontColor;
					ctx.font 		= 'normal '+csFontSize+'px "'+csFontName+'"';
					cSX 			= (vo.is3D)?(columnStart+columnWidth/2)-(this.bottom3DGap/4):columnStart+columnWidth/2;
					if( csPosition == 'external' ){
						if( this.aSumData[i-1] < 0 ){
							ctx.textBaseline = 'top';
							csSY = (vo.is3D)?sY+(this.bottom3DGap/2)+3:sY+3;
						}else{
							ctx.textBaseline = 'bottom';
							csSY = sY-1;
						}
					}
					csText = this.formatter(this.aSumData[i-1], vo.yAxis.format);
					ctx.fillText(csText, cSX, csSY);
				}
				
				sX = sX + xg;
			}	
			
		},
		drawLine : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aData;
			var yZero		= this.yZero;
			
			var lineWidth	= vo.lineWidth;
			var lineType	= vo.lineType;
			var linePointSize= vo.linePointSize;
			var linePointType= vo.linePointType;
			var linePointStep= vo.linePointStep;
			var areaOpacity = vo.areaOpacity;
			
			this.coordinate2 = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null;
			
			var clacHeight = this.calculatedMargins.h;
			  
			if( vo.is3D ){
				clacHeight = clacHeight - this.bottom3DGap;
			} 
			
			var ymax, ymin;
			
			
			for( var j=1; j<lineCnt; j++ ) {
				this.aSaveLineCoordValue.push([]);
				if(vo.series[j-1]['parentYAxis'] == 'S'){
					yZero = (!!this.y2Zero?this.y2Zero:clacHeight+this.calculatedMargins.y);
					ymax = this.ranges.ymax2;
					ymin = this.ranges.ymin2;
				}else{
					ymax = this.ranges.ymax;
					ymin = this.ranges.ymin;
				}
				
				
				if( vo.series[j-1]['type'] == 'line' || vo.series[j-1]['type'] == 'area' ) {
				
					lineWidth	= vo.series[j-1]['lineWidth'] || vo.lineWidth;
					lineType	= vo.series[j-1]['lineType'] || vo.lineType;
					linePointSize= vo.series[j-1]['pointSize'] || vo.linePointSize;
					linePointType= vo.series[j-1]['pointType'] || vo.linePointType;
					linePointColor=vo.series[j-1]['pointColor'] || '#ffffff';
					linePointStep= vo.series[j-1]['pointStep'] || vo.linePointStep;
					areaOpacity = vo.series[j-1]['areaOpacity'] || vo.areaOpacity;
				
					if(vo.series[j-1]['type'] == 'line'){
						ctx = this.graphics_item3;
					}else{
						ctx = this.graphics_item;
					}
				
					sX = this.calculatedMargins.x;
					sY = clacHeight + this.calculatedMargins.y;
					eX = sX;
					eY = this.calculatedMargins.y;
					xg = this.calculatedMargins.w / (pointCnt - 1);
					if(vo.series[j-1]['parentYAxis'] == 'S'){
						yg = clacHeight / (this.yLabels2.length - 1);
					}else{
						yg = clacHeight / (this.yLabels.length - 1);
					}
					sX = sX + (xg/2);
					sX = (vo.is3D)?sX-(this.bottom3DGap/4):sX;
					
					if( vo.lineShadow && lineWidth != 1 ) {
						ctx.shadowColor="rgba(0, 0, 0, 0.5)";
						ctx.shadowOffsetX=1;
						ctx.shadowOffsetY=1;
						ctx.shadowBlur=2;
					}
					
					ctx.beginPath();
					
					if( lineType == 'curve' || lineType == 'step' ) {
					  var fx = null;
					  var fy = null;
					  var rx = null;
					  var ry = null;
					  var fH = null;
					  var rH = null;
					  var divideVal = 3;
					  var tempDivideVal = 0;
					  var tempDivideVal_2 = 0;
					  var tempDivideVal2 = 0;
					  var tempDivideVal3 = 0;
					  var tempDivideVal3_2 = 0;
					  var tempDivideVal4 = 0;
					  
					}
					
					for(var i=1;i<pointCnt;i++) {
						
						if( vo.yAxis.minValue == 'auto' ){
							yTempHeight = (clacHeight*(d[i][j]-ymin)) / (ymax-ymin);
							yHeight = (clacHeight - yTempHeight)+this.calculatedMargins.y;
						}else{
							yHeight = yZero - ((yZero - this.calculatedMargins.y) * d[i][j]) / ymax;
						}
					  
						// draw bezierCurve 
						if( lineType == 'curve' ){
							if( i==1 ){
								ctx.moveTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}else if(i==pointCnt-1){
								rx = sX;
								ry = yHeight;
								if( vo.yAxis.minValue == 'auto' ){
									tempDivideVal3  = (clacHeight*(d[i-2][j]-ymin)) / (ymax-ymin);
									tempDivideVal3_2  = (clacHeight*(d[i][j]-ymin)) / (ymax-ymin);
								}else{
									yHeight = yZero - ((yZero - this.calculatedMargins.y) * d[i][j]) / ymax;
								}
								tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
								tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
								if( tempDivideVal3 < 0 ){
									fy = fy - tempDivideVal4;
								}else{
									fy = fy + tempDivideVal4;
								}
								ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
							}else{
								rx = sX-(xg/divideVal);
								ry = yHeight;
								
								if( vo.yAxis.minValue == 'auto' ){
									tempDivideVal   = (clacHeight*(d[i+1][j]-ymin)) / (ymax-ymin);
									tempDivideVal_2 = (clacHeight*(d[i-1][j]-ymin)) / (ymax-ymin);
									tempDivideVal3  = (clacHeight*(d[i-2][j]-ymin)) / (ymax-ymin);
									tempDivideVal3_2  = (clacHeight*(d[i][j]-ymin)) / (ymax-ymin);
								}else{
									yHeight = yZero - ((yZero - this.calculatedMargins.y) * d[i][j]) / ymax;
								}
								tempDivideVal = tempDivideVal_2 - tempDivideVal;
								tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
								tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
								tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
								
								if( tempDivideVal < 0 ){
									ry = ry + tempDivideVal2;
								}else{
									ry = ry - tempDivideVal2;
								}
								if( tempDivideVal3 < 0 ){
									fy = fy - tempDivideVal4;
								}else{
									fy = fy + tempDivideVal4;
								}
								ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
							}
						}else if( lineType == 'step' ){
							if( i==1 ){
								ctx.moveTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}else{
								ctx.lineTo(sX, fy);
								ctx.lineTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
							}
						}else{
							if( i==1 ){
								ctx.moveTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}else{
								ctx.lineTo(sX, yHeight);
								this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
							}	
						}
					
						fx = (i==1)?sX:(sX+(xg/divideVal));
						fy = yHeight;
						sX = sX + xg;
						eX = sX;
					}
					ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
					ctx.lineWidth = lineWidth;
					if( !arguments[0] ){
						ctx.stroke();
					}	
					ctx.lineWidth = 1;
					
					if(vo.series[j-1]['type'] == 'area' && !arguments[0]){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
						if(vo.is3D){
							ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2)-(this.bottom3DGap/4), yZero);
							ctx.lineTo(this.calculatedMargins.x+(xg/2)-(this.bottom3DGap/4), yZero);
						}else{
							ctx.lineTo((this.calculatedMargins.w+this.calculatedMargins.x)-(xg/2), yZero);
							ctx.lineTo(this.calculatedMargins.x+(xg/2), yZero);
						}	
						ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], areaOpacity);
						ctx.fill();
					}
					
					// draw line point ================================
					if( linePointSize != 0 && !arguments[0] ) {
						sX = this.calculatedMargins.x;
						xg = this.calculatedMargins.w / (pointCnt - 1);
						sX = sX + (xg/2);
						sX = (vo.is3D)?sX-(this.bottom3DGap/4):sX;
						this.drawLinePointer(ctx, sX, xg, pointCnt, j, lineWidth, clacHeight, linePointSize, linePointType, linePointColor, linePointStep);
					}
					// draw line point ================================
				}else{
					if( !arguments[0] ) {
						var oCoor 		= null;
						var aColumn 	= [];
						for(var i=1;i<pointCnt;i++) {
							// 좌표저장
							oCoor = {
								  x:null
								  ,y:null
								  ,width:null
								  ,height:null
								};
							aColumn.push(oCoor);
						}
						this.coordinate2.push(aColumn); 
					}
				}
			}
			
			if( vo.lineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawLinePointer : function( ctx, sX, xg, pointCnt, j, lineWidth, clacHeight, linePointSize, linePointType, linePointColor, linePointStep ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var pointType	= linePointType;
			var pointSize	= linePointSize;
			var pointColor	= (linePointColor.constructor == String)? linePointColor:'#ffffff';
			var pointStep	= linePointStep;
			var pointStrokeColor = vo.colors[(j-1)%vo.colors.length];
			var starHeight	= null;
			var yZero		= this.yZero;
			var ymax,ymin;
			if(vo.series[j-1]['parentYAxis'] == 'S'){
				yZero = this.y2Zero;
				ymax = this.ranges.ymax2;
				ymin = this.ranges.ymin2;
			}else{
				ymax = this.ranges.ymax;
				ymin = this.ranges.ymin;
			}
			
			for(var i=1;i<pointCnt;i++) {
				if( vo.yAxis.minValue == 'auto' ){
					yTempHeight = (clacHeight*(d[i][j]-ymin)) / (ymax-ymin);
					yHeight = (clacHeight - yTempHeight)+this.calculatedMargins.y;
				}else{
					yHeight = yZero - ((yZero - this.calculatedMargins.y) * d[i][j]) / ymax;
				}
				
				if( i==1 ){
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
				}
				
				if( (i % pointStep) == 0 ){
				
					ctx.beginPath();
					ctx.lineWidth = lineWidth;
					if( pointType == 'circle' ){
						ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
					}else if( pointType == 'rectangle' ){
						ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.lineWidth = lineWidth/2;
					}else if( pointType == 'diamond' ){
						ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
						ctx.lineTo((sX-pointSize), yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
					}else if( pointType == 'upTriangle' ){
						ctx.moveTo((sX-pointSize), yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize), yHeight + pointSize);
					}else if( pointType == 'downTriangle' ){
						ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize), yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
					}else if( pointType == 'star' ){
						starHeight = yHeight-pointSize/1.2;
						ctx.moveTo(sX, starHeight-pointSize/5);
						ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
						ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX, starHeight-pointSize/5)
					}
					ctx.closePath();
					ctx.fillStyle = pointColor;
					ctx.strokeStyle = pointStrokeColor;
					ctx.stroke();
					ctx.fill();
				}
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:yHeight
					  ,width:15
					  ,height:15
					};
				aColumn.push(oCoor);
				
				sX = sX + xg;
			}
			this.coordinate2.push(aColumn); 
		},
		setSelectsingleYCombinationPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			var len = this.coordinate2.length;
			try{var len2= this.coordinate2[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate2[i][j].x - 7;
					var y = this.coordinate2[i][j].y - 7;
					var width = this.coordinate2[i][j].width;
					var height = y + this.coordinate2[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPointDualYLine([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPointDualYLine([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		drawTooltipPointDualYLine : function( aSelect, aColorIdx ){
			if( !this.options.tooltip ){return;}
		
			// 원그리기**********************************************************
			var ctx = this.graphics_event;
			var vo = this.options;
			var xx = this.coordinate2[aSelect[1]][aSelect[0]].x;
			var yy = this.coordinate2[aSelect[1]][aSelect[0]].y; 
			var w = this.coordinate2[aSelect[1]][aSelect[0]].width; 
			var h = this.coordinate2[aSelect[1]][aSelect[0]].height; 
			var color = vo.colors[aSelect[1] % vo.colors.length];
			var pointSize = 5;
			
			//ctx.clearRect(0,0,this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_event, ctx, this.sWidth, this.sHeight);
			
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize-1,0,Math.PI*2,false);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,1,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			ctx.closePath();
		},
		canvas_event_func_dYCombi : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectsingleYCombinationPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectsingleYCombinationPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}
		}
	});
	
	GLChart.Scatter = function(){
		GLChart.call(this, arguments);
		this.aSaveScatterCoordValue = [];
		this.coordinateSUM = [];
		this.options = {
			type : 'scatter'
			,scatterPointSize : [3]
			,scatterPointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
	};
	GLChart.Scatter.prototype = new GLChart([]);
	GLChart.extend(GLChart.Scatter, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			
			if( this.options.xAxis.isValue && this.tempAData != null ){
				this.aData = this.tempAData;
				this.options.xAxis.isValue = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				this.drawScatterChart();
				if( this.options.legend.position != 'none' ){
					if( this.tempAData == null || !this.options.xAxis.isValue ){
						this.drawLegend();
					}else{
						this.drawLegendSumScatter();
					}
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			
		},
		drawScatterChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			/*
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawScatter();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
			}
			*/
			this.drawAxis();
			if( this.tempAData == null || !this.options.xAxis.isValue ){
				this.drawScatter();
			}else{
				this.drawScatter2();
			}
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var area = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var acc = 0.07;
			var th;
			
			this.drawAxis();
			this.drawScatter('calc');
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			area.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				
				th = area.calculatedMargins.h+area.calculatedMargins.y;
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				area.redrawScatterSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,area.sWidth,area.sHeight);
					area.clearRect( area.oCanvas_item, ctx, area.sWidth, area.sHeight);
					area.drawScatter();
					window.clearInterval(area.animationInst);
				}
			},40);
			
		},
		redrawScatterSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var val			= this.aSaveScatterCoordValue;
			var areaCnt		= this.aData[0].length;
			var len			= val.length;
			var areaWidth;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item, ctx, this.sWidth, this.sHeight);
			
			for( var j=1; j<areaCnt; j++ ) {
				areaWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				if( vo.areaLineShadow && areaWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				ctx.beginPath();
				len	= val[j-1].length;
				for( var i=0;i<len;i++ ){
					if( vo.areaLineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
						}
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaWidth;
				ctx.stroke();
				
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
				ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
				ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
				ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				ctx.fill();
				ctx.lineWidth = 1;
			}
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawScatter : function(){
			this.coordinate = [];
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var groupCnt	= this.aData[0].length;
			var pointCnt 	= this.aData.length;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var ctx 		= this.graphics_item;
			var pointType	= 'circle';
			var pointSize	= 3;
			var pointColor	= vo.colors[0];
			var fillColor;
			var starHeight	= null;
			var strokeWidth = 3;
			
			var sX, tempSX, xg;
			
			for( var j=1;j<groupCnt;j++ ){
				aColumn = [];
			
				sX = this.calculatedMargins.x;
				xg = this.calculatedMargins.w / (pointCnt - 1);
				sX = sX + (xg/2);
				
				pointType	= vo.scatterPointType[(j-1)%vo.scatterPointType.length];
				pointSize	= vo.scatterPointSize[(j-1)%vo.scatterPointSize.length];
				pointColor	= vo.colors[(j-1)%vo.colors.length];
				fillColor	= this.adjustBrightness(pointColor, 100);
			
				for(var i=1;i<pointCnt;i++) {
					
					if( d[i][j] != 0 && (d[i][j] == null || d[i][j] == '') ){
						continue;
					}
					
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.xAxis.isValue && this.ranges.xmin != null ){
						if( vo.xAxis.minValue == 'auto' ){
							tempSX = (this.calculatedMargins.w*(d[i][0]-this.ranges.xmin)) / (this.ranges.xmax-this.ranges.xmin);
							sX = tempSX+this.calculatedMargins.x;
						}else{
							sX = this.xZero - ((this.xZero - this.calculatedMargins.x) * d[i][0]) / this.ranges.xmax;
						}
					}
					
					if( i==1 ){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
					}
					ctx.beginPath();
					ctx.fillStyle = fillColor;
					ctx.strokeStyle = pointColor;
					ctx.lineWidth = strokeWidth;
					if( pointType == 'circle' ){
						ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
					}else if( pointType == 'rectangle' ){
						ctx.lineWidth = strokeWidth/2;
						ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					}else if( pointType == 'diamond' ){
						ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
						ctx.lineTo((sX-pointSize), yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
					}else if( pointType == 'upTriangle' ){
						ctx.moveTo((sX-pointSize), yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize), yHeight + pointSize);
					}else if( pointType == 'downTriangle' ){
						ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize), yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
					}else if( pointType == 'star' ){
						starHeight = yHeight-pointSize/1.2;
						ctx.moveTo(sX, starHeight-pointSize/5);
						ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
						ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX, starHeight-pointSize/5)
					}
					ctx.closePath();
					ctx.stroke();
					ctx.fill();
					
					
					// 좌표저장
					oCoor = {
						  x:sX
						  ,y:yHeight
						  ,width:15
						  ,height:15
						};
					aColumn.push(oCoor);
					
					sX = sX + xg;
				}
				this.coordinate.push(aColumn); 
			}
		},
		drawScatter2 : function(){
			
			this.coordinateSUM 	= [];
			var ctx 			= this.graphics_item;
			var len 			= this.aData.length;
			var groupIdx		= 0;
			var groupCnt;
			
			for( var i=0;i<len;i++ ){
				groupIdx = this.drawOtherScatter( ctx, this.aData[i], groupIdx );
				this.coordinateSUM.push(this.coordinate);
				groupIdx++;
			}
			
		},
		drawOtherScatter : function( ctx, aData, groupIdx ){
			this.coordinate = [];
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var groupCnt	= aData[0].length;
			var pointCnt 	= aData.length;
			var yTempHeight = null, yHeight=null;
			var d 			= aData;
			var chartArea 	= vo.chartArea;
			var pointType	= 'circle';
			var pointSize	= 3;
			var pointColor	= vo.colors[0];
			var fillColor;
			var starHeight	= null;
			var strokeWidth = 3;
			
			var sX, tempSX, xg;
			
			for( var j=1;j<groupCnt;j++ ){
				if( j != 1 ){
					groupIdx++;
				}
				aColumn = [];
				
				pointType	= vo.scatterPointType[groupIdx%vo.scatterPointType.length];
				pointSize	= vo.scatterPointSize[groupIdx%vo.scatterPointSize.length];
				pointColor	= vo.colors[groupIdx%vo.colors.length];
				fillColor	= this.adjustBrightness(pointColor, 100);
			
				for(var i=1;i<pointCnt;i++) {
					
					if( d[i][j] != 0 && (d[i][j] == null || d[i][j] == '') ){
						continue;
					}
					
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.xAxis.minValue == 'auto' ){
						tempSX = (this.calculatedMargins.w*(d[i][0]-this.ranges.xmin)) / (this.ranges.xmax-this.ranges.xmin);
						sX = tempSX+this.calculatedMargins.x;
					}else{
						sX = this.xZero - ((this.xZero - this.calculatedMargins.x) * d[i][0]) / this.ranges.xmax;
					}
					
					
					if( i==1 ){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
					}
					
					ctx.beginPath();
					ctx.fillStyle = fillColor;
					ctx.strokeStyle = pointColor;
					ctx.lineWidth = strokeWidth;
					if( pointType == 'circle' ){
						ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
					}else if( pointType == 'rectangle' ){
						ctx.lineWidth = strokeWidth/2;
						ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					}else if( pointType == 'diamond' ){
						ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
						ctx.lineTo((sX-pointSize), yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
					}else if( pointType == 'upTriangle' ){
						ctx.moveTo((sX-pointSize), yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize), yHeight + pointSize);
					}else if( pointType == 'downTriangle' ){
						ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize), yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
					}else if( pointType == 'star' ){
						starHeight = yHeight-pointSize/1.2;
						ctx.moveTo(sX, starHeight-pointSize/5);
						ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
						ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX, starHeight-pointSize/5)
					}
					ctx.closePath();
					ctx.stroke();
					ctx.fill();
					
					
					// 좌표저장
					oCoor = {
						  x:sX
						  ,y:yHeight
						  ,width:15
						  ,height:15
						};
					aColumn.push(oCoor);
					
				}
				this.coordinate.push(aColumn); 
			}
			return groupIdx;
		},
		drawTooltipSumScatter : function( e, aSelect, mouseXY, gap ){
			var canvas		= this.oCanvas_tooltip;
			var ctx 		= this.graphics_tooltip;
			var vo			= this.options;
			var tooltipWidth= 0;
			var tempTooltipWidth;
			var textColor 	= vo.tooltipTextStyle.color;
			var textName 	= vo.tooltipTextStyle.fontName;
			var textSize 	= vo.tooltipTextStyle.fontSize;
			var separation	= vo.tooltipBackground.separation;
			var margin		= vo.tooltipBackground.margin;
			var x=margin, y=margin;
			var tooltipHeight = ((textSize*3)+(separation*2))+(margin*3);
			var val = '';
			var xVal = '';
			var val_percentage = '';
			
			var labelSum	= this.aData;
			var labels		= labelSum[aSelect[2]];
			var tooltipTitleText = labels[0][aSelect[1]+1];
			
			if( ctx ){
				canvas.style.display = 'block';
			
				if( vo.tooltipText == 'value' ){
					val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
				}else if( vo.tooltipText == 'percentage' ){
					val = val_percentage;
				}else if( vo.tooltipText == 'all' ){
					if( val_percentage == '' ){
						val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
					}else{
						val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0")+' ('+val_percentage+')';
					}	
				}
				
				ctx.font = 'bold '+textSize+'px "'+textName+'"';
				tooltipWidth = ctx.measureText(tooltipTitleText).width+(margin*2);
				ctx.font = 'normal '+textSize+'px "'+textName+'"';
				tempTooltipWidth = ctx.measureText(val).width+(margin*2)+5;
				if( tooltipWidth < tempTooltipWidth ){
					tooltipWidth = tempTooltipWidth;
				}
				
				xVal = labels[aSelect[0]+1][0];
				tempTooltipWidth = ctx.measureText(xVal).width+(margin*2)+5;
				if( tooltipWidth < tempTooltipWidth ){
					tooltipWidth = tempTooltipWidth;
				}
				
				if( tooltipWidth+(mouseXY[0]+(gap*2)) > this.sWidth ){
					canvas.style.left = ((mouseXY[0]-(gap*2))-tooltipWidth)+'px';
				}else{
					canvas.style.left = mouseXY[0]+'px';
				}
				canvas.style.top = (mouseXY[1]-tooltipHeight)+'px';
				canvas.width = tooltipWidth;
				canvas.height = tooltipHeight;
				this.setDevicePixelRatio(ctx, this.oCanvas_tooltip, tooltipWidth, tooltipHeight);
				
				this.legendLabel(ctx, x, y, 'bold '+textSize+'px "'+textName+'"', textColor, 'left', 'top', tooltipTitleText);
				this.legendLabel(ctx, x, (y+textSize+separation), 'normal '+textSize+'px "'+textName+'"', textColor, 'left', 'top', xVal);
				this.legendLabel(ctx, x, (y+textSize+separation+textSize+separation), 'normal '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
				
			}
		},
		drawTooltipPointSumScatter : function(aSelect, iColorIdx){
			if( !this.options.tooltip ){return;}
		
			this.coordinate = this.coordinateSUM[aSelect[2]];
		
			// 원그리기**********************************************************
			var ctx = this.graphics_event;
			var vo = this.options;
			var xx = this.coordinate[aSelect[1]][aSelect[0]].x;
			var yy = this.coordinate[aSelect[1]][aSelect[0]].y; 
			var w = this.coordinate[aSelect[1]][aSelect[0]].width; 
			var h = this.coordinate[aSelect[1]][aSelect[0]].height; 
			var color = vo.colors[iColorIdx % vo.colors.length];
			var pointSize = 5;
			
			//ctx.clearRect(0,0,this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_event, ctx, this.sWidth, this.sHeight);
			
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize-1,0,Math.PI*2,false);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,1,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			ctx.closePath();
		},
		drawLegendSumScatter : function(){
			var canvas		= this.oCanvas_legend;
			var ctx 		= this.graphics_legend;
			var vo			= this.options;
			var legendWidth = 0;
			var tempLegendWidth;
			var labels, legendTextLen, legendHeight;
			var textColor 	= vo.legendTextStyle.color;
			var textName 	= vo.legendTextStyle.fontName;
			var textSize 	= vo.legendTextStyle.fontSize;
			var separation	= vo.legendBackground.separation;
			var margin		= vo.legendBackground.margin;
			var x=margin, y=margin;
			
			var aLegend = [];
			for( var k=0, len=this.aData.length;k<len;k++ ){
				labels = this.aData[k];
				for(var i=1,len2=labels[0].length;i<len2;i++){
					aLegend.push(labels[0][i]);
				}
			}
			
			legendTextLen = aLegend.length;
			legendHeight = ((legendTextLen*(textSize+separation))-separation)+(margin*2);
			
			if( ctx ){
				canvas.style.display = 'block';
			  
				for(var i=0;i<legendTextLen;i++){
					ctx.font = textSize+'px "'+textName+'"';
					tempLegendWidth = ctx.measureText(aLegend[i]).width+(textSize+2)+(margin*3);
					if( legendWidth < tempLegendWidth ){
					  legendWidth = tempLegendWidth;
					}
				}
				if(vo.legend.position == 'right'){
					this.legendTop		= (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
					this.legendLeft		= (((this.sWidth - legendWidth)+vo.background.strokeThickness)-5)+'px';
				}else if( vo.legend.position == 'left' ){
					this.legendTop		= (parseFloat(this.sHeight) - legendHeight)/2 + 'px';
					this.legendLeft		= vo.background.strokeThickness+5+'px';
				}
				canvas.style.top = this.legendTop;
				canvas.style.left = this.legendLeft;
				canvas.width = legendWidth;
				canvas.height = legendHeight;
				this.setDevicePixelRatio(ctx, this.oCanvas_legend, legendWidth, legendHeight);
				for(var i=0;i<legendTextLen;i++){
					this.rect(ctx, x, y,textSize, textSize, vo.colors[i % vo.colors.length], '');
					this.legendLabel(ctx, textSize+(x+3), y, textSize+'px "'+textName+'"', textColor, 'left', 'top', aLegend[i]);
					y += (textSize+separation);
				}
				
			}
		},
		setSelectScatterPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var tempIdx = 0;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			if( this.tempAData == null ){
				var len = this.coordinate.length;
				try{var len2= this.coordinate[0].length;}catch(ex){return;}
				  
				for( var i=0;i<len;i++ ) {
					for( var j=0;j<len2;j++ ) {
						var x = this.coordinate[i][j].x - 7;
						var y = this.coordinate[i][j].y - 7;
						var width = this.coordinate[i][j].width;
						var height = y + this.coordinate[i][j].height;
						if( x < mx && mx < (x+width) ) {
							if( y > height ) {
								if( y > my && my > height ) {
								
									pointX = x+(width/2) + gap;
									pointY = height - gap-5;
									this.drawTooltip( e, [j, i], [pointX,pointY], gap );
									this.drawTooltipPoint([j,i]);
									selectFlag = true;
								}
							}else{
								if( height > my && my > y ) {
								
									pointX = x+(width/2) + gap;
									pointY = height - gap-5;
									this.drawTooltip( e, [j, i], [pointX,pointY], gap );
									this.drawTooltipPoint([j,i]);
									selectFlag = true;
								}
							}
						}
					}
				}
			}else{
				var len, len2, sumCoor;
				var sumLen = this.coordinateSUM.length;
				
				for( var k=0;k<sumLen;k++ ){
					sumCoor = this.coordinateSUM[k];
					len = sumCoor.length;
					len2 = sumCoor[0].length;
					
					for( var i=0;i<len;i++ ) {
						if(i>0){
							tempIdx++;
						}
					
						for( var j=0;j<len2;j++ ) {
						
							var x = sumCoor[i][j].x - 7;
							var y = sumCoor[i][j].y - 7;
							var width = sumCoor[i][j].width;
							var height = y + sumCoor[i][j].height;
							if( x < mx && mx < (x+width) ) {
								if( y > height ) {
									if( y > my && my > height ) {
									
										pointX = x+(width/2) + gap;
										pointY = height - gap-5;
										this.drawTooltipSumScatter( e, [j, i, k], [pointX,pointY], gap );
										this.drawTooltipPointSumScatter([j,i, k], tempIdx);
										selectFlag = true;
									}
								}else{
									if( height > my && my > y ) {
									
										pointX = x+(width/2) + gap;
										pointY = height - gap-5;
										this.drawTooltipSumScatter( e, [j, i, k], [pointX,pointY], gap );
										this.drawTooltipPointSumScatter([j,i,k], tempIdx);
										selectFlag = true;
									}
								}
							}
						}
					}
					tempIdx++;
					
				}
				  
				
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		canvas_event_func_scatter : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectScatterPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectScatterPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}
		}
	});
	
	GLChart.Bubble = function(){
		GLChart.call(this, arguments);
		this.aSaveBubbleCoordValue = [];
		this.coordinateSUM = [];
		this.options = {
			type : 'bubble'
			
			,bubbleField : [{x:0, y:'auto', radius:'auto'}]
			,bubbleMinRadius : 1
			,bubbleMaxRadius : 30
			
			,bubblePointSize : [3]
			,bubblePointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
			// set max value.
			,bubbleMaxValue : null
			,bubbleYMaxValue : null
			,bubbleXMaxValue : null
			
			,bubbleLineType : ['curve-area']
			,bubbleLineColor : ['#000000']
			,bubbleLineWidth : [1]
			,bubbleLineSmoothValue : [2]
			,bubbleLineAreaColor : ['#000000']
			,bubbleLineAreaOpacity : [1]
			,bubbleConnectLine : [false]
			,bubbleBorderSize : [3]
			,bubblePointFillColorIndex : null
			,bubblePointStrokeColorIndex : null
			
			,bubblePointStrokeColor : ['auto']
			
			,events : {
				bubblePointFillColorIndexReturn : null
				,bubblePointStrokeColorIndexReturn : null
			}
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
	};
	GLChart.Bubble.prototype = new GLChart([]);
	GLChart.extend(GLChart.Bubble, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			
			this.setBubbleData();
			
			this.setCanvas();
			if( this.aData ){
				this.drawBubbleChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegendBubble();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			if( this.options.events.click ){
				this.addEvent("click", o, this.eventListener);
			}
		},
		setBubbleData : function(){
			var fieldTotal = 0;
			var aX=[], aY=[], aRadius=[];
			
			// aBubbleData
			if( this.options.bubbleField[0].y == 'auto' ){
				
				var len = this.aData[0].length;
				var itemLen = this.aData.length;
				for(var i=1;i<len;i++){
					fieldTotal = 0;
					aX=[];aY=[];aRadius=[];
					for(var j=1;j<itemLen;j++){
						fieldTotal += parseFloat(this.aData[j][i]);
						aX.push(this.aData[j][0]);
						aY.push(this.aData[j][i]);
						aRadius.push(this.aData[j][i]);
					}
					this.aBubbleData.push({x:aX, y:aY, radius:aRadius, sum:fieldTotal});
				}
			}else{
				var fieldLen = this.options.bubbleField.length;
				var itemLen = this.aData.length;
				var x,y,radius,sum;
				for(var i=0;i<fieldLen;i++){
					fieldTotal = 0;
					x 		= parseInt(this.options.bubbleField[i].x, 10);
					y 		= parseInt(this.options.bubbleField[i].y, 10);
					radius 	= parseInt(this.options.bubbleField[i].radius, 10);
					aX=[];aY=[];aRadius=[];
					for(var j=1;j<itemLen;j++){
						fieldTotal += parseFloat(this.aData[j][radius]);
						aX.push(this.aData[j][x]);
						aY.push(this.aData[j][y]);
						aRadius.push(this.aData[j][radius]);
					}
					this.aBubbleData.push({x:aX, y:aY, radius:aRadius, sum:fieldTotal});
				}
			}
		},
		drawBubbleChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			/*
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawScatter();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
			}
			*/
			
			this.drawAxis();
			this.drawBubble();
			
			if( !this.isAndroid && !this.support_userAgent.ie ){
				this.graphics_item.clearRect(0,0,(this.calculatedMargins.w+this.calculatedMargins.x),this.calculatedMargins.y);
				this.graphics_item.clearRect((this.calculatedMargins.w+this.calculatedMargins.x),0,this.sWidth,this.sHeight);
				this.graphics_item.clearRect(0,(this.calculatedMargins.y+this.calculatedMargins.h),this.sWidth,this.sHeight);
				this.graphics_item.clearRect(0,0,this.calculatedMargins.x,this.sHeight);
			}
			
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var area = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var acc = 0.07;
			var th;
			
			this.drawAxis();
			this.drawBubble('calc');
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			area.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				
				th = area.calculatedMargins.h+area.calculatedMargins.y;
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				area.redrawBubbleSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,area.sWidth,area.sHeight);
					area.clearRect( area.oCanvas_item, ctx, area.sWidth, area.sHeight);
					area.drawBubble();
					window.clearInterval(area.animationInst);
				}
			},40);
			
		},
		redrawBubbleSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var val			= this.aSaveBubbleCoordValue;
			var areaCnt		= this.aData[0].length;
			var len			= val.length;
			var areaWidth;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item, ctx, this.sWidth, this.sHeight);
			
			for( var j=1; j<areaCnt; j++ ) {
				areaWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				if( vo.areaLineShadow && areaWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				ctx.beginPath();
				len	= val[j-1].length;
				for( var i=0;i<len;i++ ){
					if( vo.areaLineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
						}
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaWidth;
				ctx.stroke();
				
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
				ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
				ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
				ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				ctx.fill();
				ctx.lineWidth = 1;
			}
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawBubble : function(){
			this.coordinate = [];
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var groupCnt	= this.aBubbleData.length;
			var pointCnt 	= this.aBubbleData[0].x.length;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var ctx 		= this.graphics_item;
			var pointType	= 'circle';
			var pointSize	= 3;
			var bubbleGap	= vo.bubbleMaxRadius - vo.bubbleMinRadius;
			var valueGap	= this.ranges.ymax - this.ranges.ymin;
			var radiusGap	= this.ranges.rmax - this.ranges.rmin;
			var pointValueY	= null;
			var pointValueX	= null;
			var pointColor	= vo.colors[0];
			var fillColor;
			var starHeight	= null;
			var strokeWidth = 3;
			var mouseSelectSize = null;
			
			var bubbleConnectLine = null;
			var bubbleLineType = null;
			var bubbleLineColor = null;
			var bubbleBorderSize = null;
			var bubbleLineWidth = null;
			var bubbleLineSmoothValue = null;
			var bubbleLineAreaColor = null;
			var bubbleLineAreaOpacity = null;
			var bubblePointStrokeColor = null;
			var bubblePointStrokeColorIndex = vo.bubblePointStrokeColorIndex;
			var bubblePointFillColorIndex = vo.bubblePointFillColorIndex;
			
			var sX, tempSX, xg;
			var sX2, tempSX2, xg2;
			var g1, darkColor, darkColor2, lightColor, colorSR, colorER;
			
			for( var j=0;j<groupCnt;j++ ){
				aColumn = [];
			
				sX = this.calculatedMargins.x;
				xg = this.calculatedMargins.w / pointCnt;
				sX = sX + (xg/2);
				
				pointType	= vo.bubblePointType[j%vo.bubblePointType.length];
				bubblePointStrokeColor = vo.bubblePointStrokeColor[j%vo.bubblePointStrokeColor.length];
				pointColor	= bubblePointStrokeColor=='auto'? vo.colors[j%vo.colors.length] : bubblePointStrokeColor;
				fillColor	= vo.colors[j%vo.colors.length];
				bubbleConnectLine = vo.bubbleConnectLine[j%vo.bubbleConnectLine.length];
				bubbleLineType = vo.bubbleLineType[j%vo.bubbleLineType.length];
				bubbleLineColor = vo.bubbleLineColor[j%vo.bubbleLineColor.length];
				strokeWidth = vo.bubbleBorderSize[j%vo.bubbleBorderSize.length];
				bubbleLineWidth = vo.bubbleLineWidth[j%vo.bubbleLineWidth.length];
				bubbleLineSmoothValue = vo.bubbleLineSmoothValue[j%vo.bubbleLineSmoothValue.length];
				bubbleLineAreaColor = vo.bubbleLineAreaColor[j%vo.bubbleLineAreaColor.length];
				bubbleLineAreaOpacity = vo.bubbleLineAreaOpacity[j%vo.bubbleLineAreaOpacity.length];
				
				
				lightColor	 = this.adjustBrightness(fillColor, 50);
				darkColor	 = this.adjustBrightness(fillColor, -50);
				darkColor2	 = this.adjustBrightness(fillColor, -80);
				
				if( bubbleConnectLine ){
				
					var path = [];
					sX2 = this.calculatedMargins.x;
					xg2 = this.calculatedMargins.w / pointCnt-2;
					sX2 = sX2 + (xg2/2);
				
					
					for(var i=0;i<pointCnt;i++) {
					
						pointValueY = this.aBubbleData[j].y[i];
						pointValueX = this.aBubbleData[j].x[i];
					
						if( vo.yAxis.minValue == 'auto' ){
							yTempHeight = (this.calculatedMargins.h*(pointValueY-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
						}else{
							yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * pointValueY) / this.ranges.ymax;
						}
						
						if( vo.xAxis.isValue && this.ranges.xmin != null ){
							if( vo.xAxis.minValue == 'auto' ){
								tempSX2 = (this.calculatedMargins.w*(pointValueX-this.ranges.xmin)) / (this.ranges.xmax-this.ranges.xmin);
								sX2 = tempSX2+this.calculatedMargins.x;
							}else{
								sX2 = this.xZero - ((this.xZero - this.calculatedMargins.x) * pointValueX) / this.ranges.xmax;
							}
						}
						
						path.push({x:sX2, y:yHeight});
						
						sX2 = sX2 + xg2;
						
					}
					
					if(bubbleLineSmoothValue != 0){
					
						if( bubbleLineType == 'curve-area' ){
							ctx.beginPath();
							ctx.lineWidth = 0;
							this.smoothPath(path, bubbleLineSmoothValue, false, ctx);
							ctx.lineTo(path[path.length-1].x, this.yZero);
							ctx.lineTo(path[0].x, this.yZero);
							ctx.lineTo(path[0].x, path[0].y);
							ctx.closePath();
							ctx.fillStyle = this.colorToRgba(bubbleLineAreaColor, bubbleLineAreaOpacity);
							ctx.fill();
							ctx.lineWidth = 1;
						}
						
						ctx.beginPath();
						ctx.lineWidth = bubbleLineWidth;
						ctx.strokeStyle =  bubbleLineColor;
						this.smoothPath(path, bubbleLineSmoothValue, false, ctx);
						ctx.stroke();
						ctx.lineWidth = 1;
					}else{
						
						if( bubbleLineType == 'curve-area' ){
							ctx.beginPath();
							ctx.lineWidth = 0;
							ctx.moveTo(path[0].x, path[0].y);
							for(var i=1;i<pointCnt;i++) {
								ctx.lineTo(path[i].x, path[i].y);
							}
							ctx.lineTo(path[path.length-1].x, this.yZero);
							ctx.lineTo(path[0].x, this.yZero);
							ctx.lineTo(path[0].x, path[0].y);
							ctx.closePath();
							ctx.fillStyle = this.colorToRgba(bubbleLineAreaColor, bubbleLineAreaOpacity);
							ctx.fill();
							ctx.lineWidth = 1;
							
						}
						
						ctx.beginPath();
						ctx.lineWidth = bubbleLineWidth;
						ctx.strokeStyle =  bubbleLineColor;
						ctx.moveTo(path[0].x, path[0].y);
						for(var i=1;i<pointCnt;i++) {
							ctx.lineTo(path[i].x, path[i].y);
						}
						ctx.stroke();
						ctx.lineWidth = 1;
						
					}
					
					
				}
				
				
				for(var i=0;i<pointCnt;i++) {
				
					//pointSize = parseInt(Math.abs(((bubbleGap * this.aBubbleData[j].radius[i]) / valueGap)+vo.bubbleMinRadius),10);
					pointSize = parseInt(Math.abs(((bubbleGap * this.aBubbleData[j].radius[i]) / this.ranges.rmax)+vo.bubbleMinRadius),10);
					pointValueY = this.aBubbleData[j].y[i];
					pointValueX = this.aBubbleData[j].x[i];
					colorSR = pointSize/2.5;
					colorER = pointSize/3.7;
				
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(pointValueY-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * pointValueY) / this.ranges.ymax;
					}
					
					if( vo.xAxis.isValue && this.ranges.xmin != null ){
						if( vo.xAxis.minValue == 'auto' ){
							tempSX = (this.calculatedMargins.w*(pointValueX-this.ranges.xmin)) / (this.ranges.xmax-this.ranges.xmin);
							sX = tempSX+this.calculatedMargins.x;
						}else{
							sX = this.xZero - ((this.xZero - this.calculatedMargins.x) * pointValueX) / this.ranges.xmax;
						}
					}
					
					if( i==1 ){
						ctx.shadowColor="rgba(0, 0, 0, 0)";
						ctx.shadowOffsetX=0;
						ctx.shadowOffsetY=0;
						ctx.shadowBlur=0;
					}
					
					if( vo.theme.seriesGradientStyle == 1 ){
						g1 = fillColor;
					}else if( vo.theme.seriesGradientStyle == 2 ){
						g1 = ctx.createRadialGradient(sX, yHeight, 0, sX, yHeight, pointSize);
						g1.addColorStop(0, lightColor);
						g1.addColorStop(0.5, fillColor);
						g1.addColorStop(1, darkColor);
						pointColor = pointColor;
					}else if( vo.theme.seriesGradientStyle == 3 ){
						g1 = ctx.createRadialGradient(sX-colorSR, yHeight-colorSR, 0, sX-colorER, yHeight-colorER, pointSize*1.2);
						g1.addColorStop(0, '#fff');
						g1.addColorStop(0.2, lightColor);
						g1.addColorStop(0.4, fillColor);
						g1.addColorStop(0.75, darkColor);
						g1.addColorStop(0.9, darkColor2);
						g1.addColorStop(0.93, darkColor2);
						g1.addColorStop(1, darkColor);
					}else{
						g1 = fillColor;
					}
					
					// create bubble -----------------------------------------------------------------
					ctx.beginPath();
					ctx.lineWidth = strokeWidth;
					
					// selected point ==============================================================================================
					if( bubblePointStrokeColorIndex && bubblePointStrokeColorIndex.constructor == Array ){
						if( j == bubblePointStrokeColorIndex[0] && i == bubblePointStrokeColorIndex[1] ){
							ctx.strokeStyle = bubblePointStrokeColorIndex[2];
							
							if( vo.events.bubblePointStrokeColorIndexReturn && typeof vo.events.bubblePointStrokeColorIndexReturn == 'function' ){
								var returnObj = {};
								returnObj.index = i;
								returnObj.data = {
									x:this.aBubbleData[j].x[i]
									,y:this.aBubbleData[j].y[i]
									,radius:this.aBubbleData[j].radius[i]
									,pointX : sX
									,pointY : yHeight
								};
								vo.events.bubblePointStrokeColorIndexReturn('', returnObj);
							}
							
						}else{
							ctx.strokeStyle = pointColor;
						}
					}else{
						ctx.strokeStyle = pointColor;
					}
					
					if( bubblePointFillColorIndex && bubblePointFillColorIndex.constructor == Array ){
						if( j == bubblePointFillColorIndex[0] && i == bubblePointFillColorIndex[1] ){
							ctx.fillStyle = bubblePointFillColorIndex[2];
							
							if( vo.events.bubblePointFillColorIndexReturn && typeof vo.events.bubblePointFillColorIndexReturn == 'function' ){
								var returnObj = {};
								returnObj.index = i;
								returnObj.data = {
									x:this.aBubbleData[j].x[i]
									,y:this.aBubbleData[j].y[i]
									,radius:this.aBubbleData[j].radius[i]
									,pointX : sX
									,pointY : yHeight
								};
								vo.events.bubblePointFillColorIndexReturn('', returnObj);
							}
							
						}else{
							ctx.fillStyle = g1;
						}
					}else{
						ctx.fillStyle = g1;
					}
					// selected point ==============================================================================================
					
					if( pointType == 'circle' ){
						ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
					}else if( pointType == 'rectangle' ){
						ctx.lineWidth = strokeWidth/2;
						ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
						ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					}else if( pointType == 'diamond' ){
						ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
						ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
						ctx.lineTo((sX-pointSize), yHeight);
						ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
					}else if( pointType == 'upTriangle' ){
						ctx.moveTo((sX-pointSize), yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize), yHeight + pointSize);
					}else if( pointType == 'downTriangle' ){
						ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
						ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
						ctx.lineTo((sX-pointSize), yHeight - pointSize);
						ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
					}else if( pointType == 'star' ){
						starHeight = yHeight-pointSize/1.2;
						ctx.moveTo(sX, starHeight-pointSize/5);
						ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
						ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
						ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
						ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
						ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
						ctx.lineTo(sX, starHeight-pointSize/5)
					}
					ctx.closePath();
					if( vo.theme.seriesGradientStyle != 3 ){
						ctx.stroke();
					}
					ctx.fill();
					// create bubble -----------------------------------------------------------------
					
					// 좌표저장
					if(pointSize < 7){
							mouseSelectSize = 14;	
					}else{
						mouseSelectSize = pointSize*2;
					}
					
					if( parseInt(this.aBubbleData[j].radius[i],10) == 0 ){
						mouseSelectSize = 0;
					}
					
					oCoor = {
						  x:sX
						  ,y:yHeight
						  ,width:mouseSelectSize
						  ,height:mouseSelectSize
						};
					aColumn.push(oCoor);
					
					sX = sX + xg;
				}
				this.coordinate.push(aColumn); 
			}
		},
		drawTooltipSumBubble : function( e, aSelect, mouseXY, gap ){
			var canvas		= this.oCanvas_tooltip;
			var ctx 		= this.graphics_tooltip;
			var vo			= this.options;
			var tooltipWidth= 0;
			var tempTooltipWidth;
			var textColor 	= vo.tooltipTextStyle.color;
			var textName 	= vo.tooltipTextStyle.fontName;
			var textSize 	= vo.tooltipTextStyle.fontSize;
			var separation	= vo.tooltipBackground.separation;
			var margin		= vo.tooltipBackground.margin;
			var x=margin, y=margin;
			var tooltipHeight = ((textSize*3)+(separation*2))+(margin*3);
			var val = '';
			var xVal = '';
			var val_percentage = '';
			
			var labelSum	= this.aData;
			var labels		= labelSum[aSelect[2]];
			var tooltipTitleText = labels[0][aSelect[1]+1];
			
			if( ctx ){
				canvas.style.display = 'block';
			
				if( vo.tooltipText == 'value' ){
					val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
				}else if( vo.tooltipText == 'percentage' ){
					val = val_percentage;
				}else if( vo.tooltipText == 'all' ){
					if( val_percentage == '' ){
						val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0");
					}else{
						val = this.formatter(labels[aSelect[0]+1][aSelect[1]+1], "#,##0")+' ('+val_percentage+')';
					}	
				}
				
				ctx.font = 'bold '+textSize+'px "'+textName+'"';
				tooltipWidth = ctx.measureText(tooltipTitleText).width+(margin*2);
				ctx.font = 'normal '+textSize+'px "'+textName+'"';
				tempTooltipWidth = ctx.measureText(val).width+(margin*2)+5;
				if( tooltipWidth < tempTooltipWidth ){
					tooltipWidth = tempTooltipWidth;
				}
				
				xVal = labels[aSelect[0]+1][0];
				tempTooltipWidth = ctx.measureText(xVal).width+(margin*2)+5;
				if( tooltipWidth < tempTooltipWidth ){
					tooltipWidth = tempTooltipWidth;
				}
				
				if( tooltipWidth+(mouseXY[0]+(gap*2)) > this.sWidth ){
					canvas.style.left = ((mouseXY[0]-(gap*2))-tooltipWidth)+'px';
				}else{
					canvas.style.left = mouseXY[0]+'px';
				}
				canvas.style.top = (mouseXY[1]-tooltipHeight)+'px';
				canvas.width = tooltipWidth;
				canvas.height = tooltipHeight;
				this.setDevicePixelRatio(ctx, this.oCanvas_tooltip, tooltipWidth, tooltipHeight);
				
				this.legendLabel(ctx, x, y, 'bold '+textSize+'px "'+textName+'"', textColor, 'left', 'top', tooltipTitleText);
				this.legendLabel(ctx, x, (y+textSize+separation), 'normal '+textSize+'px "'+textName+'"', textColor, 'left', 'top', xVal);
				this.legendLabel(ctx, x, (y+textSize+separation+textSize+separation), 'normal '+textSize+'px "'+textName+'"', textColor, 'left', 'top', val);
				
			}
		},
		drawTooltipPointSumBubble : function(aSelect, iColorIdx){
			if( !this.options.tooltip ){return;}
		
			this.coordinate = this.coordinateSUM[aSelect[2]];
		
			// 원그리기**********************************************************
			var ctx = this.graphics_event;
			var vo = this.options;
			var xx = this.coordinate[aSelect[1]][aSelect[0]].x;
			var yy = this.coordinate[aSelect[1]][aSelect[0]].y; 
			var w = this.coordinate[aSelect[1]][aSelect[0]].width; 
			var h = this.coordinate[aSelect[1]][aSelect[0]].height; 
			var color = vo.colors[iColorIdx % vo.colors.length];
			var pointSize = 5;
			
			//ctx.clearRect(0,0,this.sWidth, this.sHeight);
			this.clearRect( this.oCanvas_event, ctx, this.sWidth, this.sHeight);
			
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,pointSize-1,0,Math.PI*2,false);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(xx,yy,1,0,Math.PI*2,false);
			ctx.strokeStyle = color;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			ctx.closePath();
		},
		setSelectBubblePoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap = 0;
			var tempIdx = 0;
			var mouseCoords = this.getMouseXY(e);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - (this.coordinate[i][j].width/2);
					var y = this.coordinate[i][j].y - (this.coordinate[i][j].width/2);
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+width;
								pointY = y;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
								this.returnEventData( e, [j, i] );
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+width;
								pointY = y;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
								
								this.returnEventData( e, [j, i] );
							}
						}
					}
				}
			}
			
			
			if( !selectFlag ){
			
				if( this.options.events.mousePointout ){
					this.options.events.mousePointout(e);
				}
			
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectBubblePoint_click : function(e){
			var vo 			= this.options;
			var pointX, pointY, gap = 0;
			var tempIdx = 0;
			var mouseCoords = this.getMouseXY(e);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - (this.coordinate[i][j].width/2);
					var y = this.coordinate[i][j].y - (this.coordinate[i][j].width/2);
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								this.returnEventData( e, [j, i] );
							}
						}else{
							if( height > my && my > y ) {
							
								this.returnEventData( e, [j, i] );
								
							}
						}
					}
				}
			}
			
			
		},
		canvas_event_func_bubble : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectBubblePoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectBubblePoint_click(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}else if( e.type=='click' ){
				eThis.setSelectBubblePoint_click(e, chartElem);
			}
		}
	});

	
	GLChart.Radar = function(){
		GLChart.call(this, arguments);
		this.aSaveRadarCoordValue = [];
		this.options = {
			type : 'radar'
			,lineWidth : [2]
			,lineShadow : true
			,lineType : 'normal'	// 'normal', 'curve', 'step'
			,linePointSize : [2]
			,linePointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
			,linePointColor : null
			,areaOpacity : 0.2
			,customYAxisLabel : { on:false, value:[], positionType:1 }
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
		this.calculatedMargins={x:0,y:0,w:0,h:0,diameter:0,center:[0,0]};
	};
	GLChart.Radar.prototype = new GLChart([]);
	GLChart.extend(GLChart.Radar, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawRadarChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			
		},
		drawRadarChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawRadar();
				this.drawCaptionText('title');
				//this.drawCaptionText('xName');
				//this.drawCaptionText('yName');
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var line = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var w = 0.01;
			var acc = 0.07;
			var th, tw;
			
			this.drawAxis();
			this.drawRadar('calc');
			this.drawCaptionText('title');
			ctx.save();
			
			line.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				w = w+acc;
				
				th = line.calculatedMargins.center[1];
				tw = line.calculatedMargins.center[0];
				th = th-(th*h);
				tw = tw-(tw*w);
				
				ctx.save();
				ctx.translate(tw, th);
				ctx.scale(w, h);
				//ctx.clearRect(0,0,line.sWidth,line.sHeight);
				line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
				line.redrawRadarSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,line.sWidth,line.sHeight);
					line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
					line.drawRadar();
					window.clearInterval(line.animationInst);
				}
			},40);
			
		},
		redrawRadarSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aSaveRadarCoordValue;
			
			ctx.shadowColor="rgba(0, 0, 0, 0)";
			ctx.shadowOffsetX=0;
			ctx.shadowOffsetY=0;
			ctx.shadowBlur=0;
			
			for( var j=1; j<lineCnt; j++ ) {
				ctx.beginPath();
				for(var i=1;i<pointCnt;i++){
					if(i != 1){
						ctx.lineTo(d[j-1][0][i-1][0],d[j-1][0][i-1][1]);
					}else{
						ctx.moveTo(d[j-1][0][i-1][0],d[j-1][0][i-1][1]);
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = vo.lineWidth[(j-1)%vo.lineWidth.length];
				ctx.closePath();
				ctx.stroke();
				ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				ctx.fill();
			}
		},
		drawRadar : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aData;
			var lineWidth	= 1;
			var fillColor	= null;
			this.coordinate = [];
			this.aSaveRadarCoordValue = [];
			
			var yHeight = null;
			var Cd, startAngle=-(Math.PI/2);
			var radius=this.calculatedMargins.diameter/2;
			var center=this.calculatedMargins.center;
			var x,y, aRadar=[];
			
			ctx.shadowColor="rgba(0, 0, 0, 0)";
			ctx.shadowOffsetX=0;
			ctx.shadowOffsetY=0;
			ctx.shadowBlur=0;
			
			for( var j=1; j<lineCnt; j++ ) {
			
				aRadar = [];
				ctx.beginPath();
				for(var i=1;i<pointCnt;i++){
				
					yHeight = (radius*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
					Cd = 360 / (pointCnt-1) * (i-1) * Math.PI / 180;
					x = Math.ceil(Math.cos(Cd + startAngle) * yHeight + center[0])+0.5;
					y = Math.ceil(Math.sin(Cd + startAngle) * yHeight + center[1])+0.5;
					
					if(i != 1){
						ctx.lineTo(x,y);
					}else{
						ctx.moveTo(x,y);
					}
					aRadar.push([x,y]);
				}
				lineWidth = vo.lineWidth[(j-1)%vo.lineWidth.length];
				fillColor = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = lineWidth;
				ctx.closePath();
				if( arguments[0] ){
					this.aSaveRadarCoordValue.push([aRadar]);
				}else{
					ctx.stroke();
					ctx.fillStyle = fillColor;
					ctx.fill();
					
					// draw Radar point ================================
					if( vo.linePointSize[(j-1)%vo.linePointSize.length] != 0 ) {
						this.drawRadarPointer(x, y, pointCnt, j, lineWidth);
					}
					// draw Radar point ================================
				}
				
			}
			
		},
		drawRadarLegend : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var lineCnt		= this.aData[0].length;
			var d			= this.aData;
			var lineWidth	= 1;
			var fillColor	= null;
			this.coordinate = [];
			this.aSaveRadarCoordValue = [];
			
			var yHeight = null;
			var Cd, startAngle=-(Math.PI/2);
			var radius=this.calculatedMargins.diameter/2;
			var center=this.calculatedMargins.center;
			var x,y, aRadar=[];
			
			ctx.shadowColor="rgba(0, 0, 0, 0)";
			ctx.shadowOffsetX=0;
			ctx.shadowOffsetY=0;
			ctx.shadowBlur=0;
			
			for( var j=1; j<lineCnt; j++ ) {
			
				
			
					aRadar = [];
					ctx.beginPath();
					for(var i=1;i<pointCnt;i++){
					
						yHeight = (radius*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						Cd = 360 / (pointCnt-1) * (i-1) * Math.PI / 180;
						x = Math.ceil(Math.cos(Cd + startAngle) * yHeight + center[0])+0.5;
						y = Math.ceil(Math.sin(Cd + startAngle) * yHeight + center[1])+0.5;
						
						if(i != 1){
							ctx.lineTo(x,y);
						}else{
							ctx.moveTo(x,y);
						}
						aRadar.push([x,y]);
					}
					lineWidth = vo.lineWidth[(j-1)%vo.lineWidth.length];
					fillColor = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
					ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
					ctx.lineWidth = lineWidth;
					ctx.closePath();
					
					if( this.coordinateLegend[j-1][5] ){
						ctx.stroke();
						ctx.fillStyle = fillColor;
						ctx.fill();
					}
					// draw Radar point ================================
					if( vo.linePointSize[(j-1)%vo.linePointSize.length] != 0 ) {
						if( this.coordinateLegend[j-1][5] ){
							this.drawRadarPointer(x, y, pointCnt, j, lineWidth);
						}else{
							this.drawRadarPointer(x, y, pointCnt, j, lineWidth, false);
						}
					}
					// draw Radar point ================================
				
				
			}
			
		},
		drawRadarPointer : function( sX, sY, pointCnt, j, lineWidth, isDraw ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yHeight		= null;
			var d 			= this.aData;
			var ctx 		= this.graphics_item;
			var pointType	= vo.linePointType[(j-1)%vo.linePointType.length];
			var pointSize	= vo.linePointSize[(j-1)%vo.linePointSize.length];
			var pointColor	= vo.colors[(j-1)%vo.colors.length];
			var linePointColor = (vo.linePointColor)? vo.linePointColor[(j-1)%vo.linePointColor.length] : '#ffffff';
			var starHeight	= null;
			
			var Cd, startAngle=-(Math.PI/2);
			var radius=this.calculatedMargins.diameter/2;
			var center=this.calculatedMargins.center;
			
			for(var i=1;i<pointCnt;i++) {
				yHeight = (radius*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
				Cd = 360 / (pointCnt-1) * (i-1) * Math.PI / 180;
				sX = Math.ceil(Math.cos(Cd + startAngle) * yHeight + center[0])+0.5;
				sY = Math.ceil(Math.sin(Cd + startAngle) * yHeight + center[1])+0.5;
				
				ctx.beginPath();
				ctx.lineWidth = lineWidth;
				if( pointType == 'circle' ){
					ctx.arc(sX, sY, pointSize, 0, Math.PI*2, false);
				}else if( pointType == 'rectangle' ){
					ctx.fillRect(sX-pointSize, sY-pointSize, 2 * pointSize, 2 * pointSize);
					ctx.strokeRect(sX-pointSize, sY-pointSize, 2 * pointSize, 2 * pointSize);
					ctx.lineWidth = lineWidth/2;
				}else if( pointType == 'diamond' ){
					ctx.moveTo((sX-pointSize) + (1.3 * pointSize), sY - (1.3 * pointSize));
                    ctx.lineTo((sX-pointSize) + 2.6 * pointSize, sY);
                    ctx.lineTo((sX-pointSize) + (1.3 * pointSize), sY + (1.3 * pointSize));
                    ctx.lineTo((sX-pointSize), sY);
                    ctx.lineTo((sX-pointSize) + (1.3 * pointSize), sY - (1.3 * pointSize));
				}else if( pointType == 'upTriangle' ){
					ctx.moveTo((sX-pointSize), sY + pointSize);
                    ctx.lineTo((sX-pointSize) + pointSize, sY - pointSize);
                    ctx.lineTo((sX-pointSize) + 2 * pointSize, sY + pointSize);
                    ctx.lineTo((sX-pointSize), sY + pointSize);
				}else if( pointType == 'downTriangle' ){
					ctx.moveTo((sX-pointSize) + pointSize, sY + pointSize);
                    ctx.lineTo((sX-pointSize) + 2 * pointSize, sY - pointSize);
                    ctx.lineTo((sX-pointSize), sY - pointSize);
                    ctx.lineTo((sX-pointSize) + pointSize, sY + pointSize);
				}else if( pointType == 'star' ){
					starHeight = sY-pointSize/1.2;
					ctx.moveTo(sX, starHeight-pointSize/5);
					ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
					ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
					ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
					ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
					ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
					ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
					ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
					ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
					ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
					ctx.lineTo(sX, starHeight-pointSize/5)
				}
				ctx.closePath();
				ctx.fillStyle = linePointColor;
				ctx.strokeStyle = pointColor;
				if(isDraw != false){
					ctx.stroke();
					ctx.fill();
				}
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:sY
					  ,width:15
					  ,height:15
					};
				if(isDraw == false){
					aColumn.push({x:0,y:0,width:0,height:0});
				}else{
					aColumn.push(oCoor);
				}
				
			}
			this.coordinate.push(aColumn); 
		},
		setSelectRadarPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectLegendItem : function(e){
			var vo 			= this.options;
			var ctx 		= this.graphics_legend;
			var selectFlag	= false;
			var pointX, pointY, gap=10, x, y, width, height, color;
			if( arguments[2] ){
				var mouseCoords = this.getMouseXY(e, arguments[1], arguments[2]);
			}else{
				var mouseCoords = this.getMouseXY(e, arguments[1]);
			}	
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinateLegend.length;
			  
			for( var i=0;i<len;i++ ) {
			
				x = this.coordinateLegend[i][0];
				y = this.coordinateLegend[i][1];
				width = this.coordinateLegend[i][2];
				height = this.coordinateLegend[i][3];
				color = this.coordinateLegend[i][4];
				
				if( x < mx && mx < (x+width) ) {
					if( y < my && my < y+height ) {
					
						if( this.coordinateLegend[i][5] ){
							this.rect(ctx, x, y, width, height, '#e2e2e2', '');
							this.coordinateLegend[i][5] = false;
						}else{
							this.rect(ctx, x, y, width, height, color, '');
							this.coordinateLegend[i][5] = true;
						}
						
						//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
						this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
						this.drawRadarLegend();
						
					}
				}
				
			}
		},
		canvas_event_func_radar : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem, chartCanvas;
			var cb = function(elem){
				
					if(elem.nodeName == "DIV" && elem.__canvas_body){
						eThis = elem.__canvas_body;
						chartElem = elem;
					}else if(elem.nodeName == "canvas" ){
						chartCanvas = elem;
						cb(elem.parentElement);
					}else{
						cb(elem.parentElement);
					}
				
			};
			cb(target);
			if(e.target){
				if( target.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartElem);
					}
					return;
				}
			}else{
				if( chartCanvas.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartCanvas, true);
					}
					return;
				}
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectRadarPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectRadarPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}
		}
	});
	
	GLChart.TargetColumn = function(){
		GLChart.call(this, arguments);
		this.aSaveColumnCoordValue = [];
		this.aResultYHeight = [];
		this.targetColor = '#929292';
		this.chartType = 'targetColumn';
		this.options = {
			type : 'column'
			,columnOuterGap : 40
			,columnShadow : false
			// columnText position : (external, inside_top, inside_middle, inside_bottom) 4가지.
			,columnText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,targetColumnText : {on:false, position:'external', color:'#000000', fontName:'Gulim', fontSize:12}
			,columnType : 'rectangle'	// cylinder, rectangle.
			
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
	};
	GLChart.TargetColumn.prototype = new GLChart([]);
	GLChart.extend(GLChart.TargetColumn, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}
			
			if( o ){
				this.applyOptions( this.options, o );
			}	
			
			this.options.columnType = 'cylinder';
			this.options.colors[1] = this.targetColor;
			if( this.options.columnType == 'cylinder' ){
				this.options.is3D = true;
			}
			
			this.setCanvas();
			if( this.aData ){
				this.drawColumnChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
		},
		drawColumnChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawColumn();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			var vo = this.options;
			var line = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.04;
			var acc = this.support_userAgent.ie?0.12:0.09;
			var th;
			
			this.drawAxis();	
			this.calcColumnData();	
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			line.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0067;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				if(vo.is3D){
					if( vo.columnType == 'cylinder' ){
						th = line.yZero+(line.bottom3DGap/4);
					}else{
						th = line.yZero+(line.bottom3DGap/2);
					}	
				}else{
					th = line.yZero;
				}	
				th = th-(th*h);
				
				ctx.save();
				//ctx.clearRect(0,0,line.sWidth,line.sHeight);
				line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
				ctx.translate(0, th);
				ctx.scale(1, h);
				line.redrawColumnSameValue(h);
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,line.sWidth,line.sHeight);
					line.clearRect( line.oCanvas_item, ctx, line.sWidth, line.sHeight);
					line.drawColumn();
					window.clearInterval(line.animationInst);
					
					if( line.options.xRange.on ){
						line.drawRange();
					}
				}
			},50);
			
		},
		calcColumnData : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			this.aSaveColumnCoordValue = [];
			this.aResultYHeight = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var yZero = this.yZero;
			var columnCntHalf = ((columnCnt-1)/2);
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / columnCntHalf;
			var columnStart = sX + (xg - columnWidth) / 2;
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * columnCntHalf )) / 2;
				this.aSaveColumnCoordValue.push([]);
				
				for( var j=1; j<columnCnt; j++ ){
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.is3D ){
						if( vo.columnType == 'cylinder' ){
							if( j==1 ){
								this.aResultYHeight.push(yHeight);
							}
							this.calcColumn3DCylinderData(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}else{
							this.calcColumn3DData(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}	
					}else{
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						this.aSaveColumnCoordValue[i-1].push([columnStart, yZero, columnWidth, yHeight, grd, strokeColor]);
					}
					
					//columnStart = columnStart + columnWidth;
				}
				
				sX = sX + xg;
			}
			
		},
		calcColumn3DData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}else{
				grd3.addColorStop(0.2,lcolor);  
				grd3.addColorStop(1,color);
			}
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			
			this.aSaveColumnCoordValue[i-1].push([
													[x,yZero,x+10,yZero,x+10,y,x,y,'butt',grd]
													,[columnStart,tempY,x,tempY,x+10,tempY,columnStart+10,tempY,'butt',grd3]
													,[parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight, grd2]
												]);
		},
		calcColumn3DCylinderData : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			var tempY = yZero+yHeight+0.5;
			var arr = null, arr2 = null, arr3=null;
			
			if(j==2){
				color = this.targetColor;
			}else{
				color = vo.colors[(j-1)%vo.colors.length];
			}	
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			// cylinder 앞면
			if(j==2){
				var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
				grd2.addColorStop(0,'#ffffff'); 
				grd2.addColorStop(0.45,this.colorToRgba(lcolor,0.2)); 
				grd2.addColorStop(0.65,this.colorToRgba(color,0));
				grd2.addColorStop(0.83,this.colorToRgba(dcolor,0.2)); 
				grd2.addColorStop(0.93,'#ffffff'); 
			}else{
				var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
				grd2.addColorStop(0,dcolor); 
				grd2.addColorStop(0.45,lcolor); 
				grd2.addColorStop(0.65,color);
				grd2.addColorStop(0.83,dcolor); 
				grd2.addColorStop(0.93,lcolor); 
			}
			
			// column 아래면
			if(j==2){
				arr = [columnStart, yZero, cylinder3DGap, yHeight, columnWidth, grd2];
			}else{
				arr = [parseInt(columnStart,10), yZero-cylinder3DGap, parseInt(columnWidth,10), yHeight,grd2];
				// column 아래면
				bottomColor = grd2;
				if( yZero < y ){
					arr2 = [columnStart,(yHeight+yZero)-(this.bottom3DGap/2),columnWidth,10,bottomColor];
				}else{
					arr2 = [columnStart,yZero-(this.bottom3DGap/2),columnWidth,10,bottomColor];
				}
			}
			
			
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( yZero < y ){
				grd3 = dcolor;
				tempY = yZero;
			}
			
			if(j==2){
				if( yHeight < this.aResultYHeight[i-1] ){
					arr3=[columnStart,tempY-10,columnWidth,10,grd3];
				}else{
					arr3 = ['','','','',grd3];
				}
			}else{
				arr3=[columnStart,tempY-10,columnWidth,10,grd3];
			}
			
			
			
			this.aSaveColumnCoordValue[i-1].push([
													arr
													,arr2
													,arr3
												]);
		},
		redrawColumnSameValue : function(v){
			var vo 				= this.options;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var val				= this.aSaveColumnCoordValue;
			var calcVal;
			var color, lcolor, dcolor, strokeColor, y;
			var cv = ((this.bottom3DGap/2)/v);
			
			
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			for( var i=1; i<xCnt; i++ ){
				for( var j=1; j<columnCnt; j++ ){
					if( vo.is3D && val[i-1][j-1][2][3] != 0 && vo.columnType != 'cylinder' ){
						y = val[i-1][j-1][0][1]+(this.bottom3DGap/2);
						calcVal = val[i-1][j-1];
						// column 옆면.
						ctx.beginPath();
						ctx.moveTo(calcVal[0][0], calcVal[0][1]);
						ctx.lineTo(calcVal[0][2], calcVal[0][3]-cv);
						ctx.lineTo(calcVal[0][4], calcVal[0][5]-cv);
						ctx.lineTo(calcVal[0][6], calcVal[0][7]);
						ctx.lineCap = calcVal[0][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[0][9];
						ctx.fill();
						// column 윗면.
						ctx.beginPath();
						ctx.moveTo(calcVal[1][0], calcVal[1][1]);
						ctx.lineTo(calcVal[1][2], calcVal[1][3]);
						ctx.lineTo(calcVal[1][4], calcVal[1][5]-cv);
						ctx.lineTo(calcVal[1][6], calcVal[1][7]-cv);
						ctx.lineCap = calcVal[1][8];
						ctx.closePath();
						ctx.fillStyle = calcVal[1][9];
						ctx.fill();
						// column 앞면
						ctx.fillStyle = calcVal[2][4];
						ctx.fillRect(calcVal[2][0], calcVal[2][1], calcVal[2][2], calcVal[2][3]);
						
					}else if(vo.columnType == 'cylinder' && this.aData[i][j] != 0){
						y = val[i-1][j-1][0][1];
						calcVal = val[i-1][j-1];
						
						ctx.fillStyle = calcVal[0][5];
						
						
						// column 앞면
						if(j==2){
							ctx.globalAlpha = 0.4;
							//[columnStart, yZero, cylinder3DGap, yHeight, columnWidth, grd2];
							ctx.beginPath();
							ctx.moveTo(parseInt(calcVal[0][0],10), calcVal[0][1]-calcVal[0][2]);
							ctx.lineTo(parseInt(calcVal[0][0],10), (calcVal[0][1]-calcVal[0][2])+calcVal[0][3]);
							this._drawEllipseHalf(ctx,calcVal[0][0],(calcVal[0][1]-(this.bottom3DGap/2.2))+calcVal[0][3],calcVal[0][4],10, true);
							ctx.lineTo(parseInt(calcVal[0][0],10)+calcVal[0][4], calcVal[0][1]-calcVal[0][2]);
							this._drawEllipseHalf(ctx,parseInt(calcVal[0][0],10),calcVal[0][1]-calcVal[0][2],calcVal[0][4],5, false);
							ctx.fill();
						
							ctx.globalAlpha = 0.2;
							ctx.beginPath();
							ctx.moveTo( parseInt(calcVal[0][0],10)-0.5, calcVal[0][1]-calcVal[0][2] );
							ctx.lineTo( parseInt(calcVal[0][0],10)-0.5, (calcVal[0][1]-calcVal[0][2])+calcVal[0][3]+2 );
							ctx.strokeStyle = '#000000';
							ctx.stroke();
							ctx.beginPath();
							ctx.moveTo( parseInt(calcVal[0][0]+calcVal[0][4],10)+0.5, calcVal[0][1]-calcVal[0][2] );
							ctx.lineTo( parseInt(calcVal[0][0]+calcVal[0][4],10)+0.5, (calcVal[0][1]-calcVal[0][2])+calcVal[0][3]+2 );
							ctx.strokeStyle = '#000000';
							ctx.stroke();
							ctx.globalAlpha = 0.4;
						}else{
							//[parseInt(columnStart,10), yZero-cylinder3DGap, parseInt(columnWidth,10), yHeight,grd2];
							ctx.fillStyle = calcVal[0][4];
							ctx.fillRect(calcVal[0][0], calcVal[0][1], calcVal[0][2], calcVal[0][3]);
							// column 아래면
							ctx.beginPath();
							ctx.fillStyle = calcVal[0][4];
							this._drawEllipse(ctx,calcVal[1][0],calcVal[1][1],calcVal[1][2]-1,calcVal[1][3]);
						}
						
						if(j==2){
							if( calcVal[2][0] != '' ){
								ctx.beginPath();
								ctx.fillStyle = calcVal[2][4];
								this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
							}
							ctx.strokeStyle = this.targetColor;
							this._drawEllipseHalf(ctx,calcVal[0][0],(calcVal[0][1]-(this.bottom3DGap/2.2))+calcVal[0][3],calcVal[0][4],10, true);
							ctx.stroke();
							
							// 반사광.
							ctx.globalAlpha = 0.3;
							ctx.fillStyle = '#ffffff';
							ctx.beginPath();
							ctx.moveTo(parseInt(calcVal[0][0],10)+(calcVal[0][4]/8), (calcVal[0][1]-calcVal[0][2]+2));
							ctx.lineTo(parseInt(calcVal[0][0],10)+(calcVal[0][4]/8), (calcVal[0][1]-calcVal[0][2])+calcVal[0][3]+4);
							ctx.lineTo(parseInt(calcVal[0][0],10)+(calcVal[0][4]/8)+(calcVal[0][4]/11), (calcVal[0][1]-calcVal[0][2])+calcVal[0][3]+5);
							ctx.lineTo(parseInt(calcVal[0][0],10)+(calcVal[0][4]/8)+(calcVal[0][4]/11), (calcVal[0][1]-calcVal[0][2]+4));
							ctx.fill();
							ctx.globalAlpha = 1;
						}else{
							ctx.beginPath();
							ctx.fillStyle = calcVal[2][4];
							this._drawEllipse(ctx,calcVal[2][0],calcVal[2][1],calcVal[2][2]-1,calcVal[2][3]);
						}
						ctx.globalAlpha = 1;
						
						
					}else{
						y = val[i-1][j-1][1];
						ctx.fillStyle = val[i-1][j-1][4];
						ctx.fillRect(parseInt(val[i-1][j-1][0],10), y, parseInt(val[i-1][j-1][2],10)-1.5, val[i-1][j-1][3]);
					}
				
					
				}
			}
			//if(vo.is3D){alert(1);}
		},
		drawColumn : function(){
			var vo 				= this.options;
			var chartArea		= vo.chartArea;
			var height			= this.sHeight;
			var width			= this.sWidth;
			var ctx 			= this.graphics_item;
			var xCnt	 		= this.aData.length;
			var columnCnt		= this.aData[0].length;
			var d				= this.aData;
			var columnOuterGap 	= vo.columnOuterGap;
			var oCoor = null;
			var aColumn = [];
			this.coordinate 	= [];
			this.aSaveColumnCoordValue = [];
			this.aResultYHeight = [];
			var sX, sY, eX, eY, xg, yg, yHeight = null, color, lcolor, dcolor, strokeColor;
			var cOn				= vo.columnText.on;
			var cPosition		= vo.columnText.position;
			var cFontSize		= vo.columnText.fontSize;
			var cFontName		= vo.columnText.fontName;
			var cFontColor		= vo.columnText.color;
			var cSX, cSY, cText;
			var yZero = this.yZero;
			var columnCntHalf = ((columnCnt-1)/2);
			
			
			sX = this.calculatedMargins.x;
			sY = this.calculatedMargins.h + this.calculatedMargins.y;
			eX = sX;
			eY = this.calculatedMargins.y;
			xg = this.calculatedMargins.w / (xCnt-1);
			yg = this.calculatedMargins.h / (this.yLabels.length - 1);
			
			var columnWidth = ((xg * (100 - columnOuterGap)) / 100) / columnCntHalf;
			var columnStart = sX + (xg - columnWidth) / 2;
			
			if(vo.columnShadow && !vo.is3D){
				ctx.shadowColor="rgba(0,0,0,0.3)";
				ctx.shadowOffsetX=2;
				ctx.shadowOffsetY=1;
				ctx.shadowBlur=3;
			}
			
			for( var i=1; i<xCnt; i++ ){
				
				columnStart = sX + (xg - (columnWidth * columnCntHalf )) / 2;
				aColumn = [];
				
				for( var j=1; j<columnCnt; j++ ){
					if( this.calculatedMargins.y - yZero == 0 ){
						yHeight = (this.calculatedMargins.h * d[i][j]) / this.ranges.ymin;
					}else{
						yHeight = -((yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
					
					if( vo.is3D && yHeight != 0 ){
						if( vo.columnType == 'cylinder' ){
							if( j==1 ){
								this.aResultYHeight.push(yHeight);
							}
							this.drawColumn3DCylinder(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}else if( vo.columnType == 'rectangle' ){
							this.drawColumn3D(ctx, i, j, columnStart, columnWidth, yHeight, yZero);
						}	
					}else{
						color = vo.colors[(j-1)%vo.colors.length];
						strokeColor = this.adjustBrightness(color, -35);
						if( vo.theme.seriesGradientStyle+'' == '3' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -35);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.1,'#ffffff'); 
							grd.addColorStop(0.2,dcolor); 
							grd.addColorStop(0.55,color);
							grd.addColorStop(0.7,lcolor); 
							grd.addColorStop(0.73,lcolor); 
							grd.addColorStop(0.83,color); 
							grd.addColorStop(0.93,dcolor); 
						}else if( vo.theme.seriesGradientStyle+'' == '2' ){
							lcolor = this.adjustBrightness(color, 45);
							dcolor = this.adjustBrightness(color, -55);
							grd=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0); 
							grd.addColorStop(0,dcolor); 
							grd.addColorStop(0.33,color); 
							grd.addColorStop(0.5,lcolor); 
							grd.addColorStop(0.68,color);
							grd.addColorStop(1,dcolor); 
						}else{
							grd = color;
						}
						
						if( yHeight != 0 ){
							ctx.strokeStyle = strokeColor;
							ctx.lineWidth = 1; 
							ctx.strokeRect(parseInt(columnStart,10)+0.5, yZero, parseInt(columnWidth,10)-2.5, yHeight-0.5);
						}
						ctx.fillStyle = grd;
						ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10)-1.5, yHeight);
					}
					
					if( j == 2 ){
						cOn				= vo.targetColumnText.on;
						cPosition		= vo.targetColumnText.position;
						cFontSize		= vo.targetColumnText.fontSize;
						cFontName		= vo.targetColumnText.fontName;
						cFontColor		= vo.targetColumnText.color;
					}else{
						cOn				= vo.columnText.on;
						cPosition		= vo.columnText.position;
						cFontSize		= vo.columnText.fontSize;
						cFontName		= vo.columnText.fontName;
						cFontColor		= vo.columnText.color;
					}	
					
					if( cOn ){
						ctx.textAlign 	= 'center';
						ctx.fillStyle 	= cFontColor;
						ctx.font 		= 'normal '+cFontSize+'px "'+cFontName+'"';
						cSX 			= columnStart+columnWidth/2;
						if( cPosition == 'external' ){
							if( d[i][j] < 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero+yHeight-1;
							}else{
								ctx.textBaseline = 'bottom';
								cSY = yZero+yHeight-1;
							}
						}else if( cPosition == 'inside_top' ){
							if( d[i][j] <= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero+yHeight-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = yZero+yHeight+1;
							}
						}else if( cPosition == 'inside_middle' ){
							if( d[i][j] == 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero+yHeight-1;
							}else if( d[i][j] < 0 ){
								ctx.textBaseline = 'middle';
								cSY = yZero+(Math.abs(yHeight)/2);
							}else{
								ctx.textBaseline = 'middle';
								cSY = yZero-(Math.abs(yHeight)/2);
							}
						}else if( cPosition == 'inside_bottom' ){
							if( d[i][j] >= 0 ){
								ctx.textBaseline = 'bottom';
								cSY = yZero-1;
							}else{
								ctx.textBaseline = 'top';
								cSY = yZero+1;
							}
						}
						if( vo.is3D ){
							cSY += (this.bottom3DGap/2);
						}
						cText = this.formatter(d[i][j], vo.yAxis.format);
						ctx.fillText(cText, cSX, cSY);
					}	
					
					// 좌표저장
					if( j==2 ){
						if( this.aResultYHeight[i-1] > yHeight ){
							var startY = yZero-Math.abs(this.aResultYHeight[i-1]);
							var tempHeight = yHeight+Math.abs(this.aResultYHeight[i-1]);
						}else{
							var startY = yZero;
							var tempHeight = yHeight;
						}
						oCoor = {
						  x:parseInt(columnStart,10)
						  ,y:startY
						  ,width:parseInt(columnWidth,10)-1.5
						  ,height:tempHeight
						};
					}else{
						oCoor = {
						  x:parseInt(columnStart,10)
						  ,y:yZero
						  ,width:parseInt(columnWidth,10)-1.5
						  ,height:yHeight
						};
					}
					aColumn.push(oCoor);
			
					//columnStart = columnStart + columnWidth;
				}
				
				this.coordinate.push(aColumn); 
				
				sX = sX + xg;
			}
			
			if(vo.columnShadow){
				ctx.shadowColor="rgba(0,0,0,0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
		},
		drawColumn3D : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
			columnStart += 2;
			columnWidth -= 2;
			var vo = this.options;
			var color, lcolor, dcolor, grd;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			
			color = vo.colors[(j-1)%vo.colors.length];
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -55);
			
			// column 옆면.
			var grd=ctx.createLinearGradient(columnStart, y, columnStart, yZero); 
			grd.addColorStop(0,color);  
			grd.addColorStop(0.6,dcolor);
			ctx.beginPath();
			ctx.moveTo(x, yZero);
			ctx.lineTo(x+10, yZero-10);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(x, y);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y-10, columnStart, y); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( yZero < y ){
				grd3 = dcolor;
				y = yZero;
			}
			ctx.beginPath();
			ctx.moveTo(columnStart, y);
			ctx.lineTo(x, y);
			ctx.lineTo(x+10, y-10);
			ctx.lineTo(columnStart+10, y-10);
			ctx.lineCap = 'butt';
			ctx.closePath();
			ctx.fillStyle = grd3;
			ctx.fill();
			
			
			var grd2=ctx.createLinearGradient(columnStart, yZero+yHeight, columnStart, yZero); 
			grd2.addColorStop(0,lcolor);  
			grd2.addColorStop(0.6,color);
			ctx.fillStyle = grd2;
			ctx.fillRect(parseInt(columnStart,10), yZero, parseInt(columnWidth,10), yHeight);
		},
		drawColumn3DCylinder : function( ctx, i, j, columnStart, columnWidth, yHeight, yZero ){
		
			columnStart = Math.round(columnStart+2);
			columnWidth  = Math.round(columnWidth-2);
			var vo = this.options;
			var cylinder3DGap = this.bottom3DGap/4;
			var color, lcolor, dcolor, grd, bottomColor;
			var x = columnStart+columnWidth-1.5;
			yZero += (this.bottom3DGap/2);
			var y = yZero+yHeight+0.5;
			
			if(j==2){
				color = this.targetColor;
				vo.colors[(j-1)%vo.colors.length] = this.targetColor;
			}else{
				color = vo.colors[(j-1)%vo.colors.length];
			}	
			lcolor = this.adjustBrightness(color, 45);
			dcolor = this.adjustBrightness(color, -30);
			
			
			// cylinder 앞면
			if(j==2){
				var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
				grd2.addColorStop(0,'#ffffff'); 
				grd2.addColorStop(0.45,this.colorToRgba(lcolor,0.2)); 
				grd2.addColorStop(0.65,this.colorToRgba(color,0));
				grd2.addColorStop(0.83,this.colorToRgba(dcolor,0.2)); 
				grd2.addColorStop(0.93,'#ffffff'); 
				ctx.globalAlpha = 0.4;
			}else{
			
				var grd2=ctx.createLinearGradient(columnStart, 0, columnStart+columnWidth, 0);
				grd2.addColorStop(0,dcolor); 
				grd2.addColorStop(0.45,lcolor); 
				grd2.addColorStop(0.65,color);
				grd2.addColorStop(0.83,dcolor); 
				grd2.addColorStop(0.93,lcolor); 
				ctx.globalAlpha = 1;
			}
			ctx.fillStyle = grd2;
			
			if(j==2){
				ctx.beginPath();
				ctx.moveTo(parseInt(columnStart,10), yZero-cylinder3DGap);
				ctx.lineTo(parseInt(columnStart,10), (yZero-cylinder3DGap)+yHeight);
				this._drawEllipseHalf(ctx,columnStart,(yZero-(this.bottom3DGap/2.2))+yHeight,columnWidth,10, true);
				ctx.lineTo(parseInt(columnStart,10)+columnWidth, yZero-cylinder3DGap);
				this._drawEllipseHalf(ctx,parseInt(columnStart,10),yZero-cylinder3DGap,columnWidth,5, false);
				ctx.fill();
			
				ctx.globalAlpha = 0.2;
				ctx.beginPath();
				ctx.moveTo( parseInt(columnStart,10)-0.5, yZero-cylinder3DGap );
				ctx.lineTo( parseInt(columnStart,10)-0.5, (yZero-cylinder3DGap)+yHeight+2 );
				ctx.strokeStyle = '#000000';
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo( parseInt(columnStart+columnWidth,10)+0.5, yZero-cylinder3DGap );
				ctx.lineTo( parseInt(columnStart+columnWidth,10)+0.5, (yZero-cylinder3DGap)+yHeight+2 );
				ctx.strokeStyle = '#000000';
				ctx.stroke();
				ctx.globalAlpha = 0.4;
			}else{
				ctx.fillRect(parseInt(columnStart,10), yZero-cylinder3DGap, parseInt(columnWidth,10), yHeight);
				// column 아래면
				bottomColor = grd2;
				ctx.beginPath();
				ctx.fillStyle = bottomColor;
				if( yZero < y ){
					this._drawEllipse(ctx,columnStart,(yHeight+yZero)-(this.bottom3DGap/2),columnWidth,10);
				}else{
					this._drawEllipse(ctx,columnStart,yZero-(this.bottom3DGap/2),columnWidth,10);
				}
			}
			
			// column 윗면.
			var grd3=ctx.createLinearGradient(columnStart, y, columnStart, y-(this.bottom3DGap/2)); 
			grd3.addColorStop(0.2,lcolor);  
			grd3.addColorStop(1,color);
			if( yZero < y ){
				grd3 = dcolor;
				y = yZero;
			}
			ctx.beginPath();
			ctx.fillStyle = grd3;
			
			//this._drawEllipse(ctx,columnStart,y-10,columnWidth,10);
			
			
			if(j==2){
				if( yHeight < this.aResultYHeight[i-1] ){
					this._drawEllipse(ctx,columnStart,y-10,columnWidth,10);
				}
				ctx.strokeStyle = this.targetColor;
				this._drawEllipseHalf(ctx,columnStart,(yZero-(this.bottom3DGap/2.2))+yHeight,columnWidth,10, true);
				ctx.stroke();
				
				// 반사광.
				ctx.globalAlpha = 0.3;
				ctx.fillStyle = '#ffffff';
				ctx.beginPath();
				ctx.moveTo(parseInt(columnStart,10)+(columnWidth/8), (yZero-cylinder3DGap+2));
				ctx.lineTo(parseInt(columnStart,10)+(columnWidth/8), (yZero-cylinder3DGap)+yHeight+4);
				ctx.lineTo(parseInt(columnStart,10)+(columnWidth/8)+(columnWidth/11), (yZero-cylinder3DGap)+yHeight+5);
				ctx.lineTo(parseInt(columnStart,10)+(columnWidth/8)+(columnWidth/11), (yZero-cylinder3DGap+4));
				ctx.fill();
				ctx.globalAlpha = 1;
			}else{
				this._drawEllipse(ctx,columnStart,y-10,columnWidth,10);
			}
			
			ctx.globalAlpha = 1;
		},
		setSelectColumnPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=7;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x;
					var y = this.coordinate[i][j].y;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap ;
								pointY = height - gap;
								this.drawTooltip( e, [i, j], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		canvas_event_func_targetColumn : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			if( target.id == eThis.sContainer+'___legend' ){
				return;
			}
			
			if(e.type=='mousemove'){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mousedown' ){
				eThis.setSelectColumnPoint(e, chartElem);
			}else if( e.type=='mouseup' ){
					
			}
		},
		_drawEllipseHalf : function (ctx, x, y, w, h, clockwise) {
			var CN = 0.5522848;
			ox = (w / 2) * CN, oy = (h / 2) * CN, xe = x + w, ye = y + h, xm = x + w / 2, ym = y + h / 2;
			if( clockwise ){
				ctx.lineTo(x, ym);
				ctx.bezierCurveTo(x, ym + oy, xm - ox, y+h, xm, y+h);
				ctx.bezierCurveTo(xm + ox, y+h, xe, ym + oy, xe, ym);
				//ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
				//ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
				//ctx.fill();
			}else{
				ctx.lineTo(x, y);
				ctx.bezierCurveTo(x, ym + oy, xm - ox, y+h, xm, y+h);
				ctx.bezierCurveTo(xm + ox, y+h, xe, ym + oy, xe, y);
				//ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
				//ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
				//ctx.fill();
			}
		}
	});
	
	GLChart.AreaRange = function(){
		GLChart.call(this, arguments);
		this.aSaveLineCoordValue = [];
		this.aSaveLineCoordValue_min = [];
		this.aSaveLineCoordValue_max = [];
		this.options = {
			type : 'areaRange'
			,areaLineWidth : [2]
			,areaLineShadow : false
			,areaLineType : 'normal'	// 'normal', 'curve', 'step'
			,areaLinePointSize : [3]
			,areaLinePointType : ['circle']	// circle, rectangle, diamond, upTriangle, downTriangle, star
			,areaOpacity : 0.3
			,areaRangeColor : null
			,areaRangeLineColor : null
			,areaRangeLineWidth : null
			,yAxis : {
				maxValue : 'auto'
			}
		};
		if( !arguments[1] || !arguments[2] ){
			this.sWidth = this.sWidth || GLChart.$(this.sContainer).clientWidth;
			this.sHeight = this.sHeight || GLChart.$(this.sContainer).clientHeight;
		}
		this.applyOptions(this.options, this.common_options);
		this.options.is3D = false;
	};
	GLChart.AreaRange.prototype = new GLChart([]);
	GLChart.extend(GLChart.AreaRange, {
		render : function( o ){
			if( this.hasChart ){
				return;
			}else{
				this.hasChart = true;
			}	
		
			if( o ){
				o.is3D = false;
				this.applyOptions( this.options, o );
			}	
			this.setCanvas();
			if( this.aData ){
				this.drawAreaRangeChart();
				if( this.options.legend.position != 'none' ){
					this.drawLegend();
				}
			}
			
			var o = GLChart.$(this.sContainer);
			o.__canvas_body = this;
			this.setTouchEvent();
			this.addEvent("mousedown", o, this.eventListener);
			this.addEvent("mousemove", o, this.eventListener);
			this.addEvent("mouseup", o, this.eventListener);
			this.addEvent("click", o, this.eventListener);
			
			
			
			if( this.aSelectItem && typeof this.options.events.click == 'function'){
			
				var aSelect = [this.aSelectItem[0].row, this.aSelectItem[0].column];
				var returnData = {};
			
				var xx = this.coordinate[aSelect[1]][aSelect[0]].x;
				var yy = this.coordinate[aSelect[1]][aSelect[0]].y; 
			
				returnData.index = [aSelect[1]+1, this.rangeStartIndex + aSelect[0]+1];
				returnData.data = {
					x: (this.aData[aSelect[0]+1][0])
					,y:(this.aData[aSelect[0]+1][aSelect[1]+1])
					,pointX : xx
					,pointY : yy
				};
				this.options.events.click(null, returnData);
			}
			
		},
		drawAreaRangeChart : function(){
			if( this.hasChart ){
				//this.graphics.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_grid.clearRect(0,0,this.sWidth,this.sHeight);
				//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
				this.clearRect( this.oCanvas_body, this.graphics, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_grid, this.graphics_grid, this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			}
			
			if( this.options.animation ){
				this.setAnimation();
			}else{
				this.drawAxis();
				this.drawArea();
				this.drawCaptionText('title');
				this.drawCaptionText('xName');
				this.drawCaptionText('yName');
				
				if( this.options.xRange.on ){
					this.drawRange();
				}
			}
			
		},
		setAnimation : function(){
			var ctx = this.graphics_item;
			
			var area = this;
			var tempHeight = this.sHeight-(this.options.chartArea.top+this.options.chartArea.bottom);
			var tempHeight2 = this.sHeight;
			var h = 0.01;
			var acc = 0.07;
			var th;
			
			this.drawAxis();
			this.drawArea('calc');
			this.drawCaptionText('title');
			this.drawCaptionText('xName');
			this.drawCaptionText('yName');
			ctx.save();
			
			this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			
			area.animationInst = window.setInterval( function(){
				
				if( h > 0.45 ){
					if( acc > 0 && acc > 0.01 ){
						acc -= 0.0047;
					}else{
						acc = 0.01;
					}	
				}
				h = h+acc;
				
				th = area.calculatedMargins.h+area.calculatedMargins.y;
				th = th-(th*h);
				
				ctx.save();
				ctx.translate(0, th);
				ctx.scale(1, h);
				area.redrawAreaSameValue();
				ctx.restore();
				
				if( h >= 1){
					ctx.restore();
					//ctx.clearRect(0,0,area.sWidth,area.sHeight);
					area.clearRect( area.oCanvas_item, area.graphics_item, area.sWidth, area.sHeight);
					area.drawArea();
					window.clearInterval(area.animationInst);
					
					if( area.options.xRange.on ){
						area.drawRange();
					}
				}
			},40);
			
		},
		redrawAreaSameValue : function(){
			var vo 			= this.options;
			var ctx 		= this.graphics_item;
			var val			= this.aSaveLineCoordValue;
			var val_min		= this.aSaveLineCoordValue_min;
			var val_max		= this.aSaveLineCoordValue_max;
			var areaCnt		= this.aData[0].length;
			var len			= val.length;
			var areaWidth;
			
			//ctx.clearRect(0,0,this.sWidth,this.sHeight);
			this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
			
			for( var j=1; j<areaCnt; j++ ) {
				areaWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				if( vo.areaLineShadow && areaWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				len	= val[j-1].length;
				for( var i=0;i<len;i++ ){
					if( vo.areaLineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val_min[j-1][i][0], val_min[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val_min[j-1][i][0], val_min[j-1][i][1], val_min[j-1][i][2], val_min[j-1][i][3], val_min[j-1][i][4], val_min[j-1][i][5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val_min[j-1][i][0], val_min[j-1][i][1]);
						}else{
							ctx.lineTo(val_min[j-1][i][0], val_min[j-1][i][1]);
							ctx.lineTo(val_min[j-1][i][2], val_min[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val_min[j-1][i][0], val_min[j-1][i][1]);
						}else{
							ctx.lineTo(val_min[j-1][i][0], val_min[j-1][i][1]);
						}
					}
				}
				
				var maxVal2, maxVal3;
				for( var i=len;i>0;i-- ){
				
					maxVal2 = val_max[j-1][i-1];
					maxVal3 = val_max[j-1][i];
				
					if( vo.areaLineType == 'curve' ) {
						if( i==len ){
							ctx.lineTo(maxVal2[4], maxVal2[5]);
						}else if( i == 1 ){
							ctx.bezierCurveTo( maxVal3[2], maxVal3[3], maxVal3[0], maxVal3[1], maxVal2[0], maxVal2[1]);
						}else{
							ctx.bezierCurveTo( maxVal3[2], maxVal3[3], maxVal3[0], maxVal3[1], maxVal2[4], maxVal2[5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==len ){
							ctx.lineTo(maxVal2[2], maxVal2[3]);
						}else if( i == 1 ){
							ctx.lineTo( maxVal3[0], maxVal3[1]);
							ctx.lineTo( maxVal2[0], maxVal2[1]);
						}else{
							ctx.lineTo( maxVal3[0], maxVal3[1]);
							ctx.lineTo( maxVal2[2], maxVal2[3]);
						}
					}else{
						if( i==len ){
							ctx.lineTo(maxVal2[0], maxVal2[1]);
						}else if( i == 1 ){
							ctx.lineTo( maxVal3[0], maxVal3[1]);
							ctx.lineTo( maxVal2[0], maxVal2[1]);
						}else{
							ctx.lineTo( maxVal3[0], maxVal3[1]);
						}
					}
				}
				
				if(vo.areaRangeColor && vo.areaRangeColor.constructor == Array){
					ctx.fillStyle = this.colorToRgba(vo.areaRangeColor[(j-1)%vo.areaRangeColor.length], vo.areaOpacity);
				}else{
					ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				}
				
				ctx.fill();
				
				ctx.beginPath();
				for( var i=0;i<len;i++ ){
					if( vo.areaLineType == 'curve' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.bezierCurveTo( val[j-1][i][0], val[j-1][i][1], val[j-1][i][2], val[j-1][i][3], val[j-1][i][4], val[j-1][i][5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
							ctx.lineTo(val[j-1][i][2], val[j-1][i][3]);
						}
						
					}else{
						if( i==0 ){
							ctx.moveTo(val[j-1][i][0], val[j-1][i][1]);
						}else{
							ctx.lineTo(val[j-1][i][0], val[j-1][i][1]);
						}
					}
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaWidth;
				ctx.stroke();
				
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
				ctx.lineWidth = 1;
			}
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawArea : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var areaCnt		= this.aData[0].length;
			var d			= this.aData;
			var rangeData	= null;
			var areaLineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue_min = [];
			this.aSaveLineCoordValue_max = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight_min, yHeight_min = null, yTempHeight_max = null, yHeight_max = null;
			
			for( var j=1; j<areaCnt; j++ ) {
			
				rangeData = this.oRangeData[d[0][j]];
				if(!rangeData && rangeData.constructor != Array){
					continue;
				}
			
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 2);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				//sX = sX + (xg/2);
				areaLineWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				
				if( vo.areaLineShadow && areaLineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.areaLineType == 'curve' || vo.areaLineType == 'step' ) {
					var fx = null;
					var fy = null;
					var rx = null;
					var ry = null;
					  
					var divideVal = 3;
					var tempDivideVal = 0;
					var tempDivideVal_2 = 0;
					var tempDivideVal2 = 0;
					var tempDivideVal3 = 0;
					var tempDivideVal3_2 = 0;
					var tempDivideVal4 = 0;
					  
					var fy_max = null;
					var ry_max = null;
					var max_tempDivideVal = 0;
					var max_tempDivideVal_2 = 0;
					var max_tempDivideVal2 = 0;
					var max_tempDivideVal3 = 0;
					var max_tempDivideVal3_2 = 0;
					var max_tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue_min.push([]);
				this.aSaveLineCoordValue_max.push([]);
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight_min = (this.calculatedMargins.h*(rangeData[i][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight_min = (this.calculatedMargins.h - yTempHeight_min)+this.calculatedMargins.y;
						yTempHeight_max = (this.calculatedMargins.h*(rangeData[i][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight_max = (this.calculatedMargins.h - yTempHeight_max)+this.calculatedMargins.y;
					}else{
						yHeight_min = this.yZero - ((this.yZero - this.calculatedMargins.y) * rangeData[i][0]) / this.ranges.ymax;
						yHeight_max = this.yZero - ((this.yZero - this.calculatedMargins.y) * rangeData[i][1]) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.areaLineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([sX, yHeight_max]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight_min;
							ry_max = yHeight_max;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(rangeData[i-2][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2 = (this.calculatedMargins.h*(rangeData[i][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								max_tempDivideVal3  = (this.calculatedMargins.h*(rangeData[i-2][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								max_tempDivideVal3_2 = (this.calculatedMargins.h*(rangeData[i][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight_min = this.yZero - ((this.yZero - this.calculatedMargins.y) * rangeData[i][0]) / this.ranges.ymax;
								yHeight_max = this.yZero - ((this.yZero - this.calculatedMargins.y) * rangeData[i][1]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							
							max_tempDivideVal3 = isNaN(max_tempDivideVal3 - max_tempDivideVal3_2)? 0:max_tempDivideVal3 - max_tempDivideVal3_2;
							max_tempDivideVal4 = Math.abs(max_tempDivideVal3) /(divideVal*2);
							if( max_tempDivideVal3 < 0 ){
								fy_max = fy_max - max_tempDivideVal4;
							}else{
								fy_max = fy_max + max_tempDivideVal4;
							}
							
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([fx, fy, rx, ry, sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([fx, fy_max, rx, ry_max, sX, yHeight_max]);
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight_min;
							ry_max = yHeight_max;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(rangeData[i+1][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(rangeData[i-1][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(rangeData[i-2][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(rangeData[i][0]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								
								max_tempDivideVal   = (this.calculatedMargins.h*(rangeData[i+1][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								max_tempDivideVal_2 = (this.calculatedMargins.h*(rangeData[i-1][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								max_tempDivideVal3  = (this.calculatedMargins.h*(rangeData[i-2][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								max_tempDivideVal3_2  = (this.calculatedMargins.h*(rangeData[i][1]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight_min = this.yZero - ((this.yZero - this.calculatedMargins.y) * rangeData[i][0]) / this.ranges.ymax;
								yHeight_max = this.yZero - ((this.yZero - this.calculatedMargins.y) * rangeData[i][1]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							max_tempDivideVal = max_tempDivideVal_2 - max_tempDivideVal;
							max_tempDivideVal2 = Math.abs(max_tempDivideVal) /(divideVal*2);
							max_tempDivideVal3 = isNaN(max_tempDivideVal3 - max_tempDivideVal3_2)? 0:max_tempDivideVal3 - max_tempDivideVal3_2;
							max_tempDivideVal4 = Math.abs(max_tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							
							if( max_tempDivideVal < 0 ){
								ry_max = ry_max + max_tempDivideVal2;
							}else{
								ry_max = ry_max - max_tempDivideVal2;
							}
							if( max_tempDivideVal3 < 0 ){
								fy_max = fy_max - max_tempDivideVal4;
							}else{
								fy_max = fy_max + max_tempDivideVal4;
							}
							
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([fx, fy, rx, ry, sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([fx, fy_max, rx, ry_max, sX, yHeight_max]);
						}
					}else if( vo.areaLineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([sX, yHeight_max]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([sX, fy, sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([sX, fy_max, sX, yHeight_max]);
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([sX, yHeight_max]);
						}else{
							ctx.lineTo(sX, yHeight_min);
							this.aSaveLineCoordValue_min[j-1].push([sX, yHeight_min]);
							this.aSaveLineCoordValue_max[j-1].push([sX, yHeight_max]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight_min;
					fy_max = yHeight_max;
					sX = sX + xg;
					eX = sX;
				}
				
				
				var maxVal = this.aSaveLineCoordValue_max[j-1], maxVal2, maxVal3;
				for( var i=maxVal.length,maxLen=maxVal.length;i>0;i-- ){
				
					maxVal2 = this.aSaveLineCoordValue_max[j-1][i-1];
					maxVal3 = this.aSaveLineCoordValue_max[j-1][i];
				
					if( vo.areaLineType == 'curve' ) {
						if( i==maxLen ){
							ctx.lineTo(maxVal2[4], maxVal2[5]);
						}else if( i == 1 ){
							ctx.bezierCurveTo( maxVal3[2], maxVal3[3], maxVal3[0], maxVal3[1], maxVal2[0], maxVal2[1]);
						}else{
							ctx.bezierCurveTo( maxVal3[2], maxVal3[3], maxVal3[0], maxVal3[1], maxVal2[4], maxVal2[5]);
						}
					}else if( vo.areaLineType == 'step' ) {
						if( i==maxLen ){
							ctx.lineTo(maxVal2[2], maxVal2[3]);
						}else if( i == 1 ){
							ctx.lineTo( maxVal3[0], maxVal3[1]);
							ctx.lineTo( maxVal2[0], maxVal2[1]);
						}else{
							ctx.lineTo( maxVal3[0], maxVal3[1]);
							ctx.lineTo( maxVal2[2], maxVal2[3]);
						}
					}else{
						if( i==maxLen ){
							ctx.lineTo(maxVal2[0], maxVal2[1]);
						}else if( i == 1 ){
							ctx.lineTo( maxVal3[0], maxVal3[1]);
							ctx.lineTo( maxVal2[0], maxVal2[1]);
						}else{
							ctx.lineTo( maxVal3[0], maxVal3[1]);
						}
					}
				}
				
				if(vo.areaRangeColor && vo.areaRangeColor.constructor == Array){
					ctx.fillStyle = this.colorToRgba(vo.areaRangeColor[(j-1)%vo.areaRangeColor.length], vo.areaOpacity);
				}else{
					ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
				}	
				
				if( !arguments[0] ){
					ctx.fill();
					
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
					
				}	
				
				
				if( vo.areaRangeLineColor && vo.areaRangeLineColor.constructor == Array ){
					var maxVal_line, minVal_line;
					ctx.beginPath();
					
					if(vo.areaRangeLineColor && vo.areaRangeLineColor.constructor == Array){
						ctx.strokeStyle = vo.areaRangeLineColor[(j-1)%vo.areaRangeLineColor.length];
					}else{
						ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
					}
					
					if(vo.areaRangeLineWidth && vo.areaRangeLineWidth.constructor == Array){
						ctx.lineWidth = vo.areaRangeLineWidth[(j-1)%vo.areaRangeLineWidth.length];
					}else{
						ctx.lineWidth = 1;
					}
					
					for( var i=0,maxLen=maxVal.length;i<maxLen;i++ ){
						maxVal_line = this.aSaveLineCoordValue_max[j-1][i];
						if( i==maxLen-1 ){
							ctx.lineTo(maxVal_line[0], maxVal_line[1]);
						}else if( i == 0 ){
							ctx.moveTo( maxVal_line[0], maxVal_line[1]);
						}else{
							ctx.lineTo( maxVal_line[0], maxVal_line[1]);
						}
					}
					ctx.stroke();
					ctx.beginPath();
					for( var i=0,minLen=maxVal.length;i<minLen;i++ ){
						minVal_line = this.aSaveLineCoordValue_min[j-1][i];
						if( i==minLen-1 ){
							ctx.lineTo(minVal_line[0], minVal_line[1]);
						}else if( i == 0 ){
							ctx.moveTo( minVal_line[0], minVal_line[1]);
						}else{
							ctx.lineTo( minVal_line[0], minVal_line[1]);
						}
					}
					ctx.stroke();
					ctx.lineWidth = 1;
				}
				
				
			}
			
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
			
			this.drawAreaStandardLine();
		},
		drawAreaStandardLine : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var areaCnt		= this.aData[0].length;
			var d			= this.aData;
			var areaLineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null, yHeight_min = null, yHeight_max = null;
			
			for( var j=1; j<areaCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 2);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				//sX = sX + (xg/2);
				areaLineWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				
				if( vo.areaLineShadow && areaLineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.areaLineType == 'curve' || vo.areaLineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue.push([]);
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.areaLineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}
					}else if( vo.areaLineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight;
					sX = sX + xg;
					eX = sX;
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaLineWidth;
				if( !arguments[0] ){
					ctx.stroke();
					
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
					
				}	
				ctx.lineWidth = 1;
				
				// draw line point ================================
				//if( vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length] != 0 && !arguments[0] ) {
				if( !arguments[0] ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 2);
					//sX = sX + (xg/2);
					this.drawAreaPointer(sX, xg, pointCnt, j, areaLineWidth);
				}
				// draw line point ================================
				
			}
			
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawAreaLegend : function(){
			var vo 			= this.options;
			var chartArea	= vo.chartArea;
			var height		= this.sHeight;
			var width		= this.sWidth;
			var ctx 		= this.graphics_item;
			var pointCnt 	= this.aData.length;
			var areaCnt		= this.aData[0].length;
			var d			= this.aData;
			var areaLineWidth	= 1;
			this.coordinate = [];
			this.aSaveLineCoordValue = [];
			
			var sX, sY, eX, eY, xg, yg, yTempHeight, yHeight = null;
			
			for( var j=1; j<areaCnt; j++ ) {
				sX = this.calculatedMargins.x;
				sY = this.calculatedMargins.h + this.calculatedMargins.y;
				eX = sX;
				eY = this.calculatedMargins.y;
				xg = this.calculatedMargins.w / (pointCnt - 2);
				yg = this.calculatedMargins.h / (this.yLabels.length - 1);
				//sX = sX + (xg/2);
				areaLineWidth = vo.areaLineWidth[(j-1)%vo.areaLineWidth.length];
				
				if( vo.areaLineShadow && areaLineWidth != 1 ) {
					ctx.shadowColor="rgba(0, 0, 0, 0.5)";
					ctx.shadowOffsetX=2;
					ctx.shadowOffsetY=2;
					ctx.shadowBlur=2;
				}
				
				ctx.beginPath();
				
				if( vo.areaLineType == 'curve' || vo.areaLineType == 'step' ) {
				  var fx = null;
				  var fy = null;
				  var rx = null;
				  var ry = null;
				  var fH = null;
				  var rH = null;
				  var divideVal = 3;
				  var tempDivideVal = 0;
				  var tempDivideVal_2 = 0;
				  var tempDivideVal2 = 0;
				  var tempDivideVal3 = 0;
				  var tempDivideVal3_2 = 0;
				  var tempDivideVal4 = 0;
				  
				}
				
				this.aSaveLineCoordValue.push([]);
				
				for(var i=1;i<pointCnt;i++) {
					if( vo.yAxis.minValue == 'auto' ){
						yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
						yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
					}else{
						yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
					}
				  
					// draw bezierCurve 
					if( vo.areaLineType == 'curve' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else if(i==pointCnt-1){
							rx = sX;
							ry = yHeight;
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}else{
							rx = sX-(xg/divideVal);
							ry = yHeight;
							
							if( vo.yAxis.minValue == 'auto' ){
								tempDivideVal   = (this.calculatedMargins.h*(d[i+1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal_2 = (this.calculatedMargins.h*(d[i-1][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3  = (this.calculatedMargins.h*(d[i-2][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
								tempDivideVal3_2  = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
							}else{
								yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
							}
							tempDivideVal = tempDivideVal_2 - tempDivideVal;
							tempDivideVal2 = Math.abs(tempDivideVal) /(divideVal*2);
							tempDivideVal3 = isNaN(tempDivideVal3 - tempDivideVal3_2)? 0:tempDivideVal3 - tempDivideVal3_2;
							tempDivideVal4 = Math.abs(tempDivideVal3) /(divideVal*2);
							
							if( tempDivideVal < 0 ){
								ry = ry + tempDivideVal2;
							}else{
								ry = ry - tempDivideVal2;
							}
							if( tempDivideVal3 < 0 ){
								fy = fy - tempDivideVal4;
							}else{
								fy = fy + tempDivideVal4;
							}
							ctx.bezierCurveTo( fx, fy, rx, ry, sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([fx, fy, rx, ry, sX, yHeight]);
						}
					}else if( vo.areaLineType == 'step' ){
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, fy);
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, fy, sX, yHeight]);
						}
					}else{
						if( i==1 ){
							ctx.moveTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}else{
							ctx.lineTo(sX, yHeight);
							this.aSaveLineCoordValue[j-1].push([sX, yHeight]);
						}	
					}
				
					fx = (i==1)?sX:(sX+(xg/divideVal));
					fy = yHeight;
					sX = sX + xg;
					eX = sX;
				}
				ctx.strokeStyle = vo.colors[(j-1)%vo.colors.length];
				ctx.lineWidth = areaLineWidth;
				if( this.coordinateLegend[j-1][5] ){
					ctx.stroke();
				
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
					ctx.lineTo(this.calculatedMargins.w+this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					ctx.lineTo(this.calculatedMargins.x, this.calculatedMargins.h+this.calculatedMargins.y);
					ctx.fillStyle = this.colorToRgba(vo.colors[(j-1)%vo.colors.length], vo.areaOpacity);
					ctx.fill();
					
				}	
				ctx.lineWidth = 1;
				
				// draw line point ================================
				if( vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length] != 0 ) {
					sX = this.calculatedMargins.x;
					xg = this.calculatedMargins.w / (pointCnt - 2);
					//sX = sX + (xg/2);
					if( this.coordinateLegend[j-1][5] ){
						this.drawAreaPointer(sX, xg, pointCnt, j, areaLineWidth);
					}else{
						this.drawAreaPointer(sX, xg, pointCnt, j, areaLineWidth, false);
					}
				}
				// draw line point ================================
				
			}
			
			if( vo.areaLineShadow ) {
				ctx.shadowColor="rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX=0;
				ctx.shadowOffsetY=0;
				ctx.shadowBlur=0;
			}
		},
		drawAreaPointer : function( sX, xg, pointCnt, j, areaLineWidth, isDraw ){
			var oCoor 		= null;
			var aColumn 	= [];
			var vo 			= this.options;
			var yTempHeight = null, yHeight=null;
			var d 			= this.aData;
			var chartArea 	= vo.chartArea;
			var ctx 		= this.graphics_item;
			var pointType	= vo.areaLinePointType[(j-1)%vo.areaLinePointType.length];
			var pointSize	= vo.areaLinePointSize[(j-1)%vo.areaLinePointSize.length];
			var pointColor	= vo.colors[(j-1)%vo.colors.length];
			var starHeight	= null;
			
			for(var i=1;i<pointCnt;i++) {
				if( vo.yAxis.minValue == 'auto' ){
					yTempHeight = (this.calculatedMargins.h*(d[i][j]-this.ranges.ymin)) / (this.ranges.ymax-this.ranges.ymin);
					yHeight = (this.calculatedMargins.h - yTempHeight)+this.calculatedMargins.y;
				}else{
					yHeight = this.yZero - ((this.yZero - this.calculatedMargins.y) * d[i][j]) / this.ranges.ymax;
				}
				
				if( i==1 ){
					ctx.shadowColor="rgba(0, 0, 0, 0)";
					ctx.shadowOffsetX=0;
					ctx.shadowOffsetY=0;
					ctx.shadowBlur=0;
				}
				ctx.beginPath();
				ctx.lineWidth = areaLineWidth;
				if( pointType == 'circle' ){
					ctx.arc(sX, yHeight, pointSize, 0, Math.PI*2, false);
				}else if( pointType == 'rectangle' ){
					ctx.fillRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					ctx.strokeRect(sX-pointSize, yHeight-pointSize, 2 * pointSize, 2 * pointSize);
					ctx.lineWidth = areaLineWidth/2;
				}else if( pointType == 'diamond' ){
					ctx.moveTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
                    ctx.lineTo((sX-pointSize) + 2.6 * pointSize, yHeight);
                    ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight + (1.3 * pointSize));
                    ctx.lineTo((sX-pointSize), yHeight);
                    ctx.lineTo((sX-pointSize) + (1.3 * pointSize), yHeight - (1.3 * pointSize));
				}else if( pointType == 'upTriangle' ){
					ctx.moveTo((sX-pointSize), yHeight + pointSize);
                    ctx.lineTo((sX-pointSize) + pointSize, yHeight - pointSize);
                    ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight + pointSize);
                    ctx.lineTo((sX-pointSize), yHeight + pointSize);
				}else if( pointType == 'downTriangle' ){
					ctx.moveTo((sX-pointSize) + pointSize, yHeight + pointSize);
                    ctx.lineTo((sX-pointSize) + 2 * pointSize, yHeight - pointSize);
                    ctx.lineTo((sX-pointSize), yHeight - pointSize);
                    ctx.lineTo((sX-pointSize) + pointSize, yHeight + pointSize);
				}else if( pointType == 'star' ){
					starHeight = yHeight-pointSize/1.2;
					ctx.moveTo(sX, starHeight-pointSize/5);
					ctx.lineTo(sX + pointSize / 3, starHeight + pointSize / 2);
					ctx.lineTo(sX + pointSize, starHeight + pointSize / 2);
					ctx.lineTo(sX + pointSize - pointSize / 2, starHeight + pointSize);
					ctx.lineTo(sX + pointSize/1.3, starHeight + pointSize * 1.7);
					ctx.lineTo(sX, starHeight + pointSize * 2 - pointSize / 1.5);
					ctx.lineTo(sX - pointSize/1.3, starHeight + pointSize * 1.7);
					ctx.lineTo(sX - pointSize + pointSize / 2, starHeight + pointSize);
					ctx.lineTo(sX - pointSize, starHeight + pointSize / 2);
					ctx.lineTo(sX - pointSize / 3, starHeight + pointSize / 2);
					ctx.lineTo(sX, starHeight-pointSize/5)
				}
				ctx.closePath();
				ctx.fillStyle = '#ffffff';
				ctx.strokeStyle = pointColor;
				if( isDraw != false ){
					ctx.stroke();
					ctx.fill();
				}
				
				
				// 좌표저장
				oCoor = {
					  x:sX
					  ,y:yHeight
					  ,width:15
					  ,height:15
					};
				if( isDraw == false ){
					aColumn.push({x:0,y:0,width:0,height:0});
				}else{
					aColumn.push(oCoor);
				}
				
				sX = sX + xg;
			}
			this.coordinate.push(aColumn); 
		},
		setSelectAreaPoint : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}else{
							if( height > my && my > y ) {
							
								pointX = x+(width/2) + gap;
								pointY = height - gap-5;
								this.drawTooltip( e, [j, i], [pointX,pointY], gap );
								this.drawTooltipPoint([j,i]);
								selectFlag = true;
							}
						}
					}
				}
			}
			
			if( !selectFlag ){
				try{this.oCanvas_tooltip.style.display = 'none';}catch(ex){}
				//this.graphics_event.clearRect(0,0,this.sWidth, this.sHeight);
				this.clearRect( this.oCanvas_event, this.graphics_event, this.sWidth, this.sHeight);
			}
			
		},
		setSelectLegendItem : function(e){
			var vo 			= this.options;
			var ctx 		= this.graphics_legend;
			var selectFlag	= false;
			var pointX, pointY, gap=10, x, y, width, height, color;
			if( arguments[2] ){
				var mouseCoords = this.getMouseXY(e, arguments[1], arguments[2]);
			}else{
				var mouseCoords = this.getMouseXY(e, arguments[1]);
			}
			
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinateLegend.length;
			  
			for( var i=0;i<len;i++ ) {
			
				x = this.coordinateLegend[i][0];
				y = this.coordinateLegend[i][1];
				width = this.coordinateLegend[i][2];
				height = this.coordinateLegend[i][3];
				color = this.coordinateLegend[i][4];
				
				if( x < mx && mx < (x+width) ) {
					if( y < my && my < y+height ) {
					
						if( this.coordinateLegend[i][5] ){
							this.rect(ctx, x, y, width, height, '#e2e2e2', '');
							this.coordinateLegend[i][5] = false;
						}else{
							this.rect(ctx, x, y, width, height, color, '');
							this.coordinateLegend[i][5] = true;
						}
						
						//this.graphics_item.clearRect(0,0,this.sWidth,this.sHeight);
						this.clearRect( this.oCanvas_item, this.graphics_item, this.sWidth, this.sHeight);
						this.drawAreaLegend();
						
					}
				}
				
			}
		},
		setSelectAreaPointLine : function(e){
			var vo 			= this.options;
			var selectFlag	= false;
			var pointX, pointY, gap=10;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			this.drawTooltipPointLine(e, mx, my);
			
		},
		setSelectAreaPoint_click : function(e){
			var vo 			= this.options;
			var mouseCoords = this.getMouseXY(e, arguments[1]);
			// border로 인해 x,y재조정.
			var mx = mouseCoords[0] - vo.background.strokeThickness;
			var my = mouseCoords[1] - vo.background.strokeThickness;
			
			var len = this.coordinate.length;
			try{var len2= this.coordinate[0].length;}catch(ex){return;}
			  
			var selectedArr = [];  
			  
			for( var i=0;i<len;i++ ) {
				for( var j=0;j<len2;j++ ) {
					var x = this.coordinate[i][j].x - 7;
					var y = this.coordinate[i][j].y - 7;
					var width = this.coordinate[i][j].width;
					var height = y + this.coordinate[i][j].height;
					if( x < mx && mx < (x+width) ) {
						if( y > height ) {
							if( y > my && my > height ) {
							
								//this.returnEventData( e, [j, i] );
								selectedArr.push([j, i]);
							}
						}else{
							if( height > my && my > y ) {
							
								//this.returnEventData( e, [j, i] );
								selectedArr.push([j, i]);
							}
						}
					}
				}
			}
			
			if( selectedArr.length > 0 ){
				var sel1 = selectedArr[selectedArr.length-1][0];
				var sel2 = selectedArr[selectedArr.length-1][1];
				this.returnEventData( e, [sel1, sel2] );
			}
			
		},
		canvas_event_func_areaRange : function(e){
			var target = e.target ? e.target : event.srcElement;
			var eThis = target.__canvas_body;
			var chartElem, chartCanvas;
			var cb = function(elem){
				if(elem.nodeName == "DIV" && elem.__canvas_body){
					eThis = elem.__canvas_body;
					chartElem = elem;
				}else if(elem.nodeName == "canvas" ){
						chartCanvas = elem;
						cb(elem.parentElement);
				}else{
					cb(elem.parentElement);
				}
			};
			cb(target);
			
			
			if( target.id == eThis.sContainer+'___legend' ){
				if( e.type=='mouseup' ){
					eThis.setSelectLegendItem(e, chartElem);
				}
				return;
			}
			if(e.target){
				if( target.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartElem);
					}
					return;
				}
			}else{
				if( chartCanvas && chartCanvas.id == eThis.sContainer+'___legend' ){
					if( e.type=='mouseup' ){
						eThis.setSelectLegendItem(e, chartCanvas, true);
					}
					return;
				}
			}
			
			var options = eThis.options;
			
			if(options.theme.tooltipStyle == 1){
				if(e.type=='mousemove'){
					eThis.setSelectAreaPoint(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectAreaPoint(e, chartElem);
				}else if( e.type=='mouseup' ){
						
				}else if( e.type=='click' ){
					eThis.setSelectAreaPoint_click(e, chartElem);
				}
			}else if(options.theme.tooltipStyle == 2){
				if(e.type=='mousemove'){
					eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='click' ){
					eThis.setSelectAreaPoint_click(e, chartElem);
				}
			}else if(options.theme.tooltipStyle == 3){
				if(e.type=='mousemove'){
					eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mousedown' ){
					eThis.setSelectAreaPointLine(e, chartElem);
				}else if( e.type=='mouseup' ){
					eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='mouseout' ){
					eThis.setSelectAreaPointLine(e, chartElem);	
				}else if( e.type=='click' ){
					eThis.setSelectAreaPoint_click(e, chartElem);
				}
			}
		}
	});
	
	
	
	window.GLChart = GLChart;
})( window );




// base64.js ===================================================================================================================================
/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */

(function() {

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
	c1 = str.charCodeAt(i++) & 0xff;
	if(i == len)
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
	    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	    out += "==";
	    break;
	}
	c2 = str.charCodeAt(i++);
	if(i == len)
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
	    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	    out += "=";
	    break;
	}
	c3 = str.charCodeAt(i++);
	out += base64EncodeChars.charAt(c1 >> 2);
	out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
	out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
	/* c1 */
	do {
	    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	} while(i < len && c1 == -1);
	if(c1 == -1){
	    break;
	}
	/* c2 */
	do {
	    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	} while(i < len && c2 == -1);
	if(c2 == -1){
	    break;
	}
	out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

	/* c3 */
	do {
	    c3 = str.charCodeAt(i++) & 0xff;
	    if(c3 == 61){
			return out;
		}
	    c3 = base64DecodeChars[c3];
	} while(i < len && c3 == -1);
	if(c3 == -1){
	    break;
	}
	out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

	/* c4 */
	do {
	    c4 = str.charCodeAt(i++) & 0xff;
	    if(c4 == 61){
			return out;
		}	
	    c4 = base64DecodeChars[c4];
	} while(i < len && c4 == -1);
	if(c4 == -1){
	    break;
	}	
	out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

if (!window.btoa){ window.btoa = base64encode; }
if (!window.atob){ window.atob = base64decode; }

})();





// canvas2image.js====================================================================================================================
/*
 * Canvas2Image v0.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

var Canvas2Image = (function() {

	// check if we have canvas support
	var bHasCanvas = false;
	var oCanvas = document.createElement("canvas");
	try{
	if (oCanvas.getContext("2d")) {
		bHasCanvas = true;
	}
	}catch(ex){return;}

	// no canvas, bail out.
	if (!bHasCanvas) {
		return {
			saveAsBMP : function(){},
			saveAsPNG : function(){},
			saveAsJPEG : function(){}
		};
	}

	var bHasImageData = !!(oCanvas.getContext("2d").getImageData);
	var bHasDataURL = !!(oCanvas.toDataURL);
	var bHasBase64 = !!(window.btoa);

	var strDownloadMime = "image/octet-stream";

	// ok, we're good
	var readCanvasData = function(oCanvas) {
		var iWidth = parseInt(oCanvas.width);
		var iHeight = parseInt(oCanvas.height);
		return oCanvas.getContext("2d").getImageData(0,0,iWidth,iHeight);
	};

	// base64 encodes either a string or an array of charcodes
	var encodeData = function(data) {
		var strData = "";
		if (typeof data == "string") {
			strData = data;
		} else {
			var aData = data;
			for (var i=0;i<aData.length;i++) {
				strData += String.fromCharCode(aData[i]);
			}
		}
		return btoa(strData);
	};

	// creates a base64 encoded string containing BMP data
	// takes an imagedata object as argument
	var createBMP = function(oData) {
		var aHeader = [];
	
		var iWidth = oData.width;
		var iHeight = oData.height;

		aHeader.push(0x42); // magic 1
		aHeader.push(0x4D); 
	
		var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256);

		aHeader.push(0); // reserved
		aHeader.push(0);
		aHeader.push(0); // reserved
		aHeader.push(0);

		aHeader.push(54); // dataoffset
		aHeader.push(0);
		aHeader.push(0);
		aHeader.push(0);

		var aInfoHeader = [];
		aInfoHeader.push(40); // info header size
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);

		var iImageWidth = iWidth;
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256);
	
		var iImageHeight = iHeight;
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256);
	
		aInfoHeader.push(1); // num of planes
		aInfoHeader.push(0);
	
		aInfoHeader.push(24); // num of bits per pixel
		aInfoHeader.push(0);
	
		aInfoHeader.push(0); // compression = none
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);
	
		var iDataSize = iWidth*iHeight*3; 
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); 
	
		for (var i=0;i<16;i++) {
			aInfoHeader.push(0);	// these bytes not used
		}
	
		var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = "";
		var y = iHeight;
		do {
			var iOffsetY = iWidth*(y-1)*4;
			var strPixelRow = "";
			for (var x=0;x<iWidth;x++) {
				var iOffsetX = 4*x;

				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}
			for (var c=0;c<iPadding;c++) {
				strPixelRow += String.fromCharCode(0);
			}
			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(aHeader.concat(aInfoHeader)) + encodeData(strPixelData);

		return strEncoded;
	};


	// sends the generated file to the client
	var saveFile = function(strData) {
		document.location.href = strData;
	};

	var makeDataURI = function(strData, strMime) {
		return "data:" + strMime + ";base64," + strData;
	};

	// generates a <img> object containing the imagedata
	var makeImageObject = function(strSource) {
		var oImgElement = document.createElement("img");
		oImgElement.src = strSource;
		return oImgElement;
	};

	var scaleCanvas = function(oCanvas, iWidth, iHeight) {
		if (iWidth && iHeight) {
			var oSaveCanvas = document.createElement("canvas");
			oSaveCanvas.width = iWidth;
			oSaveCanvas.height = iHeight;
			oSaveCanvas.style.width = iWidth+"px";
			oSaveCanvas.style.height = iHeight+"px";

			var oSaveCtx = oSaveCanvas.getContext("2d");

			oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
			return oSaveCanvas;
		}
		return oCanvas;
	};

	return {
		getPNGString : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}
			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strData = oScaledCanvas.toDataURL("image/png");
			strData.replace("image/png", strDownloadMime);
			return strData;
		},
		saveAsPNG : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}
			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strData = oScaledCanvas.toDataURL("image/png");
			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace("image/png", strDownloadMime));
			}
			return true;
		},

		saveAsJPEG : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}

			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strMime = "image/jpeg";
			var strData = oScaledCanvas.toDataURL(strMime);
	
			// check if browser actually supports jpeg by looking for the mime type in the data uri.
			// if not, return false
			if (strData.indexOf(strMime) != 5) {
				return false;
			}

			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace(strMime, strDownloadMime));
			}
			return true;
		},

		saveAsBMP : function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!(bHasImageData && bHasBase64)) {
				return false;
			}

			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);

			var oData = readCanvasData(oScaledCanvas);
			var strImgData = createBMP(oData);
			if (bReturnImg) {
				return makeImageObject(makeDataURI(strImgData, "image/bmp"));
			} else {
				saveFile(makeDataURI(strImgData, strDownloadMime));
			}
			return true;
		}
	};

})();
