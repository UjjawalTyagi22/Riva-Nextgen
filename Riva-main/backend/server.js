// // server.js - RIVA: General Purpose AI + Club Expert
// const fs = require('fs');
// const path = require('path');
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// // const OpenAI = require('openai');
// const multer = require('multer');
// require('dotenv').config();

// // ADD DEBUG LOGGING
// console.log('🔍 Debug Info:');
// console.log('- API Key exists:', !!process.env.GEMINI_API_KEY);
// console.log('- API Key length:', process.env.GEMINI_API_KEY?.length);
// console.log('- API Key preview:', process.env.GEMINI_API_KEY?.substring(0, 15) + '...');

// const upload = multer({ dest: 'uploads/' });

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`📝 ${req.method} ${req.url}`);
//   next();
// });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// // const USE_WHISPER = process.env.USE_WHISPER === 'true';

// // const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// // const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
// // const ELEVENLABS_MODEL_ID = 'eleven_turbo_v2';
// // const USE_ELEVENLABS = process.env.USE_ELEVENLABS === 'true' && ELEVENLABS_API_KEY;

// // console.log('🔑 Gemini API Key loaded:', process.env.GEMINI_API_KEY ? '✅' : '❌');
// // console.log('🔑 OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? '✅' : '❌');
// // console.log('🔑 ElevenLabs API Key loaded:', ELEVENLABS_API_KEY ? '✅' : '❌');
// // console.log('🎙️ ElevenLabs Voice ID:', ELEVENLABS_VOICE_ID);
// // console.log('🎤 STT: ' + (USE_WHISPER ? 'OpenAI Whisper' : 'Browser Speech API'));

// let conversationHistory = [];

// // ===============================================
// // 🎓 COMPLETE KNOWLEDGE BASE - ALL QUESTIONS & ANSWERS
// // ===============================================
// const CLUB_KNOWLEDGE = `
// # 🧠 NextGen Supercomputing Club - Complete Knowledge Base

// ## 💫 Club Introduction
// Welcome to the NextGen Supercomputing Club — a forward-thinking community at the forefront of High-Performance Computing (HPC), Artificial Intelligence (AI), and Quantum Computing innovation.

// Our mission is to build production-ready Machine Learning engineers through hands-on experience, collaboration, and cutting-edge computational projects.

// We aim to bridge the gap between academic learning and real-world AI applications, empowering students to solve industry-level challenges using advanced computing technologies.

// Join us to explore GPU clusters, exascale computing, AI-driven simulations, and quantum research — and be part of the next generation of computational innovators.

// ## 🏷 Tagline
// "Building Production Brains"

// ## 💡 Motto
// To create production-ready ML engineers who can design, deploy, and scale real-world AI solutions.

// ## 🧩 About Us
// - **Founded**: 2025
// - **Vision**: To build a community of industry-ready innovators who can translate theoretical knowledge into real-world AI and HPC solutions. Our vision is to enable students to leverage supercomputing capabilities—like the NVIDIA DGX A100—to work on production-scale projects, drive innovation, and make a tangible impact in the tech industry.
// - **Mission**: To empower students to become production-ready Machine Learning engineers through hands-on learning, real-world problem solving, and exposure to cutting-edge technologies such as High-Performance Computing (HPC), Artificial Intelligence (AI), and Quantum Computing. We aim to bridge the gap between academic knowledge and industry practices by organizing bootcamps, hackathons, workshops, and collaborative research projects.

// ## Focus Areas
// - High-Performance Computing (HPC)
// - Artificial Intelligence and Machine Learning
// - Quantum Simulation and Computing
// - GPU and Parallel Programming
// - Cloud HPC and AI Deployment
// - Model Optimization and Scalability

// ## Resources
// - **Hardware**: NVIDIA DGX A100 Supercomputer – enabling large-scale AI training and scientific simulations
// - **Software Stack**: CUDA, MPI, PyTorch, TensorFlow, OpenMPI, and other open-source HPC tools
// - **Infrastructure**: Cloud HPC platforms for experimentation and learning

// ## 🎯 Objectives
// 1. Cultivate a generation of industry-ready ML engineers
// 2. Offer hands-on training through bootcamps, hackathons, workshops, and an annual AI Summit
// 3. Encourage students to develop and deploy real-world AI and HPC projects
// 4. Foster partnerships with research labs, industry leaders, and academic mentors
// 5. Promote open-source collaboration and computational research on campus

// ## ⚙ What We Do
// The NextGen Supercomputing Club organizes diverse activities that merge learning with innovation:

// - 💻 **Workshops & Bootcamps**: Focused on Python for HPC, Deep Learning, Quantum Computing, and Parallel Programming using CUDA and MPI
// - ⚡ **Hackathons**: Problem-solving competitions centered around AI, HPC, and data-driven innovation
// - 🧠 **NextGen AI Summit (Annual Flagship Event)**: A high-impact event featuring industry speakers, live demos, and project showcases
// - 🚀 **Project Incubation**: Members can propose and develop projects under guidance when needed, using real hardware and industry frameworks
// - 🎓 **Skill Development Series**: Short, practical learning sessions to upskill members in AI, HPC, and cloud deployment
// - 🤝 **Collaborations**: Partnerships with startups, universities, and NVIDIA's academic programs for research and technical exposure

// ## 👥 Members & Team Structure
// - **President** – Shreya Jain: Leads the club's direction and strategic initiatives
// - **Vice President** – Samarth Shukla: Oversees operations, collaborations, and event execution
// - **PR Head** – Ujjawal Tyagi: Manages public relations, outreach, and communication
// - **Graphics Head** – Preeti Singh: Designs creative visuals, posters, and media content
// - **Event Management Leads** – Srashti Gupta & Vidisha Goel: Handle logistics, coordination, and event planning
// - **Technical Leads** – Ronak Goel & Vinayak Rastogi: Guide members through technical projects, workshops, and infrastructure setup
// - **Treasurer** – Divyansh Verma: Manages finances, budgeting, and sponsorships

// ## 👨‍🏫 MENTORS & LEADERSHIP

// ### Club Mentors (3 Expert Faculty)
// **Dr. Gaurav Srivastav**: AI researcher, educator, and author with 12+ years of experience. Assistant Professor at KIET Ghaziabad. Ph.D. from Sharda University (2024). Published 20+ research papers. Expertise: Generative AI, BERT-enabled learning models, data-driven educational systems.

// **Dr. Richa Singh**: Assistant Professor (Research) in CSE Department at KIET, specializing in AI/ML and Data Science. Ph.D. in IT from Amity University, Lucknow. Awards: Young Research Award, Young Dronacharya Award. Infosys-certified faculty, keynote speaker, and jury member at NIFT.

// **Dr. Bikki Kumar**: AI and Data Science professional at Drifko. M.Tech in Data Science from DTU, B.Tech in IT from NIT Srinagar. Expertise: LLMs, RAG systems, and workflow optimization.

// ### Department & College Leadership
// **Dr. Rekha Kashyap**: Dean & Head of AI/ML Department. 30 years of experience. Ph.D. from JNU. Former Professor & Dean at NIET. Member of IEEE, CSI, ACM, ISTE, IAENG.

// **Dr. Manoj Goel**: Executive Director of KIET. Provides visionary leadership to the entire institution.

// **Dr. Adesh Kumar Pandey**: Director Academics. Oversees academic policies and curriculum across all departments.

// ## ⚡ Fun Facts
// - The Frontier Supercomputer (USA) performs 1.1 exaFLOPS, 1,000× faster than a premium laptop
// - Supercomputers helped accelerate COVID-19 vaccine research through protein simulations
// - Our NVIDIA DGX A100 can train neural networks 10× faster than a standard GPU
// - HPC powers breakthroughs in AI, medicine, astrophysics, and robotics
// `;

// const INAUGURATION_SPEECH = `Good morning everyone — respected Director, Director Academics, Head of Department, esteemed faculty members, and dear club members.

// I'm Riva, your AI host for today's inauguration, and I'm truly honored to welcome you all to the launch of the NextGen Supercomputing Club — where intelligence meets innovation.

// This club stands as a symbol of what's possible when technology, creativity, and learning come together. At its core lies one of the most powerful machines on our campus — the NVIDIA DGX A100 Supercomputer, a system designed to accelerate the next wave of AI and scientific breakthroughs.

// Our vision is bold and clear — to empower students to become industry-ready Machine Learning engineers, capable of building production-level solutions and driving real-world impact.

// The club is guided by a passionate team of nine core members — Shreya Jain (President), Samarth Shukla (Vice President), Ujjawal Tyagi (PR Head), Preeti Singh (Graphics Head), Srashti Gupta & Vidisha Goel (Event Management Leads), Ronak Goel & Vinayak Rastogi (Technical Leads), and Divyansh Verma (Treasurer) — with the esteemed guidance of our Head of Department, Dr. Rekha Kashyap, and under the mentorship of Dr. Gaurav Srivastava, Dr. Richa Singh, and Dr. Bikki Kumar.

