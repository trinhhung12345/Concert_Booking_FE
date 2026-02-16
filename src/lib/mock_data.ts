/**
 * Mock Data từ SQL Dump (Dump20260215.txt)
 * Dữ liệu này được dump từ database concertapp ngày 2026-02-15
 */

// ============ ROLES ============
export interface Role {
  id: number;
  name: string;
  note: string | null;
  objectId: number;
  type: number; // 0: ADMIN, 1: USER
  status: number;
  createdAt: string;
  updatedAt: string;
}

export const mockRoles: Role[] = [
  {
    id: 1,
    name: "ADMIN",
    note: null,
    objectId: 0,
    type: 0,
    status: 1,
    createdAt: "2026-02-10T18:29:11.378000",
    updatedAt: "2026-02-10T18:29:11.378000",
  },
  {
    id: 2,
    name: "USER",
    note: null,
    objectId: 0,
    type: 1,
    status: 1,
    createdAt: "2026-02-10T18:29:11.408000",
    updatedAt: "2026-02-10T18:29:11.408000",
  },
];

// ============ USERS ============
export interface User {
  id: number;
  email: string;
  name: string;
  password: string; // Already hashed
  phone: string;
  address: string | null;
  code: string | null;
  roleId: number;
  roleName?: string;
  status: number;
  birthday: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@ticketboss.com",
    name: "Administrator",
    password: "$2a$10$1GYq5JqfvWPPHC7w2rcm0uHkzOdMLffREk0O79aqvqB5zi7Twg77S",
    phone: "0000000000",
    address: null,
    code: null,
    roleId: 1,
    roleName: "ADMIN",
    status: 1,
    birthday: null,
    createdAt: "2026-02-10T18:29:11.484000",
    updatedAt: "2026-02-13T18:14:59.553000",
  },
  {
    id: 2,
    email: "uchihabigio@gmail.com",
    name: "Trần Quốc Thái",
    password: "$2a$10$ibrrLM9F3ItIhR/eZF4dReBo7T1RbItuYfebpvFDbGP8mUiHCizl6",
    phone: "0982957084",
    address: "20b ngo 77 Quan Hoa Cau Giay",
    code: "9MCB4F8E",
    roleId: 2,
    roleName: "USER",
    status: 1,
    birthday: "2026-02-05T17:00:00.000000",
    createdAt: "2026-02-13T19:39:14.377000",
    updatedAt: "2026-02-13T19:39:17.763000",
  },
];

// ============ CATEGORIES ============
export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Rock",
    description: "Bùng cháy với ngọn lửa",
    active: true,
    createdAt: "2026-02-12T16:54:09.581000",
    updatedAt: "2026-02-12T16:54:09.581000",
  },
];

// ============ UPLOAD FILES ============
export interface UploadFile {
  id: number;
  eventId: number;
  type: number; // 0: image, 1: youtube
  originUrl: string;
  thumbUrl: string | null;
  originFilePath: string;
  thumbFilePath: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  size: number | null;
  createdAt: string;
  updatedAt: string;
}

