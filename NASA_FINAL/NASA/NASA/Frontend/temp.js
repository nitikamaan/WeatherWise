// Dummy temperature data for demonstration
function generateDummyData(days = 1) {
  const data = [];
  const now = new Date();
  
  // Always use daily data points (24-hour intervals)
  for (let i = days - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    // Set to noon for consistent daily readings
    time.setHours(12, 0, 0, 0);
    
    // Generate realistic temperature with seasonal variation
    const dayOfYear = Math.floor((time - new Date(time.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const seasonalVariation = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 15; // ±15°C seasonal change
    
    const baseTemp = 22 + seasonalVariation; // Base temperature around 22°C (room temperature)
    const weeklyVariation = Math.sin((i * 0.2)) * 3; // Weekly temperature cycle
    const randomNoise = (Math.random() - 0.5) * 6; // ±3°C random variation
    
    const value = baseTemp + weeklyVariation + randomNoise;
    
    data.push({
      time: time.toISOString(),
      value: Math.round(value * 10) / 10 // Round to 1 decimal place
    });
  }
  
  return data;
}

async function fetchTemperatureData(dateRange = "option1") {
  // Map dropdown values to number of days
  const dayMapping = {
    "option1": 7,   // Last 7 days
    "option2": 15,  // Last 15 days
    "option3": 30,  // Last 30 days
    "option4": 90   // Last 90 days
  };
  
  const days = dayMapping[dateRange] || 7; // Default to 7 days
  return generateDummyData(days);
}

// Example Supabase integration (commented out for now)
/*
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchTemperatureDataFromSupabase() {
  const { data, error } = await supabase
    .from('temperature')
    .select('time, value')
    .order('time', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
*/
