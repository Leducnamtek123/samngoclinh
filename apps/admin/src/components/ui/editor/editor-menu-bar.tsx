"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { Check, ImageIcon, LinkIcon, Palette, Type, Unlink } from "lucide-react"

import type { DynamicIconNameType } from "@/types"
import type { ChainedCommands, Editor } from "@tiptap/react"

import { fetchApi } from "@/lib/api"
import { cn } from "@/lib/utils"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputFile } from "@/components/ui/input-file"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { DynamicIcon } from "@/components/dynamic-icon"

interface SizeType {
  label: string
  level: 1 | 2 | 3
  textSize: `text-${string}`
}

const sizes: SizeType[] = [
  { label: "Normal", level: 3, textSize: "text-lg" },
  { label: "Large", level: 2, textSize: "text-xl" },
  { label: "Extra Large", level: 1, textSize: "text-2xl" },
]

function SizeHandler({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Select text style"
        >
          <Type className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="min-w-[8rem] w-auto p-1">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "justify-start px-3 py-2 text-left text-base",
              editor.isActive("paragraph") && "bg-muted"
            )}
          >
            Small
          </Button>
          {sizes.map((size: SizeType) => (
            <Button
              key={size.level}
              variant="ghost"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: size.level })
                  .run()
              }
              className={cn(
                "justify-start px-3 py-2 text-left",
                size.textSize,
                editor.isActive("heading", { level: size.level }) && "bg-muted"
              )}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface FormatType {
  format: string
  iconName: DynamicIconNameType
}

const formats: FormatType[] = [
  {
    format: "bold",
    iconName: "Bold",
  },
  {
    format: "italic",
    iconName: "Italic",
  },
  {
    format: "underline",
    iconName: "Underline",
  },
  {
    format: "strike",
    iconName: "Strikethrough",
  },
]

function FormatHandler({
  editor,
  format,
  iconName,
}: {
  editor: Editor
  format: string
  iconName: DynamicIconNameType
}) {
  const toggleCommands: Record<string, () => ChainedCommands> = {
    bold: () => editor.chain().focus().toggleBold(),
    italic: () => editor.chain().focus().toggleItalic(),
    underline: () => editor.chain().focus().toggleUnderline(),
    strike: () => editor.chain().focus().toggleStrike(),
  }

  function handlePressChange() {
    const command = toggleCommands[format]

    if (command) {
      command().run()
    }
  }

  return (
    <Toggle
      size="sm"
      pressed={editor.isActive(format)}
      onPressedChange={handlePressChange}
      aria-label={`Toggle ${format} format`}
    >
      <DynamicIcon name={iconName} className="h-4 w-4" />
    </Toggle>
  )
}

interface AlignmentType {
  alignment: string
  iconName: DynamicIconNameType
}

const alignments: AlignmentType[] = [
  { alignment: "left", iconName: "AlignLeft" },
  { alignment: "center", iconName: "AlignCenter" },
  { alignment: "right", iconName: "AlignRight" },
  { alignment: "justify", iconName: "AlignJustify" },
]

function AlignmentHandler({
  editor,
  alignment,
  iconName,
}: {
  editor: Editor
  alignment: string
  iconName: DynamicIconNameType
}) {
  return (
    <Toggle
      size="sm"
      pressed={editor.isActive({ textAlign: alignment })}
      onPressedChange={() =>
        editor.chain().focus().setTextAlign(alignment).run()
      }
      aria-label={`Switch ${alignment} alignment`}
    >
      <DynamicIcon name={iconName} className="h-4 w-4" />
    </Toggle>
  )
}

function ImageHandler({ editor }: { editor: Editor }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(files: FileList) {
    if (files.length < 1) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", files[0])

      const res = await fetchApi("/admin/catalog/upload", {
        method: "POST",
        body: fd,
      })

      const payload = await res.json()
      if (res.status < 400 && payload.data?.url) {
        editor.chain().focus().setImage({ src: payload.data.url }).run()
        setIsOpen(false)
      } else {
        toast.error(payload?.message || t("messages.errorOccurred"))
      }
    } catch (err) {
      console.error(err)
      toast.error(t("messages.networkError"))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {t("common.actions.import", "Upload Image")}
          </p>
          <div className="flex items-center gap-2">
            <InputFile onValueChange={handleFileChange} disabled={uploading} />
          </div>
          {uploading && (
            <p className="text-[10px] text-emerald-600 animate-pulse font-medium">
              {t("common.status.pending")}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function LinkHandler({ editor }: { editor: Editor }) {
  const { t } = useTranslation()
  const isLinkActive = editor.isActive("link")
  const [isOpen, setIsOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const handleInsert = () => {
    if (!linkUrl) return
    editor.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl("")
    setIsOpen(false)
  }

  return isLinkActive ? (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => editor.chain().focus().unsetLink().run()}
      aria-label="Remove link"
    >
      <Unlink className="h-4 w-4" />
    </Button>
  ) : (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          setLinkUrl(editor.getAttributes("link").href || "")
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Insert link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 w-80 p-3">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {t("common.actions.add", "Insert Link")}
        </p>
        <div className="flex gap-2">
          <Input
            autoFocus
            type="text"
            placeholder="https://www.example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInsert()
              }
            }}
            className="h-8 text-xs"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={handleInsert}
            aria-label="Submit"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColorHandler({ editor }: { editor: Editor }) {
  const selectedColor = editor.getAttributes("textStyle").color
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative overflow-hidden"
      onClick={() => inputRef.current?.click()}
      aria-label="Select text color"
    >
      <Palette style={{ color: selectedColor }} className="size-4" />
      <Input
        ref={inputRef}
        type="color"
        value={selectedColor}
        onChange={(e) =>
          editor
            .chain()
            .focus()
            .setColor(e.target.value as string)
            .run()
        }
        className="sr-only"
        tabIndex={-1}
      />
    </Button>
  )
}

export function EditorMenuBar({ editor }: { editor: Editor }) {
  return (
    <div
      className="flex flex-wrap items-center gap-1.5 p-1.5"
      aria-label="Editor Menu Bar"
    >
      <SizeHandler editor={editor} />
      <ColorHandler editor={editor} />

      <Separator orientation="vertical" className="h-4" />

      {formats.map(({ format, iconName }) => (
        <FormatHandler
          key={format}
          editor={editor}
          format={format}
          iconName={iconName}
        />
      ))}

      <Separator orientation="vertical" className="h-4" />

      {alignments.map(({ alignment, iconName }) => (
        <AlignmentHandler
          key={alignment}
          editor={editor}
          alignment={alignment}
          iconName={iconName}
        />
      ))}

      <Separator orientation="vertical" className="h-4" />

      <ImageHandler editor={editor} />
      <LinkHandler editor={editor} />
    </div>
  )
}