export const mockUploadFiles: UploadFile[] = [
  {
    id: 4,
    eventId: 2,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770918303/events/2/1770918301038.jpg",
    thumbUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770918303/events/2/1770918301038.jpg",
    originFilePath: "events/2/1770918301038",
    thumbFilePath: "events/2/1770918301038",
    width: 2025,
    height: 2700,
    duration: null,
    size: 867538,
    createdAt: "2026-02-12T17:45:11.103000",
    updatedAt: "2026-02-12T17:45:11.103000",
  },
  {
    id: 5,
    eventId: 2,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770918306/events/2/1770918304678.jpg",
    thumbUrl: null,
    originFilePath: "events/2/1770918304678",
    thumbFilePath: null,
    width: 1259,
    height: 708,
    duration: null,
    size: 240374,
    createdAt: "2026-02-12T17:45:11.108000",
    updatedAt: "2026-02-12T17:45:11.108000",
  },
  {
    id: 6,
    eventId: 2,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770918310/events/2/1770918307039.png",
    thumbUrl: null,
    originFilePath: "events/2/1770918307039",
    thumbFilePath: null,
    width: 1000,
    height: 667,
    duration: null,
    size: 1139918,
    createdAt: "2026-02-12T17:45:11.109000",
    updatedAt: "2026-02-12T17:45:11.109000",
  },
  {
    id: 7,
    eventId: 2,
    type: 1, // YouTube
    originUrl: "https://www.youtube.com/watch?v=I5U7uMgey9U",
    thumbUrl: "https://img.youtube.com/vi/I5U7uMgey9U/hqdefault.jpg",
    originFilePath: null,
    thumbFilePath: null,
    width: null,
    height: null,
    duration: null,
    size: null,
    createdAt: "2026-02-12T17:45:11.110000",
    updatedAt: "2026-02-12T17:45:11.110000",
  },
  {
    id: 10,
    eventId: 1,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770920654/events/1/1770920653125.jpg",
    thumbUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770920654/events/1/1770920653125.jpg",
    originFilePath: "events/1/1770920653125",
    thumbFilePath: "events/1/1770920653125",
    width: 480,
    height: 640,
    duration: null,
    size: 61267,
    createdAt: "2026-02-12T18:24:20.310000",
    updatedAt: "2026-02-12T18:24:20.310000",
  },
  {
    id: 11,
    eventId: 1,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770920657/events/1/1770920655356.jpg",
    thumbUrl: null,
    originFilePath: "events/1/1770920655356",
    thumbFilePath: null,
    width: 1191,
    height: 670,
    duration: null,
    size: 262394,
    createdAt: "2026-02-12T18:24:20.332000",
    updatedAt: "2026-02-12T18:24:20.332000",
  },
  {
    id: 12,
    eventId: 1,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1770920659/events/1/1770920657739.png",
    thumbUrl: null,
    originFilePath: "events/1/1770920657739",
    thumbFilePath: null,
    width: 820,
    height: 312,
    duration: null,
    size: 291013,
    createdAt: "2026-02-12T18:24:20.334000",
    updatedAt: "2026-02-12T18:24:20.334000",
  },
  {
    id: 13,
    eventId: 1,
    type: 1, // YouTube
    originUrl: "https://www.youtube.com/watch?v=OoHlB0wSO1U",
    thumbUrl: "https://img.youtube.com/vi/OoHlB0wSO1U/hqdefault.jpg",
    originFilePath: null,
    thumbFilePath: null,
    width: null,
    height: null,
    duration: null,
    size: null,
    createdAt: "2026-02-12T18:24:20.336000",
    updatedAt: "2026-02-12T18:24:20.336000",
  },
  {
    id: 14,
    eventId: 3,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1771006667/events/3/1771006666265.jpg",
    thumbUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1771006667/events/3/1771006666265.jpg",
    originFilePath: "events/3/1771006666265",
    thumbFilePath: "events/3/1771006666265",
    width: 250,
    height: 333,
    duration: null,
    size: 38738,
    createdAt: "2026-02-13T18:17:50.027000",
    updatedAt: "2026-02-13T18:17:50.027000",
  },
  {
    id: 15,
    eventId: 3,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1771006668/events/3/1771006668529.jpg",
    thumbUrl: null,
    originFilePath: "events/3/1771006668529",
    thumbFilePath: null,
    width: 272,
    height: 153,
    duration: null,
    size: 20421,
    createdAt: "2026-02-13T18:17:50.032000",
    updatedAt: "2026-02-13T18:17:50.032000",
  },
  {
    id: 16,
    eventId: 4,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1771011614/events/4/1771011612845.jpg",
    thumbUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1771011614/events/4/1771011612845.jpg",
    originFilePath: "events/4/1771011612845",
    thumbFilePath: "events/4/1771011612845",
    width: 709,
    height: 945,
    duration: null,
    size: 313278,
    createdAt: "2026-02-13T19:40:17.361000",
    updatedAt: "2026-02-13T19:40:17.361000",
  },
  {
    id: 17,
    eventId: 4,
    type: 0,
    originUrl: "https://res.cloudinary.com/dzxthw4yr/image/upload/v1771011616/events/4/1771011615456.jpg",
    thumbUrl: null,
    originFilePath: "events/4/1771011615456",
    thumbFilePath: null,
    width: 500,
    height: 281,
    duration: null,
    size: 52109,
    createdAt: "2026-02-13T19:40:17.366000",
    updatedAt: "2026-02-13T19:40:17.366000",
  },
  {
    id: 18,
    eventId: 4,
    type: 1, // YouTube
    originUrl: "asd",
    thumbUrl: "https://img.youtube.com/vi/asd/hqdefault.jpg",
    originFilePath: null,
    thumbFilePath: null,
    width: null,
    height: null,
    duration: null,
    size: null,
    createdAt: "2026-02-13T19:40:17.368000",
    updatedAt: "2026-02-13T19:40:17.368000",
  },
];

