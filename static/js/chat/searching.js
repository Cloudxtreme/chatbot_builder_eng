function ajax(url, input_data, gubun, method) {
	$.ajax(url, {
		type: method, 
        data: JSON.stringify(input_data),
        async: true,
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        success: function (data, status, xhr) {
        	if (gubun == "chat_bot") {
        		start_interval();
        	} else if (gubun == "is_rc_chatbot_ready") {
        		is_chatbot_ready_callback(data);
        	}
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if (gubun == "chat_bot") {
        		start_interval();
        	}
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}

var user = $("#user").val();
var project = $("#project").val();
var emno = $("#emno").val();
var room_name = $("#room_name").val();
var gubun = $("#gubun").val();
var input_data = {"user" : user, "project" : project, "gubun" : gubun};

ajax('/chat_bot', input_data, 'chat_bot', 'POST');

function redirect_if_ready() {
	ajax('/is_rc_chatbot_ready', input_data, 'is_rc_chatbot_ready', 'POST');
}

function is_chatbot_ready_callback(reply) {
	if (reply['is_ready'] == 'Y') {
		$(location).attr('href', '/random_chat?user=' + user + "&project=" + project);
	}
}

var interval_name = ''
function start_interval() {
	interval_name = setInterval(function() {redirect_if_ready();}, 500);
}
