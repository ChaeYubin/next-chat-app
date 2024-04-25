"use client";

import useActiveList from "@/hooks/useActiveList";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import AvatarGroup from "../../components/AvatarGroup";
import Avatar from "@/components/Avatar";
import { HiEllipsisHorizontal } from "react-icons/hi2";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    // 그룹인 경우 멤버 수 표시
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    // 1:1 채팅인 경우 접속 중인지 아닌지에 따라 메시지 표시
    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    // <ProfileDrawer
    //     data={conversation}
    //     isOpen={drawerOpen}
    //     onClose={() => setDrawerOpen(false)}
    //   />
    <>
      <div
        className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
      >
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="block text-orange-500 transition cursor-pointer lg:hidden hover:text-orange-600"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-orange-500 transition cursor-pointer hover:text-orange-600"
        />
      </div>
    </>
  );
};

export default Header;
