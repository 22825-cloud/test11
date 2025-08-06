import { useState, useEffect, useCallback } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useRoboflow } from "@/hooks/useRoboflow";
import { RoboflowPhotoUpload } from "./RoboflowPhotoUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Camera, 
  CameraOff, 
  Download, 
  SwitchCamera,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Settings,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

export const CrackDetector = () => {
  const {
    videoRef,
    isActive: isCameraActive,
    error: cameraError,
    devices,
    selectedDeviceId,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame
  } = useCamera();

  const {
    configure: configureRoboflow,
    detectCracks,
    isConfigured: isRoboflowConfigured,
    isDetecting: isRoboflowDetecting,
    error: roboflowError
  } = useRoboflow();

  // Roboflow Configuration
  const [roboflowApiKey, setRoboflowApiKey] = useState("Ao2SRjCDmSKganFBnK3u");
  const [roboflowEndpoint, setRoboflowEndpoint] = useState("apex-crackai/2");
  const [roboflowThreshold, setRoboflowThreshold] = useState(0.4);
  const [isRoboflowConfiguring, setIsRoboflowConfiguring] = useState(false);

  // Configure Roboflow when settings change
  useEffect(() => {
    if (roboflowApiKey && roboflowEndpoint) {
      configureRoboflow({
        apiKey: roboflowApiKey,
        modelEndpoint: roboflowEndpoint,
        threshold: roboflowThreshold
      });
    }
  }, [roboflowApiKey, roboflowEndpoint, roboflowThreshold, configureRoboflow]);

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleStopCamera = () => {
    stopCamera();
  };

  const handleCapture = () => {
    const imageData = captureFrame();
    if (imageData) {
      // Create download link
      const link = document.createElement('a');
      link.download = `การวิเคราะห์รอยร้าว-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("บันทึกภาพสำเร็จ");
    } else {
      toast.error("ไม่สามารถบันทึกภาพได้");
    }
  };

  const handleRoboflowConfigSave = () => {
    if (!roboflowApiKey.trim() || !roboflowEndpoint.trim()) {
      toast.error("กรุณาใส่ API key และ model endpoint");
      return;
    }

    configureRoboflow({
      apiKey: roboflowApiKey.trim(),
      modelEndpoint: roboflowEndpoint.trim(),
      threshold: roboflowThreshold
    });
    setIsRoboflowConfiguring(false);
    toast.success("บันทึกการตั้งค่า Roboflow สำเร็จ!");
  };

  const getStatusIcon = () => {
    return <CheckCircle2 className="h-4 w-4 text-detection-confidence-high" />;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1437] via-[#181e41] to-[#2a2d4d] relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-[40%] bg-purple-600/40 blur-3xl opacity-80"></div>
        <div className="absolute left-1/3 top-2/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-[40%] bg-blue-500/30 blur-2xl opacity-60"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 pt-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-indigo-500 shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            ระบบตรวจจับรอยแตกด้วย AI
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            ระบบตรวจจับรอยแตกด้วยปัญญาประดิษฐ์ใช้เทคโนโลยี Roboflow สำหรับการวิเคราะห์รูปภาพแบบเรียลไทม์
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold hover:scale-105 transition-transform">
              เริ่มใช้งาน
            </Button>
            <Button variant="outline" className="border-blue-400 text-blue-200 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-900/30 hover:text-white transition">
              เอกสารการใช้งาน
            </Button>
          </div>
        </div>

        {/* Roboflow Configuration */}
        <Collapsible open={isRoboflowConfiguring} onOpenChange={setIsRoboflowConfiguring}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      การตั้งค่า Roboflow API
                    </CardTitle>
                    <CardDescription>
                      ตั้งค่า Roboflow API สำหรับการตรวจจับรอยแตก
                    </CardDescription>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isRoboflowConfiguring ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roboflowApiKey">API Key</Label>
                  <Input
                    id="roboflowApiKey"
                    type="password"
                    placeholder="API key ของคุณ"
                    value={roboflowApiKey}
                    onChange={(e) => setRoboflowApiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roboflowEndpoint">Model Endpoint</Label>
                  <Input
                    id="roboflowEndpoint"
                    placeholder="workspace/project/version"
                    value={roboflowEndpoint}
                    onChange={(e) => setRoboflowEndpoint(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    รูปแบบ: workspace/project/version (เช่น "my-workspace/crack-detection/1")
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roboflowThreshold">ความไว: {roboflowThreshold}</Label>
                  <Input
                    id="roboflowThreshold"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={roboflowThreshold}
                    onChange={(e) => setRoboflowThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button onClick={handleRoboflowConfigSave} className="w-full">
                  บันทึกการตั้งค่า
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Main Content - Tabs */}
        <Tabs defaultValue="camera" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="camera">กล้องแบบเรียลไทม์</TabsTrigger>
            <TabsTrigger value="upload">อัปโหลดรูปภาพ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Camera Feed */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      {isCameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Status */}
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                              <Camera className="h-4 w-4 text-white" />
                              <span className="text-white text-sm font-medium">
                                พร้อมใช้งาน - ใช้แท็บอัปโหลดเพื่อวิเคราะห์
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center space-y-4">
                            <Camera className="h-16 w-16 mx-auto opacity-50" />
                            <div>
                              <p className="text-lg font-medium">ภาพแสดงจากกล้อง</p>
                              <p className="text-sm">
                                เริ่มกล้องเพื่อดูตัวอย่าง (ใช้แท็บอัปโหลดสำหรับการตรวจจับ)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Camera Controls */}
                <div className="flex flex-wrap gap-3">
                  {!isCameraActive ? (
                    <Button 
                      onClick={handleStartCamera}
                      disabled={!!cameraError}
                      className="bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-transform"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      เริ่มกล้อง
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleStopCamera} variant="outline">
                        <CameraOff className="h-4 w-4 mr-2" />
                        หยุดกล้อง
                      </Button>
                      
                      <Button onClick={handleCapture} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        บันทึกภาพ
                      </Button>
                    </>
                  )}

                  {devices.length > 1 && (
                    <select 
                      value={selectedDeviceId} 
                      onChange={(e) => switchCamera(e.target.value)}
                      className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
                    >
                      {devices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `กล้อง ${device.deviceId.slice(0, 8)}...`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {cameraError && (
                  <Card className="border-blue-600/50 bg-blue-100/40 backdrop-blur-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-600">ข้อผิดพลาดกล้อง</h3>
                          <p className="text-sm text-blue-600/80 mt-1">{cameraError.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Info Panel */}
              <div className="space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">การตรวจจับด้วย Roboflow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">สถานะ:</span>
                      <Badge variant={isRoboflowConfigured ? 'default' : 'secondary'}>
                        {isRoboflowConfigured ? 'พร้อมใช้งาน' : 'ยังไม่ได้ตั้งค่า'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      การตรวจจับด้วย Roboflow ทำงานกับรูปภาพที่อัปโหลด ใช้แท็บ "อัปโหลดรูปภาพ" เพื่อวิเคราะห์ภาพด้วยการตรวจจับแบบ Instance Segmentation
                    </p>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">คำแนะนำการใช้งาน</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• ตั้งค่า Roboflow API ก่อนใช้งาน</p>
                    <p>• อนุญาตการใช้กล้องเมื่อมีการแจ้งเตือน</p>
                    <p>• ใช้แท็บ "อัปโหลดรูปภาพ" สำหรับการตรวจจับ</p>
                    <p>• บันทึกภาพเพื่อเก็บผลการวิเคราะห์</p>
                    <p>• รองรับการตรวจจับแบบ Instance Segmentation</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <RoboflowPhotoUpload 
              onDetect={detectCracks}
              isConfigured={isRoboflowConfigured}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};