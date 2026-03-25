import type { ReactNode, FC } from "react";

export interface Address {
  id: string | number;
  title: string;
  city: string;
  district: string;
  fullAddress: string;
}

export interface PaymentCard {
  id: string | number;
  holder: string;
  number: string;
  expiry: string;
  type?: string;
}

export interface OrderItem {
  id: string | number;
  name: string;
  img: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Order {
  id: string | number;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface DeleteConfirm {
  id: string | number;
  type: string;
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  addresses?: Address[];
  savedCards?: PaymentCard[];
  orders?: Order[];
}

export interface AddressForm {
  title: string;
  city: string;
  district: string;
  fullAddress: string;
}

export interface CardForm {
  holder: string;
  number: string;
  expiry: string;
  cvc: string;
}

export type AccountTabId = "profile" | "orders" | "address" | "payment";

export interface AccountTab {
  id: AccountTabId;
  label: string;
  icon: ReactNode;
}

export interface AccountProfileProps {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editData: { birthDate: string };
  setEditData: (data: { birthDate: string }) => void;
  handleUpdate: () => void;
  calculateAge: (date: string | undefined) => number | string;
}

export interface AccountOrdersProps {
  orders?: Order[];
  handleReOrder: (order: Order) => void;
  EmptyState: FC<{ icon: ReactNode; text: string }>;
}

export interface AccountAddressProps {
  user: User;
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  addrForm: AddressForm;
  setAddrForm: (value: AddressForm) => void;
  handleSave: () => void;
  setEditingId: (id: string | number | null) => void;
  setDeleteConfirm: (data: DeleteConfirm | null) => void;
  EmptyState: FC<{ icon: ReactNode; text: string }>;
}

export interface AccountPaymentProps {
  user: User;
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  cardForm: CardForm;
  setCardForm: (value: CardForm) => void;
  handleSave: () => void;
  handleHolderInput: (value: string) => void;
  setDeleteConfirm: (data: DeleteConfirm | null) => void;
  EmptyState: FC<{ icon: ReactNode; text: string }>;
}

export interface EmptyStateProps {
  icon: ReactNode;
  text: string;
}

export interface CartModalsProps {
  checkoutStep: string;
  setCheckoutStep: (step: string) => void;
  address: { title: string; city: string; district: string; full: string };
  setAddress: (val: { title: string; city: string; district: string; full: string }) => void;
  card: { number: string; holder: string; expiry: string; cvc: string };
  setCard: (val: { number: string; holder: string; expiry: string; cvc: string }) => void;
  user: User | null;
  showAddrList: boolean;
  setShowAddrList: (val: boolean) => void;
  showCardList: boolean;
  setShowCardList: (val: boolean) => void;
  setIsSavedAddrUsed: (val: boolean) => void;
  setIsSavedCardUsed: (val: boolean) => void;
  isSavedAddrUsed: boolean;
  isSavedCardUsed: boolean;
  saveAddressDetails: boolean;
  setSaveAddressDetails: (val: boolean) => void;
  saveCardDetails: boolean;
  setSaveCardDetails: (val: boolean) => void;
  handleFinalOrder: () => void;
  deleteConfirm: DeleteConfirm | null;
  setDeleteConfirm: (val: DeleteConfirm | null) => void;
  handleConfirmDelete: () => void;
}