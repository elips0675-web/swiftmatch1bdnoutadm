
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col h-svh bg-[#f8f9fb] overflow-hidden">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="px-5 -mt-10 flex flex-col items-center">
        <Skeleton className="w-32 h-32 rounded-xl border-[6px] border-white app-shadow mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm mb-8">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-xl mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
