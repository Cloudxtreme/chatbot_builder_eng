from d_service import chat
from e_database import login as db_login
from flask import Flask, render_template, request
from flask import jsonify

def login_try(request): 
    user = request.form['user'] 
    password = request.form['password']
    project = request.form['project']
    real_password = db_login.get_password(user)
    server_project = db_login.get_project(user, project)
    if real_password == None or password != real_password:
        msg = '아이디 또는 패스워드가 부정확합니다.'
        return {'msg' : msg, 'success' : 'N'}
    elif server_project == None:
        msg = '프로젝트명이 잘못되었습니다.'
        return {'msg' : msg, 'success' : 'N'}
    else:
        emno = db_login.get_emno(request.remote_addr)
        agent = request.headers.get('User-Agent')
        phones = ["iphone", "android", "blackberry"]
        device = "pc"
        if agent != None:
            for p in phones:
                if p in agent.lower():
                    device = "mobile"
        db_login.insert_login_list(request.remote_addr, "admin", device)
        return {'msg' : '', 'success' : 'Y', 'emno' : emno}
    
def login(request):
    return render_template("login/login.html", logout = 'N', run_chat = 'N')

def login_chat(request):
    user = 'kant1724'
    project = 'bot'
    emno = 'bot'
    room_name = ''
    gubun = '1'
    agent = request.headers.get('User-Agent')
    phones = ["iphone", "android", "blackberry"]
    if agent != None:
        for p in phones:
            if p in agent.lower():
                db_login.insert_login_list(request.remote_addr, "chat", "mobile")
                return chat.chat_mobile(user, project)
    
    db_login.insert_login_list(request.remote_addr, "chat", "pc")
    return render_template("chat/loading.html", user = user, project = project, emno = emno, room_name = room_name, gubun = gubun)

def login_success(request):
    user = request.args.get('user').lower()
    project = request.args.get('project').lower()    
    return render_template("login/login_success.html", user = user, project = project)

def logout(request): 
    return render_template("login/login.html", logout = 'Y')
