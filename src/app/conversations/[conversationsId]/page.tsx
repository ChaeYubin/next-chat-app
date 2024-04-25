import getConversationById from "@/app/actions/getConversationById";
import EmptyState from "@/components/EmptyState";
import Header from "./components/Header";

interface IParams {
  conversationsId: string;
}

export default async function Page({ params }: { params: IParams }) {
  const conversation = await getConversationById(params.conversationsId);
  // const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        {/* <Body initialMessages={messages} />
        <Form /> */}
      </div>
    </div>
  );
}
