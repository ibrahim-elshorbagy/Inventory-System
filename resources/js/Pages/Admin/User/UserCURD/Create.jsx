import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18nConfig";

    const resources = {
    en: {
        translation: {
            "Create user": "Create user",
            "Users": "Users",
            "User Name": "User Name",
            "User Email": "User Email",
            "Password": "Password",
            "Role": "Role",
            "Select Role": "Select Role",
            "Cancel": "Cancel",
            "Submit": "Submit"        },
    },
    ar: {
        translation: {
            "Create User": "انشاء مستخدم",
            "Users": "المستخدمين",
            "User Name": "اسم المستخدم",
            "User Email": "البريد الإلكتروني",
            "Password": "كلمة المرور",
            "Role": "الدور",
            "Select Role": "اختر الدور",
            "Cancel": "إلغاء",
            "Submit": "إرسال"
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

function Create({ auth,site_settings, user, roles }) {
  const { t } = useTranslation();

  const { data, setData, post, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();

    post(route("user.store"));
  };

  return (
    <>
      <Head title={site_settings.websiteName + " - " +t("Create User")} />

        <div >
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("Create User")}
                    </h2>
                </div>


        <div className="mx-auto max-w-7xl ">
            <div className="m-2 overflow-hidden bg-gray-100 rounded-md shadow-md dark:bg-gray-700">
            <form
              onSubmit={onSubmit}
              className="p-4 "
            >
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-6 max-w-7xl">
                <div className="mt-4">
                    <InputLabel htmlFor="user_name" value={t("User Name")} />

                    <TextInput
                    id="user_name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setData("name", e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="user_email" value={t("User Email")} />

                    <TextInput
                    id="user_email"
                    type="text"
                    name="email"
                    value={data.email}
                    className="block w-full mt-1"
                    onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="user_password" value={t("Password")} />

                    <TextInput
                    id="user_password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="block w-full mt-1"
                    onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="role" value={t("Role")} />

                    <SelectInput
                    name="role"
                    id="role"
                    className="block w-full mt-1"
                    value={data.role}
                    onChange={(e) => setData("role", e.target.value)}
                    >
                    <option value="">{t("Select Role")}</option>
                    {roles.map((role) => (
                        <option value={role.id} key={role.id}>
                        {role.name}
                        </option>
                    ))}
                    </SelectInput>

                    <InputError message={errors.role} className="mt-2" />
                </div>
            </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("user.index")}
                  className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200"
                >
                  {t("Cancel")}
                </Link>
                <button className="px-3 py-1 text-white transition-all rounded shadow bg-burntOrange hover:bg-burntOrangeHover">
                  {t("Submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


Create.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}
    >
        {page}
    </AuthenticatedLayout>
);

export default Create;
