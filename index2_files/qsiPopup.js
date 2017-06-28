
addEvent(window, 'load', initAll);

function initAll()
{
  var allPopups = document.getElementsByName('qsiPopup');
  window.popupCnt = 0;

  for (var i=0; i<allPopups.length; i++)
  {
    var thisPopup = allPopups[i];
    thisPopup.id = 'popup' + (++window.popupCnt);
    thisPopup.popObj = new clsQSIPopup(thisPopup);
  }
}

function addEvent(obj, type, fn)
{
	if (obj.addEventListener)
		obj.addEventListener(type, fn, false);
	else if (obj.attachEvent)
	{
		obj['e'+type+fn] = fn;
		obj[type+fn] = function() { obj['e'+type+fn](window.event); }
		obj.attachEvent('on'+type, obj[type+fn]);
	}
}

function removeEvent(obj, type, fn)
{
	if (obj.removeEventListener)
		obj.removeEventListener(type, fn, false);
	else if (obj.detachEvent)
	{
		obj.detachEvent('on'+type, fn);
	}
}

function clsQSIPopup(thisEl)
{
  this.element = thisEl;
  this.element.style.marginLeft = parseInt(this.element.x ? this.element.x : 0);
  this.element.style.marginTop = parseInt(this.element.y ? this.element.y : 0);
  this.element.style.cursor ='default';

  addEvent(this.element, 'click', function() { this.popObj.popup(); } );
  
   if (this.element.getAttribute('isMouseover') == 'Y')
     addEvent(this.element, 'mouseover', function() { this.popObj.popup(); } );
}

clsQSIPopup.prototype.popup = function()
{
  if (window.openPop == this.element)
    return;

  if (window.openPop != null)
    openPop.killIt();

  window.openPop = this.element;

  popFrame = document.createElement('iframe');
  popFrame.id = 'popFrame' + this.element.id;
  popFrame.name = 'popFrame' + this.element.id;
  popFrame.frameBorder = 'no';
  popFrame.scrolling = 'no';
  popFrame.style.position = 'absolute';
  popFrame.style.padding = '0px';
  popFrame.style.display = 'none';
  popFrame.style.zIndex = '10';
  popFrame.style.left = '0px';
  popFrame.style.top = '0px';
  popFrame.src = 'javascript:parent.document.getElementById(\'' + this.element.id + '\').popObj.getPopSrc();';
  popFrame.setAttribute('isLoading', true);
  
  this.element.parentNode.appendChild(popFrame);

  setTimeout('document.getElementById(\'' + this.element.id + '\').popObj.popup_2()', 0);
};

clsQSIPopup.prototype.popup_2 = function()
{
  if (popFrame.getAttribute('isLoading') == true || window.frames[popFrame.name].document.body == null || window.frames[popFrame.name].document.body.childNodes[0] == null)
  {
    setTimeout('document.getElementById(\'' + this.element.id + '\').popObj.popup_2()', 100);
	  return;
  }

  this.positionFrame();
  this.showFrame();
  this.sizeFrame();

  if (this.element.getAttribute('isMouseover') == 'Y')
  {
    eval('addEvent(document, \'click\', function() { document.getElementById(\'' + this.element.id + '\').popObj.killIt(); } )');
    eval('addEvent(document, \'mousemove\', function() { document.getElementById(\'' + this.element.id + '\').popObj.checkMouse(window.event); } )');
  }
};

