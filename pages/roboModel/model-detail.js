import {URL_SERVER_LOCAL, PAGE_SIZE_DEFAULT, PAGE_NUMBER_DEFAULT } from '../../js/const.js';
import {getInfoUser } from './roboModel.js';
export {getInfoModel}

const url = new URL(window.location.href);
var paramID = url.searchParams.get("id");
var accessToken = localStorage.getItem("accessToken");
var btnEdit = $("#model_detail-edit");
var btnDelete = $("#model_detail-delete");

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
            if(data != null){
                $(".model-detail-name").text(data.name)
                $(".model-detail-image").attr("src", data.pathImage)
                $(".model-detail-typename").text(data.typeName)
                if(data.modelID == 0){
                    window.location.href = "../../pages/roboModel/roboModel.html";
                }
            }
           
        },
        error: function(jqXHR, textStatus, errorTh){
        }

    })
}

btnEdit.click(function(e){
    location.href = "./roboModel-edit.html?id="+paramID;
})

btnDelete.click(function(e){

    $.ajax({
        url : URL_SERVER_LOCAL + '/api/RoboModel/Delete/'+ paramID,
        method: "DELETE",
        headers: {"Authorization" : "Bearer " + accessToken},
        success: function(data){
            if(data == 1){
                alert("Delete Success")
                window.location.reload(history.back());
            }
        },
        error: function(jqXHR, textStatus, errorTh){

        }

    })
    console.log("delete");
})