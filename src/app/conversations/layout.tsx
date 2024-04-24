import Sidebar from "@/components/sidebar/Sidebar";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        {/* <ConversationList></ConversationList> */}
        {children}
      </div>
    </Sidebar>
  );
}
