function snapTime(isKeyPress)
{
  var timeString = '';

  var thisHours = '';
  var thisMinutes = '';
  var thisAMPM = '';

  if (isKeyPress)
  {
    // Handle the keypress manually
    window.event.cancelBubble = true;
    window.event.returnValue = false;

    if ((':0123456789APap').indexOf(String.fromCharCode(window.event.keyCode)) == -1)
	  return;
  
    document.selection.createRange().text = String.fromCharCode(window.event.keyCode);
  }

  timeString = event.srcElement.value;
  timeString = timeString.replace(/[^:0123456789AP]/gi, '');
  timeString = timeString.replace('a', 'A');
  timeString = timeString.replace('p', 'P');

  while (timeString.length > 0)
  {
	if (thisHours == '')
	{
	  switch (timeString.substr(0, 1))
	  {
	    case ':':
		  timeString = '';
		  break;
		case 'A':
		  timeString = '';
		  break;
		case 'P':
		  timeString = '';
		  break;
		case '0':
		  timeString = '';
		  break;
		case '1':
		  switch (timeString.substr(1, 1))
		  {
		    case ':':
              switch (timeString.substr(2, 1))
              {
			    case '2':
				  thisHours = '12';
				  timeString = timeString.substr(3);
				  break;
				default:
                  thisHours = '1';
			      timeString = timeString.substr(2);
				  break;
              }
			  break;
			case 'A':
              thisHours = '1';
			  thisMinutes = '00';
			  thisAMPM = 'AM';
			  timeString = '';
			  break;
			case 'P':
              thisHours = '1';
			  thisMinutes = '00';
			  thisAMPM = 'PM';
			  timeString = '';
			  break;
			case '0':
              switch (timeString.substr(2, 1))
              {
			    case ':':
				  thisHours = '10';
				  timeString = timeString.substr(3);
				  break;
			    case 'A':
				  thisHours = '10';
				  thisMinutes = '00';
				  thisAMPM = 'AM';
				  timeString = '';
				  break;
			    case 'P':
				  thisHours = '10';
				  thisMinutes = '00';
				  thisAMPM = 'PM';
				  timeString = '';
				  break;
				case '0':
				  thisHours = '1';
				  thisMinutes = '00';
				  timeString = timeString.substr(3);
				  break;
				default:
				  thisHours = '10';
				  timeString = timeString.substr(2);
				  break;
              }
			  break;
			case '1':
              switch (timeString.substr(2, 1))
              {
			    case ':':
				  thisHours = '11';
				  timeString = timeString.substr(3);
				  break;
			    case 'A':
				  thisHours = '11';
				  thisMinutes = '00';
				  thisAMPM = 'AM';
				  timeString = '';
				  break;
			    case 'P':
				  thisHours = '11';
				  thisMinutes = '00';
				  thisAMPM = 'PM';
				  timeString = '';
				  break;
				case '5':
				  thisHours = '1';
				  thisMinutes = '15';
				  timeString = timeString.substr(3);
				  break;
				default:
				  thisHours = '11';
				  timeString = timeString.substr(2);
				  break;
              }
			  break;
			case '2':
			  thisHours = '12';
              timeString = timeString.substr(2);
			  break;
			default:
			  thisHours = '1';
			  timeString = timeString.substr(1);
			  break;
		  }
		  break;
		default:
		  thisHours = timeString.substr(0, 1);
		  timeString = timeString.substr(1);
		  break;
	  }
	}
	else
	{
	  if (thisMinutes == '')
	  {
	    switch (timeString.substr(0, 1))
	    {
		  case ':':
		    timeString = timeString.substr(1);
			break;
		  case 'A':
		    thisMinutes = '00';
			thisAMPM = 'AM';
			timeString = '';
		    break;
		  case 'P':
		    thisMinutes = '00';
			thisAMPM = 'PM';
			timeString = '';
		    break;
		  case '0':
		    thisMinutes = '00';
            if (timeString.substr(0, 2) == '00')
			  timeString = timeString.substr(2);
			else
			  timeString = timeString.substr(1);
			break;
		  case '1':
		    thisMinutes = '15';
            if (timeString.substr(0, 2) == '15')
			  timeString = timeString.substr(2);
			else
			  timeString = timeString.substr(1);
			break;
		  case '3':
		    thisMinutes = '30';
            if (timeString.substr(0, 2) == '30')
			  timeString = timeString.substr(2);
			else
			  timeString = timeString.substr(1);
			break;
		  case '4':
		    thisMinutes = '45';
            if (timeString.substr(0, 2) == '45')
			  timeString = timeString.substr(2);
			else
			  timeString = timeString.substr(1);
			break;
		  default:
		    timeString = '';
			break;
	    }
	  }
	  else
	  {
	    if (thisAMPM == '')
		{
		  switch(timeString.substr(0, 1))
		  {
		    case ':':
			  timeString = timeString.substr(1);
			  break;
		    case 'A':
			  thisAMPM = 'AM';
			  timeString = '';
			  break;
		    case 'P':
			  thisAMPM = 'PM';
			  timeString = '';
			  break;
			default:
			  timeString = '';
			  break;
		  }
		}
	  }
	}
  }

  var thisTime = '';
  var thisGuess = '';

  if (thisHours != '')
  {
    thisTime = thisHours + ':';
    if (thisMinutes == '')
	  thisGuess = '00';
    else
    {
	  thisTime = thisTime + thisMinutes + ' ';
      if (thisAMPM == '')
	  {
	    if (parseInt(thisHours) > 6 && parseInt(thisHours) < 12)
	      thisGuess = 'AM';
		else
		  thisGuess = 'PM';
	  }
      else
	    thisTime = thisTime + thisAMPM;
    }
  }

  event.srcElement.value = thisTime + thisGuess;

  if (thisGuess == '' || !isKeyPress)			// Done
  {
	if (event.srcElement.onchange)
      event.srcElement.onchange();
  }

  if (thisGuess == '' && isKeyPress && event.srcElement != eval(event.srcElement.endObject))
  {
    eval(event.srcElement.endObject + '.focus()');
	eval(event.srcElement.endObject + '.select()');
  }

  else if (isKeyPress)
  {
    var guessRange = event.srcElement.createTextRange();

	if (thisMinutes == '' && String.fromCharCode(window.event.keyCode) != ':' && (thisHours == '11' || thisHours == '1'))
	  guessRange.moveStart('character', thisTime.length - 1);		// Also select the colon
	else
      guessRange.moveStart('character', thisTime.length);

    guessRange.select();
  }
}


