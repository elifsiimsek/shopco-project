import { useState, useEffect } from "react";
import { FiShoppingBag, FiCalendar, FiDollarSign } from "react-icons/fi";

interface OrderProduct {
  name: string;
  img: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  items: OrderProduct[];
  status: string;
}

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const loadOrders = () => {
    const rawData = localStorage.getItem("vault_global_orders");
    if (!rawData) {
      setOrders([]);
      setTotalRevenue(0);
      return;
    }

    try {
      const data: Order[] = JSON.parse(rawData);
      const sortedData = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setOrders(sortedData);

      const total = data.reduce((acc, order) => acc + (order.total || 0), 0);
      setTotalRevenue(total);
    } catch (error) {
      console.error("Order parsing error:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener("storage", loadOrders);
    return () => window.removeEventListener("storage", loadOrders);
  }, []);

  return (
    <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-left">
        <div>
          <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter text-black">
            Vault Orders
          </h1>
          <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Real-time Logistics & Sales Control
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-black/5 px-6 py-3 rounded-2xl border border-black/5 min-w-[140px]">
            <span className="block text-[10px] font-black uppercase text-black/30 tracking-widest leading-none mb-1 text-left">
              Volume
            </span>
            <span className="text-xl font-black italic uppercase leading-none text-black">
              {orders.length} Units
            </span>
          </div>

          <div className="bg-black text-white px-6 py-3 rounded-2xl shadow-xl shadow-black/10 min-w-[160px]">
            <span className="block text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1 text-left italic">
              Total Revenue
            </span>
            <div className="flex items-center gap-1">
              <FiDollarSign className="text-green-400" size={18} />
              <span className="text-xl font-[1000] italic uppercase leading-none">
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-black/40">
                  Reference / Items
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-black/40">
                  Identity
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-black/40">
                  Timestamp
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-black/40">
                  Revenue
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-black/40">
                  Process
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                    <FiShoppingBag
                      className="mx-auto mb-4 text-black/10"
                      size={48}
                    />
                    <p className="text-black/20 font-black uppercase italic tracking-widest text-sm">
                      Waiting for first secured order...
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-black/[0.01] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          {order.items?.map((item, i) => (
                            <img
                              key={`${order.id}-img-${i}`}
                              src={item.img}
                              className="w-10 h-12 object-cover rounded-lg border-2 border-white shadow-sm"
                              alt={item.name}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[11px] font-black bg-black/5 px-2 py-1 rounded-md text-black/60">
                          {order.id}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center text-[10px] font-black italic shadow-lg">
                          {order.customerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase italic leading-none mb-1 text-black">
                            {order.customerName}
                          </p>
                          <p className="text-[10px] text-black/40 font-bold tracking-tight leading-none">
                            {order.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-black/60 font-bold italic text-xs">
                        <FiCalendar size={14} className="opacity-30" />
                        {order.date}
                      </div>
                    </td>
                    <td className="p-6 font-[1000] text-sm italic tracking-tighter text-black">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          {order.status || "Paid"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
