/*<RMJSDep>SharedServices\ClientScripts\Boolean; SharedServices\ClientScripts\BrowserUtils; SharedServices\ClientScripts\TabSheetPanel; SharedServices\ClientScripts\ControlUtils; SharedServices\ClientScripts\Cookie;</RMJSDep>*/
/********************************************************************
Função Para focar o controle de menor tabIndex do TabSheetPanel Ativo
********************************************************************/

var CacheColapseKey = 'TBSCL_';
var _Colapsed;
function DoTabSheetPanelElementFocus(strTabSheet)
{
	var TabSheetTable = GetTabSheetTableInChild(strTabSheet);
	var SelectedTab = GetSelectedTab(TabSheetTable);
	if (SelectedTab != null)
	{
		var TabSheetPanel = GetTabSheetPanel(SelectedTab, TabSheetTable);
		
		var ControlToFocus = GetLowerTabIndexUserInputControl(TabSheetPanel);

		if (ControlToFocus != null)
		{
			//Try, pois se não for possível forcar o elementro, não dá erro
			try
			{
				ControlToFocus.focus();
			}
			catch(E)
			{
			}
		}
	}
}

function LoadAllTabSheets()
{
	var Tables = document.getElementsByTagName('TABLE');
	
	for(var i=0;i<Tables.length;i++)
		if (IsTabSheetTable(Tables[i]))
			TabSheetOnLoad(Tables[i]);
}

function TabSheetOnLoad(TabSheetTable)
{
	if (isNS())
		TabSheetTable.style.borderCollapse="separate";//donotlocalize

	SetAllPanelPosition(TabSheetTable);

	var SelectedTab = GetSelectedTab(TabSheetTable);
	if (SelectedTab!=null)
	{
		SetSelectedTab(TabSheetTable.parentNode, SelectedTab);
		if(CacheColapseTabSheet(TabSheetTable.parentNode))
		{
		    if(Colapsed(TabSheetTable.parentNode))
		        ColapseTabSheet(TabSheetTable.parentNode.id);
		    else
		        ExpandTabSheet(TabSheetTable.parentNode.id);		        
		}
	}		
}

function GetTabSheetTableInChild(TabSheetId)
{
	var TabSheetSpan = document.getElementById(TabSheetId)
	var Result = null;
	
	if(TabSheetSpan == null)
	    return null;
	
	Result = GetTabSheetTableInSpan(TabSheetSpan);
	
	return Result;
}

function GetTabSheetTableInSpan(TabSheetSpan)
{
	var Result = null;
	
	for(i=0;i<TabSheetSpan.childNodes.length;i++)
	{
		if (TabSheetSpan.childNodes[i].tagName == "TABLE")
			Result = TabSheetSpan.childNodes[i];
	}
	
	return Result;
}

function GetTabSheetTableInParent(control)
{
	if (control!=null)
	{
		if (IsTabSheetTable(control))
			return(control);
		else
			return(GetTabSheetTableInParent(control.parentNode));
	} else {
		return null;
	}
}

function IsTabSheetTable(Element)
{
	if ((Element.className == "TabSheetHor") || //donotlocalize
		(Element.className == "TabSheetVer"))//donotlocalize
		return true;
	else
		return false;
}

function GetSelectedTab(TabSheetTable)
{
	var result = null;
	
	if (TabSheetTable.className == "TabSheetHor")//donotlocalize
	{
		for (i=0; i < TabSheetTable.rows[0].cells.length; i++) 
		{
			if (TabSheetTable.rows[0].cells[i].className=="Selected")//donotlocalize
				return TabSheetTable.rows[0].cells[i];
		}
    }
    else
    {
		for (i=0; i < TabSheetTable.rows.length; i++) 
		{
			if (TabSheetTable.rows[i].cells[0].className=="Selected")//donotlocalize
				return TabSheetTable.rows[i].cells[0];
		}
    }
    
    return result;
}

