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
        translation: {},
    },
    ar: {
        translation: {
            "Create Warehouse": "انشاء مخزن",
            "Warehouses": "المخازن",
            "Warehouse Name": "اسم المخزن",
            "Status": "الحالة",
            "Select Status": "اختر الحاله",
            "Cancel": "إلغاء",
            "Submit": "إرسال",
            'Active': 'نشط',
            'Inactive': 'غير نشط',
            "Phone": "رقم الهاتف",
            "Address": "العنوان",
        },
    },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

export default function Create({ auth, user }) {
  const { t } = useTranslation(); // Hook to get translations

  const { data, setData, post, errors, reset } = useForm({
    name: "",
    is_active: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();

    post(route("warehouse.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight  dark:text-gray-200">
            {t("Create Warehouse")}
          </h2>
        </div>
      }
    >
      <Head title={t("Warehouses")} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg"
            >
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-6">
            <div className="mt-4">
                <InputLabel htmlFor="name" value={t("Warehouse Name")} />

                <TextInput
                  id="name"
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
                <InputLabel htmlFor="is_active" value={t("Status")} />

                    <SelectInput
                        name="is_active"
                        id="is_active"
                        className="block w-full mt-1"
                        value={data.is_active}
                        onChange={(e) => setData("is_active", e.target.value === "true") }  // Convert string to boolean
                    >
                        <option value="">{t("Select Status")}</option>
                        <option value="true" key="1">{t('Active')}</option>
                        <option value="false" key="2">{t('Inactive')}</option>
                    </SelectInput>

                <InputError message={errors.is_active} className="mt-2" />
                              </div>

                                              <div className="mt-4">
                <InputLabel htmlFor="phone" value={t("Phone")} />

                <TextInput
                  id="phone"
                  type="tel"
                  name="phone"
                  value={data.phone}
                  className="block w-full mt-1"
                  isFocused={true}
                  onChange={(e) => setData("phone", e.target.value)}
                />

                <InputError message={errors.phone} className="mt-2" />
                              </div>

                                              <div className="mt-4">
                <InputLabel htmlFor="address" value={t("Address")} />

                <TextInput
                  id="address"
                  type="text"
                  name="address"
                  value={data.address}
                  className="block w-full mt-1"
                  isFocused={true}
                  onChange={(e) => setData("address", e.target.value)}
                />

                <InputError message={errors.address} className="mt-2" />
              </div>
              </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("warehouse.index")}
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
    </AuthenticatedLayout>
  );
}
