import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { transformNodeSchema, type TransformNodeValues } from "../schemas/transform.schema"

interface TransformNodeFormProps {
  nodeId: string
  config?: any
}

export const TransformNodeForm = React.memo(({ nodeId, config }: TransformNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<TransformNodeValues>({
    resolver: zodResolver(transformNodeSchema),
    mode: "onChange",
    defaultValues: {
      template: config?.template || "",
    },
  })

  const { watch } = form

  // Instant store sync on values change
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
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transform-template-input">Transformation Template</FormLabel>
              <FormControl>
                <Textarea
                  id="transform-template-input"
                  placeholder="e.g. return { status: 'success', data: input.payload }"
                  rows={8}
                  className="font-mono text-xs"
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

TransformNodeForm.displayName = "TransformNodeForm"
