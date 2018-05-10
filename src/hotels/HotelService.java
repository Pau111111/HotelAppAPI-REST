package hotels;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/hotels")
public class HotelService {

	HotelDAO dao = new HotelDAO();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Hotel> findAll() {		
		return dao.findAll();
	}

	@GET @Path("search/{query}")
	@Produces(MediaType.APPLICATION_JSON)
	public Hotel findByName(@PathParam("query") String query) {		
		return dao.findByName(query).get(0);
	}

	@GET @Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Hotel findById(@PathParam("id") int id) {
		System.out.println("findById " + id);
		return dao.findById(id);
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Hotel create(Hotel hotel) {
		System.out.println("Creating hotel...");
		return dao.save(hotel);
	}

	@PUT @Path("{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Hotel update(Hotel hotel, @PathParam("id") int id) {		
		System.out.println("Updating hotel: " + hotel.getName());
		hotel.setId_hotel(id);
		dao.save(hotel);
		return hotel;
	}
	
	@DELETE @Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public void remove(@PathParam("id") int id) {
		dao.remove(id);
	}
}