import CartView from "@/components/CartView";

export const metadata = {
  title: "Your cart — Unclaim",
};

export default function CartPage() {
  return (
    <>
      <h1 className="page-title">Your cart</h1>
      <CartView />
    </>
  );
}
