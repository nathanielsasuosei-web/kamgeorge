import AccountView from "@/components/AccountView";

export const metadata = {
  title: "My account — KamGeorge",
};

export default function AccountPage() {
  return (
    <>
      <h1 className="page-title">My account</h1>
      <AccountView />
    </>
  );
}
