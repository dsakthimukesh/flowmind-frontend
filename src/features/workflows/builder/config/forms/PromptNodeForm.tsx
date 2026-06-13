import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { promptNodeSchema, type PromptNodeValues } from "../schemas/prompt.schema"

interface PromptNodeFormProps {
  nodeId: string
  config?: any
}

export const PromptNodeForm = React.memo(({ nodeId, config }: PromptNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<PromptNodeValues>({
    resolver: zodResolver(promptNodeSchema),
    mode: "onChange",
    defaultValues: {
      prompt: config?.prompt || "",
    },
  })

  const { watch } = form

  // Instant store sync on typing/changes
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      updateNodeConfig(nodeId, values)
    })
    return () => unsubscribe()
  }, [watch, nodeId, updateNodeConfig])

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="prompt-input">Prompt Text</FormLabel>
              <FormControl>
                <Textarea
                  id="prompt-input"
                  placeholder="Enter the LLM prompt instruction..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

PromptNodeForm.displayName = "PromptNodeForm"
