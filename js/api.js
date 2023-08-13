$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        const loginEndpoint = 'https://api.tipslife.site/api/User/Login';
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
                    window.location.href = 'user.html';
                } else if (xhr.status === 401) {
                    window.location.href = 'index.html';
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
            }
        });
    });

    $.ajax({
        url: "https://api.tipslife.site/api/User/GetListUser",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        success: function (users) {
            console.log("API response:", users);
            if (users.length > 0) {
                var firstUser = users[0];
                var userName = firstUser.userName;
                localStorage.setItem("userName", userName);
            } else {
                console.log("No users found in the response.");
            }
            var storedUserName = localStorage.getItem("userName");
            var uNameElement = $("#uName");
            if (uNameElement.length) {
                if (storedUserName) {
                    uNameElement.text(storedUserName);
                } else {
                    console.log("No stored userName found.");
                }
            } else {
                console.error("#uName element not found.");
            }

            var userTableBody = $("#user-table-body");
            if (!userTableBody.length) {
                console.error("#user-table-body element not found.");
                return;
            }
            userTableBody.empty();
            $.each(users, function (index, user) {
                var row = $("<tr>");
                row.append($("<th scope='row'>").text(user.userID));
                row.append($("<td>").text(user.userName));
                row.append($("<td>").text(user.firstName));
                row.append($("<td>").text(user.lastName));
                row.append($("<td>").text(user.email));
                var plusButton = $("<button>").text("+");
                plusButton.addClass("btn btn-success plus-button");
                row.append($("<td>").append(plusButton));
                var minusButton = $("<button>").text("-");
                minusButton.addClass("btn btn-danger minus-button");
                row.append($("<td>").append(minusButton));

                userTableBody.append(row);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("API request failed:", textStatus, errorThrown);
        }
    });
});