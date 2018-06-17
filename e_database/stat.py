from e_database.sql_processor import select 
from e_database.sql_processor import update

def search_chatbot_stat(subject, user, project, partner_id, admin_yn, readonly_yn):
    sql = "SELECT A.ANSWER_NUM, B.ANSWER, A.SHOW_CNT, A.CLICK_CNT FROM ANSWER_STAT_" + user + "_" + project + " A, ANSWER_BUILDER_" + user + "_" + project + " B WHERE A.ANSWER_NUM = B.ANSWER_NUM"
    if subject != '':
        sql += " AND B.ANSWER LIKE '%" + subject + "%'"
    if admin_yn == 'N' and readonly_yn == 'N':
        sql += " AND B.PARTNER_ID = '" + partner_id + "'" 
    result = select.fetch(sql)
    res = []
    for r in result:
        res_dict = {}
        res_dict['answer_num'] = r[0] 
        res_dict['answer'] = r[1]
        res_dict['show_cnt'] = r[2]
        res_dict['click_cnt'] = r[3]
        res.append(res_dict)
        
    return res

def update_popup_show_count(user, project, answer_num):
    sql = "UPDATE ANSWER_STAT_" + user + "_" + project + " SET SHOW_CNT = SHOW_CNT + 1 WHERE ANSWER_NUM = '" + answer_num + "'"
    update.commit(sql)

def update_popup_click_count(user, project, answer_num):
    sql = "UPDATE ANSWER_STAT_" + user + "_" + project + " SET CLICK_CNT = CLICK_CNT + 1 WHERE ANSWER_NUM = '" + answer_num + "'"
    update.commit(sql)
    
def insert_chatbot_stat(answer_num, user, project):
    sql = "INSERT INTO ANSWER_STAT_" + user + "_" + project + " VALUES ('" + answer_num + "', 0, 0)"
    update.commit(sql)
    
def delete_chatbot_stat(answer_num, user, project):
    sql = "DELETE FROM ANSWER_STAT_" + user + "_" + project + " WHERE ANSWER_NUM = '" + answer_num + "'"
    update.commit(sql)
