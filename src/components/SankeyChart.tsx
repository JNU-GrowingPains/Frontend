import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from "d3-sankey";
import type { SankeyData } from "../types";

// 노드별 색상 지정
const nodeColors: Record<string, string> = {
  // 매체 유입 경로 색상
  "검색엔진": "#10b981",
  "SNS 광고": "#3b82f6",
  "직접 방문": "#f59e0b",
  "이메일": "#8b5cf6",
  "홈페이지": "#6366f1",
  "상품 페이지": "#ec4899",
  "회원가입": "#22c55e",
  "구매": "#ef4444",
  // 구매 여정 색상 (호환성 유지)
  "광고 클릭": "#10b981",
  "장바구니": "#f59e0b",
  "결제 시작": "#8b5cf6",
  "구매 완료": "#22c55e",
  "이탈": "#ef4444",
};



interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
}

export function SankeyChart({
  data,
  width = 800,
  height = 400,
  nodeWidth = 20,
  nodePadding = 10,
}: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || !data.links) return;

    try {
      // SVG 초기화
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Sankey 레이아웃 생성
      const sankeyGenerator = sankey<SankeyNode<any, any>, SankeyLink<any, any>>()
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([
          [10, 10],
          [width - 10, height - 10],
        ]);

      // 데이터 준비 - 노드 복사
      const nodes = data.nodes.map((d) => ({ ...d }));
      
      // 링크 데이터 변환 - source/target 인덱스를 노드 객체로 변환
      const links = data.links.map((d) => {
        const sourceNode = nodes[d.source as number];
        const targetNode = nodes[d.target as number];
        
        if (!sourceNode || !targetNode) {
          console.warn('Invalid link:', d);
          return null;
        }
        
        return {
          source: sourceNode,
          target: targetNode,
          value: d.value,
        };
      }).filter((link): link is NonNullable<typeof link> => link !== null);

      if (links.length === 0) {
        console.warn('No valid links found');
        return;
      }

      // Sankey 레이아웃 적용
      const graph = sankeyGenerator({
        nodes,
        links,
      });

      // 링크 그리기
      const link = svg
        .append("g")
        .selectAll("path")
        .data(graph.links)
        .join("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", (d: any) => {
          const sourceColor = nodeColors[d.source.name] || "#6b7280";
          return d3.color(sourceColor)?.darker(0.5).toString() || sourceColor;
        })
        .attr("stroke-width", (d: any) => Math.max(1, d.width))
        .attr("fill", "none")
        .attr("opacity", 0.5)
        .on("mouseenter", function () {
          d3.select(this).attr("opacity", 0.8);
        })
        .on("mouseleave", function () {
          d3.select(this).attr("opacity", 0.5);
        });

      link
        .append("title")
        .text((d: any) => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

      // 노드 그리기
      const node = svg
        .append("g")
        .selectAll("g")
        .data(graph.nodes)
        .join("g");

      node
        .append("rect")
        .attr("x", (d: any) => d.x0)
        .attr("y", (d: any) => d.y0)
        .attr("height", (d: any) => d.y1 - d.y0)
        .attr("width", (d: any) => d.x1 - d.x0)
        .attr("fill", (d: any) => nodeColors[d.name] || "#6b7280")
        .attr("rx", 4)
        .attr("ry", 4)
        .append("title")
        .text((d: any) => `${d.name}\n${d.value?.toLocaleString() || ""}`);

      // 노드 레이블
      node
        .append("text")
        .attr("x", (d: any) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
        .attr("y", (d: any) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d: any) => (d.x0 < width / 2 ? "start" : "end"))
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .attr("fill", "#374151")
        .text((d: any) => d.name);
    } catch (error) {
      console.error('Error rendering Sankey chart:', error);
    }
  }, [data, width, height, nodeWidth, nodePadding]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

// 반응형 래퍼 컴포넌트
export function ResponsiveSankeyChart({ data }: { data: SankeyData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 500 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const containerWidth = containerRef.current!.clientWidth;
      // 컨테이너 너비에 맞추되, 최소 너비와 높이 보장
      const width = Math.max(800, containerWidth - 48); // padding 고려
      const height = Math.max(500, width * 0.42); // 약 2.4:1 비율
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <SankeyChart 
        data={data}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}


