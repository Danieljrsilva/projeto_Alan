/*<RMJSDep>SharedServices\ClientScripts\BrowserUtils; SharedServices\ClientScripts\PrototypeUtils;</RMJSDep>*/
RMWTextBox = function RMWTextBox(id)
{
    this.id = id;
    if ((id == null) || (id == ''))
        return null;
    this.domObj = document.getElementById(id);
    if (this.domObj == null)
        return null;
    this.context = new RMWJSContext(window);
    this.maxLength = this.getMaskLength();
    this.emptyText = this.getEmptyText();
    this.emptyTextControllerId = this.domObj.getAttribute("EmptyTextControllerID");
}

RMWTextBox.prototype.getMaskLength = function getMaskLength()
{
    return this.domObj.getAttribute("MaxLength");
}

RMWTextBox.prototype.getEmptyText = function getEmptyText()
{
    return this.domObj.getAttribute("EmptyText");
}

RMWTextBox.prototype.getHasEmptyTextController = function getHasEmptyTextController()
{
    if ((this.emptyTextControllerId != null) && (this.emptyTextControllerId != ''))
    {
        var emptyTextController = document.getElementById(this.emptyTextControllerId)
        return (emptyTextController != null);
    }
    
    return false;
}

RMWTextBox.prototype.clearEmptyTextStyle = function clearEmptyTextStyle(checkCurrentStyle)
{
    if ((!checkCurrentStyle) || (this.domObj.className == 'RMWEmptyInputMode'))//donotlocalize
        this.domObj.className = '';
}

RMWTextBox.prototype.restoreEmptyTextStyle = function restoreEmptyTextStyle(checkCurrentStyle)
{
    if ((!checkCurrentStyle) || (this.domObj.className != 'RMWEmptyInputMode'))//donotlocalize
        this.domObj.className = 'RMWEmptyInputMode';
}

RMWTextBox.prototype.getShowingEmptyText = function getShowingEmptyText()
{
    var emptyTextController = document.getElementById(this.emptyTextControllerId)
    
    if (emptyTextController != null)
        return (emptyTextController.value == 'TRUE');
        
    return false;
}

RMWTextBox.prototype.setShowingEmptyText = function setShowingEmptyText(value)
{
    var emptyTextController = document.getElementById(this.emptyTextControllerId);
    var _hasEmptyTextController = (emptyTextController != null);
    
    if (_hasEmptyTextController)
        emptyTextController.value = value;

    if ((_hasEmptyTextController) && (value.toString().toUpperCase() == 'TRUE'))
        this.domObj.className = 'RMWEmptyInputMode';
    else
        this.clearEmptyTextStyle(false);
}

RMWTextBox.prototype.setValue = function setValue(value)
{
    this.domObj.value = value;
    if (((this.emptyText != null) && (this.emptyText != '')) &&
        ((this.domObj.value == null) || (this.domObj.value == '')))
    {
        this.domObj.value = this.emptyText;
        this.setShowingEmptyText('TRUE');
    }
    else
    {
        this.setShowingEmptyText('FALSE');
    }
}

RMWTextBox.prototype.ensureMaskLength = function ensureMaskLength()
{
	if ((this.maxLength != null) &&
	    (this.domObj.value.length > this.maxLength))
	{
		this.domObj.value = this.domObj.value.substring(0, this.maxLength);	
	}
}

RMWTextBox.prototype.setBlurDone = function setBlurDone(value)
{
    if (this.domObj != null)
        this.domObj.setAttribute("blurDone", value);
}

RMWTextBox.prototype.getBlurDone = function getBlurDone()
{
    if (this.domObj != null)
    {
        var _blurDone = this.domObj.getAttribute("blurDone");
        if (_blurDone != null)
            return (_blurDone.toString().toUpperCase() == 'TRUE');
    }
        
    return true;
}

