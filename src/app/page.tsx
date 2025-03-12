"use client"
import useClerkSysncMongoose from "@/hooks/useClerkSysncMongoose";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";

export default function Home() {

  const user = useClerkSysncMongoose();

  return (
    <div>
      <p>
      </p>
      <UserButton />
    </div>
  );
}
