/*<RMJSDep>SharedServices\ClientScripts\Boolean; SharedServices\ClientScripts\BrowserUtils; SharedServices\ClientScripts\Comum; SharedServices\ClientScripts\Cookie; SharedServices\ClientScripts\Mozilla; SharedServices\ClientScripts\PrototypeUtils</RMJSDep>*/

var CollapsiblePanelCookieId = 'CPCId_';

function ExpandCollapsiblePanel(CollapsiblePanel)
{
	var ContainerPanel = GetContainerPanel(CollapsiblePanel);
	
	if (ContainerPanel.style.display=='none')//donotlocalize
	{
		if (IsExpandedCookieEnabled(CollapsiblePanel))
			SetExpandedCookie(CollapsiblePanel.id,true);
		
		ContainerPanel.style.display='';
		
		UpdateCollapsiblePanelImage(CollapsiblePanel);
  	
  	DoCPAfterChangeVisibility(CollapsiblePanel);
	}
	
	RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize();
}

function CollapseCollapsiblePanel(CollapsiblePanel)
{
	var ContainerPanel = GetContainerPanel(CollapsiblePanel);
	
	if (ContainerPanel.style.display=='')
	{
		if (IsExpandedCookieEnabled(CollapsiblePanel))
			SetExpandedCookie(CollapsiblePanel.id,false);
		
		ContainerPanel.style.display='none';
		
		UpdateCollapsiblePanelImage(CollapsiblePanel);
		
  	DoCPAfterChangeVisibility(CollapsiblePanel);
	}
	
	RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize();
}

function SetCollapsiblePanelVisibility(Event)
{
	var EventElement = GetEventElement(Event);
	var CollapsiblePanel = GetParentCollapsiblePanel(EventElement);
	var ContainerPanel = GetContainerPanel(CollapsiblePanel)

	if (ContainerPanel!=null)
	{
		if (ContainerPanel.style.display=='')
			CollapseCollapsiblePanel(CollapsiblePanel);
		else
			ExpandCollapsiblePanel(CollapsiblePanel);
	}
	FixHeight();
}

function DoCPAfterChangeVisibility(CollapsiblePanel)
{
	AfterChangeVisibility = CollapsiblePanel.getAttribute("AfterChangeVisibility", false);
  if (AfterChangeVisibility!=null)
		eval(AfterChangeVisibility + "(CollapsiblePanel);");//donotlocalize
}

function LoadAllCollapsiblePanels()
{
	var Tables = document.getElementsByTagName('TABLE');
	
	for(var i=0;i<Tables.length;i++)
	{
		if (IsCollapsiblePanelTable(Tables[i]))
			CollapsiblePanelOnLoad(Tables[i].parentNode);
	}
}

function CollapsiblePanelOnLoad(CollapsiblePanel)
{
	var Expanded = CollapsiblePanel.getAttribute("Expanded").toUpperCase();
	var ContainerPanel = GetContainerPanel(CollapsiblePanel)

	if (ContainerPanel!=null)
	{
		if (Expanded=="TRUE")
			ContainerPanel.style.display='';
		else
			ContainerPanel.style.display='none';
		
		if (IsExpandedCookieEnabled(CollapsiblePanel))
		{
			var ExpandedCookie = GetExpandedCookie(CollapsiblePanel.id);

			if (ExpandedCookie!=null)
			{
				if (StringToBoolean(ExpandedCookie))
					ContainerPanel.style.display='';
				else
					ContainerPanel.style.display='none';
			}
		}

		UpdateCollapsiblePanelImage(CollapsiblePanel);
	}
}

function GetParentCollapsiblePanel(Element)
{
	var CollapsiblePanel = null;
	
	if (Element!=null)
	{
		if (IsCollapsiblePanelTable(Element))
			CollapsiblePanel = Element.parentNode;
		else
			CollapsiblePanel = GetParentCollapsiblePanel(Element.parentNode);
	}
	
	return CollapsiblePanel;
}

