//console.log("mööööööööööööp")
var EXLUDE_ITEMS = {};
var WEBREQUEST_DATA = {};
var TAB_ID = "";
var REQUESTID;
var START_TAMPER = false;
var FILTERS = {};
StorageChange();
chrome.webRequest.onBeforeRequest.addListener(
  function(test) {
    test["typ"] = "requestBody";
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["requestBody", "blocking"]
);
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(test) {
    test["typ"] = "requestHeaders";
    if (setdata_webRequest1(test) == "cancel"){
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders", "blocking"]
  );
chrome.webRequest.onSendHeaders.addListener(
  function(test) {
    test["typ"] = "onSendHeaders";
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);
chrome.webRequest.onHeadersReceived.addListener(
  function(test) {
    test["typ"] = "onHeadersReceived";
    test["blocking"] = true;
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders", "blocking"]
);
chrome.webRequest.onAuthRequired.addListener(
  function(test) {
    test["typ"] = "onAuthRequired";
    test["blocking"] = true;
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders", "blocking"]
);
chrome.webRequest.onResponseStarted.addListener(
  function(test) {
    test["typ"] = "onResponseStarted";
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
chrome.webRequest.onBeforeRedirect.addListener(
  function(test) {
    test["typ"] = "onBeforeRedirect";
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
chrome.webRequest.onCompleted.addListener(
  function(test) {
    test["typ"] = "onCompleted";
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
chrome.webRequest.onErrorOccurred.addListener(
  function(test) {
    test["typ"] = "onErrorOccurred";
    setdata_webRequest1(test);
  },
  { urls: ["<all_urls>"] }
);

function setdata_webRequest1(e) {
  //console.log(e)
    if (not_on_exlude_list(e.url)) {
      if (e.documentUrl != undefined) {
        if (e.documentUrl.indexOf("moz-extension") != -1) {
          return;
        }
      }
      if (e.requestId.indexOf("fakeRequest") >= 0) {
        return;
      }
      i = 0;
      if (WEBREQUEST_DATA[e.requestId] == undefined) {
        WEBREQUEST_DATA[e.requestId] = [];
      }
      while (true) {
        if (WEBREQUEST_DATA[e.requestId][i] == undefined) {
          WEBREQUEST_DATA[e.requestId][i] = [];
        }
        if (e["typ"] == "requestBody"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            WEBREQUEST_DATA[e.requestId][i]["time_start"] = e["timeStamp"]
            WEBREQUEST_DATA[e.requestId][i]["url"] = e["url"]
            WEBREQUEST_DATA[e.requestId][i]["method"] = e["method"]
            set_data_table(e.requestId ,i , "url" , e["url"])
            set_data_table(e.requestId ,i , "method" , e["method"])
            set_data_table(e.requestId ,i , "time" , timeConverter (e["timeStamp"]))
            break
          }
        }
        if (e["typ"] == "requestHeaders"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            set_data_table(e.requestId ,i , "url" , e["url"])
            set_data_table(e.requestId ,i , "method" , e["method"])
              if (START_TAMPER == true) {
                  new_Sub_Window(WEBREQUEST_DATA[e.requestId][i]);

                  return "cancel"
              }
            break
          }
        }
        if (e["typ"] == "onSendHeaders"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            set_data_table(e.requestId ,i , "url" , e["url"])
            set_data_table(e.requestId ,i , "method" , e["method"])
            break
          }
        }
        if (e["typ"] == "onHeadersReceived"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            WEBREQUEST_DATA[e.requestId][i]["statusCode"] = e["statusCode"]
            set_data_table(e.requestId ,i , "url" , e["url"])
            set_data_table(e.requestId ,i , "method" , e["method"])
            set_data_table(e.requestId ,i , "status" , e["statusCode"])
            set_data_table(e.requestId ,i , "status" , e["statusCode"])
            break
          }
        }
        if (e["typ"] == "onAuthRequired"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            //TODO
            break
          }
        }
        if (e["typ"] == "onResponseStarted"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            set_data_table(e.requestId ,i , "url" , e["url"])
            set_data_table(e.requestId ,i , "method" , e["method"])
            set_data_table(e.requestId ,i , "status" , e["statusCode"])
            break
          }
        }
        if (e["typ"] == "onBeforeRedirect"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
              //TODO
            break
          }
        }
        if (e["typ"] == "onCompleted"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] = e
            WEBREQUEST_DATA[e.requestId][i]["time_last"] = e["timeStamp"]
            set_data_table(e.requestId ,i , "duration" , WEBREQUEST_DATA[e.requestId][i]["time_last"] - WEBREQUEST_DATA[e.requestId][i]["time_start"])
            set_data_table(e.requestId ,i , "url" , e["url"])
            set_data_table(e.requestId ,i , "method" , e["method"])
            set_data_table(e.requestId ,i , "status" , e["statusCode"])
            break
          }
        }
        if (e["typ"] == "onErrorOccurred"){
          if( WEBREQUEST_DATA[e.requestId][i][e["typ"]] == undefined){
            WEBREQUEST_DATA[e.requestId][i][e["typ"]] == e
            WEBREQUEST_DATA[e.requestId][i]["time_last"] == e["timeStamp"]
            break
          }
        }
        i++;
      }

  }
}

function set_data_table(requestId, id ,type,value) {
  if (document.getElementById(requestId + "_" + id) == undefined) {
    data_table = document.getElementById("data_table");
    row = data_table.insertRow(-1);
    row.id = requestId + "_" + id;
    row.insertCell(0);
    row.insertCell(1);
    row.insertCell(2);
    row.insertCell(3);
    row.insertCell(4);
    row.addEventListener("click", function(e) {
      clicked_data(e, requestId, id);
    });
  }
  data_table_cells = document.getElementById(requestId + "_" + id).cells;

  //requestID
  if (type=="time") {
      data_table_cells[0].textContent = value;
  }
  else if (type=="duration") {
      data_table_cells[1].textContent = value;
  }
  else if (type=="method") {
      data_table_cells[2].textContent = value;
  }
  else if (type=="status") {
      data_table_cells[3].textContent = value;
  }
  else if (type=="url") {
      data_table_cells[4].textContent = value;
  }
}

function clicked_data(e, requestId, id) {
  console.log(WEBREQUEST_DATA[requestId][id]);
}

function new_Sub_Window(requestID) {
  windowscreate = chrome.windows.create(
    {
      height: 600,
      width: 800,
      type: "popup",
      url: chrome.extension.getURL("TamperDataSub.html")
    },
    function(windowscreate) {
      TAB_ID = windowscreate.tabs[0].id;

      function info_tabs(info_tab, test, tab) {
        //console.log(tab);
        if (
          tab.status == "complete" &&
          info_tab == TAB_ID &&
          tab.title == "Tamper Data Sub"
        ) {
          chrome.tabs.onUpdated.removeListener(info_tabs);
          on_tab_complete(TAB_ID, requestID);
        }
      }
      chrome.tabs.onUpdated.addListener(info_tabs);
    }
  );
}

function on_tab_complete(tab_id, requestID, id) {
  var gettingCurrent = browser.tabs.getCurrent();
  gettingCurrent.then(function(current_tab) {
    chrome.tabs.sendMessage(
      tab_id,
      {
        data: requestID
      }
    );
  });
}

function not_on_exlude_list(url_site) {
  request_url = new URL(url_site);
  for (url of EXLUDE_ITEMS["urls"]) {
    if (url["active"] == true) {
      if (request_url.hostname.indexOf(url["string"]) != -1) {
        return false;
      }
    }
  }
  for (file of EXLUDE_ITEMS["files"]) {
    if (file["active"] == true) {
      if (
        request_url.pathname.indexOf(file["string"], -1 - file.length) != -1
      ) {
        return false;
      }
    }
  }
  if_return = true;
  for (text of EXLUDE_ITEMS["text"]) {
    if (text["active"] == true) {
      if (url_site.indexOf(text["string"]) >= 0) {
        return true;
      } else {
        if_return = false;
      }
    }
  }
  if (if_return == true) {
    return true;
  } else {
    return false;
  }
}

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("data_table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
    no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
    one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
    based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
    and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
    set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function timeConverter(UNIX_timestamp) {
  date = new Date(UNIX_timestamp);
  // console.log(date)
  var Hours = date.getHours().toString();
  if (Hours.length == 1) {
    Hours = "0" + Hours;
  }
  var Minutes = date.getMinutes().toString();
  if (Minutes.length == 1) {
    Minutes = "0" + Minutes;
  }
  var Seconds = date.getSeconds().toString();
  if (Seconds.length == 1) {
    Seconds = "0" + Seconds;
  }
  return Hours + ":" + Minutes + ":" + Seconds;
}
function StorageChange() {
  chrome.storage.local.get(function(items) {
    EXLUDE_ITEMS = items;
  });
}
document.getElementById("auto_scroll_checkbox").checked;
document
  .getElementById("auto_scroll_checkbox")
  .addEventListener("change", function() {
    if (document.getElementById("auto_scroll_checkbox").checked == true) {
      auto_scroll_checkbox = true;
    } else {
      auto_scroll_checkbox = false;
    }
  });

document.getElementById("button_clear").addEventListener("click", function() {
  document.getElementById("data_table").innerHTML = '<tr><th id="table_time" data-i18n="table_time">'+chrome.i18n.getMessage("table_time")+'</th>'+
    '<th id="table_duration" data-i18n="table_duration">'+chrome.i18n.getMessage("table_duration")+'</th>'+
    '<th id="table_method" data-i18n="table_method">'+chrome.i18n.getMessage("table_method")+'</th>'+
    '<th id="table_status" data-i18n="table_status">'+chrome.i18n.getMessage("table_status")+'</th>'+
    '<th id="table_url" data-i18n="table_url">'+chrome.i18n.getMessage("table_url")+'</th></tr>'
  WEBREQUEST_DATA = {};
});

chrome.storage.onChanged.addListener(StorageChange);
document.getElementById("button_start_tamper").addEventListener("click", function() {
  document.getElementById("button_start_tamper").disabled = true;
  document.getElementById("button_stop_tamper").disabled = false;
  START_TAMPER = true;
});

document.getElementById("button_stop_tamper").addEventListener("click", function() {
  document.getElementById("button_stop_tamper").disabled = true;
  document.getElementById("button_start_tamper").disabled = false;
  START_TAMPER = false;
});
document.getElementById("table_time").addEventListener("click", function() {
  sortTable(0);
});
document.getElementById("table_duration").addEventListener("click", function() {
  sortTable(1);
});
document.getElementById("table_method").addEventListener("click", function() {
  sortTable(2);
});
document.getElementById("table_method").addEventListener("click", function() {
  sortTable(3);
});
document.getElementById("table_status").addEventListener("click", function() {
  sortTable(4);
});
document.getElementById("table_url").addEventListener("click", function() {
  sortTable(5);
});
document.getElementById("button_options").addEventListener("click", function() {
  chrome.runtime.openOptionsPage();
});