// ============ EVENTS ============
export interface Event {
  id: number;
  title: string;
  venue: string;
  address: string;
  description: string;
  categoryId: number;
  categoryName: string;
  files: UploadFile[];
  showings: Showing[];
  youtubeUrl?: string | null;
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Insomnium - KARMØYGEDDON",
    venue: "Karmøygeddon Metal Festival",
    address: "Korpervik, Norway",
    description: `<p>Nekromantheon&nbsp;is&nbsp;a&nbsp;legendary&nbsp;Norwegian&nbsp;thrash&nbsp;metal&nbsp;band&nbsp;known&nbsp;for&nbsp;relentless&nbsp;riffs,&nbsp;savage&nbsp;speed&nbsp;and&nbsp;pure&nbsp;old‑school&nbsp;aggression.&nbsp;The&nbsp;band&nbsp;has&nbsp;previously&nbsp;torn&nbsp;up&nbsp;Karmøygeddon,&nbsp;proving&nbsp;exactly&nbsp;why&nbsp;they're&nbsp;regarded&nbsp;as&nbsp;one&nbsp;of&nbsp;Norway's&nbsp;fiercest&nbsp;thrash&nbsp;acts.&nbsp;&nbsp;Black&nbsp;Nights&nbsp;Friday&nbsp;18th&nbsp;of&nbsp;September?</p>`,
    categoryId: 1,
    categoryName: "Rock",
    files: mockUploadFiles.filter((f) => f.eventId === 1),
    showings: [],
  },
  {
    id: 2,
    title: "MAN WITH A MISSION - DEAD POP FESTIVAL",
    venue: "Higashiogishima East Park",
    address: "58-1 Higashiogishima, Kawasaki Ward, 210-0869, Kawasaki, Japan",
    description: `<p>LỄ&nbsp;HỘI&nbsp;POP&nbsp;DEAD&nbsp;2026&nbsp;là&nbsp;lễ&nbsp;hội&nbsp;âm&nbsp;nhạc&nbsp;ngoài&nbsp;trời&nbsp;sôi&nbsp;động&nbsp;thường&nbsp;niên&nbsp;do&nbsp;ban&nbsp;nhạc&nbsp;metalcore/reggae-punk&nbsp;nổi&nbsp;tiếng&nbsp;của&nbsp;Nhật&nbsp;Bản&nbsp;tổ&nbsp;chức.&nbsp;SiMKhác&nbsp;với&nbsp;truyền&nbsp;thống&nbsp;tổ&nbsp;chức&nbsp;vào&nbsp;mùa&nbsp;hè,&nbsp;lễ&nbsp;hội&nbsp;năm&nbsp;2026&nbsp;sẽ&nbsp;được&nbsp;tổ&nbsp;chức&nbsp;vào&nbsp;mùa&nbsp;xuân,&nbsp;ngày&nbsp;4&nbsp;và&nbsp;5&nbsp;tháng&nbsp;4&nbsp;tại&nbsp;địa&nbsp;điểm&nbsp;đặc&nbsp;biệt&nbsp;là&nbsp;Công&nbsp;viên&nbsp;Higashi-Ogishima&nbsp;Higashi&nbsp;ở&nbsp;thành&nbsp;phố&nbsp;Kawasaki.&nbsp;Sự&nbsp;kiện&nbsp;kéo&nbsp;dài&nbsp;hai&nbsp;ngày&nbsp;này&nbsp;nổi&nbsp;tiếng&nbsp;với&nbsp;năng&nbsp;lượng&nbsp;mạnh&nbsp;mẽ&nbsp;và&nbsp;quy&nbsp;tụ&nbsp;dàn&nbsp;nghệ&nbsp;sĩ&nbsp;hùng&nbsp;hậu&nbsp;gồm&nbsp;những&nbsp;ban&nbsp;nhạc&nbsp;nổi&nbsp;tiếng&nbsp;và&nbsp;đình&nbsp;đám&nbsp;nhất&nbsp;trong&nbsp;làng&nbsp;nhạc&nbsp;Nhật&nbsp;Bản.</p>`,
    categoryId: 1,
    categoryName: "Rock",
    files: mockUploadFiles.filter((f) => f.eventId === 2),
    showings: [],
  },
  {
    id: 3,
    title: "a",
    venue: "a",
    address: "a",
    description: "<p>a</p>",
    categoryId: 1,
    categoryName: "Rock",
    files: mockUploadFiles.filter((f) => f.eventId === 3),
    showings: [],
  },
  {
    id: 4,
    title: "asd",
    venue: "asd",
    address: "asd",
    description: "<p>asd</p>",
    categoryId: 1,
    categoryName: "Rock",
    files: mockUploadFiles.filter((f) => f.eventId === 4),
    showings: [],
  },
];

