/*<RMJSDep>SharedServices\ClientScripts\TabSheet; SharedServices\ClientScripts\BrowserUtils</RMJSDep>*/
var _ShowModalObject = null;

/* ----------------------------------------------------------------------------------- */
/* Execu��o do script de intercepta��o de P�ginas do Produto Padr�o                    */
/* ----------------------------------------------------------------------------------- */

// Fun��o principal disparada na abertura de p�ginas do produto
function ExecPageCustom() {
    if (document.URL.indexOf('ActionID=EduMatriculaOnlineActionWeb') > 0) { // p�gina de matr�cula
		IncludeJsExterno(document.URL.substring(0, document.URL.indexOf('/Main.aspx')) + '/Source/Cst-Customizacao/RM.Cst.IntegracaoPergamum/ClientScripts/IntegracaoPergamum.js?v1');
		window.onload = function () { ExecPageCustomValidation(); };
    }
}

function IncludeJsExterno(file_path){
  var j = document.createElement("script"); 
  j.type = "text/javascript";
  j.src = file_path;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(j);
}