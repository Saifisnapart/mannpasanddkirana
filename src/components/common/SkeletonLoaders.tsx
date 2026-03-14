import { Skeleton } from '@/components/ui/skeleton';

export function ComparisonCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border bg-card space-y-3">
      <div className="flex gap-3">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="p-3 rounded-lg border bg-card space-y-2">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

export function VendorBannerSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-32 rounded-xl" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
