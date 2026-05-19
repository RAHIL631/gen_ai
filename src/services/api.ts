import axios from 'axios';
import { AnalysisResult, CheckHistory, Severity } from '../types';

// Local Storage Keys
const HISTORY_KEY = 'pharmai_history';
const STATS_KEY = 'pharmai_stats';

const API_BASE_URL = 'http://localhost:8000/api';

export async function checkInteractionsApi(medicationText: string): Promise<AnalysisResult> {
  try {
    const response = await axios.post(`${API_BASE_URL}/check/`, {
      medication_text: medicationText
    });
    
    const result = response.data as AnalysisResult;

    // Save to history
    saveToHistory(medicationText, result);

    return result;
  } catch (error) {
    console.error('API integration failed:', error);
    throw error;
  }
}

export async function processOcrApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_BASE_URL}/features/ocr-prescription`, formData);
  return response.data;
}

export async function processVoiceApi(file: Blob) {
  const formData = new FormData();
  formData.append("file", file, "audio.wav");
  const response = await axios.post(`${API_BASE_URL}/features/voice-to-text`, formData);
  return response.data;
}

export async function getPatientRiskApi(data: any) {
  const response = await axios.post(`${API_BASE_URL}/features/patient-risk`, data);
  return response.data;
}

export async function getInteractionGraphApi(drugs: string) {
  const response = await axios.get(`${API_BASE_URL}/features/interaction-graph?drugs=${encodeURIComponent(drugs)}`);
  return response.data;
}


function saveToHistory(text: string, result: AnalysisResult) {
  let existing = [];
  try { existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}

  const drugsList = Array.from(new Set(result.interactions.flatMap(i => i.drugs)));
  const extractedDrugs = drugsList.length > 0 ? drugsList : ["Unrecognized/Single Medication"];
  
  let maxSev: any = 'NONE';
  if (result.interactions.some(i => i.severity === 'CONTRAINDICATED')) maxSev = 'CONTRAINDICATED';
  else if (result.interactions.some(i => i.severity === 'MAJOR')) maxSev = 'MAJOR';
  else if (result.interactions.some(i => i.severity === 'MODERATE')) maxSev = 'MODERATE';
  else if (result.interactions.some(i => i.severity === 'LOW')) maxSev = 'LOW';

  const entry: CheckHistory = {
    id: Math.random().toString(36).substring(7),
    drugs: extractedDrugs,
    timestamp: new Date().toISOString(),
    issueCount: result.interactionsFound,
    maxSeverity: maxSev
  };

  existing.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.slice(0, 50))); // Keep last 50
  
  // Update stats
  updateStats(result, entry);
}

function updateStats(result: AnalysisResult, entry: CheckHistory) {
  let stats: any = {
    total_checks: 0,
    high_risk_cases: 0,
    active_users: 1284,
    ai_accuracy: 99.8,
    uptime: "99.99%",
    chart_data: [],
    recent_high_risk: [],
    top_drugs: []
  };
  
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) stats = JSON.parse(saved);
  } catch (e) {}

  stats.total_checks += 1;
  if (result.highRiskAlerts > 0) {
    stats.high_risk_cases += 1;
    
    // Add to recent high risk
    const criticals = result.interactions.filter(i => i.severity === 'CONTRAINDICATED' || i.severity === 'MAJOR');
    if (criticals.length > 0) {
      stats.recent_high_risk.unshift({
        title: criticals[0].drugs.join(' + '),
        desc: criticals[0].mechanism.substring(0, 50) + "...",
        severity: criticals[0].severity === 'CONTRAINDICATED' ? 'High' : 'Medium',
        time: new Date().toISOString(),
        confidence: Math.round((criticals[0].confidence || 0.95) * 100)
      });
      stats.recent_high_risk = stats.recent_high_risk.slice(0, 5);
    }
  }

  // Update top drugs
  entry.drugs.forEach(d => {
    const existing = stats.top_drugs.find((td: any) => td.label === d);
    if (existing) {
      existing.count += 1;
      existing.progress = Math.min(100, existing.progress + 5);
    } else {
      stats.top_drugs.push({ label: d, count: 1, progress: 10 });
    }
  });
  
  stats.top_drugs.sort((a: any, b: any) => b.count - a.count);
  stats.top_drugs = stats.top_drugs.slice(0, 5);

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export async function normalizeDrugApi(drugName: string) {
  return { normalized: drugName.toUpperCase() };
}

export async function getSystemStatsApi() {
  await new Promise(r => setTimeout(r, 600)); // Simulate network
  let stats: any = null;
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) stats = JSON.parse(saved);
  } catch (e) {}

  if (!stats) {
    // Default initial mock stats
    stats = {
      total_checks: 12458,
      high_risk_cases: 231,
      active_users: 1284,
      ai_accuracy: 99.8,
      uptime: "99.99%",
      chart_data: [
        { name: "Mon", volume: 1200 },
        { name: "Tue", volume: 1900 },
        { name: "Wed", volume: 1500 },
        { name: "Thu", volume: 2200 },
        { name: "Fri", volume: 2800 },
        { name: "Sat", volume: 1800 },
        { name: "Sun", volume: 2400 }
      ],
      recent_high_risk: [],
      top_drugs: [
        { label: "Lisinopril", count: 342, progress: 85 },
        { label: "Omeprazole", count: 289, progress: 70 },
        { label: "Metformin", count: 256, progress: 60 }
      ]
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
  return stats;
}

export async function getHistoryApi() {
  await new Promise(r => setTimeout(r, 500)); // Simulate network
  let history: CheckHistory[] = [];
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) history = JSON.parse(saved);
  } catch (e) {}
  
  return history;
}

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem('pharmai_token') || 'mock_jwt_token_12345';
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export async function getAlertsApi() {
  try {
    const response = await axios.get(`${API_BASE_URL}/features/alerts`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.warn('Backend alerts API failed, using local storage fallback:', error);
    let alerts = [];
    try { alerts = JSON.parse(localStorage.getItem('pharmai_alerts') || '[]'); } catch (e) {}
    if (alerts.length === 0) {
      alerts = [
        { id: 1, severity: 'CRITICAL', message: 'Severe interaction detected between Warfarin and Aspirin. Synergistic bleeding risk.', resolved: false, created_at: new Date().toISOString() },
        { id: 2, severity: 'WARNING', message: 'Duplicate therapeutic class: Ibuprofen and Naproxen both belong to NSAIDs. Risk of severe GI distress.', resolved: false, created_at: new Date().toISOString() },
        { id: 3, severity: 'INFO', message: 'Medication sync success: Import completed for 3 new drugs from FDA Orange Book database.', resolved: false, created_at: new Date().toISOString() }
      ];
      localStorage.setItem('pharmai_alerts', JSON.stringify(alerts));
    }
    return alerts;
  }
}

export async function resolveAlertApi(id: number) {
  try {
    const response = await axios.post(`${API_BASE_URL}/features/alerts/${id}/resolve`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    console.warn('Backend resolve alert failed, updating local storage:', error);
    let alerts = [];
    try { alerts = JSON.parse(localStorage.getItem('pharmai_alerts') || '[]'); } catch (e) {}
    const updated = alerts.map((a: any) => a.id === id ? { ...a, resolved: true } : a);
    localStorage.setItem('pharmai_alerts', JSON.stringify(updated));
    return { status: 'success' };
  }
}

export async function getRemindersApi() {
  try {
    const response = await axios.get(`${API_BASE_URL}/features/reminders`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.warn('Backend reminders API failed, using local storage fallback:', error);
    let reminders = [];
    try { reminders = JSON.parse(localStorage.getItem('pharmai_reminders') || '[]'); } catch (e) {}
    if (reminders.length === 0) {
      reminders = [
        { id: 1, medication_name: 'Atorvastatin', dosage: '20mg', time: '20:00', frequency: 'Daily', active: true },
        { id: 2, medication_name: 'Lisinopril', dosage: '10mg', time: '08:00', frequency: 'Daily', active: true }
      ];
      localStorage.setItem('pharmai_reminders', JSON.stringify(reminders));
    }
    return reminders;
  }
}

export async function createReminderApi(data: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/features/reminders`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.warn('Backend create reminder failed, updating local storage:', error);
    let reminders = [];
    try { reminders = JSON.parse(localStorage.getItem('pharmai_reminders') || '[]'); } catch (e) {}
    const newReminder = {
      id: Math.round(Math.random() * 100000),
      medication_name: data.medication_name,
      dosage: data.dosage,
      time: data.time,
      frequency: data.frequency,
      active: true
    };
    reminders.unshift(newReminder);
    localStorage.setItem('pharmai_reminders', JSON.stringify(reminders));
    return newReminder;
  }
}

export async function toggleReminderApi(id: number) {
  try {
    const response = await axios.post(`${API_BASE_URL}/features/reminders/${id}/toggle`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    console.warn('Backend toggle reminder failed, updating local storage:', error);
    let reminders = [];
    try { reminders = JSON.parse(localStorage.getItem('pharmai_reminders') || '[]'); } catch (e) {}
    const updated = reminders.map((r: any) => r.id === id ? { ...r, active: !r.active } : r);
    localStorage.setItem('pharmai_reminders', JSON.stringify(updated));
    return { status: 'success', active: updated.find((r: any) => r.id === id)?.active };
  }
}

export async function deleteReminderApi(id: number) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/features/reminders/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.warn('Backend delete reminder failed, updating local storage:', error);
    let reminders = [];
    try { reminders = JSON.parse(localStorage.getItem('pharmai_reminders') || '[]'); } catch (e) {}
    const updated = reminders.filter((r: any) => r.id !== id);
    localStorage.setItem('pharmai_reminders', JSON.stringify(updated));
    return { status: 'success' };
  }
}

