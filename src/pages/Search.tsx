import { useState, useMemo, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import AppCard from "../components/AppCard";
import { FiSearch } from "react-icons/fi";

export default function Search() {
  const [apps, setApps] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredApps = useMemo(() => {
    if (!searchQuery) return [];
    const lowerSearch = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.title.toLowerCase().includes(lowerSearch) ||
        app.packageName.toLowerCase().includes(lowerSearch) ||
        app.tags.some((t: string) => t.toLowerCase().includes(lowerSearch))
    );
  }, [apps, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-8 pt-4">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Search
        </h1>
        <div className="relative w-full max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <FiSearch className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-gray-900 transition-shadow focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white sm:text-lg"
            placeholder="Search by title, package, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
            ))}
          </div>
        ) : searchQuery ? (
          filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredApps.map((app) => (
                <AppCard key={app.id} {...app} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
              <FiSearch size={48} className="mb-4 opacity-50" />
              <p className="text-lg">No apps found matching "{searchQuery}".</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-600">
            <FiSearch size={48} className="mb-4 opacity-30" />
            <p className="text-sm">Start typing to search for applications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
