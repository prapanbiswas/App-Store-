import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, runTransaction, serverTimestamp, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { FiDownload, FiStar, FiGithub, FiInfo } from "react-icons/fi";

export default function AppDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchApp = async () => {
      try {
        const docRef = doc(db, "apps", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApp({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchUserRating = async () => {
      try {
        const ratingDoc = await getDoc(doc(db, "apps", id, "ratings", user.uid));
        if (ratingDoc.exists()) {
          setUserRating(ratingDoc.data().rating);
        }
      } catch (err) {
        console.error("Error fetching rating", err);
      }
    };
    fetchUserRating();
  }, [id, user]);

  const handleDownload = async () => {
    if (!app?.apkUrl || !id) return;
    
    // Open in new tab securely
    window.open(app.apkUrl, "_blank", "noopener,noreferrer");

    // Increment downloads via transaction to prevent races, but a simple setDoc with increment is also possible.
    try {
      const appRef = doc(db, "apps", id);
      await runTransaction(db, async (transaction) => {
        const appDoc = await transaction.get(appRef);
        if (!appDoc.exists()) throw "App does not exist";
        const currentDownloads = appDoc.data().get('totalDownloads', 0);
        transaction.update(appRef, { totalDownloads: currentDownloads + 1 });
      });
      // Optionally update local state to reflect instantly
      setApp((prev: any) => ({ ...prev, totalDownloads: prev.totalDownloads + 1 }));
    } catch (err) {
      console.error("Failed to increment downloads", err);
    }
  };

  const handleRate = async (rateValue: number) => {
    if (!user || !id || !app) {
      alert("Please sign in to rate this app.");
      return;
    }

    try {
      const appRef = doc(db, "apps", id);
      const ratingRef = doc(db, "apps", id, "ratings", user.uid);
      
      await runTransaction(db, async (transaction) => {
        const userRatingDoc = await transaction.get(ratingRef);
        const appDoc = await transaction.get(appRef);
        if (!appDoc.exists()) throw "App does not exist";

        const data = appDoc.data();
        let totalRatings = data.get('totalRatings', 0);
        let averageRating = data.get('averageRating', 0);
        const previousTotalSum = totalRatings * averageRating;

        if (userRatingDoc.exists()) {
          // Update existing rating
          const previousUserRating = userRatingDoc.data().rating;
          const newSum = previousTotalSum - previousUserRating + rateValue;
          const newAverage = newSum / totalRatings;

          transaction.update(ratingRef, {
            rating: rateValue,
            updatedAt: serverTimestamp(),
          });
          transaction.update(appRef, { averageRating: newAverage });
        } else {
          // Create new rating
          const newTotalRatings = totalRatings + 1;
          const newAverage = (previousTotalSum + rateValue) / newTotalRatings;

          transaction.set(ratingRef, {
            rating: rateValue,
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          transaction.update(appRef, {
            totalRatings: newTotalRatings,
            averageRating: newAverage,
          });
        }
      });

      setUserRating(rateValue);
      // Re-fetch app details to show updated averages could be done here, 
      // but for UX, a full refetch or local state patch is okay.
      const updatedApp = await getDoc(doc(db, "apps", id));
      if (updatedApp.exists()) setApp({ id: updatedApp.id, ...updatedApp.data() });
      
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading application...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Application not found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-6">
          <img
            src={app.logoUrl || "https://placehold.co/200x200/png?text=Icon"}
            alt={`${app.title} logo`}
            className="h-32 w-32 rounded-3xl object-cover shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
          />
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {app.title}
            </h1>
            <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              {app.packageName}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                v{app.versionName}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                <FiInfo /> Min SDK: {app.minSdk}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-3 text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
          >
            <FiDownload size={20} />
            Download APK
          </button>
          
          {app.isOpenSource && app.repoUrl && (
            <a
              href={app.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
            >
              <FiGithub size={20} />
              View Source
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8 overflow-x-auto pb-4">
            <div className="flex gap-4">
              {app.screenshotUrls?.map((url: string, idx: number) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Screenshot ${idx + 1}`}
                  className="h-[400px] w-auto rounded-xl object-cover shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
                />
              ))}
              {(!app.screenshotUrls || app.screenshotUrls.length === 0) && (
                 <div className="flex items-center justify-center h-[400px] w-[250px] rounded-xl bg-gray-100 dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800">
                   <p className="text-gray-500">No screenshots</p>
                 </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              About this app
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
              {app.description}
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {app.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <h3 className="mb-4 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              App Info
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">Downloads</span>
                <span className="font-semibold text-gray-900 dark:text-white">{app.totalDownloads || 0}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">Average Rating</span>
                <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                  {Number(app.averageRating || 0).toFixed(1)} <FiStar className="fill-current text-yellow-400" />
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Ratings</span>
                <span className="font-semibold text-gray-900 dark:text-white">{app.totalRatings || 0}</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                Rate this App
              </h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <FiStar
                      size={28}
                      className={`transition-colors ${
                        (userRating || 0) >= star
                          ? "fill-current text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {!user && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Please sign in to rate.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
