import { useState } from "react";
import * as Yup from "yup";
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

const addressSchema = Yup.object().shape({
  title: Yup.string().required("TITLE REQUIRED"),
  city: Yup.string().required("CITY REQUIRED"),
  district: Yup.string().required("DISTRICT REQUIRED"),
  fullAddress: Yup.string()
    .min(10, "ADDRESS TOO SHORT")
    .required("FULL ADDRESS REQUIRED"),
});

const cardSchema = Yup.object().shape({
  number: Yup.string()
    .matches(/^[0-9]{16}$/, "INVALID CARD NUMBER (16 DIGITS)")
    .required("CARD NUMBER REQUIRED"),
  holder: Yup.string()
    .min(3, "INVALID HOLDER NAME")
    .required("HOLDER NAME REQUIRED"),
  expiry: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "USE MM/YY FORMAT")
    .required("EXPIRY REQUIRED")
    .test("is-expired", "CARD EXPIRED", (value) => {
      if (!value) return false;
      const [m, y] = value.split("/").map(Number);
      const expiryDate = new Date(2000 + y, m, 0);
      return expiryDate > new Date();
    }),
  cvc: Yup.string()
    .matches(/^[0-9]{3}$/, "INVALID CVC (3 DIGITS)")
    .required("CVC REQUIRED"),
});

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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const handleSaveCard = async () => {
    try {
      setFormErrors({});
      await cardSchema.validate(cardForm, { abortEarly: false });

      if (editingId) updateCard(editingId, cardForm);
      else saveCard(cardForm);

      setIsAddingCard(false);
      setEditingId(null);
      setCardForm({ number: "", holder: "", expiry: "", cvc: "" });
      setNotification("VAULT PAY SECURED. 💳");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setFormErrors(errors);
        setNotification(err.inner[0].message);
      }
    }
  };

  const handleSaveAddress = async () => {
    try {
      setFormErrors({});
      await addressSchema.validate(addrForm, { abortEarly: false });

      if (editingId) updateAddress(editingId, addrForm);
      else saveAddress(addrForm);

      setIsAddingAddress(false);
      setEditingId(null);
      setAddrForm({ title: "", city: "", district: "", fullAddress: "" });
      setNotification("LOCATION ESTABLISHED. 📍");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setFormErrors(errors);
        setNotification(err.inner[0].message);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "address")
      deleteAddress(String(deleteConfirm.id));
    else deleteCard(String(deleteConfirm.id));
    setDeleteConfirm(null);
    setNotification("ENTRY PURGED. 🗑️");
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
    setNotification("RESTORED TO ARCHIVE BAG. 🛍️");
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
      setNotification("IDENTITY RE-ESTABLISHED. ✨");
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
    formErrors,
  };
}
