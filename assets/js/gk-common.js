$(function(gkc, $,undefined){
	// jQuery.noConflict();
	gkc.serviceBase = 'https://test.greenkoncepts.com/ems/services/ResourceService/';

	// Specify the ZIP/location code and units (f or c)
	// var loc = '10001'; // or e.g. SPXX0050
	
	gkc.controlNode;
	gkc.nodes;
	gkc.weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	gkc.months =  ["January","February","March","April","May","June","July","August","September","October","November","December"];
	
	
	

	gkc.url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(gkc.query) + '&format=json&_nocache=' + gkc.cacheBuster;

	gkc.setCookie = function(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	};

	gkc.getCookie = function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	}
	
	gkc.controlNode = function(key,nodeName,cmd){
        $.ajax({
            url: gkc.serviceBase + 'control?key=' + key + '&id=' + nodeName + '&command='+ cmd +'&isGroupControl=false&callerID=callerID&gkc.nodeControlCallBack',
            dataType: 'jsonp',
            // beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            // complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            jsonpCallback: 'gkc.nodeControlCallBack',
            type: 'GET',
            async: true,
            contentType:"application/json"
        });
    };

	gkc.login = function(userName,password) {
		$.ajax({
			url: gkc.serviceBase + 'login?username=' + userName + '&credential=' + password + '&callerID=callerID&gkc.loginCallback',
			dataType: 'jsonp',
			jsonpCallback: 'gkc.loginCallback',
			type: 'GET',
			async: true,
			contentType:"application/json"
		});
	};

	gkc.getControlNodes = function(key,nodeName) {
		$.ajax({
			url: gkc.serviceBase + 'controlNodes?key='+ key +'&callerID=callerID&gkc.controlNodeCallback',
			dataType: 'jsonp',
			jsonpCallback: 'gkc.controlNodeCallback',
			type: 'GET',
			async: true,
			contentType:"application/json"
		});
	};
	
	gkc.getNodes = function(key,callBackFunction) {
		$.ajax({
			url: gkc.serviceBase + 'nodes?key='+ key +'&callerID=callerID&gkc.nodesCallback',
			dataType: 'jsonp',
			jsonpCallback: callBackFunction,
			type: 'GET',
			async: true,
			contentType:"application/json"
		});
	};
	
	gkc.getBinnedEvents = function(callBackfunction,params) {
		// console.log(params.callerID);
		$.ajax({
			
			dataType: 'jsonp',
			
			 data: {
		  	tag: params.tag,
		  	key: gkc.getCookie('key'),
		  	nodeNames: params.nodeNames,
		  	beginDate: params.beginDate,
		  	endDate: params.endDate,
		  	binEnum: params.binEnum,
		  	dataNames: params.dataNames,
			callerID:params.callerID,
			callback:callBackfunction
				 
		  },
			 
			url: gkc.serviceBase + 'binnedEvents',
			jsonpCallback: callBackfunction,
			type: 'GET',
			async: true,
			contentType:"application/json"
		});
	};
	
	

	// gkc.greetingText = function() {
	// 	currentTime = new Date();
	// 	hours = currentTime.getHours();

	// 	if (hours < 12) {
	// 		return "Good morning";
	// 	} else if (hours >= 12 && hours < 16) {
	// 		return "Good afternoon";
	// 	} else if (hours >= 16 ) {
	// 		return "Good evening";
	// 	}
	// };

	gkc.alertError = function() {
		alert("cannot communicate to server");
	};

	gkc.init = function(success){
		if (success) {
			gkc.loadApp();
		} else {
			gkc.alertError();
		}
	};

	gkc.loadApp = function() {
				
	};

	gkc.getWeatherData = function() {
		$.ajax({
			url: gkc.url,
			dataType: 'jsonp',
			cache: true,
			async: true,
			jsonpCallback: 'gkc.wxCallback'
		});
	};

	gkc.getLineChartData = function(resource,time,device) {
		var labels = [];
		var date = new Date();
		var currentHour = date.getHours();
		var currentDay = date.getDay();
		var currentMonth = date.getMonth();
		if(resource === 'energy' && time === 'this week' && device === 'all uses' ){

			for(var i=0;i<=currentDay; i++) {
				labels.push(gkc.weekDays[i]);
			}

			return data = {
				labels: labels,
				datasets: [
						{
							label: "this week",
							fillColor: "rgba(220,220,220,1)",
							strokeColor: "#616774",
							pointColor: "#616774",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							data: [15.8, 25.9,22.4,28.7,20.9,21.8,27.6]
						}
					]
			};
		} else if (resource === 'energy' && time === 'today' && device === 'all uses' ) {		
			
			for (var i=0;i<=currentHour; i++) {				
				var val = i;
				if (i > 11) {
					val += " pm";
				} else {
					val += " am";
				}
				labels.push(val)
			}

			return data = {
				labels: labels,
				datasets: [
						{
							label: "today",
							fillColor: "rgba(220,220,220,1)",
							strokeColor: "#616774",
							pointColor: "#616774",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							data: [1.8,2.9,2.4,1.7,3.9,4.8,2.6,3.8,3.9,2.4,1.7,3.9,2.8,1.6,3.8,2.9,3.4,2.7,1.9,2.8,1.6,2.8,3.9,1.5]
						}
					]
			};
		} else if (resource === 'energy' && time === 'this year' && device === 'all uses' ) {		
			
			for (var i=0;i<=currentMonth; i++) {			
				labels.push(gkc.months[i]);
			}		

			return data = {
				labels: labels,
				datasets: [
						{
							label: "today",
							fillColor: "rgba(220,220,220,1)",
							strokeColor: "#616774",
							pointColor: "#616774",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							data: [150.8,147.9,152.4,130.7,145.9,138.8,155.6,142.0,139.9,142.4,180.7,145.5]
						}
					]
			};
		}
		
	};

	gkc.stickIt = function() {
	  var orgElementPos = $('#original-menu').offset();
	  orgElementTop = orgElementPos.top;               
	  // console.log("stick it >>>>>>>>>>> " + " orgElementTop :" + orgElementTop + "scroll top : " + $(window).scrollTop());
	  if ($(window).scrollTop() > (orgElementTop)) {
	  	var display = $('#sticky-menu').css("display");	  	
	  	if(display === "none") {
	  		$('#sticky-menu').css({"top":"64px"});
	  		$('#sticky-menu').css({"display": "block","transition": "transform 500ms ease-out","-webkit-transition":"transform 500ms ease-out","transform":"translateX(0px) translateY(-65px)"});
	  	}
	  	
	  } else {
	  	var display = $('#sticky-menu').css("display");
	  	if(display === "block") {
	  		$('#sticky-menu').css({"display":"none"});
	  	}
	  }
	};

	gkc.scrollIntervalID = setInterval(gkc.stickIt, 20);	

} (window.gkc = window.gkc || {}, jQuery));