function timePopup(frmName, txtStartName, txtEndName, objIndex)
{
  if (document.all.timeDiv)
  {
    // If clicking twice, make sure old calendar has disappeared
	if (objIndex == null)
	  setTimeout('timePopup(\'' + frmName + '\', \'' + txtStartName + '\', \'' + txtEndName + '\');', 10);
	else
	  setTimeout('timePopup(\'' + frmName + '\', \'' + txtStartName + '\', \'' + txtEndName + '\', \'' + objIndex + '\');', 10);
	  
    return;
  }

  timeFormName = frmName;
  timeStartName = txtStartName;
  timeEndName = txtEndName;

  if (objIndex == null || !document.forms[timeFormName].all[timeStartName].length)
  {
    thisTextStart = document.forms[timeFormName].elements[timeStartName];
	thisTextEnd = document.forms[timeFormName].elements[timeEndName];
  }
  else
  {
    thisTextStart = document.forms[timeFormName].all[timeStartName][parseInt(objIndex)];
	thisTextEnd = document.forms[timeFormName].all[timeEndName][parseInt(objIndex)];
  }

  thisDiv = document.createElement('<div id="timeDiv" class="timePopup" style="position:absolute; width:237px; height:30px; z-index:0;">');
  thisDiv.innerHTML = timePopupSrc();

  var left=0; var top=0;
  for(var e=thisTextStart; e && e.tagName!='BODY'; e=e.offsetParent)
  {
    left += e.offsetLeft;
    top += e.offsetTop;
  }
  var textWidth = thisTextStart.offsetWidth;
  var frameWidth = thisDiv.style.pixelWidth;
  var scrollTop = document.body.scrollTop;
  var scrollLeft = document.body.scrollLeft;

  thisDiv.style.top = top - 1;
	
  if(left+textWidth-frameWidth >= scrollLeft && (left+textWidth+12+frameWidth) > document.body.clientWidth + scrollLeft)
    thisDiv.style.left = left + textWidth - frameWidth;
  else
    thisDiv.style.left = left + textWidth + 10;
    

  document.body.appendChild(thisDiv);

  // If in a modal dialog, the IFrame disappears w/o the setTimeout
  setTimeout('document.onclick = copyTime;', 0);
}

