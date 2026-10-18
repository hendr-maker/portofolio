import { skillSprite } from "@/lib/skill-icons";

export const dynamic = "force-static";

export function GET() {
  return new Response(skillSprite(), { headers: { "Content-Type": "image/svg+xml" } });
}
