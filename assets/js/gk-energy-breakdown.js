$(function(gkc, $,undefined){

	
	gkc.loadControlNodeData = function(){

			//console.log("calling loadControlNodeData");
			var key = gkc.getCookie('key');
			console.log('=====Key ====='+key);
			gkc.getControlNodes(key,'');
	};

	gkc.controlNodeCallback = function(data)  {
			//console.log('>>>>>>>>>>>>>>>>>>>>>>>>> Control  nodes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
			//console.log(data);
			gkc.controlNode = data;
			var nodeName = data.cmdb.children[1].name;
			//console.log("Control Node  ==="+nodeName);
			gkc.loadCurrentEnergy(nodeName);
	};

	gkc.loadAllNodes = function(){
			//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>loadAllNodes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
			var d = new Date();
			var str = "1st "+gkc.months[d.getMonth()] + " - "+d.getDate()+" "+gkc.months[d.getMonth()]+ " "+ d.getFullYear();
			$("#dateRange").text(str);
			//console.log("calling getNodes");
			var key = gkc.getCookie('key');
			//console.log('=====Key ====='+key);
			gkc.getNodes(key,'gkc.nodesCallback');
	};

	gkc.nodesCallback = function(data)  {
			//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>nodesCallback >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
			//console.log(data);
			gkc.nodes = data;
			var nodeName = data.cmdb.children[1].name;
			//console.log("Control Node  ==="+nodeName);
			gkc.createBreakDownList();
	};
	
	gkc.onEnrgyBreakDownBinnedResult = function(data)
	{
		//console.log("On get binned events   ");
		//console.log(data);
		if(data.callerID === 'LOAD_BREAKDOWN_ENERGY')
		{
			//console.log('Inside LOAD_BREAKDOWN_ENERGY');
			if (data.statistics[0].current) {
				var currentEnergy = data.statistics[0].current.toFixed(2) +" "+data.statistics[0].units;
			//console.log('currentEnergy =>'+currentEnergy);
			$('#currentEnergy').text(currentEnergy);
			}
			
			
		}
		else if(data.callerID === 'LOAD_MONTHLY_COST')
		{
			//console.log('Inside LOAD_MONTHLY_COST');
			//console.log(data);
			var monthCOst = "$69.30";//data.statistics[0].units + " "+data.statistics[0].total.toFixed(2) ;
			//console.log('monthCOst =>'+monthCOst);
			$('#monthlyCost').text(monthCOst);
		}
			
		
	};
	
	gkc.loadCurrentEnergy = function(nodeName){
		//console.log("Inside loadCurrentEnergy");
		var MS_PER_MINUTE = 60000;
		var myEndDateTime = new Date();
		var myStartDate = new Date(myEndDateTime - 1 * MS_PER_MINUTE);
		var params = {};
		params.nodeNames = nodeName;
		params.beginDate = myStartDate.getTime();
		params.endDate = myEndDateTime.getTime();
		params.binEnum = 9;
		params.dataNames = 'Energy';
		params.callerID = 'LOAD_BREAKDOWN_ENERGY';
		//console.log("======================================callerID" +params.callerID );
		gkc.getBinnedEvents('gkc.onEnrgyBreakDownBinnedResult',params);
		
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
		//console.log(params);
		gkc.getBinnedEvents('gkc.onEnrgyBreakDownBinnedResult',params);
		
	};
	

	
	
	gkc.loadEnergyDistributionChart= function(nodeName)
	{
		
	};
	
	
	
	gkc.createBreakDownList = function(){
		
		//console.log(" <<<<<<<<<<<<<<In createBreakDownList>>>>>>>>>>>>>>>>>>>>")
		var em200 = gkc.nodes.cmdb.children[1];

		//console.log("em -200 length = "+em200.children.length);
		for(var i = em200.children.length-1;i>=em200.children.length-3;i--)
		{
			//console.log("<a data-nodename="+em200.children[i].displayName+" data-id="+em200.children[i].name+" class='w-dropdown-link dropdown-link'>"+em200.children[i].displayName+"</a>");
			var item =  $("<a data-nodename="+em200.children[i].displayName+" data-id="+em200.children[i].name+" class='w-dropdown-link dropdown-link'>"+gkc.getDropDownLabel(em200.children[i].displayName)+"</a>");
			//console.log(item);
			$('#breakDownList').append(item);
			item.click(gkc.changeItem);
			
		
		}
		$("#selectedNode").text(gkc.getDropDownLabel(em200.children[em200.children.length-1].displayName));
		var nodeName = gkc.nodes.cmdb.children[1].name;
		//console.log("Control Node  ==="+nodeName);
		gkc.loadCurrentEnergy(nodeName);
		gkc.loadMonthCOst(em200.name);
		gkc.changeItem(undefined);
		
//		$("#progress-bar-lowest").animate({"width":"29.81%"}, 1000);
//		$("#progress-bar-you").animate({"width":"84.20%"}, 1000);
//		$("#progress-bar-average").animate({"width":"54.33%"}, 1000);
	};
	
	gkc.getDropDownLabel = function(nodeName){
		
		if(nodeName === "Channel 12")
		{
			return "Bedroom 3";
		}
		else if(nodeName === "Channel 11")
		{
			return "Living Room";
		}
		else if(nodeName === "Channel 10")
		{
			return "Main Bedroom";
		}
	};
	
	
	gkc.changeItem = function(evt){
		
		var acVal = 0;
		var lightingVal = 0;
		var applVal = 0;
		var acPer = 0;
		var lightingPer = 0;
		var applPer = 0;
		if(evt != undefined)
		{
			
			var selectedNode = evt.currentTarget.outerText;
			$("#selectedNode").text(evt.currentTarget.outerText);

			
			if(selectedNode === "Bedroom 3")
			{
				acVal = 12.74;
				lightingVal = 6.24;
				applVal = 2.08;
				
				acPer = "60%";
				lightingPer = "30%";
				applPer ="10%";


			}
			else if(selectedNode === "Living Room")
			{
				acVal = 12.47;
				lightingVal = 6.93;
				applVal = 8.31;
				
				acPer = "45%";
				lightingPer = "25%";
				applPer ="30%";
			}
			else if(selectedNode === "Main Bedroom")
			{
				acVal = 13.34;
				lightingVal = 7.28;
				applVal = 3.64;
				
				acPer = "55%";
				lightingPer = "30%";
				applPer ="15%";
			}

			
		}
		else
		{
			acVal = 12.74;
			lightingVal = 6.24;
			applVal = 2.08;

			acPer = "60%";
			lightingPer = "30%";
			applPer ="10%";
		}
		
		$("#aircon").html("air conditioning <strong>$"+acVal+" ("+acPer+")</strong>");
		$("#lighting").html("lighting <strong>$"+lightingVal+" ("+lightingPer+")</strong>");
		$("#appliances").html("appliances <strong>$"+applVal+" ("+applPer+")</strong>");
		
		$("#progress-bar-lowest").animate({"width":acPer}, 1000);
		$("#progress-bar-you").animate({"width":lightingPer}, 1000);
		$("#progress-bar-average").animate({"width":applPer}, 1000);
		
		
		

	};
	
	gkc.loadAllNodes();
} (window.gkc = window.gkc || {}, jQuery));
