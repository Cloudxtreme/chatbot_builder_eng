$(document).ready(function() {
	$("#submit_synonym").click(function() {
		submit_synonym();
	});
});
	
function ajax(url, input_data, gubun, method) {
	$.ajax(url, {
		type: method, 
        data: JSON.stringify(input_data),
        async: false,
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        success: function (data, status, xhr) {
        	if (gubun == "submit_synonym") {
        		submit_synonym_callback();
            } 
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}

function submit_synonym() {
	if ($("#synonym_nm").val() == "") {
		alert("write synonym");
		return;
	}
	if (!confirm("do you want to send?")) {
		return;
	}
	var synonym_num = "";
	var synonym_nm = $("#synonym_nm").val();
	var synonym_tag = $("#synonym_tag").val();
	var data_type = "new";
	var input_data = [{"synonym_num" : synonym_num, "synonym_nm" : synonym_nm, "synonym_tag" : synonym_tag, "data_type" : data_type}];
	
	ajax('/submit_synonym', input_data, 'submit_synonym', 'POST');
}

function submit_synonym_callback() {
	alert("sent.");
	window.close();
}
