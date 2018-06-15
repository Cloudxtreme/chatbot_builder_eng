var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
	var notice_list = eval($('#notice_list').val());
	for (var i = 0; i < notice_list.length; ++i) {
		var notice = notice_list[i].replace('\n', '<br>');
		reply_answer(notice);
	}
	getNewQuestion();
});

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function update_scroll() {
	$('.messages-content').scrollTop(Number.MAX_SAFE_INTEGER);
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.messages-content')).addClass('new');
  setDate();
  $('.message-input').val(null);
  interact(msg);
  update_scroll();
  setTimeout(function() {
  }, 1000 + (Math.random() * 20) * 100);
}

$('.message-submit').click(function() {
  insertMessage();
});

function reply_answer(text) {
	$('<div class="message new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure>' + text + '</div>').appendTo($('.messages-content')).addClass('new');
}

$(window).on('keydown', function(e) {
	if (e.which == 13) {
		insertMessage();
		return false;
	}
});

function setMessageInput(text) {
	$('.message-input').val(text);
}

var question = [];
var answer_num = [];
var div_id = [];
var temp = "";
var param_holder_dict = {};
var multiple_answer_num = "";
var page = 1;
function rightAnswer(msg_count){
	var q = "";
	var a = "";
	for (var i = 0; i < div_id.length; ++i) {
		if (msg_count != "" && div_id[i] == msg_count) {
			q = question[i];
			a = answer_num[i];
			break;
		}
	}
	$.post('/right_answer', {
		qst : q,
		ans_num : a
	}).done(function(reply) {
		$('#' + msg_count).remove();
		alert('you have chosen yes.');
	}).fail(function() {
		alert('error calling function');
	});
}

function wrongAnswer(msg_count) {
	var q = "";
	var a = "";
	for (var i = 0; i < div_id.length; ++i) {
		if (msg_count != "" && div_id[i] == msg_count) {
			q = question[i];
			a = answer_num[i];
			break;
		}
	}
	$.post('/wrong_answer', {
		qst : q,
		ans_num : a
	}).done(function(reply) {
		$('#' + msg_count).remove();
		alert('you have chosen no.');
	}).fail(function() {
		alert('error calling function');
	});
}

function requestNewAnswer(msg_count) {
	var q = "";
	var a = "";
	for (var i = 0; i < div_id.length; ++i) {
		if (msg_count != "" && div_id[i] == msg_count) {
			q = question[i];
			a = answer_num[i];
			break;
		}
	}
	$.post('/request_new_answer', {
		user : $('#user').val(),
		project : $('#project').val(),
		qst : q
	}).done(function(reply) {
		$('#' + msg_count).remove();
		alert('request was sent.');
		getRequestQuestion();
	}).fail(function() {
		alert('error calling function');
	});
}

function noRequestNewAnswer(msg_count) {
	$('#' + msg_count).remove();
}

function open_popup(url) {
	var w = CHAT_POPUP_WIDTH;
	var h = CHAT_POPUP_HEIGHT;
	var x = (screen.width - w) / 2;
	var y = (screen.height - h) / 3;
	window.open(url, '');
}

function go_back() {
	history.back();
}

function interact(message){
	$('<div class="message loading new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure><span></span></div>').appendTo($('.messages-content'));
	$.post('/message', {
		user : $('#user').val(),
		project : $('#project').val(),
		msg: message,
		tmp: temp,
		pge: page,
		multiple_answer_num : multiple_answer_num		
	}).done(function(reply) {
	    $('.message.loading').remove();
	    reserve_answer_list = eval(reply['reserve_answer_list']);
	    multiple_answer_num = reply['multiple_answer_num'];
	    message_count = reply['message_count'];
	    temp = reply['temp'];
	    param_holder_dict[message_count] = reply['param_holder'];
	    page = reply['page'];
	    for (var i = 0; i < Number(reply['num']); ++i) {
	    	var answer = reply['text' + (i + 1)];
	    	var spl = answer.split("===")	    	
	    	if (spl[0] == 'MODAL' || spl[0] == 'POP') {
	    		var url_list = spl[1].split(";");
	    		if (url_list.length > 0) {
			    	var html = '<a style="font-weight:700;font-size:0.9em;">choose one from below<br><br>';
		    		for (var j = 0; j < url_list.length; ++j) {
			    		var site = url_list[j].split("==");
			    		html += '<div class="reserve-question-div" onclick="open_popup(\'' + site[1] + '\')"><img class="check-mark" src="static/res/blue_check_mark.png" />&nbsp;&nbsp;<a class="reserve-question-message">' + site[0] + '</a></div><br>';		    		
			    	}
		    		answer = html;
		    		reply_answer(answer);
		    		break;
		    	} else {
			    	if (spl[0] == 'MODAL') {
			    		$('#modal_iframe').attr('src', spl[1]);
			    		$('#chat_modal').modal({
			    			escapeClose: false,
			    			clickClose: false,
			    		});
			    		break;
			    	} else if (spl[0] == 'POP') {
			    		open_popup(spl[1]);
			    		break;
			    	}
		    	}
	    	}
	    	reply_answer(answer);
	    }
	    image_path_list = eval(reply['image_path']);
	    if (image_path_list != null && image_path_list != '') {
		    for (var i = 0; i < image_path_list.length; ++i) {
		    	$('<div class="message new"><img class="answer-image" src="' + image_path_list[i] + '" /><a href="' + image_path_list[i] + '" target="_blank");">이미지확대</a></div>').appendTo($('.messages-content')).addClass('new');
		    }
	    }
	    if (reply['right_yn'] != '') {
	    	$('<div id=' + message_count + ' class="message new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure>' + reply['right_yn'] + '</div>').appendTo($('.messages-content')).addClass('new');
	    }
	    if (reply['right_yn'] != '' && Number(reply['num']) == 1) {
	    	question.push(reply['qst']);
	    	answer_num.push(reply['ans_num']);
	    	div_id.push(message_count);
	    }
	    if (reply['schedule_updated'] == 'Y') {
	    	setMySchedule();
	    }
	    setDate();
	    update_scroll();
	}).fail(function() {
		$('.message.loading').remove();
		reply_answer("Not trained question. please tell me other question.");
	});
}

function call_img() {
	window.open("./img")
}

function lpad(s, len, padding) {
	while (s.length < len) {
		s = padding + s;
	}
	return s;
}
