import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('이메일 주소를 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
      setEmail('');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      toast.error('이메일 전송 중 오류가 발생했습니다.');
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
            <h1 className="text-2xl text-gray-900 mb-2">
              비밀번호를 잊으셨나요?
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">
                이메일 주소
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder="sungjangtong@gmail.com"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a5632] hover:bg-[#143d24] text-white h-12 transition-colors"
            >
              {isLoading ? '전송 중...' : '이메일 주소로 비밀번호 전송하기'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
