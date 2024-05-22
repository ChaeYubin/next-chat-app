import NextAuth from "next-auth/next";
import authOptions from "./options";

// NextAuth의 미들웨어 함수인 NextAuth()를 호출하여 실제 요청을 처리하는 핸들러 함수 생성
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
