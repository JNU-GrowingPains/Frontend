export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-red-600 text-center">
        <p>오류가 발생했습니다: {message}</p>
        <p className="text-sm text-gray-500 mt-2">페이지를 새로고침해주세요.</p>
      </div>
    </div>
  );
}