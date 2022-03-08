/*<RMJSDep>SharedServices\ClientScripts\BrowserUtils</RMJSDep>*/
//Fecha a janela aberta

//Constantes para tamanho da janela padrão de 800x600
var RMWDefaultWindowWidth = 793;
var RMWDefaultWindowHeight = 471;

function CloseWindowOpener()
{
	if (IsWindowOpenerValid())
		window.close();
}

//Verifica se o window.opener é valido
function IsWindowOpenerValid()
{
  try
  {
	  if ((window.opener!=null) && 
		    (!window.opener.closed))
		  return true;
	  else
		  return false;
  }
  catch(e)
  {
    return false;
  }
}

function OpenWindow(Url, WindowName, WindowFeatures)
{
	return window.open(Url,WindowName,WindowFeatures);
}

/********************************************************
Funcao criada para adicionar 20px no Height da janela do NS
já que a janela aberta pelo window.open do NS é menor que 
do IE
O parametro AddNSHeight recebe um valor booleano
********************************************************/
function SetWindowFeaturesHeight(pWindowFeatures)
{
	var result;
	result = pWindowFeatures.toUpperCase();
	
	if (isNS())
	{
		var HeightConst = "HEIGHT";
		var StartPos;
		var EndPos;
		var HeightValue;
		
		StartPos = result.indexOf(HeightConst);

		if (StartPos!=-1)
		{
			EndPos = result.indexOf(",", StartPos);
			if (EndPos!=-1)
			{
				HeightValue = result.substring(StartPos + 7, EndPos);
				result = result.substring(0,StartPos) + result.substr(EndPos + 1);
			}
			else
			{
				HeightValue = result.substring(StartPos + 7);
				result = result.substr(0,StartPos);
			}
					
			HeightValue = parseInt(HeightValue) + 20;

			while((result.length>0) &&
				  (result.substr(result.length-1)==" "))
					result = result.substring(0,result.length-1);
			
			if ((result.length>0) &&
				(result.substr(result.length-1)!=","))
				result = result + ",";
			
			result = result + HeightConst + "=" + HeightValue + "PX,";
		}
	}

	return result;
}

/*
Retorna uma QueryString da URL
*/
function GetQueryString(Key)
{
	var UpperCaseUrl = location.href.toUpperCase();
	Key = Key.toUpperCase();
	
	var StartPos = UpperCaseUrl.indexOf("?" + Key + "=");
	if (StartPos==-1)
		StartPos = UpperCaseUrl.indexOf("&" + Key + "=");
		
	if (StartPos!=-1)
	{
		StartPos += Key.length + 2;
		var EndPos = UpperCaseUrl.indexOf('&',StartPos);

		if (EndPos!=-1)
			return location.href.substring(StartPos,EndPos);
		else
			return location.href.substr(StartPos);
	}
	else
	{
		return "";
	}
}

function GetCenterPositionTop(NewWindowHeight)
{
	var result = (screen.availHeight  - NewWindowHeight) / 2;
	
	if (result > 0)
		return result;
	else
		return 0;
}

function GetCenterPositionLeft(NewWindowWidth)
{
	var result = (screen.availWidth  - NewWindowWidth) / 2;
	
	if (result > 0)
		return result;
	else
		return 0;
}

//newWindowHeight: Tamanho da nova janela que será aberta
//windowToolsTopHeight: Tamanho da área de janela de cima que não é incluído no newWindowHeight, por exemplo área de titulo, menus
//windowToolsBottomHeight: Tamanho da área de janela de cima que não é incluído no newWindowHeight, por exemplo status
//referenceWindow: Janela a qual o cascade deverá ser levado em consideração
function GetCascadePostionTop(newWindowHeight, windowToolsTopHeight, windowToolsBottomHeight, referenceWindow)
{
  var screenTop;
  if (isNS())
    screenTop = referenceWindow.screenY;
  else
    screenTop = referenceWindow.screenTop;
  var result = screenTop - windowToolsTopHeight;
  
  if (result + newWindowHeight + windowToolsTopHeight + windowToolsBottomHeight > screen.availHeight)
    result = 0;
  else if (result + 10 + newWindowHeight + windowToolsTopHeight + windowToolsBottomHeight <= screen.availHeight)
    result += 10;
    
  return result;
}

function GetCascadePostionLeft(newWindowWidth, referenceWindow)
{
  var windowBorderSize = 6;
  var screenLeft;
  if (isNS())
    screenLeft = referenceWindow.screenX;
  else
    screenLeft = referenceWindow.screenLeft;
  
  var result = screenLeft - windowBorderSize;
  
  if (result + newWindowWidth + (windowBorderSize*2) > screen.availWidth)
    result = 0;
  else if (result + 10 + newWindowWidth + (windowBorderSize*2)  <= screen.availWidth)
    result += 10;
    
  return result;
}
