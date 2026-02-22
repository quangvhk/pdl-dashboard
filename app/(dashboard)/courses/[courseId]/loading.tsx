import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CourseDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton className="h-4 w-32" />

      {/* Course header */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Thumbnail */}
        <div className="lg:col-span-1">
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>

        {/* Meta */}
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* CTA */}
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      {/* Sections accordion */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3 py-1">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