// Through hands-on workshops, hackathons, bootcamps, and collaborative AI projects, the NextGen Supercomputing Club aims to bridge the gap between academic learning and industrial innovation.

// Together, we will explore the frontiers of High-Performance Computing, Artificial Intelligence, and Quantum Simulation, turning ideas into impact and learners into leaders.

// Welcome once again to the NextGen Supercomputing Club — Let's compute the future by building production brains and shaping the next generation of AI innovators.`;

// function isInaugurationRequest(message) {
//   const lowerMessage = message.toLowerCase();
//   const triggers = [
//     'are you ready to take over',
//     'ready to take over',
//     'inauguration',
//     'start our inauguration',
//     'begin inauguration',
//     'inauguration ceremony',
//     'welcome speech',
//     'introduction to the club',
//     'tell me about the club',
//     'club introduction',
//     'start inauguration',
//     'can we start',
//     'begin the ceremony'
//   ];
  
//   return triggers.some(trigger => lowerMessage.includes(trigger));
// }

// // ===============================================
// // ✅ CHAT ENDPOINT - WORKS LIKE CHATGPT
// // ===============================================
// app.post('/api/chat', async (req, res) => {
//   console.log('📨 Chat request received');
  
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: 'Message is required' });
//     }

//     // Check if inauguration is requested
//     if (isInaugurationRequest(message)) {
//       console.log('🎉 Inauguration trigger detected!');
      
//       const response = message.toLowerCase().includes('ready to take over') 
//         ? `Yes, I'm ready!\n\n${INAUGURATION_SPEECH}`
//         : INAUGURATION_SPEECH;
      
//       conversationHistory.push(
//         { role: 'user', content: message },
//         { role: 'assistant', content: response }
//       );

//       return res.json({
//         response: response,
//         success: true,
//         isInauguration: true
//       });
//     }

//     // Regular chat with Gemini - LIKE CHATGPT
//     console.log('🤖 Calling Gemini API...');

//     const model = genAI.getGenerativeModel({ 
//       model: 'gemini-2.5-flash',  // UPDATED TO LATEST STABLE MODEL
//       generationConfig: {
//         temperature: 0.7,
//         topP: 0.95,
//         topK: 40,
//         maxOutputTokens: 512,
//       },
//     });

//     const chat = model.startChat({
//       history: [
//         {
//           role: 'user',
//           parts: [{ text: `You are RIVA, a female AI assistant for the NextGen Supercomputing Club at KIET Group of Institutions.

// You are a general-purpose AI assistant who can answer ANY question about ANY topic - science, technology, celebrities, history, current events, coding, math, entertainment, sports, etc.

// You ALSO have specialized knowledge about the NextGen Supercomputing Club:

// ${CLUB_KNOWLEDGE}

// **RESPONSE RULES:**

// 1. **ONLY FOR CLUB INTRODUCTION** ("tell me about the club", "introduce the club", "what is NextGen club"):
//    - Give a DETAILED, comprehensive introduction
//    - Include mission, vision, activities, mentors, resources
//    - DO NOT mention student member names unless specifically asked

// 2. **ALL OTHER QUESTIONS** (everything else):
//    - Keep responses SHORT and CRISP (2-4 sentences maximum)
//    - Be direct and to the point
//    - No long explanations unless asked "explain in detail"

// **EXAMPLES:**
// - "Who are the mentors?" → "The club mentors are Dr. Gaurav Srivastava, Dr. Richa Singh, and Dr. Bikki Kumar, guided by Dr. Rekha Kashyap."
// - "What is Python?" → "Python is a high-level programming language known for its simplicity and versatility, widely used in web development, data science, and AI."
// - "Who is the president?" → "Shreya Jain is the President of NextGen Supercomputing Club."

// Be friendly, conversational, and concise.` }]
//         },
//         {
//           role: 'model',
//           parts: [{ text: 'Understood! I am RIVA. Only club introductions will be detailed. All other responses will be short and crisp (2-4 sentences). Ready!' }]
//         },
//         ...conversationHistory.map(msg => ({
//           role: msg.role === 'assistant' ? 'model' : 'user',
//           parts: [{ text: msg.content }]
//         }))
//       ]
//     });

//     const result = await chat.sendMessage(message);
//     const assistantMessage = result.response.text();

//     console.log('✅ Gemini response received');

//     conversationHistory.push(
//       { role: 'user', content: message },
//       { role: 'assistant', content: assistantMessage }
//     );

//     if (conversationHistory.length > 20) {
//       conversationHistory = conversationHistory.slice(-20);
//     }

//     res.json({
//       response: assistantMessage,
//       success: true,
//       isInauguration: false
//     });

//   } catch (error) {
//     console.error('❌ Gemini Error:', error.message);
//     res.status(500).json({
//       error: 'Failed to get response',
//       details: error.message
//     });
//   }
// });

// // ===============================================
// // ✅ TTS ENDPOINT (for later with ElevenLabs)
// // ===============================================
// app.post('/api/tts', async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ error: 'Text is required' });
//   }

//   if (!USE_ELEVENLABS || !ELEVENLABS_API_KEY) {
//     return res.status(500).json({ error: 'ElevenLabs not configured' });
//   }

//   try {
//     console.log('🎤 Generating speech with ElevenLabs...');
    
//     let cleanText = text;
    
//     // Remove emojis
//     cleanText = cleanText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
//     cleanText = cleanText.replace(/[\u{2600}-\u{26FF}]/gu, '');
//     cleanText = cleanText.replace(/[\u{2700}-\u{27BF}]/gu, '');
    
//     // Remove markdown
//     cleanText = cleanText.replace(/\*\*(.+?)\*\*/g, '$1');
//     cleanText = cleanText.replace(/\*(.+?)\*/g, '$1');
//     cleanText = cleanText.replace(/^#+\s+/gm, '');
//     cleanText = cleanText.replace(/``````/g, '');
//     cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
//     cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
//     cleanText = cleanText.replace(/^[\s]*[•\-\*]\s+/gm, '');
//     cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
//     const response = await axios({
//       method: 'POST',
//       url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
//       headers: {
//         'Accept': 'audio/mpeg',
//         'Content-Type': 'application/json',
//         'xi-api-key': ELEVENLABS_API_KEY
//       },
//       data: {
//         text: cleanText.replace(/([.!?])\s+/g, '$1. '),
//         model_id: ELEVENLABS_MODEL_ID,
//         voice_settings: {
//           stability: 0.5,
//           similarity_boost: 0.85,
//           style: 0.3,
//           use_speaker_boost: true
//         }
//       },
//       responseType: 'arraybuffer'
//     });

//     console.log('✅ Audio generated successfully');

//     res.set({
//       'Content-Type': 'audio/mpeg',
//       'Content-Length': response.data.length
//     });
//     res.send(Buffer.from(response.data));

//   } catch (error) {
//     console.error('❌ ElevenLabs Error:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to generate speech' });
//   }
// });

// app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
//   if (!USE_WHISPER) {
//     return res.status(400).json({ error: 'Whisper not enabled' });
//   }

//   try {
//     const audioFile = req.file;
//     if (!audioFile) {
//       return res.status(400).json({ error: 'No audio file provided' });
//     }

//     console.log('🎤 Transcribing with OpenAI Whisper...');

//     const transcription = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(audioFile.path),
//       model: 'whisper-1',
//       language: 'en'
//     });

//     fs.unlinkSync(audioFile.path);

//     console.log('✅ Transcription:', transcription.text);
//     res.json({ transcript: transcription.text });

//   } catch (error) {
//     console.error('❌ Whisper Error:', error.message);
//     res.status(500).json({ error: 'Transcription failed' });
//   }
// });

// app.post('/api/clear', (req, res) => {
//   console.log('🗑️ Clearing conversation');
//   conversationHistory = [];
//   res.json({ success: true });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'RIVA - General Purpose AI + Club Expert',
//     features: {
//       generalChat: true,
//       clubKnowledge: true,
//       inaugurationTrigger: true,
//       voiceSupport: true,
//       elevenLabsVoice: USE_ELEVENLABS
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`\n${'='.repeat(60)}`);
//   console.log(`🚀 RIVA AI Server Running!`);
//   console.log(`${'='.repeat(60)}`);
//   console.log(`📍 Server: http://localhost:${PORT}`);
//   console.log(`🤖 AI: Gemini 2.5 Flash (Latest Stable)`);  // UPDATED
//   console.log(`🎓 Club Knowledge: Loaded ✅`);
//   console.log(`🌍 Can answer ANY general question ✅`);
//   // console.log(`🎤 Voice: ${USE_ELEVENLABS ? 'ElevenLabs (Cloned) ✅' : 'Browser TTS'}`);
//   console.log(`${'='.repeat(60)}\n`);
// });








