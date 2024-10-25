import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import UpdateProfileImage from "./Partials/UpdateProfileImage";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

const Edit = ({ auth, site_settings, mustVerifyEmail, status, }) => {
  const { t } = useTranslation();

    return (
        <>
            <Head title="Profile" />
            <div className="">
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Profile")}
                    </h2>

                </div>
                <div className="mx-auto space-y-6 max-w-7xl ">
                    <div className="p-4 bg-white shadow sm:p-4 dark:bg-gray-800 sm:rounded-lg">
                        <UpdateProfileImage
                            className="max-w-xl"
                        />
                    </div>
                    <div className="p-4 bg-white shadow sm:p-4 dark:bg-gray-800 sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 bg-white shadow sm:p-4 dark:bg-gray-800 sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    {/* <div className="p-4 bg-white shadow sm:p-4 dark:bg-gray-800 sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div> */}
                </div>
            </div>
        </>
    );
};

Edit.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}
    >
        {page}
    </AuthenticatedLayout>
);

export default Edit;
