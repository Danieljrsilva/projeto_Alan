/*<RMJSDep>SharedServices\ClientScripts\Comum</RMJSDep>*/

function StringToBoolean(Value)
{
	if (Value!=null)
	{
	    if (Value.toString().toUpperCase()=="TRUE")
		    return true;
	    else
		    return false;
    }
    else
	    return false;
}
