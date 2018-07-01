var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

var full_height = $(window).height();
var chat_title_height = $('.chat-title').height() * 2;

$(window).resize(function() {
	if ($(window).height() < full_height) {				
		$('.chat').css("top", "0px");
		$('.chat-title').hide();
	} else {
		$('.chat').css("top", "11%");
		$('.chat-title').show();
	}
	$('.message-box').css("bottom", "0%");
	$('.message-box').css("height", "40px");
	update_scroll();
}); 

var client;
$(window).load(function() {
    var webPushManager = new WebPushManager();
    webPushManager.start(function(error, registrationId){
    	if (error) {
    		if(error.message) {
    			alert(error.message);
    		} else {
    			alert("Ooops! It seems this browser doesn't support Web Push Notifications :(");
    		}
    	};
     
    	client = RealtimeMessaging.createClient();
    	client.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
    	client.onConnected = function (theClient) {
    		theClient.subscribeWithNotifications(channel, true, registrationId,
    				function (theClient, channel, msg) {
    					webPushManager.forceNotification(msg);
    				});
    	};
    	client.connect(RealtimeAppKey, 'JustAnyRandomToken');
    });
	
    connect();
});

function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

function generateUserChannel() {
	userChannel = localStorage.getItem("channel");
	if (userChannel == null || userChannel == "null") { 
		guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();               
		userChannel = 'channel-' + guid;
		localStorage.setItem("channel", userChannel);
	}
	return userChannel;
}
var channel = generateUserChannel();
function send() {
	if (client) {
		client.send(channel, "This is a web push notification sent using the Realtime JavaScript SDK");
	};
}

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
	var send_data = {"message" : message, "members" : "", "religion" : $('#my_religion').val()};
	websocket.send(JSON.stringify(send_data));
}

function connect() {
	websocket = new WebSocket("ws://" + $('#random_chat_ip').val());
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };
	setTimeout(function() {
		var send_data = {"message" : [$('#my_religion').val(), $('#others_religion').val()], "members" : ""};
		websocket.send(JSON.stringify(send_data));
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
