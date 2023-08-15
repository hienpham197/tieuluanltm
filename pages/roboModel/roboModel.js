import {URL_SERVER_LOCAL, PAGE_SIZE_DEFAULT} from '../../js/const.js';
export {
    getListModel,
    getDetail
}
var elListModel = $("#model-list");
var accessToken = localStorage.getItem("accessToken");
var ulTag = $(".pagination")
var totalPages = 0;
function getListModel(){ 

    
    $.ajax({
        url: URL_SERVER_LOCAL +"/api/RoboModel/GetListModel?pageSize=1",
        method: "GET",
        headers: {
            "Authorization": "Bearer "+ accessToken
        },
        success: function(response){
            if(response.length > 0){
                totalPages = Math.ceil(response.length / 1)
                renderModel(response);

                
                renderNavigationPaging(totalPages,0)
            }

        },
        error: function(httpObj, textStatus) {       
            if(httpObj.status==401)
                //To do....
                console.log("Access deny");
                window.location.href = "../404.html"
        }

    });
}

function getDetail(id){
    console.log(id);
    $.ajax({
        url: URL_SERVER_LOCAL +"/api/RoboModel/Get",
        method: "GET",
        headers: {
            "Authorization": "Bearer "+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0aWVwQGdtYWlsLmNvbSIsIklkIjoiMSIsImV4cCI6MTY5MjU1MjIwNSwiaXNzIjoiYWRtaW5AZ21haWwuY29tIiwiYXVkIjoiYWRtaW5AZ21haWwuY29tIn0.YelxFQ7NRTfKe9X-zTTDumJ2N91OhibbrTh-n0aGtho"
        },
        success: function(response){
            console.log(response);
            if(response.length > 0){
                renderModel(response);
                renderNavigationPaging(5,1)
            }

        },
        error: function(httpObj, textStatus) {       
            if(httpObj.status==401)
                //To do....
                console.log("Access deny");
                window.location.href = "../404.html"
        }

    });
    
}

//Handle render navigation paging 
function renderNavigationPaging(totalPages,page){

    var ulTag = $(".pagination")
    var liTag = '';
    var liActive ;
    var beforePages = page - 1; //5 - 1 = 4 
    var afterPages = page + 1;//5 + 1 = 6

    if(totalPages <= 5){
        for(let pageLength = 0; pageLength <= 5; pageLength++){
            if(pageLength > totalPages){
                continue;
            }

            if(pageLength ==0){//If pageLength is equals to 0 then add + 1
                pageLength+=1;
            }
            var currentPage = pageLength - 1;
            if(page == currentPage){
                liActive = 'btn btn-primary current';
            }else{
                liActive = 'btn btn-outline-primary ';
            }
            
            liTag +=` <span class="${liActive}" onclick="Pagination(${totalPages},${pageLength - 1})">
                ${pageLength}
            </span>`;
        }
        
    }else{
        
        if(page>1){//if page values if greater than 1 then add new li which is previous button
            liTag += `<a class="${liActive}" onclick="Pagination(${totalPages},${page - 1})">
                <i class=" fa fa-angle-double-left"></i>
        </a>`;
        }

        if(page>2){//if page greater than 2 then add new li tag with 1 value
            liTag +=` <a class="${liActive}" onclick="Pagination(${totalPages},1)">
                1
            </a>`;
            if(page > 3){//if page greater than 3 then add new li tag with (...)
                liTag +=`<a class="${liActive}">
                    ...
                </a>`; 
            }
        }

        //How many page or li show before the current li
        if(page == totalPages){//if page value is equal to totalPages the substract by -2 to before page value 
            beforePages = beforePages - 2;
        }else if(page == totalPages - 1){//if page value is equal to totalPages - 1 the substract by -1 to before page value 
            beforePages = beforePages - 1;
        }
        //How many page or li show after the current li
        if(page == 1){//if page value is equal to 1 the ad by +2 to after page value 
            afterPages = afterPages + 2;
        }else if(page == 2){
            afterPages = afterPages + 1;
        }
        
        for(let pageLength = beforePages; pageLength <= afterPages; pageLength++){
            if(pageLength > totalPages){
                continue;
            }

            if(pageLength ==0){//If pageLength is equals to 0 then add + 1
                pageLength+=1;
            }

            if(page == pageLength){
                liActive = 'btn btn-primary current';
            }else{
                liActive = 'btn btn-outline-primary';
            }
            
            liTag +=` <a class=" ${liActive}" onclick="Pagination(${totalPages},${pageLength})">
                ${pageLength}
            </a>`;
        }

        //If page value less than totalPages by - 1 then show the last li or page which is 20
        if(page < totalPages - 1 ){      
            if(page < totalPages - 2 ){//If page value less than totalPages by - 1 then show the last li or page which is 20
                liTag +=`<a class="${liActive}">
                ...
                </a>`; 
            }
            liTag +=` <a class="${liActive}" onclick="Pagination(${totalPages},${totalPages})">
            ${totalPages}
            </a>`; 
        }       

        if(page < totalPages){//if page values if less than totalPages then add new li which is next button
            liTag +=` <a class="${liActive}" onclick="Pagination(${totalPages}, ${page + 1})">
                <i class="fa fa-angle-double-right"></i>
        </a>`;
        }
    }
    ulTag.html(liTag)
} 

window.Pagination = function (totalPages,page){
    $.ajax({
        url: URL_SERVER_LOCAL +`/api/RoboModel/GetListModel?pageSize=1&pageNumber=${page}`,
        method: "GET",
        headers: {
            "Authorization": "Bearer "+ accessToken
        },
        success: function(response){
            if(response.length > 0){
                renderModel(response)
                renderNavigationPaging(totalPages,page);
            }

        },
        error: function(httpObj, textStatus) {       
            if(httpObj.status==401)
                //To do....
                console.log("Access deny");
                window.location.href = "../404.html"
        }

    });
    
}

function renderModel(response){
    if(response.length > 0){
        var html= response.map((data) => {
            return `
            <li class="col-lg-4 col-md-6 col-sm-12">
                <div class="product-box">
                    <div class="producct-img">
                        <img src="${data.imgPath}" alt="" />
                    </div>
                    <div class="product-caption">
                        <h4><a href="#">${data.name}</a></h4>
                        <a href="/RoboModel/roboModel-detail.html?id=${data.modelID}"class="btn btn-outline-primary">Details Model</a>
                    </div>
                </div>
            </li>
            `
        });

        elListModel.html(html.join(''));
    }
}
