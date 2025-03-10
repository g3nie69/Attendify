import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  lecturerId: string;
}

const GenerateQR: React.FC<Props> = ({ lecturerId }) => {
  const [unitId, setUnitId] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(5);
  const [qrLink, setQrLink] = useState("");
  const [units, setUnits] = useState<any[]>([]);
  const qrRef = useRef<HTMLDivElement>(null); // Reference to QR code container

  useEffect(() => {
    if (localStorage.getItem("lecturer_id")) {
      fetch(`https://attendify-5pet.onrender.com/api/lecturers/${localStorage.getItem("lecturer_id")}/units`)
        .then((response) => response.json())
        .then((data) => setUnits(data.units));
    }
  }, []);

  const generateQRCode = () => {
    if (!unitId) {
      alert("Please select a unit.");
      return;
    }
    const expiryDate = new Date(Date.now() + expiryMinutes * 60000).toISOString();
    const link = `http://attendify-five.vercel.app/mark-attendance?lecturer_id=${lecturerId}&unit_id=${unitId}&expiry=${encodeURIComponent(expiryDate)}`;
    setQrLink(link);
  };

  const downloadQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const image = canvas.toDataURL("image/png"); // Convert canvas to image
      const link = document.createElement("a");
      link.href = image;
      link.download = "qr_code.png"; // Download file as qr_code.png
      link.click();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Generate Attendance QR Code</h2>
      
      {/* Select unit ID */}
      <label className="block mb-2">Unit</label>
      <select
        value={unitId}
        onChange={(e) => setUnitId(e.target.value)}
        className="border p-2 mb-2 w-full"
      >
        <option value="">Select a unit</option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.unit_name}
          </option>
        ))}
      </select>

      {/* Expiry time input */}
      <label className="block mb-2">Expiry (minutes)</label>
      <input
        type="number"
        value={expiryMinutes}
        onChange={(e) => setExpiryMinutes(Math.max(1, parseInt(e.target.value)))}
        className="border p-2 mb-2 w-full"
      />

      <br />
      <button onClick={generateQRCode} className="bg-blue-600 text-white p-2 rounded">
        Generate QR Code
      </button>

      {/* Display QR Code */}
      {qrLink && (
        <div ref={qrRef} className="mt-4">
          <p>{qrLink}</p>
          <QRCodeCanvas value={qrLink} size={200} />
          <br />
            <button onClick={downloadQR} className="bg-blue-600 text-white p-2 rounded mt-2">
                Download QR Code
            </button>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;
