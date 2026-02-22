'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
  handleClassName?: string
  disabled?: boolean
}

export function SortableItem({
  id,
  children,
  className,
  handleClassName,
  disabled = false,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'z-50 opacity-80 shadow-lg',
        className,
      )}
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        type="button"
        aria-label="Drag to reorder"
        className={cn(
          'absolute left-1 top-1/2 -translate-y-1/2 cursor-grab touch-none p-1 text-muted-foreground',
          'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
          'active:cursor-grabbing',
          disabled && 'cursor-not-allowed opacity-40',
          handleClassName,
        )}
        disabled={disabled}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  )
}
