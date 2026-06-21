import { CheckCircle2, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-primary lg:block">
        <Image
          src="/images/orchard-hero.png"
          alt="สวนผลไม้ไทย"
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative flex min-h-screen flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid size-9 place-items-center rounded-md bg-white text-primary">
              <Leaf size={20} />
            </span>
            Farm Commerce
          </Link>
          <div className="max-w-xl">
            <h1 className="font-display text-5xl font-extrabold leading-tight">
              ตลาดของคนรักผลไม้ และคนตั้งใจปลูก
            </h1>
            <div className="mt-8 grid gap-4 text-sm font-semibold text-white/90">
              <p className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-[#ffdc83]" />
                ซื้อจากสวนที่ผ่านการตรวจสอบ
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-[#ffdc83]" />
                จัดการคำสั่งซื้อและการจองในบัญชีเดียว
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-[#ffdc83]" />
                เปิดร้านและพาสวนของคุณเข้าถึงลูกค้ามากขึ้น
              </p>
            </div>
          </div>
          <p className="text-xs text-white/65">Farm Commerce Marketplace</p>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 font-display text-lg font-extrabold lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-md bg-primary text-white">
              <Leaf size={20} />
            </span>
            Farm Commerce
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
