function getGuid()
{
  return "1ebb96f1-058d-4a84-8fdb-eb4abda53f0a";
}
/*

http://www.joezimjs.com/javascript/the-lazy-mans-url-parsing/

var parser = document.createElement('a');
parser.href = "http://example.com:3000/pathname/?search=test#hash";
 
parser.protocol; // => "http:"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.search;   // => "?search=test"
parser.hash;     // => "#hash"
parser.host;     // => "example.com:3000"

*/
function parseUrl(url)
{
  var div = $("<div />");
  $(div).prepend("<a />");
  var first_child = $(":first-child",div);
  first_child[0].href = url;
  $(div).html($(div).html());
  var a = $(":first-child",div)[0];
  var ret = {
    protocol: a.protocol,
    hostname: a.hostname,
    port: a.port,
    pathname: a.pathname,
    search: a.search,
    hash: a.hash,
    host: a.host
  };
  return ret;
}

function isiDesked(tabExtra)
{
  return tabExtra.urlInfo.hostname in icons;
}

function iDeskable(tabExtra)
{
  if(/google.com/.test(tabExtra.urlInfo.hostname)) return true;
  if(/ebay.com/.test(tabExtra.urlInfo.hostname)) return true;
  if(/twitter.com/.test(tabExtra.urlInfo.hostname)) return true;
  if(/facebook.com/.test(tabExtra.urlInfo.hostname)) return true;
  return false;
}

var icons = {};
var popups = [];
var areas = [];
var rows = [];

function createGrid(options)
{
  rows = [];
}

function createNewiDesktop()
{
  createGrid();
}

function getOnDeck()
{
	var list = [];
	for(idx in icons)
	{
		if(z in icons[idx])
			list.push(z);
	}
	return list.sort(function(a,b) { return (a.z >= b.z); });	 
}

function putOnDeck(icon)
{
	var list = getOnDeck();
	icon.z = list[0].z+1;
	icons[icon.urlInfo.hostname] = {};
	// todo: tell client
	port.postMessage({ msg : "putOnDock", "icon" : icon });
}

function getDimensions()
{
	var ret = {};
	ret.rows = rows.length;
	var maxColumn = -1;
	for(row in rows)
	{
		var theRow = rows[row];
		if(theRow.length > 0)
		  maxColumn = Math.max(theRow[theRow.length-1],maxColumn);
	}
	return { rows : rows.length, columns : maxColumn+1 };
}

function unplace(options)
{
	var row = rows[options.row];
	for(i = 0;i < row.length;i++)
		if(row[i].column == options.column)
		{
			row.splice(i,1);
			if(row.length == 0)
			{
				rows.splice(options.row,1);
			}
		}
}

function growRowsUntil(numberOfRows)
{
	while(rows.length <= numberOfRows)
		rows.push([]);
}

function trimGrid()
{
	for(row = rows.length-1;;row--)
	{
		if(rows[row].length > 0)
			break;
	}
	if(rows[row].length == 0)
	{
		rows.splice(row,rows.length-row);
	}
}

function place(icon,options)
{
	var dim1 = getDimensions();
	if(trash in options && options.trash)
	{
		if(row in icon)
			unplace(icon);
		delete icon.row;
		delete icon.column;
		delete icons[icon.urlInfo.hostname];
	}
	else
	{
		unplace(icon);
		growRowsUntil(options.row);
		rows[options.row][options.column] = icon;
		icon.row = options.row;
		icon.column = options.column;
	}
	trimGrid();
	var dim2 = getDimensions();
	if(dim1 != dim2)
		;  // tell client of resize
}

function onMoveIcon(options)
{
}

function onMoveOffDeck(options)
{
	if(trash in options && options.trash)
	{
		var icon = removeOnDeck();
		// todo:tell client
		port.postMessage({ msg : "removeOnDeck" });
		place(icon,{ trash: true });
		port.postMessage({ msg : "place" });
		// todo:tell client
	}
	else
	{
		var icon = removeOnDeck();
		// todo:tell client
		place(icon,{ row : options.row, column : options.column });
		// todo:tell client		
	}
}

// what should we track?
// a list of icons
//   its associated popup
//   z-level
// a list of popups.
//   its location
//   is locked?
//   its associated icon
//   cached representation
// a list of rows
//   a list of positions   
//     a list of who is on it

function TabExtra(tab)
{
  $.extend(true,this,tab);
  this.urlInfo = parseUrl(tab.url);
}


function isTabiDesktop(tab)
{
  var regexp = new RegExp("/"+getGuid()+"/");
  return regexp.test(tab.url);
}

function iDesktopUrl()
{
  return "file://h:/plugin/idesktop.html?guid=" + getGuid() + "&eid=" + chrome.i18n.getMessage("@@extension_id");
}

var port;

function openiDesktop(options)
{
  // first find an existing one
  chrome.tabs.query(
  {
    windowType: 'normal',
    url: iDesktopUrl()
  }, function (tabs)
  {
    if(tabs.length == 0)
    {
      if(rows.length == 0)
        createNewiDesktop();
      chrome.tabs.create({ url: iDesktopUrl() },function(tab){/*
        port = chrome.tabs.connect(tab.id);
        port.onMessage(function(msg) {
          if(msg.message == "start")
          {
            // todo: response to startup
          }
          else if(msg.message == "MoveOffDeck")
          {
            onMoveOffDeck(msg.options);
          }
        });*/
      });
    }
    else chrome.tabs.move([tabs[0].id], // move the existing tab here
    {
      windowId: chrome.wndows.WINDOW_ID_CURRENT,
      index: 0
    });
  });
}

function onPageActionClicked(tab)
{
  if(isiDesked(tab))
    openiDesktop({}); // open iDesktop with no action
  else
    openiDesktop({}); // open iDesktop with new Icon
}

function updatePageAction(tab)
{
  if(tab.status == "loading")
    chrome.pageAction.hide(tab.id);
  else
  {
    if(isTabiDesktop(tab)) chrome.pageAction.hide(tab.id);
    else
    {
      if(iDeskable(tab))
      {
        if(isiDesked(tab))
          chrome.pageAction.setIcon({ tabId : tab.id, path: "icon.png" });
        else
          chrome.pageAction.setIcon({ tabId : tab.id, path: "iconred.png" });
        chrome.pageAction.show(tab.id);
      }
      else
        chrome.pageAction.hide(tab.id);
    }
  }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab)
{
  updatePageAction(new TabExtra(tab));
});

chrome.pageAction.onClicked.addListener(function (tab)
{
  onPageActionClicked(new TabExtra(tab));
});

chrome.tabs.query(
{
  windowType: "normal"
}, function (tabs)
{
  for(var idx in tabs)
  {
    updatePageAction(new TabExtra(tabs[idx]));
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function (msg){
    alert(msg.message);
  });
});