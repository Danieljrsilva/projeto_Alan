/*<RMJSDep>SharedServices\ClientScripts\BrowserUtils;SharedServices\ClientScripts\WindowUtils;SharedServices\ClientScripts\DisableEnterSubmit; SharedServices\ClientScripts\Mozilla;SharedServices\ClientScripts\RMWJSResource.js.aspx;SharedServices\ClientScripts\TextBox;SharedServices\ClientScripts\AsyncServices;</RMJSDep>*/
var RMWLoadingCaption;
var RMWLoadingImage;
var RMWResizeWindowCallBack;
var RMWMainFormSubmitCallBack;
var RMWHasTextBoxWithEmptyText = false;

var RMWShowMessageInModalPopup = false;

function OnLoad(Event) {
}

function CallClientHostNameFunction() {
  if (ClientHostNameFunction)
    ClientHostNameFunction();
}

JQueryDisponivel = function () {
  if (window.jQuery || typeof (jQuery) != undefined)
    return true;

  return false;
}

HasValuesInLocalStorage = function (_fieldType) {
  if (_fieldType == "Lookup") {
    return (window.localStorage && window.localStorage.length && window.localStorage.getItem(_fieldType + "ObjectItem") != undefined &&
      window.localStorage.getItem(_fieldType + "ObjectItem") != null && window.localStorage.getItem(_fieldType + "ObjectItem") != "" &&
      window.localStorage.getItem(_fieldType + "ObjectItem").toString().indexOf("<FIELDTYPE>" + _fieldType + "</FIELDTYPE>") >= 0)
  }

  return false;
}

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

GetValueWhithinString = function (_string, _tag) {
  if (_string.indexOf(_tag) >= 0) {
    var TAGInicioIndex = _string.indexOf(_tag);
    var TAGValue1 = _string.toString().substr(TAGInicioIndex);
    var TAGFimIndex = TAGValue1.indexOf(_tag.toString().insert(1, "/"));
    var TAGValue2 = TAGValue1.substr(0, TAGFimIndex + (_tag.toString().insert(1, "/")).length);

    TAGValue2 = TAGValue2.replace(_tag, "");
    TAGValue2 = TAGValue2.replace(_tag.toString().insert(1, "/"), "");

    return TAGValue2
  }
  else
    return "Doesn't Exist";
}

