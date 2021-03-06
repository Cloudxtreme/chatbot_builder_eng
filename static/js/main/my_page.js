var grid_data1 = [[]];
var grid_demo_id1 = "myGrid1";

var dsOption1= {
	fields :[
		{name : 'num'  },
		{name : 'rpsn_question'  },
		{name : 'answer'  },
		{name : 'answer_num'  },
		{name : 'category_nm'  },
		{name : 'image_cnt'  },
		{name : 'rgsn_user'  }
	],
	recordType : 'array',
	data : grid_data1
}

var colsOption1 = [
	 {id: 'num' , header: "NUM" , width :40 }, 
	 {id: 'rpsn_question' , header: "REPRESENT QUESTION" , width :370 },
	 {id: 'answer' , header: "ANSWER" , width :380, toolTip : true, toolTipWidth : 350},
	 {id: 'answer_num' , header: "ANSWER NUM" , width :100 },
	 {id: 'category_nm' , header: "CATEGORY NUM" , width :120 },
	 {id: 'image_cnt' , header: "IMAGE COUNT" , width :100 },
	 {id: 'rgsn_user' , header: "REGISTER USER" , width :100 }
];

var gridOption1={
	id : grid_demo_id1,
	width: "900",
	height: "600",
	container : 'container', 
	replaceContainer : true, 
	dataset : dsOption1 ,
	columns : colsOption1,
	pageSize: 50,
	toolbarContent : 'nav goto | pagesize | reload | print filter chart | state',
	pageSizeList : [50,100],
	skin : "mac",
	onMouseOver:function(value, record, cell, row, colNo, rowNo, columnObj, grid) {
		if (columnObj && columnObj.toolTip) {
			grid.showCellToolTip(cell,columnObj.toolTipWidth);
		} else {
			grid.hideCellToolTip();
		}
	}
};

var mygrid1 = new Sigma.Grid(gridOption1);
Sigma.Util.onLoad(Sigma.Grid.render(mygrid1));
$(document).ready(function() {
	search_answer();
});

function search_answer() {
	var gubun = "3";
	var subject = $("#user_ip").val();
	var user = $("#user").val();
	var project = $("#project").val();
	var input_data = {"gubun" : gubun, "subject" : subject, "user" : user, "project" : project};
	
	ajax('/search_answer', input_data, 'search_answer', 'POST');
}

function search_answer_callback(retData) {
	dataArr = [];
	var retList = retData['results'];
	for (var i = 0; i < retList.length; ++i) {
		var a = [];
		a.push(i + 1);
		a.push(retList[i]['rpsn_question']);
		a.push(retList[i]['answer']);
		a.push(retList[i]['answer_num']);
		a.push(retList[i]['category_nm']);
		a.push(retList[i]['image_cnt']);
		a.push(retList[i]['rgsn_user']);
		dataArr.push(a);
	}
	mygrid1.refresh(dataArr);
	mygrid1.gotoPage(1);
}

function ajax(url, input_data, gubun, method) {
	$.ajax(url, {
		type: method, 
        data: JSON.stringify(input_data),
        async: false,
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        success: function (data, status, xhr) {
            if (gubun == "search_answer") {
            	search_answer_callback(data);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
        	if(jqXhr.status==404) {
        		alert(textStatus);
            }
        }
    });
}
