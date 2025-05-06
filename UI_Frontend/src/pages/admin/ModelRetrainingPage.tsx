import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, UploadCloud, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";

interface Metrics {
  accuracy: number;
  silhouette_score: number;
  f1_score: number;
  recall: number;
  precision: number;
}

const ModelRetrainingPage: React.FC = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [retrainLoading, setRetrainLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    accuracy: 0.83,
    silhouette_score: 0.02,
    f1_score: 0.88,
    recall: 0.96,
    precision: 0.82,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch metrics on component mount
  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get("/api/ml/metrics");
      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRetrain = async () => {
    setRetrainLoading(true);
    setUploadMsg("");
    try {
      const res = await axios.post("/api/ml/retrain");
      if (res.data.success) {
        setUploadMsg("Retrain successful!");
        // Update metrics with new values from response
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        } else {
          // If metrics not in response, fetch them
          fetchMetrics();
        }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Model Retraining Pipeline
          </h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Model Accuracy
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {(metrics.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Silhouette Score
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {metrics.silhouette_score.toFixed(2)}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div>
                <p className="text-sm font-medium text-gray-500">F1 Score</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {metrics.f1_score.toFixed(2)}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div>
                <p className="text-sm font-medium text-gray-500">Recall</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {metrics.recall.toFixed(2)}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md">
              <div>
                <p className="text-sm font-medium text-gray-500">Precision</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {metrics.precision.toFixed(2)}
                </p>
              </div>
            </Card>
          </div>

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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModelRetrainingPage;
