import { useEffect, useState } from "react";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryVideo } from "../types";
import { Loader, Video, Mic, ChevronLeft, ChevronRight } from "lucide-react";
import { auth } from "../../../lib/firebase";
import { getIdToken } from "firebase/auth";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../auth/context/useAuth";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

type TabType = "ugc" | "lipsync" | "minmax";

export function GalleryPage() {
  const [ugcVideos, setUgcVideos] = useState<GalleryVideo[]>([]);
  const [lipSyncVideos, setLipSyncVideos] = useState<GalleryVideo[]>([]);
  const [minMaxVideos, setMinMaxVideos] = useState<GalleryVideo[]>([]);
  const [isLoadingUgc, setIsLoadingUgc] = useState(true);
  const [isLoadingLipSync, setIsLoadingLipSync] = useState(true);
  const [isLoadingMinMax, setIsLoadingMinMax] = useState(true);
  const [error, setError] = useState("");
  const { user, userData } = useAuth();
  const [currentUGCPage, setCurrentUGCPage] = useState(1);
  const [totalUGCVideos, setTotalUGCVideos] = useState(null);
  const [currentLipSyncPage, setCurrentLipSyncPage] = useState(1);
  const [currentMinMaxPage, setCurrentMinMaxPage] = useState(1);
  const [totalLipsncVideos, setTotalLipsyncVideos] = useState(null);
  const [totalMinMaxVideos, setTotalMinMaxVideos] = useState(null);
  const [totalUGCPage, setTotalUGCPage] = useState(1);
  const [totalLipSyncPage, setTotalLipSyncPage] = useState(1);
  const [totalMinMaxPage, setTotalMinMaxPage] = useState(1);
  const { language } = useLanguage();
  // const [userData, setUserData] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("ugc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 items per page

  // Fetch UGC videos
  useEffect(() => {
    const fetchUgcVideos = async () => {
      if (!user || !userData) return;

      setIsLoadingUgc(true);
      setError("");

      try {
        const token = auth.currentUser
          ? await getIdToken(auth.currentUser)
          : null;
        if (!token) {
          setError(getTranslation(language, "galleryError.credentialError"));
          return;
        }

        const url = new URL(
          `/api/fal/v1/gallery`,
          import.meta.env.VITE_END_POINT_URL
        );

        const response = await fetch(url.toString(), {
          method: "POST",
          body: JSON.stringify({
            page: currentUGCPage,
            limit: 10,
            userId: userData._id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await response.json();

        if (data.generations.length > 0) {
          setTotalUGCPage(data.pagination.pages);
          setTotalUGCVideos(data.pagination.total);
          const videoData = data.generations.map((video: any) => ({
            id: video._id,
            seed: video.parameters.seed,
            promode: video.parameters.pro_mode,
            aspectRatio: video.parameters.aspect_ratio,
            resolution: video.parameters.resolution,
            prompt: video.prompt,
            thumbnailUrl: video.thumbnail_url,
            videoUrl: video.outputUrl,
            status: video.status,
            createdAt: video.createdAt,
            error: video.error,
            type: "ugc",
          }));
          setUgcVideos(videoData);
        }
      } catch (error) {
        console.error("Failed to fetch UGC videos:", error);
        setError(getTranslation(language, "galleryError.failed_fetch"));
      } finally {
        setIsLoadingUgc(false);
      }
    };

    fetchUgcVideos();
  }, [userData, user, currentUGCPage]);

  // Fetch Lip Sync videos
  useEffect(() => {
    const fetchLipSyncVideos = async () => {
      if (!user || !userData) return;

      setIsLoadingLipSync(true);
      setError("");

      try {
        const token = auth.currentUser
          ? await getIdToken(auth.currentUser)
          : null;
        if (!token) {
          setError(getTranslation(language, "galleryError.credentialError"));
          return;
        }

        const url = new URL(
          `/api/fal/v1/lipsyncGallery`, // Update this endpoint when available
          import.meta.env.VITE_END_POINT_URL
        );

        const response = await fetch(url.toString(), {
          method: "POST",
          body: JSON.stringify({
            page: currentLipSyncPage,
            limit: 10,
            userId: userData._id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await response.json();

        // const videos = await response.json();
        if (data.generations.length > 0) {
          setTotalLipSyncPage(data.pagination.pages);
          setTotalLipsyncVideos(data.pagination.total);

          const videoData = data.generations.map((video: any) => ({
            id: video._id,
            seed: 0, // Lip sync videos might not have these parameters
            promode: false,
            aspectRatio: video.aspectRatio || "16:9",
            resolution: video.resolution || "720p",
            prompt: video.description || "",
            thumbnailUrl: video.thumbnail_url,
            videoUrl: video.outputUrl,
            status: video.status,
            createdAt: video.createdAt,
            error: video.error,
            type: "lipsync",
          }));
          setLipSyncVideos(videoData);
        }
      } catch (error) {
        console.error("Failed to fetch lip sync videos:", error);
        // Don't set error state for lip sync failures to allow UGC videos to still show
      } finally {
        setIsLoadingLipSync(false);
      }
    };

    fetchLipSyncVideos();
  }, [userData, user, currentLipSyncPage]);

  useEffect(() => {
    const fetchMinMaxVideos = async () => {
      if (!user || !userData) return;

      setIsLoadingMinMax(true);
      setError("");

      try {
        const token = auth.currentUser
          ? await getIdToken(auth.currentUser)
          : null;
        if (!token) {
          setError(getTranslation(language, "galleryError.credentialError"));
          return;
        }

        const url = new URL(
          `/api/fal/v1/getMinMaxGallery`, // Update this endpoint when available
          import.meta.env.VITE_END_POINT_URL
        );

        const response = await fetch(url.toString(), {
          method: "POST",
          body: JSON.stringify({
            page: currentMinMaxPage,
            limit: 16,
            userId: userData._id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await response.json();

        // const videos = await response.json();
        if (data.generations.length > 0) {
          setTotalMinMaxPage(data.pagination.pages);
          setTotalMinMaxVideos(data.pagination.total);

          const videoData = data.generations.map((video: any) => ({
            id: video._id,
            seed: 0, // Lip sync videos might not have these parameters
            promode: false,
            aspectRatio: video.aspectRatio || "16:9",
            resolution: video.resolution || "720p",
            prompt: video.description || "",
            thumbnailUrl: video.thumbnail_url,
            videoUrl: video.outputUrl,
            status: video.status,
            createdAt: video.createdAt,
            error: video.error,
            type: "lipsync",
          }));
          setMinMaxVideos(videoData);
        }
      } catch (error) {
        console.error("Failed to fetch lip sync videos:", error);
        // Don't set error state for lip sync failures to allow UGC videos to still show
      } finally {
        setIsLoadingMinMax(false);
      }
    };

    fetchMinMaxVideos();
  }, [userData, user, currentMinMaxPage]);

  const currentVideos =
    activeTab === "ugc"
      ? ugcVideos
      : activeTab === "lipsync"
      ? lipSyncVideos
      : minMaxVideos;
  const isLoading =
    activeTab === "ugc"
      ? isLoadingUgc
      : activeTab === "lipsync"
      ? isLoadingLipSync
      : isLoadingMinMax;

  // Pagination calculations
  // const totalPages = Math.ceil(currentVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageVideos = currentVideos.slice(startIndex, endIndex);

  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const renderContent = () => {
    if (!user) {
      return (
        <div className="col-span-full text-center py-12 space-y-3">
          <p className="text-2xl text-black/70">
            {" "}
            {getTranslation(language, "gallery.please_signin")}
          </p>
          <p className="text-black/50">
            {getTranslation(language, "gallery.appear_here")}
          </p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader className="animate-spin text-black/50" size={48} />
        </div>
      );
    }

    if (error && activeTab === "ugc") {
      return <div className="text-center text-red-500">{error}</div>;
    }

    if (currentVideos.length === 0) {
      return (
        <Card className="p-12 text-center">
          <div className="max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto">
              {activeTab === "ugc" || activeTab === "minmax" ? (
                <Video className="w-6 h-6 text-black/40" />
              ) : (
                <Mic className="w-6 h-6 text-black/40" />
              )}
            </div>
            <h3 className="text-sm sm:text-lg font-medium text-black/70">
              {getTranslation(language, "gallery.no")}{" "}
              {activeTab === "ugc"
                ? "UGC"
                : activeTab === getTranslation(language, "gallery.lipsync")
                ? "Lip Sync"
                : getTranslation(language, "gallery.consistent_actor")}{" "}
              {getTranslation(language, "gallery.video_yet")}
            </h3>
            <p className="text-xs sm:text-sm text-black/50">
              {activeTab === "ugc"
                ? getTranslation(language, "gallery.no_ugc_desc")
                : activeTab === "lipsync"
                ? getTranslation(language, "gallery.no_lipsync_desc")
                : getTranslation(language, "gallery.no_consistent_desc")}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                if (activeTab === "minmax") {
                  window.location.href = "consistent-avatar";
                } else {
                  window.location.href = "home";
                }
              }}
              className="mt-4 text-xs sm:text-sm"
            >
              {activeTab === "ugc" ? (
                <>
                  <Video className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                  {getTranslation(language, "gallery.create_ugc")}
                </>
              ) : activeTab === "lipsync" ? (
                <>
                  <Mic className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                  {getTranslation(language, "gallery.add_lipsync")}
                </>
              ) : (
                <>
                  <Video className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                  {getTranslation(language, "gallery.add_consistance")}
                </>
              )}
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-8">
        <GalleryGrid videos={currentPageVideos} activeTab={activeTab} />
        {activeTab === "ugc" ? (
          <>
            {" "}
            {/* Pagination Controls */}
            {totalUGCPage > 1 && (
              <div className="flex justify-center items-center gap-0 sm:gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentUGCPage(currentUGCPage - 1)}
                  disabled={currentUGCPage === 1}
                  className="p-2"
                >
                  <ChevronLeft className="sm:w-4 sm:h-4 h-3 w-3" />
                </Button>

                <div className="flex items-center sm:gap-2">
                  {(() => {
                    const visiblePages = [];

                    // Always show first page
                    // if (currentPage > 2) {
                    //   visiblePages.push(
                    //     <Button
                    //       key={1}
                    //       variant="ghost"
                    //       onClick={() => handlePageChange(1)}
                    //       className="w-8 h-8 p-0"
                    //     >
                    //       1
                    //     </Button>
                    //   );
                    //   if (currentPage > 3) {
                    //     visiblePages.push(
                    //       <span key="start-ellipsis" className="px-1">
                    //         ...
                    //       </span>
                    //     );
                    //   }
                    // }

                    // Show current page and adjacent pages
                    for (
                      let i = Math.max(1, currentUGCPage - 1);
                      i <= Math.min(totalUGCPage, currentUGCPage + 1);
                      i++
                    ) {
                      visiblePages.push(
                        <Button
                          key={i}
                          variant={currentUGCPage === i ? "primary" : "ghost"}
                          onClick={() => setCurrentUGCPage(i)}
                          className="sm:w-8 w-3 sm:h-8 h-5 p-0 text-xs sm:text-sm"
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Always show last page
                    if (currentUGCPage < totalUGCPage - 1) {
                      if (currentUGCPage < totalUGCPage - 2) {
                        visiblePages.push(
                          <span key="end-ellipsis" className="px-1">
                            ...
                          </span>
                        );
                      }
                      visiblePages.push(
                        <Button
                          key={totalUGCPage}
                          variant="ghost"
                          onClick={() => setCurrentUGCPage(totalUGCPage)}
                          className="sm:w-8 w-3 sm:h-8 h-5 p-0 text-xs sm:text-sm"
                        >
                          {totalUGCPage}
                        </Button>
                      );
                    }

                    return visiblePages;
                  })()}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setCurrentUGCPage(currentUGCPage + 1)}
                  disabled={currentUGCPage === totalUGCPage}
                  className="p-2"
                >
                  <ChevronRight className="sm:w-4 sm:h-4 h-3 w-3" />
                </Button>
              </div>
            )}
          </>
        ) : activeTab === "lipsync" ? (
          <>
            {" "}
            {/* Pagination Controls */}
            {totalLipSyncPage > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentLipSyncPage(currentLipSyncPage - 1)}
                  disabled={currentLipSyncPage === 1}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {(() => {
                    const visiblePages = [];

                    // Always show first page
                    // if (currentPage > 2) {
                    //   visiblePages.push(
                    //     <Button
                    //       key={1}
                    //       variant="ghost"
                    //       onClick={() => handlePageChange(1)}
                    //       className="w-8 h-8 p-0"
                    //     >
                    //       1
                    //     </Button>
                    //   );
                    //   if (currentPage > 3) {
                    //     visiblePages.push(
                    //       <span key="start-ellipsis" className="px-1">
                    //         ...
                    //       </span>
                    //     );
                    //   }
                    // }

                    // Show current page and adjacent pages
                    for (
                      let i = Math.max(1, currentLipSyncPage - 1);
                      i <= Math.min(totalLipSyncPage, currentLipSyncPage + 1);
                      i++
                    ) {
                      visiblePages.push(
                        <Button
                          key={i}
                          variant={
                            currentLipSyncPage === i ? "primary" : "ghost"
                          }
                          onClick={() => setCurrentLipSyncPage(i)}
                          className="w-8 h-8 p-0"
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Always show last page
                    if (currentLipSyncPage < totalLipSyncPage - 1) {
                      if (currentLipSyncPage < totalLipSyncPage - 2) {
                        visiblePages.push(
                          <span key="end-ellipsis" className="px-1">
                            ...
                          </span>
                        );
                      }
                      visiblePages.push(
                        <Button
                          key={totalLipSyncPage}
                          variant="ghost"
                          onClick={() =>
                            setCurrentLipSyncPage(totalLipSyncPage)
                          }
                          className="w-8 h-8 p-0"
                        >
                          {totalLipSyncPage}
                        </Button>
                      );
                    }

                    return visiblePages;
                  })()}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setCurrentLipSyncPage(currentLipSyncPage + 1)}
                  disabled={currentLipSyncPage === totalLipSyncPage}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {" "}
            {/* Pagination Controls */}
            {totalMinMaxPage > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentMinMaxPage(currentMinMaxPage - 1)}
                  disabled={currentMinMaxPage === 1}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {(() => {
                    const visiblePages = [];

                    // Always show first page
                    // if (currentPage > 2) {
                    //   visiblePages.push(
                    //     <Button
                    //       key={1}
                    //       variant="ghost"
                    //       onClick={() => handlePageChange(1)}
                    //       className="w-8 h-8 p-0"
                    //     >
                    //       1
                    //     </Button>
                    //   );
                    //   if (currentPage > 3) {
                    //     visiblePages.push(
                    //       <span key="start-ellipsis" className="px-1">
                    //         ...
                    //       </span>
                    //     );
                    //   }
                    // }

                    // Show current page and adjacent pages
                    for (
                      let i = Math.max(1, currentMinMaxPage - 1);
                      i <= Math.min(totalMinMaxPage, currentMinMaxPage + 1);
                      i++
                    ) {
                      visiblePages.push(
                        <Button
                          key={i}
                          variant={
                            currentMinMaxPage === i ? "primary" : "ghost"
                          }
                          onClick={() => setCurrentMinMaxPage(i)}
                          className="w-8 h-8 p-0"
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Always show last page
                    if (currentMinMaxPage < totalMinMaxPage - 1) {
                      if (currentMinMaxPage < totalMinMaxPage - 2) {
                        visiblePages.push(
                          <span key="end-ellipsis" className="px-1">
                            ...
                          </span>
                        );
                      }
                      visiblePages.push(
                        <Button
                          key={totalMinMaxPage}
                          variant="ghost"
                          onClick={() => setCurrentMinMaxPage(totalMinMaxPage)}
                          className="w-8 h-8 p-0"
                        >
                          {totalMinMaxPage}
                        </Button>
                      );
                    }

                    return visiblePages;
                  })()}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setCurrentMinMaxPage(currentMinMaxPage + 1)}
                  disabled={currentMinMaxPage === totalMinMaxPage}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-black/5">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-xl sm:text-3xl  md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent">
              {getTranslation(language, "gallery.hero_title")}
            </h1>
            <p className="text-base lg:text-xl text-black/60 max-w-2xl mx-auto">
              {getTranslation(language, "gallery.hero_desc")}
            </p>
          </div>

          <div className="flex sm:flex-row flex-col justify-center gap-2">
            <button
              type="button" // Ensures button does not submit a form
              className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
                activeTab === "ugc"
                  ? "bg-black text-white hover:bg-black/90"
                  : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
              onClick={() => setActiveTab("ugc")}
              // aria-pressed={selectedCategory === category.value} // Accessibility improvement
            >
              {" "}
              <Video className="w-4 h-4 mr-2" />
              {getTranslation(language, "gallery.ugc_video")}{" "}
              {totalUGCVideos && `(${totalUGCVideos})`}
            </button>
            <button
              type="button" // Ensures button does not submit a form
              className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
                activeTab === "lipsync"
                  ? "bg-black text-white hover:bg-black/90"
                  : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
              onClick={() => setActiveTab("lipsync")}
              // aria-pressed={selectedCategory === category.value} // Accessibility improvement
            >
              <Mic className="w-4 h-4 mr-2" />
              {getTranslation(language, "gallery.lip_sync")}{" "}
              {totalLipsncVideos && `(${totalLipsncVideos})`}
            </button>
            <button
              type="button" // Ensures button does not submit a form
              className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
                activeTab === "minmax"
                  ? "bg-black text-white hover:bg-black/90"
                  : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
              onClick={() => setActiveTab("minmax")}
              // aria-pressed={selectedCategory === category.value} // Accessibility improvement
            >
              <Video className="w-4 h-4 mr-2" />
              {getTranslation(language, "gallery.consistent_avatart")}{" "}
              {totalMinMaxVideos && `(${totalMinMaxVideos})`}
            </button>
          </div>
        </div>{" "}
        {renderContent()}
      </div>
    </div>
  );
}
