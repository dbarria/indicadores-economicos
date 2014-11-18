var indexGenerator = {
   queries:[
    {name : "UF", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "DOLAR", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "EURO", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/euro?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "UTM", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/utm?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
    {name : "IPC", request: 'http://api.sbif.cl/api-sbifv3/recursos_api/ipc?apikey=eab15edac5eae38bc464eeac2b09a916da42b447&formato=xml'},
   ],

  createBaseElements: function(){
    for(var i=0;i<this.queries.length;i++){
      name=this.queries[i].name
      tr=document.createElement('tr');
      tr.setAttribute("id",name)
      tr.innerHTML="<td>" + name + "</td><td>:</td><td id=\""+ name+"_value\"> <img src=\"ajax-loader.gif\"></img></td><td id=\""+ name+"_button_td\"><button>Copiar</button><span style=\"display:none;\">¡Copiado!</span></td>"
      document.getElementById("indicadores-table").appendChild(tr);
    }    
  },

  requestAll: function() {

    var req;
    
    this.createBaseElements();

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
  setValues: function(valor, fecha, index){
    //console.log(index);
    tr=document.getElementById(index+"_value");
    tr.innerHTML = valor

    button_td=document.getElementById(index+"_button_td");
    button=button_td.firstChild
    button.setAttribute('value', valor)

    button.addEventListener('click',function(e){
      this.copyCopy(e.target);
    }.bind(this),false);
    if (index=="UF"){
      document.getElementById("date").innerHTML=fecha 
    }    

  },
  showIndexes: function (e) {
    valor=e.target.responseXML.querySelectorAll('Valor')[0].textContent
    fecha=e.target.responseXML.querySelectorAll('Fecha')[0].textContent
    fecha=fecha.split('-');
    fecha=fecha[2] + "/" + fecha[1] + "/" + fecha[0]
    
    var index=this.indexName
    var_asd="" + index
    var obj = {}
    obj[index]=valor
    chrome.storage.local.set(obj)
    this.callerObject.setValues(valor, fecha, index)
    
  },
  requestFromLocalAll: function(last_date_updated){
      this.createBaseElements();
      var strings=[]
      fecha=last_date_updated
      

      for(var i=0;i<this.queries.length;i++){
        index=this.queries[i].name
        strings.push(index)                
      }
      chrome.storage.local.get(strings, function(result){
        for(var key in result) {
          valor= result[key];
          this.setValues(valor, fecha, key)
        }        
      }.bind(this))       

  },
  checkStorage: function(){
    chrome.storage.local.get("last_date_updated", function(result){
      last_date_updated=result.last_date_updated  

      d= new Date();
      current_date=d.getDay()  + "-"+ d.getMonth() + "-" + d.getFullYear();

      if (last_date_updated && last_date_updated==current_date){
        //console.log("local")
        this.requestFromLocalAll(last_date_updated);

      }else{
        //console.log("remote")
        chrome.storage.local.set( {"last_date_updated" : current_date} )
        this.requestAll();
      }

    }.bind(this))
  }

};

document.addEventListener('DOMContentLoaded', function () {
    indexGenerator.checkStorage();
});
