'use client'

// NOTE: User creation via form is no longer supported in V2.
// Users are created via the registration flow + invitation acceptance (FE-4.2).
// This file is kept as a stub until FE-5.1 cleanup removes it entirely.

interface UserFormProps {
  onCancel?: () => void
}

export function UserForm({ onCancel: _onCancel }: UserFormProps) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="text-muted-foreground text-sm">
        User creation is no longer available. Invite users via the Invitations module.
      </p>
    </div>
  )
}
