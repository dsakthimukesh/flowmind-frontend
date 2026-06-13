import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { conditionNodeSchema, type ConditionNodeValues } from "../schemas/condition.schema"

interface ConditionNodeFormProps {
  nodeId: string
  config?: any
}

export const ConditionNodeForm = React.memo(({ nodeId, config }: ConditionNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<ConditionNodeValues>({
    resolver: zodResolver(conditionNodeSchema),
    mode: "onChange",
    defaultValues: {
      expression: config?.expression || "",
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
          name="expression"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="expression-input">Evaluation Expression</FormLabel>
              <FormControl>
                <Input
                  id="expression-input"
                  placeholder="e.g. input.score > 80"
                  {...field}
                />
              </FormControl>
              <span className="text-[10px] text-muted-foreground block">
                Define the javascript expression to route paths based on incoming payloads.
              </span>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

ConditionNodeForm.displayName = "ConditionNodeForm"
