import os
import logging
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import chromadb
from chromadb.config import Settings
from PIL import Image
import numpy as np
from transformers import CLIPProcessor, CLIPModel
import json
import base64
from io import BytesIO
import open_clip

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Determine the device to use
if torch.backends.mps.is_available():
    device = "mps"
elif torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"
logger.info(f"Using device: {device}")

# Initialize models
try:
    logger.info("Initializing LAION CLIP model...")
    laion_model, _, laion_preprocess = open_clip.create_model_and_transforms(
        'ViT-B-32', pretrained='laion2b_s34b_b79k', device=device
    )
    logger.info("LAION CLIP model initialized successfully")
except Exception as e:
    logger.error(f"Error initializing LAION CLIP model: {str(e)}")
    raise

def embed_image(image_path: str) -> np.ndarray:
    try:
        logger.info(f"Embedding image: {image_path}")
        image = Image.open(image_path).convert("RGB")
        laion_input = laion_preprocess(image).unsqueeze(0).to(device)
        with torch.no_grad():
            laion_emb = laion_model.encode_image(laion_input)
            laion_emb = laion_emb / laion_emb.norm(dim=-1, keepdim=True)
        logger.info(f"Successfully embedded image: {image_path}")
        return laion_emb.cpu().numpy()
    except Exception as e:
        logger.error(f"Error embedding image {image_path}: {str(e)}")
        raise

def embed_text(text: str) -> np.ndarray:
    try:
        logger.info(f"Embedding text: {text}")
        laion_tokens = open_clip.tokenize([text]).to(device)
        with torch.no_grad():
            laion_emb = laion_model.encode_text(laion_tokens)
            laion_emb = laion_emb / laion_emb.norm(dim=-1, keepdim=True)
        logger.info(f"Successfully embedded text: {text}")
        return laion_emb.cpu().numpy()
    except Exception as e:
        logger.error(f"Error embedding text '{text}': {str(e)}")
        raise

def compute_similarity(query_laion: np.ndarray, image_laion: np.ndarray) -> float:
    try:
        laion_sim = float(np.dot(query_laion.flatten(), image_laion.flatten()))
        return laion_sim
    except Exception as e:
        logger.error(f"Error computing similarity: {str(e)}")
        raise

@app.post("/api/initialize")
async def initialize_database():
    try:
        logger.info("Initializing database...")
        try:
            client.delete_collection("image_collection")
            logger.info("Deleted existing collection")
        except Exception as e:
            logger.warning(f"Error deleting collection (this is normal if it doesn't exist): {str(e)}")
        collection = client.get_or_create_collection(
            name="image_collection",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("Created new collection")
        image_files = list(images_dir.glob("*"))
        logger.info(f"Found {len(image_files)} images in {images_dir}")
        if not image_files:
            logger.warning("No images found in the images directory")
            raise HTTPException(status_code=404, detail="No images found in the images directory")
        processed_count = 0
        for img_path in image_files:
            try:
                logger.info(f"Processing image: {img_path.name}")
                laion_emb = embed_image(str(img_path))
                collection.add(
                    embeddings=[laion_emb.flatten().tolist()],
                    ids=[img_path.name],
                    metadatas=[{"source": "local", "filename": img_path.name}]
                )
                processed_count += 1
                logger.info(f"Successfully processed {img_path.name}")
            except Exception as e:
                logger.error(f"Error processing {img_path.name}: {str(e)}")
                continue
        logger.info(f"Successfully initialized database with {processed_count} images")
        return {"message": f"Successfully initialized database with {processed_count} images"}
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search", response_model=List[SearchResult])
async def search_images(query: SearchQuery):
    try:
        logger.info(f"Processing search query: {query.query}")
        query_laion = embed_text(query.query)
        results = collection.get()
        logger.info(f"Retrieved {len(results['ids'])} images from collection")
        if not results['ids']:
            logger.warning("No images found in the database")
            raise HTTPException(status_code=404, detail="No images found in the database. Please initialize the database first.")
        similarities = []
        for idx, emb in enumerate(results['embeddings']):
            try:
                image_laion = np.array(emb).reshape(1, -1)
                similarity = compute_similarity(query_laion, image_laion)
                similarities.append(SearchResult(
                    imageName=results['ids'][idx],
                    similarity=similarity,
                    imageUrl=f"/images/{results['ids'][idx]}"
                ))
                logger.info(f"Computed similarity for {results['ids'][idx]}: {similarity}")
            except Exception as e:
                logger.error(f"Error processing result {idx}: {str(e)}")
                continue
        similarities.sort(key=lambda x: x.similarity, reverse=True)
        return similarities[:8]
    except Exception as e:
        logger.error(f"Error in search_images: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 