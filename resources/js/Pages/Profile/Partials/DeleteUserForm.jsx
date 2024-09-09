import React, { useRef, useState } from "react";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const resources = {
    en: {
        translation: {
            "Delete Account": "Delete Account",
            "Delete Account Description":
                "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.",
            "Delete Confirmation":
                "Are you sure you want to delete your account?",
            "Delete Confirmation Description":
                "Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.",
            Password: "Password",
            Cancel: "Cancel",
        },
    },
    ar: {
        translation: {
            "Delete Account": "حذف الحساب",
            "Delete Account Description":
                "بمجرد حذف حسابك، سيتم حذف جميع موارده وبياناته نهائيًا. قبل حذف حسابك، يرجى تنزيل أي بيانات أو معلومات ترغب في الاحتفاظ بها.",
            "Delete Confirmation": "هل أنت متأكد أنك تريد حذف حسابك؟",
            "Delete Confirmation Description":
                "بمجرد حذف حسابك، سيتم حذف جميع موارده وبياناته نهائيًا. يرجى إدخال كلمة المرور الخاصة بك لتأكيد رغبتك في حذف حسابك نهائيًا.",
            Password: "كلمة المرور",
            Cancel: "إلغاء",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function DeleteUserForm({ className = "" }) {
    const { t } = useTranslation(); 
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t("Delete Account")}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t("Delete Account Description")}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {t("Delete Account")}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("Delete Confirmation")}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {t("Delete Confirmation Description")}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={t("Password")}
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="block w-3/4 mt-1"
                            isFocused
                            placeholder={t("Password")}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <SecondaryButton onClick={closeModal}>
                            {t("Cancel")}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {t("Delete Account")}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
