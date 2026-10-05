import { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Thermometer, Droplets, AlertTriangle } from 'lucide-react';

function App() {
  const [liveData, setLiveData] = useState({ temperature: 0, humidity: 0 });
  const [history, setHistory] = useState([]);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const weatherRef = ref(database, 'weather_station');
    const unsubscribe = onValue(weatherRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const { temperature, humidity } = data;
        setLiveData({ temperature, humidity });
        
        if (temperature >= 35.0) {
          setIsWarning(true);
        } else {
          setIsWarning(false);
        }

        const newEntry = {
          time: new Date().toLocaleTimeString(),
          temperature,
          humidity,
        };

        setHistory((prev) => {
          const newHistory = [...prev, newEntry];
          // Keep the last 20 data points
          if (newHistory.length > 20) {
            return newHistory.slice(newHistory.length - 20);
          }
          return newHistory;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-950 text-slate-200 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              IoT Weather Station
            </h1>
            <p className="text-slate-400 mt-1">Live Telemetry Dashboard</p>
          </div>

          {/* Warning Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 shadow-lg ${
            isWarning 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-red-500/20' 
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/20'
          }`}>
            <AlertTriangle size={20} className={isWarning ? 'animate-pulse' : ''} />
            <span>
              {isWarning ? 'WARNING: High Temperature (>35°C) - Fan Relay ON' : 'System Normal - Fan Relay OFF'}
            </span>
          </div>
        </header>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Temperature Card */}
          <div className={`relative overflow-hidden rounded-2xl border bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl transition-colors duration-300 ${
            isWarning ? 'border-red-500/50 shadow-red-500/10' : 'border-slate-800'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Temperature</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-5xl font-black ${isWarning ? 'text-red-400' : 'text-white'}`}>
                    {liveData.temperature.toFixed(1)}
                  </span>
                  <span className="text-2xl text-slate-500">°C</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${isWarning ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                <Thermometer size={32} />
              </div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className={`absolute -bottom-16 -right-16 w-32 h-32 blur-3xl opacity-20 rounded-full ${isWarning ? 'bg-red-500' : 'bg-orange-500'}`}></div>
          </div>

          {/* Humidity Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Humidity</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">
                    {liveData.humidity.toFixed(1)}
                  </span>
                  <span className="text-2xl text-slate-500">%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Droplets size={32} />
              </div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 blur-3xl opacity-20 rounded-full bg-blue-500"></div>
          </div>
          
        </div>

        {/* Dynamic Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">Telemetry History</h2>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b' }} 
                  tickMargin={10}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#64748b" 
                  tick={{ fill: '#64748b' }} 
                  tickMargin={10}
                  domain={['auto', 'auto']}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b' }} 
                  tickMargin={10}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ fontWeight: '500' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temperature (°C)"
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={500}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidity (%)"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
