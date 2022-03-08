/*
Função que habilita ou desabilita o controle enviado
*/
function SetControlEnabled(Control, Enabled)
{
	var ControlType = Control.type;
	var SuffixDisabled = '_Disabled';//donotlocalize
	var SuffixOver = '_Over';//donotlocalize
	Control.disabled = !Enabled;
	
	if (Enabled)
	{
			if (ControlType != null)
				if (ControlType.toUpperCase() == 'IMAGE')
					Control.src = Control.src.replace(SuffixDisabled,'');
	}
	else
	{
			if (ControlType != null)
				if (ControlType.toUpperCase() == 'IMAGE')
				{
					if (Control.src.indexOf(SuffixDisabled)==-1)
					{
						Control.src = Control.src.replace(SuffixOver,'');
						
						var DotPosition = Control.src.lastIndexOf('.');
						Control.src = Control.src.substring(0, DotPosition) + SuffixDisabled + Control.src.substr(DotPosition);
					}
				}
	}
}

/*
Pega o controle filho do Control passado por parametro de menor tabIndex
*/
function GetLowerTabIndexUserInputControl(Control)
{
	var ControlToFocus;
	
	if (Control.childNodes != null)
		for(var i=0; i<Control.childNodes.length; i++)
		{
			var ChildControl = Control.childNodes[i];
			
			if ((ChildControl.tagName != null) &&
				((ChildControl.tagName.toUpperCase() != 'INPUT') &&
				(ChildControl.tagName.toUpperCase() != 'SELECT') &&
				(ChildControl.tagName.toUpperCase() != 'TEXTAREA')))
			{
				//Vendo se pode ser um de seus controles filhos
				ChildControl = GetLowerTabIndexUserInputControl(ChildControl);
			}
			
			if (IsUserInputControl(ChildControl))
			{
				if ((ControlToFocus == null) ||
					((ChildControl.tabIndex < ControlToFocus.tabIndex) &&
					(ChildControl.tabIndex >= 0)))
						ControlToFocus = ChildControl;
			}
		}
		
	return ControlToFocus; 
}

function IsUserInputControl(Control)
{
	//Lista de tipos que o usuário não pode focar
	var IgnoreInputType = 'HIDDEN;IMAGE';
	
	if (Control == null)
		return false;
	
	if ((Control.tagName != null) && 
		(Control.tagName.toUpperCase() == 'INPUT'))
	{
		
		if (IgnoreInputType.indexOf(Control.type.toUpperCase())!=-1)
			return false;
	}
		
	if (Control.disabled != false)
		return false;
		
	return true;
}

function clearChildsControls(MasterControl)
{
	var nodeCount = MasterControl.childNodes.length;
	for(i = 0; i < nodeCount; i++)
	{
		MasterControl.removeChild(MasterControl.childNodes[0]);
	}
}

function GetControlNameFromId(ControlId)
{
    var result = ControlId;
    while(result.indexOf("_")!=-1)
        result = result.replace("_","$");
        
    return result;
}