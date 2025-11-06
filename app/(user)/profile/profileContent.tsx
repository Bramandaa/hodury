"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  startTransition,
  use,
  useActionState,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit3, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editUserAdress, editUserProfile } from "@/action/profile";
import { InputField } from "@/components/inputField";
import Spinner from "@/components/spinner";
import { UserDto } from "@/lib/dto/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileContent({
  user,
}: {
  user: Promise<UserDto | null> | null;
}) {
  const userData = user && use(user);
  const [state, action, isPending] = useActionState(editUserProfile, null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        setOpen(false);
      });
    }
  }, [state?.success, state?.timestamp]);

  return (
    <>
      <Card className="rounded-2xl shadow-md border border-gray-200">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg font-semibold">
            Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-2 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-primary/20">
              <AvatarImage src={userData?.name} alt={userData?.name} />
              <AvatarFallback>{userData?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="w-full md:flex items-center space-y-4">
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-800">
                  {userData?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {userData?.email || "Belum mengisi email"}
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Phone size={16} className="text-primary" />
                  <span className="text-gray-700">{userData?.phone}</span>
                </div>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="rounded-xl flex items-center gap-1 bg-primary text-white hover:bg-primary/90 cursor-pointer"
                  >
                    <Edit3 size={14} /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profil</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" action={action}>
                    <InputField
                      id="name"
                      label="Nama"
                      placeholder="Masukkan nama lengkap"
                      defaultValue={state?.inputs?.name ?? userData?.name ?? ""}
                      required
                      autoComplete="name"
                      error={state?.errors?.name}
                    />
                    <InputField
                      id="email"
                      label="Email"
                      type="email"
                      placeholder="Masukkan Email"
                      defaultValue={
                        state?.inputs?.email ?? userData?.email ?? ""
                      }
                      autoComplete="email"
                      error={state?.errors?.email}
                    />
                    <InputField
                      id="phone"
                      label="Nomor HP"
                      placeholder="Masukkan nomor HP"
                      defaultValue={
                        state?.inputs?.phone ?? userData?.phone ?? ""
                      }
                      required
                      autoComplete="tel"
                      error={state?.errors?.phone}
                    />
                    <DialogFooter>
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="bg-primary text-white w-20"
                      >
                        {isPending ? <Spinner /> : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function AddressContent({
  user,
}: {
  user: Promise<UserDto | null> | null;
}) {
  const userData = user && use(user);
  const [state, action, isPending] = useActionState(editUserAdress, null);

  const [open, setOpen] = useState(false);

  const [provinsi, setProvinsi] = useState(
    state?.inputs?.provinsi ?? userData?.provinsi ?? ""
  );
  const [kabupaten, setKabupaten] = useState(
    state?.inputs?.kabupaten ?? userData?.kabupaten ?? ""
  );
  const [kecamatan, setKecamatan] = useState(
    state?.inputs?.kecamatan ?? userData?.kecamatan ?? ""
  );

  const kecamatanOptions = [
    "Kuta Selatan",
    "Kuta",
    "Kuta Utara",
    "Mengwi",
    "Abiansemal",
    "Petang",
  ];

  const hasAddress =
    userData?.fullAddress &&
    userData?.provinsi &&
    userData?.kabupaten &&
    userData?.kecamatan;

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        setOpen(false);
      });
    }
  }, [state?.success, state?.timestamp]);

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">Alamat</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-2 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-primary mt-1" />
          <div className="capitalize">
            <p className="font-medium text-gray-800">
              {hasAddress ? userData.fullAddress : "Belum ada alamat"}
            </p>
            {hasAddress && (
              <p className="text-gray-600 text-sm">
                {userData.kecamatan}, {userData.kabupaten}, {userData.provinsi}
              </p>
            )}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-xl flex items-center gap-1 bg-primary text-white hover:bg-primary/90 cursor-pointer"
            >
              <Edit3 size={14} /> {hasAddress ? "Edit Alamat" : "Tambah Alamat"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>
                {hasAddress ? "Edit Alamat" : "Tambah Alamat"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-5" action={action}>
              <InputField
                id="fullAddress"
                label="Alamat Lengkap"
                placeholder="Masukkan alamat lengkap"
                defaultValue={
                  state?.inputs?.fullAddress ?? userData?.fullAddress ?? ""
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
                      <SelectItem className="capitalize" key={kec} value={kec}>
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
      </CardContent>
    </Card>
  );
}
