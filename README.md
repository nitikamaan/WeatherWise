# WeatherWise

We are building a **personalized weather risk dashboard** using NASA Earth observation data.

Unlike conventional apps that offer **short-term forecasts (1–14 days)**, our app provides the **historical probability** of encountering **extreme weather conditions** (very hot, cold, wet, windy, or uncomfortable) at a **specific location and date**, based on decades of NASA data.

### **Why?**

- People planning **vacations, hikes, outdoor events, or fishing trips** months in advance need to know the *odds* of bad weather.
- Rather than forecasting, we leverage **historical patterns** to answer:
    
    > "What are the chances of very hot or very wet weather if I go here on this date?"
    > 

### **Core Idea**

- Input → Location (pin on map) + Date.
- Output → Probability of each condition (%) and trend analysis (is it getting worse?).
- Backend → Preprocess NASA datasets into probability tables and store in Supabase.
- Frontend → Dashboard with map, graphs, and clear text insights.
- Users can **export results** (CSV/JSON).

### **Key Features for MVP**

1. **Pin-drop map + calendar** → select location & date.
2. **Probabilities displayed** → e.g., "65% chance very hot, 40% chance very wet."
3. **Graph** → show probability trends for ±2 weeks around selected date.
4. **Download option** → JSON/CSV of results.

### **Constraints**

- This is **not** a live forecast system.
- We rely on **NASA's historical climate data** (e.g., POWER API for MVP).
- Heavy datasets must be **preprocessed offline** into compact tables before loading into Supabase.

---

## **Domain Responsibilities**

### 1. **Data Pipeline Team (Python / Data Science)**

- Pull historical NASA data (POWER, MERRA-2, GPM).
- Preprocess into **day-of-year probability tables**.
- Define thresholds (very hot, very wet, etc.).
- Generate **trend analysis** (decade shifts).
- Push cleaned data into Supabase (ETL scripts).

### 2. **Backend/API Team (Supabase + Postgres + PostGIS)**

- Design database schema for probabilities (lat/lon/day-of-year).
- Enable **location queries** (nearest grid).
- Expose Supabase REST/GraphQL endpoints.
- Implement **Auth + User Profiles** (optional but useful).
- Manage file storage (download CSV/JSON).

### 3. **Frontend/UI/UX Team (React/Next.js)**

- Build **dashboard**:
    - Map input (drop pin).
    - Date picker.
    - Cards showing % probabilities.
    - Graphs (probability vs. date).
- Integrate with Supabase API.
- Data visualization (Chart.js, Recharts, D3).
- Export button (download JSON/CSV).
- Ensure **responsive design** for mobile users.

### 4. **Project Lead / Integrator**

- Keeps all 3 domains aligned.
- Ensures data pipeline is loaded into Supabase before frontend queries.
- Coordinates schema changes between backend + frontend.
- Prepares demo script (user flow: drop pin → select date → see odds).
