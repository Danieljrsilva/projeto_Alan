 RM.Lib.WebForms.RMWToolButton = function(element){
    RM.Lib.WebForms.RMWToolButton.initializeBase(this, [element]);  
    
    this._ToolButton;
    this._Image = null;
    this._Label = null;
    this._OnClientClick = '';
    this._ImageUrl = '';
    this._DisabledImageUrl = '';
}

RM.Lib.WebForms.RMWToolButton.prototype = {
    initialize: function() {
        RM.Lib.WebForms.RMWToolButton.callBaseMethod(this, 'initialize');

        if (this._Image != null)
            this.set_OnClientClick(this._Image.onclick);
        else
            this.set_OnClientClick(this._Label.onclick);

        if (this._ToolButton) {
            var disabledAttribute = this._ToolButton.getAttribute('disabled');
            if (!disabledAttribute || (disabledAttribute.toUpperCase && disabledAttribute.toUpperCase() != 'DISABLED')) {
                this.set_Enable();
            }
            else {
                this.set_Disable();
            }
        }
    },

    set_Enable: function() {


        if (this._Image != null) {
            this._Image.disabled = false;
            $clearHandlers(this._Image);
            $addHandler(this._Image, 'mouseover', Function.createDelegate(this, this._OnMouseOverButton)); //donotlocalize
            $addHandler(this._Image, 'mouseout', Function.createDelegate(this, this._OnMouseOutButton)); //donotlocalize
            this._Image.src = this._ImageUrl;
            this._Image.style.cursor = "hand"; //donotlocalize
            this._Image.style.cursor = "pointer";   //donotlocalize
        }

        if (this._Label != null) {
            this._Label.disabled = false;
            $clearHandlers(this._Label);
           //this._Label.style.color = 'blue'; //donotlocalize
            $addHandler(this._Label, 'mouseover', Function.createDelegate(this, this._OnMouseOverButton)); //donotlocalize
            $addHandler(this._Label, 'mouseout', Function.createDelegate(this, this._OnMouseOutButton)); //donotlocalize
            this._Label.style.cursor = "hand"; //donotlocalize
            this._Label.style.cursor = "pointer";   //donotlocalize    
        }


        if (this._Image != null && this._Image.onclick == null) {
            this._Image.onclick = this.get_OnClientClick();
        }

        if (this._Label != null && this._Label.onclick == null) {
            this._Label.onclick = this.get_OnClientClick();
        }

    },

    set_Disable: function() {

        if (this._Label != null) {
            this._Label.disabled = true;
            this._Label.style.color = 'gray'; //donotlocalize
            $clearHandlers(this._Label);
            this._Label.onclick = null;
            this._Label.style.cursor = "default"; //donotlocalize        
            this._Label.style.textDecoration = "none"; //donotlocalize   
        }



        if (this._Image != null) {
            this._Image.disabled = true;
            $clearHandlers(this._Image);
            this._Image.onclick = null;

            if (this._DisabledImageUrl != '')
                this._Image.src = this._DisabledImageUrl;
            else
                this._Image.src = this._ImageUrl;

            this._Image.style.cursor = "default"; //donotlocalize      
        }

    },

    get_ToolButton: function() {
        return this._ToolButton;
    },
    set_ToolButton: function(value) {
        this._ToolButton = value;
    },

    get_Label: function() {
        return this._Label;
    },
    set_Label: function(value) {
        this._Label = value;
    },

    get_Image: function() {
        return this._Image;
    },
    set_Image: function(value) {
        this._Image = value;
    },

    get_OnClientClick: function() {
        return this._OnClientClick;
    },
    set_OnClientClick: function(value) {
        this._OnClientClick = value;
    },

    get_ImageUrl: function() {
        return this._ImageUrl;
    },
    set_ImageUrl: function(value) {
        this._ImageUrl = value;
    },

    get_DisabledImageUrl: function() {
        return this._DisabledImageUrl;
    },
    set_DisabledImageUrl: function(value) {
        this._DisabledImageUrl = value;
    },
    OnClientClick: function() {
        DoClientClick(this.get_OnClientClick());
    },
    _OnMouseOverButton: function() {
        if(this._Label != null)
            this._Label.style.textDecoration = 'underline'; //donotlocalize
    },
    _OnMouseOutButton: function() {
        if (this._Label != null)
            this._Label.style.textDecoration = 'none'; //donotlocalize
    },
    _Click: function() {
        if (this._Image != null)
            this._Image.click();
        else
            this._Label.click();
    }
}

RM.Lib.WebForms.RMWToolButton.GetToolButton = function(ToolButtonId){    
    var ToolButton = $find(ToolButtonId);
    if(ToolButton)
        return ToolButton;
        
    return new RM.Lib.WebForms.RMWToolButton(ToolButtonId);
}

RM.Lib.WebForms.RMWToolButton.ClearLocalStorage = function (_pageType, _fieldType) {
    if (_pageType == "RMWEditUserControl") {
        if (_fieldType == "Lookup") {
            if (JQueryDisponivel() && HasValuesInLocalStorage(_fieldType) && HasFieldsWithThisType(_fieldType))
                window.localStorage.removeItem(_fieldType + "ObjectItem");
        }
    }
}

