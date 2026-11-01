import { Suspense } from "react";
import { LoginMenu } from "@/components/LoginMenu";
import { ProgressSync } from "@/features/progress/sync";
import { configuredSocialProviders } from "./config";
import { getSessionUser } from "./server";

/**
 * A fejléc fiók-gombja. Az oldal váza azonnal megjelenik (a gomb vendég-állapotban),
 * a bejelentkezett felhasználó pedig ugyanabban a válaszban, rögtön utána érkezik.
 */
export function AccountMenu() {
  const social = configuredSocialProviders();
  return (
    <Suspense fallback={<LoginMenu user={undefined} social={social} />}>
      <SignedInAccountMenu />
    </Suspense>
  );
}

async function SignedInAccountMenu() {
  const user = await getSessionUser();
  return (
    <>
      <LoginMenu user={user} social={configuredSocialProviders()} />
      <ProgressSync userId={user?.id ?? null} />
    </>
  );
}
