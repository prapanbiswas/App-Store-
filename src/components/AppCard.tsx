import { Link } from "react-router-dom";
import { FiDownload, FiStar } from "react-icons/fi";
import { motion } from "motion/react";

interface AppTagProps {
  tag: string;
}

interface AppCardProps {
  id: string;
  title: string;
  packageName: string;
  logoUrl: string;
  versionName: string;
  averageRating: number;
  totalDownloads: number;
  tags: string[];
}

export default function AppCard({
  id,
  title,
  logoUrl,
  versionName,
  averageRating,
  totalDownloads,
  tags,
}: AppCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white/50 p-5 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50"
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <img
            src={logoUrl || "https://placehold.co/100x100/png?text=Icon"}
            alt={`${title} logo`}
            className="h-16 w-16 rounded-2xl object-cover shadow-sm"
          />
          <div className="flex flex-col items-end gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FiStar className="fill-current text-yellow-400" />
              {averageRating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <FiDownload />
              {totalDownloads}
            </span>
          </div>
        </div>
        
        <h3 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1">
          {title}
        </h3>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          v{versionName}
        </p>
        
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Link
        to={`/app/${id}`}
        className="block w-full rounded-md bg-gray-100 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors group-hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:group-hover:bg-gray-700"
      >
        View Details
      </Link>
    </motion.div>
  );
}
