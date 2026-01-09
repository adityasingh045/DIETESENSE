// import { useState } from "react";
// import { supabase } from "../lib/supabase";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) alert(error.message);
//     else alert("Logged in successfully!");
//   };

//   return (
//     <form onSubmit={handleLogin} className="space-y-4">
//       <h2 className="text-xl font-bold">Login</h2>

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

//       <buttons
//         disabled={loading}
//         className="w-full bg-green-500 text-white py-2 rounded"
//       >
//         {loading ? "Signing in..." : "Login"}
//       </button>
//     </form>
//   );
// }
