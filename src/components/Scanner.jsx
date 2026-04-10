import { Html5Qrcode } from "html5-qrcode";
import React, { useRef, useState } from "react";
import Output from "./Output.jsx";

const Scanner = () => {
  const scannerRef = useRef(null);
  const [scanResult, setScanResult] = useState("");

  const startScan = () => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await scanner.stop();
          scanner.clear();
          scannerRef.current = null;

          handleProduct(decodedText);
        },
        (err) => {
          console.log("Scan error:", err);
        }
      )
      .catch((err) => {
        console.log("Camera start failed:", err);
      });
  };

  const handleProduct = async (barcode) => {
    try {
      const res = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}`
      );
      const data = await res.json();

      const haramWords = [
        "pork",
        "alcohol",
        "bacon",
        "ham",
        "lard",
        "wine",
        "beer",
        "rum",
      ];

      const ingredients = data?.product?.ingredients_text;

      if (!ingredients) {
        setScanResult("⚠ Ingredients not available");
        return;
      }

      const list = ingredients.toLowerCase().split(",").map((i) => i.trim());

      const isHaram = list.some((item) =>
        haramWords.includes(item)
      );

      setScanResult(
        isHaram ? "❌ Not Halal" : "✅ Halal Product"
      );
    } catch (err) {
      console.log(err);
      setScanResult("❌ Product not found");
    }
  };

  return (
    <div className="bg-green-900 p-6 rounded-2xl shadow-xl border border-green-700 flex flex-col items-center">
      
      <h1 className="text-2xl font-bold text-green-100 mb-4">
        Halal Scanner
      </h1>

      <div
        id="reader"
        className="w-[320px] h-[240px] bg-black rounded-lg overflow-hidden border border-green-600"
      ></div>

      <button
        onClick={startScan}
        className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
      >
        Start Scan
      </button>

      <Output output={scanResult} />
    </div>
  );
};

export default Scanner;