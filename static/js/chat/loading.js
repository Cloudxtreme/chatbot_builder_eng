function ajax(url, input_data, gubun, method) {
	$.ajax(url, {
		type: method, 
        data: JSON.stringify(input_data),
        async: false,
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        success: function (data, status, xhr) {
        	if (gubun == "chat_bot") {
        		start_interval();
        	} else if (gubun == "is_chatbot_ready") {
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
var direct_yn = $("#direct_yn").val();
var input_data = {"user" : user, "project" : project};

ajax('/chat_bot', input_data, 'chat_bot', 'POST');

function redirect_if_ready() {
	ajax('/is_chatbot_ready', input_data, 'is_chatbot_ready', 'POST');
}

function is_chatbot_ready_callback(reply) {
	if (reply['is_ready'] == 'Y') {
		if (gubun == "1") {
			$(location).attr('href', '/chat_window?user=' + user + "&project=" + project);
		} else if (gubun == "2") {
			$(location).attr('href', '/group_chat?user=' + user + "&project=" + project + "&emno=" + emno + "&room_name=" + room_name);
		} else if (gubun == "3") {
			$(location).attr('href', '/action_principle?user=' + user + "&project=" + project);
		}
	}
}

var interval_name = ''
function start_interval() {
	interval_name = setInterval(function() {redirect_if_ready();}, 500);
}