function GetTabSheetTD(control)
{
	if (control!=null)
	{
		if (control.tagName=="TD")
			return control;
		else
			return GetTabSheetTD(control.parentNode);
	}
	else
	{
		return null;
	}
}

function IsTabSheetTD(TabSheetTD)
{
	if ((TabSheetTD!=null) && 
		 ((TabSheetTD.className.toUpperCase()=="SELECTED") ||
		  (TabSheetTD.className.toUpperCase()=="UNSELECTED") ||
		  (TabSheetTD.className.toUpperCase()=="OVER")))
		return true;
	else
		return false;
}

function GetTabSheetTDPanelID(TabSheetTD)
{
	if (IsTabSheetTD(TabSheetTD)) 
		return TabSheetTD.childNodes[0].getAttribute("PanelID");
	else
		return "";
}

function OnTabSheetClick(e)
{
	var eSrc = GetEventElement(e);
	var TabSheet   = GetTabSheetTableInParent(eSrc);
	var NewSelectedTab = GetTabSheetTD(eSrc);	
	SetColapsedTabSheetCookie(TabSheet.id, false);
	SetSelectedTab(TabSheet.parentNode, NewSelectedTab);

	if (NewSelectedTab.childNodes[0] != null && NewSelectedTab.childNodes[0] != undefined && typeof NewSelectedTab.childNodes[0].onclick === "function")
	    NewSelectedTab.childNodes[0].onclick();
}

function GetTabSelectedIndex(TabSheetTab)
{
	return TabSheetTab.cellIndex / 2;
}

function SaveSelectedTabIndex(TabSheetSpan, SelectedTab)
{
	var SelectedIndexHidden = document.getElementById(TabSheetSpan.id + "_SelectedIndex");
	SelectedIndexHidden.value = GetTabSelectedIndex(SelectedTab);
}

function SetUnSelectedTab(TabSheetTD)
{
	if (TabSheetTD!=null)
	{
		SetTabClassName(TabSheetTD, "UnSelected", true);//donotlocalize
		var TabSheetEndTD = GetTabSheetEndTD(TabSheetTD);
		SetTabClassName(TabSheetEndTD, "EndUnSelected", true);//donotlocalize

		SetPanelInVisible(TabSheetTD, GetTabSheetTableInParent(TabSheetTD));
	}
}

function SetSelectedTab(TabSheetSpan, TabSheetTD)
{
	var TabSheetTable = GetTabSheetTableInSpan(TabSheetSpan);
	var LastSelectedTab = GetSelectedTab(TabSheetTable);
	SetUnSelectedTab(LastSelectedTab);
	
	if (TabSheetTD!=null)
	{
		SetTabClassName(TabSheetTD, "Selected", true);//donotlocalize
		var TabSheetEndTD = GetTabSheetEndTD(TabSheetTD);
		SetTabClassName(TabSheetEndTD, "EndSelected", true);//donotlocalize
        if(!Colapsed(TabSheetSpan))
		    SetPanelVisible(TabSheetTD, TabSheetTable);
	}

	SaveSelectedTabIndex(TabSheetSpan, TabSheetTD);
	if(TabSheetIsColapsed(TabSheetSpan.id))
	{
	    SetColapseImage(TabSheetSpan.id, false);
	    SetTabSheetColapsed(TabSheetSpan.id, false);
	}
  RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize();
}

function SetTabClassName(TabSheetTD, ClassName, SaveLastClassName)
{
	if (TabSheetTD!=null)
	{
		TabSheetTD.className = ClassName;
		
		var ImageNameSubString;
		
		if (ClassName!= null)
		{
		    if ((ClassName=="Selected") ||(ClassName.toUpperCase()=="ENDSELECTED"))//donotlocalize
			    ImageNameSubString = "Selected";//donotlocalize
		    else if ((ClassName=="UnSelected") ||(ClassName.toUpperCase()=="ENDUNSELECTED"))//donotlocalize
			    ImageNameSubString = "UnSelected";//donotlocalize
		    else
			    ImageNameSubString = "Over";//donotlocalize
	    }
		
		var ImagePath = TabSheetTD.style.backgroundImage;
		if ((ImagePath!=null) &&
			(ImagePath!=""))
		{
			ImagePath = ImagePath.substr(0,ImagePath.lastIndexOf('_')+1) + ImageNameSubString + ImagePath.substr(ImagePath.lastIndexOf('.'));
			TabSheetTD.style.backgroundImage = ImagePath;
		}
		
		if (SaveLastClassName)
			TabSheetTD.setAttribute("LastClassName",TabSheetTD.className);
	}
}