// ============ TICKET TYPES ============
export interface TicketType {
  id: number;
  name: string;
  description: string;
  color: string;
  isFree: boolean;
  price: number;
  originalPrice: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  quantity: number;
  remainingQuantity: number;
  startTime: string;
  endTime: string;
  position: number;
  status: string;
  imageUrl: string;
  showingId: number;
}

export const mockTicketTypes: TicketType[] = [
  {
    id: 1,
    name: "thuong",
    description: "thuong",
    color: "#af3c77",
    isFree: false,
    price: 10000,
    originalPrice: 10000,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-12T11:53:44.000000",
    endTime: "2026-02-21T13:50:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 1,
  },
  {
    id: 2,
    name: "vip",
    description: "vip",
    color: "#FF0082",
    isFree: false,
    price: 90000,
    originalPrice: 90000,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-12T11:53:44.000000",
    endTime: "2026-02-21T13:50:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 1,
  },
  {
    id: 3,
    name: "Tieu chuan",
    description: "Tieu chuan",
    color: "#7d4ee9",
    isFree: false,
    price: 660000,
    originalPrice: 660000,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-13T08:50:52.000000",
    endTime: "2026-02-14T15:48:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 2,
  },
  {
    id: 4,
    name: "VIP",
    description: "VIP",
    color: "#51b1fb",
    isFree: false,
    price: 1500000,
    originalPrice: 1500000,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-13T08:50:52.000000",
    endTime: "2026-02-14T15:48:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 2,
  },
  {
    id: 5,
    name: "a",
    description: "a",
    color: "#FF0082",
    isFree: false,
    price: 123456,
    originalPrice: 123456,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-13T11:18:04.000000",
    endTime: "2026-03-05T00:22:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 3,
  },
  {
    id: 6,
    name: "q",
    description: "123",
    color: "#FF0082",
    isFree: false,
    price: 123123,
    originalPrice: 123123,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-13T12:40:38.000000",
    endTime: "2026-02-27T19:40:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 4,
  },
  {
    id: 7,
    name: "123213",
    description: "123123132",
    color: "#f0dc00",
    isFree: false,
    price: 123123,
    originalPrice: 123123,
    maxQtyPerOrder: 4,
    minQtyPerOrder: 1,
    quantity: 100,
    remainingQuantity: 100,
    startTime: "2026-02-13T12:40:38.000000",
    endTime: "2026-02-27T19:40:00.000000",
    position: 1,
    status: "ACTIVE",
    imageUrl: "https://placehold.co/100x100?text=Ticket",
    showingId: 4,
  },
];

// ============ SHOWINGS ============
export interface Showing {
  id: number;
  eventId: number;
  status: string;
  isSalable: boolean;
  startTime: string;
  endTime: string;
  types: TicketType[];
}

