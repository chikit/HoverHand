var hoverhand = function () {
    var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

    var gBrowserListener = function () {
        var enable = prefManager.getBoolPref("extensions.hoverhand.enable");
        hoverhand.run();
    };

    var init = function () {
        gBrowser.addEventListener("load", gBrowserListener, true);
    };

    var run = function() {
        var allLinks = getDocument().getElementsByTagName("a");
        for (var i = 0; i < allLinks.length; i++) {
            var elm = allLinks[i];
            if (elm.href !== null && (checkURL(elm.href) || checkType(elm.type))) {
                elm.addEventListener("mouseover", displayImg);
                elm.addEventListener("mouseout", removeImg);
            }
        }
    };

    var getDocument = function() {
        if (content !== null) {
            return content.document;
        }
        else {
            return document;
        }
    };

    var displayImg = function(obj) {
        var size = prefManager.getCharPref("extensions.hoverhand.size");
        var imgDiv = getDocument().createElement("div");
        imgDiv.className = "imgHoverHandDiv";
        this.appendChild(imgDiv);
        var img = getDocument().createElement("img");
        img.style.width = size + "%";
        img.style.height = size + "%";
        img.onload = function() {
            if (this.naturalHeight < 250) {
                this.style.width = this.naturalWidth + "px";
                this.style.height = this.naturalHeight + "px";
            } else if (this.naturalHeight * size/100 > screen.height - 160) {
                var newSize = size;
                while(this.naturalHeight * newSize/100 > screen.height - 160 && newSize > 15) {
                    newSize = newSize / 1.4;
                }
                this.style.width = newSize + "%";
                this.style.height = newSize + "%";
            }
        };
        
        img.src=this.href;
        img.className="imgHoverHand";
        img.style.display = "block";

        imgDiv.style.zIndex = 100;
        imgDiv.style.position = "absolute";
        imgDiv.style.display = "block";
        imgDiv.appendChild(img);

    };

    var removeImg = function(obj) {
        if (this.children !== null) {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].className === "imgHoverHandDiv") {
                    this.removeChild(this.children[i]);
                }
            }
        }
    };

    var checkURL = function(url) {
        return(url.match(/\.(png|jpeg|jpg|gif)$/i) !== null);
    };

    var checkType = function(type) {
        if (type === undefined) {
            return false;
        }

        return(type.match(/^IMAGE/i) !== null);
    };

    var toggle = function() {
        var enable = prefManager.getBoolPref("extensions.hoverhand.enable");
        prefManager.setBoolPref("extensions.hoverhand.enable", !enable);
    };

    return {
        init : init,
        run : run,
        toggle : toggle
    };
}();

window.addEventListener("load", hoverhand.init, false);