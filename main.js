// Function that makes the buttons copy themself to the clipboard
function copy(e) {
    document.getElementById("clipboard-content").innerHTML = e.textContent;
    navigator.clipboard.writeText(e.textContent);
}

function parse_parameter(param) {
    if (param === null) return [];
    var tmp = param.split('~');
    if (tmp.length < 2) return [];
    var data = [];

    for (var i = 0; i < tmp.length; i += 2) {
        data.push([tmp[i], tmp[i + 1]])
    }

    return data;
}

function go_to_data(data) {
    // Go from '[["a","b"],["c","d"],["e","f"],["g","h"]]'
    // To      'a,b,c,d,e,f,g,h'

    var tmp = JSON.stringify(data);
    tmp = tmp.replaceAll('"', '');
    tmp = tmp.replaceAll('[', '');
    tmp = tmp.replaceAll(']', '');
    tmp = tmp.replaceAll(',', '~');
    console.log(tmp)

    document.location.href = '?data=' + encodeURIComponent(tmp);
    // document.location.href = '?data=' + encodeURIComponent(JSON.stringify(data));
}

// Handler for adding new buttons to the bottom of the page
function add() {
    var new_item = [
        document.getElementById("name").value,
        document.getElementById("number").value
    ]
    if (new_item[0] == '' && new_item[1] == '') return;
    if (typeof data == 'undefined') go_to_data([new_item]);
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

window.onload = () => {
    var params = new URLSearchParams(window.location.search);

    var data = parse_parameter(params.get("data"));
    data.forEach((button, index) => insert_button(index, button))

    var j = document.getElementById("name");
    j.focus();
    j.select();
}