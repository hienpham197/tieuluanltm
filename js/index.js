
const URL_SERVER_LOCAL = "https://api2.tipslife.site/";


//Hande submit form login
$('#loginForm').submit(function (event) {
    event.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    const loginEndpoint = URL_SERVER_LOCAL + 'api/User/Login';
    const loginData = {
        email: email,
        password: password
    };
    $.ajax({
        type: 'POST',
        url: loginEndpoint,
        data: JSON.stringify(loginData),
        contentType: 'application/json',
        dataType: 'json',
        success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
                let accessToken;
                if (response.access_token) {
                    accessToken = response.access_token;
                } else if (response.data && response.data.access_token) {
                    accessToken = response.data.access_token;
                } else {
                    console.error('Access token not found in the response.');
                    return;
                }
                console.log('Access Token:', accessToken);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem("isLogged", 1);
                //window.location.href = '/tieuluanltm/pages/users/user.html';
                //Handle redirect after successful login
                handleRedirect(response);

            } else if (xhr.status === 401) {
                window.location.href = 'tieuluanltm/';
            } else {
                $('#loginStatus').text('Login failed. Please check your credentials.');
                console.log('Login failed. Status code:', xhr.status);
            }
            setTimeout(function () {
                $('#loginStatus').hide();
            }, 5000);
        },
        error: function (xhr, textStatus, errorThrown) {
            $('#loginStatus').text('An error occurred during login. Please try again later.');
            console.error('An error occurred during login. Status code:', xhr.status);
            setTimeout(function () {
                $('#loginStatus').hide();
            }, 5000);

            localStorage.setItem("isLogged", 0);
        }
    });
});


//Handle register 
$("#regForm").submit(function (event) {
    event.preventDefault();

    const userName = $("input[name='userName']").val();
    const email = $("input[name='email']").val();
    const password = $("input[name='password']").val();

    const formData = {
        userName: userName,
        email: email,
        password: password
    };

    const formDataString = JSON.stringify(formData);
    $.ajax({
        type: "POST",
        url: URL_SERVER_LOCAL + 'api/User/Register',
        data: formDataString,
        contentType: "application/json",
        success: function (response) {
            console.log("Registration successful:", response);
            $(".notice").text("Registration successful! You can now log in.");
            $(".notice").addClass("success");
        },
        error: function (error) {
            console.error("Registration failed:", error);
            $(".notice").text("Registration failed. Please try again later.");
            $(".notice").addClass("error");
        }
    });
});


// Handle handleRedirect
function handleRedirect(response) {

    console.log(response);
    if (response != null){

        var apiUrl = URL_SERVER_LOCAL + "api/User/GetListRoleName";

        $.ajax({
            url: apiUrl,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + response.access_token
            },
            success: function (data) {
                if(data.length > 0){
                    var isAdmin = data.indexOf("Admin") !== -1 ? 1 : 0; 

                    if(isAdmin == 1){
                        window.location.href = "../tieuluanltm/pages/users/user.html"
                    }else{
                        window.location.href = "../tieuluanltm/pages/roboModel/roboModel.html";
                    }
                    localStorage.setItem("isAdmin", isAdmin);
                }               
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("API request failed:", textStatus, errorThrown);
            }
        });
    }
}