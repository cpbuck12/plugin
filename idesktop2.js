$(document).ready(function() {
	var incoming = $(".system .name").filter( $(this).text() == "page data").parent().children().filter( ".value" );
	var outgoing = $(".system .name").filter( $(this).text() == "extension data").parent().children().filter( ".value" );

	incoming.each(function() {
		$(this).change(function() {
		// todo: handle messages from extension
		  document.writeln(incoming.text());
	  });
	});
	outgoing.text('test message');
});