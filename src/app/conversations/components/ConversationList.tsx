"use client";

import useConversation from "@/hooks/useConversation";
import { FullConversationType } from "@/types";
import { User } from "@prisma/client";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import { MdOutlineGroupAdd } from "react-icons/md";
import { find } from "lodash";
import { pusherClient } from "@/libs/pusher";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GroupChatModal from "./GroupChatModal";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const { conversationId, isOpen } = useConversation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [
          ...current.filter((convo) => conversation.id !== conversation.id),
        ];
      });
    };

    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
    };
  }, [pusherKey, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between pt-4 mb-4">
            <div className="text-2xl font-bold text-neutral-800">채팅 앱</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-gray-600 transition bg-gray-100 rounded-full cursor-pointer hover:opacity-75"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id} // 현재 보고 있는 대화이면 selected에 true 전달
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
