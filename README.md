# 📄 pdf.ai

**AI-powered PDF Assistant** built with cutting-edge web technologies and deployed using **Vercel Edge Functions**.

Easily query, summarize, and interact with PDFs in real time using AI.

---

## 🚀 Features

- ✨ Chat with your PDF using AI
- ⚡ Fast responses via Edge Functions (Vercel)
- 🧠 Embedding + context retrieval for smarter answers
- 🔒 Local development runs smoothly

---

## 🛠 Tech Stack

- **Next.js**
- **Vercel Edge Functions**
- **OpenAI GPT**
- **LangChain** 
- **Pinecone Vector DB**

---

## ⚠ Known Issue

> ⚠️ **Currently facing a deployment issue with Vercel Edge Functions.**  
> The app works perfectly in local development, but the deployed version is experiencing issues.  
>  
> If you're looking to contribute:
> - Clone the repository
> - Try running it locally `bun dev`/ (`npm run dev` / `yarn dev`)
> - Attempt to replicate the issue on Vercel  
>
> 👷 **All contributions are welcome!** 

---

## 🧑‍💻 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Srijan-D/pdf.ai
cd pdf.ai

# 2. Install dependencies
npm install
# or
yarn

# 3. Set up environment variables
cp .env.example .env.local .env
Add your API keys (OpenAI, etc.)

npm run dev
# or
yarn dev
```