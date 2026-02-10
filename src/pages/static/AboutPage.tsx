import { Users, Music, ShieldCheck } from "lucide-react";

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
  return (
    <div className="bg-gray-900 text-slate-100">
      {/* HERO */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229"
          className="w-full h-[320px] object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30 mb-3">
              Về ConcertBooking
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Kết nối âm nhạc & cảm xúc
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl">
              Nền tảng đặt vé concert và sự kiện trực tiếp dành cho cộng đồng yêu âm nhạc tại Việt Nam.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        {/* SỨ MỆNH */}
        <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Music className="text-indigo-400" />
            <h2 className="text-lg font-semibold">Sứ mệnh</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            ConcertBooking hướng đến việc đơn giản hóa quá trình mua vé, đảm bảo minh bạch,
            an toàn và mang đến trải nghiệm tốt nhất cho khán giả cũng như nhà tổ chức.
          </p>
        </section>

        {/* GIÁ TRỊ */}
        <section className="grid md:grid-cols-3 gap-4">
          <ValueCard
            icon={<Users />}
            title="Người dùng là trung tâm"
            desc="Thiết kế trải nghiệm đơn giản, dễ dùng và nhanh chóng."
          />
          <ValueCard
            icon={<ShieldCheck />}
            title="Minh bạch & An toàn"
            desc="Thông tin vé rõ ràng, thanh toán bảo mật."
          />
          <ValueCard
            icon={<Music />}
            title="Đồng hành sự kiện"
            desc="Hỗ trợ dài hạn cho nghệ sĩ và nhà tổ chức."
          />
        </section>

        {/* ĐỘI NGŨ */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Đội ngũ của chúng tôi
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-gray-800/70 border border-slate-700 rounded-2xl p-5 text-center hover:border-indigo-500/50 transition"
              >
                <img
                  src={member.avatar}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-medium text-white">{member.name}</h3>
                <p className="text-sm text-slate-400">{member.role}</p>
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
    <div className="bg-gray-800/70 border border-slate-700 rounded-2xl p-5">
      <div className="text-indigo-400 mb-2">{icon}</div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-300">{desc}</p>
    </div>
  );
}
