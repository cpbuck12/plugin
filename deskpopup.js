function Init()
{
		chrome.extension.sendRequest({ "message" : "getSize" },function(data)
		{
			$("body").css("min-width",data.innerWidth+"px").css('min-height',data.innerHeight+"px");
			$('#bucket').droppable(
			{
				accept : true
			});
			$('.dragit').draggable({
				stack : '#main',
				containment : 'body'
			});
			$('#header').droppable(
			{
				accept : false
			});
		});
}

$(document).ready(function(){
	Init();
});
