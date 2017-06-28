// Define image holders
var rootIcon = '../images/rootfoldericon.png';
var openRootIcon = '../images/rootfoldericon.png';
var folderIcon = '../images/foldericon.png';
var openFolderIcon = '../images/openfoldericon.png';
var fileIcon = '../images/new.png';
var iIcon = '../images/I.png';
var lIcon = '../images/L.png';
var lMinusIcon = '../images/Lminus.png';
var lPlusIcon = '../images/Lplus.png';
var tIcon = '../images/T.png';
var tMinusIcon = '../images/Tminus.png';
var tPlusIcon = '../images/Tplus.png';
var blankIcon = '../images/blank.png';

var defaultText = 'Tree Item';
var functionVoid = 'javascript:void(0);';
var InitLoad = true;
var SelNodeID = null;
var thisSession = null;

var TreeObjectHandler = {
    idCounter: 0,
    idPrefix: "xTree-",
    all: {},
    getId: function () { return this.idPrefix + this.idCounter++; },
    toggle: function (oItem) { this.all[oItem.id.replace('-plus', '')].toggle(); },
    select: function (oItem) { this.all[oItem.id.replace('-icon', '')].select(); },
    focus: function (oItem) { this.all[oItem.id.replace('-anchor', '')].focus(); },
    blur: function (oItem) { this.all[oItem.id.replace('-anchor', '')].blur(); }
};

function TreeObject(sText, sAction) {
    this._nodes = [];
    this.id = TreeObjectHandler.getId();
    this.ProjectID = 0;
    this.text = '&nbsp;' + sText || defaultText;
    this.action = sAction || functionVoid;
    this._wasLast = false; // Used to keep track of the last item in each sub tree
    this.open = true;
    this.icon = rootIcon;
    this.openIcon = openRootIcon;
    this.isRendered = true;
    TreeObjectHandler.all[this.id] = this;
}

TreeObject.prototype.add = function (treeItem) {
    // Add node to current parent
    treeItem.parent = this;
    this._nodes[this._nodes.length] = treeItem;
};

TreeObject.prototype.toString = function () {

    // Return div section
    var str = "<div id=\"" + this.id + "\" class=\"treeElement\">";
    str += "<img id=\"" + this.id + "-icon\" src=\"" + ((this.open) ? this.openIcon : this.icon) + "\"><span class=TreeView style=\"cursor:pointer\" href=\"javascript:void(0);\" id=\"" + this.id + "-anchor\">" + this.text + "</span></div>";
    str += "<div id=\"" + this.id + "-cont\" class=\"treeContainer\" style=\"display: " + ((this.open) ? 'block' : 'none') + ";\">";
    for (var i = 0; i < this._nodes.length; i++)
        str += this._nodes[i].toString(i, this._nodes.length);

    str += "</div>";
    return str;
};

TreeObject.prototype.toggle = function () {
    // Toggle node
    if (this.open) { this.collapse(); }
    else { this.expand(); }
}

TreeObject.prototype.select = function () {
    // Select the anchor element of the node
    document.getElementById(this.id + '-anchor').focus();
}

TreeObject.prototype.focus = function () {
    // Focus on the anchor element of the node
    document.getElementById(this.id + '-anchor').style.backgroundColor = 'highlight';
    document.getElementById(this.id + '-anchor').style.color = 'highlighttext';
    document.getElementById(this.id + '-anchor').style.border = '1px dotted threedshadow';
}

TreeObject.prototype.blur = function () {
    // Handle lost focus of a node
    document.getElementById(this.id + '-anchor').style.backgroundColor = 'window';
    document.getElementById(this.id + '-anchor').style.color = 'menutext';
    document.getElementById(this.id + '-anchor').style.border = '0px';
}

TreeObject.prototype.expand = function () {
    // Handle expansion of the current node
    var str = '';

    // Expand the elements
    if (this._nodes.length > 0) {
        if (!this.isRendered) {
            for (var i = 0; i < this._nodes.length; i++)
                str += this._nodes[i].toString(i, this._nodes.length);

            document.getElementById(this.id + '-cont').innerHTML = str;
            this.isRendered = true;
        }
        document.getElementById(this.id + '-cont').style.display = 'block';
    }
    if (this._nodes.length) {
        document.getElementById(this.id + '-icon').src = this.openIcon;
        document.getElementById(this.id + '-plus').src = this.minusIcon;
    }
    this.open = true;
}

