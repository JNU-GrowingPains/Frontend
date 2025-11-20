import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface SignupPageProps {
  onBack: () => void;
}

export function SignupPage({ onBack }: SignupPageProps) {
  const [formData, setFormData] = useState({
    siteName: '',
    siteNameDomain: '',
    shopUrl: '',
    siteManager: '',
    businessCategory: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    const requiredFields = [
      { field: 'siteName', label: '사이트 호칭' },
      { field: 'siteNameDomain', label: '사이트 이름' },
      { field: 'firstName', label: '이름' },
      { field: 'lastName', label: '성' },
      { field: 'email', label: 'Email' },
      { field: 'password', label: '비밀번호' },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`${label}을(를) 입력해주세요.`);
        return;
      }
    }

    if (!agreedToTerms) {
      toast.error('개인정보 제공에 동의해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('회원가입이 완료되었습니다!');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">로그인으로 돌아가기</span>
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl text-gray-900">
              회원가입
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm text-gray-700">
                사이트 호칭
              </Label>
              <Input
                id="siteName"
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder="Cafe24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteNameDomain" className="text-sm text-gray-700">
                사이트 이름 (도메인)
              </Label>
              <Input
                id="siteNameDomain"
                type="text"
                value={formData.siteNameDomain}
                onChange={(e) => handleChange('siteNameDomain', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder="공식 사이트 이름을 말씀주세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopUrl" className="text-sm text-gray-700">
                쇼핑몰 URL (도메인 주소)
              </Label>
              <Input
                id="shopUrl"
                type="text"
                value={formData.shopUrl}
                onChange={(e) => handleChange('shopUrl', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder="https: 성장통.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteManager" className="text-sm text-gray-700">
                사이트 타임존
              </Label>
              <Input
                id="siteManager"
                type="text"
                value={formData.siteManager}
                onChange={(e) => handleChange('siteManager', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder="아시아 / 서울"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory" className="text-sm text-gray-700">
                업종 카테고리 (패션)
              </Label>
              <Input
                id="businessCategory"
                type="text"
                value={formData.businessCategory}
                onChange={(e) => handleChange('businessCategory', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-gray-700">
                  이름
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-gray-700">
                  성
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder=""
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder=""
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label 
                htmlFor="terms" 
                className="text-sm text-gray-700 cursor-pointer"
              >
                개인정보 제공 동의
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a5632] hover:bg-[#143d24] text-white h-12 transition-colors"
            >
              {isLoading ? '가입 중...' : '가입하기'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
