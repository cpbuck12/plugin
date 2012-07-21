$(document).ready(function() {
	
	function sendMessage(msg)
	{
		$(outgoing).text(JSON.stringify(msg));
		outgoing[0].dispatchEvent(event);
	}
	
	function onMessage(msg)
	{
	  if(message in msg)
	    switch(msg.message)
	    {
	      case "Open" : onOpen();
	      break;
	      case "PutOnDeck" : onPutOnDeck(msg.iconInfo);
	      break;
	      case "DisplayFrame" : onDisplayFrame(msg.iconInfo,msg.frameInfo);
	      break;
	      case "HideFrame" : onHideFrame(msg.iconInfo);
	      break;
	    }
	}
	function sendMessageOpened()
	{
	  sendMessage({ message : "Opened" });
	}
	function sendPlacedOnDeck(iconInfo)
	{
	  sendMessage({ message : "PlacedOnDeck", "iconInfo" : iconInfo });
	}
	function sendDeckToBoard(iconInfo,destintion)
	{
	  sendMessage({ message : "DeckToBoard", "iconInfo" : iconInfo, "destination" : destination	});
	} 
	function sendBoardToBoard(iconInfo,destination)
	{
	  sendMessage({ message : "BoardToBoard", "iconInfo" : iconInfo, "destination" : destination });
	} 
	function sendToExit(iconInfo)
	{
	  sendMessage({ message : "ToExit", "iconInfo" : iconInfo	});
	}
	function sendStartedHovering(iconInfo)
	{
	  sendMessage({ message : "StartedHovering", "iconInfo" : iconInfo	});
	}
	function sendStoppedHovering()
	{
	  sendMessage({ message : "StoppedHovering" });
	}
	function sendLockFrame(iconInfo, frameInfo)
	{
	  sendMessage({ message : "LockFrame" , "iconInfo" : iconInfo	, "frameInfo" : frameInfo });
	}
	function sendUnlockFrame(iconInfo)
	{
	  sendMessage({ message : "UnlockFrame" , "iconInfo" : iconInfo });
	}
      var emptyFunction = function() {};
	var onPutOnDeck = sendPlacedOnDeck;
	var onDisplayFrame = emptyFunction;
	var onHideFrame = emptyFunction;
	
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