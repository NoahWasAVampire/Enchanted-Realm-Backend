document.addEventListener('DOMContentLoaded', function (){
    fetch('http://localhost:3000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
});

const  addBtn = document.querySelector('#add-user-btn');
addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const passwordInput = document.querySelector('#password-input');
    const confirmedPasswordInput = document.querySelector('#confirm-password-input');
    const name = nameInput.value;
    const password = passwordInput.value;
    const confirmedPassword = confirmedPasswordInput.value;
    nameInput.value = "";
    passwordInput.value = "";
    confirmedPasswordInput.value = "";
        fetch('http://localhost:3000/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name : name, password : password, confirmedPassword : confirmedPassword})
        })
            .then(response => response.json())
            .then(data => insertRowIntoTable(data['data']));
}


function insertRowIntoTable(data){

}


function loadHTMLTable(data){
    const table = document.querySelector('table tbody');

    if (data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";
    data.forEach(function ({u_id, name, password, highscore}){
        tableHtml += '<tr>';
        tableHtml += `<td>${u_id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${password}</td>`;
        tableHtml += `<td>${highscore}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${u_id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${u_id}>Edit</td>`;
        tableHtml += "</tr>"
    });

    table.innerHTML = tableHtml;
}