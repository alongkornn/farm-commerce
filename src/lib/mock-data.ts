import type { Product, SellerProfile, VisitSlot } from "@/lib/types";

const now = new Date();

export const mockProducts: Product[] = [
  {
    id: "p-1",
    sellerId: "s-1",
    sku: "MANGO-NDM-01",
    name: "มะม่วงน้ำดอกไม้สีทอง",
    category: "มะม่วง",
    priceSatang: 14900,
    size: "1 กก.",
    stock: 36,
    description: "เก็บสดจากสวน เนื้อแน่น หอมหวาน คัดเกรดพร้อมรับประทาน",
    active: true,
    images: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "p-2",
    sellerId: "s-2",
    sku: "POMELO-HK-02",
    name: "ส้มโอขาวแตงกวา",
    category: "ส้มโอ",
    priceSatang: 18900,
    size: "ลูกใหญ่ 1 ลูก",
    stock: 18,
    description: "หวานอมเปรี้ยว เนื้อแห้ง แกะง่าย จากสวนมาตรฐาน GAP",
    active: true,
    images: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "p-3",
    sellerId: "s-3",
    sku: "RAMBUTAN-RS-01",
    name: "เงาะโรงเรียน",
    category: "ผลไม้ตามฤดูกาล",
    priceSatang: 9900,
    size: "1 กก.",
    stock: 52,
    description: "เปลือกสด เนื้อกรอบ ล่อน เมล็ดเล็ก ส่งตรงจากภาคตะวันออก",
    active: true,
    images: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "p-4",
    sellerId: "s-1",
    sku: "MIX-BOX-01",
    name: "กล่องผลไม้คัดพิเศษ",
    category: "ชุดของขวัญ",
    priceSatang: 45900,
    size: "3.5 กก.",
    stock: 12,
    description: "รวมผลไม้เด่นประจำสัปดาห์ บรรจุกล่องพร้อมมอบเป็นของฝาก",
    active: true,
    images: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
];

export const mockSellers: SellerProfile[] = [
  {
    id: "farm-1",
    userId: "s-1",
    farmName: "สวนลุงพร",
    description: "สวนมะม่วงครอบครัว ดูแลแบบลดสารและเก็บตามออเดอร์",
    address: "อำเภอดำเนินสะดวก จังหวัดราชบุรี",
    status: "approved",
  },
  {
    id: "farm-2",
    userId: "s-2",
    farmName: "บ้านสวนริมคลอง",
    description: "ส้มโอและผลไม้ท้องถิ่น พร้อมเปิดสวนให้เข้าชมทุกสุดสัปดาห์",
    address: "อำเภอนครชัยศรี จังหวัดนครปฐม",
    status: "approved",
  },
  {
    id: "farm-3",
    userId: "s-3",
    farmName: "ระยองผลไม้ดี",
    description: "ผลไม้ตามฤดูกาลจากเครือข่ายสวนขนาดเล็กในชุมชน",
    address: "อำเภอแกลง จังหวัดระยอง",
    status: "approved",
  },
];

export const mockVisitSlots: VisitSlot[] = Array.from(
  { length: 4 },
  (_, index) => {
    const start = new Date();
    start.setDate(start.getDate() + index + 2);
    start.setHours(9 + index, 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 2);
    return {
      id: `slot-${index + 1}`,
      sellerId: index % 2 === 0 ? "s-1" : "s-2",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      capacity: 20,
      active: true,
    };
  },
);