GetObjectsInLocalStorage = function () {
  try {
    if (JQueryDisponivel() && HasValuesInLocalStorage('Lookup')) {
      var LookupValuesList = window.localStorage.getItem("LookupObjectItem");
      var itemListString = LookupValuesList.toString().split("<ITEM>");
      var itemListKey = "";
      var itemListValue = "";
      var itemListValueCodLookup = "";
      var itemListValueDescLookup = "";

      for (var i = 0; i < itemListString.length; i++) {
        var lErro = false;

        if (itemListString[i] == "")
          continue;

        if (itemListString[i].indexOf("<DOCTITLE>") >= 0) {

          var DOCTITLETagValue = GetValueWhithinString(itemListString[i], "<DOCTITLE>");

          if (DOCTITLETagValue == "Doesn't Exist")
            lErro = true;
          else {
            var innerTitle = ($(".AddressBarItemSelectedText").find("#lbTitle").length > 0) ? $(".AddressBarItemSelectedText").find("#lbTitle").text() : "";

            if (innerTitle != DOCTITLETagValue)
              lErro = true;
          }

          var PAGETYPETagValue = GetValueWhithinString(itemListString[i], "<PAGETYPE>");

          if (PAGETYPETagValue == "Doesn't Exist" || PAGETYPETagValue != "RMWEditUserControl")
            lErro = true;

          var FIELDTYPETagValue = GetValueWhithinString(itemListString[i], "<FIELDTYPE>");

          if (FIELDTYPETagValue == "Doesn't Exist" || FIELDTYPETagValue != "Lookup")
            lErro = true;

          if (lErro) {
            window.localStorage.removeItem("LookupObjectItem");
            return;
          }
          else
            continue;
        }

        itemListString[i] = itemListString[i].replace(/<\/ITEM>/, "");

        itemListKey = GetValueWhithinString(itemListString[i], "<key>");

        if (itemListKey == "Doesn't Exist")
          lErro = true;

        itemListValue = GetValueWhithinString(itemListString[i], "<value>");

        if (itemListValue == "Doesn't Exist")
          lErro = true;

        itemListValueCodLookup = itemListValue.toString().split(/\|/)[0];
        itemListValueCodLookup = itemListValueCodLookup.replace(/codigo=>\'/gi, "'");
        itemListValueCodLookup = itemListValueCodLookup.replace(/\'/gi, "");

        itemListValueDescLookup = itemListValue.toString().split(/\|/)[1];
        itemListValueDescLookup = itemListValueDescLookup.replace(/descricao=>\'/gi, "'");
        itemListValueDescLookup = itemListValueDescLookup.replace(/\'/gi, "");

        if (lErro) {
          window.localStorage.removeItem("LookupObjectItem");
          return;
        }

        if ($("#" + itemListKey).length > 0) {
          var tdCodigoLookup = $("#" + itemListKey).find(".RMWLookupLastKeyFieldVisibleCellCssClass");
          var inputCodigoLookup = tdCodigoLookup.find("input[type=text]");

          if (inputCodigoLookup.length > 0)
            inputCodigoLookup.val(itemListValueCodLookup);

          var tdDescricaoLookup = $("#" + itemListKey).find(".RMWLookupDisplayFieldCellCssClass");
          var tableDescricaoLookup = tdDescricaoLookup.children("table");
          var trDescricaoLookup = tableDescricaoLookup.find("tr");
          var tdDescricaoLookup = trDescricaoLookup.find("td");
          var inputDescricaoLookup = tdDescricaoLookup.find("input[type=text]");

          if (inputDescricaoLookup.length > 0)
            inputDescricaoLookup.val(itemListValueDescLookup);

          window.localStorage.removeItem("LookupObjectItem");
        }
      }
    }
  }
  catch (ex) {
    if (HasValuesInLocalStorage('Lookup') && window.document && window.document.title != "ErrorPage")
      window.localStorage.removeItem("LookupObjectItem");
  }
}

function pageLoad(e) {
  if (!e) var e = window.event;

  DoDisableEnterSubmit(e);
  ConfigureMainFormSubmit();

  if (RMWHasTextBoxWithEmptyText)
    EnsureEmptyTextFeatures();

  GetObjectsInLocalStorage();

  eval(OnLoadFunctions);

  WorkAroundForAspNetAjax();
  // if (Sys.Browser.name != 'Microsoft Internet Explorer')//donotlocalize
  //	ConfigureFirefoxResizeWorkAround();

  var loadingMessage = RM.Lib.WebForms.ModalLoading.ShowLoading(document.body, '');
  loadingMessage.dispose();

  //Ajuste de BUG no IE, painel de loading não some, trecho abaixo força o hide
  if ($LoadingPanel !== null) {
    $LoadingPanel.hide();
  }


  /***** Adiciona função para redimencionar elementos 100% de altura da pagina  ****/
  FixHeightGetItens();
  FixHeight();

  $addHandler(window, 'resize', function () {//donotlocalize
    window.clearTimeout(fixHeightTimeout);
    fixHeightTimeout = window.setTimeout(FixHeight, 100)
  });

  // Adicionar o execution no load da página do JS customizado
  ExecPageCustom();

}

function pageUnload() {
  if (Sys.Browser.name != 'Microsoft Internet Explorer')//donotlocalize
    $removeHandler(window, 'resize', RMWResizeWindowCallBack);//donotlocalize
}

function ChangeLocation(href, loadingMessage) {
  ShowLoadingCaption(loadingMessage);
  window.location.href = href;
}

function ConfigureFirefoxResizeWorkAround() {
  var mainContainer = $get('MainContainer');//donotlocalize
  if (mainContainer)
    RM.Lib.WebForms.DivOverflowUtils._mainContainerDiv = { overflowMode: RM.Lib.WebForms.DivOverflowMode.Both, element: mainContainer };

  RMWResizeWindowCallBack = Function.createCallback(RM.Lib.WebForms.DivOverflowUtils.EnsureManagedDivsSize, null);

  RM.Lib.WebForms.DivOverflowUtils._enableResizeWorkAround = true;

  window.resizeBy(1, 1);
  $addHandler(window, 'resize', RMWResizeWindowCallBack);//donotlocalize
  window.resizeBy(-1, -1);
}

/* No dia 3/10/2007 foi detectado que o script da microsoft que gerencia as chamdas ajax
    gerava um Bug caso ocorresse uma chamada ao servidor dentro de um resultado de uma outra chamada ao servidor(Ajax)
    segue abaixo o código que substitui parte do script da microsoft corrigindo este problema.
 **********************************************************************************************/
function WorkAroundForAspNetAjax() {
  if (typeof (WebForm_CallbackComplete) == "function")//donotlocalize
  {
    WebForm_CallbackComplete = Override_WebForm_CallbackComplete;
  }
}

function Override_WebForm_CallbackComplete() {
  for (i = 0; i < __pendingCallbacks.length; i++) {
    callbackObject = __pendingCallbacks[i];
    if (callbackObject && callbackObject.xmlRequest && (callbackObject.xmlRequest.readyState == 4)) {
      if (!__pendingCallbacks[i].async) {
        __synchronousCallBackIndex = -1;
      }
      __pendingCallbacks[i] = null;
      var callbackFrameID = "__CALLBACKFRAME" + i;
      var xmlRequestFrame = document.getElementById(callbackFrameID);
      if (xmlRequestFrame) {
        xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);
      }
      WebForm_ExecuteCallback(callbackObject);
    }
  }
}
/*********************************************************************************************/


function EnsureEmptyTextFeatures() {
  if ((ServerLoadedControllerId != null) && (ServerLoadedControllerId != '')) {
    var _serverLoadedController = document.getElementById(ServerLoadedControllerId);

    if (_serverLoadedController != null) {
      if (_serverLoadedController.value.toString().toUpperCase() == 'FALSE') {
        RestoreInputEmptyTextFeatures();
        RestoreTextAreaEmptyTextFeatures();
      }
      else {
        _serverLoadedController.value = 'FALSE';
      }
    }
  }
}

function RestoreTextAreaEmptyTextFeatures() {
  var textAreas = document.getElementsByTagName('textarea');//donotlocalize
  for (i = 0; i < textAreas.length; i++) {
    var textAreaId = textAreas[i].id;

    if ((textAreaId != null) && (textAreaId != '')) {
      RestoreRMWTextBoxEmptyTextFeatures(textAreaId);
    }
  }
}

function RestoreInputEmptyTextFeatures() {
  var inputs = document.getElementsByTagName('input'); //donotlocalize
  for (i = 0; i < inputs.length; i++) {
    var currentInput = inputs[i];

    if (currentInput.type.toString().toUpperCase() == 'TEXT') {
      var inputId = currentInput.id;

      if ((inputId != null) && (inputId != '')) {
        RestoreRMWTextBoxEmptyTextFeatures(inputId);
      }
    }
  }
}

function RestoreRMWTextBoxEmptyTextFeatures(controlId) {
  var _rmwTextBox = new RMWTextBox(controlId);
  if (_rmwTextBox != null)
    if (!_rmwTextBox.getShowingEmptyText())
      _rmwTextBox.clearEmptyTextStyle(true);
    else
      _rmwTextBox.restoreEmptyTextStyle(true);
}

//Método específico para o FireFox
//Quando faz history.back, o OnLoad não é disparado e sim este método
function OnPageShow(persisted) {
  if (persisted)
    HideLoadingCaption();
}

function ConfigureMainFormSubmit() {
  $addOnsubmitHanlder(MainFormSubmit);
}

window.detailsWindowByTransactionId = [];

function ClearDetailTransaction(TransactionId) {
  if (window.detailsWindowByTransactionId &&
    window.detailsWindowByTransactionId[TransactionId] &&
    window.detailsWindowByTransactionId[TransactionId].closed) {
    tc_submiting = false;
    var xmlHttp = GetXmlHttp();
    var asyncResponsePageUrl = GetAsyncResponserPageUrl();

    xmlHttp.open("GET", asyncResponsePageUrl + "?ServiceId=ClearTransaction&TransactionId=" + TransactionId, true); //donotlocalize
    xmlHttp.send(null);
  }
}

function SetupLicenceTimer() {
  window.setInterval("RenewLicence('" + LoginId + "');", TimerInterval); //donotlocalize
}

function RenewLicence(LoginId) {
  var xmlHttp = GetXmlHttp();
  var asyncResponsePageUrl = GetAsyncResponserPageUrl();

  xmlHttp.open("GET", asyncResponsePageUrl + "?ServiceId=RenewLicence&LoginId=" + LoginId + "&RandomId=" + Math.random(), true); //donotlocalize
  xmlHttp.send(null);
}

var ShowLoadingMessageOnSubmit = true;
function MainFormSubmit() {
  var internalPageIsValid = true;
  if ((typeof (Page_IsValid) != null) && (typeof (Page_IsValid) != "undefined"))//donotlocalize
    eval("internalPageIsValid = Page_IsValid;")//donotlocalize

  if (internalPageIsValid && ShowLoadingMessageOnSubmit)
    ShowLoadingCaption(SUBMIT_LOADING_MESSAGE);

  if (OnSubmitFunctions != null)
    eval(OnSubmitFunctions);
}

var $LoadingPanel = null;
function ShowLoadingCaption(loadingMessage) {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  var trident = ua.indexOf('Trident/');
  if ((msie < 0 && trident < 0) || $LoadingPanel == null) {
    //(msie) IE 10 or older or (trident) IE 11
    $LoadingPanel = RM.Lib.WebForms.ModalLoading.ShowLoading(document.body, loadingMessage);
  }
}

function HasPreviousPage() {
  var noHistoryLength = (isIE()) ? 0 : 1;

  return (history.length > noHistoryLength);
}

function HideLoadingCaption() {
}

function SetBrowserCSS() {
  if (isIE()) {
    var NSCSSConst = "NS.CSS";
    var IECSSConst = "IE.CSS";

    for (var i = 0; i < document.styleSheets.length; i++) {
      var styleSheet = document.styleSheets[i];
      if ((styleSheet.href != null) &&
        (styleSheet.href.toUpperCase().indexOf(NSCSSConst) != -1))
        styleSheet.href = styleSheet.href.toUpperCase().replace(NSCSSConst, IECSSConst);
    }
  }
}

function ConfigureWindowOnLoad() {
}

function OpenEditPageWindow(ShowingDetail, Url) {
  //GetCenterPositionLeft
  if (ShowingDetail == "TRUE")
    ShowModalWindow(Url, '', getFeatures(), false);
  else
    OpenWindow(Url, '', getFeatures());
}

function OpenWindowTargetBlank(Url) {
  OpenWindow(Url, '', getFeatures());
}

//Abre um item de menu está presente no Menu.Xml com a TAG NavigateUrl preenchida e o atributo "target" definido para "_custom"
function OpenWindowTargetMain(Url) {
  //Localiza o container principal do site para abrir dentro dele a Url passada como parâmetro
  divMainContainer = document.getElementById('MainContainer'); //donotlocalize
  if (divMainContainer) {
    divMainContainer.style.overflow = "hidden"; //donotlocalize
    divMainContainer.innerHTML = "<iframe id='iFrameURL' frameborder=0 scrolling=yes style='width: 100%; height: 100%;' src='" + Url + "'></iframe>"; //donotlocalize

    //Esconde a DIV que mostra as dicas de tela
    var divTabSheetHint = document.getElementById('TabSheetHint'); //donotlocalize
    if (divTabSheetHint)
      divTabSheetHint.style.display = 'none'; //donotlocalize

    var divHintTD = document.getElementById('HintTD'); //donotlocalize
    if (divHintTD)
      divHintTD.style.display = 'none'; //donotlocalize

    //Altera o tamanho da área util para a DIV pois a parte que exibe as dicas da tela foi escondida
    var dataContainerTD = document.getElementById('DataContainerTD'); //donotlocalize
    if (dataContainerTD) {
      var footerHeight = 26;
      var windowHeight = getWindowDimension().height;
      var top = getOffset(dataContainerTD).top
      var height = dataContainerTD.offsetHeight
      var rest = windowHeight - (top + height) - footerHeight;

      divMainContainer.style.height = height + rest + "px"; //donotlocalize
      dataContainerTD.style.height = divMainContainer.style.height;
    }
  }
}

function ShowAlertMessage(Message) {
  if (RMWShowMessageInModalPopup)
    return $ShowModalMessageBox(RM.Lib.WebForms.ModalPanelWindowType.Alert, Message)
  else {
    alert(Message);
    return null;
  }
}

function HasTextBoxWithEmptyText() {
  RMWHasTextBoxWithEmptyText = true;
}


var fixHeightTimeout = null,
  leftTdMenu = null,
  accordionItens = null,
  containers = null,
  dataContainerTD = null,
  mainContainer = null,
  pnlGrid = null,
  leftMenuTable = null,
  headerHeight = 0;

function getOffset(elem) {
  var elem, box;

  if (!elem || !elem.ownerDocument) {
    return null;
  }

  try {
    box = elem.getBoundingClientRect();
  } catch (e) { }

  var doc = elem.ownerDocument,
    docElem = document.documentElement,
    body = document.body,
    win = window,
    clientTop = docElem.clientTop || body.clientTop || 0,
    clientLeft = docElem.clientLeft || body.clientLeft || 0,
    scrollTop = (window.pageYOffset || docElem.scrollTop || body.scrollTop),
    scrollLeft = (window.pageXOffset || docElem.scrollLeft || body.scrollLeft),
    top = box.top + scrollTop - clientTop,
    left = box.left + scrollLeft - clientLeft;

  return { top: top, left: left };
};

function getElementsByClass(searchClass, node, tag) {
  var classElements = new Array();
  if (node == null)
    node = document;
  if (tag == null)
    tag = '*';
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)"); //donotlocalize
  for (i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className)) {
      classElements[j] = els[i];
      j++;
    }
  }
  return classElements;
}

