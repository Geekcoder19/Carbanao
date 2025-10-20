


import React, { useState } from "react";
import "../../components/styles.css";
import Main from "../../components/Main.jsx";
import { useUser } from "../../context/UserContext";

export default function Explore() {
  const { user, userAnswers } = useUser();

  const [config, setConfig] = useState({
    displayedCar: "",
    selectedSpoiler: "",
    selectedTyre: "None",
    carColor: "#ff0000",
  });

  const [textRecommendations, setTextRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setTextRecommendations(null);
  };

  const handleGetRecommendations = async () => {
    if (!user) {
      alert("Please log in to get personalized recommendations.");
      return;
    }
    if (userAnswers.size === 0) {
      alert("We don't have your preferences yet! Please sign up or update your profile.");
      return;
    }

    setIsLoading(true);
    setTextRecommendations(null);

    const API_URL = "http://localhost:5000/api/recommendations";

    // ✅ FIX: The userAnswers map already has the correct keys and values (1 or 0).
    // We just need to convert the Map to a plain object.
    const mlFeatures = Object.fromEntries(userAnswers);
    
    // The faulty loop that converted "Yes"/"No" has been removed.

    console.log("🚀 Sending this payload to the AI model:", mlFeatures);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mlFeatures),
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();

      if (data.success) {
        const recommendations = [];
        const predictions = data.predictions;

        if (predictions.P1_Modifications === 1) {
          recommendations.push("✅ New <b>Tyres/Rims</b>: Based on your preferences, a new set of rims would be a great fit!");
        }
        if (predictions.P2_Modifications === 1) {
          recommendations.push("✅ Custom <b>Paint/Color</b>: A custom wrap or paint job is highly recommended for you.");
        }
        if (predictions.P3_Modification === 1) {
          recommendations.push("✅ New <b>Spoiler/Bodykit</b>: You might like the aggressive look of our 'Aero Wing' spoiler.");
        }
        if (recommendations.length === 0) {
          recommendations.push("🤔 Your preferences suggest you like the stock look. No major mods recommended!");
        }
        setTextRecommendations(recommendations);
      } else {
        throw new Error(data.error || "Prediction failed");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setTextRecommendations(["❌ Error: Could not connect to the recommendation API."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelect = (value) => updateConfig("carColor", value);
  const handleSpoilerSelect = (e) => updateConfig("selectedSpoiler", e.target.value);
  const handleTyreSelect = (e) => updateConfig("selectedTyre", e.target.value);

  return (
    <div>
        <section className="control-panel">
            <div className="container_button">
                {/* Car Selector */}
                <div className="neu-container">
                    <label htmlFor="car_list" className="neu-label">Select Car</label>
                    <select id="car_list" value={config.displayedCar} onChange={(e) => updateConfig("displayedCar", e.target.value)} className="neu-element">
                        <option value="">-- Select a Car --</option>
                        <optgroup label="Honda"><option value="Civic">Civic</option><option value="City">City</option></optgroup>
                        <optgroup label="Toyota"><option value="Corolla">Corolla</option><option value="E">Corolla-E180</option></optgroup>
                        <optgroup label="Suzuki"><option value="Alto">Alto</option><option value="Swift">Swift</option></optgroup>
                    </select>
                </div>
                {/* Other selectors... */}
                <div className="neu-container">
                    <label htmlFor="spoiler_list" className="neu-label">Select Spoiler</label>
                    <select id="spoiler_list" value={config.selectedSpoiler} onChange={handleSpoilerSelect} className="neu-element"><option value="">-- None --</option><option value="spoiler1">Spoiler 1</option><option value="spoiler2">Spoiler 2</option></select>
                </div>
                <div className="neu-container">
                    <label htmlFor="tyre_list" className="neu-label">Select Tyres</label>
                    <select id="tyre_list" value={config.selectedTyre} onChange={handleTyreSelect} className="neu-element"><option value="None">-- None --</option><option value="tyre1">Tyre 1</option><option value="tyre2">Tyre 2</option><option value="tyre3">Tyre 3</option></select>
                </div>
                <div className="neu-container">
                    <label className="neu-label">Car Color</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    {[ { name: "Default", value: "#ff0000" }, { name: "Grey", value: "#808080" }, { name: "Black", value: "#000000" }, { name: "Maroon", value: "#800000" }, { name: "White", value: "#FFFFFF" }, { name: "Blue", value: "#0000ff" } ].map(({ name, value }) => {
                        const isSelected = config.carColor === value; const isHovered = hoveredColor === value;
                        return ( <div key={value} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div role="button" tabIndex={0} aria-label={`Select color ${name}`} onClick={() => handleColorSelect(value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleColorSelect(value); }} onMouseEnter={() => setHoveredColor(value)} onMouseLeave={() => setHoveredColor(null)} style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: value, cursor: "pointer", border: isSelected ? "3px solid #fff" : "1px solid #ccc", boxShadow: isSelected ? "0 6px 24px rgba(0,0,0,0.35), 0 0 14px 4px rgba(255,255,255,0.85)" : "0 2px 8px rgba(0,0,0,0.2)", transition: "box-shadow 220ms ease, transform 160ms ease", transform: isHovered ? "translateY(-2px)" : "translateY(0)" }}></div>
                            <span style={{ fontSize: "0.8rem", marginTop: 4, color: isSelected ? "#fff" : "#ccc" }}>{name}</span>
                        </div> );
                    })}
                    </div>
                </div>
                {/* Recommendation Button */}
                <div className="neu-container" style={{ marginTop: "20px" }}>
                    <button onClick={handleGetRecommendations} disabled={isLoading || !user} className="neu-element" style={{ background: isLoading ? "#888" : "#007bff", color: "white", cursor: !user ? "not-allowed" : "pointer", opacity: !user ? 0.6 : 1, }}>
                        {isLoading ? "Analyzing..." : "✨ Get Personalized Recommendations"}
                    </button>
                </div>
                {/* Recommendation Results */}
                {textRecommendations && (
                    <div className="neu-container" style={{ marginTop: "15px", border: "1px solid #ddd", padding: "15px" }}>
                        <h4 className="neu-label" style={{ marginTop: 0 }}>Suggested Mods:</h4>
                        <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                            {textRecommendations.map((rec, index) => ( <li key={index} style={{ marginBottom: "8px", fontSize: "0.95rem" }} > <span dangerouslySetInnerHTML={{ __html: rec }} /> </li> ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>

        <section style={{ height: "calc(100vh - 140px)", width: "100vw" }}>
            {config.displayedCar && ( <Main key={config.displayedCar} selectedCar={config.displayedCar} selectedSpoiler={config.selectedSpoiler} selectedTyre={config.selectedTyre} carColor={config.carColor} /> )}
        </section>
    </div>
  );
}