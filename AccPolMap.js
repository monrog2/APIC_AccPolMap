// ==UserScript==
// @name        Apic Access Policy Map DEV
// @namespace   Cisco Systems Inc.
// @include     *
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require     https://dl.dropboxusercontent.com/u/4075138/jcanvas.min.js
// @version     1
// @grant       none
// ==/UserScript==

console.log("==========SCRIPT RUNNING==========");

//Check if map is loaded and needs to be updated
//console.log(window.location.href)
//console.log(document.URL)
//console.log(window.location.hash)


if(typeof(Storage) !== "undefined") {
    sessionStorage.URL = document.URL;
} else {
    console.log("Sorry, your browser does not support web storage...");
}

//if ("onhashchange" in window) {
    //alert("The browser supports the hashchange event!");
//} else {
    //alert("This browser will not work with AccPolMap");
//}

//localStorage.setItem("apicURL", document.URL);

//console.log(localStorage.getItem("apicURL"));

function genCoords () {
    var xCoor = 0;
    var yCoor = 0;
    var dir = "none";
    
    console.log("=====GEN COORDS NOW+++++");
    var myDN = location.hash.split("/");
    var lastObj = myDN[myDN.length-1];
    console.log(lastObj);

    if (lastObj.indexOf('nprof') >= 0) {
        console.log("FOUND switch profile");
        xCoor = 105;
        yCoor = 117;
        dir = "right";
    }  else if (lastObj.indexOf('hports') >= 0) {
        console.log("FOUND port selector");
        xCoor = 468;
        yCoor = 171;
        dir = "right";
    } else if (lastObj.indexOf('accportprof') >= 0) {
        console.log("FOUND int profile");
        xCoor = 463;
        yCoor = 116;
        dir = "right";
    } else if (lastObj.indexOf('accportgrp') >= 0) {
        console.log("FOUND pol grp");
        xCoor = 824;
        yCoor = 199;
        dir = "right";
    } else if (lastObj.indexOf('accbundle') >= 0) { 
        console.log("FOUND pol grp bundle");
        xCoor = 824;
        yCoor = 199;
        dir = "right";
    } else if (lastObj.indexOf('attentp') >= 0) {
        xCoor = 973;
        yCoor = 412;
        dir = "left";
    } else if (lastObj.indexOf('phys') >= 0) {
        xCoor = 587;
        yCoor = 412;
        dir = "left";
    } else if (lastObj.indexOf('l3dom') >= 0) {
        xCoor = 587;
        yCoor = 412;
        dir = "left";
    } else if (lastObj.indexOf('l2dom') >= 0) {
        xCoor = 587;
        yCoor = 412;
        dir = "left";
    } else if (lastObj.indexOf('vlanns') >= 0) {
        xCoor = 224;
        yCoor = 381;
        dir = "left";
    }else {
        console.log("Don't care about this one")
    }
    localStorage.setItem("xOne",xCoor);
    localStorage.setItem("yOne",yCoor);
    localStorage.setItem("point", dir);
}

//storage trigger, will be used to update map coordinates based on object DN
window.addEventListener('storage', function(e) {  
    console.log("==========STORAGE EVENT TRIGGERED+++++++");
    updateMap();
});

function updateMap() {
    console.log("==========updating map coords+++++++");
    var finalx1 = Number(localStorage.getItem("xOne"));
    var finaly1 = Number(localStorage.getItem("yOne"));
    var objectIs = localStorage.getItem("point");
    var finalx2 = finalx1;
    var finaly2 = finaly1;

    console.log(objectIs);
    
    if (objectIs == "right"){
        finalx2 = finalx1-30;
    } else if (objectIs == "left") {
        finalx2 = finalx1+30;
    } else if (objectIs == "up") {
        finaly2 = finaly1+30;
    } else if (objectIs == "down") {
        finaly2 = finaly1-30;
    } 
    $('canvas')
    .addLayer({
        type: 'line',
        strokeStyle: '#B70000',
        strokeWidth: 8,
        layer: true,
        name: 'locArrow',
        index: 1,
        rounded: true,
        startArrow: true,
        arrowRadius: 15,
        arrowAngle: 90,
        x1: finalx1, y1: finaly1,
        x2: finalx2, y2: finaly2
    })
    .drawLayers();
    $('canvas').removeLayer('locArrow');
}

function drawMap() {
    //Here we will need to: 1. Pull x,y from localStorage; 2.assign new coords to arrow; 3. redraw with new location  
    if (document.URL.indexOf('AccessPolMap') >= 0) {
        //used to generate canvas in map
        console.log("==================Map Page Detected++++++++++++++++++");
        document.body.innerHTML = "";
        var $canv = $('<canvas/>', {id:'myCanv', style:'border:1px solid'}).prop({width:1200, height:900});
        $canv.appendTo('body');

        $('canvas')
        .addLayer({
            type: 'image',
            source: 'https://dl.dropboxusercontent.com/u/4075138/AccPolMap.PNG',
            x: 0, y: 0,
            layer: true,
            name: 'polMap',
            index: 0,
            width: 1163,
            height: 841,
            fromCenter: false, 
            scale:1
        })
        .drawLayers();
    }}


//on hash change, we will: 1. read the URL; 2. if AccPol, draw map button; 3. run genCoords
function hashChanged() {
    console.log("==================HASH CHANGED!!++++++++++++++++++");

    //here we will 1. read URL; 2. check if we're in AccPol; 3. If so, gen map button 
    if (document.URL.indexOf('#c:d') >= 0) {
        //should catch anything within the access policies tab  
        console.log("==================Access Pols Detected++++++++++++++++++");
        
        //For Access Map button (currently megaman head)
        function genMapButton (jNode) {
            console.log("================MAP ICON PLACED+++++++++");
            jNode.prepend(
                '<div id="tool-2644_GM" class="x-tool x-box-item x-tool-default" style="width: 16px; height: 16px; left: 60px; top: 6px; margin: 0px;">' +
                '<img id="tool-2644-toolEl_GM" class="x-tool-collapse-left" role="presentation" src="https://dl.dropboxusercontent.com/u/4075138/mmh.png" onclick=\'window.open("/AccessPolMap.html")\' data-qtip="Open AccPol Map">' +
                '</div>'
            );
            
            //$(window).trigger('resize');
            //$('#app\\:infra\\:tree_header').hide().show(0);
        }
        waitForKeyElements ("#app\\:infra\\:tree_header-targetEl", genMapButton);
        //location.reload();
        genCoords();
    }
}

window.onhashchange = hashChanged;
drawMap();
hashChanged();