function timePopupSrc()
{
    initialStartTime = thisTextStart.value;
    initialEndTime = thisTextEnd.value;

	if (initialStartTime == '' && initialEndTime == '')
	{
	  if (timeStartName.indexOf('LunchLess') >= 0 || timeStartName.indexOf('LunchBillable') >= 0 || timeStartName.indexOf('LunchNonBillable') >= 0)
	  {
	    initialStartTime = '12:00 PM';
	    initialEndTime = '1:00 PM';
	  }
	  else
	  {
	    initialStartTime = '8:00 AM';
	    initialEndTime = '5:00 PM';
	  }
	}

	var output = '';

	output += '<table border="0" cellpadding="2" cellspacing="0">';
	output += '<tr><td style="padding-left:4px;">';

	output += '<select name="cboStart" class="timePopup" onchange="if (document.all.cboEnd.selectedIndex <= document.all.cboStart.selectedIndex) { document.all.cboEnd.selectedIndex = Math.min(this.selectedIndex + 4, this.options.length - 1); document.all.cboEnd.focus(); }">';
    output += writeTimeOptions(initialStartTime);
	output += '<\/select>';

    output += '&nbsp;&nbsp;<strong style="color:white;">to<\/strong>&nbsp;&nbsp;';

	output += '<select name="cboEnd" class="timePopup" onchange="if (document.all.cboStart.selectedIndex >= document.all.cboEnd.selectedIndex) { document.all.cboStart.selectedIndex = Math.max(this.selectedIndex - 4, 0); document.all.cboStart.focus(); }">';
    output += writeTimeOptions(initialEndTime);
	output += '<\/select>';
	output += '<\/td>';
	output += '<td>';
	output += '<img src="../images/check_shadow.gif" border="0" style="cursor:hand; margin-left:10px; margin-top:4px;" onclick="parent.copyTime();">';
	output += '<img src="../images/x_shadow.gif" border="0" style="cursor:hand; margin-left:4px; margin-top:4px;" onclick="parent.hideTimePopup();"><\/td>';
	output += '<\/tr><\/table>';
	return output;
}

function copyTime()
{
  if (event.srcElement && (event.srcElement.name == 'cboStart' || event.srcElement.name == 'cboEnd'))
    return;

  var cboPopupStart = document.getElementById('timeDiv').document.all.cboStart;
  var cboPopupEnd = document.getElementById('timeDiv').document.all.cboEnd;

  thisTextStart.value = cboPopupStart.options[cboPopupStart.selectedIndex].innerText;
  thisTextEnd.value = cboPopupEnd.options[cboPopupEnd.selectedIndex].innerText;

  if (thisTextStart.onchange)
    thisTextStart.onchange();

  if (thisTextEnd.onchange)
    thisTextEnd.onchange();

  hideTimePopup();
}

function hideTimePopup()
{
  document.body.removeChild(thisDiv);
  document.onclick = null;
}

function writeTimeOptions(initialTime)
{
  var thisSelected;
  var thisTime;
  var timeOptions = '';
    
  for (i=0; i<2; i++)
  {
    for (j=0; j<12; j++)
    {
      for (k=0; k<4; k++)
      {
        thisTime = (j==0 ? 12 : j) + ':' + (k==0 ? '00' : k*15) + ' ' + (i==0 ? 'AM' : 'PM');
		thisSelected = (thisTime == initialTime ? ' selected' : '');
        timeOptions += '<option value="' + thisTime + '"' + thisSelected + '>' + thisTime;
      }
    }
  }
  return timeOptions;
}

function copyDate() {
    var newDate = '' + padout(month - 0 + 1)  + '/' + padout(day)+ '/' + year;
    thisTextStart.value = '0';
	thisTextEnd.value = '0';

	if(textBox.onchange)
	  textBox.onchange();
}