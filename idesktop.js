var ID = "obajajmbgkhkakokholoecgcemmcinle";

var port;
alert("injection!");
port = chrome.extension.connect();

function getElementsByClassName(elems,klass)
{
  var r = new RegExp(klass+"($|\W*)");
  var a;
  var ret = [];

  if(elems.constructor==Array)
    a = elems;
  else
    a = [elems];
  for(idx in a)
  {
    for(idx2 in a[idx].childNodes)
      if(r.test(a[idx].childNodes[idx2].className))
        ret.push(a[idx].childNodes[idx2]);
  }
  return ret;
}

var system_elements = document.getElementsByClassName("system");
alert("system_elements.length == "+system_elements.length);
//var name_elements = getElementsByClassName(system_elements,"name");
//alert(JSON.stringify(system_elements));

var name_elements = [];
for(var isyselem = 0;isyselem <  system_elements.length;isyselem++)
{
  var names = system_elements[isyselem].getElementsByClassName("name");
  for(var inameelem = 0;inameelem < names.length;inameelem++)
  {
    name_elements.push(names[inameelem]);
  }
}
//alert("system_elements="+JSON.stringify(system_elements));
//alert(JSON.stringify(name_elements));

var shares = {};

for(var inameelem = 0;inameelem < name_elements.length;inameelem++) {
	var name_element = name_elements[inameelem];
	var value_elements = name_element.parentElement.getElementsByClassName("value");
	shares[getElementText(name_element)] = value_elements[0];
}

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

//alert(JSON.stringify(shares));
function handlePosting()
{
   alert("onchange()");
   port.postMessage({ message : getElementText(shares["extension data"]) });
}

  port.onMessage.addListener(function(msg) {
    setElementText(shares["page data"],msg.message);
  });
  shares["extension data"].onchange = "handlePosting();"
setElementText(shares["extension data"],"pizza");
