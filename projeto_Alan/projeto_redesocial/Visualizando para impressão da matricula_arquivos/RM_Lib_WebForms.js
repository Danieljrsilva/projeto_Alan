// JScript File
Type.registerNamespace("RM.Lib.WebForms");//donotlocalize

//Extended RegExp
RegExp.HandleSpecialCharacters = function(input){
    var myRegExp = new RegExp('[\\[\\]\\{\\}\\^\\$\\*\\(\\)\\|\\\\\\?\\*\\+\\.\'\"]', 'g');//donotlocalize
    var index = -1;
    var sbResult = new Sys.StringBuilder();
    while ((index = input.search(myRegExp)) >= 0){
      sbResult.append(input.substr(0, index));
      sbResult.append('\\');
      sbResult.append(input.charAt(index));
      input = input.substr(index+1, (input.length - (index + 1)))
    }
    var result = '';
    if (sbResult.isEmpty())
      result = input;
    else
      result = sbResult.toString();
    return result;
}

//Onsubmit Workaround
$addOnsubmitHanlder = function(handler){
  var pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
  if (pageRequestManager){
    var oldOnSubmit = pageRequestManager._onsubmit;
    pageRequestManager._onsubmit = function(event){
      handler();
      if (typeof(oldOnSubmit) == 'function')//donotlocalize
        return oldOnSubmit();
      return true;
    };
  }
}

//DivOverflowMode
RM.Lib.WebForms.DivOverflowMode = function(){};
RM.Lib.WebForms.DivOverflowMode.prototype = {
  Width : 0,
  Height : 1,
  Both : 2
}
RM.Lib.WebForms.DivOverflowMode.registerEnum("RM.Lib.WebForms.DivOverflowMode");//donotlocalize

//DivOverflowUtils
RM.Lib.WebForms.DivOverflowUtils = function(){};
RM.Lib.WebForms.DivOverflowUtils.__typeName = 'DivOverFlowUtils';//donotlocalize
RM.Lib.WebForms.DivOverflowUtils.__class = true;

RM.Lib.WebForms.DivOverflowUtils._enableResizeWorkAround = false;
RM.Lib.WebForms.DivOverflowUtils._accordionMenuDivs = [];
RM.Lib.WebForms.DivOverflowUtils._hintDivs = [];
RM.Lib.WebForms.DivOverflowUtils._mainContainerDiv = null;
RM.Lib.WebForms.DivOverflowUtils._managedDivs = [];

$RegisterAccordionMenuDiv = RM.Lib.WebForms.DivOverflowUtils.RegisterAccordionMenuDiv = function(divOverflowMode, divObj){
  Array.add(RM.Lib.WebForms.DivOverflowUtils._accordionMenuDivs, 
    {overflowMode : divOverflowMode, element : divObj});
}

$RegisterHintDivs = RM.Lib.WebForms.DivOverflowUtils.RegisterHintDivs = function(divOverflowMode, divObj){
  Array.add(RM.Lib.WebForms.DivOverflowUtils._hintDivs, 
    {overflowMode : divOverflowMode, element : divObj});
}

$RegisterOverflowDiv = RM.Lib.WebForms.DivOverflowUtils.RegisterDiv = function(divOverflowMode, divObj){
  Array.add(RM.Lib.WebForms.DivOverflowUtils._managedDivs, 
    {overflowMode : divOverflowMode, element : divObj});
}

RM.Lib.WebForms.DivOverflowUtils._loadingWindow;

RM.Lib.WebForms.DivOverflowUtils._resize = function(overFlowMode, childElement, parentElement){
  var parentBounds = Sys.UI.DomElement.getBounds(parentElement);
  switch(overFlowMode){
    case RM.Lib.WebForms.DivOverflowMode.Width:
      childElement.style.width = parentBounds.width;
    break;
    
    case RM.Lib.WebForms.DivOverflowMode.Height:
      childElement.style.height = parentBounds.height;
    break;
    
    case RM.Lib.WebForms.DivOverflowMode.Both:
      childElement.style.width = parentBounds.width;
      childElement.style.height = parentBounds.height;
    break;
  }
}

RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize = function(){
  if (Sys.Browser.name == 'Microsoft Internet Explorer' || !RM.Lib.WebForms.DivOverflowUtils._enableResizeWorkAround)//donotlocalize
    return;
  
  if (!RM.Lib.WebForms.DivOverflowUtils._loadingWindow)
    RM.Lib.WebForms.DivOverflowUtils._loadingWindow = $ShowModalLoading(document.body, SLibAdjustingLayoutCaption);
  else
    RM.Lib.WebForms.DivOverflowUtils._loadingWindow.show();
  
  var managedDivs = [];
  Array.addRange(managedDivs, RM.Lib.WebForms.DivOverflowUtils._accordionMenuDivs);
  Array.addRange(managedDivs, RM.Lib.WebForms.DivOverflowUtils._hintDivs);
  if (RM.Lib.WebForms.DivOverflowUtils._mainContainerDiv)
    Array.add(managedDivs, RM.Lib.WebForms.DivOverflowUtils._mainContainerDiv);
  Array.addRange(managedDivs, RM.Lib.WebForms.DivOverflowUtils._managedDivs);

  for (var i = 0; i < managedDivs.length; i++){
    managedDivs[i].parent = managedDivs[i].element.parentNode;
    managedDivs[i].parentControls = [];
  }

  for (var i = 0; i < managedDivs.length; i++){
    if (managedDivs[i].parent){
      while (managedDivs[i].parent.firstChild){
        Array.add(managedDivs[i].parentControls, managedDivs[i].parent.firstChild);
        managedDivs[i].parent.removeChild(managedDivs[i].parent.firstChild);
      }
      managedDivs[i].parent.innerHTML = '&nbsp;'
    }
  }
  
  for (var i = 0; i < managedDivs.length; i++){
    if (managedDivs[i].parent){
      RM.Lib.WebForms.DivOverflowUtils._resize(managedDivs[i].overflowMode, managedDivs[i].element, managedDivs[i].parent);
      
      if (managedDivs[i].parent.innerHTML == '&nbsp;')
        managedDivs[i].parent.innerHTML = '';
      
      for (var j = 0; j < managedDivs[i].parentControls.length; j++){
        managedDivs[i].parent.appendChild(managedDivs[i].parentControls[j]);
      }
      
      RM.Lib.WebForms.DivOverflowUtils._resize(managedDivs[i].overflowMode, managedDivs[i].element, managedDivs[i].parent);
    }
  }
  
  RM.Lib.WebForms.DivOverflowUtils._loadingWindow.hide();
}
RM.Lib.WebForms.DivOverflowUtils.registerClass("RM.Lib.WebForms.DivOverflowUtils");

//HtmlSelectUtils
RM.Lib.WebForms.HtmlSelectUtils = function(){};
RM.Lib.WebForms.HtmlSelectUtils.__typeName = 'HtmlSelectUtils';//donotlocalize
RM.Lib.WebForms.HtmlSelectUtils.__class = true;

$HideHtmlSelectObjects =  RM.Lib.WebForms.HtmlSelectUtils.Hide = function(){
  if (Sys.Browser.name == 'Microsoft Internet Explorer' && parseInt(Sys.Browser.version) <= 6){//donotlocalize
    var htmlSelectList = document.getElementsByTagName('SELECT');
    for (var i = 0; i < htmlSelectList.length; i++){
      var visibilityStack = htmlSelectList[i].getAttribute('visibilityStack');
      if (typeof(visibilityStack) == 'string'){//donotlocalize
        visibilityStack = visibilityStack.split(';');
        Array.add(visibilityStack, htmlSelectList[i].style.visibility);
      }
      else
        visibilityStack = [htmlSelectList[i].style.visibility];
      htmlSelectList[i].setAttribute('visibilityStack', visibilityStack.join(';'));
      
      htmlSelectList[i].style.visibility = 'hidden';
    }
  }
}

$ShowHtmlSelectObjects =  RM.Lib.WebForms.HtmlSelectUtils.Show = function(){
  if (Sys.Browser.name == 'Microsoft Internet Explorer' && parseInt(Sys.Browser.version) <= 6){//donotlocalize
    var htmlSelectList = document.getElementsByTagName('SELECT');
    for (var i = 0; i < htmlSelectList.length; i++){
      var visibilityStack = new String(htmlSelectList[i].getAttribute('visibilityStack'));
      visibilityStack = visibilityStack.split(';');
      if (visibilityStack.length > 0){
        htmlSelectList[i].style.visibility = visibilityStack[visibilityStack.length-1];
        visibilityStack.pop();
      }
      htmlSelectList[i].setAttribute('visibilityStack', visibilityStack.join(';'));
    }
  }
}

