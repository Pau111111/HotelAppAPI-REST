// La URL raiz para los servicios RESTful
var rootURL = "rest/hotels";

var actualHotel;
// Recuperar la lista de hotels cuando la aplicacion inicia 
findAll();
$('.btnSearch').click(function() {
	//$('#campoBusqueda').trigger('keyup');
	search($('#campoBusqueda').val());
	return false;
});

$('#campoBusqueda').keypress(function(e){
	if(e.which == 13) {
		search($('#campoBusqueda').val());
		e.preventDefault();
		return false;
    }
});
function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
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


function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // tipo de la respuesta
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
function renderList(data) {
	console.log("renderList");
	// JAX-RS serializa una lista vacia como null, y una coleccion de un único elemento en lugar de un array de uno)
	var list = 
		data == null ? [] : (data instanceof Array ? data : [data]);

	$('#insertHotels figure').remove();
	$.each(list, function(index, hotel) {
		console.log(hotel.id);
		$('#insertHotels').append('<figure class="snip1527">'+
		  '<div class="image"><img src="img/'+hotel.image+'" alt="pr-sample23" /></div>'+
		  '<figcaption>'+
		    '<div class="date"><span class="day">'+hotel.stars+'</span><span class="month">★</span></div>'+
		    '<h3>'+hotel.name+'</h3>-'+hotel.country+''+
		    '<p>'+

		     ''+hotel.description+''+
		    '</p>'+
		  '</figcaption>'+
		  '<a href="#"></a>'+
		'</figure>');
	});
}
// <a href="#" data-identity="' + hotel.id + '" class="list-group-item">'+ hotel.name +'</a>