TreeObject.prototype.collapse = function () {
    // Handle collapse of the node
    document.getElementById(this.id + '-icon').src = this.icon;
    document.getElementById(this.id + '-cont').style.display = 'none';
    this.open = false;
}

TreeObjectItem.prototype.expandChildren = function () {
    // Expand all nodes
    for (var i = 0; i < this._nodes.length; i++) {
        if (!this._nodes[i].open)
            this._nodes[i].expand();

        this._nodes[i].expandChildren();
    }
}


TreeObjectItem.prototype.collapseChildren = function () {
    var isAnyShown = false;

    // Collapse all elements
    for (var i = 0; i < this._nodes.length; i++) {
        if (this._nodes[i].IsShow)
            isAnyShown = true;

        if (!this._nodes[i].collapseChildren()) {
            if (this._nodes[i].open)
                this._nodes[i].collapse();
        }
        else
            isAnyShown = true;
    }

    return isAnyShown;
}

TreeObject.prototype.expandChildren = function () {
    // Expand all nodes
    for (var i = 0; i < this._nodes.length; i++) {
        if (!this._nodes[i].open)
            this._nodes[i].expand();

        this._nodes[i].expandChildren();
    }
}


TreeObject.prototype.collapseChildren = function () {
    // Collapse all elements
    for (var i = 0; i < this._nodes.length; i++) {
        if (!this._nodes[i].collapseChildren())
            if (this._nodes[i].open)
                this._nodes[i].collapse();
    }
}

function TreeObjectItem(sText, sAction, ProjectID, IsNoChildren, IsParentLast) {
    // Object element represents the lowest node
    this._nodes = [];
    this._wasLast = false;
    this.text = sText || defaultText;
    this.ProjectID = ProjectID;
    this.action = sAction || functionVoid;
    this.id = TreeObjectHandler.getId();
    this.open = false;
    this.plusIcon = ((IsParentLast) ? lPlusIcon : tPlusIcon);
    this.minusIcon = ((IsParentLast) ? lMinusIcon : tMinusIcon);
    this.IsShow = false;
    this.icon = fileIcon;
    this.openIcon = fileIcon;
    TreeObjectHandler.all[this.id] = this;
};

TreeObjectItem.prototype.add = function (treeItem) {
    // Add element
    treeItem.parent = this;
    this._nodes[this._nodes.length] = treeItem;
};

TreeObjectItem.prototype.toggle = function () {
    // Toggle element
    if (this.open) { this.collapse(); }
    else { this.expand(); }
}

TreeObjectItem.prototype.select = function () {
    // Select element
    document.getElementById(this.id + '-anchor').focus();
}

TreeObjectItem.prototype.focus = function () {
    // Display focus on the element
    document.getElementById(this.id + '-anchor').style.backgroundColor = 'highlight';
    document.getElementById(this.id + '-anchor').style.color = 'highlighttext';
    document.getElementById(this.id + '-anchor').style.border = '1px dotted threedshadow';
}

TreeObjectItem.prototype.blur = function () {
    // Handle lost focus on the element
    document.getElementById(this.id + '-anchor').style.backgroundColor = '#FFF7E0';
    document.getElementById(this.id + '-anchor').style.color = 'menutext';
    document.getElementById(this.id + '-anchor').style.border = '0px';
}

TreeObjectItem.prototype.expand = function () {
    var str = '';

    // Expand the elements

    if (this._nodes.length) {
        if (!this.isRendered) {
            for (var i = 0; i < this._nodes.length; i++)
                str += this._nodes[i].toString(i, this._nodes.length);

            document.getElementById(this.id + '-cont').innerHTML = str;
            this.isRendered = true;
        }
        document.getElementById(this.id + '-cont').style.display = 'block';
        document.getElementById(this.id + '-icon').src = this.openIcon;
        document.getElementById(this.id + '-plus').src = this.minusIcon;
    }
    this.open = true;
}