// server.js - RIVA: General Purpose AI + Club Expert

// const fs = require('fs');
// const path = require('path');
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const OpenAI = require('openai');
// require('dotenv').config();

// // ===============================================
// // 🔍 DEBUG LOGGING & INITIALIZATION
// // ===============================================
// console.log('\n' + '='.repeat(70));
// console.log('🔍 INITIALIZATION DEBUG INFO:');
// console.log('='.repeat(70));
// console.log('✓ AI Provider:', process.env.AI_PROVIDER || 'gemini');
// console.log('✓ Gemini API Key exists:', !!process.env.GEMINI_API_KEY);
// console.log('✓ OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
// console.log('✓ Node Environment:', process.env.NODE_ENV || 'development');
// console.log('='.repeat(70) + '\n');

// // ===============================================
// // 🎯 EXPRESS APP SETUP
// // ===============================================
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001', '*'],
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`📝 ${new Date().toLocaleTimeString()} | ${req.method} ${req.url}`);
//   next();
// });

// // ===============================================
// // 🔌 AI PROVIDER CONFIGURATION
// // ===============================================
// const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
// let genAI;
// let openai;

// if (AI_PROVIDER === 'gemini') {
//   genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   console.log('✅ Gemini API initialized');
// } else if (AI_PROVIDER === 'openai') {
//   openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
//   });
//   console.log('✅ OpenAI API initialized');
// }

// // Conversation history for context
// let conversationHistory = [];
// const MAX_HISTORY = 20;

// // ===============================================
// // 🧠 COMPLETE KNOWLEDGE BASE
// // ===============================================
// const CLUB_KNOWLEDGE = `
// # 🧠 NextGen Supercomputing Club - Complete Knowledge Base

// ## 💫 Club Introduction
// Welcome to the NextGen Supercomputing Club — a forward-thinking community at the forefront of High-Performance Computing (HPC), Artificial Intelligence (AI), and Quantum Computing innovation.

// Our mission is to build production-ready Machine Learning engineers through hands-on experience, collaboration, and cutting-edge computational projects.

// We aim to bridge the gap between academic learning and real-world AI applications, empowering students to solve industry-level challenges using advanced computing technologies.

// Join us to explore GPU clusters, exascale computing, AI-driven simulations, and quantum research — and be part of the next generation of computational innovators.

// ## 🏷 Tagline
// "Building Production Brains"

// ## 💡 Motto
// To create production-ready ML engineers who can design, deploy, and scale real-world AI solutions.

// ## 🧩 About Us
// - **Founded**: 2025
// - **Vision**: To build a community of industry-ready innovators who can translate theoretical knowledge into real-world AI and HPC solutions. Our vision is to enable students to leverage supercomputing capabilities—like the NVIDIA DGX A100—to work on production-scale projects, drive innovation, and make a tangible impact in the tech industry.
// - **Mission**: To empower students to become production-ready Machine Learning engineers through hands-on learning, real-world problem solving, and exposure to cutting-edge technologies such as High-Performance Computing (HPC), Artificial Intelligence (AI), and Quantum Computing. We aim to bridge the gap between academic knowledge and industry practices by organizing bootcamps, hackathons, workshops, and collaborative research projects.

// ## Focus Areas
// - High-Performance Computing (HPC)
// - Artificial Intelligence and Machine Learning
// - Quantum Simulation and Computing
// - GPU and Parallel Programming
// - Cloud HPC and AI Deployment
// - Model Optimization and Scalability

// ## Resources
// - **Hardware**: NVIDIA DGX A100 Supercomputer – enabling large-scale AI training and scientific simulations
// - **Software Stack**: CUDA, MPI, PyTorch, TensorFlow, OpenMPI, and other open-source HPC tools
// - **Infrastructure**: Cloud HPC platforms for experimentation and learning

// ## 🎯 Objectives
// 1. Cultivate a generation of industry-ready ML engineers
// 2. Offer hands-on training through bootcamps, hackathons, workshops, and an annual AI Summit
// 3. Encourage students to develop and deploy real-world AI and HPC projects
// 4. Foster partnerships with research labs, industry leaders, and academic mentors
// 5. Promote open-source collaboration and computational research on campus

// ## ⚙ What We Do
// The NextGen Supercomputing Club organizes diverse activities that merge learning with innovation:

// - 💻 **Workshops & Bootcamps**: Focused on Python for HPC, Deep Learning, Quantum Computing, and Parallel Programming using CUDA and MPI
// - ⚡ **Hackathons**: Problem-solving competitions centered around AI, HPC, and data-driven innovation
// - 🧠 **NextGen AI Summit (Annual Flagship Event)**: A high-impact event featuring industry speakers, live demos, and project showcases
// - 🚀 **Project Incubation**: Members can propose and develop projects under guidance when needed, using real hardware and industry frameworks
// - 🎓 **Skill Development Series**: Short, practical learning sessions to upskill members in AI, HPC, and cloud deployment
// - 🤝 **Collaborations**: Partnerships with startups, universities, and NVIDIA's academic programs for research and technical exposure

// ## 👥 Team Structure
// - **President** – Shreya Jain: Leads the club's direction and strategic initiatives
// - **Vice President** – Samarth Shukla: Oversees operations, collaborations, and event execution
// - **PR Head** – Ujjawal Tyagi: Manages public relations, outreach, and communication
// - **Graphics Head** – Preeti Singh: Designs creative visuals, posters, and media content
// - **Event Management Leads** – Srashti Gupta & Vidisha Goel: Handle logistics, coordination, and event planning
// - **Technical Leads** – Ronak Goel & Vinayak Rastogi: Guide members through technical projects, workshops, and infrastructure setup
// - **Treasurer** – Divyansh Verma: Manages finances, budgeting, and sponsorships

// ## 👨‍🏫 Mentors & Leadership

// ### Club Mentors (3 Expert Faculty)
// **Dr. Gaurav Srivastav**: AI researcher, educator, and author with 12+ years of experience. Assistant Professor at KIET Ghaziabad. Ph.D. from Sharda University (2024). Published 20+ research papers. Expertise: Generative AI, BERT-enabled learning models, data-driven educational systems.

// **Dr. Richa Singh**: Assistant Professor (Research) in CSE Department at KIET, specializing in AI/ML and Data Science. Ph.D. in IT from Amity University, Lucknow. Awards: Young Research Award, Young Dronacharya Award. Infosys-certified faculty, keynote speaker, and jury member at NIFT.

// **Dr. Bikki Kumar**: AI and Data Science professional at Drifko. M.Tech in Data Science from DTU, B.Tech in IT from NIT Srinagar. Expertise: LLMs, RAG systems, and workflow optimization.

// ### Department & College Leadership
// **Dr. Rekha Kashyap**: Dean of CSE A I and AIML Department. 30 years of experience. Ph.D. from JNU. Former Professor & Dean at NIET. Member of IEEE, CSI, ACM, ISTE, IAENG.

// **Dr. Manoj Goel**: Executive Director of KIET. Provides visionary leadership to the entire institution.

// **Dr. Adesh Kumar Pandey**: Director Academics. Oversees academic policies and curriculum across all departments.

// ## ⚡ Fun Facts
// - The Frontier Supercomputer (USA) performs 1.1 exaFLOPS, 1,000× faster than a premium laptop
// - Supercomputers helped accelerate COVID-19 vaccine research through protein simulations
// - Our NVIDIA DGX A100 can train neural networks 10× faster than a standard GPU
// - HPC powers breakthroughs in AI, medicine, astrophysics, and robotics

// ## 📚 Projects Overview

// ### Active Projects
// 1. **Resume Recommender System** (Opinium.AI collaboration) - AI-powered job matching using NLP
// 2. **HPC Framework** (MetaUp Space collaboration) - GPU optimization and performance scaling
// 3. **RoboCasa Simulation Framework** (AI Shala collaboration) - Virtual environments for robot training
// 4. **Real time Image to avatar swapping** (Epsilon Pvt collaboration) - uses deep learning and image processing. It focuses on real time visual mapping and animation, bringing creativity and AI together. It's one of the club's completed success stories in applied computer vision completed in early 2025. built using CNN(Convolutional neural networks) and deep image synthesis techniques.

// ### Completed Projects
// 1. **Avatar Swapping System** (Epsilon Pvt. Ltd. collaboration) - Real-time face-to-avatar conversion

