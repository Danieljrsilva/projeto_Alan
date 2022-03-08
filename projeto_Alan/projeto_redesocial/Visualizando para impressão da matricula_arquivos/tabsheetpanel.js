function SetPanelVisible(TabSheetTD, TabSheetTable)
{
	var panel = GetTabSheetPanel(TabSheetTD, TabSheetTable);
	if (panel != null)
		panel.style.display = "";
}

function SetPanelInVisible(TabSheetTD, TabSheetTable)
{
	var panel = GetTabSheetPanel(TabSheetTD, TabSheetTable);
	if (panel != null)
		panel.style.display = "none";
}

function SetAllPanelPosition(TabSheetTable)
{
	if (TabSheetTable.className == "TabSheetHor")//donotlocalize
	{
		for (i=0; i < TabSheetTable.rows[0].cells.length; i++) 
		{
			if (TabSheetTable.rows[0].cells[i].className!="Empty")//donotlocalize
				SetPanelPosition(TabSheetTable.rows[0].cells[i], TabSheetTable);
		}
    }
    else
    {
		for (i=0; i < TabSheetTable.rows.length; i++) 
		{
			if (TabSheetTable.rows[i].cells[0].className!="Empty")//donotlocalize
				SetPanelPosition(TabSheetTable.rows[i].cells[0], TabSheetTable);
		}
    }
}

function SetPanelPosition(TabSheetTD, TabSheetTable)
{
	var panel = GetTabSheetPanel(TabSheetTD, TabSheetTable);
	
	if (panel != null)
	{
		var TabSheetParent = TabSheetTable.parentNode;
		
		if (TabSheetTable.className == "TabSheetHor")//donotlocalize
		{
			if ((TabSheetParent.style.position!=null) &&
				(TabSheetParent.style.position.toUpperCase()=="ABSOLUTE"))
			{
				panel.style.top = (parseInt(TabSheetParent.offsetHeight)+parseInt(TabSheetParent.offsetTop))+"px";
				panel.style.left = TabSheetParent.style.left;
				panel.style.position = TabSheetParent.style.position;
			}
			panel.style.width = TabSheetParent.style.width;
		}
		else
		{
			if ((TabSheetParent.style.position!=null) &&
				(TabSheetParent.style.position==absolute))
			{
				panel.style.top = TabSheetParent.style.top;
				panel.style.left = (parseInt(TabSheetParent.offsetLeft)+parseInt(TabSheetParent.offsetWidth))+"px";
				panel.style.position = TabSheetParent.style.position;
			}
			panel.style.height = TabSheetParent.style.height;
		}
		panel.style.display = "none";
	}
}

function IsTabSheetPanel(Element)
{
	if ((Element.className.toUpperCase() == 'TABSHEETPANELHOR') ||
		(Element.className.toUpperCase() == 'TABSHEETPANELVER'))
		return true;
	else
		return false;
}

function GetTabSheetPanel(TabSheetTD, TabSheetTable)
{
	var panel = null;
	
	if ((TabSheetTD.childNodes[0]!=null) &&
		(TabSheetTD.childNodes[0].tagName == "SPAN"))
	{
		var LinkedPanelId = TabSheetTD.childNodes[0].getAttribute("PanelId");
		if ((LinkedPanelId != null) &&
		    (LinkedPanelId != ""))
		{
		    var FullPanelId = TabSheetTable.parentNode.id.replace(TabSheetTable.parentNode.getAttribute("SingleId"),"");
		    FullPanelId += LinkedPanelId;
		    panel = document.getElementById(FullPanelId);
		}
	}
		
	return panel;
}