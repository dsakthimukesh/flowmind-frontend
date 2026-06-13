import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { delayNodeSchema, type DelayNodeValues } from "../schemas/delay.schema"

interface DelayNodeFormProps {
  nodeId: string
  config?: any
}

export const DelayNodeForm = React.memo(({ nodeId, config }: DelayNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<DelayNodeValues>({
    resolver: zodResolver(delayNodeSchema) as any,
    mode: "onChange",
    defaultValues: {
      seconds: config?.seconds !== undefined ? config.seconds : "",
    },
  })

  const { watch } = form

  // Instant store sync on values change
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      const parsedVal = values.seconds !== undefined ? parseInt(values.seconds as any) : undefined
      updateNodeConfig(nodeId, {
        seconds: isNaN(parsedVal as any) ? undefined : parsedVal,
      })
    })
    return () => unsubscribe()
  }, [watch, nodeId, updateNodeConfig])

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control as any}
          name="seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="delay-seconds-input">Delay Duration (Seconds)</FormLabel>
              <FormControl>
                <Input
                  id="delay-seconds-input"
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
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

DelayNodeForm.displayName = "DelayNodeForm"