//Modal Main Window
RM.Lib.WebForms.ModalMainWindow = function(){
  this._borderObjects = [8];
  this._contentsCell = null;
  this._windowTable = null;
};
RM.Lib.WebForms.ModalMainWindow.__typeName = 'ModalMainWindow';//donotlocalize
RM.Lib.WebForms.ModalMainWindow.__class = true;

//ModalPanelWindowType
RM.Lib.WebForms.ModalPanelWindowType = function(){};
RM.Lib.WebForms.ModalPanelWindowType.prototype = {
  Error : 0,
  Alert : 1,
  Info : 2
}
RM.Lib.WebForms.ModalPanelWindowType.registerEnum("RM.Lib.WebForms.ModalPanelWindowType");//donotlocalize

//Modal Panel
RM.Lib.WebForms.ModalPanel = function(container){
  if (!container)
    container = document.body;

  if (container != document.body && container.tagName != 'FORM')
    container.style.position = 'relative';//donotlocalize

  this._backGroundDiv = RM.Lib.WebForms.ModalPanel.CreateBackGroundDiv();
  this._mainTable = RM.Lib.WebForms.ModalPanel.CreateMainTable();
  this._mainWindowObj = new RM.Lib.WebForms.ModalMainWindow();
  this._mainWindowType = RM.Lib.WebForms.ModalPanelWindowType.Info;
  this._mainWindowContainer = null;
  this._container = container;
  this._visible = false;  
  this._lastKeyPressFunction = null;
  this._bodyPage = null;
  this._lockKeyDelegate = Function.createDelegate(this, this.lockKey);
  
  var mainTableCells = this._mainTable.getElementsByTagName('TD');
  
  if (mainTableCells)
    this._mainWindowContainer = mainTableCells[0];

  RM.Lib.WebForms.ModalPanel.CreateMainWindow(this._mainWindowObj);
  this._mainWindowContainer.appendChild(this._mainWindowObj._windowTable);
  
  this._backGroundDiv.style.display = 'none';
  this._mainTable.style.display = 'none';

  container.appendChild(this._backGroundDiv);
  container.appendChild(this._mainTable);
};

RM.Lib.WebForms.ModalPanel.prototype = {
  configMainWindow : function(windowType){
    RM.Lib.WebForms.ModalPanel.ConfigMainWindow(windowType, this._mainWindowObj);
  },
  
  set_Contents : function(contents){
    this._mainWindowObj._contentsCell.innerHTML = '';
    if (contents){
      this._mainWindowObj._contentsCell.appendChild(contents);
      this._ensureContentsVisibility(contents);
    }
  },
  
  show : function(contents){
    if (contents){
      this._mainWindowObj._contentsCell.innerHTML = '';
      this._mainWindowObj._contentsCell.appendChild(contents);
      this._ensureContentsVisibility(contents);
    }
    
    this._backGroundDiv.style.display = '';
    this._mainTable.style.display = '';
    if (!this._visible)
      $HideHtmlSelectObjects();
    this._visible = true;    
  },
  
  hide : function(){
    this._backGroundDiv.style.display = 'none';
    this._mainTable.style.display = 'none';
    if (this._visible)
      $ShowHtmlSelectObjects();
    
    if(window.document != null)    
      if(window.document.body != null)    
      {
          try
          {
              $removeHandler(window.document.body, 'keypress', this._lockKeyDelegate); //donotlocalize
          }
          catch(e){}
      }
    this._visible = false;
  },

  _ensureContentsVisibility : function(contents){
    if (contents.style.display == 'none')//donotlocalize
        contents.style.display = '';
  },
  
  lockKeyBoard : function(){
    if(window.document != null)    
        if(window.document.body != null)
        {           
            $addHandler(window.document.body, 'keypress', this._lockKeyDelegate); //donotlocalize
        }
  },
    
  lockKey : function(e){
      CancelEvent(e.rawEvent);        
  },
  
  dispose : function(){
    this._container.removeChild(this._backGroundDiv);
    this._container.removeChild(this._mainTable);
    if (this._visible)
      $ShowHtmlSelectObjects();
    
    if(window.document != null)    
      if(window.document.body != null)    
      {
          try
          {
              $removeHandler(window.document.body, 'keypress', this._lockKeyDelegate); //donotlocalize
          }
          catch(e){}
      }
    this._visible = false;    
  }
}

