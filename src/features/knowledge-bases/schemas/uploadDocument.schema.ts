import { z } from "zod"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".docx", ".md"]

export const uploadDocumentSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 10MB")
    .refine((file) => {
      const name = file.name.toLowerCase()
      return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))
    }, "Only PDF, TXT, DOCX, and MD files are allowed"),
})

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
