import { ExpandableBio } from "@/components/profile/expandable-bio";
import { Badge } from "@/components/ui/badge";
import { Code2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string | null;
  image: string | null;
  headline: string | null;
  bio: string | null;
  experienceString: string;
  memberSince: number;
  githubUrl: string | null;
  linkedinUrl: string | null;
  initials: string;
  followersCount?: number;
  followingCount?: number;
  followButton?: React.ReactNode;
}

export function ProfileHeader({
  name,
  image,
  headline,
  bio,
  experienceString,
  memberSince,
  githubUrl,
  linkedinUrl,
  initials,
  followersCount = 0,
  followingCount = 0,
  followButton,
}: ProfileHeaderProps) {
  return (
    <div className="mb-16 border-2 border-border bg-background/60 backdrop-blur-md p-8 md:p-12 shadow-[12px_12px_0_0_rgba(0,0,0,0.05)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Code2 className="h-40 w-40" />
      </div>

      <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <div className="shrink-0 relative group">
          <div className="absolute -inset-1 bg-primary/20 blur opacity-50 group-hover:opacity-100 transition duration-500" />
          <div className="relative h-40 w-40 border-4 border-primary bg-muted flex items-center justify-center overflow-hidden shadow-[8px_8px_0_0_rgba(var(--primary-rgb),0.1)]">
            {image ? (
              <Image
                src={image}
                alt={name || ""}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-4xl font-black text-primary">
                {initials}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                {name}
              </h1>
              {headline && (
                <p className="text-lg font-bold text-primary/80 uppercase tracking-tight max-w-2xl leading-tight">
                  {headline}
                </p>
              )}
            </div>
            {followButton && (
              <div className="shrink-0 self-start sm:self-center">
                {followButton}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 border-y border-border py-4">
            {experienceString && (
              <Badge
                variant="default"
                className="rounded-none bg-primary text-primary-foreground font-black uppercase tracking-widest text-[9px] px-3 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]"
              >
                {experienceString}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="rounded-none border-primary/30 text-primary font-black uppercase tracking-widest text-[9px] px-3"
            >
              Membro desde {memberSince}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-none border-border text-muted-foreground font-black uppercase tracking-widest text-[9px] px-3 bg-muted/20"
            >
              {followersCount} {followersCount === 1 ? 'Seguidor' : 'Seguidores'}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-none border-border text-muted-foreground font-black uppercase tracking-widest text-[9px] px-3 bg-muted/20"
            >
              {followingCount} Seguindo
            </Badge>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <Code2 className="h-4 w-4" /> GitHub
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>

          {bio && (
            <div className="max-w-3xl">
              <ExpandableBio bio={bio} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
