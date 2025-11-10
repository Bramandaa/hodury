import { getCourierById } from "@/lib/data-access/user";
import EditCourierForm from "./editCourier";
import { Suspense } from "react";
import CourierEditFormSkeleton from "@/components/skeletons/courierEditFormSkeleton";

export default async function DetailCourierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courierPromise = getCourierById(Number(id));

  return (
    <>
      <Suspense fallback={<CourierEditFormSkeleton />}>
        <EditCourierForm courierPromise={courierPromise} />
      </Suspense>
    </>
  );
}
