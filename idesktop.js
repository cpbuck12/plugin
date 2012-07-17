var port;
var event;
var domShares = {};
var eventName = "OnData";

function InitDOM()
{
var system_elements = document.getElementsByClassName("system");

function getElementText(elem)
{
	if("textContent" in elem)
		return elem.textContent;
	else if("innertText" in elem)
		return elem.innerText;
}

function setElementText(elem,val)
{
	if("textContent" in elem)
		elem.textContent = val;
	else if("innertText" in elem)
		elem.innerText = val;
}

for(isys = 0;isys < system_elements.length;isys++)
{
  var system_element = system_elements[isys];
  for(ichld = 0;ichld < system_element.childNodes.length;ichld++)
  {
    var child = system_element.childNodes[ichld];
    if(!(getElementText in child))
       child['getElementText'] = function() { return getElementText(child); }
    if(!(setElementText in child))
       child['setElementText'] = function(val) { setElementText(child,val); }
    domShares[child.className] = child;
  }
}

}// InitDOM

function InitEvents() {
  extensionPort = chrome.extension.connect();
  event = document.createEvent("Event");
  event.initEvent(eventName,true,true);
  var page_data = domShares["page_data"];
  var extension_data = domShares["extension_data"];
  
  extensionPort.onMessage.addListener(function (msg) { // from background to page
    page_data.setElementText(msg.message);
    page_data.dispatchEvent(event);
  });
  extension_data.addEventListener(eventName,function() { // from page to background
    alert(eventName+"333");
    extensionPort.postMessage({ message : extension_data.getElementText() });
  });
  page_data.setElementText("");  // initialize page
  page_data.dispatchEvent(event); 
}

InitDOM();
InitEvents();
alert("done inits");