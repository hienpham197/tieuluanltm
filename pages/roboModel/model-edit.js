import {URL_SERVER_LOCAL} from '../../js/const.js';
import {getInfoUser } from './roboModel.js';


const url = new URL(window.location.href);
var paramID = url.searchParams.get("id");
var accessToken = localStorage.getItem("accessToken");
var btnUpdate = $("#model_detail-update");
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

                if(data.pathImage != null){
                    $(".model_edit-image").attr("src", data.pathImage)
                }

                $(".model_edit-modelID").val(data.modelID)
                $(".model_edit-name").val(data.name)
                $(".model_edit-typename").val(data.typeName)
                
            }
        },
        error: function(jqXHR, textStatus, errorTh){

        }

    })
}