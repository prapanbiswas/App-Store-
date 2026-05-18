import { Link } from "react-router-dom";
import { FiDownload, FiStar } from "react-icons/fi";
import { motion } from "motion/react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
    >
      <Link to={`/app/${id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <Card className="h-full flex flex-col justify-between overflow-hidden border-border bg-card/60 backdrop-blur-md transition-shadow hover:shadow-lg hover:border-primary/20 cursor-pointer">
          <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 relative">
            <img
              src={logoUrl || "https://placehold.co/100x100/png?text=Icon"}
              alt={`${title} logo`}
              className="h-16 w-16 rounded-2xl object-cover shadow-sm bg-white"
            />
            <div className="flex flex-col items-end gap-1 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded-full">
                <FiStar className="fill-current" />
                {averageRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <FiDownload />
                {totalDownloads > 1000 ? `${(totalDownloads/1000).toFixed(1)}k+` : totalDownloads}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 mb-1">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              v{versionName}
            </p>
            
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-4">
             <div className="w-full rounded-lg bg-primary/5 py-2.5 text-center text-xs font-bold text-primary transition-colors group-hover:bg-primary/10">
              Get App
             </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
