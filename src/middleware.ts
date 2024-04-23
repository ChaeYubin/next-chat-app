import { withAuth } from "next-auth/middleware";
// 사용자가 해당 페이지에 접근하려고 할 때 먼저 로그인이 필요한지 확인하고,
// 필요한 경우 로그인 페이지로 리디렉션된다.
// 그렇지 않으면 계속 진행된다.

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/conversations/:path*", "/users/:path*"],
};
