import { X } from "lucide-react";

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDrawer({ isOpen, onClose }: LoginDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl p-6 animate-slideIn">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-black" />
          </button>
        </div>

        <p className="text-gray-500 mb-6">
          or <span className="text-orange-500 font-semibold">create an account</span>
        </p>

        {/* PHONE INPUT */}
        <input
          type="tel"
          placeholder="Phone number"
          className="w-full border px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md mt-6">
          LOGIN
        </button>

        <p className="text-xs text-gray-500 mt-4">
          By clicking Login, I accept the{" "}
          <span className="font-semibold">Terms & Conditions</span> &{" "}
          <span className="font-semibold">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
