// La URL raiz para los servicios RESTful
var rootURL = "rest/hotels";

var actualHotel;

// Recuperar la lista de hotels cuando la aplicacion inicia 
findAll();

// Ocultar el botón de eliminar al iniciarse la aplicacion
$('#btnDelete').hide();

// Registrar los listeners
$('.btnSearch').click(function() {
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
	newHotel();
	return false;
});

$('#btnSave').click(function() {
	if ($('#idHotel').val() == '')
		addHotel();
	else
		updateHotel();
	return false;
});

$('#btnDelete').click(function() {
	deleteHotel();
	return false;
});

$('#listHotels').delegate('a', 'click', function() {
	findById($(this).data('identity'));
});

$('#listHotels').delegate('a', 'click', function() {
	$('#listHotels a').removeClass("active");
	$(this).addClass("active");
});

$("image").error(function(){
  $(this).attr("src", "img/default.jpg");
});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
}

function newHotel() {
	$('#btnDelete').hide();
	actualHotel = { image: 'default.jpg'};
	renderDetails(actualHotel); // Mostrar formulario vacio
	$('#nameHotel').focus();
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
			actualHotel = data;
			renderDetails(actualHotel);
		}
	});
}

function addHotel() {
	console.log('addHotel');
	
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			findAll();
			alert('Hotel creado correctamente');
			$('#btnDelete').show();
			$('#idHotel').val(data.id);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en addHotel: ' + textStatus);
		}
	});
}

function updateHotel() {
	console.log('updateHotel');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#idHotel').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){			
			alert('Hotel actualizado correctamente');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en updateHotel: ' + textStatus);
		}
	});
}

function deleteHotel() {
	console.log('deleteHotel');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#idHotel').val(),
		success: function(data, textStatus, jqXHR){
			findAll();
			renderDetails({});
			alert('Hotel eliminado correctamente');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error en deleteHotel');
		}
	});
}

function renderList(data) {
	console.log("renderList");
	// JAX-RS serializa una lista vacia como null, y una coleccion de un único elemento en lugar de un array de uno)
	var list = 
		data == null ? [] : (data instanceof Array ? data : [data]);

	$('#listHotels a').remove();
	$.each(list, function(index, hotel) {
		console.log(hotel.id);
		$('#listHotels').append('<a href="#" data-identity="' + hotel.id + '" class="list-group-item">'+ hotel.name +'</a>');
	});
}

function renderDetails(hotel) {
	$('#idHotel').val(hotel.id);
	$('#nameHotel').val(hotel.name);
	$('#starsHotel').val(hotel.stars);
	$('#countryHotel').val(hotel.country);
	$('#descripHotel').val(hotel.description);
	$('#image').attr('src', 'img/' + hotel.image);
}

// Funcion de ayuda para serializar todos los campos del formulario a strings de JSON
function formToJSON() {
	var idHotel = $('#idHotel').val();
	return JSON.stringify({
		"id": idHotel == "" ? null : idHotel, 
		"name": $('#nameHotel').val(), 
		"stars": $('#starsHotel').val(),
		"country": $('#countryHotel').val(),
		"description": $('#descripHotel').val(),
		"image": actualHotel.image,
		});
}
