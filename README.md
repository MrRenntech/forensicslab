# 🕵️‍♂️ Cyber Forensic LAB

<div align="center">
  <img src="./assets/images/hero_banner.png" alt="Cyber Forensic LAB Hero" width="80%" />
  <br/>
  ![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
  ![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Database](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
</div>

> **Simulate. Analyze. Solve.**  
> An interactive web-based forensic simulation platform for students and faculty.

---

## 🏗️ Tech Architecture

```mermaid
graph TD
    Client[👨‍🎓 Student Browser] --> |REST API| NodeServer[💻 Node.js Express Server]
    Client --> |UI Loop| WebTerm[🖧 In-Browser Terminal]
    NodeServer --> |Verification| Engine[🔍 Validation Engine]
    Engine --> |Query| Mongo[(🍃 MongoDB)]
    Mongo --> Engine
    Engine --> NodeServer
    NodeServer --> Client
```

## ⚡ Quick Start
```bash
git clone https://github.com/MrRenntech/Cyber-Forensic-LAB.git
npm install
node server.js
```
