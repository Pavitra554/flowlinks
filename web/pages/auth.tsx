import {
  Session,
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { NextPage } from "next";
import Router from "next/router";
import { useEffect, useState } from "react";

interface AuthPageProps {}

const AuthPage: NextPage<AuthPageProps> = () => {
  const supabase = useSupabaseClient();
  const session: Session | null = useSession();

  useEffect(() => {
    if (session) Router.push("/");
  }, [session]);
  return (
    <div className="section__height flex  col items-center justify-center">
      <div className="max-w-md mx-auto flex-1">
        <Auth
          providers={["github"]}
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default AuthPage;
