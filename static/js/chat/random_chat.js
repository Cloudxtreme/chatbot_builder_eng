var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
	$messages.mCustomScrollbar();
	notify_entrance_of_chat();
});

function notify_entrance_of_chat() {
	$.post('/notify_entrance_of_chat', {		
	}).done(function(reply) {
	}).fail(function() {
	});
}

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
	    	var spl = answer.split("===");	    	
	    	if (spl[0] == 'MODAL' || spl[0] == 'POP') {
	    		url_list = eval(spl[1]);
	    		if (url_list.length > 0) {
	    			var html = '<a style="font-weight:700;font-size:0.9em;">choose one from below<br><br>';
	    			var answer_num_arr = reply['ans_num'].split(";")
	    			for (var j = 0; j < url_list.length; ++j) {		    			
		    			if (url_list[j] != null && url_list[j] != '') {
			    			var site = url_list[j].split("==");
				    		html += '<div class="reserve-question-div" onclick="open_popup(\'' + site[1] + '\', \'' + answer_num_arr[j] + '\')"><img class="check-mark" src="static/res/blue_check_mark.png" />&nbsp;&nbsp;<a class="reserve-question-message">' + site[0] + '</a></div><br>';		    		
		    			}
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
