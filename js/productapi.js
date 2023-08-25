const URL_SERVER_LOCAL = "https://api2.tipslife.site/";
$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    var currentPage = 0;
    var itemsPerPage = 10;
    var totalPages = 3;

    $("#searchInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#product-table-body tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
      $("#searchInput").on("keyup", function() {
        var searchValue = $(this).val().toLowerCase();
        $("#product-table-body tr").filter(function() {
            var rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(searchValue) > -1);
        });
    });

    $("#sortAscButton").on("click", function() {
        var rows = $("#product-table-body tr").get();
        rows.sort(function(a, b) {
            var aValue = $(a).text().toLowerCase();
            var bValue = $(b).text().toLowerCase();
            return aValue.localeCompare(bValue);
        });
        $("#product-table-body").empty().append(rows);
    });

    $("#sortDescButton").on("click", function() {
        var rows = $("#product-table-body tr").get();
        rows.sort(function(a, b) {
            var aValue = $(a).text().toLowerCase();
            var bValue = $(b).text().toLowerCase();
            return bValue.localeCompare(aValue);
        });
        $("#product-table-body").empty().append(rows);
    });

    $(document).on("click", ".delete-button", function () {
        var productId = $(this).data("productId");
        console.log("usid choice: ", productId);
        $.confirm({
            title: 'Delete product?',
            content: '<span class="translate" data-translation-key="product_text_confirmDel" >The user has been successfully deleted.</span>',
            buttons: {
                deleteUser: {
                    text: 'Yes',
                    btnClass: 'btn btn-danger',
                    action: function () {
                        deleteProduct(productId);
                    }
                },
                cancel: function () {
                }
            }
        });
        $("#selectLang").trigger("change");
    });

    function deleteProduct(productId) {
        $.ajax({
            url: URL_SERVER_LOCAL + `api/RoboModel/Delete/` + productId,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function () {
                updateisDelete(productId);
                $.alert({
                    title: 'Prodcut Deleted',
                    content: '<span class="translate" data-translation-key="product_text_successDel" >The user has been successfully deleted.</span> ',
                    buttons: {
                        ok: {
                            text: 'OK',
                            btnClass: 'btn btn-primary',
                            action: function () {
                                location.reload();
                            }
                        }
                    }
                });
                $("#selectLang").trigger("change");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Delete request failed:", textStatus, errorThrown);
                $.alert({
                    title: 'Error',
                    content: 'An error occurred while deleting the user.',
                    type: 'red',
                    buttons: {
                        ok: {
                            text: 'OK',
                            btnClass: 'btn btn-primary'
                        }
                    }
                });
            }
        });
    }
    
    $(document).on("click", ".edit-button", function () {
        var row = $(this).closest("tr");
        var nameInput = $("<input>").val(row.find("td:eq(2)").text()).addClass("model-update-input");
        var typeNameInput = $("<input>").val(row.find("td:eq(3)").text()).addClass("model-update-input");

        row.find("td:eq(2)").html(nameInput);
        row.find("td:eq(3)").html(typeNameInput);

        var saveButton = $("<button>").text("Save");
        saveButton.addClass("btn btn-success save-button");
        row.find("td:eq(7)").html(saveButton);

        var cancelButton = $("<button>").text("Cancel");
        cancelButton.addClass("btn btn-secondary cancel-button");
        row.find("td:eq(8)").html(cancelButton);
    });

    $(document).on("click", ".save-button", function () {
        var modelID = $(this).closest("tr").data("id");
        var row = $(this).closest("tr");
        var modelName = row.find(".model-update-input:eq(0)").val(); 
        var typeName = row.find(".model-update-input:eq(1)").val();
        
        var formData = new FormData();
        formData.append("modelID", modelID);
        formData.append("name", modelName);
        formData.append("typeName", typeName);
    
        $.ajax({
            url: URL_SERVER_LOCAL + 'api/RoboModel/Update/',
            method: "PUT",
            data: formData,
            processData: false, 
            contentType: false,
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
            name: "",
            imgPath: "",
            typeName: "",
            userID: "",
        };

        var row = $("<tr>");
        row.append($("<th scope='row'>").text(""));
        row.append($("<td>").append($("<input>").val(newProduct.imgPath).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.name).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.typeName).addClass("new-product-input")));
        row.append($("<td>").append($("<input>").val(newProduct.userID).addClass("new-product-input")));

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
                console.error("Add new product request failed:", textStatus, errorThrown);
            }
        });
    });

    $(document).on("click", ".cancel-new-button", function () {
        $(this).closest("tr").remove();
    });

    function displayProductsOnPage(products) {
        var productTableBody = $("#product-table-body");
        productTableBody.empty();
    
        $.each(products, function (index, product) {
            var row = $("<tr data-id='" + product.modelID + "'>");
            row.append($("<td scope='row'>").text(index + 1));
    
            if(product.imgPath!=null)
            {
                row.append($("<td>").append('<img class="productImg" src="' + product.imgPath + '" alt="">'));
            }else
            {
                row.append($("<td>").append('<img class="productImg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637" alt="">'));
            } 

            row.append($("<td>").text(product.name));
            row.append($("<td>").text(product.typeName));
            row.append($("<td>").text(product.userID));
            var createdDate = new Date(product.createdDate);
            var formattedDate = createdDate.getDate().toString().padStart(2, '0') + '/' +
                               (createdDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                               createdDate.getFullYear();
            row.append($("<td>").text(formattedDate));
            row.append($("<td>").text(product.isDelete));
    
            var editButton = $("<button>").text("+");
            editButton.addClass("btn btn-success edit-button fs-5");
            editButton.data("product-id", product.modelID);
            row.append($("<td>").append(editButton));
    
            var deleteButton = $("<button>").text("-");
            deleteButton.addClass("btn btn-danger delete-button fs-5");
            deleteButton.data("product-id", product.modelID);
            row.append($("<td>").append(deleteButton));
    
            productTableBody.append(row);
        });
    }
    

    function updatePaginationButtons(totalPages) {
        var paginationContainer = $(".pagination");
        paginationContainer.empty();

        var previousButton = $("<li class='page-item' id='previous-page'>")
            .append($("<a class='page-link translate' data-translation-key='product_previous' href='#' tabindex='-1'>").text("Previous"));

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
            .append($("<a class='page-link translate' data-translation-key='product_next' href='#'>").text("Next"));

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
        $("#selectLang").trigger("change");
    }

    function updatePageState() {
        history.pushState(null, null, "?page=" + (currentPage + 1));
    }
    
    function fetchDataAndUpdateTable() {
        var apiUrl = URL_SERVER_LOCAL + 'api/RoboModel/GetListModel';        
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
                console.log("pr", products);
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