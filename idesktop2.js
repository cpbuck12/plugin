$(document).ready(function() {
	var eventName = "OnData";
	var incoming = $(".system > .page_data");
	var outgoing = $(".system > .extension_data");

	incoming.each(function() {
		$(this).change(function() {
		// todo: handle messages from extension
		  document.writeln(incoming.text());
	  });
	});
	outgoing.text('test message');
	var event = document.createEvent("Event");
	event.initEvent(eventName,true,true);
	incoming[0].addEventListener(eventName,function() {
		outgoing[0].dispatchEvent(event);
		alert("changed, sucka!");
	});
});