import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/data-access/user";

import { Suspense } from "react";

import { AddressContent, ProfileContent } from "./profileContent";
import {
  AddressSkeleton,
  ProfileSkeleton,
} from "@/components/skeletons/profileSkeleton";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session && getUserById(session.userId);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
      <h1 className="font-bold text-2xl text-primary">Profil Saya</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent user={user} />
      </Suspense>
      <Suspense fallback={<AddressSkeleton />}>
        <AddressContent user={user} />
      </Suspense>
    </section>
  );
}
