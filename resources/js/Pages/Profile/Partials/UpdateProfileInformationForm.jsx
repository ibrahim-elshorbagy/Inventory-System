import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";


const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Profile Information": "معلومات الملف الشخصي",
            "Profile Information Description":
                "قم بتحديث معلومات ملفك الشخصي.",
            Name: "الاسم",
            Email: "البريد الإلكتروني",
            "Your email address is unverified.":
                "لم يتم التحقق من عنوان بريدك الإلكتروني.",
            "Click here to re-send the verification email.":
                "انقر هنا لإعادة إرسال بريد التحقق.",
            "A new verification link has been sent to your email address.":
                "تم إرسال رابط تحقق جديد إلى عنوان بريدك الإلكتروني.",
            Save: "حفظ",
            Saved: "تم الحفظ.",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t("Profile Information")}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t("Profile Information Description")}
                </p>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={t("Name")} />

                    <TextInput
                        id="name"
                        className="block w-full mt-1"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                {user.permissions.includes("for-Acustomer-view-dashboard") && (

                    <div>

                        <InputLabel htmlFor="phone" value={t("Phone")} />

                        <TextInput
                            id="phone"
                            className="block w-full mt-1"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            required
                            isFocused
                            autoComplete="phone"
                        />

                        <InputError className="mt-2" message={errors.phone} />
                    </div>
                )}

                {user.permissions.includes("for-Acustomer-view-dashboard") && (
                    <div>
                        <InputLabel htmlFor="address" value={t("Address")} />

                        <TextInput
                            id="address"
                            className="block w-full mt-1"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            required
                            isFocused
                            autoComplete="address"
                        />

                        <InputError className="mt-2" message={errors.address} />
                    </div>)}


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
