import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { chatNodeSchema, type ChatNodeValues } from "../schemas/chat.schema"

interface ChatNodeFormProps {
  nodeId: string
  config?: any
}

export const ChatNodeForm = React.memo(({ nodeId, config }: ChatNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<ChatNodeValues>({
    resolver: zodResolver(chatNodeSchema) as any,
    mode: "onChange",
    defaultValues: {
      systemPrompt: config?.systemPrompt || "",
      temperature: config?.temperature !== undefined ? config.temperature : 0.7,
    },
  })

  const { watch } = form

  // Instant store sync on values change
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      // Clean temperature input conversion
      const temp = values.temperature !== undefined ? parseFloat(values.temperature as any) : undefined
      updateNodeConfig(nodeId, {
        ...values,
        temperature: isNaN(temp as any) ? undefined : temp,
      })
    })
    return () => unsubscribe()
  }, [watch, nodeId, updateNodeConfig])

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control as any}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="system-prompt-input">System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  id="system-prompt-input"
                  placeholder="System instructions to guide agent behavior..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="temperature-input">Temperature (0 to 1)</FormLabel>
              <FormControl>
                <Input
                  id="temperature-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="e.g. 0.7"
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

ChatNodeForm.displayName = "ChatNodeForm"