RM.Lib.WebForms.RMWToolButton.SetValuesInLocalStorage = function (_pageType, _fieldType) {
    if (_pageType == "RMWEditUserControl") {
        if (_fieldType == "Lookup") {
            try {

                if (JQueryDisponivel() && !HasValuesInLocalStorage(_fieldType) && HasFieldsWithThisType(_fieldType)) {
                    var customDictionary = new CustomDictionary();
                    var listOfIds = [];

                    $(".RMWLookupMainTableCssClass").each(function () {
                        listOfIds.push(this.id);
                    });

                    var tdCodigoLookup = $(".RMWLookupLastKeyFieldVisibleCellCssClass");
                    var count = 0;
                    tdCodigoLookup.each(function () {
                        var idLookup = listOfIds[count];

                        var inputCodigoLookup = $(this).find("input[type=text]");
                        var valueCodigoLookup = "";

                        if (inputCodigoLookup.length > 0) {
                            valueCodigoLookup = inputCodigoLookup.val();
                            customDictionary.Add(idLookup, "codigo=>'" + valueCodigoLookup + "'|descricao=>'{0}'");
                        }

                        count++;
                    });

                    var tdDescricaoLookup = $(".RMWLookupDisplayFieldCellCssClass");
                    var tableDescricaoLookup = tdDescricaoLookup.children("table");
                    var trDescricaoLookup = tableDescricaoLookup.find("tr");
                    var tdDescricaoLookup = trDescricaoLookup.find("td");

                    count = 0;

                    tdDescricaoLookup.each(function () {
                        var idLookup = listOfIds[count];

                        var inputDescricaoLookup = $(this).find("input[type=text]");
                        var valueDescricaoLookup = "";

                        if (inputDescricaoLookup.length > 0) {
                            valueDescricaoLookup = inputDescricaoLookup.val();
                            customDictionary.ListItems[count].Value = customDictionary.ListItems[count].Value.replace("'{0}'", "'" + valueDescricaoLookup + "'");
                        }

                        count++;
                    });

                    var innerTitle = ($(".AddressBarItemSelectedText").find("#lbTitle").length > 0) ? $(".AddressBarItemSelectedText").find("#lbTitle").text() : "";

                    var docTitleTag = "<DOCTITLE>" + innerTitle + "</DOCTITLE>";
                    var pageTypeTag = "<PAGETYPE>" + _pageType + "</PAGETYPE>";
                    var fieldTypeTag = "<FIELDTYPE>" + _fieldType + "</FIELDTYPE>";

                    window.localStorage.setItem(_fieldType + "ObjectItem", docTitleTag + pageTypeTag + fieldTypeTag + customDictionary.ToString());
                }
            }
            catch (ex) {
                if (HasValuesInLocalStorage(_fieldType) && window.document && window.document.title != "ErrorPage")
                    window.localStorage.removeItem(_fieldType + "ObjectItem");
            }
        }
    }
}

JQueryDisponivel = function () {
    if (window.jQuery || typeof (jQuery) != undefined)
        return true;

    return false;
}

HasFieldsWithThisType = function (_fieldType) {
    if (_fieldType == "Lookup") {
        if (JQueryDisponivel()) {
            if ($(".RMWLookupLastKeyFieldVisibleCellCssClass").length > 0 && $(".RMWLookupDisplayFieldCellCssClass").length > 0)
                return true;
        }
        else {
            if (document.getElementsByClassName("RMWLookupLastKeyFieldVisibleCellCssClass").length > 0 &&
                document.getElementsByClassName("RMWLookupDisplayFieldCellCssClass").length > 0)
                return true;
        }
    }

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

CustomDictionary = function () {
    this.ListItems = [];
    this.Add = function (_key, _value) {
        this.ListItems.push(new CustomDictionaryItem(_key, _value));
    };
    this.ToString = function () {
        var result = "";

        for (var i = 0; i < this.ListItems.length; i++) {
            result += "<ITEM><key>" + this.ListItems[i].Key + "</key><value>" + this.ListItems[i].Value + "</value></ITEM>";
        }

        return result;
    };
}

CustomDictionaryItem = function (_key, _value) {
    this.Key = _key;
    this.Value = _value;
}

function DoClientClick(comand){
    eval(comand);
}

function AddAtribute(element, eventName, handler){
    element.setAttribute(eventName, handler);
}
RM.Lib.WebForms.RMWToolButton.LastClickedToolButton = null;

RM.Lib.WebForms.RMWToolButton.OnToolButtonClick = function(ToolButtonId){
    RM.Lib.WebForms.RMWToolButton.LastClickedToolButton = $find(ToolButtonId);
}

RM.Lib.WebForms.RMWToolButton.ClickLastToolButton = function(){
    if(RM.Lib.WebForms.RMWToolButton.LastClickedToolButton != null)
        RM.Lib.WebForms.RMWToolButton.LastClickedToolButton._Click();    
}

RM.Lib.WebForms.RMWToolButton.registerClass("RM.Lib.WebForms.RMWToolButton", Sys.UI.Control);
