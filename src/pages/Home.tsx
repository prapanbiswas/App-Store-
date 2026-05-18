import { useState, useMemo, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import AppCard from "../components/AppCard";

export default function Home() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "apps"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApps(appsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const recommendedApps = useMemo(() => {
    if (!apps.length) return [];
    
    const scored = apps.map((app) => {
      const downloadScore = app.totalDownloads * 0.4;
      const ratingScore = app.averageRating * 0.4;
      const tagMatchScore = (app.tags.length || 0) * 0.1;

      return {
        ...app,
        score: downloadScore + ratingScore + tagMatchScore,
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [apps]);

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-10 pt-4">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
          Discover Great Apps
        </h1>
        <p className="max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          The cleanest, open hub for Android applications. Explore our carefully curated selection.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
          ))}
        </div>
      ) : (
        <>
          {recommendedApps.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 flex items-center justify-between text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedApps.map((app) => (
                  <AppCard key={app.id} {...app} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2 text-xl font-bold tracking-tight text-gray-900 dark:border-gray-800 dark:text-white">
              Recently Added
            </h2>
            
            {apps.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {apps.map((app) => (
                  <AppCard key={app.id} {...app} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">No apps have been published yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
