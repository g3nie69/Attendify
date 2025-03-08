import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  lecturerId: string;
}

const GenerateQR: React.FC<Props> = ({ lecturerId }) => {
  const [unitId, setUnitId] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(5);
  const [qrLink, setQrLink] = useState("");

  const generateQRCode = () => {
    if (!unitId) {
      alert("Please select a unit.");
      return;
    }
    const expiryDate = new Date(Date.now() + expiryMinutes * 60000).toISOString();
    const link = `http://10.104.111.69:5173/mark-attendance?lecturer_id=${lecturerId}&unit_id=${unitId}&expiry=${encodeURIComponent(expiryDate)}`;
    setQrLink(link);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Generate Attendance QR Code</h2>
      <input
        type="text"
        placeholder="Enter Unit ID"
        value={unitId}
        onChange={(e) => setUnitId(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        value={expiryMinutes}
        onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={generateQRCode} className="bg-blue-600 text-white p-2 rounded">
        Generate QR Code
      </button>
      {qrLink && <QRCodeCanvas value={qrLink} size={150} />}
    </div>
  );
};

export default GenerateQR;
