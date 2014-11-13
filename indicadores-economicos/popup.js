var indexGenerator = {
   queries:[
    {name : "UF", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "DOLAR", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "EURO", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/euro?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "UTM", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/utm?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "IPC", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/ipc?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
   ],

  requestAll: function() {

    var req;

    for(var i=0;i<this.queries.length;i++){
      name=this.queries[i].name
      tr=document.createElement('tr');
      tr.setAttribute("id",name)
      tr.innerHTML="<td>" + name + "</td><td>:</td><td id=\""+ name+"_value\"> <img src=\"ajax-loader.gif\"></img></td>"
      document.getElementById("indicadores-table").appendChild(tr);
    }

    for(var i=0;i<this.queries.length;i++){
      name=this.queries[i].name
      req = new XMLHttpRequest();
      req.open("GET", this.queries[i].request, true);
      req.indexName=name
      req.onload = this.showIndexes.bind(req);
      req.send(null);    

    }
  },

  showIndexes: function (e) {

    valor=e.target.responseXML.querySelectorAll('Valor')[0].textContent
    fecha=e.target.responseXML.querySelectorAll('Fecha')[0].textContent


    tr=document.getElementById(this.indexName+"_value");
    tr.innerHTML = valor


    fecha=e.target.responseXML.querySelectorAll('Fecha')[0].textContent
    document.getElementById("date").innerHTML=fecha 
  },

};

document.addEventListener('DOMContentLoaded', function () {
    indexGenerator.requestAll();
});
