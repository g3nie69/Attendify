import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  lecturerId: string;
}

const GenerateQR: React.FC<Props> = ({ lecturerId }) => {
  const [unitId, setUnitId] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(5);
  const [qrLink, setQrLink] = useState("");

  const [units, setUnits] = useState<any[]>([]);

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
    const link = `http://localhost:5173/mark-attendance?lecturer_id=${lecturerId}&unit_id=${unitId}&expiry=${encodeURIComponent(expiryDate)}`;
    setQrLink(link);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Generate Attendance QR Code</h2>
    {/* select unit id based on unit name */}
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
      <label className="block mb-2">Expiry (minutes)</label>
      <input
        type="number"
        value={expiryMinutes}
        onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={generateQRCode} className="bg-blue-600 text-white p-2 rounded">
        Generate QR Code
      </button>
      {/* <p>{qrLink}</p> */}
      {qrLink && <QRCodeCanvas value={qrLink} size={150} />}
    </div>
  );
};

export default GenerateQR;
