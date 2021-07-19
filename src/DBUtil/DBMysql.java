package DBUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.mysql.jdbc.StringUtils;



public class DBMysql {

	String URL ="jdbc:mysql://ip地址:3306/lvyou?characterEncoding=utf8";
	String USER ="用户名";
	String PWD = "密码";
	Connection connection = null;
	PreparedStatement pstmt = null;
	ResultSet res = null;
	
	
		//获取connection对象
		public Connection getConnection () throws ClassNotFoundException, SQLException {
			
			Class.forName("com.mysql.jdbc.Driver");
			Connection connection = DriverManager.getConnection(URL, USER, PWD);
			
			
			return connection;
			
		}
		//获得preparestatement对象
		public PreparedStatement getPreparedStatement(String sql) throws ClassNotFoundException, SQLException {
			
			Connection connection = getConnection();
			pstmt = (PreparedStatement) connection.prepareStatement(sql);
			
			return pstmt;
		}
		//关闭流
		public void shutdown(PreparedStatement pstmt, Connection connection,ResultSet res) throws SQLException {
			
			if (pstmt!=null) {
				pstmt.close();
			}
			if (connection!=null) {
				connection.close();
			}
			if (res!=null) {
				res.close();
			}
			
		
		}
		
		//通用的增删改
		public boolean Upload(String sql,Object[] obj) {
			
			try {
				pstmt = getPreparedStatement(sql);
				
				for(int i = 0; i<obj.length;i++) {
					pstmt.setObject(i+1, obj[i]);
//					System.out.println(obj[i]);
				}
			int count = pstmt.executeUpdate();
			
			if (count>0) {
				return true;
				
			}else {
				return false;
			}
			
			
			
			
			} catch (ClassNotFoundException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}finally {
				try {
					shutdown(pstmt, connection, res);
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			
			
			return false;
			
		}
		//通用的查
		public ResultSet query(String sql,Object[] obj) {

			
			try {
				pstmt = getPreparedStatement(sql);
				
				for(int i=0;i<obj.length;i++) {
					
					pstmt.setObject(i+1, obj[i]);
					
				}
				 res = pstmt.executeQuery();
				 
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
			}
			
			return res;
			
			
		}
		//查询人口数
		public List<HashMap<String, Object>> queryPeopNum(String city) {
			String sql = "select 地区,人口 from "+city+" where id>1";
			Object[] object = {
					
			};
			res = query(sql, object);
			List<HashMap<String, Object>> res1 = new ArrayList<>();

			try {

				while (res.next()) {
					HashMap<String, Object> rk = new HashMap<String, Object>();

					String name = res.getString("地区");
					String value = res.getString("人口");
					rk.put("name", name);
					rk.put("value",value);
					res1.add(rk);
				}
			} catch (Exception e) {
				// TODO: handle exception
			}
			return res1;
		}

		

}
