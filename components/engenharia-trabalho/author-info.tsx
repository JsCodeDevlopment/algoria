import Image from "next/image";
import Link from "next/link";

interface AuthorInfoProps {
  name: string;
  role: string;
  href: string;
  image?: string;
}

export function AuthorInfo({ name, role, href, image }: AuthorInfoProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 pt-1 pb-6 group">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-border bg-muted/30">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 border border-primary group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">
          Autor
        </span>
        <Link
          href={href}
          className="text-base font-black tracking-tighter text-foreground uppercase hover:text-primary transition-colors"
          prefetch={false}
        >
          {name}
        </Link>
        <span className="text-[10px] font-medium text-muted-foreground tracking-tight">
          {role}
        </span>
      </div>
    </div>
  );
}
