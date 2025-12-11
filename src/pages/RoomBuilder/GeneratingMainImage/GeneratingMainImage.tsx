import React, { useEffect, useRef, useState } from "react";

type Mode = "upload" | "prompt";

export const GeneratingMainImage = () => {
    const [mode, setMode] = useState<Mode>("upload");
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewSrc(String(reader.result));
        };
        reader.onerror = () => {
            setError("Failed to read file.");
        };
        reader.readAsDataURL(f);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim() }),
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `Status ${res.status}`);
            }
            const data = await res.json();
            // Accept either a URL or base64 field
            if (data.imageUrl) {
                setPreviewSrc(data.imageUrl);
            } else if (data.imageBase64) {
                // assume imageBase64 already has data:image/... prefix or just raw base64
                const src = data.imageBase64.startsWith("data:")
                    ? data.imageBase64
                    : `data:image/png;base64,${data.imageBase64}`;
                setPreviewSrc(src);
            } else {
                throw new Error("No image returned");
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Failed to generate image");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setPreviewSrc(null);
        setPrompt("");
        setError(null);
        // clear file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
            <h2 style={{ marginBottom: 12 }}>Main Image</h2>

            {/* Preview */}
            <div
                aria-label="Image preview"
                style={{
                    width: "100%",
                    maxWidth: 720,
                    height: 420,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                    overflow: "hidden",
                    marginBottom: 16,
                }}>
                {previewSrc ? (
                    <img
                        src={previewSrc}
                        alt="Preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                ) : (
                    <div style={{ color: "#6b7280", textAlign: "center" }}>
                        <p style={{ margin: 0 }}>No image selected</p>
                        <p style={{ margin: 0, fontSize: 13 }}>Upload or generate an image below</p>
                    </div>
                )}
            </div>

            {/* Form */}
            <div style={{ width: "100%", maxWidth: 720 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                        }}>
                        <input
                            type="radio"
                            name="mode"
                            checked={mode === "upload"}
                            onChange={() => setMode("upload")}
                        />
                        <span>Upload</span>
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                        }}>
                        <input
                            type="radio"
                            name="mode"
                            checked={mode === "prompt"}
                            onChange={() => setMode("prompt")}
                        />
                        <span>Prompt</span>
                    </label>
                </div>

                {mode === "upload" ? (
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <button
                            onClick={handleUploadClick}
                            style={{
                                padding: "10px 14px",
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                            }}>
                            Choose image
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={!previewSrc}
                            style={{
                                padding: "10px 12px",
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                                cursor: "pointer",
                            }}>
                            Clear
                        </button>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                            flexDirection: "column",
                        }}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to generate..."
                            rows={4}
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                                resize: "vertical",
                            }}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                style={{
                                    padding: "10px 14px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                }}>
                                {loading ? "Generating..." : "Generate"}
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={loading && !previewSrc}
                                style={{
                                    padding: "10px 12px",
                                    background: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                }}>
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {error && <div style={{ marginTop: 12, color: "#b91c1c" }}>{error}</div>}
            </div>
        </div>
    );
};
