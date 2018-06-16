var grid_data1 = [];
var grid_demo_id1 = "myGrid1";

var dsOption1= {
	fields :[
		{name : 'num'  },
		{name : 'voca_nm'  },
		{name : 'voca_synonym'  },
		{name : 'keyword_yn'  }
	],
	recordType : 'array',
	data : grid_data1
}

var colsOption1 = [
	 {id: 'num' , header: "NUM" , width :60 },
	 {id: 'voca_nm' , header: "VOCA NAME" , width :300 },
	 {id: 'voca_synonym' , header: "SYNONYM" , width :420 },
	 {id: 'keyword_yn' , header: "KEYWORD" , width :60 }
];

var gridOption1={
	id : grid_demo_id1,
	width: "900",
	height: "644",
	container : 'voca_grid', 
	replaceContainer : true, 
	dataset : dsOption1 ,
	columns : colsOption1,
	pageSize: 27,
	toolbarContent : 'nav goto | pagesize | reload | print filter chart | state',
	pageSizeList : [27,54,80,100],
	skin : "mac",
	onRowClick:function(value, record, cell, row, colNO, rowNO, columnObj, grid) {
		var voca_nm = record[1];
		$("#voca_nm").val(voca_nm);
	}
};

var mygrid1 = new Sigma.Grid(gridOption1);
Sigma.Util.onLoad(Sigma.Grid.render(mygrid1));

function readonly_alert() {
	alert("readonly mode");
}

$(document).ready(function() {
	var readonly = $('#readonly_yn').val();
	$("#search_voca").click(function() {
		search_voca();
	});
	$("#new_voca").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		new_voca();
	});
	$("#submit_voca").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		submit_voca();
	});
	$("#delete_voca").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		delete_voca();
	});
	$("#submit_voca_keyword").click(function() {
		if (readonly == 'Y') {
			readonly_alert();
			return;
		}
		submit_voca_keyword();
	});
	$("#subject").keydown(function (key) {
        if (key.keyCode == 13) {
        	search_voca();
        }
    });
	search_voca();
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
        	if (gubun == "search_voca") {
        		search_voca_callback(data['results']);
            } else if (gubun == "submit_voca") {
            	submit_voca_callback(data);
            } else if (gubun == "delete_voca") {
            	delete_voca_callback();
            } else if (gubun == "submit_voca_keyword") {
            	submit_voca_keyword_callback();
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}

function search_voca() {
	var input_data = {"voca_nm" : $('#subject').val()};
	ajax('/search_voca', input_data, 'search_voca', 'POST');
}

function search_voca_callback(ret_data) {
	grid_data1 = [];
	for (var i = 0; i < ret_data.length; i++) {
		var a = [];
		a.push(i + 1);
		a.push(ret_data[i]["voca_nm"]);
		a.push(ret_data[i]["voca_synonym"]);
		a.push(ret_data[i]["keyword_yn"]);
		grid_data1.push(a);
	}
	mygrid1.refresh(grid_data1);
	mygrid1.gotoPage(1);
	$("#voca_nm").val('');
}

function submit_voca() {
	if ($("#voca_input").val() == '') {
		alert("write the voca name.");
		return;
	}
	if (!confirm("do you want to save?")) {
		return;
	}
	var input_data = {"voca_nm" : $("#voca_input").val()};
	
	ajax('/submit_voca', input_data, 'submit_voca', 'POST');
}

function submit_voca_keyword() {
	if ($("#voca_nm").val() == '') {
		alert("choose the voca.");
		return;
	}
	if (!confirm("do you want to register/unregister?")) {
		return;
	}
	var voca_nm = $("#voca_nm").val();
	var input_data = {"voca_nm" : voca_nm};
	
	ajax('/submit_voca_keyword', input_data, 'submit_voca_keyword', 'POST');
}

function delete_voca() {
	if ($("#voca_nm").val() == '') {
		alert("choose the word to delete.");
		return;
	}
	if (!confirm("do you want to delete?")) {
		return;
	}
	var input_data = {"voca_nm" : $("#voca_nm").val()};
	ajax('/delete_voca', input_data, 'delete_voca', 'POST');
}

function update_voca_synonym() {
	if (!confirm("do you want to update synonym?")) {
		return;
	}
	var input_data = {};
	ajax('/update_voca_synonym', input_data, 'update_voca_synonym', 'POST');
}

function submit_voca_callback(data) {
	if (data == 'N') {
		alert("voca already exists.");
	} else {
		alert("saved word.");
	}
	search_voca();
}

function submit_voca_keyword_callback() {
	alert("process completed.");
	search_voca();
}

function delete_voca_callback() {
	alert("deleted.");
	search_voca();
}