RM.Lib.WebForms.ModalPanel.CreateBackGroundDiv = function(){
  var div = document.createElement('DIV');
  div.className = 'ModalPanelBackGroundPanel';
  return div;
}

RM.Lib.WebForms.ModalPanel.CreateMainTable = function(){
  var table = document.createElement('TABLE');
  table.cellPadding = 0;
  table.cellSpacing = 0;
  table.className = 'ModalPanelMainTable';

  var tbody = document.createElement('TBODY');
  var row = document.createElement('TR');
  var cell = document.createElement('TD');
  cell.align = 'center';

  row.appendChild(cell);
  tbody.appendChild(row);
  table.appendChild(tbody);
  
  return table;
}

RM.Lib.WebForms.ModalPanel.CreateMainWindow = function(mainWindowObj){
  mainWindowObj._windowTable = document.createElement('TABLE');
  mainWindowObj._windowTable.cellPadding = 0;
  mainWindowObj._windowTable.cellSpacing = 0;

  var tbody;
  var row;
  var cell;

  tbody = document.createElement('TBODY');
  // 1ª row
  row = document.createElement('TR');
  
  cell = document.createElement('TD');
  mainWindowObj._borderObjects[0] = document.createElement('IMG');
  cell.appendChild(mainWindowObj._borderObjects[0]);
  row.appendChild(cell);

  mainWindowObj._borderObjects[1] = document.createElement('TD');
  row.appendChild(mainWindowObj._borderObjects[1]);

  cell = document.createElement('TD');
  mainWindowObj._borderObjects[2] = document.createElement('IMG');
  cell.appendChild(mainWindowObj._borderObjects[2]);
  row.appendChild(cell);

  tbody.appendChild(row);
  // 2ª row
  row = document.createElement('TR');
  
  mainWindowObj._borderObjects[3] = document.createElement('TD');
  row.appendChild(mainWindowObj._borderObjects[3]);

  cell = document.createElement('TD');
  row.appendChild(cell);
  mainWindowObj._contentsCell = cell;

  mainWindowObj._borderObjects[4] = document.createElement('TD');
  row.appendChild(mainWindowObj._borderObjects[4]);
  
  tbody.appendChild(row);
  // 3ª row
  row = document.createElement('TR');
  
  cell = document.createElement('TD');
  mainWindowObj._borderObjects[5] = document.createElement('IMG');
  cell.appendChild(mainWindowObj._borderObjects[5]);
  row.appendChild(cell);

  mainWindowObj._borderObjects[6] = document.createElement('TD');
  row.appendChild(mainWindowObj._borderObjects[6]);

  cell = document.createElement('TD');
  mainWindowObj._borderObjects[7] = document.createElement('IMG');
  cell.appendChild(mainWindowObj._borderObjects[7]);
  row.appendChild(cell);

  tbody.appendChild(row);
  
  mainWindowObj._windowTable.appendChild(tbody);
}

RM.Lib.WebForms.ModalPanel.ConfigMainWindow = function(windowType, mainWindowObj) {

    mainWindowObj._borderObjects[0].src = RMWUrlBase + 'SharedServices/Images/InfoBox_left_top_corner.gif';

    mainWindowObj._borderObjects[1].className = 'infoBoxTop';

    mainWindowObj._borderObjects[2].src = RMWUrlBase + 'SharedServices/Images/InfoBox_right_top_corner.gif'; //donotlocalize

    mainWindowObj._borderObjects[3].className = 'infoBoxLeft';

    mainWindowObj._borderObjects[4].className = 'infoBoxRight';

    mainWindowObj._borderObjects[5].src = RMWUrlBase + 'SharedServices/Images/InfoBox_left_bottom_corner.gif'; //donotlocalize
    
    mainWindowObj._borderObjects[6].className = 'infoBoxBottom';

    mainWindowObj._borderObjects[7].src = RMWUrlBase + 'SharedServices/Images/InfoBox_right_bottom_corner.gif';

    mainWindowObj._contentsCell.style.backgroundColor = '#DBE0F1';
}

