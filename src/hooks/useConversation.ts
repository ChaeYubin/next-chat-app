import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 *
 * @returns 현재 URL에 따라 conversationId 리턴, conversationId가 있으면 isOpen이 true
 */

const useConversation = () => {
  const params = useParams();

  // useMemo: 계산 결괏값 캐싱, 의존성 배열에 있는 값이 변경되지 않을 경우 이전 결괏값을 그대로 재사용한다.
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [conversationId, isOpen]
  );
};

export default useConversation;
