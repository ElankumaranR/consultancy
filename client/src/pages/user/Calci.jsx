import React, { useState } from "react";
import Navbar from "./Navbar";

const Calci = () => {
  // Room length in feet and inches separately
  const [lengthFeet, setLengthFeet] = useState("");
  const [lengthInches, setLengthInches] = useState("");

  // Room breadth in feet and inches separately
  const [breadthFeet, setBreadthFeet] = useState("");
  const [breadthInches, setBreadthInches] = useState("");

  // Other params all in inches
  const [thickness, setThickness] = useState(1.5); // inches (default slab thickness)
  const [spacing, setSpacing] = useState(6); // inches (spacing between rods)
  const [diameter, setDiameter] = useState(8); // mm (we keep diameter in mm since rods come in mm)
  const [cover, setCover] = useState(1); // inches (concrete cover)

  const [result, setResult] = useState(null);

  const ROD_LENGTH_FEET = 40; // Rod length standard = 40 feet (approx 12 meters)
  const WASTAGE_PERCENT = 5;

  // Helper to convert feet + inches to total inches
  const feetInchesToInches = (feet, inches) => {
    return (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0);
  };

  // Helper to convert inches to feet (decimal feet)
  const inchesToFeet = (inches) => {
    return inches / 12;
  };

  const calculate = () => {
    const l = feetInchesToInches(lengthFeet, lengthInches);
    const b = feetInchesToInches(breadthFeet, breadthInches);
    const t = parseFloat(thickness);
    const s = parseFloat(spacing);
    const d = parseFloat(diameter);
    const c = parseFloat(cover);

    if (!l || !b || !t || !s || !d || !c) {
      setResult(null);
      return;
    }

    // Effective length after subtracting concrete cover on both sides (in inches)
    const effLength = l - 2 * c;
    const effBreadth = b - 2 * c;

    // Number of rods (round up)
    const rodsLengthwise = Math.ceil(effBreadth / s);
    const rodsBreadthwise = Math.ceil(effLength / s);

    // Total rod length in inches
    const totalLengthL = rodsLengthwise * effLength;
    const totalLengthB = rodsBreadthwise * effBreadth;

    const totalLengthInches = totalLengthL + totalLengthB;

    // Add wastage
    const totalLengthWithWastageInches = totalLengthInches * (1 + WASTAGE_PERCENT / 100);

    // Convert rod length from feet to inches for calculation
    const rodLengthInches = ROD_LENGTH_FEET * 12;

    // Number of rods needed
    const totalRods = Math.ceil(totalLengthWithWastageInches / rodLengthInches);

    setResult({
      totalRods,
      rodsLengthwise,
      rodsBreadthwise,
      totalLengthWithWastageFeet: inchesToFeet(totalLengthWithWastageInches).toFixed(2),
      spacing: s,
      diameter: d,
      thickness: t,
      cover: c,
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
        <h2 className="text-3xl font-bold mb-4 text-center">Steel Rod Estimator (Feet & Inches)</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label>Room Length (feet)</label>
            <input
              type="number"
              value={lengthFeet}
              onChange={(e) => setLengthFeet(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
            />
          </div>
          <div>
            <label>Room Length (inches)</label>
            <input
              type="number"
              value={lengthInches}
              onChange={(e) => setLengthInches(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
              max="11"
            />
          </div>
          <div>
            <label>Room Breadth (feet)</label>
            <input
              type="number"
              value={breadthFeet}
              onChange={(e) => setBreadthFeet(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
            />
          </div>
          <div>
            <label>Room Breadth (inches)</label>
            <input
              type="number"
              value={breadthInches}
              onChange={(e) => setBreadthInches(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
              max="11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Slab Thickness (inches)</label>
            <input
              type="number"
              value={thickness}
              step="0.01"
              onChange={(e) => setThickness(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
            />
          </div>
          <div>
            <label>Spacing between rods (inches)</label>
            <input
              type="number"
              value={spacing}
              onChange={(e) => setSpacing(e.target.value)}
              className="w-full border p-2 rounded"
              min="1"
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
            <label>Concrete Cover (inches)</label>
            <input
              type="number"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full border p-2 rounded"
              min="0"
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
            <p><strong>Total Rod Length (with 5% wastage):</strong> {result.totalLengthWithWastageFeet} ft</p>
            <p><strong>Rod Diameter:</strong> {result.diameter} mm</p>
            <p><strong>Rod Spacing:</strong> {result.spacing} in</p>
            <p><strong>Concrete Cover:</strong> {result.cover} in</p>
            <p><strong>Slab Thickness:</strong> {result.thickness} in</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Calci;