$ShowModalPanel = RM.Lib.WebForms.ModalPanel.Show = function(contents, windowType, container){
  var modalPanel = new RM.Lib.WebForms.ModalPanel(container);
  modalPanel.configMainWindow(windowType);
  modalPanel.show(contents);
  return modalPanel;
}
RM.Lib.WebForms.ModalPanel.__typeName = 'ModalPanel';//donotlocalize
RM.Lib.WebForms.ModalPanel.__class = true;

//Modal Loading
RM.Lib.WebForms.ModalLoading = {};
RM.Lib.WebForms.ModalLoading.__typeName = 'ModalLoading';//donotlocalize
RM.Lib.WebForms.ModalLoading.__class = true;

$ShowModalLoading = RM.Lib.WebForms.ModalLoading.ShowLoading = function(container, message){
    
  if (!container)
    container = document.body;
  container.setAttribute('isLoading', true);
    
  var table;
  var tbody;
  var row;
  var cell;
  var image;
  
  table = document.createElement('TABLE');
  table.cellPadding = 0;
  table.cellSpacing = 0;

  tbody = document.createElement('TBODY');
  row = document.createElement('TR');
  
  cell = document.createElement('TD');
  cell.className = 'ModalLoadingImageCell';

  image = document.createElement('IMG');
  image.src = RMWUrlBase + 'SharedServices/Images/loading.gif';
  image.className = 'ModalLoadingImage';
  
  cell.appendChild(image);
  row.appendChild(cell);
  
  cell = document.createElement('TD');
  cell.className = 'ModalLoadingTextCell';
  
  cell.appendChild(document.createTextNode(message));
  row.appendChild(cell);

  tbody.appendChild(row);
  table.appendChild(tbody);
    
  var modalPanel = $ShowModalPanel(table, RM.Lib.WebForms.ModalPanelWindowType.Info, container);  
  modalPanel.lockKeyBoard();
  return modalPanel;
}

//ModalMessageBoxType
RM.Lib.WebForms.ModalMessageBoxType = function(){};
RM.Lib.WebForms.ModalMessageBoxType.prototype = {
  Error : 0,
  Alert : 1,
  Info : 2
}
RM.Lib.WebForms.ModalMessageBoxType.registerEnum("RM.Lib.WebForms.ModalMessageBoxType");//donotlocalize


RM.Lib.WebForms.ModalMessageBox = function(){
  this._modalPanel = new RM.Lib.WebForms.ModalPanel(document.body);
  this._messageBoxIcon = null;
  this._messageboxTextNode = null;
  this._messageboxCloseButton = null;
  this._messageboxDetailNode = null;
  this._messageboxDetailDiv = null;
  this._messageboxDetailButton = null;
  this._callBackFunction = null;
};

RM.Lib.WebForms.ModalMessageBox.prototype = {  
  get_CallBackFunction : function(){
    return this._callBackFunction;
  },
  
  set_CallBackFunction : function(value){
    this._callBackFunction = value;
  }
}


RM.Lib.WebForms.ModalMessageBox.__typeName = 'ModalMessageBox';//donotlocalize
RM.Lib.WebForms.ModalMessageBox.__class = true;

