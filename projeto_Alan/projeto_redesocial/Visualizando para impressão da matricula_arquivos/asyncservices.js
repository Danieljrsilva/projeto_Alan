/*<RMJSDep>SharedServices\ClientScripts\RMWJSServerVariables.js.aspx</RMJSDep>*/

function GetXmlHttp()
{
    var xmlhttp;
    try
    {
        xmlhttp = new XMLHttpRequest();
    }
    catch(ee)
    {
        try
        {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch(e)
        {
            try
            {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(E)
            {
                xmlhttp = false;
            }
        }
    }
    
    return xmlhttp;
}

function GetAsyncResponserPageUrl()
{
    return ApplicationPath + "/SharedServices/LibPages/AsyncResponser.aspx";
}