TreeObjectItem.prototype.collapse = function () {
    // Collapse the elements
    if (this._nodes.length > 0) {
        document.getElementById(this.id + '-cont').style.display = 'none';
    }
    if (this._nodes.length) {
        document.getElementById(this.id + '-icon').src = this.icon;
        document.getElementById(this.id + '-plus').src = this.plusIcon;
    }
    this.open = false;
}

TreeObjectItem.prototype.toString = function (nItem, nItemCount) {
    // Return html code

    var foo = this.parent;
    indentLevel = 0;

    if (nItem + 1 == nItemCount) { this.parent._wasLast = true; }
    while (foo.parent) {
        foo = foo.parent;
        indentLevel = indentLevel + 1;
    }
    indent = '<img width="' + (16 * indentLevel) + '" height="16" src="' + blankIcon + '">';

    if (mCode['m' + this.ProjectID]) {
        eval(mCode['m' + this.ProjectID]);
        mCode['m' + this.ProjectID] = null;
    }

    if (this._nodes.length) {
        // This is a folder
        this.icon = folderIcon;
        this.openIcon = openFolderIcon;

        // Cleverly avoid concatenation...

        str = '\
<div id="' + this.id + '" ondblclick="TreeObjectHandler.toggle(this);">\
' + indent + '\
<img align="absBottom" id="' + this.id + '-plus" src="' + ((this.open) ? ((this.parent._wasLast) ? lMinusIcon : tMinusIcon) : ((this.parent._wasLast) ? lPlusIcon : tPlusIcon)) + '" onclick="TreeObjectHandler.toggle(this);">\
<img align="absBottom" id="' + this.id + '-icon" src="' + ((this.open) ? this.openIcon : this.icon) + '" onclick="' + this.action + '">\
<span class="TreeView" style="cursor:pointer" href="javascript:void(0);" onclick="' + this.action + '" id="' + this.id + '-anchor" onfocus="TreeObjectHandler.focus(this);">\
&nbsp;' + this.text + '</span>\
</div>\
<div id="' + this.id + '-cont" style="display:' + ((this.open) ? 'block' : 'none') + ';"></div>';

    }
    else {						// This is a leaf node

        // Cleverly avoid concatenation...

        str = '\
<div id="' + this.id + '">\
' + indent + '\
<img align="absBottom" id="' + this.id + '-plus" src="' + ((this.parent._wasLast) ? lIcon : tIcon) + '">\
<img align="absBottom" id="' + this.id + '-icon" src="' + this.icon + '" onclick="' + this.action + ';">\
<span class="TreeView" style="cursor:pointer" href="javascript:void(0);" onclick="' + this.action + '" id="' + this.id + '-anchor">\
&nbsp;' + this.text + '</span>\
</div>';

    }

    this.plusIcon = ((this.parent._wasLast) ? lPlusIcon : tPlusIcon);
    this.minusIcon = ((this.parent._wasLast) ? lMinusIcon : tMinusIcon);
    return str;
}


function cmdCollapse_onclick() {
    mTree.collapseChildren();
}

function cmdExp_onclick() {
    mTree.expandChildren();
}

var SelNodeID = 0;
var IsShowAll = true;
var SelNotesID = 0;
var HiArray = new Array(122);


var LineArray = new Array();
var iCounter = 0;

function contains(Arr, Val) {
    for (var i = 0; i < Arr.length; i++) {
        if (Arr[i] == Val) return true;
    }
    return false;
}

function altRows(SelNodeID) {

    if (!contains(LineArray, SelNodeID)) {
        try {
            //see if this is a valid line
            eval('document.all.Proj' + SelNodeID + '.style.backgroundColor = ""');
            LineArray[LineArray.length] = SelNodeID;
        }
        catch (e) { }
    }
    //only if there is a valid row, do you need to redo the coloring.
    for (var i = 0; i < LineArray.length; i++) {
        if (eval('document.all.Proj' + LineArray[i] + '.style.display == "none"') == false) {
            if (iCounter % 2 == 0) {
                try {
                    eval('document.all.Proj' + LineArray[i] + '.style.backgroundColor = "#f7eed8"');
                    eval('document.all.ProjDtl' + LineArray[i] + '.style.backgroundColor = "#f7eed8"');
                    eval('document.all.Notes' + LineArray[i] + '.style.backgroundColor = "#f7eed8"');
                } catch (e) { }
            }
            else {
                try {
                    eval('document.all.Proj' + LineArray[i] + '.style.backgroundColor = ""');
                    eval('document.all.ProjDtl' + LineArray[i] + '.style.backgroundColor = ""');
                    eval('document.all.Notes' + LineArray[i] + '.style.backgroundColor = ""');
                } catch (e) { }
            }
            iCounter++;
        }//end if
    }//end for
}