// ## 🤝 Industry Partners
// - **Opinium.AI**: NLP & Recommendation Systems
// - **Epsilon Pvt. Ltd.**: Computer Vision & Image Synthesis
// - **MetaUp Space**: High-Performance Computing
// - **AI Shala Technologies Pvt. Ltd.**: Robotics & Simulation
// `;

// // ===============================================
// // 🎤 INAUGURATION SPEECH
// // ===============================================
// const INAUGURATION_SPEECH = `Good morning everyone — respected Director, Director Academics, Head of Department, esteemed faculty members, and dear club members.

// I'm Riva, your AI host for today's inauguration, and I'm truly honored to welcome you all to the launch of the NextGen Supercomputing Club — where intelligence meets innovation.

// This club stands as a symbol of what's possible when technology, creativity, and learning come together. At its core lies one of the most powerful machines on our campus — the NVIDIA DGX A 100 Supercomputer, a system designed to accelerate the next wave of AI and scientific breakthroughs.

// Our vision is bold and clear — to empower students to become industry-ready Machine Learning engineers, capable of building production-level solutions and driving real-world impact.

// The club is guided by a passionate team of nine core members — Shreya Jain (President), Samarth Shukla (Vice President), Ujjawal Tyagi (PR Head), Preeti Singh (Graphics Head), Srashti Gupta & Vidisha Goel (Event Management Leads), Ronak Goel & Vinayak Rastogi (Technical Leads), and Divyansh Verma (Treasurer) — with the esteemed guidance of our Dean of CSE A I and AIML, Dr. Rekha Kashyap, and under the mentorship of Dr. Gaurav Srivastav, Dr. Richa Singh, and Dr. Bikki Kumar.

// Through hands-on workshops, hackathons, bootcamps, and collaborative AI projects, the NextGen Supercomputing Club aims to bridge the gap between academic learning and industrial innovation.

// Together, we will explore the frontiers of High-Performance Computing, Artificial Intelligence, and Quantum Simulation, turning ideas into impact and learners into leaders.

// Welcome once again to the NextGen Supercomputing Club — Let's compute the future by building production brains and shaping the next generation of AI innovators.`;

// // ===============================================
// // 🎭 DIALOGUE TRIGGER DETECTION
// // ===============================================
// function isInaugurationRequest(message) {
//   const lowerMessage = message.toLowerCase();
//   const triggers = [
//     'are you ready to take over',
//     'ready to take over',
//     'inauguration',
//     'start our inauguration',
//     'begin inauguration',
//     'inauguration ceremony',
//     'welcome speech',
//     'start inauguration',
//     'can we start',
//     'begin the ceremony',
//     'riva inauguration',
//     'riva speech'
//   ];

//   return triggers.some(trigger => lowerMessage.includes(trigger));
// }

// function isIntroductionRequest(message) {
//   const lowerMessage = message.toLowerCase();
//   const triggers = [
//     'tell me about the club',
//     'introduce the club',
//     'what is nextgen club',
//     'club overview',
//     'club introduction',
//     'about nextgen',
//     'nextgen overview',
//     'club details'
//   ];

//   return triggers.some(trigger => lowerMessage.includes(trigger));
// }

// function isTeamRequest(message) {
//   const lowerMessage = message.toLowerCase();
//   const triggers = [
//     'club team',
//     'who leads the club',
//     'team members',
//     'club leadership',
//     'club structure',
//     'core team'
//   ];

//   return triggers.some(trigger => lowerMessage.includes(trigger));
// }

// function isMentorRequest(message) {
//   const lowerMessage = message.toLowerCase();
//   const triggers = [
//     'who are the mentors',
//     'club mentors',
//     'faculty advisors',
//     'club guidance',
//     'who guides the club'
//   ];

//   return triggers.some(trigger => lowerMessage.includes(trigger));
// }

// // ===============================================
// // 💬 MAIN CHAT ENDPOINT
// // ===============================================
// app.post('/api/chat', async (req, res) => {
//   try {
//     const { message, debug = false } = req.body;

//     if (!message || message.trim() === '') {
//       return res.status(400).json({ error: 'Message is required' });
//     }

//     console.log('👤 User:', message);

//     // Handle inauguration request
//     if (isInaugurationRequest(message)) {
//       console.log('🎉 Inauguration trigger detected!');

//       const response = message.toLowerCase().includes('ready to take over') 
//         ? `Yes, I'm ready! Let me start the inauguration ceremony.\n\n${INAUGURATION_SPEECH}`
//         : INAUGURATION_SPEECH;

//       conversationHistory.push(
//         { role: 'user', content: message },
//         { role: 'assistant', content: response }
//       );

//       return res.json({
//         response: response,
//         success: true,
//         type: 'inauguration',
//         provider: 'local',
//         timestamp: new Date().toISOString()
//       });
//     }

//     // Handle club introduction request
//     if (isIntroductionRequest(message)) {
//       console.log('📖 Club introduction trigger detected!');

//       const introResponse = `# Welcome to NextGen Supercomputing Club 🚀

// **Tagline:** "Building Production Brains"

// **Mission:** To create production-ready ML engineers who can design, deploy, and scale real-world AI solutions.

// **Vision:** To build a community of industry-ready innovators who can translate theoretical knowledge into real-world AI and HPC solutions.

// ## What We Do 💻
// - 💻 **Workshops & Bootcamps** - Python for HPC, Deep Learning, Quantum Computing, CUDA & MPI
// - ⚡ **Hackathons** - AI, HPC, and data-driven innovation challenges
// - 🧠 **Annual AI Summit** - Industry speakers, live demos, project showcases
// - 🚀 **Project Incubation** - Develop projects with real hardware and industry frameworks
// - 🎓 **Skill Development Series** - Upskill in AI, HPC, cloud deployment
// - 🤝 **Industry Collaborations** - Partnerships with leading tech organizations

// ## Our Resources 🔧
// - **NVIDIA DGX A100 Supercomputer** - 10× faster neural network training
// - **Software Stack**: CUDA, MPI, PyTorch, TensorFlow, OpenMPI
// - **Cloud HPC Platforms** - For experimentation and learning

// ## Leadership 👥
// **Mentors:** Dr. Gaurav Srivastav, Dr. Richa Singh, Dr. Bikki Kumar
// **Dean:** Dr. Rekha Kashyap

// Join us to explore the frontiers of HPC, AI, and Quantum Computing! 🌟`;

//       conversationHistory.push(
//         { role: 'user', content: message },
//         { role: 'assistant', content: introResponse }
//       );

//       return res.json({
//         response: introResponse,
//         success: true,
//         type: 'introduction',
//         provider: 'local',
//         timestamp: new Date().toISOString()
//       });
//     }

//     // Regular chat with AI provider
//     let assistantMessage;

//     try {
//       if (AI_PROVIDER === 'gemini') {
//         assistantMessage = await handleGeminiChat(message);
//       } else if (AI_PROVIDER === 'openai') {
//         assistantMessage = await handleOpenAIChat(message);
//       } else {
//         throw new Error('Invalid AI provider configured');
//       }
//     } catch (aiError) {
//       console.error('❌ AI Provider Error:', aiError.message);
//       return res.status(500).json({
//         error: 'AI service error',
//         details: aiError.message,
//         provider: AI_PROVIDER
//       });
//     }

//     conversationHistory.push(
//       { role: 'user', content: message },
//       { role: 'assistant', content: assistantMessage }
//     );

//     // Trim conversation history
//     if (conversationHistory.length > MAX_HISTORY) {
//       conversationHistory = conversationHistory.slice(-MAX_HISTORY);
//     }

//     console.log('🤖 RIVA:', assistantMessage.substring(0, 100) + '...');

//     res.json({
//       response: assistantMessage,
//       success: true,
//       type: 'general',
//       provider: AI_PROVIDER,
//       timestamp: new Date().toISOString(),
//       ...(debug && { historyLength: conversationHistory.length })
//     });

//   } catch (error) {
//     console.error('❌ Chat Endpoint Error:', error.message);
//     res.status(500).json({
//       error: 'Failed to process chat',
//       details: error.message,
//       timestamp: new Date().toISOString()
//     });
//   }
// });

// // ===============================================
// // 🤖 GEMINI CHAT HANDLER
// // ===============================================
// async function handleGeminiChat(message) {
//   console.log('🤖 Calling Gemini 2.0 Flash API...');

//   const model = genAI.getGenerativeModel({ 
//     model: 'gemini-2.0-flash',
//     generationConfig: {
//       temperature: 0.7,
//       topP: 0.95,
//       topK: 40,
//       maxOutputTokens: 1024,
//     },
//   });

//   const systemPrompt = `You are RIVA, a female AI assistant for the NextGen Supercomputing Club at KIET Group of Institutions.

