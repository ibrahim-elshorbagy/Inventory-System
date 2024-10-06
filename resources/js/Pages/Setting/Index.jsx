import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import Input from "@/Components/ui/input";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";
import { t } from "i18next";

export default function SettingsPage({ auth, site_settings, settings, success }) {
    const { t } = useTranslation();

    const resources = {
    en: {
        translation: {},
    },
    ar: {
        translation: {
            "Site Info": "بيانات الموقع",
            "Update Site Info": "تحديث بيانات الموقع",
            "Site Name": "اسم الموقع",
            "Support Email": "بريد الدعم",
            "Support Phone": "هاتف الدعم",
            "Logo": "الشعار",
            "Save Changes": "حفظ التغييرات",
            "Support": "الدعم الفني",
            "Cancel": "إلغاء",
            "Update": "تحديث",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);



    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [visibleSuccess, setVisibleSuccess] = useState(success);
    const [operationPerformed, setOperationPerformed] = useState(false);

    useEffect(() => {
        if (success && operationPerformed) {
            setVisibleSuccess(success);
            const timer = setTimeout(() => {
                setVisibleSuccess(null);
                setOperationPerformed(false);

            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success,operationPerformed]);

    // Prepare form for edit
    const { data, setData, post, errors, reset } = useForm({
        site_name: settings.find(setting => setting.name === 'site_name')?.value || "",
        // company_logo: settings.find(setting => setting.name === 'company_logo')?.value || "",
        support_email: settings.find(setting => setting.name === 'support_email')?.value || "",
        support_phone: settings.find(setting => setting.name === 'support_phone')?.value || "",
    });

    // Toggle Edit Modal
        const toggleEditModal = () => {
            if (!isEditModalOpen) {
                // Set the form data with the latest values when opening the modal
                setData({
                    site_name: settings.find(setting => setting.name === 'site_name')?.value || "",
                    support_email: settings.find(setting => setting.name === 'support_email')?.value || "",
                    support_phone: settings.find(setting => setting.name === 'support_phone')?.value || "",
                });
            }
            setIsEditModalOpen(!isEditModalOpen);
        };

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.settings.update"), {
            onSuccess: () => {
                reset();
                toggleEditModal();
                setOperationPerformed(true);

            },
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            site_settings={site_settings}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold leading-tight md:text-lg dark:text-gray-200">
                        {t("Site Info")}
                    </h2>
                    <button
                        onClick={toggleEditModal}
                        className="px-3 py-1 text-sm text-white transition-all rounded shadow md:text-lg bg-burntOrange hover:bg-burntOrangeHover"
                    >
                        {t("Update Site Info")}
                    </button>
                </div>
            }
        >
            <Head title={site_settings.websiteName + " - " +site_settings.websiteName + " - " + t("Site Info")} />

            <div className="">
                <div className="mx-auto ">
                    {visibleSuccess && (
                        <div className="px-4 py-2 mb-4 text-white rounded bg-burntOrange">
                            {visibleSuccess}
                        </div>
                    )}
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Displaying settings in sections */}
                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">{t("Site Info")}</h3>
                                <p><strong>{t('Site Name')}: </strong>{settings.find(setting => setting.name === 'site_name')?.value}</p>
                            </section>

                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">{ t("Support")}</h3>
                                <p><strong>{t('Support Email')}: </strong>{settings.find(setting => setting.name === 'support_email')?.value}</p>
                                <p><strong>{t('Support Phone')}: </strong>{settings.find(setting => setting.name === 'support_phone')?.value}</p>
                            </section>

                            <section className="mb-6">
                                <h3 className="text-lg font-semibold">{t('Logo')}</h3>
                                <img
                                    src={`${settings.find(setting => setting.name === 'company_logo')?.value}`}
                                    alt="Company Logo"
                                    width="100"
                                />
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for editing settings */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-[95%] md:w-1/2 dark:bg-gray-800 animate-in">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">{t("Update Site Info")}</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="site_name" value={t('Site Name')} />
                                    <TextInput
                                        id="site_name"
                                        name="site_name"
                                        value={data.site_name}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData("site_name", e.target.value)}
                                    />
                                    <InputError message={errors.site_name} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="company_logo" value={t('Logo')} />
                                    <Input
                                        type="file"
                                        id={`image`}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData('image',e.target.files[0])}
                                    />
                                    <InputError message={errors.company_logo} className="mt-2" />
                                </div>


                                <div className="mb-4">
                                    <InputLabel htmlFor="support_email" value={t('Support Email')} />
                                    <TextInput
                                        id="support_email"
                                        name="support_email"
                                        value={data.support_email}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData("support_email", e.target.value)}
                                    />
                                    <InputError message={errors.support_email} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="support_phone" value={t('Support Phone')} />
                                    <TextInput
                                        id="support_phone"
                                        name="support_phone"
                                        value={data.support_phone}
                                        className="block w-full mt-1"
                                        onChange={(e) => setData("support_phone", e.target.value)}
                                    />
                                    <InputError message={errors.support_phone} className="mt-2" />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => toggleEditModal()}
                                        className="text-white bg-gray-600 hover:bg-gray-700"
                                    >
                                        {t("Cancel")}
                                    </Button>
                                    <Button type="submit" className="text-white bg-burntOrange hover:bg-burntOrangeHover">
                                        {t("Update")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
