var REQUEST = "";
var RESEND_TAB_NEW = "";
StorageChange();
var ENTRYS = {};
ENTRYS["header"] = 0;
ENTRYS["body"] = 0;

function notify(request) {
  REQUEST = request;
  //console.log(REQUEST["data"]["requestBody"]);
  document.getElementById("input_url").value = REQUEST["data"].url;
  if (REQUEST["data"]["requestBody"]["requestBody"] != undefined){
    if ( REQUEST["data"]["requestBody"]["requestBody"]["formData"] != undefined){
      for (value in REQUEST["data"]["requestBody"]["requestBody"]["formData"]) {
        set_new_entry(
          "body",
          value,
          REQUEST["data"]["requestBody"]["requestBody"]["formData"][value]
        );
      }
    }else if (REQUEST["data"]["requestBody"]["requestBody"]["raw"] != undefined) {
      utf8decode = new TextDecoder("utf-8");
      string = utf8decode.decode(REQUEST["data"]["requestBody"]["requestBody"]["raw"][0].bytes);
    }
  }
  if (REQUEST["data"]["requestHeaders"]["requestHeaders"] != undefined){
    for (value of REQUEST["data"]["requestHeaders"]["requestHeaders"]) {
      set_new_entry(
        "header",
        value["name"],
        value["value"]
      );
    }
      //console.log(value);
    }
}

function set_new_entry(typ, value1 = "", value2 = "") {
  data = document.createElement("div");
  data.id = typ + "_" + ENTRYS[typ];
  data.className = "entry_data";
  input1 = document.createElement("input");
  input1.className = "input_data";
  input1.value = value1;
  input2 = document.createElement("input");
  input2.className = "input_data";
  input2.value = value2;
  image_div = document.createElement("div");
  image_div.className = "img_div";
  image = document.createElement("img");
  image.src = "icon/trash.png";

  image.i = typ + "_" + ENTRYS[typ];
  image_div.addEventListener("click", remove_entry);
  image_div.appendChild(image);
  data.appendChild(input1);
  data.appendChild(input2);
  data.appendChild(image_div);
  document.getElementById(typ + "_data").appendChild(data);
  ENTRYS[typ] += 1;
}
function remove_entry(i) {

  console.log(document.getElementById(i.target.i).remove());
}

function start_tamper() {
  url = document.getElementById("input_url").value;
  post_data = "";
  for (value of document.getElementById("body_data").childNodes) {
    post_data +=
      value.childNodes[0].value + "=" + value.childNodes[1].value + "&";
  }
  var myHeaders = new Headers();

  for (value of document.getElementById("header_data").childNodes) {
    if (value.childNodes[0].value != ""){
    myHeaders.append(value.childNodes[0].value, value.childNodes[1].value);
  }
  }


data = {}
  if (post_data.length != 0) {
    data.body = post_data;
    data.method= "POST"
    myHeaders.delete("Content-type");
    myHeaders.append(
      "Content-type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
  } else {
    data.method = "GET"
  }

  data.headers = myHeaders;
  fetch(url, data)
    .then(function(response) {
      response.blob().then(function(data) {
        objectURL = URL.createObjectURL(data);
        //console.log(objectURL);
        if (RESEND_TAB_NEW == true) {
          tab_create(objectURL);
          close_window()
        } else {
          tab_exists(objectURL);
          close_window()
        }
      });
    })
    .catch(function(err) {
      document.getElementById("error").textContent = err
      console.error("Fetch Error:", err);
    });
}

function send_normal_tamper() {
  if (RESEND_TAB_NEW == true) {
    tab_create(REQUEST["data"].url);
    var getting = browser.windows.getCurrent();
    close_window()
  } else {
    tab_exists(REQUEST["data"].url);
    close_window()
  }
}
function button_abort() {
    close_window()
}
function close_window(){
  var getting = browser.windows.getCurrent();
  getting.then(function(window) {
    removing = browser.windows.remove(window.id);
  });
}

function tab_create(objectURL) {
  chrome.windows.getAll(
    {
      windowTypes: ["normal"]
    },
    function(getwindows) {
      //console.log(getwindows)
      for (windows of getwindows) {
        if (windows.type == "normal") {
          WINDOW_ID = windows.id;
          break;
        }
      }
      chrome.tabs.create({
        windowId: WINDOW_ID,
        url: objectURL
      });
    }
  );
}

function tab_exists(objectURL) {
  //console.log(REQUEST["data"]);
  chrome.tabs.get(REQUEST["data"]["tabId"], function() {
    if (chrome.runtime.lastError) {
      tab_create(objectURL);
    } else {
      chrome.tabs.update(
        REQUEST["data"]["tabId"],
        {
          url: objectURL
        },
        function() {
          //chrome.tabs.create({url: bloburl} , function (){
          if (chrome.runtime.lastError) {
            onError(chrome.runtime.lastError);
          }
        }
      );
    }
  });
}
function StorageChange() {
  //console.log("New Storage")
  gettingItem = chrome.storage.local.get(function(item) {
    if (item["new_tab_open"] == true) {
      RESEND_TAB_NEW = true;
    } else {
      RESEND_TAB_NEW = false;
    }
  });
}
chrome.runtime.onMessage.addListener(notify);
chrome.storage.onChanged.addListener(StorageChange);

document.getElementById("button_tamper").addEventListener("click", function() {
  start_tamper();
});
document.getElementById("button_abort").addEventListener("click", function() {
  button_abort();
});
document
  .getElementById("button_send_normal")
  .addEventListener("click", function() {
    send_normal_tamper();
  });
document
  .getElementById("button_new_entry_header")
  .addEventListener("click", function() {
    set_new_entry("header");
  });
document
  .getElementById("button_new_entry_body")
  .addEventListener("click", function() {
    set_new_entry("body");
  });
