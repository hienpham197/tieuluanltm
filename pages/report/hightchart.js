import { URL_SERVER_LOCAL } from "../../js/const.js";
import { getInfoUser } from "../roboModel/roboModel.js";

var accessToken = localStorage.getItem("accessToken");

var accessToken = localStorage.getItem("accessToken");

startUp();

function startUp() {
  loadDataModel();
  loadDataUser();
}

function loadDataModel() {
  $.ajax({
    type: "GET",
    url: URL_SERVER_LOCAL + "/api/RoboModel/GetListModel",
    headers: { Authorization: "Bearer " + accessToken },
    success: function (response) {
      resolveData(response.data, setListModelChartData);
    },
    error: function (error) {},
  });
}

function loadDataUser() {
  $.ajax({
    type: "GET",
    url: URL_SERVER_LOCAL + "/api/User/GetListUser",
    headers: { Authorization: "Bearer " + accessToken },
    success: function (response) {
      resolveData(response, setUserChartData);
    },
    error: function (error) {},
  });
}

function resolveData(data, callback) {
  var groupedData = data.reduce(function (acc, obj) {
    var date = new Date(obj.createdDate);
    date.setHours(0, 0, 0, 0); // Reset time to midnight
    var timestamp = date.getTime(); // Convert to milliseconds
    if (!acc[timestamp]) {
      acc[timestamp] = { timestamp: timestamp, count: 0 };
    }

    acc[timestamp].count += 1;

    return acc;
  }, {});

  // Convert groupedData to an array of arrays with [timestamp, count] format
  var result = Object.values(groupedData).map(function (item) {
    return [item.timestamp, item.count];
  });
  callback(result);
}

function setListModelChartData(dataListModel) {
  var data1;
  if (dataListModel != null) {
    data1 = dataListModel;
  }

  if (data1 != null) {
    Highcharts.stockChart("chart1", {
      chart: {
        height: 400,
      },
      title: {
        text: "Upload Growth",
        align: "left",
        style: {
          fontSize: "18px", // Increase font size here
        },
      },
      yAxis: {
        title: {
          text: "Number of User Upload",
          style: {
            fontSize: "12px", // Increase font size for yAxis title
          },
        },
        labels: {
          style: {
            fontSize: "16px", // Increase font size for xAxis labels
          },
        },
      },
      rangeSelector: {
        allButtonsEnabled: true,
        buttons: [
          {
            type: "day",
            count: 1,
            text: "Day",
            dataGrouping: {
              forced: true, //
              units: [["hour", [1]]],
            },
            style: {
              fontSize: "18px", // Increase font size for range selector buttons
            },
          },
          {
            type: "week",
            count: 1,
            text: "Week",
            dataGrouping: {
              forced: true,
              units: [["day", [1]]],
            },
          },
          {
            type: "year",
            text: "Year",
            count: 1,
            dataGrouping: {
              forced: true,
              units: [["month", [1]]],
            },
          },
        ],
        buttonTheme: {
          width: 60,
        },
        selected: 0,
      },

      xAxis: {
        dateTimeLabelFormats: {
          day: "%A",
          month: "%B",
        },
        style: {
          fontSize: "16px", // Increase font size for xAxis labels
        },
      },

      series: [
        {
          name: "Uploaded",
          data: data1,
          marker: {
            enabled: null, // auto
            radius: 3,
            lineWidth: 1,
            lineColor: "#FFFFFF",
          },
        },
      ],
    });
  }
}
//setUserChartData
function setUserChartData(dataUser) {
  var data1;
  if (dataUser != null) {
    data1 = dataUser;
  }

  if (data1 != null) {
    Highcharts.stockChart("chart2", {
        chart: {
          height: 400,
        },
        title: {
          text: "Register Growth",
          align: "left",
          style: {
            fontSize: "18px", // Increase font size here
          },
        },
        yAxis: {
          title: {
            text: "Number of Register",
            style: {
              fontSize: "12px", // Increase font size for yAxis title
            },
          },
          labels: {
            style: {
              fontSize: "16px", // Increase font size for xAxis labels
            },
          },
        },
        rangeSelector: {
          allButtonsEnabled: true,
          buttons: [
            {
              type: "day",
              count: 1,
              text: "Day",
              dataGrouping: {
                forced: true, //
                units: [["hour", [1]]],
              },
              style: {
                fontSize: "18px", // Increase font size for range selector buttons
              },
            },
            {
              type: "week",
              count: 1,
              text: "Week",
              dataGrouping: {
                forced: true,
                units: [["day", [1]]],
              },
            },
            {
              type: "year",
              text: "Year",
              count: 1,
              dataGrouping: {
                forced: true,
                units: [["month", [1]]],
              },
            },
          ],
          buttonTheme: {
            width: 60,
          },
          selected: 0,
        },
  
        xAxis: {
          dateTimeLabelFormats: {
            day: "%A",
            month: "%B",
          },
          style: {
            fontSize: "16px", // Increase font size for xAxis labels
          },
        },
  
        series: [
          {
            name: "Uploaded",
            data: data1,
            marker: {
              enabled: null, // auto
              radius: 3,
              lineWidth: 1,
              lineColor: "#FFFFFF",
            },
          },
        ],
      });
  }
}
