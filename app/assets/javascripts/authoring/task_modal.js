function showTaskOverview(groupNum){

	var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	var title = eventObj["title"];
   	
	
	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');
		
	
	//modal label
	var label = title;
	$('#task_modal_Label').html(label);

	//modal content
	//var taskOverviewContent = '<div id="task-description-text"><p>' + description + '</p></div>';	
	var taskOverviewContent = getTaskOverviewContent(groupNum);
	//$('#taskOverview').html(taskOverviewContent);
	$('#task-text').html(taskOverviewContent);
    
	
	if(in_progress != true && (uniq_u == "" || memberType == "pc" || memberType == "client") ) {
		$("#edit-save-task").css('display', '');
		$("#edit-save-task").attr('onclick', 'editTaskOverview(true,'+groupNum+')');
		$("#edit-save-task").html('Edit');

	}
	else{
		$("#edit-save-task").css('display', 'none');
		$("#hire-task").css('display','none');
		$("#delete").css('display','none');
	}


}

function editTaskOverview(popover,groupNum){

	var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	var title = eventObj["title"];
   	
	if(popover==true){
		$('#task-edit-link').hide();
		
		//label
		label = '<input type ="text" name="eventName" id="eventName' + '" placeholder="'+title+'" >'	
		$('#task_modal_Label').html(label);

        //content
        var taskOverviewForm = getTaskOverviewForm(groupNum);
		/*var taskOverviewForm = '<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
					+'</form>';*/
		$('#task-text').html(taskOverviewForm);
		
		$("#edit-save-task").attr('onclick', 'saveTaskOverview('+groupNum+')');
		$("#edit-save-task").html('Save');	
        
        $("#inputs").tagsinput();
        $("#outputs").tagsinput();
	}

				
}

function getTaskOverviewForm(groupNum){

var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	
	 var totalMinutes = eventObj["duration"];
    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
    var outputs = eventObj["outputs"];
    if(!outputs) outputs = "";
    var numHours = Math.floor(totalMinutes/60);
    var minutesLeft = totalMinutes%60;
    var dri_id = eventObj.dri;
    var PC_id = eventObj.pc;
/*'<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
					+'</form>';*/

var form ='<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
        + '<div class="event-table-wrapper">'
        + '<b>Event Start:</b> <br>' 
        + 'Hours: <input type="number" id="startHr" placeholder="' + startHr 
            + '" min="0" style="width:35px">         ' 
        + 'Minutes: <input type="number" id="startMin" placeholder="' + startMin 
            + '" min="0" step="15" max="45" style="width:35px"><br />'
        + '<b>Total Runtime: </b> <br />' 
        + 'Hours: <input type = "number" id="hours" placeholder="'
            +numHours+'" min="0" style="width:35px"/>         ' 
        + 'Minutes: <input type = "number" id = "minutes" placeholder="'+minutesLeft
            +'" style="width:35px" min="0" step="15" max="45"/> <br />'
        + '<b>Members</b><br /> <div id="eventMemberList">'
            + writeEventMembers(eventObj)  +'</div>'

        + '<br><b>Project Coordinator</b><br><select class="pcInput"' 
            +' name="pcName" id="pcEvent"' 
			+ 'onchange="getPC('+groupNum + ')">'+ writePCMembers(groupNum,PC_id) +'</select>'


        + '<br><b>Directly-Responsible Individual</b><br><select class="driInput"' 
            +' name="driName" id="driEvent"' 
			+ 'onchange="getDRI('+groupNum + ')">'+ writeDRIMembers(groupNum,dri_id) +'</select>'
        

        + '<br /><b>Notes: </br></b><textarea rows="3" id="notes">' + notes + '</textarea>'
        + '<div><input type="text" value="' + inputs + '" placeholder="Add input" id="inputs" /></div>'
        + '<div><input type="text" value="' + outputs + '" placeholder="Add output" id="outputs" /></div></div>'
        + '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
        + '</form>';

        return form;

}

