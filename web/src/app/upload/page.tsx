
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function UploadPrescription() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "SUCCESS" | "ERROR">("IDLE");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Only allow images
            if (!selectedFile.type.startsWith('image/')) {
                setErrorMessage("Please select an image file (JPG, PNG).");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                setErrorMessage("File size should be less than 5MB.");
                return;
            }

            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setErrorMessage("");
            setStatus("IDLE");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus("UPLOADING");
        setErrorMessage("");

        try {
            // 1. Upload to Supabase Storage
            const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('prescriptions') // Ensure this bucket exists!
                .upload(filename, file);

            if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

            // 2. Get Public URL
            const { data } = supabase.storage
                .from('prescriptions')
                .getPublicUrl(filename);

            const publicUrl = data.publicUrl;
            console.log("Uploaded Image URL:", publicUrl);

            // 3. Save Metadata to Backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/prescriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'guest-user', // Hardcoded for Guest Mode
                    image_url: publicUrl,
                    status: 'Pending'
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save prescription.");
            }

            setStatus("SUCCESS");

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/orders'); // Or create a dedicated track status page
            }, 2000);

        } catch (error: any) {
            console.error("Upload failed:", error);
            setStatus("ERROR");
            setErrorMessage(error.message || "Something went wrong.");
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setStatus("IDLE");
        setErrorMessage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            {/* Top Navigation */}
            <div className="h-12 w-full bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800 flex items-center px-4 justify-between sticky top-0 z-50 pt-2">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <span className="material-icons text-2xl">chevron_left</span>
                </button>
                <h1 className="text-lg font-semibold">Upload Prescription</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <main className="p-5 pb-32 space-y-6 max-w-md mx-auto">
                {/* Status Tracker (Visual only for now) */}
                <section className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between relative px-2">
                        {/* Line background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -translate-y-4 z-0"></div>

                        {/* Steps */}
                        <div className="relative flex flex-col items-center z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 transition-colors duration-500 ${status === 'SUCCESS' ? 'bg-green-500' : 'bg-primary'}`}>
                                <span className="material-icons text-sm">{status === 'SUCCESS' ? 'check' : 'cloud_upload'}</span>
                            </div>
                            <span className="text-[10px] font-medium text-primary">Upload</span>
                        </div>
                        <div className="relative flex flex-col items-center z-10 opacity-50">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 mb-2">
                                <span className="material-icons text-sm">hourglass_empty</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500">Review</span>
                        </div>
                        <div className="relative flex flex-col items-center z-10 opacity-50">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 mb-2">
                                <span className="material-icons text-sm">local_shipping</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500">Delivery</span>
                        </div>
                    </div>
                </section>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />

                {!file ? (
                    <>
                        {/* Instructions Panel */}
                        <section className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-icons text-blue-500 text-2xl">info</span>
                                <h2 className="text-sm font-bold text-blue-900 dark:text-blue-100">Upload Guidelines</h2>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Clear photo with visible doctor's name & date.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Ensure distinct handwriting visibility.</p>
                                </li>
                            </ul>
                        </section>

                        {/* Upload Action Area */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={triggerFileInput}
                                className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary transition-all group active:scale-95"
                            >
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-icons text-primary text-3xl">photo_camera</span>
                                </div>
                                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Take Photo</span>
                            </button>
                            <button
                                onClick={triggerFileInput}
                                className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary transition-all group active:scale-95"
                            >
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-icons text-primary text-3xl">collections</span>
                                </div>
                                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Gallery</span>
                            </button>
                        </div>
                    </>
                ) : (
                    /* Selected Image Preview */
                    <section className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-bold text-lg">Selected File</h3>
                            <button onClick={triggerFileInput} className="text-sm text-primary font-medium hover:underline">Change</button>
                        </div>

                        <div className="relative group">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 relative">
                                {previewUrl && (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                )}

                                {status === 'UPLOADING' && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity">
                                        <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mb-3"></div>
                                        <span className="text-xs font-semibold text-white tracking-wide">Uploading...</span>
                                    </div>
                                )}

                                {status === 'SUCCESS' && (
                                    <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center transition-opacity animate-fade-in">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg">
                                            <span className="material-icons text-green-500 text-4xl">check</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg">Upload Complete!</h3>
                                        <p className="text-white/80 text-xs mt-1">Redirecting...</p>
                                    </div>
                                )}
                            </div>

                            {status === 'IDLE' && (
                                <button
                                    onClick={removeFile}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-red-600 transition-colors"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            )}
                        </div>

                        {status === 'IDLE' && (
                            <div className="flex items-center gap-2 px-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-medium text-slate-500">Ready to upload</span>
                            </div>
                        )}
                    </section>
                )}

                {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/50">
                        <span className="material-icons text-lg">error_outline</span>
                        {errorMessage}
                    </div>
                )}
            </main>

            {/* Bottom Sticky CTA */}
            {file && status !== 'SUCCESS' && ( // Only show if file selected and not already done
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto z-40 animate-slide-up">
                    <button
                        onClick={handleUpload}
                        disabled={status === 'UPLOADING'}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === 'UPLOADING' ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>Submit Prescription</span>
                                <span className="material-icons">send</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">Average review time: 15 mins</p>
                </div>
            )}
        </div>
    );
}
