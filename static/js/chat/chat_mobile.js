var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
	$messages.mCustomScrollbar();
	var notice_list = eval($('#notice_list').val());
	for (var i = 0; i < notice_list.length; ++i) {
		var notice = notice_list[i].replace('\n', '<br>');
		reply_answer(notice);
	}
	getNewQuestion();
});

function updateScrollbar() {
	$('#scroll-down').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
	    scrollInertia: 1,
	    timeout: 0
	});
	$('#scroll-top').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'top', {
	    scrollInertia: 1,
	    timeout: 0
	});
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('#left-board .mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  interact(msg);
  setTimeout(function() {
    //fakeMessage();
  }, 1000 + (Math.random() * 20) * 100);
}

$('.message-submit').click(function() {
  insertMessage();
});

function reply_answer(text) {
	$('<div class="message new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure>' + text + '</div>').appendTo($('#left-board .mCSB_container')).addClass('new');
}

$(window).on('keydown', function(e) {
	if (e.which == 13) {
		insertMessage();
		return false;
	}
});

function getNewQuestion() {
	$.post('/latest_new_question', {
		user : $('#user').val(),
		project : $('#project').val()
	}).done(function(reply) {
		if (Number(reply['num']) > 0) {
			$('#message3 .mCSB_container').empty();			
		}
		var text = '- newly registered questions in a month -';
		$('<div class="new-question-msg">' + text + '</div>').appendTo($('#right-down-board .mCSB_container')).addClass('new');
		for (var i = 0; i < Number(reply['num']); ++i) {
			var text = reply['text' + (i + 1)];
				text = text.replace('\n', '');
			var html = '<div id="latest_new_question" class="latest-new-question">';
				html += '<img class="check-mark" src="static/res/green_check_mark.png" />&nbsp;&nbsp;<a onclick="setMessageInput(\'' + text.replace(/\"/g, '') + '\')">' + text + '</a></div>';
			$(html).appendTo($('#right-down-board .mCSB_container')).addClass('new');
		}
		updateScrollbar();
		}).fail(function() {
				});
}

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
	//, 'scrollbars=yes, resizable=yes, width=' + w + ', height=' + h + ', left=' + x + ', top=' + y
}

function go_back() {
	history.back();
}

function interact(message){
	$('<div class="message loading new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure><span></span></div>').appendTo($('#left-board .mCSB_container'));
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
		    	$('<div class="message new"><img class="answer-image" src="' + image_path_list[i] + '" /><a href="' + image_path_list[i] + '" target="_blank");">이미지확대</a></div>').appendTo($('#left-board .mCSB_container')).addClass('new');
		    }
	    }
	    if (reply['right_yn'] != '') {
	    	$('<div id=' + message_count + ' class="message new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure>' + reply['right_yn'] + '</div>').appendTo($('#left-board .mCSB_container')).addClass('new');
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
	    updateScrollbar();
	}).fail(function() {
		$('.message.loading').remove();
		reply_answer("Not trained question. please tell me other question.");
	});
}

function call_img() {
	window.open("./img")
}

function call_excel(output_file) {
	file = output_file.substring(1)
	window.open(file, null);
}

function lpad(s, len, padding) {
	while (s.length < len) {
		s = padding + s;
	}
	return s;
}

function change_background() {
	var bg = $(".bg").css("background-image");
	if (bg.indexOf("background1.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background1.jpg", "background2.jpg"));
	} else if (bg.indexOf("background2.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background2.jpg", "background3.jpg"));
	} else if (bg.indexOf("background3.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background3.jpg", "background4.jpg"));
	} else if (bg.indexOf("background4.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background4.jpg", "background5.jpg"));
	} else if (bg.indexOf("background5.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background5.jpg", "background6.jpg"));
	} else if (bg.indexOf("background6.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background6.jpg", "background7.jpg"));
	} else if (bg.indexOf("background7.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background7.jpg", "background8.jpg"));
	} else if (bg.indexOf("background8.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background8.jpg", "background9.jpg"));
	} else if (bg.indexOf("background9.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background9.jpg", "background10.jpg"));
	} else if (bg.indexOf("background10.jpg") != -1) {
		$(".bg").css("background-image", bg.replace("background10.jpg", "background1.jpg"));
	}
}
