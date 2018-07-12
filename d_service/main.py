from flask import Flask, render_template, request, jsonify
from b_trainer.worker import train
from e_database import chat as db_chat

def my_page_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    emno = request.args.get('emno')
    user_ip = request.remote_addr
    return render_template("main/my_page_main.html", user = user, project = project, emno = emno, user_ip = user_ip)

def qna_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    partner_id = request.args.get('partner_id')
    admin_yn = request.args.get('admin_yn')
    readonly_yn = request.args.get('readonly_yn')
    return render_template("main/qna_main.html", user = user, project = project, partner_id = partner_id, admin_yn = admin_yn, readonly_yn = readonly_yn)

def bucket_manager_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    partner_id = request.args.get('partner_id')
    admin_yn = request.args.get('admin_yn')
    readonly_yn = request.args.get('readonly_yn')
    return render_template("main/bucket_manager_main.html", user = user, project = project, partner_id = partner_id, admin_yn = admin_yn, readonly_yn = readonly_yn)

def compression_tag_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    readonly_yn = request.args.get('readonly_yn')
    is_training = train.is_compression_tag_training(user, project)
    return render_template("main/compression_tag_main.html", user = user, project = project, is_training = is_training, readonly_yn = readonly_yn)

def notice_manager_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    readonly_yn = request.args.get('readonly_yn')
    return render_template("main/notice_manager_main.html", user = user, project = project, readonly_yn = readonly_yn)

def train_main(request): 
    user = request.args.get('user')
    project = request.args.get('project')
    admin_yn = request.args.get('admin_yn')
    is_training = train.is_training(user, project)
    return render_template("main/train_main.html", user = user, project = project, admin_yn = admin_yn, is_training = is_training)

def run_main(request): 
    user = request.args.get('user')
    project = request.args.get('project')
    return render_template("main/run_main.html", user = user, project = project)

def update_question_voca_main(request, updater_thread): 
    user = request.args.get('user')
    project = request.args.get('project')
    readonly_yn = request.args.get('readonly_yn')
    is_update = 'N'
    for i in range(len(updater_thread)):
        if updater_thread[i]['user'] == user and updater_thread[i]['project'] == project:
            is_update = 'Y'
            break
    return render_template("main/update_question_voca_main.html", user = user, project = project, is_updating = is_update, readonly_yn = readonly_yn)

def synonym_manager_main(request): 
    readonly_yn = request.args.get('readonly_yn')
    return render_template("main/synonym_manager_main.html", readonly_yn = readonly_yn)

def voca_manager_main(request): 
    readonly_yn = request.args.get('readonly_yn')
    return render_template("main/voca_manager_main.html", readonly_yn = readonly_yn)

def category_manager_main(request):
    readonly_yn = request.args.get('readonly_yn') 
    return render_template("main/category_manager_main.html", readonly_yn = readonly_yn)

def error_detection_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    return render_template("main/error_detection_main.html", user = user, project = project)

def question_generator_main(request, generator_thread):
    user = request.args.get('user')
    project = request.args.get('project')
    is_generate_all_fragment = 'N'
    for i in range(len(generator_thread)):
        if generator_thread[i]['user'] == user and generator_thread[i]['project'] == project:
            is_generate_all_fragment = 'Y'
            break
    
    return render_template("main/question_generator_main.html", user = user, project = project, is_generating_all_fragment = is_generate_all_fragment)

def new_request_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    readonly_yn = request.args.get('readonly_yn')
    return render_template("main/new_request_main.html", user = user, project = project, readonly_yn = readonly_yn)

def chatbot_stat_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    partner_id = request.args.get('partner_id')
    admin_yn = request.args.get('admin_yn')
    readonly_yn = request.args.get('readonly_yn') 
    return render_template("main/chatbot_stat_main.html", user = user, project = project, partner_id = partner_id, admin_yn = admin_yn, readonly_yn = readonly_yn)

def chatbot_config_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    readonly_yn = request.args.get('readonly_yn') 
    return render_template("main/chatbot_config_main.html", user = user, project = project, readonly_yn = readonly_yn)

def training_test_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    return render_template("main/training_test_main.html", user = user, project = project)

def error_statistics_main(request):
    user = request.args.get('user')
    project = request.args.get('project')
    partner_id = request.args.get('partner_id')
    admin_yn = request.args.get('admin_yn')
    readonly_yn = request.args.get('readonly_yn')
    
    return render_template("main/error_statistics_main.html", user = user, project = project, partner_id = partner_id, admin_yn = admin_yn, readonly_yn = readonly_yn)

def loading(request):
    user = request.form['user']
    project = request.form['project']
    emno = request.form['emno']
    room_name = request.form['room_name']
    gubun = request.form['gubun']
    return render_template("chat/loading.html", user = user, project = project, emno = emno, room_name = room_name, gubun = gubun)
