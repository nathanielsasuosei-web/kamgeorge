import ManagerLoginForm from "@/components/ManagerLoginForm";

export const metadata = {
  title: "Store manager login — KamGeorge",
};

export default function ManagerLoginPage() {
  return (
    <>
      <h1 className="page-title">Store manager</h1>
      <ManagerLoginForm />
    </>
  );
}