export const mockShowings: Showing[] = [
  {
    id: 1,
    eventId: 1,
    status: "ACTIVE",
    isSalable: true,
    startTime: "2026-02-21T11:50:00.000000",
    endTime: "2026-02-21T13:50:00.000000",
    types: mockTicketTypes.filter((t) => t.showingId === 1),
  },
  {
    id: 2,
    eventId: 2,
    status: "ACTIVE",
    isSalable: true,
    startTime: "2026-02-14T12:47:00.000000",
    endTime: "2026-02-14T15:48:00.000000",
    types: mockTicketTypes.filter((t) => t.showingId === 2),
  },
  {
    id: 3,
    eventId: 3,
    status: "ACTIVE",
    isSalable: true,
    startTime: "2026-02-14T11:21:00.000000",
    endTime: "2026-03-05T00:22:00.000000",
    types: mockTicketTypes.filter((t) => t.showingId === 3),
  },
  {
    id: 4,
    eventId: 4,
    status: "ACTIVE",
    isSalable: true,
    startTime: "2026-02-14T19:40:00.000000",
    endTime: "2026-02-27T19:40:00.000000",
    types: mockTicketTypes.filter((t) => t.showingId === 4),
  },
];

// ============ SEAT MAPS ============
export interface SeatMap {
  id: number;
  name: string;
  showingId: number;
  status: number;
  viewbox: string;
  sections: SeatMapSection[];
}

export const mockSeatMaps: SeatMap[] = [
  {
    id: 1,
    name: "Sơ đồ ghế cho suất #1",
    showingId: 1,
    status: 1,
    viewbox: "0 0 1200 800",
    sections: [],
  },
  {
    id: 2,
    name: "Sơ đồ ghế cho suất #2",
    showingId: 2,
    status: 1,
    viewbox: "0 0 1200 800",
    sections: [],
  },
  {
    id: 3,
    name: "Sơ đồ ghế cho suất #4",
    showingId: 4,
    status: 1,
    viewbox: "0 0 1200 800",
    sections: [],
  },
];

// ============ SEAT MAP SECTIONS ============
export interface SeatMapSectionAttribute {
  id: number;
  sectionId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  fill: string;
  status: string | null;
}

export interface SeatMapSection {
  id: number;
  name: string;
  seatMapId: number;
  ticketTypeId: number | null;
  isStage: boolean;
  isSalable: boolean;
  isReservingSeat: boolean;
  status: number;
  message: string;
  attribute: SeatMapSectionAttribute | null;
}

export const mockSeatMapSectionAttributes: SeatMapSectionAttribute[] = [
  {
    id: 1,
    sectionId: 1,
    x: 50,
    y: 50,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#808080",
    status: null,
  },
  {
    id: 2,
    sectionId: 2,
    x: 310,
    y: 108,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#af3c77",
    status: null,
  },
  {
    id: 3,
    sectionId: 3,
    x: 286.96,
    y: 254.06,
    width: 195.34,
    height: 130.23,
    scaleX: 1.2,
    scaleY: 1.2,
    rotate: 0,
    fill: "#eeeeee",
    status: "0",
  },
  {
    id: 4,
    sectionId: 4,
    x: 522,
    y: 258,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#7d4ee9",
    status: null,
  },
  {
    id: 5,
    sectionId: 5,
    x: 64,
    y: 243,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#7d4ee9",
    status: null,
  },
  {
    id: 6,
    sectionId: 6,
    x: 286,
    y: 422,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#51b1fb",
    status: null,
  },
  {
    id: 7,
    sectionId: 7,
    x: 292,
    y: 57,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#808080",
    status: "0",
  },
  {
    id: 8,
    sectionId: 8,
    x: 263,
    y: 62,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#FF0082",
    status: null,
  },
  {
    id: 9,
    sectionId: 9,
    x: 165,
    y: 286,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#FF0082",
    status: null,
  },
  {
    id: 10,
    sectionId: 10,
    x: 476,
    y: 282,
    width: 200,
    height: 150,
    scaleX: 1.0,
    scaleY: 1.0,
    rotate: 0,
    fill: "#f0dc00",
    status: null,
  },
];

