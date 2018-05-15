package hotels;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
	
	public List<User> findAll() {
		List<User> list = new ArrayList<User>();
		Connection conn = null;
		String sql = "SELECT * FROM users ORDER BY username";
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

	public List<User> findByName(String username) {
		List<User> lista = new ArrayList<User>();
		Connection conn = null;
		String sql = "SELECT * FROM users " + "WHERE UPPER(username) LIKE ? " + "ORDER BY username";
		try {
			conn = ConnectionHelper.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, "%" + username.toUpperCase() + "%");
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

	public User findById(int id) {
		String sql = "SELECT * FROM hotels WHERE id = ?";
		User user = null;
		Connection conn = null;
		try {
			conn = ConnectionHelper.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				user = processRow(rs);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return user;
	}

	public User save(User user) {
		return user.getId() > 0 ? update(user) : create(user);
	}

	public User create(User user) {
		Connection conn = null;
		PreparedStatement ps = null;
		final String qry = "INSERT INTO users (username, email, pass) "
				+ "VALUES (?, ?, ?)";
		try {
			conn = ConnectionHelper.getConnection();
			ps = conn.prepareStatement(qry, new String[] { "ID" });
			ps.setString(1, user.getUsername());
			ps.setString(2, user.getEmail());
			ps.setString(3, user.getPass());
			ps.executeUpdate();
			ResultSet rs = ps.getGeneratedKeys();
			rs.next();
			// Actualizar el id del objeto que se devuelve. Esto es importante
			// ya que este valor debe ser devuelto al cliente.
			int id = rs.getInt(1);
			user.setId(id);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return user;
	}

	public User update(User user) {
		Connection conn = null;
		try {
			conn = ConnectionHelper.getConnection();
			final String qry = "UPDATE users SET username=?, email=?, pass=? WHERE id=?"; 
			PreparedStatement ps = conn.prepareStatement(qry);
			ps.setString(1, user.getUsername());
			ps.setString(2, user.getEmail());
			ps.setString(3, user.getPass());
			ps.setInt(4, user.getId());
			ps.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			ConnectionHelper.close(conn);
		}
		return user;
	}

	public boolean remove(int id) {
		Connection conn = null;
		try {
			conn = ConnectionHelper.getConnection();
			PreparedStatement ps = conn.prepareStatement("DELETE FROM users WHERE id=?");
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

	protected User processRow(ResultSet rs) throws SQLException {
		User user = new User();
		user.setId(rs.getInt("id"));
		user.setUsername(rs.getString("username"));
		user.setEmail(rs.getString("email"));
		user.setPass(rs.getString("pass"));
		return user;
	}

}
