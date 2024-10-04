import { Link, Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
    en: {
        translation: {
            "Welcome": "Welcome",
            "Get Started": "Get Started",
        },
    },
    ar: {
        translation: {
            "Welcome": "مرحبًا بك ",
            "Get Started": "",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Welcome({ auth, site_settings}) {
    const { t } = useTranslation();

    return (
        <>
            <GuestLayout site_settings={site_settings}>
                <Head title={site_settings.websiteName + " - " + t("Welcome to") + " " + t("Your Application")} />
                <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-r bg-indigoBlue">
                    <h1 className="text-5xl font-bold">
                        {t("Welcome")}
                    </h1>
                    <div className="flex gap-2 my-3 mt-8">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-6 py-3 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg"
                            >
                                {t("Dashboard")}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-6 py-3 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg"
                                >
                                    {t("Login")}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}