function NodeLink(NodeID) {
    
    clickedObject = eval('mItem' + NodeID);

    if (clickedObject && clickedObject.IsShow) {
        if (SelNodeID == NodeID && (highlightColor == 2 || highlightColor == 3)) {

            //eval('document.all.Proj' + SelNodeID + '.children[0].style.backgroundColor = ""'); //#: actual
            //eval('document.all.Proj' + SelNodeID + '.all["JobTitle"].style.color = ""'); //#: actual
            //eval('document.all.Proj' + SelNodeID + '.all["arrowLeft"].style.visibility = "hidden"'); //#: actual
            //eval('document.all.Proj' + SelNodeID + '.all["arrowRight"].style.visibility = "hidden"');//#: actual

            $('#Proj' + SelNodeID).children().eq(0).css('background-color', '');    //#: change
            $('#Proj' + SelNodeID).find('#JobTitle').css('color', '');              //#: change
            $('#Proj' + SelNodeID).find('#arrowLeft').css('visibility', 'hidden');  //#: change
            $('#Proj' + SelNodeID).find('#arrowRight').css('visibility', 'hidden'); //#: change
        }

        document.all.Proj0.style.display = "none";
        eval('document.all.Proj' + NodeID + '.style.display = "none"');
        eval('document.all.ProjDtl' + NodeID + '.style.display = "none"');

        clickedObject.IsShow = false;
        clickedObject.blur();
        try {
            // Turn off Notes
            eval('document.all.Notes' + NodeID + '.style.display = "none"');
        }
        catch (e) { }
    }//end if
    else {
        if (SelNodeID > 0 && (highlightColor == 2 || highlightColor == 3)) {

            //eval('document.all.Proj' + SelNodeID + '.children[0].style.backgroundColor = ""');             //#: actual 
            //eval('document.all.Proj' + SelNodeID + '.all["JobTitle"].style.color = ""');                   //#: actual
            //eval('document.all.Proj' + SelNodeID + '.all["arrowLeft"].style.visibility = "hidden"');       //#: actual
            //eval('document.all.Proj' + SelNodeID + '.all["arrowRight"].style.visibility = "hidden"');      //#: actual

            $('#Proj' + SelNodeID).children().eq(0).css("backgroundColor", "");      //#: changed 
            $('#Proj' + SelNodeID).find('#JobTitle').css("color", "");               //#: changed 
            $('#Proj' + SelNodeID).find('#arrowLeft').css("visibility", "hidden");   //#: changed 
            $('#Proj' + SelNodeID).find('#arrowRight').css("visibility", "hidden");  //#: changed 
        }
        try {
            document.all.Proj0.style.display = "none";
            showJob(NodeID);

            if (highlightColor == 2 || highlightColor == 3) {
                if (highlightColor == 2)
                    eval('document.all.Proj' + NodeID + '.children[0].style.backgroundColor = "red"');

                if (highlightColor == 3)
                    eval('document.all.Proj' + NodeID + '.children[0].style.backgroundColor = "#666698"');

                //eval('document.all.Proj' + NodeID + '.all["JobTitle"].style.color = "white"'); //#: actual
                //eval('document.all.Proj' + NodeID + '.all["arrowLeft"].style.visibility = ""'); //#: actual
                //eval('document.all.Proj' + NodeID + '.all["arrowRight"].style.visibility = ""'); //#: actual

                $('#Proj' + NodeID).find('#JobTitle').css("color", "white"); //#: changed 
                $('#Proj' + NodeID).find('#arrowLeft').css("visibility", ""); //#: changed
                $('#Proj' + NodeID).find('#arrowRight').css("visibility", ""); //#: changed
            }

            SelNodeID = NodeID;
            clickedObject.IsShow = true;
            clickedObject.focus();
            try {
                if (document.getElementById('txtDC' + NodeID + '-1'))
                    ShowActivity(NodeID);
            }
            catch (e) {
                //Ignore
            }

            if (document.all['timeSection'])
                document.all['timeSection'].scrollTop = document.all['Proj' + NodeID].offsetTop - 30;
            else
                document.body.scrollTop = document.all['Proj' + NodeID].offsetTop - document.body.clientHeight + 600;
        }//end try
        catch (e) {            
            SelNodeID = 0;
            // document.all.Proj0.style.display = "inline"; //#: actual style 
            document.all.Proj0.style.display = "table-row"; //#: changed style

            var thisNoEntry = '<STRONG><I>No Time Entry available for Project:</I> ' + clickedObject.text + '</STRONG>';
            thisProj0.innerHTML = thisNoEntry;

            if (document.all['timeSection'])
                document.all['timeSection'].scrollTop = 0;
            else
                document.body.scrollTop = 0;

            clickedObject = null;
        }//end catch
    }
}

