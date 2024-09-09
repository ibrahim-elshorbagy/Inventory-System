import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
    en: {
        translation: {
            "Confirm Password": "Confirm Password",
            "This is a secure area of the application.":
                "This is a secure area of the application. Please confirm your password before continuing.",
            Password: "Password",
            Confirm: "Confirm",
        },
    },
    ar: {
        translation: {
            "Confirm Password": "تأكيد كلمة المرور",
            "This is a secure area of the application.":
                "هذه منطقة آمنة من التطبيق. يرجى تأكيد كلمة المرور الخاصة بك قبل المتابعة.",
            Password: "كلمة المرور",
            Confirm: "تأكيد",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function ConfirmPassword() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.confirm"));
    };

    return (
        <GuestLayout centerContent box_width="max-w-xl">
            <Head title={t("Confirm Password")} />
            <div className="flex items-center justify-center flex-1 bg-indigoBlue dark:bg-gray-900">
                <div className="w-full max-w-lg px-6 py-4 mt-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {t("This is a secure area of the application.")}
                    </div>

                    <form onSubmit={submit}>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password"
                                value={t("Password")}
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full mt-1"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                {t("Confirm")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
