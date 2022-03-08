/*<RMJSDep>SharedServices\ClientScripts\BrowserUtils</RMJSDep>*/
function DoDisableEnterSubmit(Event)
{
	if (isNS())
	{ 
		window.captureEvents(Event.KEYDOWN); 
		window.onkeydown = GetEventHandlerFunction(window.onkeydown,"return KeyDownEvent(event)"); 
	}
	else 
	{
		document.onkeydown = GetEventHandlerFunction(document.onkeydown,"return KeyDownEvent(event)"); 
	}
} 

function KeyDownEvent(Event) 
{ 
	if (GetEventKeyCode(Event) == 13)
	{
	    if (IsEnterSubmitDisabled(GetEventElement(Event)))
		    return false;
		else
		    doOnTextBoxBlur(Event);
    }
    
    return true;
} 

function IsElementEnterDisabled(Element)
{
	var EnterDisabled = Element.getAttribute("EnterDisabled");

	if ((EnterDisabled != null) &&
		(EnterDisabled.toUpperCase() == "FALSE"))
		return false;
	else
		return true;
}

function IsEnterSubmitDisabled(EventElement)
{
	var ElementType = EventElement.type;
	var ElementEnterDisabled = IsElementEnterDisabled(EventElement);

	if ((ElementType != null) &&
		((ElementType.toUpperCase() == 'TEXTAREA') ||
		 (ElementType.toUpperCase() == 'IMAGE') ||
		 (ElementType.toUpperCase() == 'SUBMIT')) ||
  		(!ElementEnterDisabled))
		return false;
	else
		return true;
}
