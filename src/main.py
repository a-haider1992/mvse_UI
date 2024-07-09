# uvicorn backend.main:app --reload

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import json
import httpx
import spacy
from urllib.parse import urlparse, urljoin
import urllib.request
import requests
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup 
from urllib.parse import quote
from fastapi.responses import JSONResponse
import os
import shutil
from typing import List, Dict
from fastapi import HTTPException
from datetime import datetime
import base64
import random
from spacy.matcher import PhraseMatcher

CONFIG = {
    "PORT": 8000,
    "ASSET_FOLDER": "src/assets",
    "API_PREFIX": "/api",
    "ASSET_BASE_PATH": "src/assets",
    "PLACES_Belfast_PATH": "places_belfast",
    "POLITICIANS_PATH": "politicians",
    "SOUNDS_PATH": "Downloads/audios",
}

app = FastAPI()
    

# 设置允许跨域访问的来源（如果需要的话，可以设置为 '*'）
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 辅助函数，用于构建基于配置的文件路径
def build_asset_path(folder_type: str, folder_name: str):
    base_path = CONFIG.get("ASSET_BASE_PATH")
    if folder_type == "places_belfast":
        return os.path.join(base_path, CONFIG["PLACES_Belfast_PATH"], folder_name)
    elif folder_type == "politicians":
        return os.path.join(base_path, CONFIG["POLITICIANS_PATH"], folder_name)
    elif folder_type == "sounds":
        return os.path.join(base_path, CONFIG["SOUNDS_PATH"], folder_name)
    else:
        raise ValueError("Unknown folder type")

@app.get(CONFIG["API_PREFIX"] + "/get-first-image")
async def get_first_image(folder_name: str, folder: str = Query(None), sound: bool = Query(False)):
    folder_path = build_asset_path(folder, folder_name)
    print(folder_path)
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Folder not found")
    
    image_path = os.path.join(folder_path, '0.jpeg')
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    base_url = f"http://localhost:{CONFIG['PORT']}/assets/{folder}/{folder_name}"
    
    if folder == 'politicians' and sound:
        sound_path = os.path.join(build_asset_path("sounds", folder_name), '0.wav')
        if not os.path.exists(sound_path):
            raise HTTPException(status_code=404, detail="Sound not found")
        return {
            "imageUrl": f"{base_url}/0.jpeg",
            "soundUrl": f"http://localhost:{CONFIG['PORT']}/assets/Downloads/audios/{folder_name}/0.wav"
        }
    else:
        return {"imageUrl": f"{base_url}/0.jpeg"}
    
        
class SaveDataRequest(BaseModel):
    keywords: list[str]
    objects: list[str]
    imageUrl: str

