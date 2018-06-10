def get_wrong_input_msg(message_count):
    return 'do you want to train this new question?<br><a href="#" onclick="requestNewAnswer(&quot;' + str(message_count) + '&quot;);return false;">[yes]</a><br><br><a href="#" onclick="noRequestNewAnswer(&quot;' + str(message_count) + '&quot;);return false;">[no]</a>'

def get_right_yn_href_msg(message_count):
    thumbs_up = '<img class="thumbs-up-image" onclick="rightAnswer(&quot;' + str(message_count) + '&quot;);return false;" src="/static/res/thumbs_up.png" />'
    thumbs_down = '<img class="thumbs-up-image" onclick="wrongAnswer(&quot;' + str(message_count) + '&quot;);return false;" src="/static/res/thumbs_down.png" />'
    html = '<a style="font-weight:700;font-size:0.9em;">this answer helped you?</a><br><a style="font-size:0.9em;"></a>'
    html += '<p>' + thumbs_up + '&nbsp;&nbsp;' + thumbs_down + '<br><a style="font-size:0.9em;" href="#" onclick="requestNewAnswer(&quot;' + str(message_count) + '&quot;);return false;">[send a request to register this]</a>'
    return html

def get_select_answer_from_list():
    return '<img class="question-mark" src="static/res/question_mark.png" />&nbsp;&nbsp;<a style="font-weight: 700;">choose the right one below.</a><br><br>'

def get_select_question_from_list():
    return '<img class="question-mark" src="static/res/question_mark.png" />&nbsp;&nbsp;<a style="font-weight: 700;">choose the right one below.</a><br><br>'

def get_not_trained_message():
    return '<img class="exclamation-mark" src="static/res/exclamation_mark.png" />&nbsp;&nbsp;<a>the question is not trained yet.</a>'

def get_reserve_question(message):
    return '<div class="reserve-question-div" onclick="setMessageInput(\'' + message.replace('"', '') + '\')"><img class="check-mark" src="static/res/blue_check_mark.png" />&nbsp;&nbsp;<a class="reserve-question-message">' + message + '</a></div><br>'

def get_last_mdfc_date(last_mdfc_date):
    d = last_mdfc_date[0 : 4] + '-' + last_mdfc_date[4 : 6] + '-' + last_mdfc_date[6 : 8]
    return '<br><br><a style="font-weight:700; font-size:0.85em">- last modified: ' + d + "</a>"
