// import { useState } from "react";
// import { supabase } from "../lib/supabase";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) alert(error.message);
//     else alert("Registered successfully! Check email if confirmation is enabled.");
//   };

//   return (
//     <form onSubmit={handleRegister} className="space-y-4">
//       <h2 className="text-xl font-bold">Register</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full border p-2"
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full border p-2"
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />

//       <button
//         disabled={loading}
//         className="w-full bg-orange-500 text-white py-2 rounded"
//       >
//         {loading ? "Creating..." : "Register"}
//       </button>
//     </form>
//   );
// }