function SelectTabByPanelId(PanelId)
{
	var Tables = document.getElementsByTagName('TABLE');
	var TabItem;
	var TabSheetTable;
	
	for(var i=0;i<Tables.length;i++)
	{
		if (IsTabSheetTable(Tables[i]))
		{
			TabSheetTable = Tables[i];
			TabItem = GetTabItemByPanelId(TabSheetTable, PanelId);
			if (TabItem!=null)
				break
		}
	}
	
	if (TabItem!=null)
		SetSelectedTab(TabSheetTable.parentNode, TabItem);
}

function GetTabItemByPanelId(TabSheetTable, PanelId)
{
	if (TabSheetTable.className == "TabSheetHor")//donotlocalize
	{
		for (var i=0; i < TabSheetTable.rows[0].cells.length; i++) 
		{
			if (GetTabSheetTDPanelID(TabSheetTable.rows[0].cells[i])==PanelId)
				return TabSheetTable.rows[0].cells[i];
		}
	}
	else
	{
		for (var i=0; i < TabSheetTable.rows.length; i++) 
		{
			if (GetTabSheetTDPanelID(TabSheetTable.rows[i].cells[0])==PanelId)
				return TabSheetTable.rows[i].cells[0];
		}
	}
}

/* Altera a cor da fonte */
function OnTabSheetMouseOver(e)
{
	var eSrc = GetEventElement(e);
	var TabSheet   = GetTabSheetTableInParent(eSrc);
	var EventTabSheetTD = GetTabSheetTD(eSrc);
	
	if (EventTabSheetTD.className != "Selected")//donotlocalize
	{
		EventTabSheetTD.setAttribute("LastClassName",EventTabSheetTD.className);
		SetTabClassName(EventTabSheetTD, "Over", false);//donotlocalize

		var EventTabSheetEndTD = GetTabSheetEndTD(EventTabSheetTD);
		EventTabSheetEndTD.setAttribute("LastClassName",EventTabSheetEndTD.className);
		SetTabClassName(EventTabSheetEndTD, "EndOver", false);//donotlocalize
	}
}

/* Volta a cor normal */
function OnTabSheetMouseOut(e) 
{
	var eSrc = GetEventElement(e);
	var TabSheet   = GetTabSheetTableInParent(eSrc);
	var EventTabSheetTD = GetTabSheetTD(eSrc);
	
	SetTabClassName(EventTabSheetTD, EventTabSheetTD.getAttribute("LastClassName"), false);
	var EventTabSheetEndTD = GetTabSheetEndTD(EventTabSheetTD);
	SetTabClassName(EventTabSheetEndTD, EventTabSheetEndTD.getAttribute("LastClassName"), false);
}

/*
Retorna o TabSheet que completa o TabSheet enviado(Para efeito visual da imagem de fundo)
*/
function GetTabSheetEndTD(TabSheetTD)
{
	var TabSheetTable = GetTabSheetTableInParent(TabSheetTD);
	if (TabSheetTable.className == "TabSheetHor")//donotlocalize
		return TabSheetTD.parentNode.cells[TabSheetTD.cellIndex+1];
	else
		return TabSheetTable.rows[TabSheetTD.parentNode.rowIndex+1].cells[0];
}

