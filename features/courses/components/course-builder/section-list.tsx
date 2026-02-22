'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Pencil, Trash2, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SortableItem } from './sortable-item'
import { SectionForm } from './section-form'
import { LessonList } from './lesson-list'
import { sectionsService } from '@/lib/api/services/sections.service'
import { sectionsQueryKeys, useSections } from '@/features/courses/hooks/use-sections'
import type { Section } from '@/types'

interface SectionListProps {
  courseId: string
}

function SectionItem({
  section,
  courseId,
  onEdit,
  onDelete,
}: {
  section: Section
  courseId: string
  onEdit: (section: Section) => void
  onDelete: (section: Section) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-md border bg-card">
      {/* Section header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Expand/collapse toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={expanded ? 'Collapse section' : 'Expand section'}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        <span className="flex-1 truncate font-medium text-sm">{section.title}</span>

        {section.lessonsCount !== undefined && (
          <Badge variant="outline" className="text-xs">
            {section.lessonsCount} lesson{section.lessonsCount !== 1 ? 's' : ''}
          </Badge>
        )}

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(section)}
            aria-label="Edit section"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(section)}
            aria-label="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Lessons + quizzes */}
      {expanded && (
        <div className="border-t pb-2">
          <LessonList courseId={courseId} sectionId={section.id} />
        </div>
      )}
    </div>
  )
}

export function SectionList({ courseId }: SectionListProps) {
  const queryClient = useQueryClient()
  const { data: sections = [], isLoading } = useSections(courseId)

  const [sectionFormOpen, setSectionFormOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [deletingSection, setDeletingSection] = useState<Section | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const deleteMutation = useMutation({
    mutationFn: (sectionId: string) => sectionsService.delete(courseId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsQueryKeys.byCourse(courseId) })
      setDeletingSection(null)
    },
  })

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Optimistic reorder
    const reordered = [...sections]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    queryClient.setQueryData(sectionsQueryKeys.byCourse(courseId), reordered)

    // Persist new sortOrder
    await sectionsService.update(courseId, moved.id, { sortOrder: newIndex })
    queryClient.invalidateQueries({ queryKey: sectionsQueryKeys.byCourse(courseId) })
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sections.length === 0 ? (
        <div className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
          No sections yet. Add your first section to get started.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sections.map((section) => (
                <SortableItem key={section.id} id={section.id} className="pl-6">
                  <SectionItem
                    section={section}
                    courseId={courseId}
                    onEdit={(s) => {
                      setEditingSection(s)
                      setSectionFormOpen(true)
                    }}
                    onDelete={setDeletingSection}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add section button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setEditingSection(null)
          setSectionFormOpen(true)
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Section
      </Button>

      {/* Section form dialog */}
      <SectionForm
        courseId={courseId}
        section={editingSection}
        open={sectionFormOpen}
        onOpenChange={(open) => {
          setSectionFormOpen(open)
          if (!open) setEditingSection(null)
        }}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingSection}
        onOpenChange={(open) => !open && setDeletingSection(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingSection?.title}&quot;? All lessons and
              quizzes in this section will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSection && deleteMutation.mutate(deletingSection.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
