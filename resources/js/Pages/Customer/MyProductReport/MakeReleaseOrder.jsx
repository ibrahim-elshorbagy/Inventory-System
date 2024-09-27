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
      "Select Product": "اختر المنتج",
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

export default function MakeReleaseOrder({ auth, products = { data: [] } }) {
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
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
            {t("Make Release Request")}
          </h2>
        </div>
      }
    >
      <Head title={t("Orders")} />

      <div className="py-12">
              <div className="mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg"
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

              {productSelections.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {t("No products selected")}
                </div>
              )}

              {productSelections.map((product, index) => (
                <div
                  key={index}
                  className="grid items-center justify-center grid-cols-8 gap-4 m-4 mb-4 text-center sm:gap-6 sm:mb-6"
                >
                      <div className="w-full col-span-2">
                        <InputLabel value={product.product_name} />
                      </div>
                      <div className="flex items-center col-span-2 gap-2">
                        <InputLabel value={t("Remaining")} />
                        <TextInput
                          type="number"
                          value={product.max_quantity}
                          className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                          readOnly
                        />
                      </div>

                    <div className="flex items-center justify-center col-span-4 gap-10">
                      <InputLabel value={t("Release")} />
                      <TextInput
                        type="number"
                        value={product.quantity}
                        className="block w-1/2 mt-1 dark:bg-gray-700 dark:text-gray-200"
                        onChange={(e) =>
                          handleProductChange(index, "quantity", e.target.value)
                        }
                              />
                        <img className="object-cover rounded-md w-28" src={product.product_image} alt={product.product_name}  />
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800"
                        onClick={(e) => handleDeleteProduct(index, e)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <InputError
                      message={errors[`product_quantities.${index}.quantity`]}
                      className="mt-2"
                    />
                </div>
              ))}

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
    </AuthenticatedLayout>
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
