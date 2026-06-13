import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { httpNodeSchema, type HttpNodeValues } from "../schemas/http.schema"

interface HttpRequestNodeFormProps {
  nodeId: string
  config?: any
}

export const HttpRequestNodeForm = React.memo(({ nodeId, config }: HttpRequestNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<HttpNodeValues>({
    resolver: zodResolver(httpNodeSchema),
    mode: "onChange",
    defaultValues: {
      method: config?.method || "GET",
      url: config?.url || "",
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
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HTTP Method</FormLabel>
              <Select
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger id="http-method-trigger">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="http-url-input">Target URL</FormLabel>
              <FormControl>
                <Input
                  id="http-url-input"
                  placeholder="https://api.example.com/webhook"
                  type="url"
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

HttpRequestNodeForm.displayName = "HttpRequestNodeForm"
