/*<RMJSDep>SharedServices\ClientScripts\Comum</RMJSDep>*/
//Event - Parametro que recebe o parametro Event do Netscape
function GetEventElement(Event)
{
	if (isIE())
		return GetEventObject(Event).srcElement;
	else
		return GetEventObject(Event).target;
}

function GetEventObject(Event)
{
	if (isIE() && window.event != null)
		Event = window.event;
		   
	return Event;
}

//Identifica se o Navegador é Internet Explorer
function isIE()
{
	if (document.all)
		return true;
	else
		return false;
}

//Identifica se o Navegador é Netscape ou Mozilla
function isNS()
{
	if ((navigator != null) &&
		(navigator.userAgent != null) &&
		(navigator.userAgent.toLowerCase().indexOf("gecko") != -1))//donotlocalize
		return true;
	else
		return false;
}

function GetEventKeyCode(Event)
{
	Event = GetEventObject(Event);
	if (isIE())
		return Event.keyCode;
	else
		return Event.which;
}

function CancelEvent(e)
{
    e = GetEventObject(e);
	if (isIE())
		e.returnValue = false;
	else
		e.preventDefault();
}

function RMSEvalEventCode(Event, eventCode)
{
    if (eventCode.toUpperCase().indexOf('FUNCTION') >= 0)
        eventCode = eventCode.substring(eventCode.indexOf('{') + 1,eventCode.lastIndexOf('}') -1);

    if (eventCode.substr(eventCode.length-1)!=';')
	    eventCode += ';';

    var NewFunction = new Function('event', eventCode);
    NewFunction(Event);
}

function GetEventHandlerFunction(Event,StrNewFunction,NewFunctionFirst)
{
	var strEvent = '';
    var strCurrentFunction = '';

	if (StrNewFunction.substr(StrNewFunction.length-1)!=';')
		StrNewFunction += ';';
	
	if (Event!=null)
	{
		strCurrentFunction = Event.toString();
		strCurrentFunction = strCurrentFunction.substring(strCurrentFunction.indexOf('{') + 1,strCurrentFunction.lastIndexOf('}') -1);
		
		if (strCurrentFunction.substr(strCurrentFunction.length-1)!=';')
			strCurrentFunction += ';';
	}

	if (NewFunctionFirst)
	{
    	strEvent += StrNewFunction;
    	strEvent += strCurrentFunction;
    }else
    {
    	strEvent += strCurrentFunction;
    	strEvent += StrNewFunction;
    }
	
	var NewFunction = new Function('event',strEvent);
	return NewFunction;
}

/*
Executa o evento passado
*/
function ExecuteEvent(Event)
{
	if (Event!=null)
	{
		Event = Event.toString();
		var EventStatement = Event.substring(Event.indexOf("{") + 1, Event.lastIndexOf("}"));
		eval(EventStatement);
	}
}

if (isNS())
{
    //Correção para o click do FireFox
    HTMLElement.prototype.click = function() 
    {
        var evt = this.ownerDocument.createEvent('MouseEvents');//donotlocalize
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);//donotlocalize
        this.dispatchEvent(evt);
    }
}

function getNSOuterHTML(obj)
{
 var tmpDiv = document.createElement('DIV');
 tmpDiv.appendChild(obj.cloneNode(true));
 return tmpDiv.innerHTML;
}

function SetInputTextValue(controlId, newValue)
{
    var _rmwtextbox = new RMWTextBox(controlId);

    if (_rmwtextbox != null)
    {
        if (_rmwtextbox.getHasEmptyTextController())
        {
            _rmwtextbox.setValue(newValue);
        }
        else
        {
            _rmwtextbox.domObj.value = newValue;
        }
    }
    else
    {
        var _inputElement = document.getElementById(controlId);
        
        if (_inputElement != null)
        {
            _inputElement.value = newValue;
        }
    }
}

function GetInputTextValue(controlId)
{
    var _rmwtextbox = new RMWTextBox(controlId);

    if (_rmwtextbox != null)
    {
        if (_rmwtextbox.getShowingEmptyText())
        {
            return '';
        }
        else
        {
            return _rmwtextbox.domObj.value;
        }
    }
    else
    {
        var _inputElement = document.getElementById(controlId);
        
        if (_inputElement != null)
        {
            return _inputElement.value;
        }
    }
}

function StopBubbling(e){
  if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}