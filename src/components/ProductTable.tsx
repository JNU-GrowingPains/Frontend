import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";
import { mockProducts, searchProducts } from "../data/mockData";
import type { Product } from "../types";

interface ProductTableProps {
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
}

const ITEMS_PER_PAGE = 10; // 페이지당 상품 수

export function ProductTable({ selectedProductId, onProductSelect }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 검색된 상품 목록
  const filteredProducts = searchProducts(mockProducts, searchTerm);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // 검색어 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 페이지네이션 버튼 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // 최대 표시할 페이지 번호 수

    if (totalPages <= maxVisible) {
      // 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 페이지가 많으면 현재 페이지 주변만 표시
      if (currentPage <= 3) {
        // 처음 부분
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 끝 부분
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간 부분
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">주요 상품 리스트</h2>
            <p className="text-sm text-gray-500 mt-1">상품을 선택하여 상세 분석을 확인하세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="상품명 또는 카테고리 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
              />
            </div>
            <Button variant="outline" size="sm" className="bg-gray-50 border-gray-200 hover:bg-gray-100">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">상품명</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">상 카테고리</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">중 카테고리</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">소카테고리</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">가격</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">상품번호</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                      selectedProductId === product.id 
                        ? "bg-green-400 hover:bg-green-500 text-gray-900" 
                        : "hover:bg-gray-50 bg-white"
                    }`}
                    onClick={() => onProductSelect(product.id)}
                  >
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product.topCategory}</td>
                    <td className="px-6 py-4 text-gray-600">{product.midCategory}</td>
                    <td className="px-6 py-4 text-gray-600">{product.subCategory}</td>
                    <td className="px-6 py-4 text-gray-600">{product.price}</td>
                    <td className="px-6 py-4 text-gray-600">{product.productNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              전체 {filteredProducts.length}개 중 {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}개 표시
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </Card>
  );
}