RM.Lib.WebForms.ModalMessageBox._createModalMessageBox = function(modalMessageBoxObj){
  var table;
  var tbody;
  var row;
  var cell;
  
  var summaryTable  = document.createElement('TABLE');
  summaryTable.cellPadding = 0;
  summaryTable.cellSpacing = 0;
  summaryTable.className = 'ModalMessageTable';

  tbody = document.createElement('TBODY');
  
  //Summary Row
  row = document.createElement('TR');
  
  //Icon Cell
  cell = document.createElement('TD');
  cell.align = 'center';
  cell.verticalAlign = 'middle';//donotlocalize
  cell.style.padding = '5px';

  var image = document.createElement('IMG');
  image.className = 'ModalMessageIcon';
  modalMessageBoxObj._messageBoxIcon = image;
  
  cell.appendChild(image);  
  row.appendChild(cell);

  
  //Summary Cell
  cell = document.createElement('TD');
  cell.style.width = '100%';
  
  var div = document.createElement('DIV');
  div.className = 'ModalMessageTextDiv';
  
  var centerTable = document.createElement('TABLE');
  centerTable.cellPadding = 0;
  centerTable.cellSpacing = 0;
  centerTable.style.width = '100%';
  centerTable.style.height = '100%';
  
  var centerTBody = document.createElement('TBODY');
  var centerRow = document.createElement('TR');
  var centerCell = document.createElement('TD');
  centerCell.valign = 'middle';//donotlocalize
  
  var textNode = document.createElement('SPAN');
  modalMessageBoxObj._messageboxTextNode = textNode;
  
  centerCell.appendChild(textNode);
  centerRow.appendChild(centerCell);
  centerTBody.appendChild(centerRow);
  centerTable.appendChild(centerTBody);
  
  div.appendChild(centerTable);
  cell.appendChild(div);
  row.appendChild(cell);
  
  tbody.appendChild(row);

  summaryTable.appendChild(tbody);
  
  //DetailButton
  var detailButtonCell = document.createElement('TD');
  detailButtonCell.align = 'left';
  detailButtonCell.style.paddingBottom = '5px';
  
  var detailButton = document.createElement('INPUT');
  detailButton.className = 'ModalMessageBoxCloseButton';
  detailButton.type = 'button';//donotlocalize

  if (JSLibWebCaptionExpandirDetalhes != undefined)
      detailButton.value = JSLibWebCaptionExpandirDetalhes;//donotlocalize
  else
      detailButton.value = "Detalhes >>";//donotlocalize

  detailButtonCell.appendChild(detailButton);

  modalMessageBoxObj._messageboxDetailButton = detailButton;
  
  //CloseButton
  var closeButtonCell = document.createElement('TD');
  closeButtonCell.align = 'right';
  closeButtonCell.style.paddingBottom = '5px';
  
  var closeButton = document.createElement('INPUT');
  closeButton.className = 'ModalMessageBoxCloseButton';
  closeButton.type = 'button';//donotlocalize
  closeButton.value = 'OK';
  closeButton.onclick = function(){
    var callBackFunction = modalMessageBoxObj.get_CallBackFunction(); 
    RM.Lib.WebForms.ModalMessageBox.Close(modalMessageBoxObj);
    if (callBackFunction)
        callBackFunction();
  };
  modalMessageBoxObj._messageboxCloseButton = closeButton;
  
  closeButtonCell.appendChild(closeButton);
  
  //DetailsPanel
  var detailPanelCell = document.createElement('TD');
  detailPanelCell.colSpan = 2;
  detailPanelCell.style.display = 'none';

  div = document.createElement('DIV');
  div.className = 'ModalMessageDetailsDiv';

  textNode = document.createElement('SPAN');
  modalMessageBoxObj._messageboxDetailNode = textNode;

  div.appendChild(textNode);
  
  modalMessageBoxObj._messageboxDetailDiv = div;
  
  detailPanelCell.appendChild(div);
  
  table = document.createElement('TABLE');
  
  tbody = document.createElement('TBODY');
  
  //Summary
  row = document.createElement('TR');
  
  cell = document.createElement('TD');
  cell.colSpan = 2;
  
  cell.appendChild(summaryTable);
  
  row.appendChild(cell);

  tbody.appendChild(row);
  
  //Buttons
  row = document.createElement('TR');

  detailButton.onclick = function(){
    if (detailPanelCell.style.display == 'none')//donotlocalize
    {
      detailPanelCell.style.display = '';
      if (JSLibWebCaptionOcultarDetalhes != undefined)
        this.value = JSLibWebCaptionOcultarDetalhes;//donotlocalize
      else
        this.value = '<< Detalhes'//donotlocalize
    }
    else
    {
      detailPanelCell.style.display = 'none';
      if (JSLibWebCaptionExpandirDetalhes != undefined)
        this.value = JSLibWebCaptionExpandirDetalhes;//donotlocalize
      else 
        this.value = 'Detalhes >>'//donotlocalize
    }
  };
  
  row.appendChild(detailButtonCell);
  row.appendChild(closeButtonCell);

  tbody.appendChild(row);
  
  //Details
  row = document.createElement('TR');
  row.appendChild(detailPanelCell);

  tbody.appendChild(row);
 
  table.appendChild(tbody);
  
  modalMessageBoxObj._modalPanel.set_Contents(table);
}

