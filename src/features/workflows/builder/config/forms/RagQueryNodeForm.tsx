import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWorkflowBuilderStore } from "../../store/workflowBuilderStore"
import { ragQueryNodeSchema, type RagQueryNodeValues } from "../schemas/rag.schema"

interface RagQueryNodeFormProps {
  nodeId: string
  config?: any
}

export const RagQueryNodeForm = React.memo(({ nodeId, config }: RagQueryNodeFormProps) => {
  const updateNodeConfig = useWorkflowBuilderStore((state) => state.updateNodeConfig)

  const form = useForm<RagQueryNodeValues>({
    resolver: zodResolver(ragQueryNodeSchema),
    mode: "onChange",
    defaultValues: {
      knowledgeBaseId: config?.knowledgeBaseId || "",
      query: config?.query || "",
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
          name="knowledgeBaseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rag-kb-input">Knowledge Base ID</FormLabel>
              <FormControl>
                <Input
                  id="rag-kb-input"
                  placeholder="e.g. vector_store_id"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rag-query-input">Search Query</FormLabel>
              <FormControl>
                <Textarea
                  id="rag-query-input"
                  placeholder="Search template expression or natural language query..."
                  rows={3}
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

RagQueryNodeForm.displayName = "RagQueryNodeForm"
