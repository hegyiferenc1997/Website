import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ResetPasswordPage");
  return { title: t("title"), robots: { index: false } };
}

// Ide vezet az „Elfelejtett jelszó?” e-mailben kapott link (a címben a ?token=... kóddal).
export default async function ResetPasswordPage() {
  const t = await getTranslations("ResetPasswordPage");
  return (
    <div className="grid max-w-md gap-8">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      <Card>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
