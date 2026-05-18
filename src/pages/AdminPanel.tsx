import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInfoParser from "app-info-parser";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [apkFile, setApkFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<FileList | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isOpenSource, setIsOpenSource] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  const [parsedData, setParsedData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (loading) return null;
  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Access Denied. Admins only.</p>
      </div>
    );
  }

  const handleApkSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setApkFile(file);
    setParsedData(null);
    setError("");

    try {
      const parser = new AppInfoParser(file);
      const result = await parser.parse();
      setParsedData({
        packageName: result.package,
        versionName: result.versionName,
        versionCode: result.versionCode,
        minSdk: result.usesSdk?.minSdkVersion || "Unknown",
      });
      if (!title) setTitle(result.application?.label?.[0] || "");
    } catch (err) {
      console.error("Error parsing APK", err);
      setError("Failed to parse APK file. Ensure it is a valid Android package.");
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        "state_changed",
        null,
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkFile || !parsedData) {
      setError("Please select and successfully parse an APK file first.");
      return;
    }
    if (isOpenSource && !repoUrl) {
      setError("Repository URL is required for open source apps.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const appId = doc(collection(db, "apps")).id;

      // Upload files
      let logoUrl = "";
      if (logoFile) {
        logoUrl = await uploadFile(logoFile, `apps/${appId}/logo_${logoFile.name}`);
      }

      const screenshotUrls: string[] = [];
      if (screenshotFiles) {
        for (let i = 0; i < screenshotFiles.length; i++) {
          const file = screenshotFiles[i];
          const url = await uploadFile(file, `apps/${appId}/screenshots/img_${i}_${file.name}`);
          screenshotUrls.push(url);
        }
      }

      const apkUrl = await uploadFile(apkFile, `apps/${appId}/${apkFile.name}`);

      const appData = {
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        isOpenSource,
        repoUrl: isOpenSource ? repoUrl : null,
        packageName: parsedData.packageName,
        versionName: parsedData.versionName,
        versionCode: Number(parsedData.versionCode),
        minSdk: String(parsedData.minSdk),
        logoUrl,
        screenshotUrls,
        apkUrl,
        totalDownloads: 0,
        averageRating: 0,
        totalRatings: 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "apps", appId), appData);
      setSuccess("App published successfully!");
      
      // Reset form
      setApkFile(null);
      setLogoFile(null);
      setScreenshotFiles(null);
      setTitle("");
      setDescription("");
      setTags("");
      setIsOpenSource(false);
      setRepoUrl("");
      setParsedData(null);

    } catch (err: any) {
      setError(err.message || "Failed to upload app");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Publish Application
      </h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-green-50 p-4 text-sm text-green-600 dark:bg-green-950/50 dark:text-green-400">
          <FiCheckCircle size={18} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Uploads */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Binaries & Assets</h2>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
              APK File
            </label>
            <input
              type="file"
              accept=".apk"
              onChange={handleApkSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
              required
            />
            {parsedData && (
              <div className="mt-3 rounded-md bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <p>Package: <span className="font-mono text-black dark:text-white">{parsedData.packageName}</span></p>
                <p>Version: <span className="font-mono text-black dark:text-white">{parsedData.versionName} ({parsedData.versionCode})</span></p>
                <p>Min SDK: <span className="font-mono text-black dark:text-white">{parsedData.minSdk}</span></p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                App Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                Screenshots (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setScreenshotFiles(e.target.files)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
                required
              />
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Metadata</h2>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:focus:border-white dark:focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:focus:border-white dark:focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Productivity, Tools, Utility"
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:focus:border-white dark:focus:ring-white"
              required
            />
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="oss-toggle"
              checked={isOpenSource}
              onChange={(e) => setIsOpenSource(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:checked:bg-white dark:checked:border-white dark:focus:ring-white"
            />
            <label htmlFor="oss-toggle" className="text-sm font-medium text-gray-900 dark:text-gray-200">
              Open Source Software (OSS)
            </label>
          </div>

          {isOpenSource && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:focus:border-white dark:focus:ring-white"
                required={isOpenSource}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !parsedData}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:disabled:bg-gray-600"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <FiUploadCloud size={20} />
              Publish App
            </>
          )}
        </button>
      </form>
    </div>
  );
}