RM.Lib.WebForms.ModalMessageBox._configMessageBox = function(messageBoxType, modalMessageBoxObj){
  switch (messageBoxType){
    case RM.Lib.WebForms.ModalMessageBoxType.Error:
      modalMessageBoxObj._modalPanel.configMainWindow(RM.Lib.WebForms.ModalPanelWindowType.Error, modalMessageBoxObj._mainWindow);
      modalMessageBoxObj._messageBoxIcon.src = RMWUrlBase + 'SharedServices/Images/error.gif';
      modalMessageBoxObj._messageboxTextNode.style.color = 'Red';
    break;
    
    case RM.Lib.WebForms.ModalMessageBoxType.Alert:
      modalMessageBoxObj._modalPanel.configMainWindow(RM.Lib.WebForms.ModalPanelWindowType.Alert, modalMessageBoxObj._mainWindow);
      modalMessageBoxObj._messageBoxIcon.src = RMWUrlBase + 'SharedServices/Images/alert.gif';
    break;
    
    case RM.Lib.WebForms.ModalMessageBoxType.Info:
      modalMessageBoxObj._modalPanel.configMainWindow(RM.Lib.WebForms.ModalPanelWindowType.Info, modalMessageBoxObj._mainWindow);
      modalMessageBoxObj._messageBoxIcon.src = RMWUrlBase + 'SharedServices/Images/info.gif';
    break;
  }
}

$ShowModalMessageBox = RM.Lib.WebForms.ModalMessageBox.Show = function(messageBoxType, message, details){
  var modalMessageBoxObj = new RM.Lib.WebForms.ModalMessageBox();
  RM.Lib.WebForms.ModalMessageBox._createModalMessageBox(modalMessageBoxObj);
  
  RM.Lib.WebForms.ModalMessageBox._configMessageBox(messageBoxType, modalMessageBoxObj);
  
  if (parent && parent.frames['frameError'] && window.name == 'frameError' && message == "") {
      message = parent.document.getElementById("inputUserError").value;
  }

  modalMessageBoxObj._messageboxTextNode.innerHTML = message;
  
  if (details)
    modalMessageBoxObj._messageboxDetailNode.innerHTML = details;
  else
    modalMessageBoxObj._messageboxDetailButton.style.visibility = 'hidden';
  
  modalMessageBoxObj._modalPanel.show();
  return modalMessageBoxObj;
}

RM.Lib.WebForms.ModalMessageBox.Close = function(modalMessageBoxObj){
  modalMessageBoxObj._modalPanel.dispose();
  delete modalMessageBoxObj;
}

RM.Lib.WebForms.ModalConfirm = function(){
  this._modalPanel = new RM.Lib.WebForms.ModalPanel(document.body);
  this._confirmIcon = null;
  this._confirmTextNode = null;
  this._confirmOkButton = null; 
  this._confirmCancelButton = null;  
  this._callBackFunction = null;
};

RM.Lib.WebForms.ModalConfirm.prototype = {  
  get_CallBackFunction : function(){
    return this._callBackFunction;
  },
  
  set_CallBackFunction : function(value){
    this._callBackFunction = value;
  }
}


RM.Lib.WebForms.ModalConfirm.__typeName = 'ModalMessageBox';//donotlocalize
RM.Lib.WebForms.ModalConfirm.__class = true;

