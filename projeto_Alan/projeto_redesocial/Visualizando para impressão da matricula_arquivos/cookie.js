/*<RMJSDep>SharedServices\ClientScripts\Comum</RMJSDep>*/

/**************************************************************
Retorna o Valor da Chave passada por parametro dentro do cookie
**************************************************************/
function GetCookieValue(Key)
{
	var Cookie = document.cookie;
	var StartIndex = Cookie.indexOf(Key + "=");
	if (StartIndex == -1)
		return null;
		
	StartIndex += Key.length + 1;
	var EndIndex = Cookie.indexOf(";", StartIndex);
	
	if (EndIndex == -1)
		EndIndex = Cookie.length;

	return unescape(Cookie.substring(StartIndex, EndIndex));
}

function SetCookie(Name,Value,ExpDays)
{
	var Today = new Date();
	var Expire = new Date();
	
	if (ExpDays==null || ExpDays==0)
		ExpDays=1;
		
	Expire.setTime(Today.getTime() + 3600000*24*ExpDays);
	document.cookie = Name+"="+escape(Value)
					+ ";expires="+Expire.toGMTString();//donotlocalize
}