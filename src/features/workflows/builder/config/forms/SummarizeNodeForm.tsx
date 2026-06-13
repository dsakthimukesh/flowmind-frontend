import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { summarizeNodeSchema, type SummarizeNodeValues } from "../schemas/summarize.schema"

interface SummarizeNodeFormProps {
  nodeId: string
  config?: any
}

export const SummarizeNodeForm = React.memo(({ nodeId, config }: SummarizeNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<SummarizeNodeValues>({
    resolver: zodResolver(summarizeNodeSchema) as any,
    mode: "onChange",
    defaultValues: {
      maxLength: config?.maxLength !== undefined ? config.maxLength : "",
    },
  })

  const { watch } = form

  // Instant store sync on values change
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      const parsedVal = values.maxLength !== undefined ? parseInt(values.maxLength as any) : undefined
      updateNodeConfig(nodeId, {
        maxLength: isNaN(parsedVal as any) ? undefined : parsedVal,
      })
    })
    return () => unsubscribe()
  }, [watch, nodeId, updateNodeConfig])

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control as any}
          name="maxLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="summarize-len-input">Max Length (Characters)</FormLabel>
              <FormControl>
                <Input
                  id="summarize-len-input"
                  type="number"
                  min="1"
                  placeholder="e.g. 500"
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

SummarizeNodeForm.displayName = "SummarizeNodeForm"
