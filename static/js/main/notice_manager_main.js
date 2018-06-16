var grid_data1 = [];
var grid_demo_id1 = "myGrid1";

var dsOption1= {
	fields :[
		{name : 'num'  },
		{name : 'notice_num'  },
		{name : 'notice_subject'  },
		{name : 'notice_content'  },
		{name : 'image_cnt'  },
		{name : 'rgsn_date'  },
		{name : 'notice_start_date'  },
		{name : 'notice_end_date'  },
		{name : 'complete_yn'  }
	],
	recordType : 'array',
	data : grid_data1
}

var colsOption1 = [
	 {id: 'num' , header: "NUM" , width :60 },
	 {id: 'notice_num' , header: "NOTICE NUM" , width :100 },
	 {id: 'notice_subject' , header: "NOTICE NAME" , width :200 },
	 {id: 'notice_content' , header: "NOTICE CONTENT" , width :340 },
	 {id: 'notice_start_date' , header: "NOTICE START" , width :100 },
	 {id: 'notice_end_date' , header: "NOTICE END" , width :100 },
	 {id: 'complete_yn' , header: "COMPLETE YN" , width :100 }
];

var gridOption1={
	id : grid_demo_id1,
	width: "900",
	height: "690",
	container : 'new_request_grid', 
	replaceContainer : true, 
	dataset : dsOption1 ,
	columns : colsOption1,
	pageSize: 30,
	toolbarContent : 'nav goto | pagesize | reload | print filter chart | state',
	pageSizeList : [30,40,60,80,100],
	skin : "mac",
	onRowClick:function(value, record, cell, row, colNO, rowNO, columnObj, grid) {
		var notice_num = record[1];
		$("#notice_num").val(notice_num);
	}
};

var mygrid1 = new Sigma.Grid(gridOption1);
Sigma.Util.onLoad(Sigma.Grid.render(mygrid1));

function readonly_alert() {
	alert("readonly mode");
}

$(document).ready(function() {
	var readonly = $('#readonly_yn').val();
	$("#search_notice").click(function() {
		search_notice();
	});
	$("#add_new_notice").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		add_new_notice();
	});
	$("#modify_notice").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		modify_notice();
	});
	$("#delete_notice").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		delete_notice();
	});
	$("#submit_notice_complete").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		submit_notice_complete();
	});
	$("#subject").keydown(function (key) {
        if (key.keyCode == 13) {
        	search_notice();
        }
    });
	search_notice();
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
        	if (gubun == "search_notice") {
        		search_notice_callback(data);
            } else if (gubun == "submit_notice_complete") {
            	submit_notice_complete_callback();
            } else if (gubun == "delete_notice") {
            	delete_notice_callback();
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}

function add_new_notice() {
	var user = $("#user").val();
	var project = $("#project").val();
	var notice_num = $("#notice_num").val();
	var w = NEW_NOTICE_POPUP_WIDTH;
	var h = NEW_NOTICE_POPUP_HEIGHT;
	var x = (screen.width - w) / 2;
    var y = (screen.height - h) / 3;
	window.open('/new_notice_pop?user=' + user + '&project=' + project + '&gubun=new' + '&notice_num=' + notice_num, '_blank', 'scrollbars=yes, width=' + w + ', height=' + h + ', left=' + x + ', top=' + y);
}

function modify_notice() {
	if ($('#notice_num').val() == '') {
		alert("choose the row to modify.");
		return;
	}
	var user = $("#user").val();
	var project = $("#project").val();
	var notice_num = $("#notice_num").val();
	var w = NEW_NOTICE_POPUP_WIDTH;
	var h = NEW_NOTICE_POPUP_HEIGHT;
	var x = (screen.width - w) / 2;
    var y = (screen.height - h) / 3;
	window.open('/new_notice_pop?user=' + user + '&project=' + project + '&gubun=modify' + '&notice_num=' + notice_num, '_blank', 'scrollbars=yes, width=' + w + ', height=' + h + ', left=' + x + ', top=' + y);
}

function search_notice() {
	var subject = $("#subject").val();
	var complete_yn = $("#complete_yn option:selected").val();
	var user = $("#user").val();
	var project = $("#project").val();
	var input_data = {"complete_yn" : complete_yn, "subject" : subject, "user" : user, "project" : project};
	ajax('/search_notice', input_data, 'search_notice', 'POST');
}

function delete_notice() {
	if ($('#notice_num').val() == '') {
		alert("choose the row to delete.");
		return;
	}
	if (!confirm("do you want to delete?")) {
		return;
	}
	var user = $("#user").val();
	var project = $("#project").val();
	var notice_num = $("#notice_num").val();
	var input_data = {"user" : user, "project" : project, "notice_num" : notice_num};
	ajax('/delete_notice', input_data, 'delete_notice', 'POST');
}

function submit_notice_complete() {
	if ($('#notice_num').val() == '') {
		alert("choose the row to complete.");
		return;
	}
	if (!confirm("do you want to complete?")) {
		return;
	}
	var user = $("#user").val();
	var project = $("#project").val();
	var notice_num = $("#notice_num").val();
	var input_data = {"user" : user, "project" : project, "notice_num" : notice_num};
	ajax('/submit_notice_complete', input_data, 'submit_notice_complete', 'POST');
}

function search_notice_callback(retData) {
	dataArr = [];
	var retList = retData['results'];
	for (var i = 0; i < retList.length; ++i) {
		var a = [];
		a.push(i + 1);
		a.push(retList[i]['notice_num']);
		a.push(retList[i]['notice_subject']);
		a.push(retList[i]['notice_content']);
		a.push(retList[i]['image_cnt']);
		a.push(retList[i]['rgsn_date']);
		a.push(retList[i]['notice_start_date']);
		a.push(retList[i]['notice_end_date']);
		if (retList[i]['complete_yn'] == "Y") {
			a.push("complete");
		} else {
			a.push("notice");
		}
		dataArr.push(a);
	}
	mygrid1.refresh(dataArr);
	mygrid1.gotoPage(1);
	$('#notice_num').val('');
}

function submit_notice_complete_callback() {
	alert("completed.");
	search_notice();
}

function delete_notice_callback() {
	alert("deleted.");
	search_notice();
}
