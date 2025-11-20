import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Lock
} from "lucide-react";

export function AccountManagement() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 사용자 정보를 formData에 로드
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return '정보 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 마지막 로그인 시간 포맷팅
  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return '정보 없음';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  // 이름의 첫 글자 추출
  const getInitial = (name?: string) => {
    if (!name) return '관';
    return name.charAt(0);
  };

  const handleProfileUpdate = () => {
    if (!user) return;

    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      bio: formData.bio,
    });

    toast.success('프로필이 업데이트되었습니다.');
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    // 실제 환경에서는 API 호출
    toast.success('비밀번호가 변경되었습니다.');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500 p-8">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white text-3xl">
              {getInitial(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-1">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">가입일</p>
            <p className="font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
            <p className="text-sm text-gray-600 mt-3">마지막 로그인</p>
            <p className="font-semibold text-gray-900">{formatLastLogin(user.lastLoginAt)}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">개인 정보</h3>
              <p className="text-sm text-gray-500 mt-1">프로필 정보를 관리하세요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">전화번호</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-700">부서</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio" className="text-gray-700">소개</Label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="자신을 소개해주세요..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button 
                onClick={handleProfileUpdate}
                className="bg-green-400 hover:bg-green-500 text-gray-900"
              >
                변경사항 저장
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50"
                onClick={() => {
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    department: user.department || '',
                    bio: user.bio || '',
                  });
                }}
              >
                취소
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">비밀번호 변경</h3>
              <p className="text-sm text-gray-500 mt-1">안전한 비밀번호로 계정을 보호하세요</p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-700">현재 비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="current-password"
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-700">새 비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="new-password"
                    type="password"
                    placeholder="새 비밀번호 입력"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호 다시 입력"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePasswordChange}
              className="bg-green-400 hover:bg-green-500 text-gray-900 mt-6"
            >
              비밀번호 변경
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}