export const mockSeatMapSections: SeatMapSection[] = [
  {
    id: 1,
    name: "Sân khấu",
    seatMapId: 1,
    ticketTypeId: null,
    isStage: true,
    isSalable: false,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 1) || null,
  },
  {
    id: 2,
    name: "thuong",
    seatMapId: 1,
    ticketTypeId: 1,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 2) || null,
  },
  {
    id: 3,
    name: "STAGE",
    seatMapId: 2,
    ticketTypeId: null,
    isStage: true,
    isSalable: false,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 3) || null,
  },
  {
    id: 4,
    name: "Thuong",
    seatMapId: 2,
    ticketTypeId: 3,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 4) || null,
  },
  {
    id: 5,
    name: "Thuong",
    seatMapId: 2,
    ticketTypeId: 3,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 5) || null,
  },
  {
    id: 6,
    name: "VIP",
    seatMapId: 2,
    ticketTypeId: 4,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 6) || null,
  },
  {
    id: 7,
    name: "Khu vực 5",
    seatMapId: 2,
    ticketTypeId: null,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 0,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 7) || null,
  },
  {
    id: 8,
    name: "Khu vực 1",
    seatMapId: 3,
    ticketTypeId: null,
    isStage: true,
    isSalable: false,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 8) || null,
  },
  {
    id: 9,
    name: "Khu vực 2",
    seatMapId: 3,
    ticketTypeId: 6,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 9) || null,
  },
  {
    id: 10,
    name: "Khu vực 3",
    seatMapId: 3,
    ticketTypeId: 7,
    isStage: false,
    isSalable: true,
    isReservingSeat: false,
    status: 1,
    message: "",
    attribute: mockSeatMapSectionAttributes.find((a) => a.sectionId === 10) || null,
  },
];

// ============ SEATS ============
export type SeatStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "DISABLED";

export interface Seat {
  id: number;
  code: string;
  rowIndex: number;
  colIndex: number;
  sectionId: number;
  status: SeatStatus;
  isSalable: boolean;
}

export const mockSeats: Seat[] = [
  // Section 2 (thuong) - 5 rows x 8 cols = 40 seats
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      id: row * 8 + col + 1,
      code: `t${row + 1}-${col + 1}`,
      rowIndex: row + 1,
      colIndex: col + 1,
      sectionId: 2,
      status: (row === 0 && col < 4) ? "SOLD" as SeatStatus : "AVAILABLE" as SeatStatus,
      isSalable: true,
    }))
  ).flat(),
  // Section 4 (Thuong) - 5 rows x 8 cols = 40 seats
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      id: 40 + row * 8 + col + 1,
      code: `T${row + 1}-${col + 1}`,
      rowIndex: row + 1,
      colIndex: col + 1,
      sectionId: 4,
      status: "AVAILABLE" as SeatStatus,
      isSalable: true,
    }))
  ).flat(),
  // Section 5 (Thuong) - 5 rows x 8 cols = 40 seats
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      id: 80 + row * 8 + col + 1,
      code: `T${row + 1}-${col + 1}`,
      rowIndex: row + 1,
      colIndex: col + 1,
      sectionId: 5,
      status: "AVAILABLE" as SeatStatus,
      isSalable: true,
    }))
  ).flat(),
  // Section 6 (VIP) - 5 rows x 8 cols = 40 seats
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      id: 120 + row * 8 + col + 1,
      code: `V${row + 1}-${col + 1}`,
      rowIndex: row + 1,
      colIndex: col + 1,
      sectionId: 6,
      status: "AVAILABLE" as SeatStatus,
      isSalable: true,
    }))
  ).flat(),
  // Section 9 (Khu vực 2) - 5 rows x 8 cols = 40 seats
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      id: 160 + row * 8 + col + 1,
      code: `K1-${row + 1}-${col + 1}`,
      rowIndex: row + 1,
      colIndex: col + 1,
      sectionId: 9,
      status: "AVAILABLE" as SeatStatus,
      isSalable: true,
    }))
  ).flat(),
  // Section 10 (Khu vực 3) - 5 rows x 8 cols = 40 seats
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      id: 200 + row * 8 + col + 1,
      code: `K2-${row + 1}-${col + 1}`,
      rowIndex: row + 1,
      colIndex: col + 1,
      sectionId: 10,
      status: "AVAILABLE" as SeatStatus,
      isSalable: true,
    }))
  ).flat(),
];

