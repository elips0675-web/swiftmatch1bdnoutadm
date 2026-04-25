
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="flex flex-col h-svh bg-[#f8f9fb] p-6 space-y-6">
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="space-y-4 flex-1">
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
