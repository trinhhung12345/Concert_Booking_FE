import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  faSearch,
  faHistory,
  faBars,
  faRightFromBracket,
  faUser,
  faSignInAlt,
  faChartPie, // Icon cho trang quản lý
  faGlobe // Icon quả địa cầu
} from "@fortawesome/free-solid-svg-icons";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Store & Utils
import { useAuthStore } from "@/store/useAuthStore";
import { eventService, type Event } from "@/features/concerts/services/eventService";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook lấy đường dẫn hiện tại
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
    // Xử lý debounce cho search
    useEffect(() => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      const handler = setTimeout(async () => {
        setSearchLoading(true);
        try {
          const res = await eventService.search(searchQuery.trim());
          const events = res.data ? res.data : res;
          setSuggestions(events.slice(0, 6)); // Hiện tối đa 6 gợi ý
          setShowDropdown(true);
        } catch (e) {
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setSearchLoading(false);
        }
      }, 350); // debounce 350ms
      return () => clearTimeout(handler);
    }, [searchQuery]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          inputRef.current &&
          !inputRef.current.contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  // Hàm xử lý tìm kiếm
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await eventService.search(searchQuery.trim());
      // Nếu API trả về .data thì lấy .data, còn không thì lấy trực tiếp
      const events: Event[] = res.data ? res.data : res;
      // Chuyển đổi dữ liệu về EventProps[] như HomePage
      const transformedEvents = events.map((item: Event) => {
        let minPrice = 0;
        const allPrices: number[] = [];
        if (item.showings && item.showings.length > 0) {
          item.showings.forEach(show => {
            if (show.types && show.types.length > 0) {
              show.types.forEach(ticket => allPrices.push(ticket.price));
            }
          });
        }
        if (allPrices.length > 0) {
          minPrice = Math.min(...allPrices);
        }
        const firstDate = item.showings && item.showings.length > 0
          ? item.showings[0].startTime
          : new Date().toISOString();
        const image = item.files && item.files.length > 0 && item.files[0].thumbUrl
          ? item.files[0].thumbUrl
          : "https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=800&auto=format&fit=crop";
        return {
          id: item.id,
          title: item.title,
          imageUrl: image,
          minPrice: minPrice,
          date: firstDate,
          category: item.categoryName
        };
      });
      // Chuyển hướng sang trang chủ với state chứa kết quả tìm kiếm
      navigate("/", { state: { searchResults: transformedEvents, searchQuery } });
    } catch (error) {
      // Có thể hiển thị toast lỗi ở đây
      console.error("Lỗi tìm kiếm sự kiện:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check xem user có phải admin không
  const isAdmin = user?.role?.roleName === "ADMIN";

  // Check xem đang ở trang admin hay trang thường
  const isAdminPage = location.pathname.startsWith("/admin");

  // Component Logo dùng chung
  const Logo = () => (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-all duration-300">
        <FontAwesomeIcon icon={faTicket} className="text-xl" />
      </div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600 font-sans tracking-tight">
        TixCon
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* 1. LOGO (Trái) */}
        <Logo />

        {/* 2. SEARCH BAR (Giữa - Chỉ hiện trên Desktop/Tablet) */}
        {!isAdminPage && (
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form className="w-full" onSubmit={handleSearch} autoComplete="off">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm sự kiện,..."
                className="pl-10 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary transition-all duration-300"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                disabled={searchLoading}
                onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              />
              <button type="submit" className="hidden" aria-label="Tìm kiếm" />
            </form>
            {/* Dropdown gợi ý */}
            {showDropdown && suggestions.length > 0 && (
              <div ref={dropdownRef} className="absolute left-0 top-12 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto animate-fade-in">
                {suggestions.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery("");
                      navigate(`/event/${event.id}`);
                    }}
                  >
                    <img src={event.files && event.files[0]?.thumbUrl ? event.files[0].thumbUrl : 'https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=800&auto=format&fit=crop'} alt={event.title} className="w-10 h-10 rounded-lg object-cover border" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 line-clamp-1">{event.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{event.venue}</div>
                    </div>
                  </div>
                ))}
                {searchLoading && (
                  <div className="px-4 py-2 text-sm text-gray-400">Đang tìm kiếm...</div>
                )}
                {!searchLoading && suggestions.length === 0 && (
                  <div className="px-4 py-2 text-sm text-gray-400">Không tìm thấy sự kiện phù hợp.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. ACTIONS (Phải) */}
        <div className="flex items-center gap-4">

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* NÚT CHUYỂN ĐỔI TRANG QUẢN LÝ (Chỉ hiện cho Admin) */}
                {isAdmin && (
                    isAdminPage ? (
                        <Link to="/">
                            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                <FontAwesomeIcon icon={faGlobe} />
                                Về Website
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/admin">
                            <Button className="gap-2 bg-gray-800 text-white hover:bg-gray-900">
                                <FontAwesomeIcon icon={faChartPie} />
                                Trang Quản Lý
                            </Button>
                        </Link>
                    )
                )}

                {/* Nút Lịch sử vé (Ẩn ở trang admin cho đỡ rối) */}
                {!isAdminPage && (
                  <Link to="/tickets">
                      <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-pink-50 gap-2">
                      <FontAwesomeIcon icon={faHistory} />
                      <span>Vé của tôi</span>
                      </Button>
                  </Link>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                        <AvatarImage src="" alt={user?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        {/* Hiện Role trong menu cho ngầu */}
                        {isAdmin && <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full w-fit mt-1">ADMIN</span>}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
                      <span>Cá nhân</span>
                    </DropdownMenuItem>

                    {/* Mục menu chuyển trang cho Mobile */}
                    {isAdmin && (
                         <DropdownMenuItem className="cursor-pointer md:hidden" onClick={() => navigate(isAdminPage ? "/" : "/admin")}>
                            <FontAwesomeIcon icon={isAdminPage ? faGlobe : faChartPie} className="mr-2 h-4 w-4" />
                            <span>{isAdminPage ? "Về Website" : "Trang Quản Lý"}</span>
                         </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="cursor-pointer md:hidden">
                      {/* Trên mobile thì hiện ticket trong menu này luôn */}
                      <FontAwesomeIcon icon={faHistory} className="mr-2 h-4 w-4" />
                      <span>Vé của tôi</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary" className="gap-2">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Đăng nhập</span>
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU (Hamburger) - Chỉ hiện trên Mobile */}
          <div className="md:hidden flex items-center gap-2">
             {/* Icon search nhỏ cho mobile */}
             <Button variant="ghost" size="icon" className="text-gray-600">
                <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
             </Button>

             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-gray-700" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col gap-6 mt-6">
                        <Logo />

                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-white">
                                            {user?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <nav className="flex flex-col gap-2">
                                    {/* Link chuyển trang quản lý cho Mobile */}
                                    {isAdmin && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 border-gray-300"
                                            onClick={() => navigate(isAdminPage ? "/" : "/admin")}
                                        >
                                            <FontAwesomeIcon icon={isAdminPage ? faGlobe : faChartPie} />
                                            {isAdminPage ? "Về Website" : "Trang Quản Lý"}
                                        </Button>
                                    )}

                                    <Link to="/profile">
                                        <Button variant="ghost" className="w-full justify-start gap-3">
                                            <FontAwesomeIcon icon={faUser} /> Cá nhân
                                        </Button>
                                    </Link>

                                    <Link to="/tickets">
                                        <Button variant="ghost" className="w-full justify-start gap-3">
                                            <FontAwesomeIcon icon={faHistory} /> Vé của tôi
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 text-red-600 hover:text-red-600 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
                                    </Button>
                                </nav>
                            </div>
                        ) : (
                            <Link to="/login" className="w-full">
                                <Button variant="secondary" className="w-full gap-2">
                                    <FontAwesomeIcon icon={faSignInAlt} />
                                    <span>Đăng nhập</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </SheetContent>
             </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
