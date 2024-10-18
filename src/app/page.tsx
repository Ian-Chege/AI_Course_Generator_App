import { SignIn } from "@/components/ui/auth/sign-in";
import { auth } from "@/lib/auth";

export  default async function Home() {
  const session = await auth()
  // if (!session) {
  //   return <div>Not authenticated</div>
  // }
  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <SignIn />
    </div>
  );
}
