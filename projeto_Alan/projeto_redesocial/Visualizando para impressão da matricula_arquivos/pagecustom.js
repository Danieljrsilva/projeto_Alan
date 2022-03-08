/*<RMJSDep>SharedServices\ClientScripts\TabSheet; SharedServices\ClientScripts\BrowserUtils</RMJSDep>*/
var _ShowModalObject = null;

/* ----------------------------------------------------------------------------------- */
/* Execução do script de interceptação de Páginas do Produto Padrão                    */
/* ----------------------------------------------------------------------------------- */

// Função principal disparada na abertura de páginas do produto
function ExecPageCustom() {
    if (document.URL.indexOf('ActionID=EduMatriculaOnlineActionWeb') > 0) { // página de matrícula
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