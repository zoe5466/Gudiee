'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        const user = data.data?.user || data.user;
        console.log('User role:', user?.role);
        
        if (user?.role !== 'ADMIN' && user?.role !== 'admin') {
          setError('您沒有權限訪問管理後台');
          return;
        }
        
        window.location.href = '/admin';
      } else {
        setError(data.error || data.message || '登入失敗');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('登入時發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>
      
      <div className="w-full max-w-lg relative z-10">
        <Button
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10 mb-8 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 transition-all duration-300"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          返回首頁
        </Button>

        <Card className="bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-6 text-center bg-gradient-to-b from-white to-slate-50 pb-8">
            <div className="flex justify-center">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-xl">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">系統管理中心</CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                請使用管理員權限登入後台系統
              </CardDescription>
              <div className="flex items-center justify-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>系統運作正常</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 rounded-xl">
                  <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 font-semibold text-sm tracking-wide">電子郵件地址</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@guidee.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 pl-4 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-700 font-semibold text-sm tracking-wide">管理員密碼</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="請輸入管理員密碼"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-slate-100 rounded-r-xl px-3 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-500 hover:text-slate-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-500 hover:text-slate-700" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? '登入中...' : '登入'}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <p className="text-sm text-slate-500 font-medium">
                🔒 僅限授權管理員使用
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
                <span>© 2025 Guidee</span>
                <span>•</span>
                <span>安全登入</span>
                <span>•</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-sm">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <p className="font-semibold text-blue-800">測試管理員帳號</p>
              </div>
              <div className="space-y-2 text-blue-700 bg-blue-100/50 rounded-xl p-4">
                <p><span className="font-medium">Email:</span> admin@guidee.com</p>
                <p><span className="font-medium">Password:</span> admin123</p>
              </div>
              <p className="text-xs text-blue-600 mt-3 text-center">⚠️ 僅供開發測試使用</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}