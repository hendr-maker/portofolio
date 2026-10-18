import { icons as devicon } from "@iconify-json/devicon-plain";
import { siGithub } from "simple-icons";
import { cn } from "cn";

// Brand marks in their own colors. simple-icons dropped the LinkedIn mark, so it comes from devicon-plain (as the
// Microsoft marks do in lib/skill-icons.ts); a white square fills its knocked-out "in". GitHub's mark is near-black,
// so it follows the theme via currentColor, as GitHub's guidelines allow.
const linkedin = `<rect x="14" y="14" width="100" height="100" fill="#fff"/>${devicon.icons.linkedin?.body ?? ""}`;

export function LinkedInLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 128 128" aria-hidden className={cn("size-5 shrink-0 text-[#0a66c2]", className)} dangerouslySetInnerHTML={{ __html: linkedin }} />;
}

export function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className={cn("size-5 shrink-0", className)}>
      <path d={siGithub.path} />
    </svg>
  );
}
