import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaGooglePay,
} from "react-icons/fa";

export default function FooterBottom() {
  const paymentIcons = [
    FaCcVisa,
    FaCcMastercard,
    FaCcPaypal,
    FaCcApplePay,
    FaGooglePay,
  ];

  return (
    <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-black/10 mt-12">
      <p className="text-black/60 text-[14px]">
        Shop.co © 2000-2023, All Rights Reserved
      </p>
      <div className="flex items-center gap-2">
        {paymentIcons.map((Icon, i) => (
          <div
            key={i}
            className="bg-white border border-[#D6D6D6] rounded-[6px] w-[46px] h-[30px] flex items-center justify-center shadow-sm"
          >
            <Icon
              size={30}
              className={
                i === 0
                  ? "text-[#1A1971]"
                  : i === 1
                    ? "text-[#EB001B]"
                    : "text-black"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