RMWTextBox.prototype.doOnFocus = function doOnFocus()
{
    if (this.getShowingEmptyText())
    {
        this.domObj.value = '';
        this.domObj.className = '';
    }
    this.domObj.select();
    this.setBlurDone(false);
}

RMWTextBox.prototype.doOnBlur = function doOnBlur()
{
    if (!this.getBlurDone())
    {
        this.setBlurDone(true);
        if (((this.emptyText != null) && (this.emptyText != '')) &&
            ((this.domObj.value == null) || (this.domObj.value == '')))
        {
            this.domObj.value = this.emptyText;
            this.setShowingEmptyText('TRUE');
        }
        else
        {
            this.setShowingEmptyText('FALSE');
        }
    }
}

RMWTextBox.prototype.get_Validator = function get_Validator()
{
  var validatorID = this.domObj.getAttribute('VALIDATORID');
  if (typeof(validatorID) == 'string' && validatorID != '')//donotlocalize
  {
    return document.getElementById(validatorID);
  }
  return null;
}

RMWTextBox.prototype.set_Validator = function set_Validator(value)
{
  this.domObj.setAttribute('VALIDATORID', value.id);
}

function CreateTextBoxFromEvent(Event)
{
    var TextBoxDomObj = GetEventElement(Event);

    if (TextBoxDomObj != null)
    {
        return new RMWTextBox(TextBoxDomObj.id);
    }
    
    return null;
}

function EnsureMaskLength(Event)
{
    var TextBox = CreateTextBoxFromEvent(Event);
    
    if (TextBox == null)
        return;
        
    TextBox.ensureMaskLength();
}

function doOnTextBoxFocus(Event)
{
    var TextBox = CreateTextBoxFromEvent(Event);
    
    if (TextBox == null)
        return;

    var _user_onfocus = TextBox.domObj.getAttribute("user_onfocus");
    if (_user_onfocus != null)
        RMSEvalEventCode(Event, _user_onfocus);

        
    TextBox.doOnFocus();
}

function doOnTextBoxBlur(Event)
{
    var TextBox = CreateTextBoxFromEvent(Event);

    if (TextBox == null)
        return;

    var _user_onblur = TextBox.domObj.getAttribute("user_onblur");
    if (_user_onblur != null)
        RMSEvalEventCode(Event, _user_onblur);
 
    TextBox.doOnBlur();
}

var TextBoxHourOnFocusDelegate;

function ValidateHourTextBox(source, args)
{
  var elementId = source.getAttribute('ControlToValidate');
  var element;
  if(elementId != "")
    element = document.getElementById(elementId);
  if(!IsValidHour(args.Value))
  {
    args.IsValid = false;
    if(element)
    {
      element.style.color = "Red";
      element.style.fontWeight = "Bold";    
      if(TextBoxHourOnFocusDelegate == null)
        TextBoxHourOnFocusDelegate = Function.createDelegate(this, TextBoxHourOnFocus);
      $addHandler(element, 'focus', TextBoxHourOnFocusDelegate); //donotlocalize
    }
  }
  else
  {
    args.IsValid = true;
    if(element)
    {
      element.style.color = "Black";
      element.style.fontWeight = "Normal";
    }
  }
}

function TextBoxHourOnFocus(e)
{
  var element = GetEventElement(e);
  if(element)
  {
    element.style.color = "Black";
    element.style.fontWeight = "Normal";    
    $removeHandler(element, 'focus', TextBoxHourOnFocusDelegate); //donotlocalize
  }
}

function IsValidHour(passedVal)
{
    if(passedVal == "")
	    return true;	  
	  if(passedVal.length < 3)
	    return false;
	    
    var ValidChars = "0123456789.,:";
    var IsNumber=true;
    var Char;   
   
    for (i = 0; i < passedVal.length && IsNumber == true; i++)
    {
	    Char = passedVal.charAt(i);
	    if (ValidChars.indexOf(Char) == -1)
	    {
	      return false;
	    }
	  }
	  return true;
}