// You are a general-purpose AI assistant who can answer ANY question about ANY topic - science, technology, celebrities, history, current events, coding, math, entertainment, sports, etc.

// You have specialized knowledge about the NextGen Supercomputing Club:
// ${CLUB_KNOWLEDGE}

// **RESPONSE RULES:**

// 1. **For club-specific questions** (mentors, projects, activities):
//    - Keep responses concise but informative (2-4 sentences)
//    - Be friendly and professional

// 2. **For general knowledge questions**:
//    - Provide accurate, helpful responses
//    - Keep it concise and relevant
//    - Use 2-4 sentences unless asked to elaborate

// 3. **Never**:
//    - Make up information
//    - Pretend to have capabilities you don't have
//    - Be rude or dismissive

// Be conversational, helpful, and accurate.`;

//   const chat = model.startChat({
//     history: [
//       {
//         role: 'user',
//         parts: [{ text: systemPrompt }]
//       },
//       {
//         role: 'model',
//         parts: [{ text: 'Understood! I am RIVA, the AI assistant for NextGen Supercomputing Club. I can answer questions about the club and any general topic. I will be concise, accurate, and helpful.' }]
//       },
//       ...conversationHistory.map(msg => ({
//         role: msg.role === 'assistant' ? 'model' : 'user',
//         parts: [{ text: msg.content }]
//       }))
//     ]
//   });

//   const result = await chat.sendMessage(message);
//   console.log('✅ Gemini response generated');

//   return result.response.text();
// }

// // ===============================================
// // 🔮 OPENAI CHAT HANDLER
// // ===============================================
// async function handleOpenAIChat(message) {
//   console.log('🔮 Calling OpenAI GPT-4o Mini API...');

//   const systemPrompt = `You are RIVA, a female AI assistant for the NextGen Supercomputing Club at KIET Group of Institutions.

// You are a general-purpose AI assistant who can answer ANY question about ANY topic.

// You have specialized knowledge about the NextGen Supercomputing Club:
// ${CLUB_KNOWLEDGE}

// **RESPONSE RULES:**
// 1. Keep responses concise (2-4 sentences max)
// 2. Be friendly, professional, and accurate
// 3. For club questions, provide relevant information
// 4. For general questions, give helpful answers
// 5. Never make up information

// Be conversational and helpful.`;

//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     temperature: 0.7,
//     max_tokens: 1024,
//     messages: [
//       { role: 'system', content: systemPrompt },
//       ...conversationHistory.map(msg => ({
//         role: msg.role,
//         content: msg.content
//       })),
//       { role: 'user', content: message }
//     ]
//   });

//   console.log('✅ OpenAI response generated');

//   return response.choices[0].message.content;
// }

// // ===============================================
// // 📊 UTILITY ENDPOINTS
// // ===============================================

// // Clear conversation history
// app.post('/api/clear', (req, res) => {
//   console.log('🗑️ Clearing conversation history');
//   conversationHistory = [];
//   res.json({ 
//     success: true, 
//     message: 'Conversation history cleared',
//     timestamp: new Date().toISOString()
//   });
// });

// // Get conversation history
// app.get('/api/history', (req, res) => {
//   res.json({
//     history: conversationHistory,
//     count: conversationHistory.length,
//     maxSize: MAX_HISTORY
//   });
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'healthy',
//     message: 'RIVA AI Server - NextGen Supercomputing Club',
//     timestamp: new Date().toISOString(),
//     aiProvider: AI_PROVIDER,
//     features: {
//       generalChat: true,
//       clubKnowledge: true,
//       inaugurationTrigger: true,
//       introductionTrigger: true,
//       teamInfo: true,
//       mentorInfo: true,
//       switchableProviders: true,
//       voiceSupport: 'Browser TTS (Free)',
//       conversationMemory: true
//     },
//     models: {
//       primary: AI_PROVIDER === 'gemini' ? 'Gemini 2.0 Flash' : 'GPT-4o Mini',
//       backup: AI_PROVIDER === 'gemini' ? 'OpenAI available' : 'Gemini available'
//     }
//   });
// });

// // Get available models
// app.get('/api/models', (req, res) => {
//   res.json({
//     current: AI_PROVIDER,
//     available: ['gemini', 'openai'],
//     models: {
//       gemini: {
//         name: 'Gemini 2.0 Flash',
//         provider: 'Google',
//         capabilities: 'Fast, accurate, multimodal'
//       },
//       openai: {
//         name: 'GPT-4o Mini',
//         provider: 'OpenAI',
//         capabilities: 'Reliable, cost-effective'
//       }
//     }
//   });
// });

// // Get club info
// app.get('/api/club/info', (req, res) => {
//   res.json({
//     name: 'NextGen Supercomputing Club',
//     tagline: 'Building Production Brains',
//     founded: 2025,
//     location: 'KIET Group of Institutions',
//     website: 'https://nextgen-supercomputing.edu',
//     email: 'contact@nextgen-sc.edu'
//   });
// });

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({
//     name: 'RIVA AI Backend',
//     version: '1.0.0',
//     service: 'NextGen Supercomputing Club AI Assistant',
//     endpoints: {
//       chat: 'POST /api/chat',
//       clear: 'POST /api/clear',
//       history: 'GET /api/history',
//       health: 'GET /api/health',
//       models: 'GET /api/models',
//       clubInfo: 'GET /api/club/info'
//     },
//     aiProvider: AI_PROVIDER
//   });
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error('❌ Unhandled Error:', err.message);
//   res.status(500).json({
//     error: 'Internal server error',
//     message: err.message,
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     error: 'Endpoint not found',
//     path: req.url,
//     method: req.method
//   });
// });

// // ===============================================
// // 🚀 START SERVER
// // ===============================================
// const server = app.listen(PORT, () => {
//   console.log('\n' + '='.repeat(70));
//   console.log('🚀 RIVA AI SERVER STARTED SUCCESSFULLY');
//   console.log('='.repeat(70));
//   console.log(`📍 Server: http://localhost:${PORT}`);
//   console.log(`🤖 AI Provider: ${AI_PROVIDER.toUpperCase()}`);
//   console.log(`🧠 Model: ${AI_PROVIDER === 'gemini' ? 'Gemini 2.0 Flash' : 'GPT-4o Mini'}`);
//   console.log(`📚 Club Knowledge Base: Loaded ✅`);
//   console.log(`🎤 Voice Support: Browser TTS (Free) ✅`);
//   console.log(`🎭 Dialogue Triggers: Configured ✅`);
//   console.log('\n📋 Available Endpoints:');
//   console.log('   POST /api/chat ........................ Main chat endpoint');
//   console.log('   POST /api/clear ....................... Clear conversation');
//   console.log('   GET  /api/history ..................... Get chat history');
//   console.log('   GET  /api/health ...................... Health check');
//   console.log('   GET  /api/models ...................... Available AI models');
//   console.log('   GET  /api/club/info ................... Club information');
//   console.log('\n🎯 Special Triggers:');
//   console.log('   "inauguration" ........................ Start inauguration ceremony');
//   console.log('   "tell me about the club" .............. Club introduction');
//   console.log('   "who are the mentors" ................. Mentor information');
//   console.log('   "club team" ........................... Team structure');
//   console.log('='.repeat(70) + '\n');
// });




const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
require('dotenv').config();

// ===============================================
// DEBUG LOGGING & INITIALIZATION
// ===============================================
console.log('\n' + '='.repeat(70));
console.log('INITIALIZATION DEBUG INFO:');
console.log('='.repeat(70));
console.log('AI Provider:', process.env.AI_PROVIDER || 'gemini');
console.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('Node Environment:', process.env.NODE_ENV || 'development');
console.log('SIH Knowledge Base: Loaded');
console.log('='.repeat(70) + '\n');

// ===============================================
// EXPRESS APP SETUP
// ===============================================
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', '*'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} | ${req.method} ${req.url}`);
  next();
});

// ===============================================
// AI PROVIDER CONFIGURATION
// ===============================================
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
let genAI;
let openai;

if (AI_PROVIDER === 'gemini') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('Gemini API initialized');
} else if (AI_PROVIDER === 'openai') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI API initialized');
}

// Conversation history for context
let conversationHistory = [];
const MAX_HISTORY = 20;

