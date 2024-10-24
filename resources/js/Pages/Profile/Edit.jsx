import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import UpdateProfileImage from "./Partials/UpdateProfileImage";

const Edit = ({ auth,site_settings, mustVerifyEmail, status,  }) => {
    return (
        <>
            <Head title="Profile" />
            <div className="">
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
        header={
            <h2 className="text-sm font-semibold leading-tight text-white md:text-lg dark:text-gray-200">
                Profile
            </h2>
        }
    >
        {page}
    </AuthenticatedLayout>
);

export default Edit;