function FixHeightGetItens() {

  leftTdMenu = $get("tdLeftOptions"); //donotlocalize
  accordionItens = getElementsByClass('AccodionHeaderMainTable', leftTdMenu, "TABLE"); //donotlocalize
  containers = getElementsByClass('AccordionItemChildControlsDiv', leftTdMenu, "DIV"); //donotlocalize
  dataContainerTD = $get("DataContainerTD"); //donotlocalize
  mainContainer = $get("MainContainer"); //donotlocalize
  pnlGrid = $get("ViewControl_pnGrid"); //donotlocalize
  leftMenuTable = $get("LeftMenuTable"); //donotlocalize

  var header = $get("HeaderTD"); //donotlocalize
  if (header)
    headerHeight = header.offsetHeight;
}

function getWindowDimension() {
  var theWidth, theHeight;
  // Window dimensions: 
  if (window.innerWidth) {
    theWidth = window.innerWidth;
  }
  else if (document.documentElement && document.documentElement.clientWidth) {
    theWidth = document.documentElement.clientWidth;
  }
  else if (document.body) {
    theWidth = document.body.clientWidth;
  }
  if (window.innerHeight) {
    theHeight = window.innerHeight;
  }
  else if (document.documentElement && document.documentElement.clientHeight) {
    theHeight = document.documentElement.clientHeight;
  }
  else if (document.body) {
    theHeight = document.body.clientHeight;
  }
  return { width: theWidth, height: theHeight };
}

