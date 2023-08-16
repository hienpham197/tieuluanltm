import {URL_SERVER_LOCAL, PAGE_SIZE_DEFAULT, PAGE_NUMBER_DEFAULT } from '../../js/const.js';
import {getInfoUser } from './roboModel.js';


const url = new URL(window.location.href);
var paramID = url.searchParams.get("id");
var accessToken = localStorage.getItem("accessToken");

Start();

function Start(){
    var isLogged = localStorage.getItem('isLogged');
    if(isLogged == 0){
        window.location.href = "../404.html"
    }

    getInfoModel();
}

function getInfoModel(){

    $.ajax({
        url : URL_SERVER_LOCAL + '/api/RoboModel/Details/'+ paramID,
        method: "GET",
        headers: {"Authorization" : "Bearer " + accessToken},
        success: function(data){
            //console.log(data);
            if(data != null){

                console.log(data);
                $(".model-detail-name").text(data.name)
                $(".model-detail-image").attr("src", data.pathImage)
                $(".model-detail-typename").text(data.typeName)
                
            }
        },
        error: function(jqXHR, textStatus, errorTh){

        }

    })
}