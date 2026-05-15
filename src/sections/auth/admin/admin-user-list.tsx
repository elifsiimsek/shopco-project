import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Mail,
  ShieldCheck,
  Trash2,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  Shield,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "active" | "restricted";
}

type FilterType = "all" | "active" | "restricted";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  variant?: "danger" | "warning";
}

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md bg-black/10 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-[2rem] w-full max-w-sm shadow-2xl border border-black/5 text-center">
        <div
          className={`w-12 h-12 mx-auto ${variant === "danger" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"} rounded-xl flex items-center justify-center mb-4`}
        >
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-tight mb-2 italic text-black">
          {title}
        </h3>
        <p className="text-[11px] font-medium text-black/40 mb-6 px-2 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-2 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-black/40 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors border-none cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl ${variant === "danger" ? "bg-red-600" : "bg-black"} text-white font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center border-none cursor-pointer disabled:opacity-50`}
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "CONFIRM"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToRestrict, setUserToRestrict] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get<User[]>(
        "https://api.escuelajs.co/api/v1/users",
      );
      const apiData = response.data;

      const localUsers: User[] = JSON.parse(
        localStorage.getItem("vault_all_users") || "[]",
      );
      const deletedEmails: string[] = JSON.parse(
        localStorage.getItem("vault_deleted_emails") || "[]",
      );

      const combinedMap = new Map<string, User>();

      [...apiData, ...localUsers].forEach((u: User) => {
        if (!deletedEmails.includes(u.email)) {
          const isInvalidImage =
            !u.avatar ||
            u.avatar.includes("escuelajs.co") ||
            u.avatar.includes("lorem.space") ||
            u.avatar.includes("example.jpg") ||
            u.avatar.includes("placeimg.com");

          const finalAvatar = isInvalidImage
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff`
            : u.avatar;

          combinedMap.set(u.email, {
            ...u,
            status: u.status || "active",
            avatar: finalAvatar,
          });
        }
      });

      setUsers(Array.from(combinedMap.values()));
    } catch (error) {
      console.error("Axios Sync Error:", error);
      toast.error("Failed to sync identity network");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePurgeUser = async () => {
    if (!userToDelete) return;
    setActionLoading(true);

    try {
      await axios.delete(
        `https://api.escuelajs.co/api/v1/users/${userToDelete.id}`,
      );

      const deletedEmails: string[] = JSON.parse(
        localStorage.getItem("vault_deleted_emails") || "[]",
      );
      if (!deletedEmails.includes(userToDelete.email)) {
        deletedEmails.push(userToDelete.email);
        localStorage.setItem(
          "vault_deleted_emails",
          JSON.stringify(deletedEmails),
        );
      }

      const localUsers: User[] = JSON.parse(
        localStorage.getItem("vault_all_users") || "[]",
      );
      const updatedLocal = localUsers.filter(
        (u: User) => u.email !== userToDelete.email,
      );
      localStorage.setItem("vault_all_users", JSON.stringify(updatedLocal));

      setUsers((prev) => prev.filter((u) => u.email !== userToDelete.email));

      toast.success("Identity purged from network");
    } catch (error) {
      console.error("Purge Error:", error);
      toast.error("Network error, sync maintained locally");
    } finally {
      setUserToDelete(null);
      setActionLoading(false);
    }
  };

  const handleToggleStatus = () => {
    if (!userToRestrict) return;
    setActionLoading(true);

    const newStatus: "active" | "restricted" =
      userToRestrict.status === "restricted" ? "active" : "restricted";
    const updatedUser = { ...userToRestrict, status: newStatus };

    const updatedUsers = users.map((u) =>
      u.email === userToRestrict.email ? updatedUser : u,
    );
    setUsers(updatedUsers);

    const localUsers: User[] = JSON.parse(
      localStorage.getItem("vault_all_users") || "[]",
    );
    const filteredLocal = localUsers.filter(
      (u: User) => u.email !== userToRestrict.email,
    );
    localStorage.setItem(
      "vault_all_users",
      JSON.stringify([...filteredLocal, updatedUser]),
    );

    toast.success(`Access ${newStatus.toUpperCase()}`);
    setUserToRestrict(null);
    setActionLoading(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all"
          ? true
          : filterType === "active"
            ? u.status !== "restricted"
            : u.status === "restricted";
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterType]);

  if (isLoading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-black/20" size={32} />
      </div>
    );

  return (
    <div className="max-w-full mx-auto p-4 md:p-10 space-y-10 animate-in fade-in duration-500">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            id: "all" as const,
            label: "TOTAL ENTITIES",
            count: users.length,
            icon: <Users size={18} />,
            color: "bg-gray-50",
          },
          {
            id: "active" as const,
            label: "AUTHORIZED",
            count: users.filter((u) => u.status !== "restricted").length,
            icon: <UserCheck size={18} />,
            color: "bg-green-50/50",
          },
          {
            id: "restricted" as const,
            label: "RESTRICTED",
            count: users.filter((u) => u.status === "restricted").length,
            icon: <UserX size={18} />,
            color: "bg-red-50/50",
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilterType(item.id)}
            className={`p-6 rounded-[2.5rem] border transition-all flex items-center gap-5 cursor-pointer border-none ${filterType === item.id ? "bg-black text-white border-black shadow-xl" : "bg-white border-black/5 hover:border-black/20"}`}
          >
            <div
              className={`p-4 rounded-2xl ${filterType === item.id ? "bg-white/10" : item.color}`}
            >
              {item.icon}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black tracking-widest opacity-40 italic uppercase">
                {item.label}
              </p>
              <p className="text-2xl font-black italic tracking-tighter tabular-nums">
                {item.count}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by identity..."
          className="w-full bg-white border border-black/5 p-5 pl-14 rounded-[1.5rem] outline-none text-sm font-bold shadow-sm focus:ring-4 ring-black/[0.02] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-black/5 text-black/30 text-[10px] font-black uppercase italic tracking-widest">
                <th className="p-6">IDENTITY</th>
                <th className="p-6 text-center">ACCESS LEVEL</th>
                <th className="p-6 text-right">CONTROLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {filteredUsers.map((u) => (
                <tr
                  key={`${u.id}-${u.email}`}
                  className={`group transition-colors ${u.status === "restricted" ? "bg-red-50/10" : "hover:bg-gray-50/40"}`}
                >
                  <td className="p-6 flex items-center gap-4 text-left">
                    <img
                      src={u.avatar}
                      className="w-12 h-12 rounded-2xl border border-black/5 object-cover bg-gray-100"
                      alt={u.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=128`;
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-black text-sm uppercase italic tracking-tight text-black">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-black/30 font-bold flex items-center gap-1">
                        <Mail size={10} />
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-wider inline-flex items-center gap-2 ${u.status === "restricted" ? "bg-red-100 text-red-600" : "bg-black text-white"}`}
                    >
                      {u.status === "restricted" ? (
                        <UserX size={12} />
                      ) : (
                        <ShieldCheck size={12} />
                      )}
                      {u.status === "restricted" ? "Restricted" : u.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <button
                        onClick={() => setUserToRestrict(u)}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase italic transition-all border-none cursor-pointer flex items-center gap-2 ${u.status === "restricted" ? "bg-black text-white" : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"}`}
                      >
                        {u.status === "restricted" ? (
                          <>
                            <Shield size={14} /> Grant
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={14} /> Restrict
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-3 text-black/10 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border-none cursor-pointer bg-transparent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!userToRestrict}
        variant={userToRestrict?.status === "restricted" ? "warning" : "danger"}
        title={
          userToRestrict?.status === "restricted"
            ? "RESTORE ACCESS"
            : "RESTRICT ENTITY"
        }
        message={`Confirm access level modification for ${userToRestrict?.name}?`}
        onConfirm={handleToggleStatus}
        onCancel={() => setUserToRestrict(null)}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={!!userToDelete}
        title="PURGE IDENTITY"
        message="Irreversible action: This will trigger a network delete and erase all vault associations."
        onConfirm={handlePurgeUser}
        onCancel={() => setUserToDelete(null)}
        isLoading={actionLoading}
      />
    </div>
  );
}
