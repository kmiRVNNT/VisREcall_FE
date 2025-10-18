# 🎨 VisRecall  
### *Search, Save, and Recall Visual References — Instantly*  

**VisRecall** is a modern **reference hub for artists**, powered by **text-to-image retrieval**.  
It lets you **search your saved images using natural language**, so you can quickly find visual references — poses, compositions, lighting setups, outfits, and more — without digging through folders.  

Think of it as your **personal visual memory**, organized by meaning instead of file names.  

---

## 🧠 What Is VisRecall?  

Artists collect thousands of reference images, but they’re hard to organize and even harder to find later.  
VisRecall fixes that by using **CLIP-based image embeddings** to understand what’s in each image — so you can search by *concept*, not keyword.  

> “Show me a low-angle shot of a samurai in rain.”  
> “Find all references with backlighting.”  
> “Pose similar to a leaping figure.”  

VisRecall retrieves the closest matches instantly, helping artists rediscover and reuse their references intuitively.  

---

## 🚀 Features  

- 🔍 **Text-to-Image Search:**  
  Find references by describing what you remember — not by browsing folders.  

- 🖼️ **Smart Image Embeddings:**  
  Every image is encoded using **CLIP** models (LAION or Danbooru variants) for semantic understanding.  

- 📂 **Reference Hub:**  
  Organize, tag, and preview your visual library in one clean dashboard.  

- 🧩 **Multi-Model Support:**  
  Switch between general-purpose and art-specific embeddings for better accuracy.  

- ⚡ **Instant Retrieval:**  
  Searches return semantically relevant results in milliseconds.  

- ☁️ **Supabase Integration (Optional):**  
  Store embeddings and metadata in the cloud for access anywhere.  

---

## 🧩 Tech Stack  

| Layer | Technology |
|--------|-------------|
| Frontend | React + TypeScript + Vite |
| Backend | Supabase (Auth + Database) |
| Embedding Engine | LAION & Danbooru CLIP Models |
| Vector Search | Supabase pgvector / local FAISS index |
| Styling | Tailwind + shadcn/ui |
| State | React Query / Zustand |

---

## 🧰 Example Use Cases  

- An artist searches **“over-the-shoulder camera angles”** and finds all relevant photo studies.  
- A character designer types **“baggy streetwear, male character”** to pull up similar fashion references.  
- A background painter recalls **“sunset cityscapes with rim light”** from months ago in seconds.  

---

## 💡 Philosophy  

VisRecall is built for artists who *collect and curate*, not generate.  
It’s meant to make your existing visual library **searchable, meaningful, and fast** — turning chaos into creativity.  

> “You don’t need AI to make art — just a better way to remember what inspires it.”  

---

## 📈 Roadmap  

| Feature | Status |
|----------|---------|
| Local text-to-image retrieval | 🟢 Working |
| Supabase cloud sync | 🟡 Planned |
| Multi-user reference sharing | 🟡 Planned |
| Embedding visualization (t-SNE map) | ⚪ Future update |
| Mobile-friendly dashboard | ⚪ Future update |

---

## 👤 Author  

**VisRecall** is developed by **KMI RVNNT**, a character artist and software engineer passionate about building tools that support real artists instead of replacing them.  

---

## 📜 License  

MIT License — open source, for artists and researchers.  
