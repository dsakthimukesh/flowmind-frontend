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
import { Label } from "@/components/ui/label"
import { createApiKeySchema, type CreateApiKeyInput } from "../schemas/createApiKey.schema"
import { useCreateApiKey } from "../hooks/useCreateApiKey"
import { type ApiKeyCreatedResponse } from "../types/apiKey.types"

interface CreateApiKeyDialogProps {
  onSuccess: (data: ApiKeyCreatedResponse) => void
}

export const CreateApiKeyDialog = React.memo(({ onSuccess }: CreateApiKeyDialogProps) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync: createKey, isPending } = useCreateApiKey()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateApiKeyInput>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: CreateApiKeyInput) => {
    try {
      const response = await createKey(data)
      toast.success("API key created successfully")
      reset()
      setOpen(false)
      onSuccess(response.data)
    } catch {
      toast.error("Failed to create API key")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
          <Plus className="h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="keyName" className="text-sm font-semibold">
              Key Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="keyName"
              placeholder="e.g. GitHub Actions Integration"
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>
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
              {isPending ? "Generating..." : "Generate Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})

CreateApiKeyDialog.displayName = "CreateApiKeyDialog"