// ============ ORDERS ============
export interface Order {
  id: number;
  userId: number;
  status: number; // 0: pending, 1: processing, 2: completed
  code: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  totalQuantity: number;
  totalAmount: number;
  payosCode: number | null;
  paymentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    status: 2,
    code: "TICKETBOXC926EBD7",
    recipientName: "Administrator",
    recipientEmail: "admin@ticketboss.com",
    recipientPhone: "0000000000",
    recipientAddress: "123456",
    totalQuantity: 0,
    totalAmount: 0,
    payosCode: null,
    paymentAt: null,
    createdAt: "2026-02-13T18:18:16.389000",
    updatedAt: "2026-02-13T18:18:16.389000",
  },
  {
    id: 2,
    userId: 1,
    status: 2,
    code: "TICKETBOXE1A51D3D",
    recipientName: "Administrator",
    recipientEmail: "admin@ticketboss.com",
    recipientPhone: "0000000000",
    recipientAddress: "1",
    totalQuantity: 2,
    totalAmount: 1320000,
    payosCode: 1771006849,
    paymentAt: "2026-02-13T18:20:50.145000",
    createdAt: "2026-02-13T18:20:27.844000",
    updatedAt: "2026-02-13T18:20:50.145000",
  },
  // ... (thêm các orders khác nếu cần)
];

// ============ ORDER DETAILS ============
export interface OrderDetail {
  id: number;
  orderId: number;
  ticketTypeId: number;
  seatId: number | null;
  status: number;
  price: number;
  originalPrice: number;
  qr: string;
  createdAt: string;
}

export const mockOrderDetails: OrderDetail[] = [
  {
    id: 1,
    orderId: 2,
    ticketTypeId: 0,
    seatId: 71,
    status: 1,
    price: 660000,
    originalPrice: 660000,
    qr: "eyJhbGciOiJSUzI1NiJ9...",
    createdAt: "2026-02-13T18:20:27.848000",
  },
  // ... (thêm các order details khác nếu cần)
];

// ============ HELPER FUNCTIONS ============

/**
 * Lấy event theo ID
 */
export const getMockEventById = (id: number): Event | undefined => {
  return mockEvents.find((e) => e.id === id);
};

/**
 * Lấy tất cả events
 */
export const getMockEvents = (): Event[] => {
  return mockEvents;
};

/**
 * Lấy showing theo event ID
 */
export const getMockShowingsByEventId = (eventId: number): Showing[] => {
  return mockShowings.filter((s) => s.eventId === eventId);
};

/**
 * Lấy ticket types theo showing ID
 */
export const getMockTicketTypesByShowingId = (showingId: number): TicketType[] => {
  return mockTicketTypes.filter((t) => t.showingId === showingId);
};

/**
 * Lấy seat map theo showing ID
 */
export const getMockSeatMapByShowingId = (showingId: number): SeatMap | undefined => {
  return mockSeatMaps.find((sm) => sm.showingId === showingId);
};

/**
 * Lấy seats theo section ID
 */
export const getMockSeatsBySectionId = (sectionId: number): Seat[] => {
  return mockSeats.filter((s) => s.sectionId === sectionId);
};

/**
 * Lấy user theo ID
 */
export const getMockUserById = (id: number): User | undefined => {
  return mockUsers.find((u) => u.id === id);
};

/**
 * Lấy user theo email
 */
export const getMockUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((u) => u.email === email);
};

/**
 * Lấy category theo ID
 */
export const getMockCategoryById = (id: number): Category | undefined => {
  return mockCategories.find((c) => c.id === id);
};

/**
 * Lấy tất cả categories
 */
export const getMockCategories = (): Category[] => {
  return mockCategories;
};

/**
 * Lấy orders theo user ID
 */
export const getMockOrdersByUserId = (userId: number): Order[] => {
  return mockOrders.filter((o) => o.userId === userId);
};

/**
 * Lấy order theo ID
 */
export const getMockOrderById = (id: number): Order | undefined => {
  return mockOrders.find((o) => o.id === id);
};
