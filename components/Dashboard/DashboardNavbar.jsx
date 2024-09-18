// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { RiPencilLine } from "react-icons/ri";
// import { usePathname } from "next/navigation";
// function DashboardNavbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const navbarLinks = [
//     {
//       title: "Notes",
//       path: "/dashboard/notes",
//     },
//     {
//       title: "Text Editor",
//       path: "/dashboard/text-editor",
//     },
//   ];
//   const handleLogout = () => {
//     // Clear JWT token from local storage
//     localStorage.removeItem("token");
//     localStorage.removeItem("userEmail");

//     // Optionally clear token from cookies if used
//     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

//     // Redirect to login page
//     router.push("/login");
//   };
//   return (
//     <header className="bg-slate-800 shadow-md p-4 flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <h3 className="font-bold text-white custom-font">Notes</h3>
//         <RiPencilLine className="text-white" />
//       </div>

//       <div>
//         {navbarLinks.map((link, index) => {
//           return (
//             <Link className={""} key={index} href={link.path}>
//               {link.title}
//             </Link>
//           );
//         })}
//       </div>

//       <div className="font-bold text-white cursor-pointer">
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </header>
//   );
// }

// export default DashboardNavbar;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { RiPencilLine } from "react-icons/ri";
import { usePathname } from "next/navigation";

function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const navbarLinks = [
    {
      title: "Notes",
      path: "/dashboard/notes",
    },
    {
      title: "Text Editor",
      path: "/dashboard/text-editor",
    },
  ];

  const handleLogout = () => {
    // Clear JWT token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    // Optionally clear token from cookies if used
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

    // Redirect to login page
    router.push("/login");
  };

  return (
    <header className="bg-slate-800 shadow-md p-4 flex items-center justify-between">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-white custom-font">Notes</h3>
        <RiPencilLine className="text-white" />
      </div>

      {/* Right side: Links and Logout button */}
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-6">
          {navbarLinks.map((link, index) => {
            return (
              <Link
                key={index}
                href={link.path}
                className={`text-white ${
                  pathname === link.path
                    ? "font-bold border-b-2 border-white"
                    : ""
                } hover:text-gray-300`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="font-bold text-white bg-red-600 py-2 px-4 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardNavbar;
