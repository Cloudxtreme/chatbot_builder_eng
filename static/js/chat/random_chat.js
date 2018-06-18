var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
	$messages.mCustomScrollbar();
	notify_entrance_of_chat();
	connect();
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
	send(msg);
	setTimeout(function() {}, 1000 + (Math.random() * 20) * 100);
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

function reply_group_chat(message){
	$.post('/message', {
		user : $('#user').val(),
		project : $('#project').val(),
		msg: message
	}).done(function(reply) {
	    $('.message.loading').remove();
	    for (var i = 0; i < Number(reply['num']); ++i) {
	    	var answer = reply['text' + (i + 1)];
	    	reply_answer(answer);
	    }
	    setDate();
	    updateScrollbar();
	}).fail(function() {
		reply_answer("Not trained question. please tell me other question.");
	});
}

function lpad(s, len, padding) {
	while (s.length < len) {
		s = padding + s;
	}
	return s;
}

function send(message) {
	var send_data = {"message" : message, "members" : ""};
	websocket.send(JSON.stringify(send_data));
}

function connect() {
	websocket = new WebSocket("ws://" + $('#group_chat_ip').val());
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };
	setTimeout(function() {
    }.bind(this), 1000);
}

function onOpen(evt) {
}

function onClose(evt) {
}

function onMessage(evt) {
	var data = eval(evt.data);
	var message = data[0];
	text = message + '<br><br><a href="#" onclick="interact(\'' + message + '\')">ask to kant</a>'
	$('<div class="message new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure>' + text + '</div>').appendTo($('#left-board .mCSB_container')).addClass('new');
	updateScrollbar();
}

function onError(evt) {
	websocket.close();
}

function doDisconnect() {
	websocket.close();
}
