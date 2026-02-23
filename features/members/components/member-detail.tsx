'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  AlertCircle,
  UserCircle,
  Mail,
  Calendar,
  Shield,
  UserX,
  UserCheck,
  Trash2,
} from 'lucide-react'
import { useMember } from '../hooks/use-member'
import { useSuspendMember, useActivateMember } from '../hooks/use-suspend-member'
import { useRemoveMember } from '../hooks/use-remove-member'
import { ChangeRoleDialog } from './change-role-dialog'
import { RoleBadge } from '@/features/users/components/role-badge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface MemberDetailProps {
  memberId: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function MemberDetail({ memberId }: MemberDetailProps) {
  const router = useRouter()
  const [changeRoleOpen, setChangeRoleOpen] = useState(false)

  const { data: member, isLoading, isError } = useMember(memberId)
  const suspendMutation = useSuspendMember()
  const activateMutation = useActivateMember()
  const removeMutation = useRemoveMember()

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-muted h-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-48 animate-pulse rounded-lg" />
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (isError || !member) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load member. Please try again.
      </div>
    )
  }

  const name = member.user
    ? `${member.user.firstName} ${member.user.lastName}`
    : member.userId
  const initials = member.user
    ? `${member.user.firstName[0] ?? ''}${member.user.lastName[0] ?? ''}`.toUpperCase()
    : '?'
  const isActive = member.status === 'ACTIVE'

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Member Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar + meta */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{name}</h2>
              {member.user && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Mail className="h-3.5 w-3.5" />
                  {member.user.email}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <RoleBadge role={member.roleName} />
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Joined</p>
                <p className="font-medium">
                  {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Role</p>
                <p className="font-medium">{member.roleName}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {/* Change role */}
          <Button variant="outline" onClick={() => setChangeRoleOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Change Role
          </Button>

          {/* Suspend / Activate */}
          {isActive ? (
            <Button
              variant="outline"
              className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              onClick={() => suspendMutation.mutate(member.id)}
              disabled={suspendMutation.isPending}
            >
              <UserX className="mr-2 h-4 w-4" />
              {suspendMutation.isPending ? 'Suspending…' : 'Suspend'}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
              onClick={() => activateMutation.mutate(member.id)}
              disabled={activateMutation.isPending}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              {activateMutation.isPending ? 'Activating…' : 'Activate'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Remove Member</p>
              <p className="text-muted-foreground text-sm">
                Remove {name} from this tenant. They will lose access to all tenant
                resources. This action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove member?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {name} will be removed from this tenant and lose access to all tenant
                    resources. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      removeMutation.mutate(member.id, {
                        onSuccess: () => router.push('/members'),
                      })
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Change role dialog */}
      <ChangeRoleDialog
        member={member}
        open={changeRoleOpen}
        onOpenChange={setChangeRoleOpen}
      />
    </div>
  )
}
