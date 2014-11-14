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
      tr.innerHTML="<td>" + name + "</td><td>:</td><td id=\""+ name+"_value\"> <img src=\"ajax-loader.gif\"></img></td><td id=\""+ name+"_button_td\"><button>Copiar</button><span style=\"display:none;\">¡Copiado!</span></td>"
      document.getElementById("indicadores-table").appendChild(tr);
    }

    for(var i=0;i<this.queries.length;i++){
      name=this.queries[i].name
      req = new XMLHttpRequest();
      req.open("GET", this.queries[i].request, true);
      req.indexName=name
      req.callerObject=this
      req.onload = this.showIndexes.bind(req);
      req.send(null);    

    }
  },
  copyTextToClipboard: function(text){
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);

  },

  copyCopy: function(button){
      this.copyTextToClipboard(button.getAttribute('value').replace(".", ""))
      button.style.display="none";
      button.parentNode.lastChild.style.display="block"
      setTimeout(function(){
        button.parentNode.lastChild.style.display="none"
        button.style.display="block";
      }.bind(this), 1000);

  },
  showIndexes: function (e) {

    valor=e.target.responseXML.querySelectorAll('Valor')[0].textContent
    fecha=e.target.responseXML.querySelectorAll('Fecha')[0].textContent


    tr=document.getElementById(this.indexName+"_value");
    tr.innerHTML = valor

    button_td=document.getElementById(this.indexName+"_button_td");
    button=button_td.firstChild
    button.setAttribute('value', valor)


    button.addEventListener('click',function(e){
      this.callerObject.copyCopy(e.target);
    }.bind(this),false);

    if (this.indexName=="UF"){
      fecha=e.target.responseXML.querySelectorAll('Fecha')[0].textContent
      fecha=fecha.split('-');
      fecha=fecha[2] + "/" + fecha[1] + "/" + fecha[0]
      document.getElementById("date").innerHTML=fecha 
    }
  },

};

document.addEventListener('DOMContentLoaded', function () {
    indexGenerator.requestAll();
});
