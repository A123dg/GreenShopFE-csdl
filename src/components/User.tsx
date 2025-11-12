// import React, { useEffect, useState } from "react";
// import type { UserResponse } from "../models/user";
// import { userApi } from "../api/userApi";
// import type { ApiResponse } from "../interfaces/ApiResponse";

// const Users: React.FC = () => {
//   const [users, setUsers] = useState<UserResponse[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     const sub = userApi.getUsers().subscribe({
//       next: (res: ApiResponse<UserResponse[]>) => {
//         let userList: UserResponse[] = [];
//         if (Array.isArray(res)) {
//           userList = res;
//         } else if (res?.data && Array.isArray(res.data)) {
//           userList = res.data;
//         } else {
//           setError("Invalid response format");
//         }
//         setUsers(userList);
//         setFilteredUsers(userList);
//         setLoading(false);
//       },
//       error: (err: ApiResponse<UserResponse[]>) => {
//         setError(err?.message || "Unknown error");
//         setLoading(false);
//       },
//     });

//     return () => sub.unsubscribe();
//   }, []);

//   // Lọc danh sách theo từ khóa
//   useEffect(() => {
//     const lowerSearch = searchTerm.toLowerCase();
//     const filtered = users.filter(
//       (u) =>
//         u.username.toLowerCase().includes(lowerSearch) ||
//         u.email.toLowerCase().includes(lowerSearch)
//     );
//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   return (
//     <div className="content">
//       <div className="container mx-auto pt-8 px-6">
//         {/* --- Header: Tiêu đề + Ô tìm kiếm --- */}
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-3xl font-bold text-gray-800">
//             Danh sách người dùng
//           </h3>

//           <input
//             type="text"
//             placeholder="Tìm kiếm người dùng..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* --- Nội dung chính --- */}
//         {loading && <p className="text-gray-500 italic">Loading...</p>}
//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 border border-red-300">
//             {error}
//           </div>
//         )}

//         {!loading && !error && (
//           <div className="overflow-x-auto bg-white shadow-md rounded-xl">
//             <table className="min-w-full text-left border border-gray-200 rounded-lg">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold text-gray-700 border-b">
//                     Username
//                   </th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 border-b">
//                     Email
//                   </th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 border-b">
//                     Ngày sinh
//                   </th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 border-b">
//                     Vai trò
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((u, i) => (
//                     <tr
//                       key={i}
//                       className={`${
//                         i % 2 === 0 ? "bg-white" : "bg-gray-50"
//                       } hover:bg-gray-100 transition-colors`}
//                     >
//                       <td className="px-4 py-2 border-b">{u.username}</td>
//                       <td className="px-4 py-2 border-b">{u.email}</td>
//                       <td className="px-4 py-2 border-b">{u.dob}</td>
//                       <td className="px-4 py-2 border-b">{u.role}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="text-center text-gray-500 py-4 border-b"
//                     >
//                       Không có người dùng nào phù hợp
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Users;
