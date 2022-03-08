/*<RMJSDep>SharedServices\ClientScripts\BrowserUtils; SharedServices\ClientScripts\WindowUtils; SharedServices\ClientScripts\CollapsiblePanel</RMJSDep>*/

function DoMainGridViewForPrint(Event, PanelPrintViewUrl, PanelId, ClientGetPanelId)
{
    var _panelId;
    if(ClientGetPanelId != null && ClientGetPanelId != '')        
        _panelId = eval(ClientGetPanelId);
    else
        _panelId = PanelId;
    
    PanelPrintViewUrl += '&PanelId=' + _panelId;//donotlocalize
        
    OpenWindow(PanelPrintViewUrl, '_blank', 'channelmode=no,directories=no,fullscreen=no,location=no,menubar=yes,resizable=yes,scrollbars=yes,status=yes,titlebar=no,toolbar=no,height=500,left=-2,top=-2,width=700');//donotlocalize
}

/****************************************************
Funções da janela de impressão
****************************************************/
function PrintViewOnLoad(Event)
{
    copyCss();    
    copyGrid();
    blockContent();
}

function copyTitle()
{
  var TitleDiv = document.getElementById(TitleDivId);
  
  //Ocultando a imagem do collapsible se existir
  if (TitleDiv && TitleDiv.childNodes.length >= 1)
  {
    var cpTitle = new RMWCollapsiblePanel(null);
    cpTitle.setByDomObj(TitleDiv.childNodes[0]);

    if (cpTitle != null)
    {
      if (cpTitle.ExpandImage != null)
        cpTitle.ExpandImage.style.display = 'none';
    }
  }
}

function copyCss()
{
  if (isIE())
  {
    var links = opener.document.getElementsByTagName('LINK');
    var firstChild = document.body.firstChild;
    for (var i = 0; i < links.length; i++)
    {
      var newLink = document.createElement('LINK');
      newLink.href = links[i].href;
      newLink.type = links[i].type;
      newLink.rel = links[i].rel;
      document.body.insertBefore(newLink, firstChild);
    }
    window.stop;
  }
  else
  {
    for (var i = 0; i < opener.document.styleSheets.length; i++)
    {
      for (var j = 0; j < opener.document.styleSheets[i].cssRules.length; j++)
        document.styleSheets[0].insertRule(opener.document.styleSheets[i].cssRules[j].cssText,0)
    }
  }
}

function copyGrid()
{
  var ContentPanel = window.opener.document.getElementById(GetQueryString('PanelId'));
  if (ContentPanel==null)
      return;
      
  var MainDiv = document.getElementById(MainDivId);
  
  MainDiv.innerHTML = ContentPanel.innerHTML;

  window.onbeforeprint=DoBeforePrint;
  window.onafterprint=DoAfterPrint;
}

function blockContent()
{
  var MainDiv = document.getElementById(MainDivId);
  if (MainDiv==null)
      return;

  var blockDiv = document.createElement('DIV');
  blockDiv.id = 'BlockDiv';//donotlocalize
  blockDiv.style.position = 'absolute';//donotlocalize
  blockDiv.style.width = '100%';
  blockDiv.style.height = MainDiv.offsetHeight;
  blockDiv.style.top = 0;
  var newTop = MainDiv.offsetTop;
  while (MainDiv = MainDiv.offsetParent)
    newTop += MainDiv.offsetTop;
  blockDiv.style.top = newTop;
    
  if (isIE())
  {
    blockDiv.style.backgroundColor = '#000000';
    blockDiv.style.filter = 'Alpha(Opacity=0, Style=0)'; //donotlocalize
  }

  document.body.appendChild(blockDiv);
}

function DoBeforePrint(Event)
{
    var PrintHeader = document.getElementById('PrintHeader');
    PrintHeader.style.display='none';

    var blockDiv = document.getElementById('BlockDiv');
    blockDiv.style.display='none';
    
    var tdContainer = document.getElementById('tdContainer');
    tdContainer.style.border='none';//donotlocalize
}

function DoAfterPrint(Event)
{
    var PrintHeader = document.getElementById('PrintHeader');
    PrintHeader.style.display='';

    var blockDiv = document.getElementById('BlockDiv');
    blockDiv.style.display='inline';
    
    var tdContainer = document.getElementById('tdContainer');
    tdContainer.style.borderLeft='solid 1px #CED7EC';
    tdContainer.style.borderBottom='solid 1px #CED7EC';
    tdContainer.style.borderRight='solid 1px #CED7EC';
}

function DoPrint(Event)
{
    window.print();
}

function DoClose(Event)
{
    window.close();
}