import { ArrowLeft, Monitor, Cpu, Shield, Globe } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-[450px] mx-auto">
      {/* Nav */}
      <div className="w-full sticky top-0 z-10 bg-[#191B1F]">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            About Us
          </span>
        </div>
      </div>

      {/* Logo + Brand */}
      <div className="flex flex-col items-center pt-10 pb-6 px-6 bg-[#191B1F] mt-[10px]">
        <div className="w-[90px] h-[90px] bg-white rounded-full overflow-hidden flex items-center justify-center p-3 mb-4">
          <img src="/asus_logos.jpeg" alt="ASUS" className="w-full h-full object-contain" />
        </div>
        <p className="text-white text-[22px] font-bold tracking-wide">ASUS</p>
        <p className="text-[#888] text-[13px] mt-1">ASUSTeK Computer Inc.</p>
        <p className="text-[#6C2FE3] text-[12px] mt-2 bg-[#6C2FE3]/15 px-4 py-1 rounded-full">
          Est. 1989 — Taipei, Taiwan
        </p>
      </div>

      {/* About text */}
      <div className="mx-3 mt-3 bg-[#191B1F] rounded-xl p-5">
        <p className="text-[#D3D3D3] text-[13px] leading-relaxed">
          ASUS is a globally recognized technology company and one of the world's leading producers of
          personal computers, laptops, motherboards, graphics cards, and smartphones. Known for
          delivering innovation and quality, ASUS serves millions of customers across more than
          50 countries.
        </p>
      </div>

      {/* Key highlights */}
      <div className="mx-3 mt-3 space-y-2">
        {[
          {
            Icon: Monitor,
            title: 'Premium PCs & Laptops',
            desc: 'From the ultra-thin ZenBook and ROG gaming laptops to powerful VivoBook and ExpertBook business lines.',
          },
          {
            Icon: Cpu,
            title: 'World-Class Components',
            desc: 'ASUS motherboards and graphics cards power millions of desktops worldwide, trusted by enthusiasts and professionals.',
          },
          {
            Icon: Shield,
            title: 'Built to Last',
            desc: 'Every ASUS device undergoes rigorous MIL-STD durability testing to ensure long-term reliability.',
          },
          {
            Icon: Globe,
            title: 'Global Reach',
            desc: 'Serving customers in over 50 countries with a network of authorised service centres and retail partners.',
          },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="bg-[#191B1F] rounded-xl px-4 py-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#6C2FE3]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-[#6C2FE3]" />
            </div>
            <div>
              <p className="text-white text-[14px] font-medium">{title}</p>
              <p className="text-[#888] text-[12px] mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mx-3 mt-4 mb-8 text-center">
        <p className="text-[#555] text-[11px]">© 2026 ASUSTeK Computer Inc. All rights reserved.</p>
        <p className="text-[#555] text-[11px] mt-1">www.asus.com</p>
      </div>
    </div>
  );
}
