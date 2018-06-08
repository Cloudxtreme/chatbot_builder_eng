from c_engine.core.util import util
from c_engine.core.util import time_util
from e_database import chat
from c_engine.extension.function_processor import excel_exporter
from c_engine.extension.function_processor import tag_manager
import datetime

def set_my_schedule(p):
    user_ip, question, time = p.get('user_ip'), p.get('question'), p.get('time')    
    hour = ''
    minute = ''
    for t in time:
        if t[0] == '시':
            hour = t[1]
        elif t[0] == '분':
            minute = t[1]
    if hour == '':
        return 'wrong input. retry please. time + content ex) 15:30 tea time with my people'
    if minute == '':
        minute = '00'
    time = hour + minute
    chat.insert_schedule(user_ip, question, time)
    if time_util.is_time(time) == False:
        return 'wrong input. retry please. time + content ex) 15:30 tea time with my people'
    kor_time = hour + ":" + minute
    msg = 'schedule is registered.<br>'
    msg += question + '<br>'
    msg += 'reserve time: ' + kor_time + '<br>'
    msg += 'it will alarm you when reserve time comes.'
    
    return msg

def insert_my_frequent_question(p):
    user_ip, question = p.get('user_ip'), p.get('question')    
    chat.insert_my_frequent_question(user_ip, question)
    
    return 'your frequent question is registered.'

def get_today_weather_info(p):
    now = datetime.datetime.now()
    year = now.year
    m = now.month
    d = now.day
    url = 'http://www.wunderground.com/history/airport/KBNA/' + str(year) + '/' + str(m) + '/' + str(d) + '/DailyHistory.html'
    res = 'MODAL=' + url
    return res

def recommend_movie(p):
    url = 'https://www.rottentomatoes.com/'
    res = 'MODAL=' + url
    return res

def order_pizza(p):
    url = 'http://eng.pizzahut.co.kr/EngOrder/'
    res = 'MODAL=' + url
    return res  

def scan_param(msg):
    param = []
    t = {"time" : '', "date_from" : '', "date_to" : '', "acct_no" : '', "rnn" : '', "cust_no" : ''}
    param.append(t)
    msg = msg.replace(" ", "").replace("-", "")
    has, acct_no, replacedMsg = tag_manager.is_acct_no(msg)
    if has:
        t["acct_no"] = acct_no
    has, cust_no, replacedMsg = tag_manager.is_cust_no(replacedMsg)
    if has:
        t["cust_no"] = cust_no
    has, cust_no, replacedMsg = tag_manager.is_cust_no2(replacedMsg)
    if has:
        t["cust_no"] = cust_no
    has, rnn, replacedMsg = tag_manager.is_rnn(replacedMsg)
    if has:
        t["rnn"] = rnn
    has, date_from, date_to, replacedMsg = tag_manager.is_date_from_to(replacedMsg)
    if has:
        t["date_from"] = date_from
        t["date_to"] = date_to
    has, time, replacedMsg = tag_manager.is_time(replacedMsg)
    if has:
        t["time"] = time
    
    return param, replacedMsg
