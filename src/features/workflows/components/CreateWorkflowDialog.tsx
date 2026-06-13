import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCreateWorkflow } from "../hooks/useCreateWorkflow"
import { createWorkflowSchema, type CreateWorkflowValues } from "../schemas/createWorkflowSchema"

interface CreateWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateWorkflowDialog = React.memo(({ open, onOpenChange }: CreateWorkflowDialogProps) => {
  const { mutate: create, isPending } = useCreateWorkflow(() => {
    onOpenChange(false)
    form.reset()
  })

  const form = useForm<CreateWorkflowValues>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = (values: CreateWorkflowValues) => {
    create(values)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) form.reset()
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" /> Create New Workflow
          </DialogTitle>
          <DialogDescription>
            Workflows allow you to design automated actions using multiple AI agents and integrations.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="workflow-name-input">Workflow Name</FormLabel>
                  <FormControl>
                    <Input
                      id="workflow-name-input"
                      placeholder="e.g. Lead Qualification Agent"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="workflow-desc-input">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="workflow-desc-input"
                      placeholder="Describe what tasks this automation will orchestrate..."
                      rows={3}
                      className="resize-none"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                id="workflow-cancel-button"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button id="workflow-submit-button" type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Workflow
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

CreateWorkflowDialog.displayName = "CreateWorkflowDialog"
