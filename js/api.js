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

    // $.ajax({
    //     url: "https://api.tipslife.site/api/User/GetListUser",
    //     method: "GET",
    //     headers: {
    //         "Authorization": "Bearer " + accessToken
    //     },
    //     success: function (users) {
    //         console.log("API response:", users);
    //         if (users.length > 0) {
    //             var firstUser = users[0];
    //             var userName = firstUser.userName;
    //             localStorage.setItem("userName", userName);
    //         } else {
    //             console.log("No users found in the response.");
    //         }
    //         var storedUserName = localStorage.getItem("userName");
    //         var uNameElement = $("#uName");
    //         if (uNameElement.length) {
    //             if (storedUserName) {
    //                 uNameElement.text(storedUserName);
    //             } else {
    //                 console.log("No stored userName found.");
    //             }
    //         } else {
    //             console.error("#uName element not found.");
    //         }

    //         var userTableBody = $("#user-table-body");
    //         if (!userTableBody.length) {
    //             console.error("#user-table-body element not found.");
    //             return;
    //         }
    //         userTableBody.empty();
    //         $.each(users, function (index, user) {
    //             var row = $("<tr>");
    //             row.append($("<th scope='row'>").text(user.userID));
    //             row.append($("<td>").text(user.userName));
    //             row.append($("<td>").text(user.firstName));
    //             row.append($("<td>").text(user.lastName));
    //             row.append($("<td>").text(user.email));
    //             var plusButton = $("<button>").text("+");
    //             plusButton.addClass("btn btn-success plus-button");
    //             row.append($("<td>").append(plusButton));
    //             var minusButton = $("<button>").text("-");
    //             minusButton.addClass("btn btn-danger minus-button");
    //             row.append($("<td>").append(minusButton));

    //             userTableBody.append(row);
    //         });
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         console.error("API request failed:", textStatus, errorThrown);
    //     }
    // });

    var currentPage = 0;
    var itemsPerPage = 10;

    function displayUsersOnPage(users) {
        var userTableBody = $("#user-table-body");
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
    }

    function updatePaginationButtons(totalPages) {
        var paginationContainer = $("#pagination-container");
        paginationContainer.empty();

        var previousButton = $("<button>").text("Previous");
        previousButton.addClass("btn btn-secondary page-button");
        if (currentPage === 0) { // Adjusted comparison for first page
            previousButton.addClass("disabled");
        } else {
            previousButton.on("click", function () {
                currentPage--;
                fetchDataAndUpdateTable();
            });
        }

        paginationContainer.append(previousButton);

        for (var i = 1; i <= totalPages; i++) {
            var pageButton = $("<button>").text(i);
            pageButton.addClass("btn btn-secondary page-button");
            if (i === currentPage + 1) { // Adjusted comparison with offset
                pageButton.addClass("active");
            }
            pageButton.on("click", function () {
                currentPage = parseInt($(this).text()) - 1; // Adjusted page assignment
                fetchDataAndUpdateTable();
            });
            paginationContainer.append(pageButton);
        }

        var nextButton = $("<button>").text("Next");
        nextButton.addClass("btn btn-secondary page-button");
        if (currentPage === totalPages - 1) { // Adjusted comparison for last page
            nextButton.addClass("disabled");
        } else {
            nextButton.on("click", function () {
                currentPage++;
                fetchDataAndUpdateTable();
            });
        }

        paginationContainer.append(nextButton);
    }
    $("#next-page").on("click", function () {
        currentPage++;
        fetchDataAndUpdateTable();
    });
    
    $("#previous-page").on("click", function () {
        currentPage--;
        fetchDataAndUpdateTable();
    });
    
    $(document).on("click", ".page-button a", function () {
        console.log("Page button clicked");
        currentPage = parseInt($(this).text()) - 1;
        console.log("currentPage:", currentPage);
        fetchDataAndUpdateTable();
    });
    

    function fetchDataAndUpdateTable() {
        var apiUrl = "https://api2.tipslife.site/api/User/GetListUser";
        var pageNumber = currentPage;
        var pageSize = itemsPerPage;

        $.ajax({
            url: apiUrl + "?PageSize=" + pageSize + "&PageNumber=" + pageNumber,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function (response) {
                var users = response;
                displayUsersOnPage(users);
                updatePaginationButtons(response.totalPages);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("API request failed:", textStatus, errorThrown);
            }
        });
    }
    fetchDataAndUpdateTable();

});