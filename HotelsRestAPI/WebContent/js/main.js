// La URL raiz para los servicios RESTful
var rootURL = "rest/hotels";

var vinoActual;

// Recuperar la lista de vinos cuando la aplicacion inicia 
findAll();

// Ocultar el botón de eliminar al iniciarse la aplicacion
$('#btnDelete').hide();

// Registrar los listeners
$('.btnBusqueda').click(function() {
	//$('#campoBusqueda').trigger('keyup');
	search($('#campoBusqueda').val());
	return false;
});

// Lanzar la operacion de busqueda al presionar 'Return' en el campo de busqueda
$('#campoBusqueda').keypress(function(e){
	if(e.which == 13) {
		search($('#campoBusqueda').val());
		e.preventDefault();
		return false;
    }
});

$('.new').click(function() {
	newVino();
	return false;
});

$('#btnSave').click(function() {
	if ($('#vinoId').val() == '')
		addVino();
	else
		updateVino();
	return false;
});

$('#btnDelete').click(function() {
	deleteVino();
	return false;
});

$('#listaVinos').delegate('a', 'click', function() {
	findById($(this).data('identity'));
});

$("img").error(function(){
  $(this).attr("src", "pics/generic.jpg");

});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
}

function newVino() {
	$('#btnDelete').hide();
	vinoActual = { imagen: 'generic.jpg'};
	renderDetails(vinoActual); // Mostrar formulario vacio
	$('#nombre').focus();
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // tipo de la respuesta
		success: renderList
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ' + data.name);
			vinoActual = data;
			renderDetails(vinoActual);
		}
	});
}

function addVino() {
	console.log('addVino');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			findAll();
			alert('Vino creado correctamente');
			$('#btnDelete').show();
			$('#vinoId').val(data.id);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en addVino: ' + textStatus);
		}
	});
}

function updateVino() {
	console.log('updateVino');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#vinoId').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){			
			alert('Vino actualizado correctamente');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en updateVino: ' + textStatus);
		}
	});
}

function deleteVino() {
	console.log('deleteVino');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#vinoId').val(),
		success: function(data, textStatus, jqXHR){
			findAll();
			renderDetails({});
			alert('Vino eliminado correctamente');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en deleteVino');
		}
	});
}

function renderList(data) {
	// JAX-RS serializa una lista vacia como null, y una coleccion de un único elemento en lugar de un array de uno)
	var list = 
		data == null ? 
				[] : 
					(data instanceof Array ? data : [data]);

	$('#listaVinos li').remove();
	$.each(list, function(index, vino) {
		$('#listaVinos').append('<li><a href="#" data-identity="' + vino.id + '">'+vino.nombre+'</a></li>');
	});
}

function renderDetails(vino) {
	$('#vinoId').val(vino.id);
	$('#nombre').val(vino.nombre);
	$('#uvas').val(vino.uvas);
	$('#pais').val(vino.pais);
	$('#region').val(vino.region);
	$('#anyo').val(vino.anyo);
	$('#imagen').attr('src', 'pics/' + vino.imagen);
	$('#descripcion').val(vino.descripcion);
}

// Funcion de ayuda para serializar todos los campos del formulario a strings de JSON
function formToJSON() {
	var vinoId = $('#vinoId').val();
	return JSON.stringify({
		"id": vinoId == "" ? null : vinoId, 
		"nombre": $('#nombre').val(), 
		"uvas": $('#uvas').val(),
		"pais": $('#pais').val(),
		"region": $('#region').val(),
		"anyo": $('#anyo').val(),
		"imagen": vinoActual.imagen,
		"descripcion": $('#descripcion').val()
		});
}
