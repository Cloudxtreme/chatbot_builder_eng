from d_service import chat
from e_database import login as db_login
from flask import Flask, render_template, request
from flask import jsonify

def login_try(request): 
    user = request.form['user'] 
    password = request.form['password']
    project = request.form['project']
    partner_id = request.form['partner_id']
    real_password = db_login.get_password(user)
    server_project = db_login.get_project(user, project)    
    if real_password == None or password != real_password:
        msg = 'Wrong ID or Password.'
        return {'msg' : msg, 'success' : 'N'}
    elif server_project == None:
        msg = 'Wrong ProjectName.'
        return {'msg' : msg, 'success' : 'N'}
    else:
        admin_yn = 'N'
        readonly_yn = 'N'        
        if partner_id == None or partner_id == '':
            readonly_yn = 'Y'
        else:
            admin_yn = db_login.check_partner_id(partner_id)
            if admin_yn == None or admin_yn == '':
                msg = 'Wrong PartnerId.'
                return {'msg' : msg, 'success' : 'N'}    
        emno = db_login.get_emno(request.remote_addr)
        agent = request.headers.get('User-Agent')                    
        if agent == None:
            agent = ''
        db_login.insert_login_list(request.remote_addr, "admin", agent)
        return {'msg' : '', 'success' : 'Y', 'emno' : emno, 'partner_id' : partner_id, 'admin_yn' : admin_yn, 'readonly_yn' : readonly_yn}
    
def login(request):
    agent = request.headers.get('User-Agent')
    phones = ["iphone", "android", "blackberry"]
    if agent != None:
        for p in phones:
            if p in agent.lower():
                db_login.insert_login_list(request.remote_addr, "chat", agent)
                return chat.chat_mobile('kant1724', 'bot')
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
                db_login.insert_login_list(request.remote_addr, "chat", agent)
                return chat.chat_mobile(user, project)
    if agent == None:
        agent = ''
    db_login.insert_login_list(request.remote_addr, "chat", agent)
    return render_template("chat/loading.html", user = user, project = project, emno = emno, room_name = room_name, gubun = gubun)

def login_rc(request):
    agent = request.headers.get('User-Agent')
    phones = ["iphone", "android", "blackberry"]
    if agent != None:
        for p in phones:
            if p in agent.lower():
                db_login.insert_login_list(request.remote_addr, "chat", agent)
                return render_template("login/login_rc_mobile.html") 
    return render_template("login/login_rc.html") 

def login_rc_success(request):
    user = 'kant1724'
    project = 'rc'
    my_religion = request.args.get('my_religion')
    others_religion = request.args.get('others_religion')   
    agent = request.headers.get('User-Agent')
    phones = ["iphone", "android", "blackberry"]
    if agent != None:
        for p in phones:
            if p in agent.lower():
                db_login.insert_login_list(request.remote_addr, "chat", agent)
                return chat.random_chat_mobile(user, project, my_religion, others_religion)
    return chat.random_chat(user, project, my_religion, others_religion)

def login_success(request):
    user = request.args.get('user').lower()
    project = request.args.get('project').lower()    
    return render_template("login/login_success.html", user = user, project = project)

def logout(request): 
    return render_template("login/login.html", logout = 'Y')

def notify_entrance_of_chat(request):
    db_login.insert_enter_info(request.remote_addr)    
    return ''

def request_for_partnership(request):
    email = request.form['email'] 
    objective = request.form['objective']
    db_login.insert_request_for_partnership(email, objective)    
    return ''
