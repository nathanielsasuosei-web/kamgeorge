import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Create account — KamGeorge",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="page-title">Create account</h1>
      <RegisterForm />
    </>
  );
}
