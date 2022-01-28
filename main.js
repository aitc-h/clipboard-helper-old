var toggleSwitch;

var data = [];
var params;

// Function that makes the buttons copy themself to the clipboard
function copy(e) {
    document.getElementById("clipboard-content").innerHTML = e.textContent;
    navigator.clipboard.writeText(e.textContent);
}

function parse_data() {
    var tmp = params.get("data");
    if (tmp === null) return [];
    tmp = tmp.split('~');
    if (tmp.length < 2) return [];

    for (var i = 0; i < tmp.length; i += 2) {
        data.push([tmp[i], tmp[i + 1]])
    }
}

function go_to_data(new_data) {
    var tmp = JSON.stringify(new_data);
    tmp = tmp.replaceAll('"', '');
    tmp = tmp.replaceAll('[', '');
    tmp = tmp.replaceAll(']', '');
    tmp = tmp.replaceAll(',', '~');
    console.log(tmp)

    document.location.href = '?data=' + encodeURIComponent(tmp);
}

// Handler for adding new buttons to the bottom of the page
function add() {
    var new_item = [
        document.getElementById("name").value,
        document.getElementById("number").value
    ]
    if (new_item[0] == '' && new_item[1] == '') return;
    if (typeof data == 'undefined') {
        console.warn("Data is undefined - ignore if first item")
        go_to_data([new_item]);
    }
    go_to_data(data.concat([new_item]));
}

function insert_button(index, button_info) {
    var html = "";
    var visible = "";

    html += "<div id='button-" + index + "'>";
    html += "<div class='d-inline' role='group'>";
    html += "<button class='btn btn-danger' tabindex='-1' onclick='delete_row(" + index + ")' hidden>X</button>";
    html += "</div><div class='d-inline' role='group'>";

    if (button_info[0] == '') visible = "hidden"; else visible = "";
    html += "<button class='btn btn-dark col-5' onclick='copy(this)' tabindex='-1' " + visible + ">" + button_info[0] + "</button>"

    if (button_info[1] == '') visible = "hidden"; else visible = "";
    html += "<button class='btn btn-dark col-5' onclick='copy(this)' tabindex='-1' " + visible + ">" + button_info[1] + "</button></div></div>"

    var buttons = document.getElementById("buttons")
    var temp = buttons.getInnerHTML();
    temp += html;
    buttons.innerHTML = temp;
}

// Toggles whether the delete buttons are shown
function toggle_delete() {
    // Get HTMLCollection of all buttons
    var buttons = document.getElementsByClassName("btn-danger");
    if (buttons.length === 0) return;
    var state = buttons[0].hidden;
    Array.from(buttons).forEach((e) => { e.hidden = !state; });
}

function delete_row(i) {
    var before = data.slice(0, i);
    var after = data.slice(i + 1);
    go_to_data(before.concat(after));
}

function getColorScheme() {
    var theme = "light";
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    } else if (!window.matchMedia) {
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
    }

    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark")
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute('data-theme', "dark");
        toggleSwitch.checked = true;
    } else {
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute('data-theme', 'light');
        toggleSwitch.checked = false;
    }
}

getColorScheme();

window.onload = () => {
    params = new URLSearchParams(window.location.search);

    var dark = params.get("dark") == 1 ? true : false;
    var edit = params.get("edit") == 1 ? true : false;

    toggleSwitch = document.querySelector('#theme-switch input[type="checkbox"]');
    toggleSwitch.addEventListener('change', switchTheme, false);

    if (document.documentElement.getAttribute("data-theme") == "dark") {
        toggleSwitch.checked = true;
    }

    parse_data(params.get("data"));
    console.debug(data);
    data.forEach((button, index) => insert_button(index, button));

    if (edit) {
        toggle_delete();
    }

    var j = document.getElementById("name");
    j.focus();
    j.select();
}