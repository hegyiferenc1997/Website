import { Suspense } from "react";
import { LoginMenu } from "@/components/LoginMenu";
import { ActivityTracker } from "@/features/account/ActivityTracker";
import { getAdminState } from "@/features/admin/god-mode";
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

// A bejelentkezett felhasználó (és admin állapota) lekérése kérésenként, a haladás összekötése a fiókkal és az időmérés.
async function SignedInAccountMenu() {
  const [user, admin] = await Promise.all([getSessionUser(), getAdminState()]);
  return (
    <>
      {/* Admin fióknál a god mode kapcsolója is megjelenik a menüben (a szerver dönti el, ki admin). */}
      <LoginMenu
        user={user}
        social={configuredSocialProviders()}
        godMode={admin.isAdmin ? admin.godMode : undefined}
      />
      <ProgressSync userId={user?.id ?? null} />
      <ActivityTracker userId={user?.id ?? null} />
    </>
  );
}
