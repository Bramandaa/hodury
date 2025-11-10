"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Phone } from "lucide-react";

import {
  startTransition,
  use,
  useActionState,
  useEffect,
  useState,
} from "react";
import { payment } from "@/action/checkout";
import Image from "next/image";
import Spinner from "@/components/spinner";
import { UserAddressDTO } from "@/lib/dto/user";
import { editAdressCheckout } from "@/action/profile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/inputField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateOrder } from "@/action/order";
import { CartItemDTO } from "@/lib/dto/cart";

export default function CheckoutContent({
  itemIds,
  itemsPromise,
  addressPromise,
}: {
  itemIds: number[];
  itemsPromise: Promise<CartItemDTO[]>;
  addressPromise: Promise<UserAddressDTO | null>;
}) {
  const items = use(itemsPromise);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const totalProductPrice = items.reduce((sum, item) => {
    if (!item.product) return sum;
    const { price, discount, discountType } = item.product;

    let finalPrice = price;

    if (discount && discountType) {
      if (discountType === "PERCENTAGE") {
        finalPrice = price - price * (discount / 100);
      } else if (discountType === "FIXED") {
        finalPrice = price - discount;
      }
    }

    return sum + finalPrice * item.quantity;
  }, 0);

  const additionalFee = 22000;
  const total = totalProductPrice + additionalFee;

  const handlePay = async () => {
    setLoading(true);

    const data = await payment({ itemIds, total });

    if (data.token) {
      // Pastikan Snap JS sudah ada
      const snapScript = document.createElement("script");
      snapScript.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      snapScript.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
      );
      document.body.appendChild(snapScript);

      snapScript.onload = () => {
        window.snap.pay(data.token, {
          onSuccess: async function (result) {
            console.log("Success:", result);
            await CreateOrder({
              itemIds,
              subtotal,
              invoiceNumber: data.invoiceNumber,
            });
          },
          onPending: function (result) {
            console.log("Pending:", result);
          },
          onError: function (result) {
            console.log("Error:", result);
          },
          onClose: function () {
            alert("Popup ditutup sebelum bayar");
          },
        });
      };
    }

    setLoading(false);
  };

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
        <h1 className="font-semibold text-xl capitalize">Checkout</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Kiri */}
          <div className="flex-1 space-y-4">
            <AddressForm addressPromise={addressPromise} />
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>Produk Dipesan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items?.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 border-b pb-4 last:border-none last:pb-0"
                  >
                    <div className="relative w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.product?.imageUrl || ""}
                        alt={item.product?.name || ""}
                        fill
                        priority
                        sizes="100vh"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} item
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      Rp{" "}
                      {(
                        item.product?.price || 0 * item.quantity
                      ).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Kanan */}
          <div className="w-full md:w-[35%] space-y-4">
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>Ringkasan Belanja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Total Harga ({items.length} barang)</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Total Ongkos Kirim</span>
                  <span>Rp 20.000</span>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="w-full flex justify-between text-sm text-left text-primary">
                    <span>Total Lainnya</span>
                    <ChevronDown size={16} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Biaya Layanan</span>
                      <span>Rp 1.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Jasa</span>
                      <span>Rp 1.000</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total Bayar</span>
                  <span className="text-primary">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
                {/* <input type="hidden" name="orderId" value={order.orderId} /> */}
                <Button
                  disabled={loading}
                  onClick={handlePay}
                  className="w-full bg-primary text-white rounded-lg cursor-pointer"
                >
                  {loading ? <Spinner /> : "Bayar"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

export function AddressForm({
  addressPromise,
}: {
  addressPromise: Promise<UserAddressDTO | null>;
}) {
  const address = use(addressPromise);
  const [state, action, isPending] = useActionState(editAdressCheckout, null);

  const [open, setOpen] = useState(false);

  const [provinsi, setProvinsi] = useState(
    state?.inputs?.provinsi ?? address?.provinsi ?? ""
  );
  const [kabupaten, setKabupaten] = useState(
    state?.inputs?.kabupaten ?? address?.kabupaten ?? ""
  );
  const [kecamatan, setKecamatan] = useState(
    state?.inputs?.kecamatan ?? address?.kecamatan ?? ""
  );

  const kecamatanOptions = [
    "Kuta Selatan",
    "Kuta",
    "Kuta Utara",
    "Mengwi",
    "Abiansemal",
    "Petang",
  ];

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        setOpen(false);
      });
    }
  }, [state?.success, state?.timestamp]);

  return (
    <div className="flex-1 space-y-4">
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Alamat Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="font-medium">{address?.name}</div>
              <div className="capitalize">
                {address?.fullAddress},{" "}
                <div>
                  {address?.kecamatan},{" " + address?.kabupaten},
                  {" " + address?.provinsi}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={12} className="text-primary" />
                <span>{address?.phone}</span>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl flex items-center gap-1 border-primary text-primary hover:text-white hover:bg-primary cursor-pointer"
                >
                  Ubah alamat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Ubah Alamat</DialogTitle>
                </DialogHeader>

                <form className="space-y-5" action={action}>
                  <InputField
                    id="fullAddress"
                    label="Alamat Lengkap"
                    placeholder="Masukkan alamat lengkap"
                    defaultValue={
                      state?.inputs?.fullAddress ?? address?.fullAddress ?? ""
                    }
                    required
                    autoComplete="fullAddress"
                    error={state?.errors?.fullAddress}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="capitalize">Provinsi</Label>
                      <Select
                        name="provinsi"
                        value={provinsi}
                        onValueChange={setProvinsi}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bali" className="capitalize">
                            Bali
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="capitalize">Kabupaten</Label>
                      <Select
                        name="kabupaten"
                        value={kabupaten}
                        onValueChange={setKabupaten}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kabupaten" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="badung" className="capitalize">
                            Badung
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="capitalize">Kecamatan</Label>
                    <Select
                      name="kecamatan"
                      value={kecamatan}
                      onValueChange={setKecamatan}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kecamatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {kecamatanOptions.map((kec) => (
                          <SelectItem
                            className="capitalize"
                            key={kec}
                            value={kec}
                          >
                            {kec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-primary text-white cursor-pointer w-20"
                    >
                      {isPending ? <Spinner /> : "Simpan"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
