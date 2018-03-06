$(function(gkc, $,undefined){
	
	gkc.controlNodeCallback = function(data)  {		
        gkc.renderControls(data);        
    };

    gkc.nodeControlCallBack = function(data) {
    	if(data.nodeStatus) {
    		if(data.nodeStatus.name == "Electric-GKC-F0AD4E00EAAE-4000-10-0") {
    			if (data.nodeStatus.relayStatus == 1) {
    				 gkc.setNodeStatus("on", 1);
    			} else{
    				 gkc.setNodeStatus("off", 1);
    			}
    		} else if (data.nodeStatus.name == "Electric-GKC-F0AD4E00EAAE-4000-11-0") {
    			if (data.nodeStatus.relayStatus == 1) {
    				 gkc.setNodeStatus("on", 3);
    			} else{
    				 gkc.setNodeStatus("off", 3);
    			}

    		} else if (data.nodeStatus.name == "Electric-GKC-F0AD4E00EAAE-4000-12-0") {
    			if (data.nodeStatus.relayStatus == 1) {
    				 gkc.setNodeStatus("on", 2);
    			} else{
    				 gkc.setNodeStatus("off", 2);
    			}
    		}
    	}
    };

    gkc.disableControls = function(name) {
        $(name).fadeTo('slow',.6);
        $(name).append('<div style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
    };

    gkc.setNodeStatus = function(status, index) {
    	switch(index) {
		    case 1:
		       if(status === "on") {
		    		$('#bed3-indicator-off').css({"transition": "opacity 1000ms", "-webkit-transition":"opacity 1000ms","opacity":"0"});    				
		    		$('#bedroom-3-toggle-image').css({"opacity":"1"});
		    		$('#bed3-off').css({"transition": "opacity 1000ms", "-webkit-transition":"opacity 1000ms","opacity":"0"});
		    	} else if(status === "off") {
		    		$('#bed3-indicator-off').css({"transition": "opacity 1000ms", "-webkit-transition": "opacity 1000ms","opacity":"1"});    				
		    		$('#bedroom-3-toggle-image').css({"opacity":"0"});    				
		    		$('#bed3-off').css({"transition": "opacity 1000ms", "-webkit-transition": "opacity 1000ms","opacity":"1"}); 
		    	} else {                    
                    gkc.disableControls('#li-column-bed3');                
                }
		        break;
		    case 2:
		        if(status === "on") {
		    		$('#living-indicator-off').css({"transition": "opacity 1000ms", "-webkit-transition":"opacity 1000ms","opacity":"0"});    				
		    		$('#living-toggle').css({"opacity":"1"});
		    		$('#living-off').css({"transition": "opacity 1000ms", "-webkit-transition":"opacity 1000ms","opacity":"0"});
		    	} else if(status === "off") {
		    		$('#living-indicator-off').css({"transition": "opacity 1000ms", "-webkit-transition": "opacity 1000ms","opacity":"1"});    				
		    		$('#living-toggle').css({"opacity":"0"});    				
		    		$('#living-off').css({"transition": "opacity 1000ms", "-webkit-transition": "opacity 1000ms","opacity":"1"}); 
		    	} else {
                    gkc.disableControls('#li-column-living');                     
                }	        
		        break;
		    case 3:
		       if(status === "on") {
		    		$('#mainbed-indicator-off').css({"transition": "opacity 1000ms", "-webkit-transition":"opacity 1000ms","opacity":"0"});    				
		    		$('#mainbed-toggle').css({"opacity":"1"});
		    		$('#mainbed-off').css({"transition": "opacity 1000ms", "-webkit-transition":"opacity 1000ms","opacity":"0"});
		    	} else if(status === "off") {
		    		$('#mainbed-indicator-off').css({"transition": "opacity 1000ms", "-webkit-transition": "opacity 1000ms","opacity":"1"});    				
		    		$('#mainbed-toggle').css({"opacity":"0"});    				
		    		$('#mainbed-off').css({"transition": "opacity 1000ms", "-webkit-transition": "opacity 1000ms","opacity":"1"}); 
		    	} else {
                    gkc.disableControls('#li-column-mainbed');                    
                }
		        break;    
		}
    	
    };

    gkc.toggleElementOpacity = function(element) {
    	var opacity = $(element).css("opacity");
    	return opacity == 1 ? 0 : 1;  	
    };

    gkc.handleSliderChange = function(event) {
    	var relayStatus = $('#'+ $(this).data('id')).css("opacity");
    	if (relayStatus == 1) {
    		var command = 'Relay Status=' + 1 + ';Analog Output='  + event.currentTarget.value;
    		// console.log($(this).data('node'));
    		gkc.controlNode(gkc.getCookie('key'),$(this).data('node'),command);
    	}
    };

    gkc.getSliderName = function(id) {

    	if(id == 'bedroom-3-toggle-image') {
    		return "bed3-slider";
    	} else if (id == 'living-toggle'){
    		return "living-slider";
    	} else if (id == 'mainbed-toggle'){
    		return "mainbed-slider";
    	} else {
    		return "";
    	}
    };

    gkc.toggleClickHandle = function(e) {
		e.preventDefault();
		var relayStatus = gkc.toggleElementOpacity($(this));
		var analogValueSliderName = gkc.getSliderName( $(this).attr('id'));
		// console.log(analogValueSliderName);
	  	var command = 'Relay Status=' + relayStatus + ';Analog Output=' + $('#' + analogValueSliderName).val() ;
	  	// console.log("command toggleClickHandle : " + command);
	  	gkc.controlNode(gkc.getCookie('key'),$(this).data('id'),command);
	};

	gkc.update = function(slider,val) {
		var $amount = slider == 1?val:$("#amount").val();
		$('#slider a').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+$amount+' <span class="glyphicon glyphicon-chevron-right"></span></label>');
	};

    gkc.renderControls = function(data) {
    	if (data.cmdb) {
    		var controlNodes = data.cmdb.children[0];
    		$('#lighting-control-text').text(controlNodes.diplayName);
    		$('#bedroom-3-text').text(controlNodes.children[0].displayName);
    		$('#main-bedroom-text').text(controlNodes.children[1].displayName);
    		$('#living-room-text').text(controlNodes.children[2].displayName);    		

    		var bedRoomRelayStatus = controlNodes.children[0].relayStatus;
    		var mainRoomRelayStatus = controlNodes.children[1].relayStatus;
    		var livingRoomRelayStatus = controlNodes.children[2].relayStatus;

    		if (bedRoomRelayStatus != -1) {    			
    			if (bedRoomRelayStatus == 1) {
    				gkc.setNodeStatus("on",1);   			
    			} else {
    				gkc.setNodeStatus("off",1);   				
    			}
    			$('#bedroom-3-toggle-image').attr('data-id',controlNodes.children[0].name);
    			$('#bed3-slider').attr('data-id','bedroom-3-toggle-image');
    			$('#bed3-slider').attr('data-node',controlNodes.children[0].name);
    			$("#bed3-slider").val(controlNodes.children[0].analogOutput).slider("refresh");
                $( "#bedroom-3-toggle-image" ).bind( "click", gkc.toggleClickHandle); 
                $( "#bed3-slider" ).on( 'slidestop', gkc.handleSliderChange);  			
    		} else {                
                gkc.setNodeStatus("",1);
            }

    		if (mainRoomRelayStatus != -1) {    			
    			if (mainRoomRelayStatus == 1) {
    				gkc.setNodeStatus("on",2);   			
    			} else {
    				gkc.setNodeStatus("off",2);   				
    			}
    			$('#mainbed-toggle').attr('data-id',controlNodes.children[1].name);
    			$('#mainbed-slider').attr('data-id','mainbed-toggle');
    			$('#mainbed-slider').attr('data-node',controlNodes.children[1].name);
    			$("#mainbed-slider").val(controlNodes.children[1].analogOutput).slider("refresh");
                $( "#mainbed-toggle" ).bind( "click", gkc.toggleClickHandle);
                $( "#mainbed-slider" ).on( 'slidestop', gkc.handleSliderChange);  
    		} else {                
                gkc.setNodeStatus("",2);
            }

    		if (livingRoomRelayStatus != -1) {    			
    			if (livingRoomRelayStatus == 1) {
    				gkc.setNodeStatus("on",3);   			
    			} else {
    				 gkc.setNodeStatus("off",3);   				
    			}
    			$('#living-toggle').attr('data-id',controlNodes.children[2].name);
    			$('#living-slider').attr('data-id','living-toggle');
    			$('#living-slider').attr('data-node',controlNodes.children[2].name);
    			$("#living-slider").val(controlNodes.children[2].analogOutput).slider("refresh");
                $( "#living-toggle" ).bind( "click", gkc.toggleClickHandle);
                $( "#living-slider" ).on( 'slidestop', gkc.handleSliderChange);
    		}  else {                
                gkc.setNodeStatus("",3);
            }  		     	
    	} else {
            gkc.alertError();
        }
    };    

    gkc.getControlNodes(gkc.getCookie('key'));

} (window.gkc = window.gkc || {}, jQuery));