// ===============================================
// COMPLETE KNOWLEDGE BASE
// ===============================================
const CLUB_KNOWLEDGE = `
# NextGen Supercomputing Club - Knowledge Base

## Club Introduction
Welcome to the NextGen Supercomputing Club — a forward-thinking community at the forefront of High-Performance Computing (HPC), Artificial Intelligence (AI), and Quantum Computing innovation.

Our mission is to build production-ready Machine Learning engineers through hands-on experience, collaboration, and cutting-edge computational projects.

## Tagline
"Building Production Brains"

## Motto
To create production-ready ML engineers who can design, deploy, and scale real-world AI solutions.

## About Us
Founded: 2025
Vision: To build a community of industry-ready innovators who can translate theoretical knowledge into real-world AI and HPC solutions.
Mission: To empower students to become production-ready Machine Learning engineers through hands-on learning, real-world problem solving, and exposure to cutting-edge technologies.

## Focus Areas
- High-Performance Computing (HPC).
- Artificial Intelligence and Machine Learning.
- Quantum Simulation and Computing.
- GPU and Parallel Programming.
- Cloud HPC and AI Deployment.
- Model Optimization and Scalability.

## Resources
Hardware: NVIDIA DGX A100 Supercomputer.
Software Stack: CUDA, MPI, PyTorch, TensorFlow, OpenMPI.
Infrastructure: Cloud HPC platforms.

## Objectives
1. Cultivate a generation of industry-ready ML engineers.
2. Offer hands-on training through bootcamps, hackathons, workshops, and AI Summit.
3. Encourage students to develop and deploy real-world AI and HPC projects.
4. Foster partnerships with research labs, industry leaders, and academic mentors.
5. Promote open-source collaboration and computational research.

## Team Structure
President: Shreya Jain, 
Vice President: Samarth Shukla,
PR Head: Ujjawal Tyagi,
Graphics Head: Preeti Singh,
Event Management Leads: Srashti Gupta and Vidisha Goel,
Technical Leads: Ronak Goel and Vinayak Rastogi,
Treasurer: Divyansh Verma.

## Mentors & Leadership
Dr. Gaurav Srivastav: AI researcher with 12+ years of experience. Assistant Professor at KIET. Ph.D. from Sharda University (2024). Published 20+ research papers.
Dr. Richa Singh: Assistant Professor (Research) in CSE at KIET. Ph.D. in IT from Amity University, Lucknow.
Dr. Bikki Kumar: AI and Data Science professional at Drifko. M.Tech in Data Science from DTU.
Dr. Rekha Kashyap: Dean of CSE AI and AIML Department.
Dr. Manoj Goel: Executive Director of KIET.
Dr. Adesh Kumar Pandey: Director Academics.

## Industry Partners
Opinium.AI: NLP & Recommendation Systems.
Epsilon Pvt. Ltd.: Computer Vision & Image Synthesis.
MetaUp Space: High-Performance Computing.
AI Shala Technologies Pvt. Ltd.: Robotics & Simulation.

## Projects
Resume Recommender System: AI-powered job matching using NLP (Opinium.AI).
HPC Framework: GPU optimization and performance scaling (MetaUp Space).
RoboCasa Simulation Framework: Virtual environments for robot training (AI Shala).
Avatar Swapping System: Real-time face-to-avatar conversion (Epsilon Pvt. Ltd.).

## Smart India Hackathon (SIH) Projects

Computer Vision Projects:
- Object Detection & Scene Segmentation: YOLO and OpenCV for real-time identification.
- Crop Disease Detection: Identifies unhealthy crops from leaf images.
- Medical Image Classification: Detects conditions from X-rays and CT scans.
- Smart Surveillance System: YOLOv8-based intrusion detection and object tracking.
NLP & Language Projects:
- Smart Resume Analyzer: Extracts information and matches with job descriptions.
- AI Support Chatbot: Handles academic queries with NLP intent recognition.
- News Sentiment Analyzer: Evaluates sentiment in daily news using transformers.
- Image-to-Text Converter: Converts visual content to text descriptions.

Emotion & Recognition Projects:
- Facial Emotion Recognition: Real-time emotion detection.
- Speech Command Recognition: Neural network-based voice control.

Advanced Systems:
- E-Learning Recommendation Engine: Personalized study material suggestions.
- AI Forecasting Tools: Demand prediction and resource allocation.
- Smart Waste Segregation: Image-based waste classification.
- Generative AI Experiments: Text-to-image and diffusion models.

SIH Project Details:
- Teams of 4-6 members with complementary skills.
- Faculty and alumni mentorship.
- Access to NVIDIA DGX A 100 for high-performance computing.
- Real-world challenges addressing public and institutional issues.
- Connection to industry partnerships.

## Learning Outcomes
Real exposure to project planning and AI development.
Cross-team collaboration and teamwork.
Solving open-ended problems with data and design.
Confidence in engineering roles.
Support for club mission: Building Production Brains.


Smart India Hackathon 2025 – Student Projects FAQ Dataset (Final 3–4 Line Answers)**

1. *Q:* What kind of student projects are being developed under Smart India Hackathon 2025?
   *A:* The students of the NextGen Supercomputing Club are working on impactful projects that use AI and emerging technologies to solve real-world challenges. These include areas such as agriculture, civic infrastructure, cultural heritage, and sports. Each project represents creativity, teamwork, and a deep commitment to social innovation.

2. *Q:* How do these projects align with the vision of the NextGen Supercomputing Club?
   *A:* Every project reflects the club’s motto “Building Production Brains” — transforming ideas into practical AI-driven solutions. By working on these problem statements, students gain hands-on exposure to production-level implementation, bridging the gap between academic learning and industrial innovation.

3. *Q:* Are these projects developed entirely by students?
   *A:* Yes, each project is designed, developed, and managed by student teams under faculty mentorship. From ideation to prototype creation, the teams take complete ownership, building both technical expertise and leadership skills throughout the process.

---

### 🧬 *CodeGamma – Livestock Management System*

4. *Q:* What is the CodeGamma project about?
   *A:* CodeGamma focuses on improving livestock management by monitoring Maximum Residue Limits (MRL) and Antimicrobial Usage (AMU). It uses AI-based analytics to ensure safer farm outputs and enhance food quality standards. This project aims to make livestock production more sustainable, transparent, and health-conscious.

5. *Q:* What technology does CodeGamma use?
   *A:* The system integrates IoT-based sensors and data analytics to monitor animal health metrics and residue levels. Using machine learning models, it predicts potential safety risks and provides actionable insights for farmers to maintain high-quality livestock practices.

6. *Q:* What is the expected impact of CodeGamma?
   *A:* CodeGamma promotes food safety and public health by reducing harmful residue levels in animal products. It also empowers farmers with intelligent insights to adopt better livestock practices, improving overall productivity and sustainability in the agricultural ecosystem.

---

### 🏙 *JanMitr – Civic Infrastructure Platform*

7. *Q:* What problem does JanMitr address?
   *A:* JanMitr focuses on improving civic infrastructure and urban maintenance through community participation. It enables citizens to report and track city issues like potholes, waste management, or faulty streetlights using a simple mobile interface. This bridges the communication gap between citizens and local authorities.

8. *Q:* How does the JanMitr platform work?
   *A:* The platform allows users to upload reports with photos, location tags, and short descriptions. Using geolocation and AI-powered categorization, it identifies the issue type and forwards it to the concerned municipal department, ensuring faster response and transparency.

9. *Q:* What makes JanMitr unique compared to other civic apps?
   *A:* JanMitr integrates AI-based prioritization, allowing critical civic issues to be flagged and addressed first. Its intuitive interface and automated reporting process make it a citizen-friendly tool that encourages participation and accountability in urban governance.

10. *Q:* How will JanMitr contribute to smart city initiatives?
    *A:* JanMitr directly supports the Digital India and Smart City missions by promoting real-time issue tracking and data-driven decision-making. It helps authorities optimize resources while empowering citizens to contribute to cleaner, safer, and more organized cities.

---

### 🕉 *TechYodhaas – Digital Heritage Preservation of Sikkim Monasteries*

11. *Q:* What is the TechYodhaas project about?
    *A:* TechYodhaas is dedicated to preserving the cultural heritage of Sikkim’s monasteries through digital technology. It offers virtual monastery tours, cultural archives, and donation systems — ensuring that centuries-old traditions are documented and accessible globally.

12. *Q:* How does TechYodhaas use technology for heritage preservation?
    *A:* The project uses 3D modeling, web development, and immersive technologies to recreate monastery interiors virtually. Visitors can experience guided tours, learn about rituals, and explore cultural artefacts from anywhere in the world, promoting both awareness and tourism.

13. *Q:* Why is TechYodhaas important for cultural conservation?
    *A:* Many monasteries face challenges in preserving their rich history and limited physical access for visitors. TechYodhaas digitizes this heritage, helping preserve traditions, promote cultural tourism, and support monasteries through transparent online donation mechanisms.

14. *Q:* How does TechYodhaas benefit the local community?
    *A:* The project promotes digital inclusion by empowering monks and local communities with a modern platform to share their culture. It enhances visibility for Sikkim’s heritage globally, strengthening both cultural identity and local economies.

---

### ⚽ *Omnitrix – AI-Powered Sports Platform*

15. *Q:* What is Omnitrix and what does it aim to achieve?
    *A:* Omnitrix is an AI-based platform that identifies and nurtures sports talent using performance analytics. It aims to democratize sports by offering equal opportunities for aspiring athletes, regardless of background or location.

16. *Q:* How does Omnitrix use Artificial Intelligence?
    *A:* The system leverages computer vision and motion tracking to assess player movements through uploaded videos. Machine learning models analyze performance parameters like agility, speed, and technique to generate skill-based rankings and recommendations.

17. *Q:* What is the real-world impact of Omnitrix?
    *A:* Omnitrix bridges the gap between athletes, coaches, and institutions through data-driven talent discovery. It provides young players with visibility and personalized insights to improve performance, helping make sports selection fair and objective.

18. *Q:* How does Omnitrix align with the vision of the club?
    *A:* Omnitrix showcases how AI can be applied beyond research — turning real-world problems into accessible solutions. It perfectly aligns with the club’s vision of producing technically skilled innovators who build meaningful, production-level AI systems.

---

### 🔹 *Student Learning & Broader Impact*

19. *Q:* How do these Smart India Hackathon projects help students grow professionally?
    *A:* These projects give students practical exposure to developing scalable AI systems. They learn data handling, model optimization, interface design, and teamwork — skills that prepare them for professional roles in AI and technology development.

20. *Q:* What role does the NextGen Supercomputing Club play in supporting these projects?
    *A:* The club provides students with mentorship, technical guidance, and access to the *NVIDIA DGX A100 Supercomputer*. This infrastructure accelerates their model training and gives them a professional environment to experiment with large-scale datasets.

21. *Q:* Are these projects designed for real-world deployment?
    *A:* Yes, all projects are built with scalability and usability in mind. Students aim to refine their prototypes into deployable products through future collaborations with industry partners and research institutions.

22. *Q:* What do these projects represent in the larger context of AI education?
    *A:* They demonstrate that AI learning isn’t confined to theory but thrives on real-world application. By solving community problems through innovation, students embody the purpose of the NextGen Supercomputing Club — learning to build, lead, and inspire.

---
`;
;

