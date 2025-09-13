// src/components/AuthScreen.jsx
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Pastikan import dari context yang benar
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import EggLogo from "./EggLogo";

const Input = (props) => (
  <input {...props} className="w-full h-12 py-4 px-6 bg-white rounded-full border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
);

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Menggunakan fungsi dari AuthContext lokal kita
  const { login, register, loading } = useAuth(); 
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Mohon isi semua kolom", variant: "destructive" });
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      toast({ title: "Error", description: "Password tidak cocok", variant: "destructive" });
      return;
    }

    try {
      if (isLogin) {
        await login(email, password); // Menggunakan fungsi 'login'
        toast({ title: "Sukses!", description: "Berhasil masuk." });
      } else {
        await register(email, password); // Menggunakan fungsi 'register'
        toast({ title: "Sukses!", description: "Akun berhasil dibuat. Silakan login." });
        setIsLogin(true); // Arahkan ke tab login setelah registrasi
      }
    } catch (error) {
       toast({ title: "Error", description: error.message || "Autentikasi gagal", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-20 h-20 mb-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
          <EggLogo className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-12">Eggcelent</h1>
        
        <div className="w-full max-w-sm space-y-4">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center rounded-full transition-all duration-300 font-medium ${
                isLogin ? 'bg-white text-gray-800 shadow-md' : 'text-gray-600'
              }`}
            >
              LOG IN
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center rounded-full transition-all duration-300 font-medium ${
                !isLogin ? 'bg-white text-gray-800 shadow-md' : 'text-gray-600'
              }`}
            >
              SIGN UP
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogin && (
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              {loading ? "Memproses..." : (isLogin ? "LOG IN" : "SIGN UP")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}