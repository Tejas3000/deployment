# Indic-Classify: Kannada News Headline Categorization  

Indic-Classify is a deep learning project designed to automatically classify Kannada news headlines into multiple categories such as **Politics, Sports, Technology, Entertainment, Health, and more**. It addresses the gap in Natural Language Processing (NLP) tools for Indian regional languages by leveraging **transformer-based models** and deploying them as a user-friendly web app.  

---

## 🚀 Features  
- Multiclass classification of **Kannada news headlines** across 10 categories.  
- Uses **transformer models**:  
  - **XLM-R (XLM-Roberta)** – Highest accuracy.  
  - **mBERT (Multilingual BERT)** – Balanced accuracy and efficiency.  
  - **DistilMBERT** – Lightweight and fast for deployment.  
- Fine-tuned with **PyTorch** and **Hugging Face Transformers**.  
- Deployment via **Gradio** UI on **Hugging Face Spaces**.  
- Preprocessing pipeline for cleaning, normalization, and tokenization of Kannada text.  

---

## 📊 Dataset  
- ~120,000 Kannada news headlines collected from **Prajavani, Vijaya Karnataka, Wikipedia**.  
- Cleaned and consolidated into **~60,000 samples** across **10 categories**:  
  - Literature  
  - Technology  
  - Politics  
  - International  
  - Sports  
  - Crime  
  - Economics  
  - Entertainment  
  - Health  
  - Agriculture  

---

## 🧠 Methodology  
1. **Data Preprocessing** – Cleaning text, removing non-Kannada characters, tokenization, balancing dataset.  
2. **Model Training** – Fine-tuning transformer models with learning rate scheduling, AdamW optimizer, dropout, and early stopping.  
3. **Evaluation** – Metrics include Accuracy, Precision, Recall, F1-score.  
4. **Deployment** – Hosted with **Gradio + Hugging Face Spaces**, allowing real-time classification.  

---

## 📈 Results  
| Model        | Accuracy | F1-Score | Precision |  
|--------------|----------|----------|-----------|  
| XLM-R (Fine-tuned) | **85.89%** | **0.8549** | 0.8500 |  
| mBERT (Fine-tuned) | 83.32% | 0.8265 | 0.8288 |  
| DistilMBERT (Fine-tuned) | 82.19% | 0.8154 | 0.8186 |  

---

## 🖥️ Demo  
The project is deployed as a web application where users can:  
- Enter Kannada news headlines.  
- Select a model (XLM-R, mBERT, DistilMBERT).  
- View top 3 predicted categories with confidence scores.  

👉 [Live Demo (Hugging Face Spaces)](https://huggingface.co/spaces/Santhosh737/kannada-news-classifier)
---

## 🛠️ Tech Stack  
- **Languages**: Python  
- **Libraries**: PyTorch, Hugging Face Transformers, IndicNLP  
- **Deployment**: Gradio, Hugging Face Spaces, Docker (optional)  

---

## 📂 Project Structure

```plaintext
Indic-Classify/
│── data/ # Dataset (not included in repo)
│── notebooks/ # Jupyter notebooks for experiments
│── models/ # Fine-tuned models
│── app/ # Gradio app for deployment
│── requirements.txt # Dependencies
│── README.md # Project documentation
```
---

## ⚡ Installation & Usage  

1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/Indic-Classify.git
   cd Indic-Classify

2. Install dependencies:
   ```bash
   pip install -r requirements.txt

3. Run locally with Gradio:
   ```bash
   python app/app.py

---

👥 Contributors

 - [Tejas M Prasad](https://github.com/tejas3000)

 - [S Sarvesh Balaji](https://github.com/sarveshbalaji12) 

 - [Tharun Teja Kethineni](https://github.com/tharuntejak)

 - [Santhosh A](https://github.com/san737)