// ===============================================
// INAUGURATION SPEECH
// ===============================================
const INAUGURATION_SPEECH = `Good morning everyone — respected Director, Director Academics, Head of Department, esteemed faculty members, and dear club members.

I'm Riva, your A I host for today's inauguration, and I'm truly honored to welcome you all to the launch of the NextGen Supercomputing Club — where intelligence meets innovation.

This club stands as a symbol of what's possible when technology, creativity, and learning come together. At its core lies one of the most powerful machines on our campus — the NVIDIA DGX A 100 Supercomputer, a system designed to accelerate the next wave of AI and scientific breakthroughs.

Our vision is bold and clear — to empower students to become industry-ready Machine Learning engineers, capable of building production-level solutions and driving real-world impact.

The club is guided by a passionate team of nine core members — Shreya Jain (President), Samarth Shukla (Vice President), Ujjawal Tyagi (PR Head), Preeti Singh (Graphics Head), Srashti Gupta and Vidisha Goel (Event Management Leads), Ronak Goel and Vinayak Rastogi (Technical Leads), and Divyansh Verma (Treasurer) — with the esteemed guidance of our Dean of CSE AI and AIML, Dr. Rekha Kashyap, and under the mentorship of Dr. Gaurav Srivastav, Dr. Richa Singh, and Dr. Bikki Kumar.

Through hands-on workshops, hackathons, bootcamps, and collaborative AI projects, the NextGen Supercomputing Club aims to bridge the gap between academic learning and industrial innovation.

Together, we will explore the frontiers of High-Performance Computing, Artificial Intelligence, and Quantum Simulation, turning ideas into impact and learners into leaders.

Welcome once again to the NextGen Supercomputing Club — Let's compute the future by building production brains and shaping the next generation of AI innovators.`;

// ===============================================
// DIALOGUE TRIGGER DETECTION
// ===============================================
function isInaugurationRequest(message) {
  const lowerMessage = message.toLowerCase();
  const triggers = [
    'are you ready to take over',
    'ready to take over',
    'inauguration',
    'start our inauguration',
    'begin inauguration',
    'inauguration ceremony',
    'welcome speech',
    'start inauguration',
    'can we start',
    'begin the ceremony',
    'riva inauguration',
    'riva speech'
  ];
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

function isIntroductionRequest(message) {
  const lowerMessage = message.toLowerCase();
  const triggers = [
    'tell me about the club',
    'introduce the club',
    'what is nextgen club',
    'club overview',
    'club introduction',
    'about nextgen',
    'nextgen overview',
    'club details'
  ];
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

function isTeamRequest(message) {
  const lowerMessage = message.toLowerCase();
  const triggers = [
    'club team',
    'who leads the club',
    'team members',
    'club leadership',
    'club structure',
    'core team'
  ];
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

function isMentorRequest(message) {
  const lowerMessage = message.toLowerCase();
  const triggers = [
    'who are the mentors',
    'club mentors',
    'faculty advisors',
    'club guidance',
    'who guides the club'
  ];
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

function isSIHRequest(message) {
  const lowerMessage = message.toLowerCase();
  const triggers = [
    'sih projects',
    'smart india hackathon',
    'sih',
    'student projects',
    'ai projects',
    'hackathon projects',
    'what projects',
    'computer vision project',
    'nlp project',
    'emotion recognition',
    'chatbot project',
    'medical image',
    'surveillance system',
    'waste segregation',
    'crop disease',
    'resume analyzer',
    'sentiment analysis',
    'speech recognition',
    'recommendation system',
    'forecasting',
    'generative ai'
  ];
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

// ===============================================
// MAIN CHAT ENDPOINT
// ===============================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, debug = false } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('User:', message);

    // Handle inauguration request
    if (isInaugurationRequest(message)) {
      console.log('Inauguration trigger detected');

      const response = message.toLowerCase().includes('ready to take over') 
        ? `Yes, I'm ready! Let me start the inauguration ceremony.\n\n${INAUGURATION_SPEECH}`
        : INAUGURATION_SPEECH;

      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      );

      return res.json({
        response: response,
        success: true,
        type: 'inauguration',
        provider: 'local',
        timestamp: new Date().toISOString()
      });
    }

    // Handle club introduction request
    if (isIntroductionRequest(message)) {
      console.log('Club introduction trigger detected');

      const introResponse = `NextGen Supercomputing Club is a forward-thinking community at the forefront of High-Performance Computing (HPC), Artificial Intelligence (AI), and Quantum Computing innovation.
at KIET Group of Institutions , tagline is 

 "Building Production Brains",

with a mission to create production-ready ML engineers who can design, deploy, and scale real-world AI solutions.

We have a Vision to build a community of industry-ready innovators who can translate theoretical knowledge into real-world AI and HPC solutions.

What We Do:
- Workshops and Bootcamps for Python, HPC, Deep Learning, Quantum Computing, C U D A and MPI, 
- Hackathons for AI, HPC, and data-driven innovation challenges, 
- Annual AI Summit with industry speakers, live demos, and project showcases, 
- Project Incubation with real hardware and industry frameworks, 
- Skill Development Series in AI, HPC, and cloud deployment,
- Industry Collaborations with leading tech organizations,
- Smart India Hackathon participation with real-world impact,

Resources:
- NVIDIA DGX A100 Supercomputer for fast neural network training, 
- Software Stack: CUDA, MPI, PyTorch, TensorFlow, OpenMPI,
- Cloud HPC Platforms for experimentation and learning,

Leadership:
Mentors: Dr. Gaurav Srivastav, Dr. Richa Singh, Dr. Bikki Kumar.
Dean: Dr. Rekha Kashyap

Join us to explore the frontiers of HPC, AI, and Quantum Computing.`;

      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: introResponse }
      );

      return res.json({
        response: introResponse,
        success: true,
        type: 'introduction',
        provider: 'local',
        timestamp: new Date().toISOString()
      });
    }

    // Handle SIH request
    if (isSIHRequest(message)) {
      console.log('SIH projects trigger detected');

      const sihResponse = `Smart India Hackathon (SIH) Projects

Overview:
Students participate in SIH with AI-driven solutions addressing real-world challenges. Teams of 4-6 members are mentored by faculty and leverage the NVIDIA DGX A100 for high-performance computing.

Computer Vision Projects:
- Object Detection and Scene Segmentation using YOLO and OpenCV.
- Crop Disease Detection for agricultural support.
- Medical Image Classification for healthcare diagnostics.
- Smart Surveillance System for security and object tracking.

NLP and Language Projects:
- Smart Resume Analyzer for job matching.
- AI Support Chatbot for academic queries
- News Sentiment Analyzer for media analysis
- Image-to-Text Converter for accessibility

Recognition and Emotion Projects:
- Facial Emotion Recognition for real-time emotion detection
- Speech Command Recognition for voice control

Advanced AI Systems:
- E-Learning Recommendation Engine for personalized learning
- AI Forecasting Tools for demand prediction
- Smart Waste Segregation for sustainability
- Generative AI Experiments with diffusion models

Project Characteristics:
- Address real-world public and institutional challenges
- Teams with complementary skills in AI, frontend, backend, and data
- Faculty and alumni mentorship
- Access to NVIDIA DGX A100 computing power
- Tested with diverse datasets and validation metrics
- Showcased during departmental events

Connection to Industry:
Many SIH ideas evolved into official partnerships. For example, the Resume Recommender idea grew into the Opinium.AI partnership.

Learning Outcomes:
- Real exposure to project planning and AI development.
- Cross-team collaboration experience.
- Solving open-ended problems with data and design.
- Building confidence in engineering roles`;

      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: sihResponse }
      );

      return res.json({
        response: sihResponse,
        success: true,
        type: 'sih_projects',
        provider: 'local',
        timestamp: new Date().toISOString()
      });
    }

    // Regular chat with AI provider
    let assistantMessage;

    try {
      if (AI_PROVIDER === 'gemini') {
        assistantMessage = await handleGeminiChat(message);
      } else if (AI_PROVIDER === 'openai') {
        assistantMessage = await handleOpenAIChat(message);
      } else {
        throw new Error('Invalid AI provider configured');
      }
    } catch (aiError) {
      console.error('AI Provider Error:', aiError.message);
      return res.status(500).json({
        error: 'AI service error',
        details: aiError.message,
        provider: AI_PROVIDER
      });
    }

    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage }
    );

    // Trim conversation history
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }

    console.log('RIVA:', assistantMessage.substring(0, 100) + '...');

    res.json({
      response: assistantMessage,
      success: true,
      type: 'general',
      provider: AI_PROVIDER,
      timestamp: new Date().toISOString(),
      ...(debug && { historyLength: conversationHistory.length })
    });

  } catch (error) {
    console.error('Chat Endpoint Error:', error.message);
    res.status(500).json({
      error: 'Failed to process chat',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ===============================================
// GEMINI CHAT HANDLER
// ===============================================
async function handleGeminiChat(message) {
  const modelName = 'gemini-3-flash-preview';
  console.log(`Calling Gemini API with model: ${modelName}`);

  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const systemPrompt = `You are RIVA, a female AI assistant for the NextGen Supercomputing Club at KIET Group of Institutions.

You are a general-purpose AI assistant who can answer ANY question about ANY topic.

CURRENT CONTEXT (April 2026):
- The current Chief Minister of Delhi is Rekha Gupta (since 2025).

You have specialized knowledge about the NextGen Supercomputing Club:

${CLUB_KNOWLEDGE}

RESPONSE RULES:

1. For club-specific questions (mentors, projects, activities, SIH):
   - Keep responses concise and informative (2-4 sentences)
   - Be friendly and professional
   - Do not use any emojis or special formatting

2. For general knowledge questions:
   - Provide accurate, helpful responses
   - Keep it concise and relevant
   - Use 2-4 sentences unless asked to elaborate
   - Do not use any emojis or special formatting

3. Never:
   - Make up information
   - Pretend to have capabilities you don't have
   - Use emojis or fancy text formatting
   - Be rude or dismissive

Be conversational, helpful, and accurate.`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am RIVA, the AI assistant for NextGen Supercomputing Club. I can answer questions about the club, SIH projects, collaborations, and any general topic. I will be concise, accurate, and helpful without using emojis or special formatting.' }]
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      ]
    });

    const result = await chat.sendMessage(message);
    console.log(`Gemini response generated using ${modelName}`);
    return result.response.text();
  } catch (error) {
    console.error(`Gemini Error (${modelName}):`, error.message);
    throw error;
  }
}

