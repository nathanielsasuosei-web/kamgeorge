import CheckoutForm from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout — KamGeorge",
};

export default function CheckoutPage() {
  return (
    <>
      <h1 className="page-title">Checkout</h1>
      <CheckoutForm />
    </>
  );
}
