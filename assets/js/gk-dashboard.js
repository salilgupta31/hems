$(function(gkc, $,undefined){
	Chart.defaults.global = {
			// Boolean - Whether to animate the chart
			animation: true,

			// Number - Number of animation steps
			animationSteps: 60,

			// String - Animation easing effect
			// Possible effects are:
			// [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
			//  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
			//  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
			//  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
			//  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
			//  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
			//  easeOutElastic, easeInCubic]
			animationEasing: "easeOutQuart",

			// Boolean - If we should show the scale at all
			showScale: true,

			// Boolean - If we want to override with a hard coded scale
			scaleOverride: false,

			// ** Required if scaleOverride is true **
			// Number - The number of steps in a hard coded scale
			scaleSteps: null,
			// Number - The value jump in the hard coded scaledas
			scaleStepWidth: null,
			// Number - The scale starting value
			scaleStartValue: null,

			// String - Colour of the scale line
			scaleLineColor: "rgba(0,0,0,.1)",

			// Number - Pixel width of the scale line
			scaleLineWidth: 1,

			// Boolean - Whether to show labels on the scale
			scaleShowLabels: true,

			// Interpolated JS string - can access value
			scaleLabel: "<%=value%>",

			// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
			scaleIntegersOnly: true,

			// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero: false,

			// String - Scale label font declaration for the scale label
			scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Scale label font size in pixels
			scaleFontSize: 12,

			// String - Scale label font weight style
			scaleFontStyle: "normal",

			// String - Scale label font colour
			scaleFontColor: "#666",

			// Boolean - whether or not the chart should be responsive and resize when the browser does.
			responsive: true,

			// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
			maintainAspectRatio: true,

			// Boolean - Determines whether to draw tooltips on the canvas or not
			showTooltips: true,

			// Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
			customTooltips: false,

			// Array - Array of string names to attach tooltip events
			tooltipEvents: ["mousemove", "touchstart", "touchmove"],

			// String - Tooltip background colour
			tooltipFillColor: "rgba(0,0,0,0.8)",

			// String - Tooltip label font declaration for the scale label
			tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip label font size in pixels
			tooltipFontSize: 14,

			// String - Tooltip font weight style
			tooltipFontStyle: "normal",

			// String - Tooltip label font colour
			tooltipFontColor: "#fff",

			// String - Tooltip title font declaration for the scale label
			tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip title font size in pixels
			tooltipTitleFontSize: 14,

			// String - Tooltip title font weight style
			tooltipTitleFontStyle: "bold",

			// String - Tooltip title font colour
			tooltipTitleFontColor: "#fff",

			// Number - pixel width of padding around tooltip text
			tooltipYPadding: 6,

			// Number - pixel width of padding around tooltip text
			tooltipXPadding: 6,

			// Number - Size of the caret on the tooltip
			tooltipCaretSize: 8,

			// Number - Pixel radius of the tooltip border
			tooltipCornerRadius: 6,

			// Number - Pixel offset from point x to tooltip edge
			tooltipXOffset: 10,

			// String - Template string for single tooltips
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

			// String - Template string for multiple tooltips
			multiTooltipTemplate: "<%= value %>",

			// Function - Will fire on animation progression.
			onAnimationProgress: function(){},

			// Function - Will fire on animation completion.
			onAnimationComplete: function(){}
	};
	
	gkc.wxCallback = function(data)  {
		// console.log(data);
		var info = data.query.results.channel;
		
		$('#temperatureText').text(info.item.condition.temp +"ºC");
		gkc.changeSuggestionText(info.item.condition.temp);
		$('#windText').text(info.wind.speed +" km/h");
		//console.log(info);
		
	};

	gkc.getchartData = function() {
		var resource = $('#dropdown-text-resource').text();
		var time = $('#dropdown-text-time').text();
		var device = $('#dropdown-text-device').text();
		console.log("resource : " + resource + "time : " + time + "device : " + device);
		var lineChartdata = gkc.getLineChartData(resource,time,device);
		console.log(gkc.lineChartdata);
		gkc.usageLineChart.destroy();
		gkc.usageLineChart = new Chart(ctx).Line(lineChartdata, gkc.lineChartOptions);
		//gkc.usageLineChart.update();
		document.getElementById("legendDiv").innerHTML = gkc.usageLineChart.generateLegend();
	};

	gkc.changeChartTimeChange = function(id,event) {
		event.preventDefault();
		console.log('time : ' + $('#'+ id).text());
		$('#dropdown-text-time').html($('#'+ id).text());
		//$('#dropdown-text-time').parent().removeClass('w--open');
		//$('#dropdownlist-time').removeClass('w--open');
		gkc.getchartData();
	};

	gkc.changeChartResourceChange = function(id,event){
		event.preventDefault();
		console.log('resource : ' + $('#'+ id).text());
		$('#dropdown-text-resource').html($('#'+ id).text());
		//$('#dropdown-text-resource').parent().removeClass('w--open');
		//$('#dropdownlist-resource').removeClass('w--open');
		gkc.getchartData();
	};

	gkc.changeChartDeviceChange = function(id,event){
		event.preventDefault();
		console.log('device : ' + $('#'+ id).text());
		$('#dropdown-text-device').html($('#'+ id).text());
		//$('#dropdown-text-device').parent().removeClass('w--open');
		//$('#dropdownlist-device').removeClass('w--open');
		
		gkc.getchartData();
	};

	gkc.loginCallback = function(data)  {
		// console.log(data);
		if (data.key) {
			$('#welcomeText').html(gkc.greetingText() + ',<br/> Kenneth');
			gkc.setCookie('key',data.key);
			gkc.init(true);
			gkc.loadNodes();
			//gkc.loadControlNodeData();
			
		} else {
			gkc.init(false);
		}
	};

	gkc.changeSuggestionText = function (temp)  {
		if (temp > 25) {
			//$('#weatherSuggestionText').text("");
		} else {
			// $('#weatherSuggestionText').text("Right now, it’s cool enough to skip the air conditioning and use a fan.");
		}
	};
	
	gkc.loadMonthCOst = function(nodeName){
		
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var enddate = new Date();
		var params = {};
		params.nodeNames = nodeName;
		params.beginDate = firstDay.getTime();
		params.endDate = enddate.getTime();
		params.binEnum = 3;
		params.dataNames = 'Cost';
		
		params.callerID = "LOAD_MONTHLY_COST";
	//	console.log(params);
		gkc.getBinnedEvents('gkc.onDashboardBinnedResult',params);
		
		var dateStr = "1st "+gkc.months[firstDay.getMonth()];
		$("#dateMonthStr").text(dateStr);
		
	};
	
	gkc.onDashboardBinnedResult = function(data)
	{
		// console.log("On get binned events   ");
		// console.log(data);
		if(data.callerID === 'LOAD_MONTHLY_COST')
		{
			//console.log('Inside LOAD_MONTHLY_COST');
			//console.log(data);
			var monthCOst = "$69.30";//data.statistics[0].units + " "+data.statistics[0].total.toFixed(2) ;
			// console.log('monthCOst =>'+monthCOst);
			$('#monthlyCost').text(monthCOst);
		}
		else if(data.callerID === 'LOAD_DASHBOARD_ENERGY')
		{
			// console.log('Inside LOAD_BREAKDOWN_ENERGY');
			if(data.statistics[0].current){
				var currentEnergy = data.statistics[0].current.toFixed(2) +" "+data.statistics[0].units;
				// console.log('currentEnergy =>'+currentEnergy);
				$('#currentEnergy').text(currentEnergy);
			}
			
			
			
		}
	};
	
	gkc.loadNodes = function(){

			var key = gkc.getCookie('key');
			//console.log('=====inside loadNodes ====='+key);
			gkc.getNodes(key,'gkc.dashboardNodesCallback');
	};

	gkc.dashboardNodesCallback = function(data)  {
			// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>dashboardNodesCallback >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
			// console.log(data);
			gkc.nodes = data;
			var nodeName = data.cmdb.children[1].name;
			// console.log(nodeName);
			gkc.loadMonthCOst(nodeName);
			gkc.loadDashboardCurrentEnergy(nodeName);
	};

	gkc.loadDashboardCurrentEnergy = function(nodeName){
		// console.log("Inside loadCurrentEnergy");
		var MS_PER_MINUTE = 60000;
		var myEndDateTime = new Date();
		var myStartDate = new Date(myEndDateTime - 5 * MS_PER_MINUTE);
		var params = {};
		params.nodeNames = nodeName;
		params.beginDate = myStartDate.getTime();
		params.endDate = myEndDateTime.getTime();
		params.binEnum = 9;
		params.dataNames = 'Energy';
		params.callerID = 'LOAD_DASHBOARD_ENERGY';
		// console.log("======================================callerID" +params.callerID );
		gkc.getBinnedEvents('gkc.onDashboardBinnedResult',params);
		
	};
	
	
	gkc.lineChartdata = gkc.getLineChartData("energy","this week","all uses");
		
	gkc.lineChartOptions = {
			//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero : true,

			//Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : false,

			//String - Colour of the grid lines
			scaleGridLineColor : "rgba(0,0,0,.05)",

			//Number - Width of the grid lines
			scaleGridLineWidth : 1,

			//Boolean - Whether to show horizontal lines (except X axis)
			scaleShowHorizontalLines: false,

			//Boolean - Whether to show vertical lines (except Y axis)
			scaleShowVerticalLines: false,

			//Boolean - If there is a stroke on each bar
			barShowStroke : false,

			//Number - Pixel width of the bar stroke
			barStrokeWidth : 2,

			//Number - Spacing between each of the X value sets
			barValueSpacing : 5,

			//Number - Spacing between data sets within X values
			barDatasetSpacing : 1,
			scaleShowLabels: true,
			bezierCurve: false,

			//String - A legend template
			legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
	};

	$("#progress-bar-lowest").animate({"width":"29%"}, 1000);
	$("#progress-bar-you").animate({"width":"84%"}, 1000);
	$("#progress-bar-average").animate({"width":"54%"}, 1000);


	var ctx = document.getElementById('usage-line-chart').getContext("2d");
	// gkc.usageLineChart.destroy();
	gkc.usageLineChart = new Chart(ctx).Line(gkc.lineChartdata, gkc.lineChartOptions);
	document.getElementById("legendDiv").innerHTML = gkc.usageLineChart.generateLegend();
	gkc.getWeatherData();
	var key = gkc.getCookie('key');
	// if (key) {
	// 	console.log("already logged in");
	// } else {
	gkc.login('energetix@greenkoncepts.com','greenkoncepts');
	// }

}(window.gkc = window.gkc || {}, jQuery));
