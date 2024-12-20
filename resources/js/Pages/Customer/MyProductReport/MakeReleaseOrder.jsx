import React, { useState, useEffect } from "react";
import {ChevronsUpDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import TextAreaInput from "@/Components/TextAreaInput";
import i18n from "@/i18nConfig";

const resources = {
  en: {
    translation: {},
  },
  ar: {
      translation: {
      "Product Name": "اسم المنتج",
      "Add Stock to": " اضافة منتجات الي",
      "Stocks": "التخزين",
      "Stock Name": "اسم االتخزين",
      "Status": "الحالة",
      "Select Status": "اختر الحاله",
      "Cancel": "إلغاء",
      "Submit": "إرسال",
      "Active": "نشط",
      "Inactive": "غير نشط",
      "Warehouse": "المخزن",
      "Select Warehouse": "اختر المخزن",
      "Quantity": "الكميه",
      "Product": "المنتج",
      "Delete": "حذف",
      "Add Another Product": "اضافة منتج اخر",
      "Unit": "الوحدة",
      "Search": "بحث",
      "Make Release Request": "طلب اعادة منتجات ",
      "Description": "بيان",
      "Remaining": "متوفر",
      "Release": "مطلوب ",
        "Select Product": "اختر المنتج",
          "No product found": "لا يوجد منتجات",
          "Delivery Address": "عنوان التسليم",
          "No products selected": "لم يتم تحديد المنتجات",
            "Orders": "الطلبات",
    },
  },
};

i18n.addResources("en", "translation", resources.en.translation);
i18n.addResources("ar", "translation", resources.ar.translation);

function MakeReleaseOrder({ auth,site_settings, products = { data: [] } }) {
  const { t } = useTranslation();


    // Form + submit
  const { data, setData, post, errors } = useForm({
    warehouse_id: "",
    product_quantities: [],
    description: "",
  });

const onSubmit = (e) => {

        e.preventDefault();
        post(route("customer.store-release-order"), {
        preserveScroll: true,
        });
};

  //----------------------------------------

  const [productSelections, setProductSelections] = useState([]);
  const [availableProducts, setAvailableProducts] = useState(products.data);

    useEffect(() => {
        setData("product_quantities", productSelections);
    }, [productSelections]);

  const handleProductSelect = (product) => {
    setProductSelections([
      ...productSelections,
      {
        stock_id: product.id, // this is right product.id is the coming from products from database and this represent stocks so he is  stock_id
        quantity: "",
        product_name: product.product_name,
        max_quantity: product.quantity,
        product_image: product.product_image,
      },
    ]);
    setAvailableProducts(availableProducts.filter((p) => p.id !== product.id)); //products on search box
  };

  const handleProductChange = (index, field, value) => {
    const newSelections = [...productSelections];
    newSelections[index][field] = value;
    setProductSelections(newSelections);
  };


  const handleDeleteProduct = (index, e) => {
    e.preventDefault();
    const deletedProduct = productSelections[index];
    setProductSelections(productSelections.filter((_, i) => i !== index));
    setAvailableProducts([...availableProducts, {
      id: deletedProduct.stock_id,
      product_name: deletedProduct.product_name,
        quantity: deletedProduct.max_quantity,
      product_image: deletedProduct.product_image,

    }]);
  };


  return (
    <>
      <Head title={site_settings.websiteName + " - " +t("Orders")} />

          <div className="">
                <div className="flex items-start justify-between p-5 mb-5 text-sm font-semibold leading-tight border-b md:text-lg dark:text-gray-200">
                    <h2>
                        {t("My Products Report")}
                    </h2>
                  
              </div>

        <div className="m-2">
          <div className="mx-auto overflow-auto bg-gray-100 rounded-md shadow-md sm:p-4 dark:bg-gray-700 ">
            <form
              onSubmit={onSubmit}
              className=""
            >
              <div className="grid items-center w-full grid-cols-2 col-span-4 gap-5">
                <div>
                  <InputLabel htmlFor={`description`} value={t("Description")} />
                  <TextAreaInput
                    id={`description`}
                    name="description"
                    value={data.description}
                    className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                    onChange={(e) => setData("description", e.target.value)}
                  />
                  <InputError message={errors.description} className="mt-2" />
                              </div>

                    <div>
                  <InputLabel htmlFor={`delivery_address`} value={t("Delivery Address")} />
                  <TextAreaInput
                    id={`delivery_address`}
                    name="delivery_address"
                    value={data.delivery_address}
                    className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                    onChange={(e) => setData("delivery_address", e.target.value)}
                  />
                  <InputError message={errors.delivery_address} className="mt-2" />
                </div>
              </div>

              <hr className="my-6 dark:border-gray-600" />

              <div className="grid gap-4 mb-4 sm:grid-cols-3 sm:gap-6 sm:mb-6">
                <ComboboxDemo
                  availableProducts={availableProducts}
                  onProductSelect={handleProductSelect}
                />
              </div>
            <div className="overflow-auto">
                <table className="w-full text-xs text-left text-gray-500 md:text-base rtl:text-right dark:text-gray-400">
                <thead className="text-gray-700 uppercase border-b-2 border-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                    <th className="p-3 text-nowrap min-w-48">{t("Product Name")}</th>
                    <th className="p-3 text-nowrap min-w-24">{t("Remaining")}</th>
                    <th className="p-3 text-nowrap min-w-24">{t("Release")}</th>
                    <th className="p-3 text-nowrap min-w-32">{t("Image")}</th>
                    <th className="p-3 text-nowrap min-w-24">{t("Delete")}</th>
                    </tr>
                </thead>
                <tbody>
                    {productSelections.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-base text-center text-gray-500 dark:text-gray-400">
                        {t("No products selected")}
                        </td>
                    </tr>
                    ) : (
                    productSelections.map((product, index) => (
                        <tr key={index} className="border-b dark:border-gray-700">
                        <td className="p-1">
                            <InputLabel value={product.product_name} />
                        </td>
                        <td className="p-1">
                            <div className="flex items-center gap-2">
                            <TextInput
                                type="number"
                                value={product.max_quantity}
                                className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                                readOnly
                            />
                            </div>
                        </td>
                        <td className="p-1">
                            <div className="flex items-center gap-2">
                            <TextInput
                                type="number"
                                value={product.quantity}
                                className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                                onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                            />
                            </div>
                        </td>
                        <td className="p-1">
                            <img
                            className="object-cover rounded-md w-28 h-28"
                            src={product.product_image}
                            alt={product.product_name}
                            />
                        </td>
                        <td className="p-1">
                            <Button
                            type="button"
                            variant="outline"
                            className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800"
                            onClick={(e) => handleDeleteProduct(index, e)}
                            >
                            <Trash className="w-4 h-4" />
                            </Button>
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
                        {/* Error Section */}
                            {Object.keys(errors).length > 0 && (
                                <div className="px-4 py-2 my-4 text-white bg-red-600 rounded">
                                    <ul>
                                        {Object.entries(errors).map(([field, errorMessage], index) => (
                                            <li key={index}>{errorMessage}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                </div>

              <div className="flex gap-2 mt-4 text-right">
                <Link
                  href={route("for-customer-my-products-report")}
                  className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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

function ComboboxDemo({ availableProducts, onProductSelect }) {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>

        <Button
          variant="outline"
            role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between dark:bg-gray-700 dark:text-gray-200"
        >
            {t("Select Product")}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
          </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0 dark:bg-gray-800 dark:border-gray-600">
        <Command>
          <CommandInput
            placeholder="Search product..."
            className=" dark:text-gray-200"
          />
          <CommandList className="dark:bg-gray-800">
            <CommandEmpty className="text-center dark:text-gray-400">
              {t('No product found')}
            </CommandEmpty>
            <CommandGroup className="dark:bg-gray-800">
                {availableProducts.map((product) => (
                    <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={() => {
                        setValue(product.id);
                        onProductSelect(product);
                        setOpen(false);
                    }}
                    className="dark:hover:bg-gray-700 dark:text-gray-200"
                    >
                    {product.product_name}
                    </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
          </PopoverContent>

    </Popover>
  );
}


MakeReleaseOrder.layout = (page) => (
    <AuthenticatedLayout
        user={page.props.auth.user}
        site_settings={page.props.site_settings}
    >
        {page}
    </AuthenticatedLayout>
);

export default MakeReleaseOrder;
