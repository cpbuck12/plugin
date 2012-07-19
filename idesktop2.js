$(document).ready(function() {
	
	function sendMessage(msg)
	{
		$(outgoing).text(JSON.stringify(msg));
		outgoing[0].dispatchEvent(event);
	}
	
	function onMessage(msg)
	{
	}
	
	var eventName = "OnData";
	var incoming = $(".system > .page_data");
	var outgoing = $(".system > .extension_data");

	var event = document.createEvent("Event");
	event.initEvent(eventName,true,true);
	
	incoming[0].addEventListener(eventName,function() {
		var msg = JSON.parse($(incoming).text());
		onMessage(msg);
	});
});