function ExpandOrColapseTabSheet(TabSheetID)
{
    if(TabSheetID == null || TabSheetID == '')
        return;   
    
    var SelectedPanel = GetColapsableContainer(TabSheetID);
    
    if(SelectedPanel)
    {
        if(SelectedPanel.style.display == 'none')//donotlocalize
        {
            ExpandTabSheet(TabSheetID, SelectedPanel);
        }
        else
        {
            ColapseTabSheet(TabSheetID, SelectedPanel);
        }
    }
    FixHeight();
}

function GetColapsableContainer(TabSheetID)
{
        var TabSheetTable = GetTabSheetTableInChild(TabSheetID)
        if(TabSheetTable == null)
            return;
        var SelectedTd = GetSelectedTab(TabSheetTable);        
        if(!SelectedTd)
            return;
        var SelectedPanel = GetTabSheetPanel(SelectedTd, TabSheetTable);
        return SelectedPanel;
}

function ExpandTabSheet(TabSheetID, SelectedPanel)
{
    var SelectedPanelDiv = SelectedPanel;
    if(SelectedPanelDiv == null)
        SelectedPanelDiv = GetColapsableContainer(TabSheetID);
    
    if(SelectedPanelDiv != null)  
    {  
        SelectedPanelDiv.style.display = '';    
        SetTabSheetColapsed(TabSheetID, false);    
        SetColapseImage(TabSheetID, false)
    }
         
    RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize();
}

function ColapseTabSheet(TabSheetID, SelectedPanel)
{    
    var SelectedPanelDiv = SelectedPanel;
    if(SelectedPanelDiv == null)
        SelectedPanelDiv = GetColapsableContainer(TabSheetID);
        
    if(SelectedPanelDiv)
    {
        SelectedPanelDiv.style.display = 'none'; 
        SetTabSheetColapsed(TabSheetID, true);
        SetColapseImage(TabSheetID, true)     
    }  

    RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize();
}

function SetColapseImage(TabSheetID, Colapsed)
{
    var Image = getColapseImage(TabSheetID);
    
    if(!Image)
        return;
        
    if(Colapsed)
    {
        Image.src = "SharedServices/Images/addressHint_Colapsed.gif";
    }
    else
    {
        Image.src = "SharedServices/Images/addressHint_Expanded.gif";
    }
}

function getColapseImage(TabSheetID)
{
    var TabSheet = document.getElementById(TabSheetID);
    var ColapseImageId = TabSheet.getAttribute('ColapseImageId');
    if(ColapseImageId == null)
        return null;
        
    var ColapseImage = document.getElementById(ColapseImageId);    
    return ColapseImage;
}

function SetTabSheetColapsed(TabSheetID, value)
{
    var TabSheet = document.getElementById(TabSheetID);
    if(TabSheet)
        TabSheet.setAttribute('Colapsed', value);    
        
    if(CacheColapseTabSheet(TabSheet))
        SetColapsedTabSheetCookie(TabSheetID, value);   
}

function CacheColapseTabSheet(TabSheet)
{
    var CacheColapse = TabSheet.getAttribute('SaveColapseTabSheetInCookie');
    if(CacheColapse)    
        return StringToBoolean(CacheColapse);        
}

function TabSheetIsColapsed(TabSheetID)
{
    var TabSheet = document.getElementById(TabSheetID);
    if(TabSheet)
        return colapsed = TabSheet.getAttribute('Colapsed');   
}

function SetColapsedTabSheetCookie(CollapsibleTabSheetId,Value)
{
    _Colapsed = Value;
	SetCookie(CacheColapseKey + CollapsibleTabSheetId,Value,10);
}

function GetColapsedTabSheetCookie(CollapsibleTabSheetId)
{
    if(_Colapsed == null)
        _Colapsed = GetCookieValue(CacheColapseKey + CollapsibleTabSheetId);
    return _Colapsed	;
}

function Colapsed(TabSheet)
{
    var ExpandedCookie = GetColapsedTabSheetCookie(TabSheet.id);
    if(ExpandedCookie)
        return StringToBoolean(ExpandedCookie);
        
    return false;
}
