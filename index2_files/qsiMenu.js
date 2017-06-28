var lastMenu;
var isNoLinks;

function createMenus(isNoLinksIn)
{
  isNoLinks = isNoLinksIn;

  var i = 0;
  for (i; i< menuCaptions.length; i++)
  {
    if (menuCaptions[i])
	{
	  thisIFrame = document.createElement('iframe');
      thisIFrame.id = 'dropMenu' + i;
      thisIFrame.name = 'dropMenu' + i;
      thisIFrame.frameBorder = 'no';
      thisIFrame.scrolling = 'no';
      thisIFrame.style.position = 'absolute';
      thisIFrame.style.display = 'none';
      thisIFrame.src = 'javascript:parent.createMenuSrc(' + i + ');';

      var longest = 0;
      var j = 0;
      for (; j < menuCaptions[i].length; j++) {
        if (menuCaptions[i][j].length > longest) {
         longest = menuCaptions[i][j].length;
        }
      }

      thisIFrame.style.width = (longest * 7 + 20) + 'px';
      thisIFrame.style.height = (menuCaptions[i].length * 20 ) + 'px';

      document.body.appendChild(thisIFrame);
	  }//*/ //end if
  }//end for
}

function createMenuSrc(menuID)
{
  var src = '';
  src += '<HTML>';
  src += '<HEAD>';
  src += '<link rel="stylesheet" type="text/css" href="TimeConsultant.css">';
  src += '</HEAD>';
  src += '<body class="dropMenu">';
  src += '<table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:#f7f3e4 2px outset;">';

  for (i=0; i<menuCaptions[menuID].length; i++)
  {
    src += '<tr>';
    src += '  <td style="font-family:arial; font-size:11px; border:1px solid black; background-color:#fffbe8; padding-left:3px; padding-right:6px; cursor:hand;" onmouseover="this.style.backgroundColor=\'#172c76\'; this.style.color=\'white\';" onmouseout="this.style.backgroundColor=\'#fffbe8\'; this.style.color=\'black\';"'; 
	if (!isNoLinks)
	  src += ' onclick="parent.hideMenus(); parent.location.href=\'' + menuLinks[menuID][i] + '\'";';
	if (i==0)
	  src += ' style="border-top:0px;">';
	else
	  src += '>';
	src += menuCaptions[menuID][i] + '</td>';
    src += '</tr>';
  }
  src += '</table>';  
  src += '</body>';
  src += '</html>';

  return src;
}

function showMenu(menuID, e)
{

  e = $.event.fix(e);

  hideMenus();
  var thisIFrame = document.getElementById('dropMenu' + menuID);
  
  var left=0; var top=0;
  for(var el=e.target; el && el.tagName!='BODY'; el=el.offsetParent)
  {
    left += el.offsetLeft;
    top += el.offsetTop;
  }

  var scrollTop =  document.body.scrollTop;
  var scrollLeft = document.body.scrollLeft;

  left = Math.max(Math.min(left, document.body.clientWidth + scrollLeft - parseInt(thisIFrame.style.width == '' ? 0 : thisIFrame.style.width)), scrollLeft);

  thisIFrame.style.top = (top + 17) + 'px';
  thisIFrame.style.left = left + 'px';
  thisIFrame.style.display = 'inline';
  document.getElementById('dropMenuLink' + menuID).style.color = '#feff26';

  lastMenu = menuID;
  document.onmousemove = menuMouseMove;

  // Hide menus if they move over another IFRAME
  var allFrames = document.getElementsByTagName('iframe');
  for (i=0; i<allFrames.length; i++)
    if (!allFrames[i].name.indexOf('dropMenu') == 0)
	  window.frames[i].document.onmouseover = hideMenus;
}

function hideMenus()
{
  for (i=0; i<menuCaptions.length; i++)
  {
    if (menuCaptions[i])
	{
	  document.getElementById('dropMenu' + i).style.display = 'none';
      document.getElementById('dropMenuLink' + i).style.color = '';
	}
  }

  document.onmousemove = null;

  var allFrames = document.getElementsByTagName('iframe');
  for (i=0; i<allFrames.length; i++)
	window.frames[i].document.onmouseover = null;
}

function menuMouseMove(e)
{
	if (!e) var e = window.event;
		// e gives access to the event in all browsers
		
  var thisMenu = document.getElementById('dropMenu' + lastMenu);

  if (e.clientX < (parseInt(thisMenu.style.left.replace('px','')) - 40)
   || e.clientX > (parseInt(thisMenu.style.left.replace('px','')) + thisMenu.style.pixelWidth + 40)
   || e.clientY < (parseInt(thisMenu.style.top.replace('px','')) - 40)
   || e.clientY > (parseInt(thisMenu.style.top.replace('px','')) + thisMenu.style.pixelHeight + 40))
  {
    thisMenu.style.display = 'none';
    document.getElementById('dropMenuLink' + lastMenu).style.color = '';
  }
}
