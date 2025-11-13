"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export function useReceiptOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const detectLanguage = (text) => {
    const hungarianChars = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g;
    const hungarianCount = (text.match(hungarianChars) || []).length;
    return hungarianCount > text.length * 0.05 ? "hun" : "eng";
  };

  const processReceipt = async (file) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            setProgress(10);
            console.log("[OCR] Starting Tesseract...");

            
            const quickScan = await Tesseract.recognize(e.target.result, "eng+hun", {
              logger: (m) => {
                if (m.status === "recognizing text") {
                  setProgress(Math.round(10 + m.progress * 20));
                }
              },
            });

            const detectedLanguage = detectLanguage(quickScan.data.text);
            console.log("[OCR] Detected language:", detectedLanguage);

            // ezt még megnézni mert nem jól műkdöik
            const languageCode = detectedLanguage === "hun" ? "hun+eng" : "eng";
            console.log("[OCR] Using language code:", languageCode);

            const { data: { text } } = await Tesseract.recognize(
              e.target.result,
              languageCode,
              {
                logger: (m) => {
                  if (m.status === "recognizing text") {
                    setProgress(Math.round(30 + m.progress * 20));
                  }
                },
              }
            );

            console.log("[OCR] Tesseract done, text length:", text.length);
            setProgress(50);

            // 3. AI Parsing
            console.log("[OCR] Calling AI API...");
            setProgress(70);

            const response = await fetch("/api/receipt/parse", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text }),
            });

            console.log("[OCR] API response status:", response.status);

            if (!response.ok) {
              const errorData = await response.json();
              console.error("[OCR] API error:", errorData);

              let errorMessage = "Failed to parse receipt with AI";
              if (errorData.isQuotaError) {
                errorMessage =
                  "OpenAI API quota exceeded. Please use manual entry or check your billing.";
              } else if (errorData.error) {
                errorMessage = errorData.error;
              }

              throw new Error(errorMessage);
            }

            const parsedData = await response.json();
            console.log("[OCR] Parsed data:", parsedData);

            setProgress(100);

            resolve({
              merchant: parsedData.merchant || "Receipt",
              amount: parsedData.amount || 0,
              currency: parsedData.currency || "HUF",
              items: parsedData.items || [],
              suggestedCategory: parsedData.suggestedCategory || "Other",
              categoryConfidence: parsedData.categoryConfidence || 0.5,
              categoryReason: parsedData.categoryReason || "",
              confidence: 0.85,
              rawText: text,
            });
          } catch (error) {
            console.error("[OCR] Error:", error.message);
            reject(error);
          } finally {
            setIsProcessing(false);
            setProgress(0);
          }
        };

        reader.onerror = () => {
          console.error("[OCR] FileReader error");
          setIsProcessing(false);
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("[OCR] Outer error:", error);
      setIsProcessing(false);
      setProgress(0);
      throw error;
    }
  };

  return { processReceipt, isProcessing, progress };
}
