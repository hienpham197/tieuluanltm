$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    $("#regForm").submit(function(event) {
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
            url: "https://api2.tipslife.site/api/User/Register",
            data: formDataString,
            contentType: "application/json",
            success: function(response) {
                console.log("Registration successful:", response);
                $(".notice").text("Registration successful! You can now log in.");
                $(".notice").addClass("success");
            },
            error: function(error) {
                console.error("Registration failed:", error);
                $(".notice").text("Registration failed. Please try again later.");
                $(".notice").addClass("error");
            }
        });
    });

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

            var editButton = $("<button>").text("+");
            editButton.addClass("btn btn-primary edit-button");
            editButton.data("user-id", user.userID);
            row.append($("<td>").append(editButton));

            var deleteButton = $("<button>").text("-");
            deleteButton.addClass("btn btn-danger delete-button");
            deleteButton.data("user-id", user.userID);
            row.append($("<td>").append(deleteButton));

            userTableBody.append(row);
        });
    }
    //  Delete ///////////////////////////////////////////
    $(document).on("click", ".delete-button", function () {
        var userId = $(this).data("user-id");
        if (confirm("Are you sure you want to delete this user?")) {
            $.ajax({
                url: "https://api2.tipslife.site/api/User/Delete/" + userId,
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                success: function () {
                    fetchDataAndUpdateTable();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Delete request failed:", textStatus, errorThrown);
                }
            });
        }
    });

    // Edit //////////////////////////////////////////////////

    $(document).on("click", ".edit-button", function () {
        var userId = $(this).data("user-id");
        var row = $(this).closest("tr");

        var userNameInput = $("<input>").val(row.find("td:eq(0)").text());
        var firstNameInput = $("<input>").val(row.find("td:eq(1)").text());
        var lastNameInput = $("<input>").val(row.find("td:eq(2)").text());
        var emailInput = $("<input>").val(row.find("td:eq(3)").text());

        row.find("td:eq(0)").html(userNameInput);
        row.find("td:eq(1)").html(firstNameInput);
        row.find("td:eq(2)").html(lastNameInput);
        row.find("td:eq(3)").html(emailInput);

        var saveButton = $("<button>").text("Save");
        saveButton.addClass("btn btn-success save-button");
        row.find("td:eq(4)").html(saveButton);

        var cancelButton = $("<button>").text("Cancel");
        cancelButton.addClass("btn btn-secondary cancel-button");
        row.find("td:eq(5)").html(cancelButton);
    });

    $(document).on("click", ".save-button", function () {
        var userId = $(this).closest("tr").find(".edit-button").data("user-id");
        var userName = $(this).closest("tr").find("input:eq(0)").val();
        var firstName = $(this).closest("tr").find("input:eq(1)").val();
        var lastName = $(this).closest("tr").find("input:eq(2)").val();
        var email = $(this).closest("tr").find("input:eq(3)").val();

        var userData = {
            userID: userId,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email
        };

        $.ajax({
            url: "https://api2.tipslife.site/api/User/Update/" + userId,
            method: "PUT",
            data: JSON.stringify(userData),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function () {
                fetchDataAndUpdateTable();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Update request failed:", textStatus, errorThrown);
            }
        });
    });

    $(document).on("click", ".cancel-button", function () {
        fetchDataAndUpdateTable();
    });

    // Add user ///////////////////////////////////////

    $("#add-user-button").on("click", function () {
        var newUser = {
            // userID: null,
            userName: "",
            firstName: "",
            lastName: "",
            email: ""
        };

        var row = $("<tr>");
        row.append($("<th scope='row'>").text(""));
        row.append($("<td>").append($("<input>").val(newUser.userName).addClass("new-user-input")));
        row.append($("<td>").append($("<input>").val(newUser.firstName).addClass("new-user-input")));
        row.append($("<td>").append($("<input>").val(newUser.lastName).addClass("new-user-input")));
        row.append($("<td>").append($("<input>").val(newUser.email).addClass("new-user-input")));

        var saveButton = $("<button>").text("Save");
        saveButton.addClass("btn btn-success save-new-button");
        row.append($("<td>").append(saveButton));

        var cancelButton = $("<button>").text("Cancel");
        cancelButton.addClass("btn btn-secondary cancel-new-button");
        row.append($("<td>").append(cancelButton));

        $("#user-table-body").prepend(row);
    });


    $(document).on("click", ".save-new-button", function () {
        var row = $(this).closest("tr");
        var userName = row.find(".new-user-input:eq(0)").val();
        var firstName = row.find(".new-user-input:eq(1)").val();
        var lastName = row.find(".new-user-input:eq(2)").val();
        var email = row.find(".new-user-input:eq(3)").val();

        var newUser = {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email
        };

        $.ajax({
            url: "https://api2.tipslife.site/api/User/Register",
            method: "POST",
            data: JSON.stringify(newUser),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function () {
                fetchDataAndUpdateTable();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Add new user request failed:", textStatus, errorThrown);
            }
        });
    });

    $(document).on("click", ".cancel-new-button", function () {
        $(this).closest("tr").remove();
    });


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