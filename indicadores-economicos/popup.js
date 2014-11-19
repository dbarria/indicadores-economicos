Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}
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
      tr.innerHTML="<td>" + name + "</td><td>:</td><td id=\""+ name+"_value\"> <img src=\"ajax-loader.gif\"></img></td><td id=\""+ name+"_button_td\"><button>Copiar</button><span class=\"copiado\" style=\"display:none;\">Copiado!</span></td>"
      document.getElementById("indicadores-table").appendChild(tr);
    }    
  },
  numberWithCommas: function(x){
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  },
  createBaseElementsForConversion: function(){
    if (document.getElementById(this.queries[0].name + "_converted_value")==null){
      document.getElementsByTagName("body")[0].style.width="630px";
      document.getElementById("convertir").appendChild(document.createElement('td'));
      document.getElementById("convertir").appendChild(document.createElement('td'));
      var innerHTML;
      for(var i=0;i<this.queries.length;i++){
        name=this.queries[i].name
        td=document.createElement('td');
        td.setAttribute("id",name+"_converted_value")
        document.getElementById(name).appendChild(td);

        td=document.createElement('td');
        td.setAttribute("id",name+"_converted_button")
        td.innerHTML="<button>Copiar</button><span class=\"copiado\" style=\"display:none;\">Copiado!</span>"
        document.getElementById(name).appendChild(td);
        button=document.getElementById(name + "_converted_button")
        button.addEventListener('click',function(e){
          this.copyCopy(e.target);
        }.bind(this),false);

      }
    }    
  },
  calcConversion:function(){
    this.createBaseElementsForConversion();
    document.getElementById("value_to_convert").value=document.getElementById("value_to_convert").value.replace(".", "");
      chrome.storage.local.get(this.arraySavedValues(), function(result){
        var valor;
        var converted_value_element;
        var value_to_convert;
        var operation_result;
        for(var key in result) {
          valor= result[key];
          converted_value_element=document.getElementById(key + "_converted_value")
          
          valor=valor.replace(".", "")
          valor=valor.replace(",", ".")
          value_to_convert=document.getElementById("value_to_convert").value.replace(",",".")
          operation_result=parseFloat(valor) * parseFloat(value_to_convert )
          operation_result=operation_result.round(3)
          operation_result=this.numberWithCommas(operation_result);
          //operation_result=operation_result.toString().replace(".", ",")
          converted_value_element.innerHTML=operation_result
          document.getElementById(key + "_converted_button").firstChild.setAttribute('value', operation_result)
          
         

        }        
      }.bind(this)) 
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
      console.log(button)
      this.copyTextToClipboard(button.getAttribute('value').replace(".", ""))
      button.style.display="none";
      button.parentNode.lastChild.style.display="inline"
      setTimeout(function(){
        button.parentNode.lastChild.style.display="none"
        button.style.display="inline";
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
    if (index=="UF"){
      chrome.storage.local.set( {"last_date_updated" : current_date} )
    }
    this.callerObject.setValues(valor, fecha, index)
    
  },
  arraySavedValues: function(){
    var strings=[]
    for(var i=0;i<this.queries.length;i++){
      index=this.queries[i].name
      strings.push(index)                
    }
    return strings;
  },
  requestFromLocalAll: function(last_date_updated){
      this.createBaseElements();

      fecha=last_date_updated
      
      chrome.storage.local.get(this.arraySavedValues(), function(result){
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
        
        this.requestAll();
      }
      document.getElementById("value_to_convert").addEventListener("keypress", function(){indexGenerator.calcConversion()});
      //document.getElementById("value_to_convert").addEventListener("keyup", function(){indexGenerator.calcConversion()});
    }.bind(this))
  }

};

document.addEventListener('DOMContentLoaded', function () {
    indexGenerator.checkStorage();

});
