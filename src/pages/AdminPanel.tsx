import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppInfoParser from "app-info-parser";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { FiUploadCloud, FiCheckCircle, FiTrash2, FiActivity, FiDownload, FiStar } from "react-icons/fi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Upload state
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Analytics state
  const [apps, setApps] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "apps"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApps(appsData);
      setAppsLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const analytics = useMemo(() => {
    const totalApps = apps.length;
    const totalDownloads = apps.reduce((sum, app) => sum + (app.totalDownloads || 0), 0);
    // Weighted average
    let totalRatingsSum = 0;
    let totalRatingsCount = 0;
    apps.forEach(app => {
      if (app.totalRatings) {
        totalRatingsCount += app.totalRatings;
        totalRatingsSum += app.averageRating * app.totalRatings;
      }
    });
    const avgRating = totalRatingsCount > 0 ? (totalRatingsSum / totalRatingsCount).toFixed(1) : "0.0";
    
    // Bar chart data
    const topAppsByDownload = [...apps].sort((a, b) => (b.totalDownloads || 0) - (a.totalDownloads || 0)).slice(0, 10);
    const chartData = topAppsByDownload.map(app => ({
      name: app.title.length > 12 ? app.title.substring(0, 10) + '...' : app.title,
      downloads: app.totalDownloads || 0
    }));

    return { totalApps, totalDownloads, avgRating, chartData };
  }, [apps]);

  if (loading) return null;
  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
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
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage applications and view platform analytics.</p>
      </div>

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

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-900/50 border dark:border-gray-800">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Analytics</TabsTrigger>
          <TabsTrigger value="publish" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Publish App</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 animate-in fade-in duration-300">
          {appsLoading ? (
            <div className="h-40 flex items-center justify-center text-gray-500">Loading metrics...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="dark:bg-gray-950">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FiActivity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalApps}</div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-gray-950">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                    <FiDownload className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalDownloads.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-gray-950">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Avg Rating</CardTitle>
                    <FiStar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.avgRating} / 5.0</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="dark:bg-gray-950">
                <CardHeader>
                  <CardTitle>Top Apps by Downloads</CardTitle>
                  <CardDescription>Most downloaded apps across the hub</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {analytics.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="downloads" fill="#000000" radius={[4, 4, 0, 0]} className="dark:fill-white" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">Not enough data to display chart</div>
                  )}
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-950">
                <CardHeader>
                  <CardTitle>Published Apps</CardTitle>
                  <CardDescription>Manage your current application listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>App</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead className="text-right">Downloads</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                            No apps found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        apps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <img src={app.logoUrl || "https://placehold.co/40x40/png"} alt="" className="h-8 w-8 rounded-md object-cover" />
                                {app.title}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-500">{app.packageName}</TableCell>
                            <TableCell className="text-right">{app.totalDownloads || 0}</TableCell>
                            <TableCell className="text-right">
                              {Number(app.averageRating || 0).toFixed(1)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="publish" className="space-y-4 animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="dark:bg-gray-950">
              <CardHeader>
                <CardTitle>App Binaries & Assets</CardTitle>
                <CardDescription>Upload your APK and visual assets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apk">APK File</Label>
                  <Input id="apk" type="file" accept=".apk" onChange={handleApkSelect} required className="cursor-pointer" />
                  {parsedData && (
                    <div className="mt-2 rounded-md bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900 border dark:border-gray-800">
                      <p>Package: <span className="font-mono text-black dark:text-white">{parsedData.packageName}</span></p>
                      <p>Version: <span className="font-mono text-black dark:text-white">{parsedData.versionName} ({parsedData.versionCode})</span></p>
                      <p>Min SDK: <span className="font-mono text-black dark:text-white">{parsedData.minSdk}</span></p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo">App Logo</Label>
                    <Input id="logo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} required className="cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="screenshots">Screenshots</Label>
                    <Input id="screenshots" type="file" accept="image/*" multiple onChange={(e) => setScreenshotFiles(e.target.files)} required className="cursor-pointer" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-950">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>Application details and open-source information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Productivity, Utility" required />
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id="oss" 
                    checked={isOpenSource} 
                    onCheckedChange={(checked) => setIsOpenSource(checked as boolean)} 
                  />
                  <Label htmlFor="oss" className="font-medium">Open Source Software</Label>
                </div>

                {isOpenSource && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="repo">Repository URL</Label>
                    <Input id="repo" type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/..." required={isOpenSource} />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={uploading || !parsedData} className="w-full h-11">
                  {uploading ? "Publishing..." : <><FiUploadCloud className="mr-2" /> Publish App</>}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
