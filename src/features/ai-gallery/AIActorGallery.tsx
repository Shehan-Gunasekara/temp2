import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mic,
  Star,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  Loader,
  Video,
  Lock,
  Clock,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../features/auth/context/useAuth";
import { getIdToken } from "firebase/auth";
import { auth } from "../../lib/firebase";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { TbArrowBigDown } from "react-icons/tb";
import { TbArrowBigDownFilled } from "react-icons/tb";
import { TbArrowBigUp } from "react-icons/tb";
import { TbArrowBigUpFilled } from "react-icons/tb";
import { TbFileSad } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import {
  HiOutlineDotsCircleHorizontal,
  HiOutlineDotsHorizontal,
} from "react-icons/hi";
import { CiTimer } from "react-icons/ci";
import { GetUser } from "../../lib/api/user";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";

interface Category {
  name: string;
  value: string;
}

interface Gender {
  name: string;
  value: string;
}

// Extended actor data with reviews
interface Review {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  hasLiked?: boolean;
}

interface Actor {
  id: number;
  name: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  gender: "male" | "female";
  rating: number;
  reviews: Review[];
  age: string;
  style: string;
  totalReviews: number;
}

export function AIActorGallery() {
  const { language } = useLanguage();
  const categories: Category[] = [
    {
      name: getTranslation(language, "aiGallerySection.categories.0"),
      value: "all",
    },
    {
      name: getTranslation(language, "aiGallerySection.categories.1"),
      value: "business",
    },
    {
      name: getTranslation(language, "aiGallerySection.categories.2"),
      value: "lifestyle",
    },
    {
      name: getTranslation(language, "aiGallerySection.categories.3"),
      value: "professional",
    },
  ];
  const genders = [
    {
      name: getTranslation(language, "aiGallerySection.genders.0"),
      value: "all",
    },
    {
      name: getTranslation(language, "aiGallerySection.genders.1"),
      value: "male",
    },
    {
      name: getTranslation(language, "aiGallerySection.genders.2"),
      value: "female",
    },
  ];
  const { user, userData, setUserCredits, userCredits } = useAuth();
  const [selectedActor, setSelectedActor] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    name: "all",
    value: "all",
  });
  const [selectedGender, setSelectedGender] = useState<Gender>({
    name: "all",
    value: "all",
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "reviews">("preview");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [actors, setActors] = useState<any[]>([]);
  const [hasmore, setHasMore] = useState(true);
  const [totalActors, setTotalActors] = useState(0);
  const [isLoadingReviews, setisLoadingReviews] = useState(true);
  const pageRef = useRef(1);
  const reviewPageRef = useRef(1);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasMoreReview, setHasMoreReview] = useState(false);
  const [isLoadingActors, setIsLoadingActors] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  const videoRefs = useRef<any>({}); // Store individual refs for each video
  const [isPlaying, setIsPlaying] = useState({});

  // --- New state for actor type selection ---
  const [actorType, setActorType] = useState<"basic" | "pro">("basic");

  // --- State for Pro Actors ---
  const [proActors, setProActors] = useState<any[]>([]);
  const [hasMorePro, setHasMorePro] = useState(true);
  const [isLoadingProActors, setIsLoadingProActors] = useState(true);
  const [isLockedProActors, setIsLockedProActors] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const proPageRef = useRef(1);
  // --- State to track which pro actors have been unlocked, with expiration timestamp ---
  const [unlockedProActors, setUnlockedProActors] = useState<
    Record<string, { expiresAt: number }>
  >({});

  const [notEngoughCredits, setNotEngoughCredits] = useState(false);
  const [displayingTime, setDisplayingTime] = useState("");
  /////////////////////////////////////////////////////////
  const [isHadnlePurchaseOpen, setIsHadnlePurchaseOpen] = useState(false);
  const remainingInterval = useRef<any>(null);

  useEffect(() => {
    if (isLockedProActors == false) {
      setDisplayingTime(formatTimeDuration(remainingTime));
      let rTime = remainingTime;
      remainingInterval.current = setInterval(() => {
        if (isLockedProActors == false) {
          rTime = rTime - 60;
          if (rTime > 0) {
            setDisplayingTime(formatTimeDuration(rTime));
          } else {
            setIsLockedProActors(true);
            clearInterval(remainingInterval.current);
            return;
          }
        } else {
          clearInterval(remainingInterval.current);
        }
      }, 60000);
    }
    return () => {
      clearInterval(remainingInterval.current);
    };
  }, [isLockedProActors]);

  const formatTimeDuration = (seconds) => {
    if (seconds <= 0) return "00hr 00min";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursStr = hours > 0 ? `${String(hours).padStart(2, "0")}hr` : "00hr";
    const minutesStr =
      minutes > 0 ? `${String(minutes).padStart(2, "0")}min` : "00min";

    return `${hoursStr} ${minutesStr}`;
  };

  const handlePurchase = async () => {
    if (!user && !userData) {
      window.location.href = "/auth";
    }
    try {
      if (userCredits < 5) {
        setNotEngoughCredits(true);
        return;
      }
      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;
      const response = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/pro-ai-actors/pruchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            userId: userData._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchSelectedProActor();
        if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
          setUserCredits(userCredits - 15);
        } else {
          setUserCredits(userCredits - 3);
        }

        setIsHadnlePurchaseOpen(false);
        // setSelectedActor(actor);
        // setIsPreviewOpen(true);
      } else {
        console.error(data.error);
        setIsHadnlePurchaseOpen(false);
      }
    } catch (error) {
      setIsHadnlePurchaseOpen(false);
    }
  };

  const handleUnlockPro = () => {
    setIsHadnlePurchaseOpen(true);
    // setSelectedActor(actor);
  };

  // State for current time to update countdown timers
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Auto relock pro actors when their unlock period expires

  // Helper function to format remaining time in HH:MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseEnter = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].play();
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleMouseLeave = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      videoRefs.current[id].currentTime = 0;
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    }
  };

  const videoRef = useRef(null);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying2) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying2(!isPlaying2);
    }
  };
  const fetchReviews = async () => {
    try {
      reviewPageRef.current = 1;
      setisLoadingReviews(true);

      const response = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/ai-review/${
          selectedActor._id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        reviewPageRef.current = reviewPageRef.current + 1;
        setReviews(data.reviews);
        setTotalReviews(data.totalReviews);
        setHasMoreReview(data.hasMore);
        setisLoadingReviews(false);
      } else {
        console.error(data.error);
        setisLoadingReviews(false);
      }
    } catch (error) {
      setisLoadingReviews(false);
    } finally {
    }
  };

  const handleProVote = async (
    currentType: string,
    voteType: string,
    actorId: string
  ) => {
    if (!user && !userData) {
      window.location.href = "/auth";
    }
    if (currentType == voteType) return;

    try {
      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;
      const response = await fetch(
        `${
          import.meta.env.VITE_END_POINT_URL
        }/api/pro-ai-actors/${actorId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            userId: userData._id,
            type: voteType,
          }),
        }
      );
      if (response.ok) {
        // if (selectedActor != null) {
        if (selectedActor != null) {
          if (voteType == "upvote") {
            if (selectedActor.userVote == "downvote") {
              selectedActor.voteSummary += 2;
            } else {
              selectedActor.voteSummary += 1;
            }
          } else {
            if (selectedActor.userVote == "upvote") {
              selectedActor.voteSummary -= 2;
            } else {
              selectedActor.voteSummary -= 1;
            }
          }

          selectedActor.userVote = voteType;
        }
        setActors((prev) => [...prev, ...[]]);

        // }
      } else {
      }
    } catch (error) {}
  };

  const handleVote = async (
    currentType: string,
    voteType: string,
    actorId: string
  ) => {
    if (!user && !userData) {
      window.location.href = "/auth";
    }
    if (currentType == voteType) return;

    try {
      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;
      const response = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/ai-actors/${actorId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            userId: userData._id,
            type: voteType,
          }),
        }
      );
      if (response.ok) {
        // if (selectedActor != null) {
        if (selectedActor != null) {
          if (voteType == "upvote") {
            if (selectedActor.userVote == "downvote") {
              selectedActor.voteSummary += 2;
            } else {
              selectedActor.voteSummary += 1;
            }
          } else {
            if (selectedActor.userVote == "upvote") {
              selectedActor.voteSummary -= 2;
            } else {
              selectedActor.voteSummary -= 1;
            }
          }

          selectedActor.userVote = voteType;
        }
        setActors((prev) => [...prev, ...[]]);

        // }
      } else {
      }
    } catch (error) {}
  };

  const submitReview = async (e) => {
    e.preventDefault();

    // if (!comment.trim()) {
    //   setMessage("Comment cannot be empty.");
    //   return;
    // }

    try {
      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;
      const response = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/ai-review/${
          selectedActor._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            userId: userData._id,
            userName: user?.displayName || "",
            comment: newReview,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // setMessage("Review added successfully!");
        await fetchReviews();
        setNewReview(""); // Clear the comment input
        setShowReviewForm(false);
      } else {
        // setMessage(data.error || "Failed to add review.");
        setShowReviewForm(false);
      }
    } catch (error) {
      // setMessage("An error occurred while adding the review.");
    }
  };
  useEffect(() => {
    if (isPreviewOpen == false) {
      setReviews([]);
    }
  }, [isPreviewOpen]);
  // Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000); // Adjust the debounce time as needed

    return () => clearTimeout(handler); // Cleanup function to prevent multiple triggers
  }, [searchQuery]);

  useEffect(() => {
    if (isPreviewOpen == false) {
      setReviews([]);
    } else {
      if (selectedActor != null) {
        fetchReviews();
      }
    }
  }, [selectedActor]);

  // const fetchActors = async (limit = 5) => {
  //   try {
  //     if (pageRef.current == 1) {
  //       pageRef.current = 2;
  //     }
  //     const url = new URL(
  //       `${import.meta.env.VITE_END_POINT_URL}/api/ai-actors`
  //     );
  //     url.searchParams.append("query", searchQuery);
  //     url.searchParams.append("category", selectedCategory.value);
  //     url.searchParams.append("gender", selectedGender.value);
  //     url.searchParams.append("page", pageRef.current);
  //     url.searchParams.append("limit", 20);
  //     url.searchParams.append("userId", userData?._id || null);
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     // setPage(page + 1);

  //     const data = await response.json();
  //     setActors((prev) => [...prev, ...data.actorsWithUserVote]);
  //     pageRef.current = pageRef.current + 1;
  //     // setActors(data.actorsWithUserVote);
  //     setHasMore(data.hasMore);
  //     setTotalActors(data.totalActors);
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   const initfetchActors = async (limit = 5) => {
  //     setIsLoadingActors(true);
  //     try {
  //       const url = new URL(
  //         `${import.meta.env.VITE_END_POINT_URL}/api/ai-actors`
  //       );
  //       url.searchParams.append("query", debouncedQuery);
  //       url.searchParams.append("category", selectedCategory.value);
  //       url.searchParams.append("gender", selectedGender.value);
  //       url.searchParams.append("page", 1);
  //       url.searchParams.append("limit", 20);
  //       url.searchParams.append("userId", userData?._id || null);

  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       // setPage(page + 1);

  //       const data = await response.json();
  //       setActors(data.actorsWithUserVote);
  //       pageRef.current = 2;
  //       // setActors(data.actorsWithUserVote);
  //       setHasMore(data.hasMore);
  //       setTotalActors(data.totalActors);
  //       setIsLoadingActors(false);
  //     } catch (error) {
  //       setIsLoadingActors(false);
  //     }
  //   };

  //   // if (userData) {
  //   initfetchActors();
  //   // }
  // }, [userData, debouncedQuery, selectedCategory, selectedGender]);

  // newwwww

  const fetchActors = async (limit = 5) => {
    try {
      if (pageRef.current === 1) {
        pageRef.current = 2;
      }

      const url = new URL(
        `${import.meta.env.VITE_END_POINT_URL}/api/ai-actors`
      );
      url.searchParams.append("query", searchQuery);
      url.searchParams.append("category", selectedCategory.value);
      url.searchParams.append("gender", selectedGender.value);
      url.searchParams.append("page", pageRef.current);
      url.searchParams.append("limit", 20);
      url.searchParams.append("userId", userData?._id || null);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Modify the actor data based on selected language
      const modifiedActors = data.actorsWithUserVote.map((actor: any) => {
        const actorName =
          language === "de" ? actor.actor_name_de : actor.actor_name;
        const title = language === "de" ? actor.title_de : actor.title;
        const description =
          language === "de" ? actor.description_de : actor.description;
        const category = language === "de" ? actor.category_de : actor.category;
        const style = language === "de" ? actor.style_de : actor.style;

        return {
          ...actor,
          actor_name: actorName,
          title: title, // Update title if necessary
          description: description,
          category: category, // Update category if necessary
          style: style, // Update style if necessary
        };
      });

      setActors((prev) => [...prev, ...modifiedActors]);
      pageRef.current = pageRef.current + 1;
      setHasMore(data.hasMore);
      setTotalActors(data.totalActors);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  useEffect(() => {
    const initfetchActors = async (limit = 5) => {
      setIsLoadingActors(true);

      try {
        const url = new URL(
          `${import.meta.env.VITE_END_POINT_URL}/api/ai-actors`
        );
        url.searchParams.append("query", debouncedQuery);
        url.searchParams.append("category", selectedCategory.value);
        url.searchParams.append("gender", selectedGender.value);
        url.searchParams.append("page", 1);
        url.searchParams.append("limit", 20);
        url.searchParams.append("userId", userData?._id || null);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        // Modify the actor data based on selected language
        const modifiedActors = data.actorsWithUserVote.map((actor: any) => {
          const actorName =
            language === "de" ? actor.actor_name_de : actor.actor_name;
          const title = language === "de" ? actor.title_de : actor.title;
          const description =
            language === "de" ? actor.description_de : actor.description;
          const category =
            language === "de" ? actor.category_de : actor.category;
          const style = language === "de" ? actor.style_de : actor.style;

          return {
            ...actor,
            actor_name: actorName,
            title: title, // Update title if necessary
            description: description,
            category: category, // Update category if necessary
            style: style, // Update style if necessary
          };
        });

        setActors(modifiedActors);
        pageRef.current = 2;
        setHasMore(data.hasMore);
        setTotalActors(data.totalActors);
        setIsLoadingActors(false);
      } catch (error) {
        setIsLoadingActors(false);
        console.error("Error fetching actors:", error);
      }
    };

    initfetchActors();
  }, [userData, debouncedQuery, selectedCategory, selectedGender, language]);

  //end

  const fetchSelectedProActor = async (limit = 5) => {
    try {
      // if (proPageRef.current === 1) {
      //   proPageRef.current = 2;
      // }

      const limit = (proPageRef.current - 1) * 20;
      const url = new URL(
        `${import.meta.env.VITE_END_POINT_URL}/api/pro-ai-actors` // Replace with the correct endpoint
      );
      url.searchParams.append("query", searchQuery);
      url.searchParams.append("category", selectedCategory.value);
      url.searchParams.append("gender", selectedGender.value);
      url.searchParams.append("page", "1");
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("userId", userData?._id || null);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setProActors(data.actorsWithUserVote);
      if (user?.email) {
        GetUser(user.email).then((res) => {
          if (res?.expiresProAt != null) {
            const expiryDate = new Date(res?.expiresProAt);
            const now = new Date();
            if (expiryDate > now) {
              const remainingTime = Math.floor(
                (expiryDate.getTime() - now.getTime()) / 1000
              ); // Convert milliseconds to seconds

              setRemainingTime(remainingTime);
              setIsLockedProActors(false);
            }
          }
        });
      }

      setHasMorePro(data.hasMore);
    } catch (error) {}
  };

  //new pro actor code

  const fetchProActors = async (limit = 5) => {
    try {
      if (proPageRef.current === 1) {
        proPageRef.current = 2;
      }

      const url = new URL(
        `${import.meta.env.VITE_END_POINT_URL}/api/pro-ai-actors` // Replace with the correct endpoint
      );
      url.searchParams.append("query", searchQuery);
      url.searchParams.append("category", selectedCategory.value);
      url.searchParams.append("gender", selectedGender.value);
      url.searchParams.append("page", proPageRef.current.toString());
      url.searchParams.append("limit", "20");
      url.searchParams.append("userId", userData?._id || null);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Modify the pro actor data based on selected language
      const modifiedProActors = data.actorsWithUserVote.map((actor: any) => {
        const actorName =
          language === "de" ? actor.actor_name_de : actor.actor_name;
        const title = language === "de" ? actor.title_de : actor.title;
        const description =
          language === "de" ? actor.description_de : actor.description;
        const category = language === "de" ? actor.category_de : actor.category;
        const style = language === "de" ? actor.style_de : actor.style;

        return {
          ...actor,
          actor_name: actorName,
          title: title, // Update title if necessary
          description: description,
          category: category, // Update category if necessary
          style: style, // Update style if necessary
        };
      });

      setProActors((prev) => [...prev, ...modifiedProActors]);
      proPageRef.current = proPageRef.current + 1;

      // Check if Pro user has remaining time
      if (userData?.expiresProAt != null) {
        const expiryDate = new Date(userData?.expiresProAt);
        const now = new Date();
        if (expiryDate > now) {
          const remainingTime = Math.floor(
            (expiryDate.getTime() - now.getTime()) / 1000
          ); // Convert milliseconds to seconds

          setRemainingTime(remainingTime);
          setIsLockedProActors(false);
        }
      }

      setHasMorePro(data.hasMore);
    } catch (error) {
      console.error("Error fetching pro actors:", error);
    }
  };

  useEffect(() => {
    if (actorType === "pro") {
      const initFetchProActors = async (limit = 5) => {
        setIsLoadingProActors(true);
        try {
          const url = new URL(
            `${import.meta.env.VITE_END_POINT_URL}/api/pro-ai-actors` // Replace with the correct endpoint
          );
          url.searchParams.append("query", debouncedQuery);
          url.searchParams.append("category", selectedCategory.value);
          url.searchParams.append("gender", selectedGender.value);
          url.searchParams.append("page", "1");
          url.searchParams.append("limit", "20");
          url.searchParams.append("userId", userData?._id || null);

          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();

          // Modify the pro actor data based on selected language
          const modifiedProActors = data.actorsWithUserVote.map(
            (actor: any) => {
              const actorName =
                language === "de" ? actor.actor_name_de : actor.actor_name;
              const title = language === "de" ? actor.title_de : actor.title;
              const description =
                language === "de" ? actor.description_de : actor.description;
              const category =
                language === "de" ? actor.category_de : actor.category;
              const style = language === "de" ? actor.style_de : actor.style;

              return {
                ...actor,
                actor_name: actorName,
                title: title, // Update title if necessary
                description: description,
                category: category, // Update category if necessary
                style: style, // Update style if necessary
              };
            }
          );

          setProActors(modifiedProActors);
          proPageRef.current = 2;

          // Check if Pro user has remaining time
          if (userData?.expiresProAt != null) {
            const expiryDate = new Date(userData?.expiresProAt);
            const now = new Date();
            if (expiryDate > now) {
              const remainingTime = Math.floor(
                (expiryDate.getTime() - now.getTime()) / 1000
              ); // Convert milliseconds to seconds

              setRemainingTime(remainingTime);
              setIsLockedProActors(false);
            }
          }

          setHasMorePro(data.hasMore);
          setIsLoadingProActors(false);
        } catch (error) {
          setIsLoadingProActors(false);
          console.error("Error fetching pro actors:", error);
        }
      };

      initFetchProActors();
    }
  }, [
    userData,
    debouncedQuery,
    selectedCategory,
    selectedGender,
    actorType,
    language,
  ]); // Add language to dependencies

  // end

  // const fetchProActors = async (limit = 5) => {
  //   try {
  //     if (proPageRef.current === 1) {
  //       proPageRef.current = 2;
  //     }

  //     const url = new URL(
  //       `${import.meta.env.VITE_END_POINT_URL}/api/pro-ai-actors` // Replace with the correct endpoint
  //     );
  //     url.searchParams.append("query", searchQuery);
  //     url.searchParams.append("category", selectedCategory.value);
  //     url.searchParams.append("gender", selectedGender.value);
  //     url.searchParams.append("page", proPageRef.current.toString());
  //     url.searchParams.append("limit", "20");
  //     url.searchParams.append("userId", userData?._id || null);

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     console.debug("dddddddddd", data);
  //     setProActors((prev) => [...prev, ...data.actorsWithUserVote]);
  //     proPageRef.current = proPageRef.current + 1;

  //     if (userData?.expiresProAt != null) {
  //       const expiryDate = new Date(userData?.expiresProAt);
  //       const now = new Date();
  //       if (expiryDate > now) {
  //         const remainingTime = Math.floor(
  //           (expiryDate.getTime() - now.getTime()) / 1000
  //         ); // Convert milliseconds to seconds
  //         console.debug("Remaining time:", remainingTime);
  //         setRemainingTime(remainingTime);
  //         setIsLockedProActors(false);
  //       }
  //     }
  //     setHasMorePro(data.hasMore);
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   if (actorType === "pro") {
  //     const initFetchProActors = async (limit = 5) => {
  //       setIsLoadingProActors(true);
  //       try {
  //         const url = new URL(
  //           `${import.meta.env.VITE_END_POINT_URL}/api/pro-ai-actors` // Replace with the correct endpoint
  //         );
  //         url.searchParams.append("query", debouncedQuery);
  //         url.searchParams.append("category", selectedCategory.value);
  //         url.searchParams.append("gender", selectedGender.value);
  //         url.searchParams.append("page", "1");
  //         url.searchParams.append("limit", "20");
  //         url.searchParams.append("userId", userData?._id || null);

  //         const response = await fetch(url, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         });
  //         const data = await response.json();
  //         console.debug("dddddddddd", data);
  //         setProActors(data.actorsWithUserVote);
  //         proPageRef.current = 2;

  //         if (userData?.expiresProAt != null) {
  //           const expiryDate = new Date(userData?.expiresProAt);
  //           const now = new Date();
  //           if (expiryDate > now) {
  //             const remainingTime = Math.floor(
  //               (expiryDate.getTime() - now.getTime()) / 1000
  //             ); // Convert milliseconds to seconds
  //             console.debug("Remaining time:", remainingTime);
  //             setRemainingTime(remainingTime);
  //             setIsLockedProActors(false);
  //           }
  //         }
  //         setHasMorePro(data.hasMore);
  //         setIsLoadingProActors(false);
  //       } catch (error) {
  //         setIsLoadingProActors(false);
  //       }
  //     };

  //     initFetchProActors();
  //   }
  // }, [userData, debouncedQuery, selectedCategory, selectedGender, actorType]);

  // Filter actors based on search and filters
  const filteredActors = actors.filter((actor) => {
    [];
    // const matchesSearch =
    //   actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   actor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   actor.description.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesCategory =
    //   selectedCategory === "all" || actor.category === selectedCategory;
    // const matchesGender =
    //   selectedGender === "all" || actor.gender === selectedGender;
    // return matchesSearch && matchesCategory && matchesGender;
  });

  const handleLipSync = (actor: Actor, e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedVideoUrl = encodeURIComponent(actor.videoUrl);
    window.history.pushState(
      {},
      "",
      `/ugc-actor?step=2&video=${encodedVideoUrl}`
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.history.pushState({}, "", "/auth");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    // Here you would typically send the review to your backend
    const newReviewObj: Review = {
      id: Math.random(), // In real app, this would be generated by the backend
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userAvatar: user.photoURL || undefined,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
      likes: 0,
    };

    // Update the actor's reviews in state
    if (selectedActor) {
      const updatedActor = {
        ...selectedActor,
        reviews: [newReviewObj, ...selectedActor.reviews],
        totalReviews: selectedActor.totalReviews + 1,
        rating:
          (selectedActor.rating * selectedActor.totalReviews +
            newReview.rating) /
          (selectedActor.totalReviews + 1),
      };
      setSelectedActor(updatedActor);
    }

    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleLikeReview = (reviewId: number) => {
    if (!user) {
      window.history.pushState({}, "", "/auth");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (selectedActor) {
      const updatedReviews = selectedActor.reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              likes: review.hasLiked ? review.likes - 1 : review.likes + 1,
              hasLiked: !review.hasLiked,
            }
          : review
      );
      setSelectedActor({ ...selectedActor, reviews: updatedReviews });
    }
  };
  // if (!user) {
  //   return (
  //     <div className="min-h-screen  flex justify-center items-center">
  //       <div className="col-span-full text-center py-12 space-y-3">
  //         <p className="text-2xl text-black/70">
  //           {" "}
  //           Please Sign in to the system
  //         </p>
  //         <p className="text-black/50">
  //           AI Actor Gallery will appear here once you sign in.
  //         </p>{" "}
  //         <Button
  //           variant="secondary"
  //           onClick={() => {
  //             window.location.href = "/auth";
  //           }}
  //           className="mt-4 text-xs sm:text-sm"
  //         >
  //           Sign In
  //         </Button>
  //       </div>{" "}
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen py-24">
      {" "}
      {isHadnlePurchaseOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-xl w-full max-w-md shadow-2xl"
          >
            {!notEngoughCredits ? (
              <>
                {" "}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="sm:text-xl text-base font-semibold">
                      {getTranslation(
                        language,
                        "aiGallerySection.unlockProModal.unlockProAccess"
                      )}
                    </h2>
                    <button
                      className="p-2 hover:bg-black/5 rounded-full transition-colors"
                      onClick={() => {
                        setIsHadnlePurchaseOpen(false);
                        setSelectedActor(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-black/70 mb-6 sm:text-sm text-xs">
                    {import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC" ? (
                      <>
                        {" "}
                        {getTranslation(
                          language,
                          "aiGallerySection.unlockProModal.unlockDescription"
                        )}
                      </>
                    ) : (
                      <>
                        {" "}
                        {getTranslation(
                          language,
                          "aiGallerySection.unlockProModal.unlockugcAdsDescription"
                        )}
                      </>
                    )}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 text-xs sm:text-base"
                      onClick={() => {
                        handlePurchase();
                      }}
                    >
                      {getTranslation(
                        language,
                        "aiGallerySection.unlockProModal.unlockButton"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 text-xs sm:text-base"
                      onClick={() => {
                        setIsHadnlePurchaseOpen(false);
                        setSelectedActor(null);
                      }}
                    >
                      {getTranslation(
                        language,
                        "aiGallerySection.unlockProModal.cancelButton"
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {" "}
                      {getTranslation(
                        language,
                        "aiGallerySection.unlockProModal.notEnoughTokensTitle"
                      )}
                    </h2>
                    <button
                      className="p-2 hover:bg-black/5 rounded-full transition-colors"
                      onClick={() => {
                        setIsHadnlePurchaseOpen(false);
                        setSelectedActor(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-black/70 mb-6">
                    {getTranslation(
                      language,
                      "aiGallerySection.unlockProModal.notEnoughTokensDescription"
                    )}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        window.location.href = "/purchase";
                      }}
                      className="flex-1 bg-red-700 w-1/2"
                    >
                      {getTranslation(
                        language,
                        "aiGallerySection.unlockProModal.buyCreditsButton"
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent mb-4">
            {getTranslation(language, "aiGallerySection.header.title")}
          </h1>
          <p className="text-base lg:text-xl text-black/60 max-w-2xl mx-auto">
            {getTranslation(language, "aiGallerySection.header.description")}
          </p>
        </div>
        {/* Search and Filters */}
        <div className="mb-12 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 z-50 h-4 w-4 text-black/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(
                language,
                "aiGallerySection.searchAndFilters.searchPlaceholder"
              )}
              className="pl-10"
            />
          </div>

          {/* Collapsible Filter Button */}
          <Button
            variant="ghost"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 text-black/60 hover:text-black"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">
                {getTranslation(
                  language,
                  "aiGallerySection.searchAndFilters.filtersButton"
                )}
              </span>
              {(selectedCategory?.value !== categories[0]?.value ||
                selectedGender?.value !== genders[0]?.value) && (
                <div className="h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {(selectedCategory?.value !== categories[0]?.value ? 1 : 0) +
                    (selectedGender?.value !== genders[0]?.value ? 1 : 0)}
                </div>
              )}
            </span>

            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isFiltersExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Collapsible Filter Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isFiltersExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-4 pt-4 border-t border-black/5">
              {/* Filter Labels and Controls */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Categories Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black/60">
                      {getTranslation(
                        language,
                        "aiGallerySection.searchAndFilters.categoryLabel"
                      )}
                    </label>
                    <div className="h-4 w-4 rounded-full bg-black/5 flex items-center justify-center">
                      <span className="text-[10px] text-black/40">
                        {categories.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.value}
                        variant={
                          selectedCategory.value === category.value
                            ? "primary"
                            : "ghost"
                        }
                        onClick={() => setSelectedCategory(category)}
                        size="sm"
                        className="capitalize text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 whitespace-nowrap hover:bg-black/5 transition-colors"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Divider - hidden on mobile */}
                <div className="hidden sm:block w-px self-stretch bg-black/10" />

                {/* Gender Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black/60">
                      {getTranslation(
                        language,
                        "aiGallerySection.searchAndFilters.genderLabel"
                      )}
                    </label>
                    <div className="h-4 w-4 rounded-full bg-black/5 flex items-center justify-center">
                      <span className="text-[10px] text-black/40">
                        {genders.length - 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genders.map((gender) => (
                      <Button
                        key={gender.value}
                        variant={
                          selectedGender.value === gender.value
                            ? "primary"
                            : "ghost"
                        }
                        onClick={() => setSelectedGender(gender)}
                        size="sm"
                        className="capitalize text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 whitespace-nowrap hover:bg-black/5 transition-colors"
                      >
                        {gender.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Gallery Grid Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={actorType === "basic" ? "primary" : "ghost"}
            onClick={() => setActorType("basic")}
            className="text-xs sm:text-sm"
          >
            {getTranslation(
              language,
              "aiGallerySection.galleryTabs.basicActors"
            )}
          </Button>
          <Button
            variant={actorType === "pro" ? "primary" : "ghost"}
            onClick={() => setActorType("pro")}
            className="text-xs sm:text-sm"
          >
            {getTranslation(language, "aiGallerySection.galleryTabs.proActors")}
          </Button>
        </div>
        {actorType === "pro" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-indigo-50/80 to-indigo-100/50 rounded-lg border border-indigo-200/50 gap-4 sm:gap-6 backdrop-blur-sm mb-5">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className={`p-2 rounded-full shrink-0 ${
                  isLockedProActors
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {isLockedProActors ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h3
                  className={`font-medium text-sm sm:text-base ${
                    isLockedProActors ? "text-indigo-800" : "text-emerald-500"
                  }`}
                >
                  {isLockedProActors
                    ? getTranslation(
                        language,
                        "aiGallerySection.proAccessBanner.unlockAllProVideos"
                      )
                    : getTranslation(
                        language,
                        "aiGallerySection.proAccessBanner.proAccessActive"
                      )}
                </h3>
                <p
                  className={`text-xs sm:text-sm truncate ${
                    isLockedProActors ? "text-indigo-800" : "text-emerald-600"
                  }`}
                >
                  {isLockedProActors ? (
                    <>
                      {" "}
                      {import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC" ? (
                        <>
                          {" "}
                          {getTranslation(
                            language,
                            "aiGallerySection.unlockProModal.unlockDescription"
                          )}
                        </>
                      ) : (
                        <>
                          {" "}
                          {getTranslation(
                            language,
                            "aiGallerySection.unlockProModal.unlockugcAdsDescription"
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    `${getTranslation(
                      language,
                      "aiGallerySection.proAccessBanner.timeRemaining"
                    )} ${displayingTime}`
                  )}
                </p>
              </div>
            </div>
            {isLockedProActors && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (user && userData) {
                    handleUnlockPro();
                  } else {
                    window.location.href = "/auth";
                  }
                }}
                className="bg-indigo-800 hover:bg-indigo-700 text-white w-full sm:w-auto whitespace-nowrap transition-colors duration-200 shadow-sm hover:shadow-md active:shadow-sm text-xs sm:text-sm"
              >
                {getTranslation(
                  language,
                  "aiGallerySection.proAccessBanner.unlockProAccessButton"
                )}
              </Button>
            )}
          </div>
        )}
        {/* Gallery Grid */}
        {actorType === "basic" ? (
          <InfiniteScroll
            dataLength={actors.length}
            next={fetchActors}
            hasMore={hasmore}
            loader={
              !isLoadingActors && (
                <div className="w-full flex justify-center mt-10">
                  <Loader className="animate-spin text-black/50" size={48} />
                </div>
              )
            }
            className="infinite-scroll-container"
          >
            {isLoadingActors ? (
              <div className="w-full flex justify-center mt-10">
                <Loader className="animate-spin text-black/50" size={48} />
              </div>
            ) : actors.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                    <TbFileSad className="w-16 h-16 text-black/40" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-medium text-black/70">
                    {getTranslation(
                      language,
                      "aiGallerySection.noResults.noActorsFound"
                    )}
                  </h3>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {actors.map((actor) => (
                  <motion.div
                    key={actor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                    onClick={() => {
                      setSelectedActor(actor);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <Card className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg">
                      <div
                        className="aspect-[2/3] relative overflow-hidden"
                        onMouseEnter={() => handleMouseEnter(actor._id)}
                        onMouseLeave={() => handleMouseLeave(actor._id)}
                      >
                        {/* <img
                          src={actor.thumbnail}
                          alt={actor.actor_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        /> */}

                        <img
                          src={actor.thumbnail}
                          alt="Thumbnail"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                            isPlaying[actor._id] && !isLoading2
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                        />
                        <video
                          ref={(el) => (videoRefs.current[actor._id] = el)} // Assign individual ref
                          src={actor.videoUrl}
                          className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                          loop
                          muted
                          autoPlay={isPlaying[actor._id]}
                          playsInline
                          disablePictureInPicture
                          controlsList="nodownload"
                          onContextMenu={(e) => e.preventDefault()}
                          onWaiting={() => setIsLoading2(true)}
                          onPlaying={() => setIsLoading2(false)}
                          onLoadedData={() => setIsLoading2(false)}
                        />

                        {isLoading2 && isPlaying[actor._id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        <div className="absolute inset-x-0 bottom-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-full flex flex-row items-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-colors "
                            onClick={(e) => handleLipSync(actor, e)}
                          >
                            <Mic className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                            <span className="sm:text-sm text-xs ">
                              {getTranslation(
                                language,
                                "aiGallerySection.actorCard.lipSyncButton"
                              )}
                            </span>
                          </Button>{" "}
                          <button
                            variant="secondary"
                            size="sm"
                            className="p-0 backdrop-blur-sm  transition-colors sm:flex hidden rounded-full text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedActor(actor);
                              setIsPreviewOpen(true);
                            }}
                          >
                            <HiOutlineDotsCircleHorizontal className="sm:w-8 w-3 sm:h-8 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="p-2 sm:p-4 w-full flex sm:flex-row flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-xs sm:text-sm mb-1 group-hover:text-black/80 transition-colors">
                            {actor.actor_name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-black/60">
                            {actor.title}
                          </p>
                        </div>{" "}
                        <div
                          className={` backdrop-blur-sm bg-white/80 flex flex-row justify-center items-center sm:gap-3 gap-2 py-0 px-2 sm:h-9 h-6 sm:w-[90px] w-[75px] sm:my-0 my-2 rounded-full border border-black`}
                        >
                          <span
                            className="sm:text-lg text-xs text-black/60 cursor-pointer"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (actor.userVote == "upvote") return null;
                              await handleVote(
                                actor.userVote,
                                "upvote",
                                actor._id
                              );
                              if (actor.userVote == "downvote") {
                                actor.voteSummary += 2;
                              } else {
                                actor.voteSummary += 1;
                              }
                              actor.userVote = "upvote";
                            }}
                          >
                            {actor.userVote == "upvote" ? (
                              <TbArrowBigUpFilled />
                            ) : (
                              <TbArrowBigUp />
                            )}
                          </span>
                          <span
                            className={`sm:text-sm text-xs text-black/60 ${
                              actor.voteSummary == 0
                                ? ""
                                : actor.voteSummary > 0
                                ? "pr-3 border-r-[1px]"
                                : "pl-3 border-l-[1px]"
                            }  border-black `}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (actor.voteSummary == 0) {
                                return;
                              } else if (actor.voteSummary > 0) {
                                await handleVote(
                                  actor.userVote,
                                  "upvote",
                                  actor._id
                                );
                                if (actor.userVote == "downvote") {
                                  actor.voteSummary += 2;
                                } else {
                                  actor.voteSummary += 1;
                                }
                                actor.userVote = "upvote";
                              } else {
                                await handleVote(
                                  actor.userVote,
                                  "downvote",
                                  actor._id
                                );

                                if (actor.userVote == "upvote") {
                                  actor.voteSummary -= 2;
                                } else {
                                  actor.voteSummary -= 1;
                                }
                                actor.userVote = "downvote";
                              }
                            }}
                          >
                            {actor.voteSummary}
                          </span>
                          <span
                            className="sm:text-lg text-xs text-black/60 cursor-pointer"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (actor.userVote == "downvote") return null;
                              await handleVote(
                                actor.userVote,
                                "downvote",
                                actor._id
                              );
                              if (actor.userVote == "upvote") {
                                actor.voteSummary -= 2;
                              } else {
                                actor.voteSummary -= 1;
                              }
                              actor.userVote = "downvote";
                            }}
                          >
                            {actor.userVote == "downvote" ? (
                              <TbArrowBigDownFilled />
                            ) : (
                              <TbArrowBigDown />
                            )}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            dataLength={proActors.length}
            next={fetchProActors}
            hasMore={hasMorePro}
            loader={
              !isLoadingProActors && (
                <div className="w-full flex justify-center mt-10">
                  <Loader className="animate-spin text-black/50" size={48} />
                </div>
              )
            }
            className="infinite-scroll-container"
          >
            {isLoadingProActors ? (
              <div className="w-full flex justify-center mt-10">
                <Loader className="animate-spin text-black/50" size={48} />
              </div>
            ) : proActors.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                    <TbFileSad className="w-16 h-16 text-black/40" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-medium text-black/70">
                    {getTranslation(
                      language,
                      "aiGallerySection.noResults.noProActorsFound"
                    )}
                  </h3>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {proActors.map((actor) => (
                  <motion.div
                    key={actor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                    onClick={(e) => {
                      if (!isLockedProActors) {
                        e.stopPropagation();
                        setSelectedActor(actor);
                        setIsPreviewOpen(true);
                      } else {
                        e.stopPropagation();
                        handleUnlockPro();
                      }
                    }}
                  >
                    <Card className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg">
                      <div
                        className="aspect-[2/3] relative overflow-hidden"
                        onMouseEnter={() =>
                          !isLockedProActors
                            ? handleMouseEnter(actor._id)
                            : null
                        }
                        onMouseLeave={() =>
                          !isLockedProActors
                            ? handleMouseLeave(actor._id)
                            : null
                        }
                      >
                        {/* <img
                          src={actor.thumbnail}
                          alt={actor.actor_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        /> */}

                        <img
                          src={actor.thumbnail}
                          alt="Thumbnail"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                            !isLockedProActors &&
                            isPlaying[actor._id] &&
                            !isLoading2
                              ? "opacity-0"
                              : "opacity-100"
                          } ${isLockedProActors ? "filter blur-md" : ""}`}
                        />
                        {!isLockedProActors && (
                          <video
                            ref={(el) => (videoRefs.current[actor._id] = el)}
                            src={actor.videoUrl}
                            className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                            loop
                            muted
                            autoPlay={isPlaying[actor._id]}
                            playsInline
                            disablePictureInPicture
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                            onWaiting={() => setIsLoading2(true)}
                            onPlaying={() => setIsLoading2(false)}
                            onLoadedData={() => setIsLoading2(false)}
                          />
                        )}

                        {isLoading2 && isPlaying[actor._id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        <div className="absolute inset-x-0 bottom-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-full flex flex-row items-center">
                          {isLockedProActors ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlockPro(actor);
                              }}
                            >
                              Unlock
                            </Button>
                          ) : (
                            <div className="flex flex-col w-full gap-4">
                              <div className="flex flex-row gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="w-full backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-colors"
                                  onClick={(e) => handleLipSync(actor, e)}
                                >
                                  <Mic className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                                  <span className="sm:text-sm text-xs ">
                                    Lip Sync
                                  </span>
                                </Button>{" "}
                                <button
                                  className="p-1 backdrop-blur-sm sm:flex rounded-full flex justify-center items-center text-white hover:bg-white/50 transition-all duration-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedActor(actor);
                                    setIsPreviewOpen(true);
                                  }}
                                >
                                  <HiOutlineDotsHorizontal className="sm:w-8 w-3 sm:h-8 h-3 text-xs text-white" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-2 sm:p-4 w-full flex sm:flex-row flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-xs sm:text-sm mb-1 group-hover:text-black/80 transition-colors">
                            {actor.actor_name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-black/60">
                            {actor.title}
                          </p>
                        </div>{" "}
                        <div
                          className={` backdrop-blur-sm bg-white/80 flex flex-row justify-center items-center sm:gap-3 gap-2 py-0 px-2 sm:h-9 h-6 sm:w-[90px] w-[75px] sm:my-0 my-2 rounded-full border border-black`}
                        >
                          <span
                            className="sm:text-lg text-xs text-black/60 cursor-pointer"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!isLockedProActors) {
                                if (actor.userVote == "upvote") return null;
                                await handleProVote(
                                  actor.userVote,
                                  "upvote",
                                  actor._id
                                );
                                if (actor.userVote == "downvote") {
                                  actor.voteSummary += 2;
                                } else {
                                  actor.voteSummary += 1;
                                }
                                actor.userVote = "upvote";
                              } else {
                                handleUnlockPro(actor);
                              }
                            }}
                          >
                            {actor.userVote == "upvote" ? (
                              <TbArrowBigUpFilled />
                            ) : (
                              <TbArrowBigUp />
                            )}
                          </span>
                          <span
                            className={`sm:text-sm text-xs text-black/60 ${
                              actor.voteSummary == 0
                                ? ""
                                : actor.voteSummary > 0
                                ? "pr-3 border-r-[1px]"
                                : "pl-3 border-l-[1px]"
                            }  border-black `}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!isLockedProActors) {
                                if (actor.voteSummary == 0) {
                                  return;
                                } else if (actor.voteSummary > 0) {
                                  await handleProVote(
                                    actor.userVote,
                                    "upvote",
                                    actor._id
                                  );
                                  if (actor.userVote == "downvote") {
                                    actor.voteSummary += 2;
                                  } else {
                                    actor.voteSummary += 1;
                                  }
                                  actor.userVote = "upvote";
                                } else {
                                  await handleProVote(
                                    actor.userVote,
                                    "downvote",
                                    actor._id
                                  );

                                  if (actor.userVote == "upvote") {
                                    actor.voteSummary -= 2;
                                  } else {
                                    actor.voteSummary -= 1;
                                  }
                                  actor.userVote = "downvote";
                                }
                              } else {
                                handleUnlockPro(actor);
                              }
                            }}
                          >
                            {actor.voteSummary}
                          </span>
                          <span
                            className="sm:text-lg text-xs text-black/60 cursor-pointer"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!isLockedProActors) {
                                if (actor.userVote == "downvote") return null;
                                await handleProVote(
                                  actor.userVote,
                                  "downvote",
                                  actor._id
                                );
                                if (actor.userVote == "upvote") {
                                  actor.voteSummary -= 2;
                                } else {
                                  actor.voteSummary -= 1;
                                }
                                actor.userVote = "downvote";
                              } else {
                                handleUnlockPro(actor);
                              }
                            }}
                          >
                            {actor.userVote == "downvote" ? (
                              <TbArrowBigDownFilled />
                            ) : (
                              <TbArrowBigDown />
                            )}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </InfiniteScroll>
        )}
        {/* Actor Preview Modal */}
        {isPreviewOpen && selectedActor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div
              className="absolute inset-0"
              onClick={() => {
                setIsPreviewOpen(false);
                setIsPlaying2(false);
                setSelectedActor(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-xl sm:rounded-2xl h-fit w-full sm:max-w-[50vw] my-4 sm:my-8 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left Column - Image */}
                <div
                  className="w-full md:w-3/6  h-[80vh] md:h-[80vh] overflow-y-auto relative cursor-pointer "
                  style={{ aspectRatio: "9/16" }}
                  onClick={togglePlayPause}
                >
                  {/* <img
                    src={selectedActor.thumbnail}
                    alt={selectedActor.actor_name}
                    className="w-full h-full object-cover"
                  />    */}
                  {/* <div className="h-full flex justify-center items-center w-full object-cover">
                    <div
                      className="aspect-video rounded-lg overflow-hidden bg-black/5"
                      style={{ aspectRatio: "9/16" }}
                    > */}

                  <img
                    src={selectedActor.thumbnail}
                    alt="Thumbnail"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isPlaying2 && !isLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <video
                    ref={videoRef}
                    src={selectedActor.videoUrl}
                    className="w-full h-full object-cover pointer-events-none rounded-2xl"
                    loop
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    onWaiting={() => setIsLoading(true)}
                    onPlaying={() => setIsLoading(false)}
                    onLoadedMetadata={() => setIsLoading(false)} // Use this instead
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {/* Play/Pause Button */}
                  {!isLoading && !isPlaying2 && (
                    <button
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-4xl rounded-full w-20 h-20 m-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                    >
                      {isPlaying2 ? "❚❚" : <FaPlay />}
                    </button>
                  )}
                  {/* </div>
                  </div> */}
                  <div
                    className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 backdrop-blur-sm bg-white/80 flex flex-row justify-center items-center gap-3 px-2 py-1 rounded-full`}
                  >
                    <p
                      className="text-lg text-black/60 cursor-pointer"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleVote(
                          selectedActor.userVote,
                          "upvote",
                          selectedActor._id
                        );
                      }}
                    >
                      {selectedActor.userVote == "upvote" ? (
                        <TbArrowBigUpFilled />
                      ) : (
                        <TbArrowBigUp />
                      )}
                    </p>
                    <p
                      className={`text-base text-black/60 ${
                        selectedActor.voteSummary == 0
                          ? ""
                          : selectedActor.voteSummary > 0
                          ? "pr-3 border-r-[1px]"
                          : "pl-3 border-l-[1px]"
                      }  border-black `}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (selectedActor.voteSummary == 0) {
                          return;
                        } else if (selectedActor.voteSummary > 0) {
                          if (actorType === "basic") {
                            await handleVote(
                              selectedActor.userVote,
                              "upvote",
                              selectedActor._id
                            );
                          } else {
                            await handleProVote(
                              selectedActor.userVote,
                              "upvote",
                              selectedActor._id
                            );
                          }
                        } else {
                          if (actorType === "basic") {
                            await handleVote(
                              selectedActor.userVote,
                              "downvote",
                              selectedActor._id
                            );
                          } else {
                            await handleProVote(
                              selectedActor.userVote,
                              "downvote",
                              selectedActor._id
                            );
                          }
                        }
                      }}
                    >
                      {selectedActor.voteSummary}
                    </p>
                    <p
                      className="text-lg text-black/60 cursor-pointer"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (actorType === "basic") {
                          await handleVote(
                            selectedActor.userVote,
                            "downvote",
                            selectedActor._id
                          );
                        } else {
                          await handleProVote(
                            selectedActor.userVote,
                            "downvote",
                            selectedActor._id
                          );
                        }
                      }}
                    >
                      {selectedActor.userVote == "downvote" ? (
                        <TbArrowBigDownFilled />
                      ) : (
                        <TbArrowBigDown />
                      )}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 backdrop-blur-sm bg-white/80"
                    onClick={(e) => handleLipSync(selectedActor, e)}
                  >
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="text-sm sm:text-base">Lip Sync</span>
                  </Button>
                </div>

                {/* Right Column - Info */}
                <div className="w-full md:w-1/2 h-[60vh] md:h-[80vh] overflow-y-auto p-4 sm:p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-row gap-5 justify-center items-center">
                        <h2 className="text-2xl font-semibold">
                          {selectedActor.actor_name}
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          setIsPreviewOpen(false);
                          setIsPlaying2(false);
                          setSelectedActor(null);
                        }}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-lg text-black/60 mb-2">
                      {selectedActor.title}
                    </p>
                    <p className="text-sm text-black/80 mb-4">
                      {selectedActor.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-black/60">
                          {" "}
                          {getTranslation(
                            language,
                            "aiGallerySection.actorPreviewModal.ageRangeLabel"
                          )}
                        </p>
                        <p className="font-medium">{selectedActor.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-black/60">
                          {getTranslation(
                            language,
                            "aiGallerySection.actorPreviewModal.styleLabel"
                          )}
                        </p>
                        <p className="font-medium">{selectedActor.style}</p>
                      </div>

                      <div>
                        <p className="text-sm text-black/60">
                          {getTranslation(
                            language,
                            "aiGallerySection.actorPreviewModal.categoryLabel"
                          )}
                        </p>
                        <p className="font-medium capitalize">
                          {selectedActor.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-black/10 mb-6">
                    <div className="flex gap-4">
                      {/* <button
                        className={`pb-2 text-sm font-medium transition-colors relative ${
                          activeTab === "preview"
                            ? "text-black"
                            : "text-black/40 hover:text-black/60"
                        }`}
                        onClick={() => setActiveTab("preview")}
                      >
                        Preview
                        {activeTab === "preview" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                          />
                        )}
                      </button> */}
                      <button
                        className={`pb-2 text-sm font-medium transition-colors relative ${
                          activeTab === "reviews"
                            ? "text-black"
                            : "text-black/40 hover:text-black/60"
                        }`}
                        onClick={() => setActiveTab("reviews")}
                      >
                        {getTranslation(
                          language,
                          "aiGallerySection.actorPreviewModal.reviewsTab"
                        )}
                        {activeTab === "reviews" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "preview" && false ? (
                    <div className=" flex justify-center items-center w-full">
                      <div
                        className="aspect-video rounded-lg overflow-hidden bg-black/5 h-[450px]"
                        style={{ aspectRatio: "9/16" }}
                      >
                        <video
                          src={selectedActor.videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {!showReviewForm && (
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => {
                            if (!user) {
                              window.location.href = "/auth";
                            } else {
                              setShowReviewForm(true);
                            }
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {getTranslation(
                            language,
                            "aiGallerySection.actorPreviewModal.writeReviewButton"
                          )}
                        </Button>
                      )}

                      {/* Review Form */}
                      {showReviewForm && (
                        <form
                          onSubmit={handleSubmitReview}
                          className="space-y-4"
                        >
                          {/* <div>
                            <label className="block text-sm font-medium mb-1">
                              Rating
                            </label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() =>
                                    setNewReview((prev) => ({
                                      ...prev,
                                      rating,
                                    }))
                                  }
                                  className="p-1"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      rating <= newReview.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div> */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {getTranslation(
                                language,
                                "aiGallerySection.actorPreviewModal.commentLabel"
                              )}
                            </label>
                            <textarea
                              onChange={(e) => {
                                setNewReview(e.target.value);
                              }}
                              className="w-full rounded-lg border-gray-200 focus:border-black focus:ring-black px-5 py-5"
                              rows={4}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              className="flex-1"
                              onClick={submitReview}
                            >
                              {getTranslation(
                                language,
                                "aiGallerySection.actorPreviewModal.submitReviewButton"
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setShowReviewForm(false)}
                            >
                              {getTranslation(
                                language,
                                "aiGallerySection.actorPreviewModal.cancelReviewButton"
                              )}
                            </Button>
                          </div>
                        </form>
                      )}

                      {/* Reviews List */}

                      {/* <InfiniteScroll
                        dataLength={reviews.length}
                        next={fetchReviews}
                        hasMore={hasMoreReview}
                        loader={
                          <div className="w-full flex justify-center mt-10">
                            <Loader
                              className="animate-spin text-black/50"
                              size={48}
                            />
                          </div>
                        }
                        // endMessage={<p style={{ textAlign: "center" }}>No more reviews.</p>}
                        className="infinite-scroll-container h-[300px]"
                      > */}
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 rounded-lg bg-black/5"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-medium">
                                    {review.userName}
                                  </div>
                                </div>
                                <div className="text-sm text-black/60">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              {/* <button
                                onClick={() => handleLikeReview(review.id)}
                                className={`flex items-center gap-1 text-sm ${
                                  review.hasLiked
                                    ? "text-blue-500"
                                    : "text-black/60"
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{review.likes}</span>
                              </button> */}
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                      {/* </InfiniteScroll> */}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
