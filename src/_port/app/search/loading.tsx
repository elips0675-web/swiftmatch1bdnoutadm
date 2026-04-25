
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="flex flex-col h-svh bg-[#f8f9fb] px-4 pt-4 pb-24 items-center">
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="w-full flex-1 max-w-[420px] mb-10 relative">
        <Skeleton className="w-full h-full rounded-[2.5rem] app-shadow border-4 border-white" />
      </div>
      <div className="flex justify-center items-center gap-4 w-full max-w-[400px]">
        <Skeleton className="w-14 h-14 rounded-full" />
        <Skeleton className="w-14 h-14 rounded-full" />
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    </div>
  );
}
