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

@Path("/users")
public class UserService {

	UserDAO dao = new UserDAO();

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<User> findAll() {
		return dao.findAll();
	}

	@GET
	@Path("search/{query}")
	@Produces(MediaType.APPLICATION_JSON)
	public User findByName(@PathParam("query") String query) {
		return dao.findByName(query).get(0);
	}

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public User findById(@PathParam("id") int id) {
		System.out.println("findById " + id);
		return dao.findById(id);
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User create(User user) {
		System.out.println("Creating user...");
		return dao.save(user);
	}

	@PUT
	@Path("{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User update(User user, @PathParam("id") int id) {
		System.out.println("Updating user: " + user.getUsername());
		user.setId(id);
		dao.save(user);
		return user;
	}

	@DELETE
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public void remove(@PathParam("id") int id) {
		dao.remove(id);
	}

}