function getTaskOverviewContent(groupNum){
	var task_id = getEventJSONIndex(groupNum);
	var ev = flashTeamsJSON["events"][task_id];

    var hrs = Math.floor(ev.duration/60);
    var mins = ev.duration % 60;

    var content = '<b>Event Start:</b><br>'
        + ev.startHr + ':'
        + ev.startMin.toFixed(0) + '<br>'
        +'<b>Total Runtime: </b><br>' 
        + hrs + ' hrs ' + mins + ' mins<br>';

    if(ev.inputs) {
        content += '<b>Inputs:</b><br>';
        var inputs = ev.inputs.split(",");
        for(var i=0;i<inputs.length;i++){
            content += inputs[i];
            content += "<br>";
        }
    }
    
    if(ev.outputs) {
        content += '<b>Outputs:</b><br>';
        var outputs = ev.outputs.split(",");
        for(var i=0;i<outputs.length;i++){
            content += outputs[i];
            content += "<br>";
        }
    }

    var num_members = ev.members.length;
    if(num_members > 0){
        content += '<b>Members:</b><br>';
        for (var j=0;j<num_members;j++){
            var member = getMemberById(ev.members[j]);
            content += member.role;
            content += '<br>';
        }
    }

    if (ev.pc != "" && ev.pc != undefined){
        var pc_id = parseInt (ev.pc);
        var mem = null;

        for (var i = 0; i<flashTeamsJSON["members"].length; i++){
           
            if(flashTeamsJSON["members"][i].id == pc_id){
                mem = flashTeamsJSON["members"][i].role;
                break;
            }
        }
          if(mem && mem != undefined){
            content += '<b>Project Coordinator:</b><br>';
            content += mem;
            content += '<br>';
        }
    }

     if (ev.dri != "" && ev.dri != undefined){
        var dri_id = parseInt (ev.dri);
        var mem = null;

        for (var i = 0; i<flashTeamsJSON["members"].length; i++){
           
            if(flashTeamsJSON["members"][i].id == dri_id){
                mem = flashTeamsJSON["members"][i].role;
                break;
            }
        }

        if(mem && mem != undefined){
            content += '<b>Directly-Responsible Individual:</b><br>';
            content += mem;
            content += '<br>';
        }
    }
    
    if (ev.content != ""){
        content += '<b>Notes:</b><br>';
        content += ev.notes;
        content += '<br>';
    }

   
    return content;
}

function saveTaskOverview(groupNum){
	var task_id = getEventJSONIndex(groupNum); 
	var ev = flashTeamsJSON["events"][task_id];
	 
    if($("#eventName").val() !="")
        ev.title = $("#eventName").val();
	
	

    
    //Get Start Time
    var startHour = $("#startHr").val();    
    if (startHour == "") startHour = parseInt($("#startHr").attr("placeholder"));
    var startMin = $("#startMin").val();

    if (startMin == "") startMin = parseInt($("#startMin").attr("placeholder"));
    //newX
    startHour = parseInt(startHour);
    startMin = parseInt(startMin);
    var newX = (startHour * 100) + (startMin/15*25);
    newX = newX - (newX%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;

    var eventNotes = $("#notes").val();
    var driId = getDRI(groupNum);
    var pcId = getPC(groupNum);

    var indexOfJSON = getEventJSONIndex(groupNum);
    var ev = flashTeamsJSON["events"][indexOfJSON];

    removeAllMemberCircles(ev);
    
    //Update members of event
    flashTeamsJSON["events"][indexOfJSON].members = [];
    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
        var member = flashTeamsJSON["members"][i];
        var memberId = member.id;
        var checkbox = $("#event" + groupNum + "member" + i + "checkbox")[0];
        if (checkbox == undefined) continue;
        if (checkbox.checked == true) {
            ev.members.push(memberId); //Update JSON
        } 
    }

    //Update width
    var newHours = $("#hours").val();
    var newMin = $("#minutes").val();
    if (newHours == "") newHours = parseInt($("#hours")[0].placeholder);
    if (newMin == "") newMin = parseInt($("#minutes" )[0].placeholder);
    newMin = Math.round(parseInt(newMin)/15) * 15;
    
    //cannot have events shorter than 30 minutes
    if (newHours == 0 && newMin == 15){
        newMin = 30;
    }
    var newWidth = (newHours * 100) + (newMin/15*25);
  
    //Update JSON
    var indexOfJSON = getEventJSONIndex(groupNum);

    ev.notes = eventNotes;
    ev.dri = driId;
    ev.pc = pcId;
    ev.startHr = parseInt(startHour);
    ev.startMin = Math.round(parseInt(startMin)/15) * 15;
    ev.startTime = ev.startHr*60 + ev.startMin;
    ev.duration = durationForWidth(newWidth);
    ev.x = newX;
    ev.inputs = $('#inputs').val();
    ev.outputs = $('#outputs' ).val();

    drawEvent(ev, 0);

    updateStatus();
    //showTaskOverview(groupNum);
      $('#task_modal').modal('hide'); 
}