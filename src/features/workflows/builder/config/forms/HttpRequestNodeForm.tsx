import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
      headers: typeof config?.headers === "object" ? JSON.stringify(config.headers, null, 2) : config?.headers || "",
      body: typeof config?.body === "object" ? JSON.stringify(config.body, null, 2) : config?.body || "",
    },
  })

  const { watch } = form

  // Instant store sync on values change
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      let headersObj = values.headers;
      try {
        if (values.headers && values.headers.trim() !== "") {
          headersObj = JSON.parse(values.headers);
        }
      } catch (e) {
        // Keep as string if not valid JSON yet
      }

      let bodyObj = values.body;
      try {
        if (values.body && values.body.trim() !== "") {
          bodyObj = JSON.parse(values.body);
        }
      } catch (e) {
        // Keep as string if not valid JSON yet
      }

      updateNodeConfig(nodeId, {
        method: values.method,
        url: values.url,
        headers: headersObj,
        body: bodyObj,
      })
    })
    return () => unsubscribe()
  }, [watch, nodeId, updateNodeConfig])

  const method = watch("method")
  const showBody = ["POST", "PUT", "PATCH"].includes(method || "")

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

        <FormField
          control={form.control}
          name="headers"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="http-headers-input">Headers (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  id="http-headers-input"
                  placeholder='{\n  "Authorization": "Bearer key_123",\n  "Content-Type": "application/json"\n}'
                  className="font-mono text-xs h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showBody && (
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="http-body-input">Request Body (JSON / Text)</FormLabel>
                <FormControl>
                  <Textarea
                    id="http-body-input"
                    placeholder='{\n  "message": "{{context.data.promptResult}}"\n}'
                    className="font-mono text-xs h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
})

HttpRequestNodeForm.displayName = "HttpRequestNodeForm"
