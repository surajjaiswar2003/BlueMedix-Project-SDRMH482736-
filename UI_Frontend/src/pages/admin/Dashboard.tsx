import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Database,
  TrendingUp,
  FileText,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";

// Metrics interface
interface Metrics {
  accuracy?: number;
  f1_score?: number;
  precision?: number;
  recall?: number;
  silhouette_score?: number;
  confusion_matrix?: number[][];
}

interface AdminData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  adminLevel: string;
  role: string;
}

const API_BASE = "/api/ml"; // Change if needed

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [retrainLoading, setRetrainLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadMsg, setUploadMsg] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin authentication
  useEffect(() => {
    const adminDataStr = localStorage.getItem("admin");
    if (!adminDataStr) {
      navigate("/admin/login");
      return;
    }
    try {
      const admin: AdminData = JSON.parse(adminDataStr);
      if (!admin || admin.role !== "admin") {
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }
      setAdminData(admin);
      setIsLoading(false);
    } catch (error) {
      localStorage.removeItem("admin");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const res = await axios.get<{ metrics: Metrics }>(`${API_BASE}/metrics`);
      setMetrics(res.data.metrics);
    } catch (err) {
      setMetrics(null);
    }
  };
  useEffect(() => {
    fetchMetrics();
  }, []);

  // File upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadMsg("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMsg("Please select a file to upload.");
      return;
    }
    setUploadLoading(true);
    setUploadMsg("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post("/api/ml/upload_csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMsg("Upload successful: " + res.data.filename);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setUploadMsg(
        "Upload failed: " + (err.response?.data?.error || err.message)
      );
    }
    setUploadLoading(false);
  };

  // Retrain
  const handleRetrain = async () => {
    setRetrainLoading(true);
    setUploadMsg("");
    try {
      const res = await axios.post("/api/ml/retrain");
      if (res.data.success) {
        setUploadMsg("Retrain successful!");
        setMetrics(res.data.metrics);
      } else {
        setUploadMsg("Retrain failed: " + (res.data.error || "Unknown error"));
      }
    } catch (err: any) {
      setUploadMsg(
        "Retrain failed: " + (err.response?.data?.error || err.message)
      );
    }
    setRetrainLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          {adminData && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {adminData.firstName}!
              </h1>
              <p className="text-gray-500">Here's your system overview</p>
            </div>
          )}

          {/* Upload and retrain controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="border px-2 py-1 rounded"
              disabled={uploadLoading || retrainLoading}
            />
            <Button
              onClick={handleUpload}
              disabled={uploadLoading || retrainLoading}
              className="flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              {uploadLoading ? "Uploading..." : "Upload CSV"}
            </Button>
            <Button
              onClick={handleRetrain}
              disabled={retrainLoading || uploadLoading}
              className="flex items-center gap-2"
              variant="secondary"
            >
              <RefreshCw className={retrainLoading ? "animate-spin" : ""} />
              {retrainLoading ? "Retraining..." : "Retrain Model"}
            </Button>
          </div>
          {uploadMsg && (
            <div className="mb-4 text-sm text-blue-700 font-medium">
              {uploadMsg}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Model Accuracy
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {metrics?.accuracy !== undefined
                      ? (metrics.accuracy * 100).toFixed(2) + "%"
                      : "--"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">F1 Score</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {metrics?.f1_score !== undefined
                      ? metrics.f1_score.toFixed(3)
                      : "--"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Precision</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {metrics?.precision !== undefined
                      ? metrics.precision.toFixed(3)
                      : "--"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Recall</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {metrics?.recall !== undefined
                      ? metrics.recall.toFixed(3)
                      : "--"}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Confusion Matrix & Silhouette */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-bold mb-2">Confusion Matrix</h2>
              {metrics?.confusion_matrix ? (
                <table className="w-full text-center border">
                  <tbody>
                    {metrics.confusion_matrix.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-4 border">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>--</p>
              )}
            </Card>
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-bold mb-2">Silhouette Score</h2>
              <p className="text-3xl font-semibold text-gray-900">
                {metrics?.silhouette_score !== undefined
                  ? metrics.silhouette_score.toFixed(4)
                  : "--"}
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
