import {URL_SERVER_LOCAL, PAGE_SIZE_DEFAULT, PAGE_NUMBER_DEFAULT, URL_CLIENT_LOCAL } from '../../js/const.js';
import {getInfoUser}  from '../roboModel/roboModel.js';

var btnEdit = $("#user_btn-edit");
var btnSave = $("#user_btn-save");
var btnCancel = $("#user_btn-cancel");
var accessToken = localStorage.getItem("accessToken");
var inputPW = $("input[name='password']");
var chkPW = $("#chkPW");


startUp();

function startUp() {
    getInfoUser();
    setTimeout(() =>loadDefaultForm(),1000);
}


function loadDefaultForm(){
    btnSave.hide();
    btnCancel.hide();
    btnEdit.show();

    var infoUser = localStorage.getItem("infoUser");
    if (infoUser != null) {
      var user = JSON.parse(infoUser);
      $(".user-name").text(user.userName);

      $("#userID").val(user.userID);
      $("input[name='userName']").val(user.userName);
      $("input[name='firstName']").val(user.firstName);
      $("input[name='lastName']").val(user.lastName);
      $("input[name='email']").val(user.email);
      $("input[name='password']").val(user.password);
      
      $("input[name='userName']").prop( "disabled", true );
      $("input[name='firstName']").prop( "disabled", true );
      $("input[name='lastName']").prop( "disabled", true );
      $("input[name='email']").prop( "disabled", true );
      $("input[name='password']").prop( "disabled", true );

    }

}
btnEdit.click(function (){
    btnSave.show();
    btnCancel.show();
    btnEdit.hide();

    $("input[name='userName']").prop( "disabled", false );
    $("input[name='firstName']").prop( "disabled", false );
    $("input[name='lastName']").prop( "disabled", false );
    $("input[name='password']").prop( "disabled", false );
})

btnCancel.click(()=>loadDefaultForm());
btnSave.click(()=>updateProfile());

function updateProfile(){

    var data = {
        userID: parseInt($("#userID").val()),
        userName : $("input[name='userName']").val(),
        firstName: $("input[name='firstName']").val(),
        lastName: $("input[name='lastName']").val(),
        password: $("input[name='password']").val(),
      }

    $.ajax({
        url : URL_SERVER_LOCAL + '/api/User/Update/',
        method: "PUT",
        headers: {"Authorization" : "Bearer " + accessToken},
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            if(data == 1){
                alert("Update Success")          
                window.location.reload();               
            }
        },
        error: function(jqXHR, textStatus, errorTh){

        }

    })
}


chkPW.click(()=>showPassword());

function showPassword(){
    console.log('s');
    if (inputPW.attr("type") === "password") {
        inputPW.attr("type","text")
    } else {
        inputPW.attr("type","password");
    }
}