$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    var currentPage = 0;
    var itemsPerPage = 10;
    var totalPages = 3;
    let id='';
    
    

    $.ajax({
        url: 'https://api2.tipslife.site/api/RoboModel/GetListModel',
        type: 'GET',
        dataType: 'json',
            headers: {
                "Authorization": "Bearer " + accessToken
            },
        success: function(data) {
            // Log the API response to the console
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });

    $(document).on("click",".delete-button", function(){
        var productId = $(this).data("modelId");
        if(confirm("Are you sure you ant to delete this product?")) {
            $.ajax({
                url: "https://api2.tipslife.site/api/RoboModel/Delete/" + productId,
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            })
        }
    })

    function displayProductsOnPage(products) {
        var productTableBody = $("#product-table-body");
        productTableBody.empty();
        var t=1;
         
        $.each(products, function (index, product) {            
            var row = `
                    <tr data-id='${product.modelID}'>
                        <td>${t} </td>
                        <td><img src="${product.imgPath}"alt=""></td>
                        <td>${product.name}</td>
                        <td>${product.typeName}</td>
                        <td>${product.userID}</td>
                        <td>${product.createdDate}</td>                        
                        <td><button id="editProduct" class = "btn btn-success plus-button" >+</button></td>
                        <td><button id="deleteProduct" class = "btn btn-danger minus-button">-</button></td>
                    </tr>
                    `;

            productTableBody.append(row);
            t++;
            
            //open edit form
            const btnEdit = document.querySelector(`[data-id = '${product.modelID}'] .plus-button`);
            btnEdit.addEventListener('click', (e)=>{
                e.preventDefault();
                document.getElementById("formeditProduct").style.display="block";
                let editProductForm = document.querySelector('#formeditProduct .form-editProduct');
                editProductForm.productname.value=product.name;
                editProductForm.linkimage.value=product.imgPath;
                editProductForm.typename.value=product.typeName;
                editProductForm.userid.value=product.userID;
            })

            //delete
            const btnDelete = document.querySelector(`[data-id = '${product.modelID}'] .minus-button`);
            btnDelete.addEventListener('click', (e)=>{
                e.preventDefault();
                fetch(`https://api2.tipslife.site/api/RoboModel/Delete"/${product.modelID}`,{
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + accessToken
                    }
                })
                .then (res=>res.json())
                .then(()=>location.reload());
            })

            
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
                var products = response;
                displayProductsOnPage(products);
                updatePaginationButtons(response.totalPages);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("API request failed:", textStatus, errorThrown);
            }
        });
    }

    fetchDataAndUpdateTable();

    function addProduct(){
        let addProductForm = document.querySelector('#formcreateProduct .form-addProduct');
        let obj = {};
        obj['name'] = addProductForm.productname.value;
        obj['imgPath']= addProductForm.linkimage.value;
        obj['typename'] = addProductForm.typename.value;
      
        fetch("https://api2.tipslife.site/api/RoboModel/AddModel",{
            method: "POST",
            headers:{
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(obj)
        })
        .then((res)=>res.json()).then((response)=>{
            fetchDataAndUpdateTable();
        })
    }

    editModalForm.addEventListener('submit', (e)=>{
        e.preventDefault;
        fetch(`${url}/${id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify ({
                fullname:editModalForm.fullname.value,
                username: editModalForm.username.value,
                password: editModalForm.password.value,
                email: editModalForm.email.value,
                birthday: editModalForm.birthday.value
            })
        })
        .then(res => res.json())
        .then(() =>location.reload())
    })

    function openForm(){
        document.getElementById("formcreateProduct").style.display="block";
    }
    function closeForm(){
        document.getElementById("formcreateProduct").style.display="none";
    }
    
    function closeeditForm(){
        document.getElementById("formeditProduct").style.display="none";
    }
    
});