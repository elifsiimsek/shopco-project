export default function OnSaleMarquee() {
  return (
    <div className="py-3 bg-black overflow-hidden flex border-b border-white/5">
      <div className="flex whitespace-nowrap animate-marquee-fixed">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 mx-5 text-white">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">
              Flash Sale Live
            </span>
            <span className="w-1.5 h-1.5 bg-vault-red rounded-full"></span>
          </div>
        ))}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes marquee-fixed { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee-fixed { animation: marquee-fixed 25s linear infinite; }`,
        }}
      />
    </div>
  );
}
