'use client'

import { useState } from 'react'
import { UserPlus, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { membersQueryKeys } from '@/features/members/hooks/use-members'
import { membersService } from '@/lib/api/services/members.service'
import { useGrantEnrollment } from '@/features/enrollments/hooks/use-enroll'

interface GrantEnrollmentDialogProps {
  courseId: string
}

export function GrantEnrollmentDialog({ courseId }: GrantEnrollmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const params = { status: 'ACTIVE' as const }
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: membersQueryKeys.list(params),
    queryFn: () => membersService.list(params),
    enabled: open,
    staleTime: 2 * 60 * 1000,
  })

  const { mutate: grantEnrollment, isPending } = useGrantEnrollment(courseId)

  const handleGrant = () => {
    if (!selectedUserId) return
    grantEnrollment(
      { courseId, userId: selectedUserId },
      {
        onSuccess: () => {
          setOpen(false)
          setSelectedUserId('')
        },
      },
    )
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) setSelectedUserId('')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Grant Access
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grant Course Access</DialogTitle>
          <DialogDescription>
            Select a tenant member to grant access to this course. They will be enrolled
            immediately without needing to self-enroll.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="member-select">Member</Label>
            {membersLoading ? (
              <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading members…
              </div>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active members found in this tenant.
              </p>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="member-select">
                  <SelectValue placeholder="Select a member…" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.userId}>
                      <span className="font-medium">
                        {member.user
                          ? `${member.user.firstName} ${member.user.lastName}`
                          : member.userId}
                      </span>
                      {member.user && (
                        <span className="ml-1.5 text-muted-foreground text-xs">
                          ({member.user.email})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleGrant} disabled={!selectedUserId || isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Granting…
              </>
            ) : (
              'Grant Access'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
