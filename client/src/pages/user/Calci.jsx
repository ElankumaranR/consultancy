import React, { useState } from "react";
import Navbar from "./Navbar";

const Calci = () => {
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [thickness, setThickness] = useState(0.125); // in meters
  const [spacing, setSpacing] = useState(150); // in mm
  const [diameter, setDiameter] = useState(8); // mm
  const [cover, setCover] = useState(25); // mm
  const [result, setResult] = useState(null);

  const ROD_LENGTH = 12; // meters
  const WASTAGE_PERCENT = 5;

  const calculate = () => {
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const t = parseFloat(thickness);
    const s = parseFloat(spacing);
    const d = parseFloat(diameter);
    const c = parseFloat(cover);

    if (!l || !b || !t || !s || !d || !c) {
      setResult(null);
      return;
    }

    // Convert to meters
    const spacingM = s / 1000;
    const coverM = c / 1000;

    // Effective length after cover
    const effLength = l - 2 * coverM;
    const effBreadth = b - 2 * coverM;

    // Number of rods
    const rodsLengthwise = Math.ceil(effBreadth / spacingM);
    const rodsBreadthwise = Math.ceil(effLength / spacingM);

    // Length of each rod in the other direction
    const totalLengthL = rodsLengthwise * effLength;
    const totalLengthB = rodsBreadthwise * effBreadth;

    const totalLength = totalLengthL + totalLengthB;
    const totalLengthWithWastage = totalLength * (1 + WASTAGE_PERCENT / 100);
    const totalRods = Math.ceil(totalLengthWithWastage / ROD_LENGTH);

    setResult({
      totalRods,
      rodsLengthwise,
      rodsBreadthwise,
      totalLengthWithWastage: totalLengthWithWastage.toFixed(2),
      spacing: s,
      diameter: d,
      thickness: t,
      cover: c,
    });
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Steel Rod Estimator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Room Length (m)</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Room Breadth (m)</label>
          <input
            type="number"
            value={breadth}
            onChange={(e) => setBreadth(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Slab Thickness (m)</label>
          <input
            type="number"
            value={thickness}
            step="0.01"
            onChange={(e) => setThickness(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Spacing between rods (mm)</label>
          <input
            type="number"
            value={spacing}
            onChange={(e) => setSpacing(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>TMT Rod Diameter (mm)</label>
          <select
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value={8}>8 mm</option>
            <option value={10}>10 mm</option>
            <option value={12}>12 mm</option>
            <option value={16}>16 mm</option>
          </select>
        </div>
        <div>
          <label>Concrete Cover (mm)</label>
          <input
            type="number"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-green-600 text-white py-3 mt-4 rounded hover:bg-green-700"
      >
        Calculate Rod Requirement
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-inner">
          <h3 className="text-xl font-semibold mb-2">Result Summary</h3>
          <p><strong>Total Rods Needed:</strong> {result.totalRods}</p>
          <p><strong>Lengthwise Rods:</strong> {result.rodsLengthwise}</p>
          <p><strong>Breadthwise Rods:</strong> {result.rodsBreadthwise}</p>
          <p><strong>Total Rod Length (with 5% wastage):</strong> {result.totalLengthWithWastage} m</p>
          <p><strong>Rod Diameter:</strong> {result.diameter} mm</p>
          <p><strong>Rod Spacing:</strong> {result.spacing} mm</p>
          <p><strong>Concrete Cover:</strong> {result.cover} mm</p>
          <p><strong>Slab Thickness:</strong> {result.thickness} m</p>
        </div>
      )}
    </div>
    </>
  );
};

export default Calci;
