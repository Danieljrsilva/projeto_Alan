function ReplaceAll(strInput, strSearch, strReplace)
{
    if (strInput != null)
    {
        var Pos = strInput.indexOf(strSearch);
        
        while (Pos!= -1)
        {
            strInput = strInput.substr(0, Pos) + strReplace + strInput.substr(Pos + strSearch.length);
            Pos += strReplace.length;
            var Pos = strInput.indexOf(strSearch, Pos);
        }
    }
    
    return strInput;
}