function showJob(NodeID) {
    if (!document.all['Proj' + NodeID])
        renderJob(NodeID);

    //eval('document.all.Proj' + NodeID + '.style.display = "inline"'); //#: actual
    //eval('document.all.ProjDtl' + NodeID + '.style.display = "inline"'); //#: actual

    $('#Proj' + NodeID).css('display', 'table-row'); //#: change
    $('#ProjDtl' + NodeID).css('display', 'table-row'); //#: change

    sizeFixedHeadings();
}

function renderJob(NodeID) {    
    var ProjHTML = ProjDefs[NodeID];
    var startAt = 0;

    while (ProjHTML.indexOf('[', startAt) >= 0) {
        var startAt = ProjHTML.indexOf('[', startAt);
        var chunkID = ProjHTML.substring(startAt + 1, ProjHTML.indexOf(']', startAt + 1));
        ProjHTML = ProjHTML.substr(0, startAt) + ChunkDefs[chunkID] + ProjHTML.substr(ProjHTML.indexOf(']', startAt + 1) + 1);
        startAt = startAt + ChunkDefs[chunkID].length;
    }

    document.all['tempDiv'].innerHTML = '<TABLE>' + ProjHTML + '</TABLE>';
    var tempRows = document.all['tempDiv'].childNodes[0].childNodes[0];

    while (tempRows.childNodes.length > 0)
        document.all['timeTable'].childNodes[0].appendChild(tempRows.childNodes[0]);

    document.all['tempDiv'].innerHTML = '';

    hackMe = new Array();
    var allImages = document.all['timeSection'].getElementsByTagName('IMG');
    for (var i = 0; i < allImages.length; i++)
        if (allImages[i].fakeSrc > '')
            hackMe[hackMe.length] = allImages[i];

    if (hackMe.length > 0)
        setTimeout('hackImages()', 1);
}

function hackImages() {
    for (var i = 0; i < hackMe.length; i++) {
        if (hackMe[i].fakeSrc > '') {
            hackMe[i].src = hackMe[i].fakeSrc;
            hackMe[i].fakeSrc = '';
        }
    }
}

// Search Tree Logic

