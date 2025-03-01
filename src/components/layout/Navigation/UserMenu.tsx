// import { useState, useRef } from "react";
// import { LogOut, Coins, Settings, ChevronDown } from "lucide-react";
// import { useAuth } from "../../../features/auth/hooks/useAuth";
// import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

// export function UserMenu() {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const { user, logOut } = useAuth();

//   useOnClickOutside(menuRef, () => setIsOpen(false));

//   if (!user) return null;

//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center space-x-2 p-2 rounded-xl hover:bg-black/5 transition-colors"
//       >
//         {user.avatar ? (
//           <img
//             src={user.avatar}
//             alt={user.name}
//             className="w-8 h-8 rounded-full object-cover"
//           />
//         ) : (
//           <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
//             <span className="text-sm font-medium">{user.name[0]}</span>
//           </div>
//         )}
//         <span className="font-medium">{user.name}</span>
//         <ChevronDown className="h-4 w-4 text-black/40" />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-black/5 shadow-lg py-2">
//           <div className="px-4 py-3 border-b border-black/5">
//             <div className="font-medium">{user.name}</div>
//             <div className="text-sm text-black/60">{user.email}</div>
//           </div>

//           <div className="px-4 py-3 border-b border-black/5">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center text-sm">
//                 <Coins className="h-4 w-4 mr-2 text-black/40" />
//                 Tokens Available
//               </div>
//               <span className="font-medium">{user.tokens || 0}</span>
//             </div>
//           </div>

//           <div className="py-2">
//             <button className="w-full px-4 py-2 text-left text-sm hover:bg-black/5 transition-colors flex items-center">
//               <Settings className="h-4 w-4 mr-2 text-black/40" />
//               Account Settings
//             </button>
//             <button
//               onClick={logOut}
//               className="w-full px-4 py-2 text-left text-sm hover:bg-black/5 transition-colors flex items-center text-red-600"
//             >
//               <LogOut className="h-4 w-4 mr-2" />
//               Sign Out
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
