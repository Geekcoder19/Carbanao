
import React, { useState } from "react";
import "../../components/styles.css";
import Main from "../../components/Main.jsx";
import { useUser } from "../../context/UserContext"; // ✅ import global context

export default function Explore() {
  const [displayedCar, setDisplayedCar] = useState("");
  const [selectedSpoiler, setSelectedSpoiler] = useState("");
  const [selectedTyre, setSelectedTyre] = useState("");
  const [carColor, setCarColor] = useState("#ff0000");
  const [hoveredColor, setHoveredColor] = useState(null);

  // ✅ Access global user data
  const { user, userAnswers } = useUser();

  // ✅ Handle recommendation click
  const handleRecommendation = () => {
    if (!user) {
      console.warn("⚠️ No user logged in!");
      alert("Please log in first!");
      return;
    }

    if (!userAnswers || userAnswers.size === 0) {
      console.warn("⚠️ No answers found for this user!");
      alert("No answers found — please complete the questionnaire first!");
      return;
    }

    // Convert Map to object for easy viewing
    const answersObject = Object.fromEntries(userAnswers);
    console.log("🧠 User Answers (Global):", answersObject);
  };

  return (
    <div>
      {/* Control Panel */}
      <section className="control-panel">
        <div className="container_button">
          {/* Car Selector */}
          <div className="neu-container">
            <label htmlFor="car_list" className="neu-label">
              Select Car
            </label>
            <select
              id="car_list"
              value={displayedCar}
              onChange={(e) => setDisplayedCar(e.target.value)}
              className="neu-element"
            >
              <option value="">-- Select a Car --</option>

              <optgroup label="Honda">
                <option value="Civic">Civic</option>
                <option value="City">City</option>
              </optgroup>

              <optgroup label="Toyota">
                <option value="Corolla">Corolla</option>
                <option value="E">Corolla-E180</option>
              </optgroup>

              <optgroup label="Suzuki">
                <option value="Alto">Alto</option>
                <option value="Swift">Swift</option>
              </optgroup>
            </select>
          </div>

          {/* Spoiler Selector */}
          <div className="neu-container">
            <label htmlFor="spoiler_list" className="neu-label">
              Select Spoiler
            </label>
            <select
              id="spoiler_list"
              value={selectedSpoiler}
              onChange={(e) => setSelectedSpoiler(e.target.value)}
              className="neu-element"
            >
              <option value="">-- None --</option>
              <option value="spoiler1">Spoiler 1</option>
              <option value="spoiler2">Spoiler 2</option>
            </select>
          </div>

          {/* Tyre Selector */}
          <div className="neu-container">
            <label htmlFor="tyre_list" className="neu-label">
              Select Tyres
            </label>
            <select
              id="tyre_list"
              value={selectedTyre}
              onChange={(e) => setSelectedTyre(e.target.value)}
              className="neu-element"
            >
              <option value="None">-- None --</option>
              <option value="tyre1">Tyre 1</option>
              <option value="tyre2">Tyre 2</option>
              <option value="tyre3">Tyre 3</option>
            </select>
          </div>

          {/* Color Swatches */}
          <div className="neu-container">
            <label className="neu-label">Car Color</label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
              {[
                { name: "Default", value: "default" },
                { name: "Grey", value: "#808080" },
                { name: "Black", value: "#000000" },
                { name: "Maroon", value: "#800000" },
                { name: "White", value: "#FFFFFF" },
              ].map(({ name, value }) => {
                const isSelected = carColor === value;
                const isHovered = hoveredColor === value;

                return (
                  <div
                    key={value}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Select color ${name}`}
                      onClick={() => setCarColor(value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setCarColor(value);
                      }}
                      onMouseEnter={() => setHoveredColor(value)}
                      onMouseLeave={() => setHoveredColor(null)}
                      style={{
                        position: "relative",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background:
                          value === "default"
                            ? "linear-gradient(135deg, #bbb, #eee)"
                            : value,
                        cursor: "pointer",
                        border: isSelected ? "3px solid #fff" : "1px solid #ccc",
                        boxShadow: isSelected
                          ? "0 6px 24px rgba(0,0,0,0.35), 0 0 14px 4px rgba(255,255,255,0.85)"
                          : "0 2px 8px rgba(0,0,0,0.2)",
                        overflow: "hidden",
                        transition: "box-shadow 220ms ease, transform 160ms ease",
                        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>

                    <span
                      style={{
                        fontSize: "0.8rem",
                        marginTop: 4,
                        color: isSelected ? "#fff" : "#ccc",
                        textAlign: "center",
                      }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ✅ Separate Recommendation Button */}
          <div className="neu-container" style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              className="neu-element"
              style={{
                padding: "12px 28px",
                fontSize: "1rem",
                borderRadius: "25px",
                cursor: "pointer",
                background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
                boxShadow: "5px 5px 10px #b3b3b3, -5px -5px 10px #ffffff",
                border: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "3px 3px 6px #b3b3b3, -3px -3px 6px #ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "5px 5px 10px #b3b3b3, -5px -5px 10px #ffffff";
              }}
              onClick={handleRecommendation}
            >
              Recommendation
            </button>
          </div>
        </div>
      </section>

      {/* 3D Viewer */}
      <section style={{ height: "calc(100vh - 140px)", width: "100vw" }}>
        <Main
          selectedCar={displayedCar}
          selectedSpoiler={selectedSpoiler}
          selectedTyre={selectedTyre}
          carColor={carColor}
        />
      </section>
    </div>
  );
}
