import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  createKnowledgeBaseSchema,
  type CreateKnowledgeBaseInput,
} from "../schemas/createKnowledgeBase.schema"
import { useCreateKnowledgeBase } from "../hooks/useCreateKnowledgeBase"

export const CreateKnowledgeBaseDialog = React.memo(() => {
  const [open, setOpen] = useState(false)
  const { mutateAsync: createKb, isPending } = useCreateKnowledgeBase()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateKnowledgeBaseInput>({
    resolver: zodResolver(createKnowledgeBaseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (data: CreateKnowledgeBaseInput) => {
    try {
      await createKb(data)
      toast.success("Knowledge Base created successfully")
      reset()
      setOpen(false)
    } catch {
      toast.error("Failed to create Knowledge Base")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
          <Plus className="h-4 w-4" />
          Create Knowledge Base
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Customer Support FAQ"
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide context about the files stored in this knowledge base..."
              rows={3}
              className={`resize-none ${
                errors.description ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setOpen(false)
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})

CreateKnowledgeBaseDialog.displayName = "CreateKnowledgeBaseDialog"
