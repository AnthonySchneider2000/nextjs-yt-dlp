"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    // Clear the video src and set loading to true
    setVideoSrc("");
    setLoading(true);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: url }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setVideoSrc(videoUrl);
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error downloading video:", error);
      alert("An error occurred while downloading the video.");
    } finally {
      setLoading(false); // Set loading to false regardless of the outcome
    }
  };

  return (
    <>
      <section className="flex flex-row items-center justify-center gap-4 w-full">
        <div>yt-dlp</div>
        <Input
          className="sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleDownload}>Download</Button>
      </section>
      {loading && (
        <Skeleton className="mt-4 sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4 sm:h-64 md:h-80 lg:h-96 xl:h-112" />
      )}
      {videoSrc && (
        <video controls className="mt-4 sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
}
