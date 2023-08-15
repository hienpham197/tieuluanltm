$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    var currentPage = 0;
    var itemsPerPage = 10;
    var totalPages = 3;

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
        var paginationContainer = $(".pagination");
        paginationContainer.empty();

        var previousButton = $("<li class='page-item' id='previous-page'>")
            .append($("<a class='page-link' href='#' tabindex='-1'>").text("Previous"));

        if (currentPage === 0) {
            previousButton.addClass("disabled");
        } else {
            previousButton.on("click", function () {
                currentPage--;
                updatePageState();
                fetchDataAndUpdateTable();
            });
        }

        paginationContainer.append(previousButton);

        for (var i = 1; i <= totalPages; i++) {
            var pageButton = $("<li class='page-item'>")
                .append($("<a class='page-link' href='#'>").text(i));

            if (i === currentPage + 1) {
                pageButton.addClass("active");
            }

            pageButton.on("click", function () {
                currentPage = parseInt($(this).text()) - 1;
                updatePageState();
                fetchDataAndUpdateTable();
            });

            paginationContainer.append(pageButton);
        }

        var nextButton = $("<li class='page-item' id='next-page'>")
            .append($("<a class='page-link' href='#'>").text("Next"));

        if (currentPage === totalPages - 1) {
            nextButton.addClass("disabled");
        } else {
            nextButton.on("click", function () {
                currentPage++;
                updatePageState();
                fetchDataAndUpdateTable();
            });
        }

        paginationContainer.append(nextButton);
    }

    function updatePageState() {
        history.pushState(null, null, "?page=" + (currentPage + 1));
    }
    
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