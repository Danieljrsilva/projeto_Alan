/*<RMJSDep>SharedServices\ClientScripts\Comum; SharedServices\ClientScripts\BrowserUtils; SharedServices\ClientScripts\PrototypeUtils</RMJSDep>*/
var InternalMozOnResize = false;

function FireFoxOnLoad(){};

RMWFireFoxUtils = function RMWFireFoxUtils()
{
    this.context = new RMWJSContext();
	this.context.setWindow(window);
}


RMWFireFoxUtils.prototype.clearTableRules = function clearTableRules(TableID){};

/***********************************************************************************
 No FixFox o height 100% de uma TD(Cell no C#) deve ser definido como 0
 Al�m disso a propriedade cellPadding deve ser definido para 1, caso contr�rio esta
 c�lula n�o aparece
***********************************************************************************/
RMWFireFoxUtils.prototype.configTablesForWorkAround = function configTablesForWorkAround(){};


function MozDoTableConfig(TableID){};

/************************************************************************************
Este m�todo foi criado para corrigir um "comportamento" da atual vers�o do Mozilla Firefox(1.5.0.1)//donotlocalize
Que n�o dimensiona corretamente o tamanho de TDs com tamanho 100%//donotlocalize
************************************************************************************/
function FireFoxTableResizeWorkAround(){};

function FireFoxTableResizeWorkAroundCallBack(pWindow){};