clsQSIPopup.prototype.getPopSrc = function()
{
  var output = '';
  output += '<html>';
  output += '<head><link rel="stylesheet" type="text/css" href="../scripts/TimeConsultant.css"></head>';
  
   if (this.element.getAttribute('isNoFrame') == 'Y')
   {
      output += '<body style="padding:0px; margin:0px;"' + (this.element.getAttribute('popLoad') ? ' onload="element = parent.document.getElementById(\'' + this.element.id + '\'); ' + this.element.getAttribute('popLoad') + '"' : '') + '>';
      output += document.getElementById(this.element.getAttribute('popSrc')).innerHTML;
      output += '</body>';
   }
   else
   {
      output += '<body style="background-color:#B5B9CB; margin:0px; border-style:outset; border-width:2px; border-color:#C4CAE5;"' + (this.element.getAttribute('popLoad') ? ' onload="element = parent.document.getElementById(\'' + this.element.id + '\'); ' + this.element.getAttribute('popLoad') + '"' : '') + '>';
      output += '<table border="0" cellpadding="2" cellspacing="0">';
      output += '  <tr>';
      output += '    <td style="padding-left:4px; padding-right:4px;">' + document.getElementById(this.element.getAttribute('popSrc')).innerHTML + '</td>';
      output += '  </tr>';
      output += '</table>';
      output += '</body>';
    }
  output += '</html>';

  popFrame.setAttribute('isLoading', false);

  return output;
};

clsQSIPopup.prototype.sizeFrame = function()
{
  for(var e=this.element; e && e.tagName!='BODY'; e=e.parentNode)
  {
	  if (e.style.visibility == 'hidden' || e.style.display == 'none')
      return;
  }
  if (this.element.getAttribute('isNoFrame') == 'Y')
  {
    popFrame.width = window.frames[popFrame.name].document.body.childNodes[0].clientWidth;
    popFrame.height = window.frames[popFrame.name].document.body.childNodes[0].clientHeight;
  }
  else
  {
    popFrame.width = window.frames[popFrame.name].document.body.childNodes[0].clientWidth + 6;
    popFrame.height = window.frames[popFrame.name].document.body.childNodes[0].clientHeight + 6;
  }
};

clsQSIPopup.prototype.positionFrame = function()
{
  var left=0; var top=0;

  for(var e=this.element; e && e.tagName!='BODY'; e=e.offsetParent)
  {
	  left += e.offsetLeft;
    top += e.offsetTop;

    // offsetLeft does not include 2px border on fieldsets.... bug??
	if (e.tagName == 'FIELDSET')
	  left += 2;
  }

  top = top + 1;
  left = left + 2;

  var frameHeight = parseInt(popFrame.height);
  var frameWidth = parseInt(popFrame.width);
  var scrollTop =  document.body.scrollTop;
  var scrollLeft = document.body.scrollLeft;

  if(top-frameHeight >= scrollTop && (top+frameHeight) > document.body.clientHeight + scrollTop)
    popFrame.style.top = top + this.element.offsetHeight - frameHeight + 1;
  else
    popFrame.style.top = top + (this.element.getAttribute('top') ? parseInt(this.element.getAttribute('top')) : 0);

  if(left-frameWidth >= scrollLeft && (left+frameWidth) > document.body.clientWidth + scrollLeft)
    popFrame.style.left = left - this.element.offsetWidth - frameWidth + 19;
  else
    popFrame.style.left = left - 1 + (this.element.getAttribute('left') ? parseInt(this.element.getAttribute('left')) : 0);
};

clsQSIPopup.prototype.hideFrame = function()
{
  popFrame.style.display = 'none';
};

clsQSIPopup.prototype.showFrame = function()
{
  popFrame.style.display = '';
};

clsQSIPopup.prototype.killIt = function()
{
  if (window.openPop == null)
    return;
    
  if (this.element.getAttribute('isMouseover') == 'Y')
  {
    removeEvent(document, 'click', this.killIt);
    removeEvent(document, 'mousemove', this.checkMouse);
  }
  
  this.element.parentNode.removeChild(document.getElementById(popFrame.id));
  window.openPop = null;
};

