function highlight(content, word_arr, spanClass) {
	word_arr.sort(function(a, b){
		return b.length - a.length;
	});
	var content_arr = content.split(" ");
	for (var i = 0; i < word_arr.length; ++i) {
		var prefix = '<span ' + (spanClass ? 'class="' + spanClass + '"' : '') + '">';
		var suffix = '</span>';
		for (var j = 0; j < content_arr.length; ++j) {
			var replaceWith = prefix + content_arr[j] + suffix;
			var what_to_compare = content_arr[j].replace(/\?/g, "").replace(/\./g, "").replace(/\,/g, "").replace(/\"/g, "");
			if (what_to_compare == word_arr[i]) {
				content_arr[j] = replaceWith;
			}
		}
	}
	
    return content_arr.join(" ");
}
