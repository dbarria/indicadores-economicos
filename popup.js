// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'kittens';

var indexGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
   queries:[
    {name : "UF", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "DOLAR", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "EURO", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/euro?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "UTM", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/utm?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "IPC", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/ipc?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
   ],
  
  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showIndexs' method.
   *
   * @public
   */
  requestAll: function() {

    // var reqDOLAR = new XMLHttpRequest();
    // reqDOLAR.open("GET", this.queries.DOLAR, true);
    // reqDOLAR.send(null);

    var req;
    var loadedRequests=[]
    for(var i=0;i<this.queries.length;i++){
      req = new XMLHttpRequest();
      //false sync, true async
      req.open("GET", this.queries[i].request, false);
      req.indexName=this.queries[i].name
      req.onload = this.showIndexes.bind(req);
      req.send(null);    
      loadedRequests.push(req) 
    }
    fecha=req.responseXML.querySelectorAll('Fecha')[0].textContent
    document.getElementById("date").innerHTML=fecha

    // reqUF = new XMLHttpRequest();
    // reqUF.open("GET", this.queries[this.queries.length].request, true);
    // loadedRequests.push(reqUF) 
    // reqUF.onload = this.showIndexs.bind(loadedRequests);
    // reqUF.send(null);
  },



  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestAll', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showIndexes: function (e) {

    valor=e.target.responseXML.querySelectorAll('Valor')[0].textContent
    fecha=e.target.responseXML.querySelectorAll('Fecha')[0].textContent

    content=document.createElement('div');
    content.innerHTML="<h2> " + this.indexName+ ": " + valor + "</h2>"

    document.getElementById("indicadores").appendChild(content);

    //var kittens = e.target.responseXML.querySelectorAll('photo');
    // for (var i = 0; i < kittens.length; i++) {
    //   var img = document.createElement('img');
    //   img.src = this.constructKittenURL_(kittens[i]);
    //   img.setAttribute('alt', kittens[i].getAttribute('title'));
    //   document.body.appendChild(img);
    // }
  },

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  indexGenerator.requestAll();
});
