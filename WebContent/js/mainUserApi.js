var rootURL = "rest/users";
$('#addAccount').click(function() {
	addUser();
	return false;
});

function addUser(){
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSONRegister(),
		success: function(data, textStatus, jqXHR){
			alert('Usuario creado correctamente');
			window.location.href = "login.html";
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en addUser: ' + textStatus);
		}
	});
}

function login() {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSONLogin(),
		success: function(data, textStatus, jqXHR){
			if(data.email = "admin@admin.com"){
				alert('Usuario admin logeado correctamente');
				window.location.href = "admin.html";
			}else{
				alert('Usuario logeado correctamente');
				window.location.href = "index.html";
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en addUser: ' + textStatus);
		}
	});
}




//Funcion de ayuda para serializar todos los campos del formulario a strings de JSON
function formToJSONRegister() {
	return JSON.stringify({
		"username": $('#inputUser').val(), 
		"email": $('#inputEmail').val(),
		"pass": $('#inputPass').val(),
		});
}

function formToJSONLogin() {
	return JSON.stringify({
		"email": $('#inputEmail').val(),
		"pass": $('#inputPass').val(),
		});
}
