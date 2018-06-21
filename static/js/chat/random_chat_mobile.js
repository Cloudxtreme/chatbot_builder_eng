var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

var full_height = $(window).height();

$(window).resize(function() {
	if ($( window ).height() < full_height) {
		$('.message-box').css("top", "85.5%");
	} else {
		$('.message-box').css("top", "93%");
	}
	$('.message-box').css("height", "40px");
}); 

$(window).load(function() {
	connect();
});

function notify_entrance_of_chat() {
	$.post('/notify_entrance_of_chat', {		
	}).done(function(reply) {
	}).fail(function() {
	});
}

function update_scroll() {
	$('.messages-content').scrollTop(Number.MAX_SAFE_INTEGER);
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
	$('<div class="message message-personal">' + msg + '</div>').appendTo($('.messages-content')).addClass('new');
	setDate();
	$('.message-input').val(null);
	update_scroll();
	send(msg);
	setTimeout(function() {}, 1000 + (Math.random() * 20) * 100);
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

function interact(message){
	$.post('/message_group_chat', {
		user : $('#user').val(),
		project : $('#project').val(),
		msg: message
	}).done(function(reply) {
		var text = reply['answer'];
		if (text != '') {
			$('#.message-input').empty();
		}
		var html = '<div class="message new"><figure class="avatar"><img src="/static/res/ai_image2.png" /></figure>' + text + '</div>';
		$(html).appendTo($('.messages-content')).addClass('new');
	}).fail(function() {
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
	websocket = new WebSocket("ws://" + $('#random_chat_ip').val());
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
	var text = data[0];
	$('<div class="message new"><figure class="avatar"><img src="/static/res/person.png" /></figure>' + text + '</div>').appendTo($('.messages-content')).addClass('new');
	update_scroll();
}

function onError(evt) {
	websocket.close();
}

function doDisconnect() {
	websocket.close();
}
