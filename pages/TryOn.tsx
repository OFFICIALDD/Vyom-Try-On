import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { generateTryOn } from '../services/geminiService';
import { useCart } from '../contexts/CartContext';
import { Camera, Upload, RefreshCw, ShoppingCart, Download, AlertCircle, X, Sparkles } from 'lucide-react';

const TryOn: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? db.getProductById(productId) : null;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load saved user image
  useEffect(() => {
    const saved = localStorage.getItem('vyom_user_model');
    if (saved) setUserImage(saved);
  }, []);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError("Could not access camera.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video to canvas
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setUserImage(dataUrl);
        localStorage.setItem('vyom_user_model', dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setUserImage(res);
        localStorage.setItem('vyom_user_model', res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTryOn = async () => {
    if (!userImage || !product) return;
    setLoading(true);
    setError(null);
    try {
      const generatedImage = await generateTryOn(userImage, product.image);
      setResultImage(generatedImage);
    } catch (err: any) {
      setError(err.message || "Failed to generate try-on. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="p-8 text-center">Product not found. <button onClick={() => navigate('/')} className="text-indigo-600">Go Home</button></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Vyom Virtual Try-On
            </h1>
            <p className="text-gray-400 mt-1">AI-Powered Fitting Room</p>
          </div>
          <button onClick={() => navigate('/')} className="mt-4 md:mt-0 text-sm text-gray-400 hover:text-white">
            &larr; Back to Shop
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. User Input */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-300">
              <span className="bg-indigo-900/50 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
              Your Photo
            </h2>
            
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 relative overflow-hidden min-h-[300px]">
              {isCameraOpen ? (
                 <>
                  <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-4 z-10 flex space-x-4">
                    <button onClick={capturePhoto} className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200">
                      <Camera className="h-6 w-6" />
                    </button>
                     <button onClick={stopCamera} className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                 </>
              ) : userImage ? (
                <>
                  <img src={userImage} alt="User" className="w-full h-full object-cover" />
                  <button onClick={() => setUserImage(null)} className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-black/80">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <p className="text-gray-500 mb-4">Upload a full body photo or use camera</p>
                  <div className="flex flex-col gap-3 w-full">
                    <button onClick={startCamera} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition w-full">
                      <Camera size={18} /> Use Camera
                    </button>
                    <div className="relative">
                       <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                       <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition w-full">
                        <Upload size={18} /> Upload Image
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Selected Product */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-purple-300">
               <span className="bg-purple-900/50 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
               Selected Item
            </h2>
            <div className="flex-grow flex flex-col bg-gray-900 rounded-lg p-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white mb-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{product.category}</p>
              <p className="text-xl font-mono text-purple-400">₹{product.price}</p>
            </div>
            <button 
              onClick={handleGenerateTryOn}
              disabled={loading || !userImage}
              className={`mt-6 w-full py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition ${
                loading || !userImage 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5" /> Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Generate Try-On
                </>
              )}
            </button>
          </div>

          {/* 3. Output */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl flex flex-col h-full relative">
             <h2 className="text-xl font-semibold mb-4 flex items-center text-green-300">
               <span className="bg-green-900/50 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
               AI Result
            </h2>
            <div className="flex-grow bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700 min-h-[300px]">
              {loading ? (
                <div className="text-center p-6 animate-pulse">
                  <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-indigo-300 font-medium">AI is stitching the fabric...</p>
                  <p className="text-xs text-gray-500 mt-2">This may take 5-10 seconds</p>
                </div>
              ) : resultImage ? (
                <img src={resultImage} alt="Try On Result" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Result will appear here</p>
                </div>
              )}
            </div>

            {resultImage && (
              <div className="mt-4 flex gap-3">
                 <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-white text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                 >
                   <ShoppingCart size={18} /> Add to Cart
                 </button>
                 <a 
                   href={resultImage} 
                   download={`vyom-tryon-${product.id}.jpg`}
                   className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center"
                 >
                   <Download size={18} />
                 </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TryOn;