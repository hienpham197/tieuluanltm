$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    // var accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJJZCI6IjIxIiwiZXhwIjoxNjkyMzQ3ODQ1LCJpc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJhdWQiOiJhZG1pbkBnbWFpbC5jb20ifQ.-WsLQ1F2ksQ73laRHuRKP0FhlyiTZN5LBRJkHFI5sZQ";
    var currentPage = 0;
    var itemsPerPage = 10;
    var totalPages = 3;

    // $.ajax({
    //     url: 'https://api2.tipslife.site/api/RoboModel/GetListModel',
    //     type: 'GET',
    //     dataType: 'json',
    //         headers: {
    //             "Authorization": "Bearer " + accessToken
    //         },
    //     success: function(data) {
    //         // Log the API response to the console
    //         console.log(data);
    //     },
    //     error: function(xhr, status, error) {
    //         console.error(error);
    //     }
    // });
    $(document).on("click", ".delete-button", function () {
        var productId = $(this).data("product-id");
        if (confirm("Are you sure you want to delete this product?")) {
            $.ajax({
                url: "https://api2.tipslife.site/api/RoboModel/Delete/" + productId,
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
    
    $(document).on("click", ".edit-button", function () {
        var productId = $(this).data("product-id");
        var row = $(this).closest("tr");

        var modelidInput = $("<input>").val(row.find("td:eq(0)").text()); 
        var imageInput = $("<input>").val(row.find("td:eq(1)").text());
        var nameInput = $("<input>").val(row.find("td:eq(2)").text());
        var typenameInput = $("<input>").val(row.find("td:eq(3)").text());

        row.find("th:eq(0)").html(modelidInput);
        row.find("td:eq(1)").html(imageInput);
        row.find("td:eq(2)").html(nameInput);
        row.find("td:eq(3)").html(typenameInput);

        var saveButton = $("<button>").text("Save");
        saveButton.addClass("btn btn-success save-button");
        row.find("td:eq(6)").html(saveButton);

        var cancelButton = $("<button>").text("Cancel");
        cancelButton.addClass("btn btn-secondary cancel-button");
        row.find("td:eq(7)").html(cancelButton);
    });

    $(document).on("click", ".save-button", function () {
        var modelID = $(this).closest("tr").find(".edit-button").data("product-id");
        var image = $(this).closest("tr").find("input:eq(1)").val();
        var name = $(this).closest("tr").find("input:eq(2)").val();
        var typename = $(this).closest("tr").find("input:eq(3)").val();
        

        var productData = {
            modelID: modelID,
            image: image,
            name: name,
            typename: typename,
        };

        $.ajax({
            url: "https://api2.tipslife.site/api/RoboModel/Update",
            method: "PUT",
            data: JSON.stringify(productData),
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

    $("#add-product-button").on("click", function () {
        var newProduct = {
            // userID: null,
            name: "",
            imgPath: "",
            typeName: "",
            userID: "",
            createdDate: ""
        };

        var row = $("<tr>");
        row.append($("<th scope='row'>").text(""));
        row.append($("<td>").append($("<input>").val(newProduct.imgPath).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.name).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.typeName).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.userID).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.createdDate).addClass("new-product-input")));

        var saveButton = $("<button>").text("Save");
        saveButton.addClass("btn btn-success save-new-button");
        row.append($("<td>").append(saveButton));

        var cancelButton = $("<button>").text("Cancel");
        cancelButton.addClass("btn btn-secondary cancel-new-button");
        row.append($("<td>").append(cancelButton));

        $("#product-table-body").prepend(row);
    });

    $(document).on("click", ".save-new-button", function () {
        var row = $(this).closest("tr");
        var pimg = row.find(".new-product-input:eq(0)").val();
        var  pname= row.find(".new-product-input:eq(1)").val();
        var ptypename = row.find(".new-product-input:eq(2)").val();
        var puserid = row.find(".new-product-input:eq(3)").val();

        var newProduct = {
            name: pname,
            imgPath: pimg,
            typeName: ptypename,
            userID: puserid,
            createdDate: Date()
        };

        $.ajax({
            url: "https://api2.tipslife.site/api/RoboModel/AddModel",
            method: "POST",
            data: JSON.stringify(newProduct),
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

    function displayProductsOnPage(products) {
        var productTableBody = $("#product-table-body");
        productTableBody.empty();
        //var t=1;
        $.each(products, function (index, product) {
            var row = $("<tr>");
            row.append($("<td scope='row'>").text(product.modelID));

            row.append($("<td>").append('<img src="'+product.imgPath+'alt="" class="productImg>"'));            
            row.append($("<td>").text(product.name));
            row.append($("<td>").text(product.typeName));
            row.append($("<td>").text(product.userID));
            row.append($("<td>").text(product.createdDate));
            
            var editButton = $("<button>").text("+");
            editButton.addClass("btn btn-success edit-button");
            editButton.data("product-id",product.modelID);
            row.append($("<td>").append(editButton));

            var deleteButton = $("<button>").text("-");
            deleteButton.addClass("btn btn-danger delete-button");
            deleteButton.data("product-id",product.modelID);
            row.append($("<td>").append(deleteButton));

            productTableBody.append(row);
           
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
        var apiUrl = "https://api2.tipslife.site/api/RoboModel/GetListModel";        
        var pageNumber = currentPage;
        var pageSize = itemsPerPage;

        $.ajax({
            url: apiUrl + "?PageSize=" + pageSize + "&PageNumber=" + pageNumber,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function (response) {
                var products = response.data;
                displayProductsOnPage(products);
                updatePaginationButtons(response.totalPages);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("API request failed:", textStatus, errorThrown);
            }
        });
    }
    fetchDataAndUpdateTable();  
});