@app.post(CONFIG["API_PREFIX"] +"/save-data")
async def save_data(request: SaveDataRequest):
    try:
        data = {
            "keywords": request.keywords,
            "objects": request.objects,
            "imageUrl": request.imageUrl,
        }
        with open("saved_data.json", "a") as file:
            file.write(json.dumps(data) + "\n")
        return {"message": "Data saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class TextRequest(BaseModel):
    text: str

@app.post(CONFIG["API_PREFIX"] +"/analyze-text/")
async def analyze_text(request: TextRequest):
    # 创建PhraseMatcher
    nlp = spacy.load("en_core_web_sm")
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    # 增加更多自定义地点
    custom_places = [
        ("INTERNATIONAL_AIRPORT", "international airport"),
        ("CITY AIRPORT", "city airport"),
        ("IRELAND", "ireland"),
        ("CITY HALL","city hall"),
        # ("city airport","airport"),
    ]

    # 为每个自定义地点创建一个spaCy文档，并添加到matcher
    for name, code in custom_places:
        place = nlp(name)
        matcher.add(code, [place])
    # title_cased_text = ' '.join(word.capitalize() for word in request.text.split())
    doc = nlp(request.text)
    subjects = []
    objects = []
    people = []
    places = []
    verbs = []

    # 检测依存关系
    for token in doc:
        if token.dep_ == "nsubj":
            subjects.append(token.text)
        elif token.dep_ == "dobj":
            objects.append(token.text)
    
    # 检测命名实体
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            people.append(ent.text)
        elif ent.label_ == "GPE":
            places.append(ent.text)

    # 使用PhraseMatcher查找自定义的多词表达式
    matches = matcher(doc)
    for match_id, start, end in matches:
        places.append(doc[start:end].text)

    # 检测动词
    for token in doc:
        if token.dep_ == "ROOT" and token.pos_ == "VERB":
            verbs.append(token.text)
    
    return {
        "subjects": subjects,
        "objects": objects,
        "people": people,
        "places": places,
        "verbs": verbs
    }

@app.get(CONFIG["API_PREFIX"] +"/api/data")
async def get_data():
    response = {"key": "value"}
    return response

class ImageResponse(BaseModel):
    image_urls: list

@app.get(CONFIG["API_PREFIX"] +"/get-images", response_model=ImageResponse)
async def get_images(query: str = Query(...), count: int = 5):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    # Encode query to use in URL
    encoded_query = quote(query)
    
    # Google image search URL
    google_search_url = f"https://www.google.com/search?tbm=isch&q={encoded_query}"
    # print(google_search_url)
    # Set user agent to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    # Send HTTP GET request to Google image search
    response = requests.get(google_search_url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    
    # Extract image URLs from the search result
    image_urls = [img['src'] for img in soup.find_all('img') if img.get('src').startswith(('http', 'https'))]
    print(len(image_urls))
    multiples_of_five = [i for i in range(1, len(image_urls)-5)]

    # 随机选择一个5的倍数
    random_multiple_of_five = random.choice(multiples_of_five)
    print(random_multiple_of_five)
    if len(image_urls) < count:
        raise HTTPException(status_code=404, detail="Not enough images found")

    return ImageResponse(image_urls=image_urls[random_multiple_of_five:random_multiple_of_five+5])


    # 定义 SelectedItemsModel
class SelectedItemsModel(BaseModel):
    matchedsound: List[str]
    matchedObjects: List[str]
    imagesPeople: List[str]
    imagesPlace: List[str]
    sounds: List[str]
    otherKeywords: List[str]
    otherObjects: List[str]
    identiPeople: Dict[str, List[str]]


def process_image(image_url: str, assets_folder: str):
    # 解析URL并获取文件名
    parsed_url = urlparse(image_url)
    file_name = os.path.basename(parsed_url.path)
    
    # 替换URL中的主机和端口部分为"backend"，假设backend目录在项目根目录下
    # 这里我们假设image_url是相对于运行在localhost:8000的FastAPI服务器的
    cleaned_url = image_url.replace(f"http://localhost:{CONFIG['PORT']}", "backend")

    # 确保目标文件夹存在
    target_folder = os.path.join(assets_folder, str(datetime.now()))
    os.makedirs(target_folder, exist_ok=True)

    # 构建完整的目标文件路径
    target_file_path = os.path.join(target_folder, file_name)

    try:
        # 从给定的URL下载图像并保存到目标路径
        response = requests.get(cleaned_url)
        response.raise_for_status()  # 确保请求成功
        with open(target_file_path, 'wb') as image_file:
            image_file.write(response.content)
    except requests.RequestException as e:
        # 如果下载失败，返回错误信息
        print(f"Error downloading image {image_url}: {e}")
        return None

    return target_file_path

def download_image(image_url,target_folder):
    """
    下载图片并存储到指定的文件夹。
    """
    try:
        response = requests.get(image_url)
            # 检查响应状态码是否为200（成功）
        if response.status_code == 200:
            # 从URL中提取文件名
            file_name = image_url[-5:]
            
            # 构建完整的目标文件路径
            target_path = os.path.join(target_folder, file_name)
            print(target_path)

            # 确保目标文件夹存在，如果不存在则创建
            os.makedirs(os.path.dirname(target_path), exist_ok=True)

            # 以二进制写入模式打开文件，并将图片的二进制数据写入文件
            with open(target_path, 'wb') as f:
                f.write(response.content)
            print(f"Image downloaded and saved to {target_path}")
            return target_path
        else:
            # 如果响应状态码不是200，抛出HTTP错误
            response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error downloading image {image_url}: {e}")

def save_mp3(mp3_url: str, assets_folder: str):
    # 替换URL中的主机和端口部分为assets_folder的相对路径
    relative_path = mp3_url.replace(f"http://localhost:{CONFIG['PORT']}", "")
    target_file_path = os.path.join(assets_folder, relative_path)
    
    # 检查目标文件夹是否存在，如果不存在则创建
    os.makedirs(os.path.dirname(target_file_path), exist_ok=True)

    # 使用当前时间创建一个唯一的文件夹名称
    now_suffix = datetime.now().strftime("%Y%m%d%H%M%S")
    
    # 构建最终的目标文件夹路径
    final_target_folder = os.path.join(assets_folder, now_suffix)
    os.makedirs(final_target_folder, exist_ok=True)
    
    # 构建最终的目标文件路径
    final_target_file_path = os.path.join(final_target_folder, os.path.basename(target_file_path))
    
    # 读取MP3文件数据
    with open(target_file_path, "rb") as audio_file:
        audio_data = audio_file.read()

    # 将MP3数据写入新文件
    with open(final_target_file_path, "wb") as f:
        f.write(audio_data)
    
    # 返回最终的目标文件路径
    return final_target_file_path

@app.post(CONFIG["API_PREFIX"] + "/submit-selections")
async def submit_selections(selected_items: SelectedItemsModel):
    # 定义使用CONFIG字典的文件夹路径
    assets_folder = os.path.join(CONFIG["ASSET_FOLDER"])
    assets_image_folder = os.path.join(assets_folder, "images")
    json_folder = os.path.join(assets_folder, "json_output")
    sound_folder = os.path.join(assets_folder, "sound")
    
    # 确保根assets文件夹存在
    os.makedirs(assets_folder, exist_ok=True)
    
    # 要清空的文件夹列表
    folders_to_empty = [assets_image_folder, json_folder, sound_folder]

    # 遍历文件夹列表并清空
    for folder in folders_to_empty:
        if os.path.exists(folder):
            shutil.rmtree(folder)
            os.makedirs(folder, exist_ok=True)

    # 将数据保存到JSON文件
    data_to_save = {
        "matchedsound": selected_items.matchedsound,
        "matchedObjects": selected_items.matchedObjects,
        "otherKeywords": selected_items.otherKeywords,
        "otherObjects": selected_items.otherObjects,
    }
    json_filename = os.path.join(json_folder, "selected_items.json")
    with open(json_filename, 'w', encoding='utf-8') as f:
        json.dump(data_to_save, f, ensure_ascii=False, indent=4)

    # 下面是处理下载图片和音频的逻辑，使用统一的函数
    downloaded_images = []
    downloaded_sounds = []

    for image_url in selected_items.imagesPeople:
        try:
            processed_image = process_image(image_url, assets_image_folder)
            downloaded_images.append(processed_image)
        except (HTTPException, ValueError) as e:
            return JSONResponse(status_code=400, content={"error": str(e)})

    for image_url in selected_items.imagesPlace:
        try:
            processed_image = process_image(image_url, assets_image_folder)
            downloaded_images.append(processed_image)
        except (HTTPException, ValueError) as e:
            return JSONResponse(status_code=400, content={"error": str(e)})

    for sound_url in selected_items.sounds:
        try:
            processed_sound = save_mp3(sound_url, sound_folder)
            downloaded_sounds.append(processed_sound)
        except (HTTPException, ValueError) as e:
            return JSONResponse(status_code=400, content={"error": str(e)})

    # 处理 identiPeople 字典并下载图片
    for person, image_urls in selected_items.identiPeople.items():
        category_folder = os.path.join(assets_image_folder, person.replace(' ', '_'))
        os.makedirs(category_folder, exist_ok=True)
        for image_url in image_urls:
            try:
                downloaded_images.append(download_image(image_url, category_folder))
            except (HTTPException, ValueError) as e:
                return JSONResponse(status_code=400, content={"error": str(e)})

    # 返回响应
    return JSONResponse(
        status_code=200,
        content={"message": "Selections processed.", "downloaded_images": downloaded_images, "downloaded_sounds": downloaded_sounds}
    )

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    # get_images('kittens')
