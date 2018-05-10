package hotels;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class HotelDAO {

	public List<Hotel> findAll() {
		List<Hotel> list = new ArrayList<Hotel>();
		Connection conn = null;
		String sql = "SELECT * FROM hotels ORDER BY name";
		try {
			conn = ConnectionHelper.getConnection();
			Statement statement = conn.createStatement();
			ResultSet rs = statement.executeQuery(sql);
			while (rs.next()) {
				list.add(processRow(rs));
			}
		} catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return list;
	}

	public List<Hotel> findByName(String name) {
		List<Hotel> lista = new ArrayList<Hotel>();
		Connection conn = null;
		String sql = "SELECT * FROM hotels " + "WHERE UPPER(name) LIKE ? " + "ORDER BY name";
		try {
			conn = ConnectionHelper.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, "%" + name.toUpperCase() + "%");
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				lista.add(processRow(rs));
			}
		} catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return lista;
	}

	public Hotel findById(int id) {
		String sql = "SELECT * FROM hotels WHERE id_hotel = ?";
		Hotel hotel = null;
		Connection conn = null;
		try {
			conn = ConnectionHelper.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				hotel = processRow(rs);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return hotel;
	}

	public Hotel save(Hotel hotel) {
		return hotel.getId_hotel() > 0 ? update(hotel) : create(hotel);
	}

	public Hotel create(Hotel hotel) {
		Connection conn = null;
		PreparedStatement ps = null;
		final String qry = "INSERT INTO hotels (name, address, stars, country, " + "description, image) "
				+ "VALUES (?, ?, ?, ?, ?,?)";
		try {
			conn = ConnectionHelper.getConnection();
			ps = conn.prepareStatement(qry, new String[] { "ID" });
			ps.setString(1, hotel.getName());
			ps.setString(2, hotel.getAddress());
			ps.setInt(3, hotel.getStars());
			ps.setString(4, hotel.getCountry());
			ps.setString(5, hotel.getDescription());
			ps.setString(6, hotel.getImage());
			ps.executeUpdate();
			ResultSet rs = ps.getGeneratedKeys();
			rs.next();
			// Actualizar el id del objeto que se devuelve. Esto es importante
			// ya que este valor debe ser devuelto al cliente.
			int id = rs.getInt(1);
			hotel.setId_hotel(id);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return hotel;
	}

	public Hotel update(Hotel hotel) {
		Connection conn = null;
		try {
			conn = ConnectionHelper.getConnection();
			final String qry = "UPDATE hotels SET name=?, address=?, stars=?, country=?, "
					+ "description=?, image=? WHERE id_hotel=?";
			PreparedStatement ps = conn.prepareStatement(qry);
			ps.setString(1, hotel.getName());
			ps.setString(2, hotel.getAddress());
			ps.setInt(3, hotel.getStars());
			ps.setString(4, hotel.getCountry());
			ps.setString(5, hotel.getDescription());
			ps.setString(6, hotel.getImage());
			ps.setInt(7, hotel.getId_hotel());
			ps.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return hotel;
	}

	public boolean remove(int id) {
		Connection conn = null;
		try {
			conn = ConnectionHelper.getConnection();
			PreparedStatement ps = conn.prepareStatement("DELETE FROM hotels WHERE id_hotel=?");
			ps.setInt(1, id);
			int count = ps.executeUpdate();
			return count == 1;
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
	}

	protected Hotel processRow(ResultSet rs) throws SQLException {
		Hotel hotel = new Hotel();
		hotel.setId_hotel(rs.getInt("id_hotel"));
		hotel.setName(rs.getString("name"));
		hotel.setAddress(rs.getString("address"));
		hotel.setStars(rs.getInt("stars"));
		hotel.setCountry(rs.getString("country"));
		hotel.setDescription(rs.getString("description"));
		hotel.setImage(rs.getString("image"));
		return hotel;
	}

}
