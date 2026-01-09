import { supabase } from "../lib/supabase";

export default function Logout() {
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
      }}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
