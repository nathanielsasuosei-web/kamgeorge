import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Manager login — KamGeorge",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="page-title">Login</h1>
      <LoginForm />
    </>
  );
}
