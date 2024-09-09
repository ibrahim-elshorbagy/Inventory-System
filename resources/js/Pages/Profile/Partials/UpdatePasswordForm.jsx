import { useRef } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";


const resources = {
    en: {
        translation: {
            "Update Password": "Update Password",
            "Update Password Description":
                "Ensure your account is using a long, random password to stay secure.",
            "Current Password": "Current Password",
            "New Password": "New Password",
            "Confirm Password": "Confirm Password",
            Save: "Save",
            Saved: "Saved.",
        },
    },
    ar: {
        translation: {
            "Update Password": "تحديث كلمة المرور",
            "Update Password Description":
                "تأكد من أن حسابك يستخدم كلمة مرور طويلة وعشوائية للحفاظ على أمانه.",
            "Current Password": "كلمة المرور الحالية",
            "New Password": "كلمة المرور الجديدة",
            "Confirm Password": "تأكيد كلمة المرور",
            Save: "حفظ",
            Saved: "تم الحفظ.",
        },
    },
};

// Add the resources to i18n
i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function UpdatePasswordForm({ className = "" }) {
    const { t } = useTranslation(); // Translation hook
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t("Update Password")}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t("Update Password Description")}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value={t("Current Password")}
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t("New Password")} />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t("Confirm Password")}
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {t("Save")}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("Saved")}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
