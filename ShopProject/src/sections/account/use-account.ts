import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import type {
  AccountTabId,
  AddressForm,
  CardForm,
  Order,
  OrderItem,
  DeleteConfirm,
} from "../../types/account";

export function useAccount() {
  const {
    user,
    logout,
    updateProfile,
    saveAddress,
    updateAddress,
    deleteAddress,
    saveCard,
    updateCard,
    deleteCard,
  } = useAuth();
  const { addToCart, setNotification } = useCart();

  const [activeTab, setActiveTab] = useState<AccountTabId>("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(
    null,
  );

  const [editData, setEditData] = useState({
    birthDate: user?.birthDate || "",
  });
  const [addrForm, setAddrForm] = useState<AddressForm>({
    title: "",
    city: "",
    district: "",
    fullAddress: "",
  });
  const [cardForm, setCardForm] = useState<CardForm>({
    number: "",
    holder: "",
    expiry: "",
    cvc: "",
  });

  const calculateAge = (date: string | undefined): number | string => {
    if (!date) return "N/A";
    const birthYear = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleSaveCard = () => {
    const [month, year] = cardForm.expiry.split("/").map(Number);
    const fullYear = 2000 + year;
    const currentYear = 2026;

    if (!cardForm.expiry.includes("/") || cardForm.expiry.length < 5) {
      setNotification("Format MM/YY Required. 📅");
      return;
    }
    if (month < 1 || month > 12) {
      setNotification("Invalid Month (1-12). ❌");
      return;
    }
    if (fullYear < currentYear) {
      setNotification("Archive Rejected: Card Expired. 🔞");
      return;
    }
    if (fullYear > currentYear + 10) {
      setNotification("Vault Limit: Max 10 Years. 🔒");
      return;
    }
    if (cardForm.number.replace(/\s/g, "").length < 16) {
      setNotification("Invalid Card Number Specs. ❌");
      return;
    }

    if (editingId) updateCard(editingId, cardForm);
    else saveCard(cardForm);

    setIsAddingCard(false);
    setEditingId(null);
    setCardForm({ number: "", holder: "", expiry: "", cvc: "" });
    setNotification("Vault Pay Secured. 💳");
  };

  const handleSaveAddress = () => {
    if (!addrForm.city || !addrForm.district || !addrForm.fullAddress) {
      setNotification("Logistics Details Missing. ❌");
      return;
    }
    if (editingId) updateAddress(editingId, addrForm);
    else saveAddress(addrForm);

    setIsAddingAddress(false);
    setEditingId(null);
    setAddrForm({ title: "", city: "", district: "", fullAddress: "" });
    setNotification("Location Established. 📍");
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "address")
      deleteAddress(String(deleteConfirm.id));
    else deleteCard(String(deleteConfirm.id));
    setDeleteConfirm(null);
    setNotification("Entry Purged. 🗑️");
  };

  const handleReOrder = (order: Order) => {
    order.items.forEach((item: OrderItem) => {
      addToCart(
        {
          id: String(item.id),
          name: item.name,
          price: item.price,
          img: item.img,
          selectedSize: item.size,
          selectedColor: item.color || "Default",
        },
        item.quantity,
      );
    });
    setNotification("Restored to Archive Bag. 🛍️");
  };

  return {
    user,
    logout,
    activeTab,
    setActiveTab,
    isEditingProfile,
    setIsEditingProfile,
    editData,
    setEditData,
    handleProfileUpdate: () => {
      updateProfile(editData);
      setIsEditingProfile(false);
      setNotification("Identity Re-Established. ✨");
    },
    calculateAge,
    isAddingAddress,
    setIsAddingAddress,
    addrForm,
    setAddrForm,
    handleSaveAddress,
    isAddingCard,
    setIsAddingCard,
    cardForm,
    setCardForm,
    handleSaveCard,
    handleHolderInput: (val: string) =>
      setCardForm({ ...cardForm, holder: val.toUpperCase() }),
    editingId,
    setEditingId,
    deleteConfirm,
    setDeleteConfirm,
    handleConfirmDelete,
    handleReOrder,
  };
}
