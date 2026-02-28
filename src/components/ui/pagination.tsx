import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  /** Current page (1-based) */
  currentPage: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Max visible page buttons (excluding first/last/ellipsis) */
  siblingCount?: number;
  /** Custom class */
  className?: string;
}

/** Generate page numbers with ellipsis */
function generatePages(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  // If total pages <= 7, show all
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const leftSibling = Math.max(current - siblings, 2);
  const rightSibling = Math.min(current + siblings, total - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  // Always show first page
  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  } else {
    // Fill pages between 1 and leftSibling
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  // Sibling pages
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let i = rightSibling + 1; i < total; i++) {
      pages.push(i);
    }
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  siblingCount = 1,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = useMemo(
    () => generatePages(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-xl px-4 py-3 shadow-sm",
        className
      )}
    >
      {/* Left: Info text + page size */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Hiển thị{" "}
          <span className="font-semibold text-foreground">{from}</span>
          {" – "}
          <span className="font-semibold text-foreground">{to}</span>
          {" / "}
          <span className="font-semibold text-foreground">{totalItems}</span>
          {" kết quả"}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-2 ml-2">
            <span className="hidden md:inline text-muted-foreground">|</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-[72px] text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt} / trang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: Page buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <PageButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Trang đầu"
          title="Trang đầu"
        >
          <FontAwesomeIcon icon={faAnglesLeft} className="text-[11px]" />
        </PageButton>

        {/* Previous */}
        <PageButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
          title="Trang trước"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-[11px]" />
        </PageButton>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground select-none text-sm"
            >
              ···
            </span>
          ) : (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
              aria-label={`Trang ${page}`}
            >
              {page}
            </PageButton>
          )
        )}

        {/* Next */}
        <PageButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
          title="Trang sau"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-[11px]" />
        </PageButton>

        {/* Last page */}
        <PageButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Trang cuối"
          title="Trang cuối"
        >
          <FontAwesomeIcon icon={faAnglesRight} className="text-[11px]" />
        </PageButton>
      </div>
    </div>
  );
}

/* ---- Internal page button ---- */
interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function PageButton({ active, className, children, disabled, ...props }: PageButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 min-w-[36px] h-9 px-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
          : "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        disabled && !active && "opacity-40 pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