clsQSIPopup.prototype.checkMouse = function(thisEvent)
{
  if ((event.x + document.body.scrollLeft - (parseInt(popFrame.style.left.replace('px','')) + parseInt(popFrame.width)) > 10 
    || event.x + document.body.scrollLeft - (parseInt(popFrame.style.left.replace('px',''))) < -10
    || event.y + document.body.scrollTop - (parseInt(popFrame.style.top.replace('px','')) + parseInt(popFrame.height)) > 10
    || event.y + document.body.scrollTop - (parseInt(popFrame.style.top.replace('px',''))) < -15) &&
      (event.x + document.body.scrollLeft - (parseInt(popFrame.style.left.replace('px','')) + this.element.offsetWidth - (this.element.getAttribute('left') ? parseInt(this.element.getAttribute('left')) : 0)) > 10 
    || event.x + document.body.scrollLeft - (parseInt(popFrame.style.left.replace('px','')) - (this.element.getAttribute('left') ? parseInt(this.element.getAttribute('left')) : 0)) < -10
    || event.y + document.body.scrollTop - (parseInt(popFrame.style.top.replace('px','')) + popFrame.offsetHeight - (this.element.getAttribute('top') ? parseInt(this.element.getAttribute('top')) : 0)) > 10
    || event.y + document.body.scrollTop - (parseInt(popFrame.style.top.replace('px','')) - (this.element.getAttribute('top') ? parseInt(this.element.getAttribute('top')) : 0)) < -15))
  {
    this.killIt();
  }
};
    function grayOut(vis, options) 
    {
        // Pass true to gray out screen, false to ungray
        // options are optional.  This is a JSON object with the following (optional) properties
        // opacity:0-100         
        // Lower number = less grayout higher = more of a blackout   
        // zindex: #             
        // HTML elements with a higher zindex appear on top of the gray out  
        // bgcolor: (#xxxxxx)    
        // Standard RGB Hex color code  
        // grayOut(true, {'zindex':'50', 'bgcolor':'#0000FF', 'opacity':'70'});  
        // Because options is JSON opacity/zindex/bgcolor are all optional and can appear  
        // in any order.  Pass only the properties you need to set.  
        
        var options = options || {};   
        var zindex = options.zindex || 50;  
        var opacity = options.opacity || 70;  
        var opaque = (opacity / 100);  
        var bgcolor = options.bgcolor || '#000000';  
        var dark=document.getElementById('darkenScreenObject');  
        
        if (!dark) 
        {    
            // The dark layer doesn't exist, it's never been created.  So we'll    
            // create it here and apply some basic styles.    
            // If you are getting errors in IE see: http://support.microsoft.com/default.aspx/kb/927917    
            
            var tbody = document.getElementsByTagName("body")[0];    
            var tnode = document.createElement('div');           // Create the layer.        
            
            tnode.style.position='absolute';                 // Position absolutely        
            tnode.style.top='0px';                           // In the top        
            tnode.style.left='0px';                          // Left corner of the page        
            tnode.style.overflow='hidden';                   // Try to avoid making scroll bars                    
            tnode.style.display='none';                      // Start out Hidden        
            tnode.id='darkenScreenObject';                   // Name it so we can find it later    
            tbody.appendChild(tnode);                        // Add it to the web page    
            
            dark=document.getElementById('darkenScreenObject');  // Get the object.  
        }  
        
        if (vis) 
        {    
            // Calculate the page width and height     
            if( document.body && ( document.body.scrollWidth || document.body.scrollHeight ) ) 
            {        
                var pageWidth = document.body.scrollWidth+'px';        
                var pageHeight = document.body.scrollHeight+'px';    
            } 
            else if( document.body.offsetWidth ) 
            {      
                var pageWidth = document.body.offsetWidth+'px';      
                var pageHeight = document.body.offsetHeight+'px';    
            } 
            else 
            {       
                var pageWidth='100%';       
                var pageHeight='100%';    
            }       
            
            //set the shader to cover the entire page and make it visible.    
            dark.style.opacity=opaque;                          
            dark.style.MozOpacity=opaque;                       
            dark.style.filter='alpha(opacity='+opacity+')';     
            dark.style.zIndex=zindex;            
            dark.style.backgroundColor=bgcolor;      
            dark.style.width= pageWidth;    
            dark.style.height= pageHeight;    
            dark.style.display='block';                            
        } 
        else 
        {     
            dark.style.display='none';
        }
    }