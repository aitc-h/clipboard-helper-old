var toggleSwitch;
var params;

var state = {
    'theme': '',
    '__edit': false,
    get edit() { return this.__edit; },
    set edit(a) {
        this.__edit = a;
        var buttons = document.getElementsByClassName("btn-danger");
        Array.from(buttons).forEach((e) => { e.hidden = !state.edit; });
    },
    'data': []
}

// Function that makes the buttons copy themself to the clipboard
function copy(e) {
    document.getElementById("clipboard-content").innerHTML = e.textContent;
    navigator.clipboard.writeText(e.textContent);
}

function parse_data(data) {
    if (data === null) return [];
    data = data.split('~');
    if (data.length < 2) return [];

    n_data = [];

    for (var i = 0; i < data.length; i += 2) {
        n_data.push([data[i], data[i + 1]])
    }

    return n_data;
}

function go_to_data(new_data) {
    var tmp = JSON.stringify(new_data);
    tmp = tmp.replaceAll('"', '');
    tmp = tmp.replaceAll('[', '');
    tmp = tmp.replaceAll(']', '');
    tmp = tmp.replaceAll(',', '~');
    console.debug(tmp);

    var n_params = new URLSearchParams();
    n_params.set("data", tmp);
    n_params.set("edit", (state.edit ? '1' : '0'));

    document.location.href = '?' + n_params.toString();
}

// Handler for adding new buttons to the bottom of the page
function add() {
    var new_item = [
        document.getElementById("name").value,
        document.getElementById("number").value
    ]
    if (new_item[0] == '' && new_item[1] == '') return;
    if (typeof state.data == 'undefined') {
        console.warn("Data is undefined - ignore if first item")
        go_to_data([new_item]);
    }
    go_to_data(state.data.concat([new_item]));
}

// Used to generate the buttons in HTML
function insert_button(index, button_info) {
    var html = `<div id='button-${index}'>
                    <div class='d-inline' role='group'>
                        <button class='btn btn-danger' tabindex='-1' onclick='delete_row(${index})' ${state.edit ? '' : 'hidden'}>X</button>
                    </div>
                    <div class='d-inline' role='group'>
                        <button class='btn btn-dark col-5' onclick='copy(this)' tabindex='-1' ${button_info[0] == '' ? 'hidden' : ''}>${button_info[0]}</button>
                        <button class='btn btn-dark col-5' onclick='copy(this)' tabindex='-1' ${button_info[1] == '' ? 'hidden' : ''}>${button_info[1]}</button>
                    </div>
                </div>
                `

    var buttons = document.getElementById("buttons")
    buttons.innerHTML += html;
}

function delete_row(i) {
    var before = state.data.slice(0, i);
    var after = state.data.slice(i + 1);
    go_to_data(before.concat(after));
}

function getColorScheme() {
    state.theme = "light";
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            state.theme = "dark";
        }
    } else if (!window.matchMedia) {
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        state.theme = "dark";
    }

    if (state.theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark")
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        localStorage.setItem("theme", "dark");
        state.theme = "dark";
        document.documentElement.setAttribute('data-theme', "dark");
        toggleSwitch.checked = true;
    } else {
        localStorage.setItem("theme", "light");
        state.theme = "light";
        document.documentElement.setAttribute('data-theme', 'light');
        toggleSwitch.checked = false;
    }
}

getColorScheme();

window.onload = () => {
    params = new URLSearchParams(window.location.search);

    state.theme = params.get("dark") == 1 ? "dark" : "light";
    state.edit = params.get("edit") == '1';
    state.data = parse_data(params.get("data"))

    toggleSwitch = document.querySelector('#theme-switch input[type="checkbox"]');
    toggleSwitch.addEventListener('change', switchTheme, false);

    if (document.documentElement.getAttribute("data-theme") == "dark") {
        toggleSwitch.checked = true;
    }

    console.debug(state.data);
    state.data.forEach((button, index) => insert_button(index, button));

    

    var j = document.getElementById("name");
    j.focus();
    j.select();
}