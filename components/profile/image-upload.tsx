"use client";

import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  initialImage?: string | null;
  name?: string;
}

export function ImageUpload({
  initialImage,
  name = "image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [base64, setBase64] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, seleciona uma imagem válida.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem é demasiado grande. Escolhe uma até 5MB.");
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPreview(dataUrl);
        setBase64(dataUrl);
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 opacity-25 group-hover:opacity-50 transition duration-500 blur rounded-full" />
        <div className="relative h-32 w-32 rounded-full border-4 border-primary bg-background overflow-hidden flex items-center justify-center shadow-xl">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground" />
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
          >
            <Camera className="h-6 w-6" />
            <span className="text-[10px] font-black uppercase mt-1">
              Alterar
            </span>
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <input type="hidden" name={name} value={base64} />

      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        JPEG ou PNG, máx. 5MB (será redimensionada)
      </p>
    </div>
  );
}
