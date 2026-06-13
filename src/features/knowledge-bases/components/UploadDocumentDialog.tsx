import React, { useState, useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUploadDocument } from "../hooks/useUploadDocument"
import { uploadDocumentSchema } from "../schemas/uploadDocument.schema"

interface UploadDocumentDialogProps {
  kbId: string
}

export const UploadDocumentDialog = React.memo(({ kbId }: UploadDocumentDialogProps) => {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: uploadDoc, isPending } = useUploadDocument()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setValidationError(null)
    const result = uploadDocumentSchema.safeParse({ file: selectedFile })
    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "Invalid file"
      setValidationError(errorMsg)
      setFile(null)
      return false
    }
    setFile(selectedFile)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleUploadSubmit = async () => {
    if (!file) return
    try {
      setProgress(0)
      await uploadDoc({
        kbId,
        file,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(pct)
          }
        },
      })
      toast.success("Document uploaded successfully")
      handleReset()
      setOpen(false)
    } catch {
      toast.error("Failed to upload document")
    }
  }

  const handleReset = () => {
    setFile(null)
    setProgress(0)
    setValidationError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["Bytes", "KB", "MB"][i]
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) handleReset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg shadow-sm">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Drag & drop upload target */}
          {!file && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,.docx,.md"
                onChange={handleFileChange}
              />
              <div className="p-3 bg-muted rounded-full text-muted-foreground mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Drag & drop document here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse from files
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-3 font-medium">
                Supports PDF, TXT, DOCX, MD (Max 10MB)
              </p>
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs font-semibold rounded-lg text-center select-none">
              {validationError}
            </div>
          )}

          {/* File Selected Preview */}
          {file && (
            <div className="border border-border rounded-xl p-4 flex flex-col gap-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold text-foreground truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground font-semibold">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                {!isPending && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleReset}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Progress bar during uploads */}
              {isPending && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit triggers */}
              {!isPending && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={handleUploadSubmit}>
                    Start Processing
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})

UploadDocumentDialog.displayName = "UploadDocumentDialog"