function IsCollapsiblePanelTable(Table)
{
	if ((Table.tagName!=null) &&
		(Table.tagName.toUpperCase()=="TABLE") &&
		(Table.parentNode.className=="CollapsiblePanel"))//donotlocalize
		return true;
	else
		return false;
}
function GetContainerPanel(CollapsiblePanel)
{
	var ContainerPanel = null;
	var ContainerPanelId = CollapsiblePanel.getAttribute("ContainerPanelId");

	if ((ContainerPanelId!=null) &&
		(ContainerPanelId!=""))
	{
		ContainerPanelId = CollapsiblePanel.id.replace(CollapsiblePanel.getAttribute("SingleId"),"") + ContainerPanelId;
		ContainerPanel = document.getElementById(ContainerPanelId);
	}
		
	return ContainerPanel;
}

function UpdateCollapsiblePanelImage(CollapsiblePanel)
{
	var CollapsiblePanelImage = document.getElementById(CollapsiblePanel.id + '_Img');
	var ContainerPanel = GetContainerPanel(CollapsiblePanel);
	var ExpandImagePath = CollapsiblePanel.getAttribute("ExpandImagePath").toUpperCase();
	var HideImagePath = CollapsiblePanel.getAttribute("HideImagePath").toUpperCase();
	var CollapsiblePanelTable = CollapsiblePanel.childNodes[0];
	
	if (ContainerPanel.style.display=='')
		CollapsiblePanelImage.src = CollapsiblePanelImage.src.toUpperCase().replace(ExpandImagePath,HideImagePath);
	else
 		CollapsiblePanelImage.src = CollapsiblePanelImage.src.toUpperCase().replace(HideImagePath,ExpandImagePath);
 		
 	if ((CollapsiblePanelTable.className = "Vertical") &&
 	    (CollapsiblePanel.style.width != null) &&
 	    (CollapsiblePanel.style.width != "") &&
 	    (CollapsiblePanel.style.width.toUpperCase().indexOf("PX") != -1) &&
        (CollapsiblePanelImage.width > parseInt(CollapsiblePanel.style.width)))
    {
        CollapsiblePanelImage.width = parseInt(CollapsiblePanel.style.width);
        CollapsiblePanelImage.height = parseInt(CollapsiblePanel.style.width);
    }

 	if ((CollapsiblePanelTable.className = "Horizontal") &&
 	    (CollapsiblePanel.style.height != null) &&
 	    (CollapsiblePanel.style.height != "") &&
 	    (CollapsiblePanel.style.height.toUpperCase().indexOf("PX") != -1) &&
        (CollapsiblePanelImage.height > parseInt(CollapsiblePanel.style.height)))
    {
        CollapsiblePanelImage.height = parseInt(CollapsiblePanel.style.height);
        CollapsiblePanelImage.width = parseInt(CollapsiblePanel.style.height);
    }
}

function SetExpandedCookie(CollapsiblePanelId,Value)
{
	SetCookie(CollapsiblePanelCookieId + CollapsiblePanelId,Value,10);
}

function GetExpandedCookie(CollapsiblePanelId)
{
	return GetCookieValue(CollapsiblePanelCookieId + CollapsiblePanelId);
}

function IsExpandedCookieEnabled(CollapsiblePanel)
{
	var SaveExpandedInCookie = CollapsiblePanel.getAttribute("SaveExpandedInCookie");
	return StringToBoolean(SaveExpandedInCookie);
}


RMWCollapsiblePanel = function RMWCollapsiblePanel(collapsiblePanelId)
{
  this.context = new RMWJSContext();
  this.context.setWindow(window);
  this.setDomObjById(collapsiblePanelId);
}

RMWCollapsiblePanel.prototype.setDomObjById = function setDomObjById(id)
{
    this.setByDomObj(this.context.window.document.getElementById(id));
}

RMWCollapsiblePanel.prototype.setByDomObj = function setByDomObj(pDomObj)
{
    this.domObj = pDomObj;
    if (this.domObj)
    {
      this.ExpandImage = this.getExpandImage();
    }
}

RMWCollapsiblePanel.prototype.getExpandImage = function getExpandImage()
{
  return this.context.window.document.getElementById(this.domObj.id + '_Img');
}
