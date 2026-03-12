import { Users, Music, ShieldCheck } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

const teamMembers = [
  {
    name: "Nguyễn Minh Anh",
    role: "Founder & Product Lead",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Trần Quốc Bảo",
    role: "Backend Engineer",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Lê Hoàng Yến",
    role: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
];

export default function AboutPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* HERO */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229"
          className="w-full h-[320px] object-cover opacity-40"
        />
          <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border-indigo-500/30 mb-3">
                {isVi ? "Về ConcertBooking" : "About ConcertBooking"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {isVi ? "Kết nối âm nhạc & cảm xúc" : "Connecting music & emotions"}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
                {isVi
                  ? "Nền tảng đặt vé concert và sự kiện trực tiếp dành cho cộng đồng yêu âm nhạc tại Việt Nam."
                  : "A ticketing platform for concerts and live events for the music‑loving community in Vietnam."}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        {/* SỨ MỆNH */}
          <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Music className="text-indigo-400" />
              <h2 className="text-lg font-semibold">
                {isVi ? "Sứ mệnh" : "Our mission"}
              </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "ConcertBooking hướng đến việc đơn giản hóa quá trình mua vé, đảm bảo minh bạch, an toàn và mang đến trải nghiệm tốt nhất cho khán giả cũng như nhà tổ chức."
                : "ConcertBooking aims to simplify the ticket‑buying process, ensure transparency and safety, and bring the best experience to both audiences and organizers."}
          </p>
        </section>

        {/* GIÁ TRỊ */}
          <section className="grid md:grid-cols-3 gap-4">
            <ValueCard
              icon={<Users />}
              title={
                isVi ? "Người dùng là trung tâm" : "User‑centric experience"
              }
              desc={
                isVi
                  ? "Thiết kế trải nghiệm đơn giản, dễ dùng và nhanh chóng."
                  : "Designing a simple, intuitive and fast experience."
              }
            />
            <ValueCard
              icon={<ShieldCheck />}
              title={isVi ? "Minh bạch & An toàn" : "Transparent & secure"}
              desc={
                isVi
                  ? "Thông tin vé rõ ràng, thanh toán bảo mật."
                  : "Clear ticket information and secure payments."
              }
            />
            <ValueCard
              icon={<Music />}
              title={isVi ? "Đồng hành sự kiện" : "Partnering with events"}
              desc={
                isVi
                  ? "Hỗ trợ dài hạn cho nghệ sĩ và nhà tổ chức."
                  : "Long‑term support for artists and organizers."
              }
            />
          </section>

        {/* ĐỘI NGŨ */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {isVi ? "Đội ngũ của chúng tôi" : "Our team"}
            </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-card border border-border rounded-2xl p-5 text-center hover:border-indigo-500/50 transition"
              >
                <img
                  src={member.avatar}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-medium text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="text-indigo-400 mb-2">{icon}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
