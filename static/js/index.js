
const DEFAULT_URL = document.location.protocol + "//" + document.location.host;
const CALENDAR_ENDPOINT = "/calendar.html";
const EXAMPLE_SPECIFICATION = "https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/default_specification.json";

function updateUrls() {
    updateCalendarInputs();
    updateOutputs();
}

function updateCalendarInputs() {
    var urlInputs = document.getElementsByClassName("calendar-url-input");
    var calendarUrls = document.getElementById("calendar-urls");
    var hasEmptyInput = false;
    for (var i = 0; i < urlInputs.length; i+= 1) {
        var urlInput = urlInputs[i];
        hasEmptyInput |= urlInput.value == "";
    }
    if (!hasEmptyInput) {
        var li = document.createElement("li");
        var input = document.createElement("input");
        input.type = "text";
        input.classList.add("calendar-url-input");
        input.addEventListener("change", updateUrls);
        input.addEventListener("keyup", updateUrls);
        input.id = "calendar-url-input-" + urlInputs.length;
        li.appendChild(input);
        calendarUrls.appendChild(li);
    }
}

function getUrls() {
    var urls = [];
    var urlInputs = document.getElementsByClassName("calendar-url-input");
    for (var i = 0; i < urlInputs.length; i+= 1) {
        var urlInput = urlInputs[i];
        var url = urlInput.value;
        if (url) {
            urls.push(url);
        }
    }
    return urls;
}

function getCalendarUrl(specification) {
    var url = DEFAULT_URL + CALENDAR_ENDPOINT + "?";
    var parameters = [];
    getOwnProperties(specification).forEach(function(property) {
        if (specification[property]) {
            (Array.isArray(specification[property]) ? specification[property] : [specification[property]]
            ).forEach(function(url){
                parameters.push(encodeURIComponent(property) + "=" + encodeURIComponent("" + url))
            });
        }
    });
    return url + parameters.join("&");
}

var lastCalendarUrl = "";

/* This is called after the inputs changed.
 *
 */
function updateOutputs() {
    var specification = getSpecification();
    var calendarUrl = getCalendarUrl(specification);
    if (lastCalendarUrl != calendarUrl) {
        updateCalendarOutputs(calendarUrl);
    }
    lastCalendarUrl = calendarUrl;
    updateSpecificationOutput(specification);
}

function updateCalendarOutputs(calendarUrl) {
    console.log("calendarUrl", calendarUrl);
    displayCalendarLink(calendarUrl);
    displayCalendar(calendarUrl);
    showCalendarSourceCode(calendarUrl);   

}

/* Update the output of the specification.
 *
 */
function updateSpecificationOutput(specification) {
    document.getElementById("json-specification").innerText = JSON.stringify(specification, null, 2);
}

/* This generates the specification of the calendar.
 *
 */
function getSpecification() {
    var specification = {};
    /* url */
    var urls = getUrls();
    if (urls.length == 1) {
        specification.url = urls[0];
    } else if (urls.length > 1) {
        specification.url = urls;
    }
    /* title */
    var title = document.getElementById("calendar-title").value;
    if (title != "") {
        specification.title = title;
    }
    console.log("getSpecification", specification);
    return specification;
}

function displayCalendarLink(url) {
    var link = document.getElementById("calendar-link");
    link.innerText = url;
    link.href = url;
}
function displayCalendar(url) {
    var link = document.getElementById("open-web-calendar");
    link.src = url;
}
function showCalendarSourceCode(url) {
    var link = document.getElementById("calendar-code");
    link.innerText = '<iframe id="open-web-calendar" \n    src="' + escapeHtml(url) + '" \n    allowTransparency="true" scrolling="no" \n    frameborder="0" height="600px" width="100%"></iframe>'
}

function escapeHtml(unsafe) {
    // from https://stackoverflow.com/a/6234804/1320237
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/* Return the properties of an object.
 * 
 */
function getOwnProperties(object) {
    // from https://stackoverflow.com/a/16735184/1320237
    var ownProperties = [];
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            ownProperties.push(property);
        }
    }
    return ownProperties;
}

function downloadJSONSpecification() {
    var specification = getSpecification();
    var text = JSON.stringify(specification, null, 4);
    var filename = specification.title ?
        specification.title.replace(/\s/g, "-") + ".json" :
        "calendar-specification.json";
    downloadJSONAsFile(filename, text);
}

/* Download content with a file name.
 *
 */
function downloadJSONAsFile(filename, text) {
    // from https://stackoverflow.com/a/18197341/1320237
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function fillFirstInputWithData() {
    var urlInputs = document.getElementsByClassName("calendar-url-input");
    if (urlInputs) {
        urlInputs[0].value = "http://www.officeholidays.com/ics/ics_country_noregion.php?tbl_country=Germany";
    }
}


function fillDefaultSpecificationLink() {
    var link = document.getElementById("example-specification-link");
    var url = DEFAULT_URL + CALENDAR_ENDPOINT + "?specification_url=" + EXAMPLE_SPECIFICATION;
    link.innerText = url;
    link.href = url;
}


window.addEventListener("load", function(){
    updateCalendarInputs();
    fillFirstInputWithData();
    updateCalendarInputs();
    updateOutputs();
    fillDefaultSpecificationLink()
});




