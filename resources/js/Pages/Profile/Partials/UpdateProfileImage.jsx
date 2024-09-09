import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";


const resources = {
    en: {
        translation: {
            "Update Profile Image": "Update Profile Image",
            "Select A New Photo": "Select A New Photo",
            "Remove Photo": "Remove Photo",
            Save: "Save",
        },
    },
    ar: {
        translation: {
            "Update Profile Image": "تحديث صورة الملف الشخصي",
            "Select A New Photo": "اختر صورة جديدة",
            "Remove Photo": "إزالة الصورة",
            Save: "حفظ",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function UpdateProfileImage({ className = "" }) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url);
    const photoInput = useRef(null);

    const { setData, post, errors, processing } = useForm({
        photo: null,
    });

    const updatePhotoPreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhotoPreview(event.target.result);
                setData("photo", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectNewPhoto = () => {
        photoInput.current.click();
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setData("photo", null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update-photo"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t("Update Profile Image")}
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <input
                    id="photo"
                    ref={photoInput}
                    type="file"
                    className="hidden"
                    onChange={updatePhotoPreview}
                />

                <div className="mt-2">
                    {photoPreview ? (
                        <img
                            src={photoPreview}
                            alt={user.name}
                            className="object-cover w-20 h-20 rounded-full"
                        />
                    ) : (
                        <span className="block w-20 h-20 bg-gray-200 rounded-full" />
                    )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <SecondaryButton type="button" onClick={selectNewPhoto}>
                        {t("Select A New Photo")}
                    </SecondaryButton>

                    {user.profile_photo_path && (
                        <SecondaryButton type="button" onClick={removePhoto}>
                            {t("Remove Photo")}
                        </SecondaryButton>
                    )}
                </div>

                <InputError message={errors.photo} className="mt-2" />

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {t("Save")}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
