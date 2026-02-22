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
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Video,
  Music,
  FileIcon,
  ClipboardList,
  Loader2,
} from 'lucide-react'
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
import { LessonForm } from './lesson-form'
import { QuizForm } from '@/features/quizzes/components/quiz-form'
import { QuestionForm } from '@/features/quizzes/components/question-form'
import { lessonsService } from '@/lib/api/services/lessons.service'
import { quizzesService } from '@/lib/api/services/quizzes.service'
import { lessonsQueryKeys, useLessons } from '@/features/courses/hooks/use-lessons'
import { sectionsQueryKeys } from '@/features/courses/hooks/use-sections'
import { quizzesQueryKeys } from '@/features/quizzes/hooks/use-quiz'
import type { Lesson, Quiz, ContentType } from '@/types'

interface LessonListProps {
  courseId: string
  sectionId: string
  quizzes?: Quiz[]
}

const CONTENT_TYPE_ICON: Record<ContentType, React.ElementType> = {
  TEXT: FileText,
  VIDEO: Video,
  AUDIO: Music,
  DOCUMENT: FileIcon,
}

const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  TEXT: 'Text',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  DOCUMENT: 'Doc',
}

export function LessonList({ courseId, sectionId, quizzes = [] }: LessonListProps) {
  const queryClient = useQueryClient()
  const { data: lessons = [], isLoading } = useLessons(courseId, sectionId)

  // Lesson dialog state
  const [lessonFormOpen, setLessonFormOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null)

  // Quiz dialog state
  const [quizFormOpen, setQuizFormOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null)

  // Question dialog state
  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Delete lesson mutation
  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: string) => lessonsService.delete(courseId, sectionId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonsQueryKeys.bySection(courseId, sectionId) })
      setDeletingLesson(null)
    },
  })

  // Delete quiz mutation
  const deleteQuizMutation = useMutation({
    mutationFn: (quizId: string) => quizzesService.delete(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsQueryKeys.byCourse(courseId) })
      setDeletingQuiz(null)
    },
  })

  // Reorder lessons via drag-and-drop
  const handleLessonDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = lessons.findIndex((l) => l.id === active.id)
    const newIndex = lessons.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Optimistic reorder
    const reordered = [...lessons]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    queryClient.setQueryData(
      lessonsQueryKeys.bySection(courseId, sectionId),
      reordered,
    )

    // Persist new sortOrder
    await lessonsService.update(courseId, sectionId, moved.id, { sortOrder: newIndex })
    queryClient.invalidateQueries({ queryKey: lessonsQueryKeys.bySection(courseId, sectionId) })
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 pl-8 text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading lessons...
      </div>
    )
  }

  return (
    <div className="space-y-1 pl-6">
      {/* Lessons */}
      {lessons.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleLessonDragEnd}
        >
          <SortableContext
            items={lessons.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {lessons.map((lesson) => {
              const Icon = CONTENT_TYPE_ICON[lesson.contentType]
              return (
                <SortableItem key={lesson.id} id={lesson.id} className="pl-6">
                  <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{lesson.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {CONTENT_TYPE_LABEL[lesson.contentType]}
                    </Badge>
                    {lesson.durationMinutes && (
                      <span className="text-xs text-muted-foreground">
                        {lesson.durationMinutes}m
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setEditingLesson(lesson)
                          setLessonFormOpen(true)
                        }}
                        aria-label="Edit lesson"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeletingLesson(lesson)}
                        aria-label="Delete lesson"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </SortableItem>
              )
            })}
          </SortableContext>
        </DndContext>
      )}

      {/* Quizzes */}
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="space-y-1">
          <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm pl-6">
            <ClipboardList className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{quiz.title}</span>
            <Badge variant="secondary" className="text-xs">
              Quiz · {quiz.questionsCount ?? quiz.questions?.length ?? 0}q
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setActiveQuizId(quiz.id)
                  setQuestionFormOpen(true)
                }}
                aria-label="Add question"
                title="Add question"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setEditingQuiz(quiz)
                  setQuizFormOpen(true)
                }}
                aria-label="Edit quiz"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => setDeletingQuiz(quiz)}
                aria-label="Delete quiz"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 pl-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            setEditingLesson(null)
            setLessonFormOpen(true)
          }}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Lesson
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            setEditingQuiz(null)
            setQuizFormOpen(true)
          }}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Quiz
        </Button>
      </div>

      {/* Lesson form dialog */}
      <LessonForm
        courseId={courseId}
        sectionId={sectionId}
        lesson={editingLesson}
        open={lessonFormOpen}
        onOpenChange={(open) => {
          setLessonFormOpen(open)
          if (!open) setEditingLesson(null)
        }}
      />

      {/* Quiz form dialog */}
      <QuizForm
        courseId={courseId}
        sectionId={sectionId}
        quiz={editingQuiz}
        open={quizFormOpen}
        onOpenChange={(open) => {
          setQuizFormOpen(open)
          if (!open) setEditingQuiz(null)
        }}
      />

      {/* Question form dialog */}
      {activeQuizId && (
        <QuestionForm
          quizId={activeQuizId}
          question={null}
          open={questionFormOpen}
          onOpenChange={(open) => {
            setQuestionFormOpen(open)
            if (!open) setActiveQuizId(null)
          }}
        />
      )}

      {/* Delete lesson confirmation */}
      <AlertDialog
        open={!!deletingLesson}
        onOpenChange={(open) => !open && setDeletingLesson(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingLesson?.title}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLessonMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingLesson && deleteLessonMutation.mutate(deletingLesson.id)}
              disabled={deleteLessonMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLessonMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete quiz confirmation */}
      <AlertDialog
        open={!!deletingQuiz}
        onOpenChange={(open) => !open && setDeletingQuiz(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingQuiz?.title}&quot;? All questions will
              be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteQuizMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingQuiz && deleteQuizMutation.mutate(deletingQuiz.id)}
              disabled={deleteQuizMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteQuizMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
