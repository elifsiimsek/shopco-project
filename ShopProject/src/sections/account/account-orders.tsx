import { FiPackage, FiShoppingBag } from "react-icons/fi";

export default function AccountOrders({
  orders,
  handleReOrder,
  EmptyState,
}: any) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-lg font-[1000] uppercase italic tracking-tighter m-0">
        Archive Vault
      </h3>
      {orders?.length ? (
        orders.map((order: any) => (
          <div
            key={order.id}
            className="bg-white rounded-[35px] border border-black/5 p-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-black/[0.03] gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-[#F9F9F9] rounded-2xl flex items-center justify-center">
                  <FiPackage size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-black/20 uppercase m-0">
                    {order.date}
                  </p>
                  <h4 className="text-sm font-black m-0 italic">{order.id}</h4>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-black/20 uppercase m-0">
                  Total Payload
                </p>
                <span className="text-xl font-[1000] italic tracking-tighter">
                  ${order.total}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {order.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[#F9F9F9] p-2 pr-4 rounded-2xl border border-black/[0.02]"
                >
                  <img
                    src={item.img}
                    className="w-10 h-12 object-cover rounded-lg shadow-sm"
                    alt={item.name}
                  />
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase italic m-0">
                      {item.name}
                    </p>
                    <p className="text-[7px] font-black text-black/20 m-0">
                      SIZE: {item.size} | QTY: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleReOrder(order)}
                className="bg-black text-white px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-xl active:scale-95 transition-all"
              >
                Restore Bag <FiShoppingBag size={12} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <EmptyState icon={<FiShoppingBag />} text="No Entries Archived." />
      )}
    </div>
  );
}
