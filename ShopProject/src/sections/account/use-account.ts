import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export function useAccount() {
  const { 
    user, logout, updateProfile, 
    saveAddress, updateAddress, deleteAddress, 
    saveCard, updateCard, deleteCard 
  } = useAuth();
  
  const { addToCart, setNotification } = useCart();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const [editData, setEditData] = useState({ birthDate: user?.birthDate || "" });
  const [addrForm, setAddrForm] = useState({ title: "", city: "", district: "", fullAddress: "" });
  const [cardForm, setCardForm] = useState({ number: "", holder: "", expiry: "", cvc: "" });

  const calculateAge = (date: string | undefined) => {
    if (!date) return "N/A";
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age;
  };

  const handleProfileUpdate = () => {
    const age = calculateAge(editData.birthDate);
    if (typeof age === "number" && age < 18) {
      setNotification("Archive rejected: Age 18+ required. 🔞");
      return;
    }
    updateProfile(editData);
    setIsEditingProfile(false);
    setNotification("Identity Re-Established. ✨");
  };

  const handleHolderInput = (val: string) => {
    const cleanValue = val.replace(/[0-9]/g, "").replace(/\s\s+/g, " ");
    setCardForm({ ...cardForm, holder: cleanValue.toUpperCase() });
  };

  const handleSaveCard = () => {
    const [month, year] = cardForm.expiry.split('/').map(Number);
    const fullYear = 2000 + year;

    if (!cardForm.expiry.includes('/') || cardForm.expiry.length < 5) {
      setNotification("Format MM/YY required. 📅");
      return;
    }
    if (month < 1 || month > 12) {
      setNotification("Invalid Month (1-12). ❌");
      return;
    }
    if (fullYear < 2026) {
      setNotification("Archive Rejected: Min 2026. 🔞");
      return;
    }
    if (fullYear > 2036) {
      setNotification("Vault Limit: Max 10 Years. 🔒");
      return;
    }
    if (cardForm.number.length < 16 || cardForm.cvc.length < 3) {
      setNotification("Verify Card/CVC Specs. ❌");
      return;
    }
    if (!cardForm.holder.trim().includes(" ")) {
      setNotification("Full Signature Required. ✍️");
      return;
    }

    if (editingId) updateCard(editingId, { number: cardForm.number, holder: cardForm.holder, expiry: cardForm.expiry });
    else saveCard({ number: cardForm.number, holder: cardForm.holder, expiry: cardForm.expiry });

    setIsAddingCard(false);
    setEditingId(null);
    setCardForm({ number: "", holder: "", expiry: "", cvc: "" });
    setNotification("Vault Pay Secured. 💳");
  };

  const handleSaveAddress = () => {
    if (!addrForm.city || !addrForm.district || !addrForm.fullAddress) {
      setNotification("Missing logistics details. ❌");
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
    deleteConfirm.type === 'address' ? deleteAddress(deleteConfirm.id) : deleteCard(deleteConfirm.id);
    setDeleteConfirm(null);
    setNotification("Entry Purged. 🗑️");
  };

  const handleReOrder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart({
        id: item.id, name: item.name, price: item.price,
        img: item.img, selectedSize: item.size, selectedColor: item.color
      }, item.quantity);
    });
    setNotification("Restored to Bag. 🛍️");
  };

  return {
    user, logout, activeTab, setActiveTab,
    isEditingProfile, setIsEditingProfile, editData, setEditData, handleProfileUpdate, calculateAge,
    isAddingAddress, setIsAddingAddress, addrForm, setAddrForm, handleSaveAddress,
    isAddingCard, setIsAddingCard, cardForm, setCardForm, handleSaveCard, handleHolderInput,
    editingId, setEditingId, deleteConfirm, setDeleteConfirm, handleConfirmDelete, handleReOrder
  };
}