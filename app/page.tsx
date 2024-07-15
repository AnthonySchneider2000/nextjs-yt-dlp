import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex flex-row gap-4 items-center justify-center">
      <div>yt-dlp</div>
      <Input className="sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4" placeholder="Enter URL" />
      <Button>Download</Button>
    </section>
  );
}