function ShowHideTime(NoneFlag) {    
   
    var allTime = document.getElementsByName('timeRow');  // #: Seems not useful
    HiArray = new Array();
    var frmj = document.thisF;
    if (frmj.chkST.checked) {
        NoneFlag = "";
        var StatusMessage = 'Showing All Time';
    }
    else {
        NoneFlag = "none";
        var StatusMessage = 'Hiding All Time';
    }


    window.status = StatusMessage;
    if (NoneFlag == "") { IsShowAll = true; }
    if (NoneFlag == "none") { IsShowAll = false; }

    if (!IsShowAll && SelNodeID > 0 && (highlightColor == 2 || highlightColor == 3)) {
       // eval('document.all.Proj' + SelNodeID + '.children[0].style.backgroundColor = ""'); //#: actual
       // eval('document.all.Proj' + SelNodeID + '.all["JobTitle"].style.color = ""');  //#: actual

        $('#Proj' + SelNodeID).children().eq(0).css('background-color', '');    //#: change
        $('#Proj' + SelNodeID).find('#JobTitle').css('color', '');              //#: change
        
        /*
        //#: actual
        // CDJ 02/25/03
        if (document.all["Proj" + SelNodeID].all["arrowLeft"]) {
            document.all["Proj" + SelNodeID].all["arrowLeft"].style.visibility = "hidden";
        }
        if (document.all["Proj" + SelNodeID].all["arrowRight"]) {
            document.all["Proj" + SelNodeID].all["arrowRight"].style.visibility = "hidden";
        }
        */
        //#: change
        $('#Proj'+ SelNodeID).find('#arrowLeft').css('visibility','hidden');
        $('#Proj'+ SelNodeID).find('#arrowRight').css('visibility','hidden');
    }
        
   // var allTime = document.getElementsByName('timeRow'); //#: actual 
      var allTime = $("[id='timeRow']");                   //#: change
    for (var i = 0; i < allTime.length; i++) {
        Row = allTime[i].value;
        NodeID = frmj.elements['hJC' + Row].value;

        while (frmj.elements['hJC' + Row] && frmj.elements['hJC' + Row].value == NodeID) {
            var ty = "RType" + Row;
            var Type = frmj.elements[ty].value;
            thisTotal = frmj.elements['CT' + Type + Row + 't' + totalCol].value;
            eval('thisItem = (window.mItem' + NodeID + ' ? window.mItem' + NodeID + ' : null)');

            if (thisTotal > 0 && NoneFlag == 'none' && window.thisItem && thisItem.IsShow) {

                document.getElementById(thisItem.id + '-anchor').onclick();
                break;
            }

            if (thisTotal > 0 && NoneFlag == '' && (!window.thisItem || !thisItem.IsShow)) {
                if (!thisItem) {
                    if (!eval('window.mItem' + NodeID)) {
                        eval(mCode['m' + NodeID]);
                        mCode['m' + NodeID] = null;
                    }

                    eval('thisItem = window.mItem' + NodeID);
                }

                thisItem.expandParents();
                document.getElementById(thisItem.id + '-anchor').onclick();
                break;
            }
            Row++;
        }
    }
    window.status = '';
}

function SearchTheTree() {
    var thisS = document.thisF.txtTSearch.value;
    IsFound = 0;
    window.status = 'Searching Tree ';
    if (thisS.length) mTree.SearchTree(thisS.toUpperCase());

    if (IsFound) {
        alert(thisS + ' found ' + IsFound + ' time(s).');

    } else
        alert(thisS + ' not found.');

    window.status = '';
}

TreeObject.prototype.SearchTree = function (thisS) {
    var i = 0;
    for (mKey in mCode) {
        if (mCode[mKey] && mCode[mKey].toUpperCase().indexOf(thisS) >= 0) {
            eval(mCode[mKey]);
            mCode[mKey] = null;
            if (((++i) / 16) == 0) window.status += '.'
        }
    }

    for (var i = 0; i < this._nodes.length; i++)
        this._nodes[i].SearchTree(thisS)
}

TreeObjectItem.prototype.SearchTree = function (thisS) {
    var thisUpper = this.text.toUpperCase();
    thisUpper = thisUpper.replace('&NBSP;', ' ');
    var i = thisUpper.indexOf(thisS);

    if (i >= 0) {
        this.expandParents();

        IsFound += 1;
        document.getElementById(this.id + '-anchor').style.color = 'red';

        if (IsFound == 1) {
            if (!this.IsShow)
                document.getElementById(this.id + '-anchor').onclick();

            if (document.all['divTree'].style.overflowY == 'auto')
                document.all['divTree'].scrollTop = document.getElementById(this.id + '-anchor').parentNode.offsetTop - 120;
        }

        window.status += '.'
    }
    else if (this.parent.isRendered && !this.IsShow)
        document.getElementById(this.id + '-anchor').style.color = '';

    for (var i = 0; i < this._nodes.length; i++)
        this._nodes[i].SearchTree(thisS)
}

TreeObjectItem.prototype.expandParents = function () {
    if (this.parent && this.parent.id != 'xTree-0')
        this.parent.expandParents();
    this.expand();
}

var errorlog = function (e) {
    console.log(e);
};