RM.Lib.WebForms.ModalConfirm._createModalConfirm = function(modalConfirmObj){
  var table;
  var tbody;
  var row;
  var cell;
  
  var summaryTable  = document.createElement('TABLE');
  summaryTable.cellPadding = 0;
  summaryTable.cellSpacing = 0;
  summaryTable.className = 'ModalMessageTable';

  tbody = document.createElement('TBODY');
  
  //Summary Row
  row = document.createElement('TR');
  
  //Icon Cell
  cell = document.createElement('TD');
  cell.align = 'center';
  cell.verticalAlign = 'middle';//donotlocalize
  cell.style.padding = '5px';

  var image = document.createElement('IMG');
  image.className = 'ModalMessageIcon';
  modalConfirmObj._confirmIcon = image;
  
  cell.appendChild(image);  
  row.appendChild(cell);

  
  //Summary Cell
  cell = document.createElement('TD');
  cell.style.width = '100%';
  
  var div = document.createElement('DIV');
  div.className = 'ModalConfirmTextDiv';
  
  var centerTable = document.createElement('TABLE');
  centerTable.cellPadding = 0;
  centerTable.cellSpacing = 0;
  centerTable.style.width = '100%';
  centerTable.style.height = '100%';
  
  var centerTBody = document.createElement('TBODY');
  var centerRow = document.createElement('TR');
  var centerCell = document.createElement('TD');
  centerCell.valign = 'middle';//donotlocalize
  
  var textNode = document.createElement('SPAN');
  modalConfirmObj._confirmTextNode = textNode;
  
  centerCell.appendChild(textNode);
  centerRow.appendChild(centerCell);
  centerTBody.appendChild(centerRow);
  centerTable.appendChild(centerTBody);
  
  div.appendChild(centerTable);
  cell.appendChild(div);
  row.appendChild(cell);
  
  tbody.appendChild(row);

  summaryTable.appendChild(tbody);  
  
  //OkButton
  var okButtonCell = document.createElement('TD');
  okButtonCell.align = 'right';
  okButtonCell.style.paddingBottom = '5px';
  
  var okButton = document.createElement('INPUT');
  okButton.className = 'ModalMessageBoxCloseButton';
  okButton.type = 'button';//donotlocalize
  okButton.value = 'OK';

  modalConfirmObj._confirmOkButton = okButton;
  
  okButtonCell.appendChild(okButton); 
  
  //CancelButton
  var cancelButtonCell = document.createElement('TD');
  cancelButtonCell.align = 'left';
  cancelButtonCell.style.paddingBottom = '5px';
  
  var cancelButton = document.createElement('INPUT');
  cancelButton.className = 'ModalMessageBoxCloseButton';
  cancelButton.type = 'button';//donotlocalize
  cancelButton.value = 'Cancelar';//donotlocalize

  cancelButtonCell.appendChild(cancelButton);

  modalConfirmObj._confirmCancelButton = cancelButton;
  
  table = document.createElement('TABLE');
  
  tbody = document.createElement('TBODY');
  
  //Summary
  row = document.createElement('TR');
  
  cell = document.createElement('TD');
  cell.colSpan = 2;
  
  cell.appendChild(summaryTable);
  
  row.appendChild(cell);

  tbody.appendChild(row);
  
  //Buttons
  row = document.createElement('TR');  
  
  row.appendChild(okButtonCell);
  row.appendChild(cancelButtonCell);

  tbody.appendChild(row);    
 
  table.appendChild(tbody);
  
  modalConfirmObj._modalPanel.set_Contents(table);
}

RM.Lib.WebForms.ModalConfirm._configConfirm = function(modalConfirmObj){        
      modalConfirmObj._modalPanel.configMainWindow(modalConfirmObj._mainWindow);
      modalConfirmObj._confirmIcon.src = RMWUrlBase + 'SharedServices/Images/question.gif';          
}

$ModalConfirm = RM.Lib.WebForms.ModalConfirm.Show = function(message, functionName){
  var modalConfirmObj = new RM.Lib.WebForms.ModalConfirm();
  RM.Lib.WebForms.ModalConfirm._createModalConfirm(modalConfirmObj);
  
  RM.Lib.WebForms.ModalConfirm._configConfirm(modalConfirmObj);
  
  modalConfirmObj._confirmTextNode.innerHTML = message;
  
  modalConfirmObj._modalPanel.show();
  
  modalConfirmObj._confirmOkButton.onclick = function(){
    RM.Lib.WebForms.ModalConfirm.CloseAndExecuteFunction(modalConfirmObj, functionName);
  }; 
  
  modalConfirmObj._confirmCancelButton.onclick = function(){
    RM.Lib.WebForms.ModalConfirm.Close(modalConfirmObj);          
  };  
  return modalConfirmObj;
}

RM.Lib.WebForms.ModalConfirm.CloseAndExecuteFunction = function(modalConfirmObj, callFunction)
{
    RM.Lib.WebForms.ModalConfirm.Close(modalConfirmObj);
    try
    {    
        eval(callFunction)     
    }
    catch(e)
    {
        return false;
    }
    
    return true; 
}

RM.Lib.WebForms.ModalConfirm.Close = function(modalConfirmObj){
  modalConfirmObj._modalPanel.dispose();
  delete modalConfirmObj;
}