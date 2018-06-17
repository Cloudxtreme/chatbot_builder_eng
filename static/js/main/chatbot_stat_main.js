var grid_data1 = [];
var grid_demo_id1 = "myGrid1";

var dsOption1= {
	fields :[
		{name : 'num'  },
		{name : 'answer_num'  },
		{name : 'answer'  },
		{name : 'show_cnt'  },
		{name : 'click_cnt'  }
	],
	recordType : 'array',
	data : grid_data1
}

var colsOption1 = [
	 {id: 'num' , header: "NUM" , width :60 },
	 {id: 'answer_num' , header: "ANSWER_NUM" , width :100 },
	 {id: 'answer' , header: "ANSWER" , width :500 },
	 {id: 'show_cnt' , header: "SHOW_COUNT" , width :100 },
	 {id: 'click_cnt' , header: "CLICK_COUNT" , width :100 }	 
];

var gridOption1={
	id : grid_demo_id1,
	width: "900",
	height: "644",
	container : 'stat_grid', 
	replaceContainer : true, 
	dataset : dsOption1 ,
	columns : colsOption1,
	pageSize: 27,
	toolbarContent : 'nav goto | pagesize | reload | print filter chart | state',
	pageSizeList : [27,54,80,100],
	skin : "mac",
	onRowClick:function(value, record, cell, row, colNO, rowNO, columnObj, grid) {
	}
};

var mygrid1 = new Sigma.Grid(gridOption1);
Sigma.Util.onLoad(Sigma.Grid.render(mygrid1));

$(document).ready(function() {
	$("#search_chatbot_stat").click(function() {
		search_chatbot_stat();
	});
	$("#subject").keydown(function (key) {
        if (key.keyCode == 13) {
        	search_chatbot_stat();
        }
    });
	search_chatbot_stat();
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
        	if (gubun == "search_chatbot_stat") {
        		search_chatbot_stat_callback(data['results']);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}

function search_chatbot_stat() {
	var user = $('#user').val();
	var project = $('#project').val();	
	var partner_id = $('#partner_id').val();
	var admin_yn = $('#admin_yn').val();
	var readonly_yn = $('#readonly_yn').val();
	var subject = $('#subject').val();
	var input_data = {"user" : user, "project" : project, "partner_id" : partner_id, "admin_yn" : admin_yn, "readonly_yn" : readonly_yn, "subject" : subject};
	ajax('/search_chatbot_stat', input_data, 'search_chatbot_stat', 'POST');
}

function search_chatbot_stat_callback(ret_data) {
	grid_data1 = [];
	for (var i = 0; i < ret_data.length; i++) {
		var a = [];
		a.push(i + 1);
		a.push(ret_data[i]["answer_num"]);
		a.push(ret_data[i]["answer"]);
		a.push(ret_data[i]["show_cnt"]);
		a.push(ret_data[i]["click_cnt"]);
		grid_data1.push(a);
	}
	mygrid1.refresh(grid_data1);
	mygrid1.gotoPage(1);
}
