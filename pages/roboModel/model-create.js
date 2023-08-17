import {URL_SERVER_LOCAL } from '../../js/const.js';
import {getInfoUser } from './roboModel.js';
var accessToken = localStorage.getItem("accessToken");
var form = $("#formCreateModel");

form.onsubmit = function(e){
    e.preventDefault();
}

startup();
function startup(){
    
    var isLogged = localStorage.getItem('isLogged');
    if(isLogged == null || isLogged == 0){
        window.location.href = "../404.html"
    }
    
}