function FixHeight() {

  var footerHeight = 26;

  /*** VERIFICA SE EXISTE O FOOTER ABERTO */
  if (typeof (GetColapsableContainer) != "undefined") {//donotlocalize
    var SelectedPanel = GetColapsableContainer('TabSheetHint'); //donotlocalize
    var windowHeight = getWindowDimension().height;

    if (SelectedPanel)
      if (SelectedPanel.style.display != 'none')//donotlocalize
        footerHeight = 85;
  }

  /******* ALTURA DO TD CONTAINER *********/
  if (mainContainer && dataContainerTD) {
    var top = getOffset(dataContainerTD).top
    var height = dataContainerTD.offsetHeight
    var rest = windowHeight - (top + height) - footerHeight;

    mainContainer.style.height = height + rest + "px"; //donotlocalize
    dataContainerTD.style.height = mainContainer.style.height;
  }

  /****** ALTURA DO MENU CONTAINER *******/
  if (accordionItens) {
    if (accordionItens.length > 0) {
      var sumAccordionHeight = 0;
      var accordionHeight = accordionItens[0].offsetHeight;

      for (var i = 0; i < accordionItens.length; i++) {
        sumAccordionHeight += accordionItens[i].offsetHeight;
      };

      /**** ALTURA DE TODOS CONTAINERS DO MENU ***/
      var containerHeight = windowHeight - sumAccordionHeight - accordionHeight - headerHeight;
      for (var i = 0; i < containers.length; i++) {
        containers[i].style.height = containerHeight + "px"; //donotlocalize
      };

      leftMenuTable.style.height = containerHeight + "px"; //donotlocalize
    }
  }

  /**** ALTURA DA DIV DO GRID PRINCIPAL ****/
  if (pnlGrid) {
    var top = getOffset(pnlGrid).top;
    var height = pnlGrid.offsetHeight
    var rest = windowHeight - (top + height) - footerHeight;
    pnlGrid.style.height = height + rest + "px"; //donotlocalize
  }
}

function getFeatures() {
  var features = [
    "height=" + (screen.availHeight - 70),
    "width=" + (screen.availWidth - 20),
    "resizable=yes",
    "status=yes",
    "screenX=1",
    "screenY=1",
    "left=1",
    "top=1" 
  ].join(',')

  return features;
}

