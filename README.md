# 🛡️ Threat Spotter AI

> **Real-time AI-powered cybersecurity threat tracking dashboard** that visualizes live attacks across the globe and provides instant, actionable defense insights.

🌍 **Live Preview:** [Click here to view the app](https://preview--threat-spotter-ai.lovable.app/)

---

## 🚀 Overview

**Threat Spotter AI** is a real-time cybersecurity monitoring tool designed for SMBs, security researchers, and IT teams.  
It integrates **live threat intelligence feeds** with **AI-powered analysis** to help you understand, visualize, and respond to global cyberattacks as they happen.

---

## ✨ Features

- 🌐 **Live Global Threat Map** – See attacks in real time, color-coded by severity.
- 🤖 **AI-Generated Threat Summaries** – Instant, plain-English breakdowns of technical data.
- 📊 **Threat Feed Dashboard** – Continuous stream of latest threats with filtering.
- 🔍 **IP/Domain Lookup** – Search for specific IPs/domains to check risk levels.
- 📌 **Role-Based Views** – SysAdmin mode (technical detail) & Executive mode (business impact).
- 🔔 **Live Alerts** – Email, Slack, or Discord integration for high-severity threats.
- 🗄 **Incident History** – View past incidents with AI-generated summaries.
- 🖤 **Dark Mode UI** – Modern, cyberpunk-inspired design.

---

## 🛠️ Tech Stack

**Frontend:**  
- React + Vite  
- Tailwind CSS (UI styling)  
- Mapbox / Leaflet (interactive map)  
- Framer Motion (animations)  

**Backend:**  
- FastAPI (Python)  
- WebSockets (real-time updates)  
- Integration with VirusTotal, Shodan, and AbuseIPDB APIs  

**AI Integration:**  
- OpenAI GPT API for threat summarization  

**Database:**  
- Supabase (PostgreSQL + Auth)  

**Hosting:**  
- Frontend → Vercel  
- Backend → Render  
- Database → Supabase  

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/threat-spotter-ai.git
cd threat-spotter-ai

