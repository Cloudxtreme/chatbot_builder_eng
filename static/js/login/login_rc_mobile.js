$(document).ready(function() {
	$("#login").click(function() {
		login();
	});
});

function login() {
	var my_religion = $('#my_religion').val();
	var others_religion = $('#others_religion').val();
	$(location).attr('href', '/login_rc_success?my_religion=' + my_religion + "&others_religion=" + others_religion);
}
