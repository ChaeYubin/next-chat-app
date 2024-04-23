import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/libs/prismadb";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  // NextAuth가 사용할 데이터베이스 어댑터 지정
  adapter: PrismaAdapter(prisma),
  // 사용할 인증 제공자 설정
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // 사용자가 로그인을 시도할 때마다 이 함수가 호출된다.

        // 이메일 또는 비밀번호가 없는 경우
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // DB에서 이메일로 유저를 검색한다.
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // 유저가 없는 경우
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // 비밀번호가 일치하는지 확인한다.
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // 비밀번호가 일치하지 않는 경우
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // 올바른 유저가 있는 경우 유저 리턴
        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt", // 세션 설정 jwt 사용하도록 지정
  },
  secret: process.env.NEXTAUTH_SECRET, // 세션을 암호화할 때 사용할 비밀키
};

// NextAuth의 미들웨어 함수인 NextAuth()를 호출하여 실제 요청을 처리하는 핸들러 함수 생성
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
