def get_function_by_question(question):
    if question == 'my schedule':
        return '$CALL set_my_schedule()'
    elif question == 'frequent question':
        return '$CALL insert_my_frequent_question()'
    
    return '' 

def is_fixed_question(question):
    if question == 'my schedule':
        return True
    elif question == 'frequent question':
        return True
    
    return False