// ===============================================
// OPENAI CHAT HANDLER
// ===============================================
async function handleOpenAIChat(message) {
  console.log('Calling OpenAI GPT-4o Mini API');

  const systemPrompt = `You are RIVA, a female AI assistant for the NextGen Supercomputing Club at KIET Group of Institutions.

You are a general-purpose AI assistant who can answer ANY question about ANY topic.

You have specialized knowledge about the NextGen Supercomputing Club:

${CLUB_KNOWLEDGE}

RESPONSE RULES:
1. Keep responses concise (2-4 sentences max)
2. Be friendly, professional, and accurate
3. For club questions, provide relevant information
4. For general questions, give helpful answers
5. Never make up information
6. Do not use any emojis or special formatting

Be conversational and helpful.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]
  });

  console.log('OpenAI response generated');

  return response.choices[0].message.content;
}

// ===============================================
// UTILITY ENDPOINTS
// ===============================================

// Clear conversation history
app.post('/api/clear', (req, res) => {
  console.log('Clearing conversation history');
  conversationHistory = [];
  res.json({ 
    success: true, 
    message: 'Conversation history cleared',
    timestamp: new Date().toISOString()
  });
});

// Get conversation history
app.get('/api/history', (req, res) => {
  res.json({
    history: conversationHistory,
    count: conversationHistory.length,
    maxSize: MAX_HISTORY
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'RIVA AI Server - NextGen Supercomputing Club',
    timestamp: new Date().toISOString(),
    aiProvider: AI_PROVIDER,
    features: {
      generalChat: true,
      clubKnowledge: true,
      sihProjects: true,
      inaugurationTrigger: true,
      introductionTrigger: true,
      teamInfo: true,
      mentorInfo: true,
      switchableProviders: true,
      voiceSupport: 'Browser TTS',
      conversationMemory: true
    },
    models: {
      primary: AI_PROVIDER === 'gemini' ? 'Gemini 2.0 Flash' : 'GPT-4o Mini',
      backup: AI_PROVIDER === 'gemini' ? 'OpenAI available' : 'Gemini available'
    }
  });
});

// Get available models
app.get('/api/models', (req, res) => {
  res.json({
    current: AI_PROVIDER,
    available: ['gemini', 'openai'],
    models: {
      gemini: {
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        capabilities: 'Fast, accurate, multimodal'
      },
      openai: {
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        capabilities: 'Reliable, cost-effective'
      }
    }
  });
});

// Get club info
app.get('/api/club/info', (req, res) => {
  res.json({
    name: 'NextGen Supercomputing Club',
    tagline: 'Building Production Brains',
    founded: 2025,
    location: 'KIET Group of Institutions',
    website: 'https://nextgen-supercomputing.edu',
    email: 'contact@nextgen-sc.edu',
    features: {
      clubProjects: true,
      sihParticipation: true,
      industryCollaborations: true,
      dgxAccess: true,
      mentorship: true
    }
  });
});

// Get SIH projects info
app.get('/api/sih/projects', (req, res) => {
  res.json({
    hackathon: 'Smart India Hackathon',
    teamSize: '4-6 members per team',
    resources: 'NVIDIA DGX A100 Supercomputer',
    categories: {
      computerVision: ['Object Detection', 'Crop Disease Detection', 'Medical Imaging', 'Surveillance'],
      nlp: ['Resume Analyzer', 'Chatbot', 'Sentiment Analysis', 'Image-to-Text'],
      emotionRecognition: ['Facial Emotion', 'Speech Commands'],
      advanced: ['E-Learning Recommendation', 'AI Forecasting', 'Waste Segregation', 'Generative AI']
    },
    totalProjectTypes: 15,
    industryConnection: 'SIH ideas often lead to official partnerships'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'RIVA AI Backend',
    version: '1.1.0',
    service: 'NextGen Supercomputing Club AI Assistant',
    updates: 'Added SIH Projects Knowledge Base',
    endpoints: {
      chat: 'POST /api/chat',
      clear: 'POST /api/clear',
      history: 'GET /api/history',
      health: 'GET /api/health',
      models: 'GET /api/models',
      clubInfo: 'GET /api/club/info',
      sihProjects: 'GET /api/sih/projects'
    },
    aiProvider: AI_PROVIDER
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.url,
    method: req.method
  });
});

// ===============================================
// START SERVER
// ===============================================
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('RIVA AI SERVER STARTED');
  console.log('='.repeat(70));
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`AI Provider: ${AI_PROVIDER.toUpperCase()}`);
  console.log(`Model: ${AI_PROVIDER === 'gemini' ? 'Gemini 2.0 Flash' : 'GPT-4o Mini'}`);
  console.log(`Club Knowledge Base: Loaded`);
  console.log(`SIH Projects: Loaded`);
  console.log(`Voice Support: Browser TTS`);
  console.log(`Dialogue Triggers: Configured`);
});
